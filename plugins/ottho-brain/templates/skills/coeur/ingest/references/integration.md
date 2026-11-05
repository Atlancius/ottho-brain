# Dédoublonnage, routage et intégration

Une information n'a qu'un emplacement canonique. Ingérer, c'est enrichir le
cerveau existant, pas empiler des pages.

## Dédoublonner

1. Même URL : `git grep -l -F "<URL nettoyée>" -- {{r.perso}} {{r.pro}} {{r.savoir}}`.
   Trouvée : enrichir cette page source (même `canonical_id`, ligne datée dans
   « Vérification »), jamais une seconde page.
2. Même sujet : `node scripts/brain.mjs search "<titre, sujet, entités>"`, puis
   ouvrir seulement les résultats utiles et leurs index locaux.
3. Plusieurs éléments du lot sur le même sujet : une page source par source, un
   seul enrichissement du sujet.
4. Nouvelle version d'un document déjà ingéré : mettre à jour la page source et
   dater le changement ; pas de copie.

## Router

| Contenu | Destination |
|---|---|
| la source elle-même | `{{r.savoir}}/sources/<thème>/` (gabarit `source`) |
| connaissance durable qu'elle apporte | sujet existant sous `{{r.savoir}}/sujets/`, sinon nouveau sujet si substantiel |
| recette pas à pas | `{{r.savoir}}/pratiques/` |
| personne, outil, organisation notable | `{{r.savoir}}/references/` |
| fait sur {{owner}} hors activité | `{{r.perso}}/` |
| fait sur l'activité, un client ou un projet de {{owner}} | sa fiche sous `{{r.pro}}/` |
| destination incertaine | aucune écriture : bloqué « classement » |

La connaissance sur l'IA va dans `{{r.savoir}}/`. Si une ingestion révèle
qu'un comportement d'agent devrait changer, ne pas modifier `ia/` dans la même
mutation : le proposer dans le rapport.

Thème de `sources/` et `sujets/` : réutiliser un sous-dossier existant
(lister l'index local). Un nouveau thème n'est créé que s'il regroupera
plusieurs pages ; le moteur crée son index au `build`.

## Intégrer

Pour chaque page touchée :

1. enrichir sans écraser le contenu valide ; distinguer fait sourcé,
   interprétation et recommandation ;
2. lier la page source depuis le sujet, et le sujet depuis la page source
   (section « Connexions ») ;
3. incrémenter `sources` et mettre `updated` à la date du jour ;
4. créer une page seulement si le contenu est substantiel et la destination
   certaine.

## Contradictions

Ne jamais écraser silencieusement un fait existant.

- Une source primaire tranche : corriger, noter « Corrigé le AAAA-MM-JJ :
  ancienne valeur → nouvelle valeur (source) » et compter un CORRIGÉ.
- Rien ne tranche : inscrire les deux affirmations, leurs sources et leurs
  dates dans « Contradictions et limites » des deux pages, et le signaler.
