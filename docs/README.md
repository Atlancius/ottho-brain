# Ottho Brain — documentation du projet

État au 2026-11-05. Version 1.0.0.

## Objectif

Donner aux élèves de l'Ottho Academy un second cerveau aussi solide que
BrainOS (le cerveau de Jeff), mais construit selon leur façon de ranger, et
branché sur Claude Code et Codex. Demande de Jeff du 2026-11-05.

## Stack

| Élément | Choix | Version |
|---|---|---|
| Moteur | JavaScript ESM sans dépendance | Node ≥ 18 ou Bun (testé Node 24.13.1, Bun 1.3.11) |
| Plugin Claude | `.claude-plugin/plugin.json` + marketplace | validé par `claude plugin validate` (Claude Code 2.1.295) |
| Plugin Codex | `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json` | installé par `codex plugin add` (codex-cli 0.164.0) |
| Gabarits | Markdown avec `{{var}}`, `{{#if}}…{{else}}…{{/if}}` | rendus par `scripts/install.mjs` |

## Architecture

```text
.claude-plugin/marketplace.json        marketplace Claude
.agents/plugins/marketplace.json       marketplace Codex
plugins/ottho-brain/
  .claude-plugin/plugin.json           manifeste Claude (skills/ découvert)
  .codex-plugin/plugin.json            manifeste Codex ("skills": "./skills/")
  skills/installer-cerveau/            questionnaire interactif + références
  skills/reparer-cerveau/              diagnostic, mise à jour, sync, unsync
  scripts/install.mjs                  plan, rendu, installation, mise à jour, inventaire
  engine/brain.mjs                     moteur copié dans chaque cerveau (scripts/brain.mjs)
  templates/brain/                     fichiers du cerveau (_dot_ = ., _drop/ et _sas/ renommés)
  templates/skills/<pack>/             skills installés dans le cerveau
tests/smoke.mjs                        recette de bout en bout (57 contrôles)
```

Fidélité à BrainOS : hub `index.md` borné, routes à responsabilité exclusive,
`--index-<dossier>.md` générés (bloc `brain:children`, prose préservée),
`--instructions.md` par route, `ia/` comme seule source des composants IA et
projections vers les runtimes, Sas + boîte de dépôt C0, classification
C0–C4 fail-closed, ingestion unique, journal append-only signé par HMAC du
manifeste, manifeste de mutation privé et staging exact, hook pre-commit,
corbeille au lieu de `rm`.

Écarts assumés avec BrainOS (voir les décisions) : moteur unique sans
dépendance au lieu du toolchain Bun/TypeScript ; pas de registres machine,
de schémas AJV ni de gate C3 attestable (C3 bloqué d'office) ; recherche BM25
locale avec racinisation légère au lieu du moteur de Jeff.

## Décisions

- [0001 — Moteur sans dépendance](adr/0001-moteur-sans-dependance.md)
- [0002 — Skills installés dans le cerveau](adr/0002-skills-dans-le-cerveau.md)
- [0003 — Trois rôles fixes, noms libres](adr/0003-trois-roles-noms-libres.md)
- [0004 — Bloc géré dans CLAUDE.md et AGENTS.md](adr/0004-bloc-gere-runtimes.md)

## Erreurs et essais

- [Registre des erreurs](erreurs/REGISTRE-ERREURS.md)
- [Registre des essais](essais/REGISTRE-ESSAIS.md), [recettes](essais/RECETTES.md), [anti-recettes](essais/ANTI-RECETTES.md)
- [Journal](JOURNAL.md)

## Reste à faire

- Ajouter le plugin à la marketplace Ottho Academy
  (décision de Jeff).
- Tester une session réelle de bout en bout (questionnaire piloté par un
  humain) dans Claude Code et dans Codex : le chargement du plugin et
  l'installation sont prouvés, pas le dialogue lui-même.
