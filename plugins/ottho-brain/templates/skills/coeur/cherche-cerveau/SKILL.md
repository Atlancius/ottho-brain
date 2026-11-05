---
name: cherche-cerveau
description: "Retrouve une information dans le cerveau de {{owner}} par recherche bornée (search, context, index locaux) et répond en citant les pages, sans jamais charger tout le cerveau ni lire {{sas.label}}. Utiliser sur « cherche dans mon cerveau », « qu'est-ce que je sais sur », « retrouve ma note sur », « est-ce que j'ai déjà », ou avant toute tâche qui touche {{owner}} et ses projets."
---

# Cherche cerveau

Commandes lancées depuis la racine du cerveau. Depuis un autre projet : la
racine est indiquée dans le bloc ottho-brain de `~/.claude/CLAUDE.md` ou
`~/.codex/AGENTS.md`.

## Workflow

1. Boot : lire `index.md` une fois par tâche si ce n'est pas fait.
2. Reformuler la question en mots-clés : sujet, noms propres, synonymes, sigles,
   anglais et français.
3. `node scripts/brain.mjs search "<mots-clés>" --limit 8`. Route connue :
   `--domain {{r.pro}}` (ou autre racine).
4. Aucun résultat utile : une seconde requête avec d'autres synonymes, puis
   l'index de la route la plus probable. Pas de troisième tentative en boucle.
5. Ouvrir seulement les pages utiles (souvent 1 à 3) et, si besoin, l'index
   local de leur dossier pour les voisins. Pour un sujet large :
   `node scripts/brain.mjs context "<sujet>"`.
6. Comportement d'agent recherché (règle, skill, procédure) :
   `node scripts/brain.mjs ia-search "<besoin>"`.

## Réponse

- Répondre directement, puis citer chaque page utilisée par son chemin.
- Séparer ce que le cerveau dit (avec date `updated`) de ce que l'agent en
  déduit.
- Information datée ou périssable : signaler la date et proposer de la
  rafraîchir.
- Rien trouvé : le dire. Proposer de noter l'information (`note-ca`) ou
  d'ingérer une source (`{{ingest}}`). Ne jamais inventer.

## Interdits

- Lecture récursive d'une route, de `ia/registre/` ou de `log.md` en entier.
- Lire `{{drop.dir}}/` ou `{{sas.dir}}/` : seul `{{ingest}}` y accède.
- Écrire dans le cerveau pendant une recherche : une écriture passe par
  `note-ca`.
