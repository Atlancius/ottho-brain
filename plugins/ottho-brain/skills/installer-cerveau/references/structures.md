# Modèles de structure

Chaque modèle garde les trois rôles (perso, pro, savoir), `ia/` et le Sas.
Seuls les noms et les sous-dossiers changent. `owns` = ce qui appartient au
dossier, en une phrase ; `not` = ce qui n'y appartient pas.

Ajoutés automatiquement par l'installateur, quel que soit le modèle :
`<perso>/identite`, `<perso>/journal` et `<perso>/revues` (pack rituels),
`<pro>/projets` (pack projets), et les sous-dossiers de la route savoir.

## Classique BrainOS (perso et pro mélangés)

```text
perso/        Moi à titre personnel : identité, préférences, objectifs.
  preferences/   Goûts, outils, façons de travailler.
  objectifs/     Objectifs et priorités personnels.
pro/          Mon activité : entreprises, clients, offres, stratégie.
  activites/     Une fiche par activité ou marque.
  clients/       Fiches clients assainies (informations publiques seulement).
  strategie/     Positionnement, offres, plans.
savoir/       Connaissance durable et sourcée, réutilisable partout.
```

## Freelance ou entrepreneur

```text
perso/
  preferences/
  objectifs/
business/     Mon entreprise : offres, clients, ventes, marketing.
  offres/        Offres, tarifs publics, conditions générales publiques.
  clients/       Fiches clients assainies.
  marketing/     Positionnement, contenus, canaux.
  operations/    Process, outils, fournisseurs.
savoir/
```

## Créateur de contenu

```text
perso/
  preferences/
  objectifs/
creation/     Ma création : chaînes, formats, idées, partenariats.
  chaines/       Une fiche par chaîne ou réseau.
  idees/         Banque d'idées de contenus.
  formats/       Formats récurrents et leurs recettes.
  partenariats/  Marques et collaborations (sans montants).
savoir/
```

## Études

```text
perso/
  preferences/
  objectifs/
etudes/       Mes études : cours, projets, stages, candidatures.
  cours/         Une fiche par cours ou module.
  stages/        Stages et alternances (sans données privées).
  candidatures/  Candidatures et suivi.
savoir/
```

Pour l'étudiant, la route savoir porte l'essentiel des notes de cours
réutilisables ; `etudes/cours/` garde l'organisation (planning, attendus,
examens).

## Salarié

```text
perso/
  preferences/
  objectifs/
  carriere/      Compétences, parcours, objectifs professionnels personnels.
travail/      Mon poste : équipe, missions, process (rien de confidentiel).
  missions/      Missions et dossiers en cours.
  equipe/        Organisation et rôles (informations internes non sensibles).
  process/       Façons de faire de l'équipe.
savoir/
```

Rappeler au salarié : aucune donnée confidentielle de l'employeur, aucun
document interne recopié. En cas de doute, ne pas l'écrire.

## Personnalisé

Demander pour chaque rôle : nom du dossier, libellé, `owns`, `not`, puis les
sous-dossiers un par un (`dir`, `label`, `owns`). Proposer le modèle le plus
proche comme base.
