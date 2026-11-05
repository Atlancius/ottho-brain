---
title: "Opérations courantes"
tldr: "Carte des opérations du cerveau : quel skill pour ingérer, noter, chercher, entretenir, ritualiser, gérer l'IA et les projets."
type: workflow
domain: ia
updated: {{date}}
---

# Opérations courantes

| Besoin | Skill | Moteur sous-jacent |
|---|---|---|
| Ingérer `{{drop.dir}}/`, un dépôt du Sas ou une URL | `{{ingest}}` | `scan`, `url`, `build`, `log`, `stage` |
| Créer ou enrichir une page | `note-ca` | `search`, `id`, `build` |
| Retrouver une information | `cherche-cerveau` | `search`, `context` |
| Régénérer les index après une modification | `maj-index` | `index`, `check` |
| Journaliser une mutation | `ajoute-log` | `manifest`, `hmac`, `log` |
| Auditer le cerveau | `audit-cerveau` | `check`, `stats`, `doctor` |
| Ajouter une route ou un sous-dossier | `nouveau-dossier` | `index`, `check` |
{{#if has.rituels}}| Journal du jour | `journal-du-jour` | `search`, `build` |
| Revue hebdomadaire | `revue-hebdo` | `stats`, `search` |
| Capture rapide | `capture` | — |
| Bilan mensuel | `bilan-mensuel` | `stats`, `check` |
{{/if}}{{#if has.meta}}| Créer un skill, une règle, un agent | `cree-skill` | `build`, `sync` |
| Rapatrier skills et règles existants | `rapatrie-ia` | `import`, `sync` |
| Projeter `ia/` vers Claude et Codex | `sync-ia` | `sync`, `verify` |
| Mesurer l'usage des skills | `usage-ia` | `usage` |
{{/if}}{{#if has.projets}}| Documenter un projet | `doc-projet` | — |
| Créer la fiche d'un projet | `fiche-projet` | `id`, `build` |
| Tenir le portefeuille | `portefeuille` | `search` |
{{/if}}

Fréquence conseillée : `{{ingest}}` dès que `{{drop.dir}}/` se remplit,
`audit-cerveau` une fois par mois, `node scripts/brain.mjs doctor` après une
mise à jour du plugin.
