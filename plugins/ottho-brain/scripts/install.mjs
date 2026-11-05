#!/usr/bin/env node
// Installateur du plugin ottho-brain : déploie un second cerveau à partir des réponses du skill `installer-cerveau`.
//
//   node install.mjs --preview --config <reponses.json>   montre ce qui sera créé, sans rien écrire
//   node install.mjs --config <reponses.json>             installe le cerveau dans config.target
//   node install.mjs --upgrade --root <cerveau>           met à jour moteur et gabarits non modifiés
//
// Zéro dépendance. Node >= 18 ou Bun.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN = path.resolve(HERE, "..");
const TPL = path.join(PLUGIN, "templates");
const ENGINE = path.join(PLUGIN, "engine", "brain.mjs");
const PLUGIN_VERSION = JSON.parse(fs.readFileSync(path.join(PLUGIN, ".claude-plugin", "plugin.json"), "utf8")).version;

const exists = (p) => { try { fs.lstatSync(p); return true; } catch { return false; } };
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");
const toPosix = (p) => p.split(path.sep).join("/");
function today() { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
function die(msg) { console.error(`✗ ${msg}`); process.exit(2); }
function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith("--")) { const k = argv[i].slice(2); o[k] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true; }
  return o;
}
const DIR_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
const slugify = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "cerveau";

// Sous-dossiers imposés : les skills d'écriture en dépendent.
const SAVOIR_CHILDREN = [
  { dir: "sources", label: "Sources", owns: "Une page par source réelle (article, vidéo, documentation, PDF), rangée par thème." },
  { dir: "sujets", label: "Sujets", owns: "Connaissance durable et sourcée, rangée par thème." },
  { dir: "modeles", label: "Modèles", owns: "Modèles mentaux, frameworks et patterns réutilisables." },
  { dir: "pratiques", label: "Pratiques", owns: "Procédures pas à pas vérifiées et réutilisables." },
  { dir: "references", label: "Références", owns: "Fiches de personnes publiques, organisations et outils de référence.", children: [
    { dir: "personnes", label: "Personnes", owns: "Personnes publiques de référence." },
    { dir: "organisations", label: "Organisations", owns: "Organisations publiques de référence." },
    { dir: "outils", label: "Outils", owns: "Outils et logiciels réutilisables." },
  ] },
  { dir: "decisions", label: "Décisions", owns: "Décisions méthodologiques ou techniques réutilisables, au format ADR." },
  { dir: "syntheses", label: "Synthèses", owns: "Croisements d'au moins trois pages qui produisent un insight nouveau." },
];
const SAS_TREE = [
  ["arrivees", "Arrivées", "Dépôts à conserver : export, formation, gros PDF. Contenu non fiable, jamais lu hors du skill d'ingestion."],
  ["candidats", "Candidats", "Éléments sûrs dont droits, provenance ou destination restent à trancher."],
  ["candidats/a-classer", "À classer", "Éléments en attente d'une décision de destination."],
  ["quarantaine", "Quarantaine", "Éléments isolés selon la raison du blocage, en attente d'une revue humaine."],
  ["quarantaine/securite", "Sécurité", "Bloqués pour une raison de sécurité."],
  ["quarantaine/droits", "Droits", "Bloqués faute de droits établis."],
  ["quarantaine/classement", "Classement", "Bloqués faute de destination certaine."],
  ["archives", "Archives", "Originaux déjà ingérés, conservés localement, jamais supprimés."],
];
const PACKS = { coeur: "cerveau", rituels: "rituels", meta: "meta-ia", projets: "projets" };

// ---------------------------------------------------------------------------
// Validation et normalisation de la configuration
// ---------------------------------------------------------------------------

