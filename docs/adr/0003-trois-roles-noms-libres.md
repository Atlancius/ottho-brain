# ADR 0003 — Trois rôles fixes, noms et sous-dossiers libres

Date : 2026-11-05. Statut : acceptée.

## Contexte

Jeff veut une structure « au plus près » de BrainOS mais adaptée à la façon
de ranger de chacun. Les skills d'écriture ont besoin de savoir où va une
source, un sujet, un fait personnel ou un fait métier.

## Options

- Structure libre totale (PARA, Zettelkasten…) : skills impossibles à écrire
  de façon fiable.
- Structure BrainOS imposée : contraire à la demande.
- **Trois rôles fixes (perso, pro, savoir)** aux noms libres, sous-dossiers
  libres, routes supplémentaires possibles, sous-dossiers de la route savoir
  imposés.

## Décision

Trois rôles fixes. L'installateur mappe les noms choisis sur les rôles
(`routes` dans `brain.config.json`) et les gabarits utilisent ces routes.

## Conséquences

- Cinq modèles de départ (classique, freelance, créateur, études, salarié)
  plus personnalisé.
- `savoir/{sources,sujets,modeles,pratiques,references,decisions,syntheses}`
  toujours présents ; `identite`, `journal`, `revues`, `projets` ajoutés selon
  les packs.
