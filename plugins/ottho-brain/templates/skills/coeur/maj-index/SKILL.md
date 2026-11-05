---
name: maj-index
description: "Régénère les index de navigation (--index-*.md, hub index.md) et contrôle le cerveau après création, modification, déplacement ou suppression d'une page ou d'un dossier, puis liste les fichiers générés à déclarer dans le manifeste. Utiliser après toute écriture dans le cerveau, sur « mets à jour les index », « régénère la navigation »."
---

# Mise à jour des index

Le moteur est l'unique autorité sur les blocs `brain:children` et
`brain:routes` : ne jamais les éditer ni inventorier un dossier à la main. La
prose hors de ces blocs est préservée.

## Checklist

```text
- [ ] Liste exacte des chemins créés, modifiés, déplacés, supprimés
- [ ] État avant : git status --porcelain=v1 -uall
- [ ] node scripts/brain.mjs build  →  exit 0
- [ ] État après : nouveaux chemins du status = sorties générées
```

## 1. Entrée

Recevoir la liste exacte des chemins touchés. Refuser un glob, une route entière
ou une liste déduite d'un staging préexistant.

## 2. Régénérer et contrôler

Depuis la racine, noter `git status --porcelain=v1 -uall`, puis :

```bash
node scripts/brain.mjs build
```

`build` régénère chaque `--index-<dossier>.md` (création des index manquants,
y compris pour un nouveau sous-dossier), le tableau des routes de `index.md`,
puis lance `check` : index à jour, liens relatifs résolus, frontmatter complet,
`domain` = racine, `canonical_id` unique, classification C4, aucun dépôt du Sas
suivi par Git, journal append-only, secrets et données privées.

Boucle : une erreur bloque la mutation. Corriger la page source, relancer
`build`, n'avancer qu'à exit 0. Un nouvel index créé avec le tldr
« À décrire. » : écrire son `tldr` (dans le frontmatter, hors bloc généré)
puis relancer.

Un déplacement : déplacer le fichier, corriger les liens entrants
(`git grep -l "<ancien-nom>.md"`), puis `build` — `check` signale tout lien
encore cassé.

## 3. Résultat

Comparer le status à celui d'avant. Retourner séparément :

1. index créés ou modifiés ;
2. pages de contenu touchées ;
3. avertissements restants (tldr à écrire, wikilinks, e-mails ou téléphones
   détectés à vérifier).

Si le build a touché un fichier déjà modifié avant, arrêter et le signaler :
le manifeste n'inclut aucun changement antérieur de {{owner}}.

Ne jamais modifier `log.md` à la main ni la prose de `index.md` sans demande.
Pas de staging, commit, pull, rebase ni push ici : c'est le rôle de l'appelant.
