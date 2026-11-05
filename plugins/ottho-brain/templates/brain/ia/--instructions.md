---
title: "IA — Instructions"
tldr: "ia/ est le plan de contrôle des agents : règles, skills, workflows, agents, commandes. Une seule source canonique, projetée vers Claude et Codex par sync."
type: instruction
domain: ia
---

# IA — Instructions

`ia/` contient uniquement ce que Claude Code ou Codex lisent ou exécutent comme
configuration. Jamais de fait personnel, métier ou de connaissance générale sur
l'IA : ce savoir va dans `{{r.savoir}}/`.

| Dossier | Contenu | Projection |
|---|---|---|
| `rules/core/` | Règles toujours actives (courtes, impératives) | Claude : `~/.claude/rules/{{slug}}/` ; Codex : lues au boot |
| `rules/<thème>/` | Règles chargées à la demande (`paths:` pour Claude) | Claude : copies ; Codex : `ia-search` |
| `skills/<pack>/<nom>/` | Un skill = un dossier avec `SKILL.md` | liens `~/.claude/skills/<nom>` et `~/.agents/skills/<nom>` |
| `skills/importes/` | Skills rapatriés depuis `~/.claude` ou `~/.agents` | idem |
| `workflows/` | Procédures longues chargées une par une | non projetées : `ia-search` |
| `agents/` | Sous-agents Claude (`.md` avec frontmatter) | copies `~/.claude/agents/` |
| `commands/` | Commandes `/nom` Claude | copies `~/.claude/commands/` |
| `registre/` | État d'installation du plugin | jamais chargé en contexte |
| `brain.config.json` | Noms des routes, du Sas, du skill d'ingestion | lu par le moteur |

## Modifier un composant

1. Le trouver : `node scripts/brain.mjs ia-search "<besoin>"`.
2. Éditer **uniquement** son fichier sous `ia/`. `~/.claude`, `~/.agents`,
   `~/.codex`, `CLAUDE.md` et `AGENTS.md` sont des projections : une édition
   directe y est signalée comme dérive par `verify`.
3. `node scripts/brain.mjs build`, puis `node scripts/brain.mjs sync` et
   `node scripts/brain.mjs verify`.
4. Créer un composant : skill `cree-skill`. Ramener des composants existants :
   skill `rapatrie-ia`.

Un skill porte un frontmatter `name` (identique au nom du dossier) et une
`description` de moins de 1024 caractères qui dit quand l'utiliser.
