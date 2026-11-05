---
title: "Recherche bornée"
tldr: "Comment un agent trouve un fait ou un comportement sans charger le cerveau : index, search, context, ia-search, puis seulement les pages utiles."
type: workflow
domain: ia
updated: {{date}}
---

# Recherche bornée

1. `index.md` une fois par tâche.
2. Un fait : `node scripts/brain.mjs search "<question, synonymes, noms>"`.
   Options : `--limit 5`, `--domain {{r.savoir}}`.
3. Un paquet prêt à lire : `node scripts/brain.mjs context "<sujet>"`
   (titres, résumés et section la plus pertinente, budget borné).
4. Un comportement (règle, skill, workflow) : `node scripts/brain.mjs ia-search "<besoin>"`.
5. Ouvrir seulement les résultats utiles, puis l'index local de leur dossier
   pour les voisins.

## Règles

- Jamais de lecture récursive d'une route ni de `ia/registre/`.
- {{sas.label}} et `{{drop.dir}}/` ne sont jamais cherchés ni lus hors de `{{ingest}}`.
- Pages `status: historical`, `archived` ou `retrieval: excluded` : exclues.
- Aucun résultat : le dire, proposer d'ingérer une source ou de noter
  l'information, ne jamais inventer.
- Citer le chemin de chaque page utilisée dans la réponse.
