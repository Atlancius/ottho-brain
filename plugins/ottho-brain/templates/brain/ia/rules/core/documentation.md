---
title: "Documentation des projets"
tldr: "Chaque projet garde sa doc à jour dans son propre dossier : choix, erreurs, essais, journal. Une tâche n'est finie qu'avec sa doc."
type: rule
domain: ia
updated: {{date}}
---

{{#if has.projets}}# Documentation des projets

Objectif : ne jamais refaire deux fois la même erreur.

## Faire

- La doc d'un projet vit dans son dossier (`docs/`), jamais seulement dans le
  chat ou la mémoire d'un modèle. Skill : `doc-projet`.
- Chaque choix durable (stack, outil, direction) : une décision avec options
  écartées et raison.
- Chaque bug ou mauvaise direction : symptôme, cause, correctif, preuve.
- Chaque essai (rendu, build, prompt, version) : sa fiche dans
  `docs/essais/REGISTRE-ESSAIS.md` ; retenu → `RECETTES.md`, rejeté →
  `ANTI-RECETTES.md`.
- Une entrée datée dans `JOURNAL.md` (append-only) à chaque séance.
- Avant de refaire une partie : lire ses recettes, anti-recettes et décisions.
- Une leçon réutilisable hors du projet : proposer la règle correspondante dans
  `ia/rules/` et la fiche du projet dans `{{r.projets}}/`.

## Ne jamais

- Clore une tâche avec une doc périmée.
- Supprimer la fiche d'un essai raté.
- Écrire un secret dans la doc : nommer la variable, pas sa valeur.
{{else}}# Documentation des projets

Objectif : ne jamais refaire deux fois la même erreur.

- Un choix durable, une erreur et sa cause, un essai et son verdict : les noter dans le cerveau (skill `note-ca`, type `decision` pour un choix).
- Avant de refaire une tâche, chercher ce qui a déjà été noté : `node scripts/brain.mjs search`.
- Jamais de secret dans une note : nommer la variable, pas sa valeur.
{{/if}}
