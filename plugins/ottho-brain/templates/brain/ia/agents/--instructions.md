---
title: "Agents — Instructions"
tldr: "Sous-agents Claude Code canoniques : un fichier .md par agent, copié dans ~/.claude/agents/ par sync."
type: instruction
domain: ia
---

# Agents — Instructions

Un agent = un fichier `<nom>.md` avec un frontmatter Claude Code :

```markdown
---
name: chercheur
description: Quand déléguer à cet agent, en une phrase.
tools: Read, Grep, Glob, WebSearch
---

Consignes de l'agent : rôle, sortie attendue, critère d'arrêt.
```

Créer avec le skill `cree-skill`, puis `node scripts/brain.mjs sync`. Codex n'a
pas d'équivalent projeté : un skill reste le format partagé par les deux.
