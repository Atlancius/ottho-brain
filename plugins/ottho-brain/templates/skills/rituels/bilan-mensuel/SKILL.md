---
name: bilan-mensuel
description: "Fait le bilan du mois de {{owner}} et de son cerveau : agrège les revues hebdo, mesure la croissance par route, l'état des contrôles{{#if has.meta}}, les skills jamais utilisés{{/if}}, et écrit {{r.revues}}/AAAA/AAAA-MM-bilan.md avec les cap du mois suivant. Utiliser sur « bilan mensuel », « bilan du mois », « revue du mois », en fin ou début de mois."
---

# Bilan mensuel

Une page par mois dans `{{r.revues}}/AAAA/AAAA-MM-bilan.md`. Deux regards :
la vie et l'activité de {{owner}} (depuis les revues hebdo), et la santé du
cerveau lui-même.

Racine du cerveau : le dossier qui contient `ia/brain.config.json`. Toutes les
commandes partent de cette racine.

## Invariants

- Seul du contenu C4 : pas de chiffre d'affaires réel, montant, coordonnée
  privée ni détail de santé. Des tendances, pas des valeurs protégées.
- Chaque constat renvoie à sa trace (revue, page, commit, sortie de commande).
- Les chiffres du cerveau viennent des commandes, jamais d'une estimation.
- Aucun push. Un seul commit local, à l'étape 6.

## Workflow

1. **Collecter** (lecture seule) :
   - `git status -sb` : arrêter si l'arbre contient des changements étrangers.
   - Revues hebdo du mois : `{{r.revues}}/AAAA/AAAA-Wss.md` dont les dates
     tombent dans le mois ; leurs priorités et leur sort.
   - Croissance : `git log --since=<1er du mois> --until=<fin du mois> --name-status --diff-filter=A -- {{r.perso}} {{r.pro}} {{r.savoir}}`
     pour les pages créées par route ; `node scripts/brain.mjs stats --json`
     pour le total.
   - Événements du journal du mois dans `log.md` (types et nombre, pas le
     contenu).
   - `node scripts/brain.mjs check` : nombre d'erreurs et d'avertissements.
   - `node scripts/brain.mjs scan` : dépôts en attente.
   {{#if has.meta}}- `node scripts/brain.mjs usage --days 31` : skills jamais utilisés sur le mois.{{/if}}
   {{#if has.projets}}- `{{r.portefeuille}}` : projets actifs, en pause, terminés.{{/if}}
2. **Montrer** le pré-bilan en huit lignes au plus.
3. **Questions** (une seule série, AskUserQuestion si disponible, sinon dans le
   chat) : la réussite du mois, ce qui n'a pas marché, trois caps pour le mois
   suivant (en proposer trois candidats).
4. **Écrire** la page (identifiant : `node scripts/brain.mjs id`) :

   ```markdown
   ---
   title: "Bilan — AAAA-MM"
   tldr: "<une phrase : le mois en un constat>"
   type: review
   canonical_id: "<id>"
   domain: {{r.perso}}
   tags: [bilan-mensuel]
   created: AAAA-MM-JJ
   updated: AAAA-MM-JJ
   classification: C4_INTERNAL_STANDARD
   status: active
   retrieval: included
   ---

   # Bilan — AAAA-MM

   ## Le mois
   - Réussite : <fait> — [trace](<lien>)
   - Ce qui n'a pas marché : <fait>
   - Priorités hebdo : <n> faites, <n> partielles, <n> abandonnées.

   ## Le cerveau
   | Route | Pages créées | Total |
   |---|---|---|
   | {{r.perso}} | <n> | <n> |
   | {{r.pro}} | <n> | <n> |
   | {{r.savoir}} | <n> | <n> |

   - Événements : <n> ingestions, <n> notes, <n> journaux.
   - Contrôles : <n> erreur(s), <n> avertissement(s) · en attente : <n>.
   {{#if has.meta}}- Skills jamais utilisés : <liste> — candidats au retrait ou à une meilleure description.{{/if}}

   ## Trois caps pour AAAA-MM
   1. <cap>
   2. <cap>
   3. <cap>

   ## Connexions
   - [Revue AAAA-Wss](AAAA-Wss.md)
   ```

5. **Proposer** (sans exécuter) : `audit-cerveau` si des erreurs existent ou si
   le dernier audit date de plus d'un mois ; `{{ingest}}` s'il reste des
   dépôts{{#if has.meta}} ; `usage-ia` pour trancher les skills inutilisés{{/if}}.
6. **Livrer** selon `ia/workflows/processus-git.md` : `build` (exit 0) →
   `manifest init evt_bilan-mensuel_AAAAMMJJ` → déclarer la page, les index et
   `log.md` → `log --type monthly --id evt_bilan-mensuel_AAAAMMJJ --title "Bilan du mois AAAA-MM" --manifest <m> --body "Bilan mensuel écrit."`
   → `stage --manifest <m>` → `git commit -m "docs(revue): bilan AAAA-MM"`.

## Rapport final

Chemin de la page, croissance par route, état des contrôles, trois caps,
actions proposées, SHA du commit.
