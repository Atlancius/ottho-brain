---
title: "Commandes — Instructions"
tldr: "Commandes /nom de Claude Code : un fichier .md par commande, copié dans ~/.claude/commands/ par sync. Préférer un skill, partagé avec Codex."
type: instruction
domain: ia
---

# Commandes — Instructions

Une commande est un prompt déclenché à la main par `/nom` dans Claude Code.
Un skill fait la même chose, se déclenche aussi seul quand il est utile, et
marche dans Codex (`$nom`) : préférer un skill pour tout nouveau besoin.

Les commandes rapatriées depuis `~/.claude/commands/` arrivent ici et sont
reprojetées par `node scripts/brain.mjs sync`.
