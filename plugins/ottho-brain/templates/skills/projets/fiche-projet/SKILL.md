---
name: fiche-projet
description: "Crée ou met à jour la fiche d'un projet de {{owner}} dans le cerveau ({{r.projets}}/<slug>/<slug>.md) : objectif, statut, prochaine étape, stack, liens vers le dépôt et le dossier local, décisions, puis met à jour le portefeuille. Utiliser sur « fiche projet », « nouveau projet », « ajoute ce projet au cerveau », « mets à jour le projet X », après un doc-projet --sync."
---

# Fiche projet

Une fiche par projet : `{{r.projets}}/<slug>/<slug>.md`. Elle dit où en est le
projet et où trouver sa doc ; la doc détaillée reste dans le dossier du projet
(`doc-projet`). Chaque création ou changement de statut met à jour
`{{r.portefeuille}}`.

Racine du cerveau : le dossier qui contient `ia/brain.config.json` (depuis un
autre projet, le chemin est dans le bloc ottho-brain de `CLAUDE.md` ou
`AGENTS.md`). Toutes les commandes partent de cette racine.

## Invariants

- Seul du contenu C4 : pas de montant de devis ou de facture, de coordonnée de
  client, de contrat, d'identifiant ni de secret. Un client est nommé seulement
  si son nom est public ou si {{owner}} l'autorise.
- Un projet = une fiche. Chercher avant de créer.
- Statut fermé : `idée`, `actif`, `en pause`, `livré`, `abandonné`. Un projet
  livré ou abandonné passe en `status: historical` seulement sur décision
  explicite de {{owner}} (il sort alors de la recherche).
- Enrichir sans écraser : une décision ou un fait existant n'est corrigé
  qu'avec sa preuve.
- Aucun push. Un seul commit local, à l'étape 6.

## Workflow

1. **Chercher** : `node scripts/brain.mjs search "<nom du projet, alias>"` et
   lire `{{r.portefeuille}}`. Fiche trouvée → mode mise à jour.
2. **Recueillir** — partir de ce qui est déjà connu (conversation, dossier
   courant, `docs/README.md` du projet s'il existe), puis poser seulement les
   questions manquantes, en une série (AskUserQuestion si disponible, sinon
   dans le chat) :
   - Objectif en une phrase ?
   - Statut ?
   - Prochaine étape concrète ?
   - Où vit-il : dossier local, dépôt (URL nettoyée par
     `node scripts/brain.mjs url`), site en ligne ?
   - Pour une mise à jour : ce qui a changé depuis la dernière fois.
3. **Écrire** la fiche (créer `{{r.projets}}/<slug>/` ; identifiant par
   `node scripts/brain.mjs id`) :

   ```markdown
   ---
   title: "<Nom du projet>"
   tldr: "<objectif en une phrase> — statut : <statut>."
   type: project
   canonical_id: "<id>"
   domain: {{r.pro}}
   tags: [projet, <thème>]
   project_status: actif
   next_step: "<prochaine étape>"
   created: AAAA-MM-JJ
   updated: AAAA-MM-JJ
   classification: C4_INTERNAL_STANDARD
   status: active
   retrieval: included
   ---

   # <Nom du projet>

   ## Objectif
   <pour qui, pour quoi, critère de réussite>

   ## État
   - Statut : <statut> (au AAAA-MM-JJ)
   - Prochaine étape : <action>

   ## Où il vit
   | Quoi | Où |
   |---|---|
   | Dossier local | `<chemin>` |
   | Dépôt | <URL> |
   | En ligne | <URL> |
   | Doc du projet | `<chemin>/docs/README.md` |

   ## Stack
   - <outil> <version> (au AAAA-MM-JJ)

   ## Décisions
   - AAAA-MM-JJ — <décision> — <lien vers l'ADR du projet ou une page du cerveau>

   ## Historique
   - AAAA-MM-JJ — <changement de statut ou jalon>

   ## Connexions
   - [Portefeuille](../portefeuille.md)
   ```

   En mise à jour : modifier `project_status`, `next_step`, `updated`, l'état,
   et ajouter une ligne d'historique datée.
4. **Portefeuille** : ajouter ou mettre à jour la ligne du projet dans
   `{{r.portefeuille}}` (procédure du skill `portefeuille`, étape 3). Le créer
   s'il n'existe pas.
5. **Proposer** : `doc-projet init` si le projet a un dossier sans `docs/` ;
   `note-ca` pour une décision qui dépasse ce projet.
6. **Livrer** selon `ia/workflows/processus-git.md` : `build` (exit 0) →
   `manifest init evt_projet-<slug>_AAAAMMJJ` → déclarer la fiche, le
   portefeuille, les index régénérés et `log.md` → `log --type maintenance --id evt_projet-<slug>_AAAAMMJJ --title "Fiche projet <nom>" --manifest <m> --body "Fiche projet créée ou mise à jour."`
   → `stage --manifest <m>` → `git commit -m "feat(projets): <slug>"`.

## Rapport final

Chemin de la fiche, statut et prochaine étape, ligne du portefeuille, données
retirées pour classification, SHA du commit.
