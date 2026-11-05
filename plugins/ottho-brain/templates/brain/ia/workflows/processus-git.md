---
title: "Processus Git du cerveau"
tldr: "Contrat de mutation : contrôle de départ, page canonique, index, contrôles, manifeste exact, journal signé, staging borné, commit local. Jamais de push implicite."
type: workflow
domain: ia
updated: {{date}}
---

# Processus Git du cerveau

Git garde l'historique versionnable du cerveau. Seul le contenu C4 y entre.
Une capacité n'est pas une autorisation : pousser, publier, réécrire
l'historique ou supprimer exige une demande explicite de {{owner}}.

## Avant toute modification

```bash
git status -sb
git fetch   # seulement si un dépôt distant est configuré
```

Arrêter et signaler une divergence avec le distant. Un arbre déjà modifié :
identifier les changements de {{owner}} et ne jamais les inclure ni les écraser.
Seule mise à jour automatique admise : `git pull --ff-only` d'un dépôt propre
en retard, au départ de `{{ingest}}`.

## Contrat de mutation

1. Chercher l'existant : `node scripts/brain.mjs search "<sujet>"`.
2. Modifier la seule page canonique et ses backlinks utiles (skill `note-ca`).
3. Régénérer et contrôler : `node scripts/brain.mjs build` (exit 0 exigé).
4. Créer le manifeste privé : `node scripts/brain.mjs manifest init evt_<sujet>_<AAAAMMJJ>`
   puis y déclarer exactement `created`, `modified` (dont `log.md` et les index
   régénérés), `deleted` et `moved` (`{ "from", "to" }`).
5. Journaliser (skill `ajoute-log`) :
   `node scripts/brain.mjs log --type <type> --id <evt> --title "<titre>" --manifest .local/private/staging/<evt>.json --body "<résumé non sensible>"`.
6. Stager exactement le manifeste :
   `node scripts/brain.mjs stage --manifest .local/private/staging/<evt>.json`.
7. Commit local, message conventionnel sans donnée sensible :
   `git commit -m "feat(<route>): <action>"`. Le hook pre-commit relance les
   contrôles ; un échec se corrige, jamais `--no-verify`.

## Interdits

- `git add .`, `git add -A` sans chemin, glob, `git add -f` d'un fichier ignoré.
- Stager un fichier de `{{drop.dir}}/`, un dépôt de {{sas.label}}, `.local/` ou `.trash/`.
- Fixer une identité Git (auteur, e-mail) : utiliser celle déjà configurée.
- Push, rebase, reset, changement de branche implicites.

## Dépôt distant (optionnel)

Un distant doit être **privé**. Le premier push se fait à la main par {{owner}}
ou sur sa demande explicite, après `node scripts/brain.mjs check`.
