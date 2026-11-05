---
title: "Règles — Instructions"
tldr: "Comment écrire une règle : courte, impérative, une seule source, toujours active dans core/ ou chargée à la demande ailleurs."
type: instruction
domain: ia
---

# Règles — Instructions

- `core/` : règles toujours actives. Moins de 40 lignes chacune : Claude les
  charge à chaque session et Codex les lit au boot.
- Autre dossier (`stacks/`, `domaines/`, `importees/`…) : règle à la demande.
  Pour Claude, ajouter `paths: ["**/*.tsx"]` dans le frontmatter pour qu'elle
  s'active sur ces fichiers ; Codex la retrouve par `ia-search`.

## Forme

```markdown
---
title: "Nom de la règle"
tldr: "Ce qu'elle impose, en une phrase."
type: rule
domain: ia
updated: AAAA-MM-JJ
---

# Nom de la règle

Décision de {{owner}} (AAAA-MM-JJ) : pourquoi la règle existe.

## Faire
- Directive impérative et vérifiable.

## Ne jamais
- Interdit, avec l'alternative.
```

- Une directive = une puce, à l'impératif, vérifiable.
- Citer la source d'une règle née d'une erreur (page ou décision du cerveau).
- Une règle ne contient aucun fait personnel ni secret.
- Après modification : `node scripts/brain.mjs sync`.