function normalize(raw) {
  const c = structuredClone(raw);
  for (const k of ["name", "owner", "target"]) if (!c[k]) die(`Réponse manquante : ${k}`);
  c.slug = c.slug ? slugify(c.slug) : slugify(c.name);
  c.created = c.created || today();
  c.version = 1;
  c.plugin_version = PLUGIN_VERSION;
  c.ia = { dir: "ia" };
  c.drop = { dir: (c.drop && c.drop.dir) || "raw", label: (c.drop && c.drop.label) || "Boîte de dépôt" };
  c.sas = { dir: (c.sas && c.sas.dir) || "sas", label: (c.sas && c.sas.label) || "Le Sas" };
  c.ingest_skill = slugify(c.ingest_skill || "bouffe-tout");
  c.packs = c.packs && c.packs.length ? c.packs : Object.keys(PACKS);
  if (!c.packs.includes("coeur")) c.packs.unshift("coeur");
  c.runtimes = { claude: true, codex: true, claude_rules_copy: true, ...(c.runtimes || {}) };
  c.git = { enabled: true, commit_init: true, ...(c.git || {}) };
  c.pii_allow = c.pii_allow || [];
  c.domains = (c.domains || []).map((d) => ({ ...d, dir: slugify(d.dir), children: (d.children || []).map((ch) => ({ ...ch, dir: slugify(ch.dir) })) }));
  for (const role of ["perso", "pro", "savoir"]) if (!c.domains.some((d) => d.role === role)) die(`Il faut un domaine de rôle « ${role} » (son nom est libre).`);
  const reserved = new Set(["ia", "scripts", "node_modules", c.drop.dir, c.sas.dir]);
  const dirs = new Set();
  for (const d of c.domains) {
    if (!DIR_RE.test(d.dir)) die(`Nom de dossier invalide : ${d.dir}`);
    if (reserved.has(d.dir) || dirs.has(d.dir)) die(`Nom de dossier en conflit : ${d.dir}`);
    dirs.add(d.dir);
    if (!d.label || !d.owns) die(`Le domaine ${d.dir} doit avoir un libellé et une responsabilité (owns).`);
  }
  for (const n of [c.drop.dir, c.sas.dir]) if (!DIR_RE.test(n)) die(`Nom de dossier invalide : ${n}`);
  if (c.drop.dir === c.sas.dir) die("La boîte de dépôt et le Sas doivent avoir des noms différents.");
  // Sous-dossiers imposés par les skills.
  const sav = c.domains.find((d) => d.role === "savoir");
  for (const ch of SAVOIR_CHILDREN) if (!sav.children.some((x) => x.dir === ch.dir)) sav.children.push(structuredClone(ch));
  const perso = c.domains.find((d) => d.role === "perso");
  const pro = c.domains.find((d) => d.role === "pro");
  const ensure = (dom, child) => { if (!dom.children.some((x) => x.dir === child.dir)) dom.children.push(child); };
  ensure(perso, { dir: "identite", label: "Identité", owns: `Qui est ${c.owner} : profil, parcours public, façon de travailler.` });
  if (c.packs.includes("rituels")) {
    ensure(perso, { dir: "journal", label: "Journal", owns: "Journal quotidien : une page par jour, rangée par année." });
    ensure(perso, { dir: "revues", label: "Revues", owns: "Revues hebdomadaires et bilans mensuels." });
  }
  if (c.packs.includes("projets")) ensure(pro, { dir: "projets", label: "Projets", owns: "Une fiche par projet et le portefeuille courant." });
  c.routes = {
    perso: perso.dir, pro: pro.dir, savoir: sav.dir,
    journal: `${perso.dir}/journal`, revues: `${perso.dir}/revues`, identite: `${perso.dir}/identite`,
    projets: `${pro.dir}/projets`, portefeuille: `${pro.dir}/projets/portefeuille.md`,
  };
  return c;
}

// ---------------------------------------------------------------------------
// Rendu des gabarits : {{var}}, {{#if var}}…{{else}}…{{/if}}, {{#unless var}}…{{/unless}}
// ---------------------------------------------------------------------------

