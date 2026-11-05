---
name: portefeuille
description: "Montre et tient à jour le portefeuille des projets de {{owner}} ({{r.portefeuille}}) : tableau projet, statut, prochaine étape, date de mise à jour ; vue « où j'en suis », projets oubliés, mise en pause ou archivage sur décision. Utiliser sur « portefeuille », « mes projets », « où j'en suis », « quels projets sont actifs », « mets le projet X en pause »."
---

# Portefeuille

`{{r.portefeuille}}` est l'état courant de tous les projets. Chaque ligne
renvoie à sa fiche (`fiche-projet`). Le portefeuille résume ; la fiche fait
autorité.

Racine du cerveau : le dossier qui contient `ia/brain.config.json`. Toutes les
commandes partent de cette racine.

## Invariants

- Une ligne par fiche existante sous `{{r.projets}}/` ; aucune ligne sans fiche.
- La fiche fait autorité : en cas d'écart, corriger le portefeuille depuis la
  fiche, jamais l'inverse.
- Archiver (`status: historical` sur la fiche) seulement sur demande explicite
  de {{owner}} : la fiche sort de la recherche, la ligne passe dans « Archives ».
- Seul du contenu C4 : pas de montant, de client privé ni de secret.
- Vue seule = lecture seule. Mutation seulement si une fiche ou un statut change.

## Workflow

1. **Lire** `{{r.portefeuille}}` et lister les fiches :
   `{{r.projets}}/*/*.md` (frontmatter `project_status`, `next_step`,
   `updated`). Ne pas ouvrir le corps des fiches sauf besoin.
2. **Vue « où j'en suis »** (par défaut) : projets `actif` d'abord, puis
   `en pause`, `idée`. Signaler :
   - un projet actif sans mise à jour depuis plus de 14 jours ;
   - un projet sans prochaine étape ;
   - une fiche absente du portefeuille, ou l'inverse.
   Proposer une seule question : mettre à jour, mettre en pause, archiver
   (AskUserQuestion si disponible, sinon dans le chat).
3. **Maintenir** le fichier, créé s'il n'existe pas (identifiant par
   `node scripts/brain.mjs id`) :

   ```markdown
   ---
   title: "Portefeuille des projets"
   tldr: "État courant des projets de {{owner}} : statut, prochaine étape, date de mise à jour."
   type: project
   canonical_id: "<id>"
   domain: {{r.pro}}
   tags: [portefeuille, projet]
   created: AAAA-MM-JJ
   updated: AAAA-MM-JJ
   classification: C4_INTERNAL_STANDARD
   status: active
   retrieval: included
   ---

   # Portefeuille des projets

   | Projet | Statut | Prochaine étape | Mis à jour |
   |---|---|---|---|
   | [<Nom>](<slug>/<slug>.md) | actif | <action> | AAAA-MM-JJ |

   ## Archives

   | Projet | Statut final | Date |
   |---|---|---|
   | [<Nom>](<slug>/<slug>.md) | livré | AAAA-MM-JJ |
   ```

   Trier par statut (actif, en pause, idée), puis par date décroissante.
4. **Changer un statut** à la demande : mettre à jour la fiche (statut,
   `next_step`, ligne d'historique), puis la ligne du portefeuille. Archiver :
   `project_status: livré` ou `abandonné`, puis `status: historical` sur la
   fiche, ligne déplacée dans « Archives ».
5. **Livrer** si quelque chose a changé, selon `ia/workflows/processus-git.md` :
   `build` (exit 0) → `manifest init evt_portefeuille_AAAAMMJJ` → déclarer les
   fiches touchées, le portefeuille, les index et `log.md` →
   `log --type maintenance --id evt_portefeuille_AAAAMMJJ --title "Mise à jour du portefeuille" --manifest <m> --body "Portefeuille mis à jour."`
   → `stage --manifest <m>` → `git commit -m "docs(projets): portefeuille"`.

## Rapport final

Vue : projets par statut avec prochaine étape, alertes (oubliés, sans étape,
écarts). Après mutation : changements faits et SHA du commit.

## Exemple

« où j'en suis ? » → 3 actifs, 1 en pause ; « Site client » sans mise à jour
depuis 21 jours, signalé ; une question : « Mettre à jour, pauser ou archiver
Site client ? ». Aucune écriture tant que {{owner}} n'a pas répondu.
