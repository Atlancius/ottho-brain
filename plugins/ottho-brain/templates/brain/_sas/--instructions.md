---
title: "{{sas.label}} — Instructions"
tldr: "{{sas.label}} et la boîte de dépôt {{drop.dir}}/ reçoivent tout élément à ingérer. Toute arrivée est C0, hors Git, hors recherche et hors prompt ; seul le skill {{ingest}} la qualifie, l'ingère et range son original."
type: instruction
domain: {{sas.dir}}
---

# {{sas.label}} — Instructions

`{{drop.dir}}/` est la boîte de dépôt rapide (Web Clipper, notes). {{sas.label}}
(`{{sas.dir}}/`) garde les dépôts à conserver et ceux qui attendent une décision.

Unique voie d'ingestion : le skill `{{ingest}}`. Il lit `{{drop.dir}}/` par
défaut, et un chemin de {{sas.label}} seulement quand {{owner}} le nomme.

- Toute arrivée commence `C0_UNKNOWN`.
- Les dépôts restent hors Git et hors recherche, même classés C4.
- Aucun agent ne lit une arrivée en dehors de `{{ingest}}`.
- Un original de {{sas.label}} n'est jamais supprimé : une fois ingéré et
  commité, il est déplacé vers `archives/AAAA-MM-JJ-<slug>/`. Un original de
  `{{drop.dir}}/` ingéré et commité part à la corbeille du cerveau.
- Un élément bloqué reste à sa place ; {{owner}} décide de la suite.
- Aucun coffre : un élément C1 ou C2 est signalé, puis traité hors du cerveau.

| Zone | Rôle |
|---|---|
| `arrivees/` | dépôts à conserver : export, formation, gros PDF |
| `candidats/a-classer/` | éléments sûrs dont droits, provenance ou destination restent à trancher |
| `quarantaine/securite/`, `quarantaine/droits/`, `quarantaine/classement/` | éléments isolés selon la raison du blocage |
| `archives/` | originaux ingérés, conservés localement |
