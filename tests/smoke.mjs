#!/usr/bin/env node
// Recette de bout en bout du plugin ottho-brain, sans toucher au vrai dossier personnel.
//   node tests/smoke.mjs
// Installe deux cerveaux dans un dossier temporaire, avec un faux HOME, et vérifie :
// installation, index, hub, Git + hook, sync Claude/Codex, rapatriement, contrat de mutation,
// scan d'ingestion, Sas hors Git, blocage d'un secret, journal append-only, URL, recherche,
// corbeille, mise à jour et désinstallation.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = path.join(REPO, "plugins", "ottho-brain");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "ottho-brain-smoke-"));
const HOME = path.join(TMP, "home");
const env = { ...process.env, OTTHO_BRAIN_HOME: HOME, CODEX_HOME: path.join(HOME, ".codex"), NO_COLOR: "1",
  GIT_AUTHOR_NAME: "Smoke", GIT_AUTHOR_EMAIL: "smoke@example.com", GIT_COMMITTER_NAME: "Smoke", GIT_COMMITTER_EMAIL: "smoke@example.com" };
let failures = 0, passes = 0;

function run(cmd, args, cwd, ok = [0]) {
  const r = spawnSync(cmd, args, { cwd, env, encoding: "utf8" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}
function expect(name, cond, detail = "") {
  if (cond) { passes++; console.log(`  ok  ${name}`); }
  else { failures++; console.log(`  KO  ${name}${detail ? `\n      ${detail.split("\n").slice(-6).join("\n      ")}` : ""}`); }
}
const brain = (root, ...a) => run("node", ["scripts/brain.mjs", ...a], root);
const w = (p, s) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

// Faux HOME avec des composants existants à rapatrier.
w(path.join(HOME, ".claude", "skills", "mon-skill", "SKILL.md"), "---\nname: mon-skill\ndescription: Skill perso de test.\n---\n# Mon skill\n");
w(path.join(HOME, ".agents", "skills", "mon-skill", "SKILL.md"), "---\nname: mon-skill\ndescription: Skill perso de test.\n---\n# Mon skill\n");
w(path.join(HOME, ".claude", "CLAUDE.md"), "# Mes consignes perso\n\nToujours répondre en français.\n");
w(path.join(HOME, ".codex", "AGENTS.md"), "# Codex perso\n");
w(path.join(HOME, ".claude", "skills", "note-ca", "SKILL.md"), "---\nname: note-ca\ndescription: Skill homonyme préexistant.\n---\n# Homonyme\n");
w(path.join(HOME, ".claude", "rules", "style.md"), "---\ntitle: Style\n---\nPas d'emoji.\n");
w(path.join(HOME, ".claude", "agents", "relecteur.md"), "---\nname: relecteur\ndescription: relit\n---\nRelis.\n");

console.log(`Dossier de test : ${TMP}\n\n[1] Installation complète`);
const A = path.join(TMP, "cerveau");
w(path.join(TMP, "a.json"), JSON.stringify({
  name: "Cerveau de Léa", owner: "Léa", target: A, tutoiement: true, obsidian: true, ingest_skill: "bouffe-tout",
  drop: { dir: "a-ingerer" }, sas: { dir: "sas", label: "Le Sas" },
  domains: [
    { role: "perso", dir: "perso", label: "Perso", owns: "Léa à titre personnel.", not: "Activité.", children: [{ dir: "preferences", label: "Préférences", owns: "Goûts." }] },
    { role: "pro", dir: "pro", label: "Pro", owns: "Activité freelance.", not: "Vie privée.", children: [{ dir: "clients", label: "Clients", owns: "Fiches assainies." }] },
    { role: "savoir", dir: "savoir", label: "Savoir", owns: "Connaissance durable.", not: "Faits sur Léa." },
  ],
  profile: { usage: "freelance design" }, communication: { rules: ["Réponses courtes."] },
}));
let r = run("node", [path.join(PLUGIN, "scripts", "install.mjs"), "--inventory"], REPO);
expect("inventaire avant installation", /"skills": 2/.test(r.out) && /"regles": 1/.test(r.out), r.out);
r = run("node", [path.join(PLUGIN, "scripts", "install.mjs"), "--config", path.join(TMP, "a.json")], REPO);
expect("installation sans erreur", r.code === 0 && /"checks": "OK"/.test(r.out), r.out);
expect("commit initial", /"commit": "[0-9a-f]{7}/.test(r.out), r.out);
for (const f of ["index.md", "CLAUDE.md", "AGENTS.md", "scripts/brain.mjs", ".githooks/pre-commit", "ia/skills/cerveau/bouffe-tout/SKILL.md", "ia/skills/meta-ia/rapatrie-ia/SKILL.md", "savoir/sources/--index-sources.md", "sas/quarantaine/securite/--index-securite.md", "perso/identite/profil.md"]) expect(`fichier ${f}`, fs.existsSync(path.join(A, f)));
const hub = fs.readFileSync(path.join(A, "index.md"), "utf8");
expect("hub : tableau des routes rempli", /\[`savoir\/`\]\(savoir\/--index-savoir\.md\)/.test(hub));
const leftovers = run("git", ["grep", "-n", "{{", "--", ".", ":!scripts"], A).out.trim();
expect("aucune variable non rendue", !leftovers, leftovers);
expect("arbre propre après installation", run("git", ["status", "--porcelain"], A).out.trim() === "", run("git", ["status", "--porcelain"], A).out);
expect("doctor (hors projections)", /contrôles du cerveau/.test(brain(A, "doctor").out));

console.log("\n[2] Branchement Claude et Codex");
r = brain(A, "sync");
expect("sync : seul le conflit attendu", (r.out.match(/conflit/g) || []).length === 1, r.out);
const claudeMd = fs.readFileSync(path.join(HOME, ".claude", "CLAUDE.md"), "utf8");
expect("bloc géré en tête de CLAUDE.md", claudeMd.startsWith("<!-- ottho-brain:cerveau-de-lea:start"));
expect("contenu de la personne conservé", claudeMd.includes("Toujours répondre en français."));
expect("bloc géré dans AGENTS.md de Codex", fs.readFileSync(path.join(HOME, ".codex", "AGENTS.md"), "utf8").includes("ottho-brain:cerveau-de-lea:start"));
expect("lien skill Claude", fs.existsSync(path.join(HOME, ".claude", "skills", "bouffe-tout", "SKILL.md")));
expect("lien skill Codex", fs.existsSync(path.join(HOME, ".agents", "skills", "bouffe-tout", "SKILL.md")));
expect("règles copiées pour Claude", fs.existsSync(path.join(HOME, ".claude", "rules", "cerveau-de-lea", "core", "securite.md")));
expect("conflit de nom jamais écrasé", /note-ca existe déjà/.test(r.out) && fs.readFileSync(path.join(HOME, ".claude", "skills", "note-ca", "SKILL.md"), "utf8").includes("Homonyme"), r.out);
expect("verify signale le skill non projeté", /note-ca ne pointe pas/.test(brain(A, "verify").out));

console.log("\n[3] Rapatriement et contrat de mutation");
r = brain(A, "import", "--apply");
expect("rapatriement de 3 composants, homonyme laissé", (r.out.match(/rapatrié/g) || []).length === 3 && /note-ca : un skill du même nom/.test(r.out), r.out);
expect("skill rapatrié dans ia/", fs.existsSync(path.join(A, "ia", "skills", "importes", "mon-skill", "SKILL.md")));
brain(A, "sync");
expect("skill rapatrié reprojeté", fs.existsSync(path.join(HOME, ".claude", "skills", "mon-skill", "SKILL.md")));
expect("build", brain(A, "build").code === 0, brain(A, "build").out);
const id = "evt_import_20260101";
const mf = brain(A, "manifest", "init", id).out.trim();
const m = JSON.parse(fs.readFileSync(path.join(A, mf), "utf8"));
for (const l of run("git", ["status", "--porcelain=v1", "-uall"], A).out.split("\n").filter(Boolean)) {
  const p = l.slice(3); if (l.startsWith("??")) m.created.push(p); else if (!m.modified.includes(p)) m.modified.push(p);
}
fs.writeFileSync(path.join(A, mf), JSON.stringify(m));
expect("journal signé", /journalisé/.test(brain(A, "log", "--type", "import", "--id", id, "--title", "Rapatriement de test", "--manifest", mf, "--body", "Trois composants.").out));
expect("staging exact", brain(A, "stage", "--manifest", mf).code === 0);
expect("commit avec hook", run("git", ["commit", "-q", "-m", "feat(ia): rapatrier"], A).code === 0);
expect("HMAC dans le journal", /manifest_hmac":"hmac-sha256:[0-9a-f]{64}/.test(fs.readFileSync(path.join(A, "log.md"), "utf8")));

console.log("\n[4] Sécurité de l'ingestion");
const D = path.join(A, "a-ingerer");
w(path.join(D, "clip.md"), "---\ntitle: A\nsource: https://youtube.com/watch?v=x\n---\nCorps\n");
w(path.join(D, "faux.pdf"), "pas un pdf");
w(path.join(D, "a.zip"), "PK\u0003\u0004xx");
w(path.join(D, "x.js"), "alert(1)");
w(path.join(D, "vide.txt"), "");
r = brain(A, "scan");
expect("clipping YouTube reconnu", /ok\s+a-ingerer\/clip\.md\s+\[youtube\]/.test(r.out), r.out);
expect("faux PDF bloqué", /bloqué\s+a-ingerer\/faux\.pdf/.test(r.out));
expect("archive bloquée", /bloqué\s+a-ingerer\/a\.zip/.test(r.out));
expect("script bloqué", /bloqué\s+a-ingerer\/x\.js/.test(r.out));
expect("fichier vide bloqué", /bloqué\s+a-ingerer\/vide\.txt/.test(r.out));
expect("archives du Sas refusées", brain(A, "scan", "sas/archives").code !== 0);
w(path.join(A, "sas", "arrivees", "export.md"), "contenu");
expect("dépôts hors Git", run("git", ["status", "--porcelain"], A).out.trim() === "", run("git", ["status", "--porcelain"], A).out);
w(path.join(A, "savoir", "fuite.md"), "---\ntitle: F\ntldr: f\ntype: note\ncanonical_id: \"bno_bbbbbbbbbbbbbbbbbbbbbbbb\"\ndomain: savoir\nclassification: C4_INTERNAL_STANDARD\n---\nclé " + "AKIA" + "ABCDEFGHIJKLMNOP" + "\n");
brain(A, "index");
run("git", ["add", "savoir/fuite.md", "savoir/--index-savoir.md"], A);
expect("commit d'un secret bloqué par le hook", run("git", ["commit", "-q", "-m", "test"], A).code !== 0);
run("git", ["reset", "-q"], A);
brain(A, "trash", "savoir/fuite.md");
brain(A, "index");
expect("corbeille au lieu de rm", fs.existsSync(path.join(A, ".trash")) && !fs.existsSync(path.join(A, "savoir", "fuite.md")));
const log = path.join(A, "log.md");
const before = fs.readFileSync(log, "utf8");
fs.writeFileSync(log, before.replace("Rapatriement de test", "Rapatriement modifié"));
expect("journal réécrit détecté", /append-only/.test(brain(A, "check").out));
fs.writeFileSync(log, before);
expect("URL : tracking retiré", brain(A, "url", "https://ex.com/a?utm_source=x&id=3#f").out.trim() === "https://ex.com/a?id=3");
expect("URL : token refusé", brain(A, "url", "https://ex.com/a?token=abc").code !== 0);
expect("URL : IP refusée", brain(A, "url", "http://10.0.0.1/").code !== 0);

console.log("\n[5] Recherche");
expect("search trouve le profil", /perso\/identite\/profil\.md/.test(brain(A, "search", "profil").out));
expect("ia-search trouve le skill d'ingestion", /bouffe-tout\/SKILL\.md/.test(brain(A, "ia-search", "ingérer un pdf", "--limit", "3").out));
expect("ia-search trouve le journal", /journal-du-jour\/SKILL\.md/.test(brain(A, "ia-search", "journal du jour", "--limit", "1").out));

console.log("\n[6] Mise à jour, désinstallation, second cerveau personnalisé");
r = run("node", [path.join(PLUGIN, "scripts", "install.mjs"), "--upgrade", "--root", A, "--dry-run"], REPO);
expect("mise à jour à blanc : rien d'écrasé", /"kept": \[\]/.test(r.out), r.out);
r = brain(A, "unsync");
expect("unsync retire le bloc", !fs.readFileSync(path.join(HOME, ".claude", "CLAUDE.md"), "utf8").includes("ottho-brain:"));
expect("unsync rend le CLAUDE.md d'origine", fs.readFileSync(path.join(HOME, ".claude", "CLAUDE.md"), "utf8").startsWith("# Mes consignes perso"));
const B = path.join(TMP, "brain2");
w(path.join(TMP, "b.json"), JSON.stringify({
  name: "Cerveau de Tom", owner: "Tom", target: B, tutoiement: false, ingest_skill: "digere", packs: ["coeur", "rituels"],
  drop: { dir: "inbox" }, sas: { dir: "entree", label: "L'Entrée" }, runtimes: { claude: true, codex: false },
  domains: [
    { role: "perso", dir: "moi", label: "Moi", owns: "Tom." },
    { role: "pro", dir: "etudes", label: "Études", owns: "Cours et stages." },
    { role: "savoir", dir: "connaissances", label: "Connaissances", owns: "Savoir sourcé." },
  ],
}));
r = run("node", [path.join(PLUGIN, "scripts", "install.mjs"), "--config", path.join(TMP, "b.json")], REPO);
expect("cerveau personnalisé installé", /"checks": "OK"/.test(r.out), r.out);
expect("skill d'ingestion renommé", fs.existsSync(path.join(B, "ia", "skills", "cerveau", "digere", "SKILL.md")));
expect("pack projets absent", !fs.existsSync(path.join(B, "ia", "skills", "projets")));
expect("vouvoiement appliqué", fs.readFileSync(path.join(B, "ia", "rules", "core", "communication.md"), "utf8").includes("vouvoiement"));

console.log(`\n${passes} ok, ${failures} échec(s). Dossier de test : ${TMP}`);
process.exit(failures ? 1 : 0);