function vars(c) {
  const lab = (role) => c.domains.find((d) => d.role === role).label;
  return {
    ...c,
    date: today(),
    ROUTES: "<!-- brain:routes:start -->\n<!-- brain:routes:end -->",
    engine: "node scripts/brain.mjs",
    ingest: c.ingest_skill,
    r: c.routes,
    label: { perso: lab("perso"), pro: lab("pro"), savoir: lab("savoir") },
    has: Object.fromEntries(Object.keys(PACKS).map((p) => [p, c.packs.includes(p)])),
    communication_rules: (c.communication && c.communication.rules && c.communication.rules.length ? c.communication.rules : ["Ton direct, phrases courtes, pas de formule creuse.", "Aller droit au livrable ; expliquer ensuite si utile.", "Poser une ou deux questions ciblées si le contexte est ambigu."]).map((r) => `- ${r}`).join("\n"),
    language: (c.communication && c.communication.language) || "français",
    address: c.tutoiement === false ? "vouvoiement" : "tutoiement",
    extra_domains: c.domains.filter((d) => !["perso", "pro", "savoir"].includes(d.role)).map((d) => `- \`${d.dir}/\` (${d.label}) : ${d.owns}`).join("\n") || "- Aucune.",
    profile_lines: Object.entries(c.profile || {}).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `- **${k}** : ${Array.isArray(v) ? v.join(", ") : v}`).join("\n") || "- À compléter.",
  };
}
function get(o, p) { return p.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o); }
export function render(text, V) {
  let out = text;
  for (let guard = 0; guard < 50; guard++) {
    const next = out.replace(/\{\{#(if|unless) ([\w.]+)\}\}((?:(?!\{\{#(?:if|unless) )[\s\S])*?)\{\{\/\1\}\}/g, (_, kind, key, inner) => {
      const [yes, no = ""] = inner.split("{{else}}");
      const v = get(V, key);
      const truthy = Array.isArray(v) ? v.length > 0 : !!v;
      return (kind === "if" ? truthy : !truthy) ? yes : no;
    });
    if (next === out) break;
    out = next;
  }
  return out.replace(/\{\{([\w.]+)\}\}/g, (m, key) => { const v = get(V, key); return v === undefined ? m : String(v); });
}
const TEXT_EXT = /\.(md|json|txt|yaml|yml|toml|gitignore|mjs|sh)$|(^|\/)(pre-commit|\.gitignore|\.gitattributes)$/;

// ---------------------------------------------------------------------------
// Plan d'installation : liste exacte des fichiers à produire
// ---------------------------------------------------------------------------

function listTemplateFiles(base) {
  const out = [];
  const visit = (abs, rel) => {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      if (ent.isDirectory()) visit(path.join(abs, ent.name), r); else out.push(r);
    }
  };
  if (exists(base)) visit(base, "");
  return out;
}

function domainInstructions(c, d) {
  const sub = (d.children || []).map((ch) => `| \`${ch.dir}/\` | ${ch.owns || "À décrire."} |`).join("\n");
  return `---
title: "${d.label} — Instructions"
tldr: "Ce qui appartient à ${d.label} (\`${d.dir}/\`), ce qui n'y appartient pas, et comment y ranger une page."
type: instruction
domain: ${d.dir}
---

# ${d.label} — Instructions

**Appartient ici :** ${d.owns}

**N'appartient pas ici :** ${d.not || "tout ce qui relève d'une autre route du hub."}

| Sous-dossier | Responsabilité |
|---|---|
${sub || "| — | Aucun sous-dossier imposé. |"}

- Une information n'a qu'un emplacement canonique : les autres pages y renvoient par lien.
- Seul un contenu classé \`C4_INTERNAL_STANDARD\` est écrit ici. Jamais de secret, coordonnée privée, montant réel ni donnée de santé.
- Créer ou enrichir une page avec le skill \`note-ca\`. Un nouveau sous-dossier passe par le skill \`nouveau-dossier\`.
- Les blocs \`brain:children\` des index sont générés : ne jamais les éditer à la main.
`;
}

function profilePage(c) {
  return `---
title: "${c.owner} — Profil"
tldr: "Qui est ${c.owner}, ce que ce cerveau doit l'aider à faire, et comment travailler avec ${c.owner}."
type: entity
canonical_id: "bno_${crypto.randomBytes(12).toString("hex")}"
domain: ${c.routes.perso}
entity_type: person
tags: [profil]
created: ${c.created}
updated: ${c.created}
classification: C4_INTERNAL_STANDARD
status: active
retrieval: included
---

# ${c.owner} — Profil

## Résumé

Profil de départ, écrit à l'installation du cerveau à partir des réponses de ${c.owner}. À enrichir avec le skill \`note-ca\`.

## Faits déclarés

${vars(c).profile_lines}

## Connexions

- [Index de l'identité](--index-identite.md) — dossier parent.
`;
}

