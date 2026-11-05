---
name: nouveau-dossier
description: "Ajoute, renomme ou réorganise un dossier du cerveau de {{owner}} (sous-dossier d'une route, nouveau thème, nouvelle route) en gardant la navigation cohérente : responsabilité écrite, index généré, instructions locales, configuration et liens mis à jour. Utiliser sur « crée un dossier », « ajoute une catégorie », « range autrement », « renomme ce dossier »."
---

# Nouveau dossier

Commandes lancées depuis la racine du cerveau. Un dossier géré = une
responsabilité exclusive, un `--index-<dossier>.md` généré, et éventuellement un
`--instructions.md`.

## 1. Cadrer

Poser au plus trois questions (outil de question interactive si disponible,
sinon dans le chat) :

1. Où ? Route parente (`{{r.perso}}/`, `{{r.pro}}/`, `{{r.savoir}}/` ou une
   route ajoutée) et dossier parent.
2. Quoi ? Ce qui y appartient et ce qui n'y appartient pas, en une phrase
   chacun.
3. Nom : kebab-case ASCII court (`clients`, `veille-ia`), sans accent.

Refuser un dossier qui recouvre un dossier existant (`node scripts/brain.mjs search`
puis l'index du parent) : proposer de réutiliser l'existant. Refuser un
dossier dans `ia/` (composants : `cree-skill`), dans {{sas.label}} ou dans
`{{drop.dir}}/`.

## 2. Créer

1. `mkdir -p <chemin>`.
2. `node scripts/brain.mjs index` : crée `--index-<dossier>.md`.
3. Écrire son `tldr` dans le frontmatter de l'index (hors bloc généré) : la
   responsabilité en une phrase. Ajouter une phrase de prose sous le titre si
   utile.
4. Règles de rangement non évidentes : créer `<chemin>/--instructions.md`
   (frontmatter `title`, `tldr`, `type: instruction`, `domain: <racine>`) avec
   « Appartient ici », « N'appartient pas ici » et le gabarit de page attendu.
5. Sous-dossier de premier niveau d'une route : l'ajouter aussi dans
   `ia/brain.config.json` (`children` du domaine, avec `dir`, `label`, `owns`)
   pour que le plugin le connaisse lors d'une mise à jour.

## 3. Nouvelle route (rare)

Une route de premier niveau change le hub. Exiger l'accord explicite de
{{owner}}. Ajouter le domaine dans `ia/brain.config.json` (`role: "autre"`,
`dir`, `label`, `owns`, `not`), créer le dossier et son `--instructions.md`,
puis `node scripts/brain.mjs index` : le tableau des routes de `index.md` se
régénère. Mettre à jour la section « Choisir sans ambiguïté » de `index.md`
(prose). Puis `node scripts/brain.mjs sync` : les pointeurs Claude et Codex
restent valides.

## 4. Renommer ou déplacer

1. Lister les liens entrants : `git grep -l "<ancien-chemin>"`.
2. `git mv <ancien> <nouveau>` (garde l'historique).
3. Corriger chaque lien entrant et les `domain` si la racine change.
4. Mettre à jour `ia/brain.config.json` si le dossier y figure.
5. `node scripts/brain.mjs build` jusqu'à exit 0 (l'ancien index part avec le
   dossier, le nouveau est régénéré).

## 5. Livrer

Contrat de mutation ([processus Git](../../../workflows/processus-git.md)) :
manifeste exact (dossiers créés, index, config, pages déplacées, `log.md`),
`ajoute-log` avec `event_type: maintenance` (ou `migration` pour une
réorganisation), staging exact, commit local `chore(<route>): <action>`.
