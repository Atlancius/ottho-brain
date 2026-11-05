# Recettes

## Tester le plugin sans toucher au vrai dossier personnel

1. `OTTHO_BRAIN_HOME=<dossier temporaire>` : le moteur et l'installateur y
   lisent et écrivent `~/.claude`, `~/.agents` et `~/.codex`.
2. `CODEX_HOME=<dossier temporaire>/.codex` pour Codex.
3. `node tests/smoke.mjs` fait les deux et vérifie 57 points.

## Tester l'installation Codex du plugin

`CODEX_HOME=<temp> codex plugin marketplace add "<chemin du dépôt>"`, puis
`codex plugin add ottho-brain@ottho-brain`. L'avertissement « could not create
PATH aliases » sous un dossier temporaire est sans effet.

## Gabarit qui dépend d'un pack

Envelopper le contenu dans `{{#if has.<pack>}}…{{else}}…{{/if}}` : le fichier
existe toujours, son contenu s'adapte (exemple : règle de documentation).