export function plan(c) {
  const V = vars(c);
  const files = new Map(); // relpath → contenu (string | Buffer)
  const dirs = new Set();
  const addDir = (d) => dirs.add(d);
  for (const rel of listTemplateFiles(path.join(TPL, "brain"))) {
    let target = rel.replace(/^_drop\//, `${c.drop.dir}/`).replace(/^_sas\//, `${c.sas.dir}/`).replace(/^_dot_/, ".").replace(/\/_dot_/g, "/.");
    const raw = fs.readFileSync(path.join(TPL, "brain", rel));
    files.set(target, TEXT_EXT.test(target) || target.endsWith("pre-commit") ? render(raw.toString("utf8"), V) : raw);
  }
  files.set("scripts/brain.mjs", fs.readFileSync(ENGINE));
  for (const pack of c.packs) {
    const base = path.join(TPL, "skills", pack);
    for (const rel of listTemplateFiles(base)) {
      let r = rel;
      if (r.startsWith("ingest/")) r = `${c.ingest_skill}/` + r.slice("ingest/".length);
      const target = `ia/skills/${PACKS[pack]}/${r}`;
      const raw = fs.readFileSync(path.join(base, rel));
      files.set(target, TEXT_EXT.test(target) ? render(raw.toString("utf8"), V) : raw);
    }
  }
  const visitDom = (d, prefix) => {
    const p = prefix ? `${prefix}/${d.dir}` : d.dir;
    addDir(p);
    for (const ch of d.children || []) visitDom(ch, p);
  };
  for (const d of c.domains) { visitDom(d, ""); files.set(`${d.dir}/--instructions.md`, domainInstructions(c, d)); }
  files.set(`${c.routes.identite}/profil.md`, profilePage(c));
  for (const [sub] of SAS_TREE) { addDir(`${c.sas.dir}/${sub}`); files.set(`${c.sas.dir}/${sub}/.gitkeep`, ""); }
  for (const d of ["ia/agents", "ia/commands", "ia/workflows", "ia/registre", c.drop.dir]) addDir(d);
  if (c.obsidian) {
    files.set(".obsidian/app.json", JSON.stringify({
      userIgnoreFilters: [".local/", ".trash/", "scripts/", "ia/registre/", `${c.sas.dir}/arrivees/`, `${c.sas.dir}/quarantaine/`, `${c.sas.dir}/archives/`],
      newLinkFormat: "relative", useMarkdownLinks: true, alwaysUpdateLinks: true, attachmentFolderPath: "./assets",
    }, null, 2) + "\n");
  }
  const cfgOut = { ...c }; delete cfgOut.target;
  files.set("ia/brain.config.json", JSON.stringify(cfgOut, null, 2) + "\n");
  return { files, dirs };
}

// ---------------------------------------------------------------------------
// Installation
// ---------------------------------------------------------------------------

function run(cmd, a, cwd) { const r = spawnSync(cmd, a, { cwd, encoding: "utf8" }); return { code: r.status ?? 1, out: (r.stdout || "").trim(), err: (r.stderr || "").trim() }; }

async function engine() { return import(new URL(`file://${toPosix(ENGINE).replace(/^([A-Za-z]):/, "/$1:")}`).href); }

async function install(c, { preview }) {
  const root = path.resolve(c.target);
  const { files, dirs } = plan(c);
  if (preview) {
    console.log(`Cerveau « ${c.name} » → ${toPosix(root)}`);
    console.log(`Dossiers (${dirs.size}) :`);
    for (const d of [...dirs].sort()) console.log(`  ${d}/`);
    console.log(`Fichiers (${files.size}) dont skills : ${[...files.keys()].filter((f) => f.endsWith("SKILL.md")).map((f) => f.split("/").at(-2)).join(", ")}`);
    return;
  }
  if (exists(root) && fs.readdirSync(root).filter((x) => !x.startsWith(".")).length) {
    if (exists(path.join(root, "ia", "brain.config.json"))) die("Un cerveau existe déjà ici : utiliser le skill reparer-cerveau (mode mise à jour).");
    if (!c.adopt) die(`Le dossier ${toPosix(root)} n'est pas vide. Choisir un dossier vide, ou confirmer l'adoption (adopt: true) : les fichiers existants restent en place, hors du cerveau.`);
    for (const f of files.keys()) if (exists(path.join(root, f))) die(`Conflit : ${f} existe déjà dans le dossier adopté.`);
  }
  fs.mkdirSync(root, { recursive: true });
  for (const d of dirs) fs.mkdirSync(path.join(root, d), { recursive: true });
  const record = {};
  for (const [rel, content] of files) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
    if (!rel.startsWith(c.drop.dir + "/") && !rel.endsWith(".gitkeep")) record[rel] = sha256(Buffer.isBuffer(content) ? content : Buffer.from(content));
  }
  try { fs.chmodSync(path.join(root, ".githooks", "pre-commit"), 0o755); } catch { /* Windows */ }
  for (const d of [".local/private/staging", ".local/state", ".local/backups", ".trash"]) fs.mkdirSync(path.join(root, d), { recursive: true });
  fs.writeFileSync(path.join(root, "ia", "registre", "installation.json"), JSON.stringify({ plugin_version: PLUGIN_VERSION, installed: today(), files: record }, null, 2) + "\n");

  const E = await engine();
  const cfg = JSON.parse(fs.readFileSync(path.join(root, "ia", "brain.config.json"), "utf8"));
  cfg.ia = { dir: "ia" };
  E.sync(root, cfg, { home: false }); // pointeurs locaux CLAUDE.md et AGENTS.md
  E.buildIndexes(root, cfg);

  const summary = { root: toPosix(root), files: files.size, git: "désactivé", commit: null, checks: null };
  if (c.git.enabled) {
    if (!exists(path.join(root, ".git"))) run("git", ["init", "-q", "-b", "main"], root);
    run("git", ["config", "core.hooksPath", ".githooks"], root);
    run("git", ["config", "core.quotepath", "false"], root);
    summary.git = "initialisé";
  }
  // Journal : premier événement, signé par le HMAC du manifeste d'installation.
  const id = `evt_installation_${today().replace(/-/g, "")}`;
  const mfDir = path.join(root, ".local", "private", "staging");
  const mf = path.join(mfDir, `${id}.json`);
  const created = listTemplateFiles(root).filter((f) => !/^(\.git|\.local|\.trash)\//.test(f) && !f.startsWith(c.drop.dir + "/") && !(f.startsWith(c.sas.dir + "/") && !/(--index-|--instructions|\.gitkeep)/.test(f)));
  fs.writeFileSync(mf, JSON.stringify({ event_id: id, created, modified: ["log.md"], deleted: [], moved: [] }, null, 2) + "\n");
  E.appendLog(root, cfg, { type: "init", id, title: "Installation du second cerveau", manifest: mf, actor: "ottho-brain", body: `Cerveau installé par le plugin ottho-brain ${PLUGIN_VERSION} : ${c.domains.length} routes de connaissance, IA et ${c.sas.label}, ${c.packs.length} packs de skills.` });
  E.buildIndexes(root, cfg);
  // index.md est complété par le moteur (tableau des routes) : on enregistre sa forme générée.
  record["index.md"] = sha256(fs.readFileSync(path.join(root, "index.md")));
  fs.writeFileSync(path.join(root, "ia", "registre", "installation.json"), JSON.stringify({ plugin_version: PLUGIN_VERSION, installed: today(), files: record }, null, 2) + "\n");
  const issues = E.runCheck(root, cfg).filter((i) => i.level === "error");
  summary.checks = issues.length ? issues.map((i) => `${i.path} — ${i.msg}`) : "OK";
  if (c.git.enabled && c.git.commit_init && !issues.length) {
    const name = run("git", ["config", "user.name"], root).out, email = run("git", ["config", "user.email"], root).out;
    if (name && email) {
      run("git", ["add", "-A"], root);
      const r = run("git", ["commit", "-q", "-m", "feat: installer le second cerveau"], root);
      summary.commit = r.code === 0 ? run("git", ["rev-parse", "--short", "HEAD"], root).out : `échec : ${r.err.split("\n").slice(-3).join(" ")}`;
    } else summary.commit = "non fait : identité Git absente (git config --global user.name / user.email)";
  }
  console.log(JSON.stringify(summary, null, 2));
}

// ---------------------------------------------------------------------------
// Mise à jour : moteur et gabarits que l'utilisateur n'a pas modifiés
// ---------------------------------------------------------------------------

async function upgrade(rootArg, { dryRun }) {
  const root = path.resolve(rootArg);
  const cfgPath = path.join(root, "ia", "brain.config.json");
  if (!exists(cfgPath)) die("Pas de cerveau ici (ia/brain.config.json absent).");
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const regPath = path.join(root, "ia", "registre", "installation.json");
  const reg = exists(regPath) ? JSON.parse(fs.readFileSync(regPath, "utf8")) : { files: {} };
  const c = normalize({ ...cfg, target: root });
  c.created = cfg.created;
  const { files } = plan(c);
  const report = { updated: [], created: [], kept: [], from: reg.plugin_version, to: PLUGIN_VERSION };
  for (const [rel, content] of files) {
    if (rel.startsWith(c.drop.dir + "/") || rel === "ia/brain.config.json" || rel === "log.md" || rel.endsWith("/profil.md") || rel.endsWith(".gitkeep")) continue;
    const abs = path.join(root, rel);
    let buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
    if (rel === "index.md" && exists(abs)) {
      // Comparer à forme égale : le bloc des routes est rempli par le moteur.
      const cur = fs.readFileSync(abs, "utf8");
      const m = cur.match(/<!-- brain:routes:start -->[\s\S]*?<!-- brain:routes:end -->/);
      if (m) buf = Buffer.from(buf.toString("utf8").replace(/<!-- brain:routes:start -->[\s\S]*?<!-- brain:routes:end -->/, () => m[0]));
    }
    const next = sha256(buf);
    if (!exists(abs)) { report.created.push(rel); if (!dryRun) { fs.mkdirSync(path.dirname(abs), { recursive: true }); fs.writeFileSync(abs, buf); reg.files[rel] = next; } continue; }
    const cur = sha256(fs.readFileSync(abs));
    if (cur === next) { reg.files[rel] = next; continue; }
    if (reg.files[rel] && reg.files[rel] === cur) { report.updated.push(rel); if (!dryRun) { fs.writeFileSync(abs, buf); reg.files[rel] = next; } }
    else report.kept.push(rel);
  }
  if (!dryRun) {
    const cfgNext = { ...cfg, plugin_version: PLUGIN_VERSION };
    fs.writeFileSync(cfgPath, JSON.stringify(cfgNext, null, 2) + "\n");
    reg.plugin_version = PLUGIN_VERSION; reg.upgraded = today();
    fs.writeFileSync(regPath, JSON.stringify(reg, null, 2) + "\n");
    const E = await engine();
    E.buildIndexes(root, { ...cfgNext, ia: { dir: "ia" } });
  }
  console.log(JSON.stringify(report, null, 2));
}

async function inventory() {
  const E = await engine();
  const os = await import("node:os");
  const items = E.importInventory(path.join(os.tmpdir(), "ottho-brain-sans-cerveau"), { slug: "__aucun__", ia: { dir: "ia" } });
  const by = (k) => items.filter((i) => i.kind === k);
  const out = { skills: by("skill").length, agents: by("agent").length, commandes: by("command").length, regles: by("rule").length, liens_externes: items.filter((i) => i.external_link).length, details: items.map((i) => ({ type: i.kind, nom: i.name, runtimes: i.runtimes, lien_externe: i.external_link })) };
  console.log(JSON.stringify(out, null, 2));
}

const a = args(process.argv.slice(2));
if (a.inventory) await inventory();
else if (a.upgrade) await upgrade(a.root || die("--root requis"), { dryRun: !!a["dry-run"] });
else if (a.config) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(a.config), "utf8"));
  await install(normalize(raw), { preview: !!a.preview });
} else {
  console.log("Usage : node install.mjs --preview --config <reponses.json> | --config <reponses.json> | --upgrade --root <cerveau> [--dry-run]");
  process.exit(1);
}
