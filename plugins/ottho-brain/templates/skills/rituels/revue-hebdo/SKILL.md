---
name: revue-hebdo
description: "Fait la revue de la semaine de {{owner}} à partir du cerveau (journaux, commits, stats, dépôts en attente, avertissements) et l'écrit dans {{r.revues}}/AAAA/AAAA-Wss.md : bilan, ce qui avance, ce qui bloque, trois priorités. Utiliser sur « revue hebdo », « revue de la semaine », « bilan de la semaine », « weekly review », le vendredi ou le lundi."
---

# Revue hebdo

Une page par semaine ISO dans `{{r.revues}}/AAAA/AAAA-Wss.md` (ex.
`2026-W45.md`). La revue s'appuie sur les traces du cerveau, puis sur les
réponses de {{owner}} : elle ne devine rien.

Racine du cerveau : le dossier qui contient `ia/brain.config.json`. Toutes les
commandes partent de cette racine.

## Invariants

- Seul du contenu C4 : pas de montant réel, de coordonnée privée ni de détail
  de santé, même résumé.
- Chaque affirmation de bilan renvoie à sa trace (page, journal ou commit).
- Une revue existante de la semaine est enrichie, jamais écrasée.
- Aucun push. Un seul commit local, à l'étape 6.

## Workflow

1. **Collecter** (lecture seule, sans question) :
   - `git status -sb` : arrêter si l'arbre contient des changements étrangers.
   - Semaine ISO courante (lundi → dimanche) ; si on est lundi avant midi et
     qu'aucune revue n'existe pour la semaine écoulée, proposer de la faire.
   - `git log --since="<lundi>" --until="<dimanche> 23:59" --oneline --stat` :
     mutations par route.
   - Journaux de la semaine : `{{r.journal}}/AAAA/AAAA-MM-JJ.md`, sections
     « Avancées », « Blocages », « Décisions », « Demain ».
   - `node scripts/brain.mjs stats --json` : pages par route, dernier audit.
   - `node scripts/brain.mjs scan` : dépôts en attente dans `{{drop.dir}}/`.
   - `node scripts/brain.mjs check` : seulement le nombre d'erreurs et
     d'avertissements, pas leur contenu en détail.
   {{#if has.projets}}- `{{r.portefeuille}}` : projets actifs et prochaines étapes.{{/if}}
   - La revue précédente : ses trois priorités.
2. **Pré-remplir** le bilan à partir de ces traces, puis le montrer à
   {{owner}} en cinq lignes au plus.
3. **Questions** (une seule série, AskUserQuestion si disponible, sinon dans le
   chat) :
   - Les priorités de la semaine passée : faites, partielles, abandonnées ?
   - Ce qui manque au bilan ?
   - Les trois priorités de la semaine qui vient (proposer trois candidates
     tirées des « Demain », blocages et projets).
4. **Écrire** la page (créer `{{r.revues}}/AAAA/` si besoin ; identifiant par
   `node scripts/brain.mjs id`) :

   ```markdown
   ---
   title: "Revue — AAAA-Wss"
   tldr: "<une phrase : la semaine en un constat>"
   type: review
   canonical_id: "<id>"
   domain: {{r.perso}}
   tags: [revue-hebdo]
   created: AAAA-MM-JJ
   updated: AAAA-MM-JJ
   classification: C4_INTERNAL_STANDARD
   status: active
   retrieval: included
   ---

   # Revue — AAAA-Wss (du AAAA-MM-JJ au AAAA-MM-JJ)

   ## Bilan
   - <N> mutations : <route> <n>, <route> <n> ; <n> pages créées.
   - Priorités de la semaine passée : <faite | partielle | abandonnée> chacune.

   ## Ce qui avance
   - <fait> — [trace](<lien relatif>)

   ## Ce qui bloque
   - <blocage> — piste : <action>

   ## Cerveau
   - En attente dans {{drop.dir}}/ : <n> · contrôles : <n> erreur(s), <n> avertissement(s)

   ## Trois priorités
   1. <priorité>
   2. <priorité>
   3. <priorité>

   ## Connexions
   - [Revue précédente](AAAA-Wss.md)
   - [Journal du AAAA-MM-JJ](../../journal/AAAA/AAAA-MM-JJ.md)
   ```

5. **Proposer** les actions (sans exécuter) : `{{ingest}}` s'il reste des
   dépôts, `audit-cerveau` si le check a des erreurs ou si le dernier audit date
   de plus d'un mois, `note-ca` pour une décision durable sortie de la revue.
6. **Livrer** selon `ia/workflows/processus-git.md` : `build` (exit 0) →
   `manifest init evt_revue-hebdo_AAAAMMJJ` → déclarer la page, les index
   régénérés et `log.md` → `log --type weekly --id evt_revue-hebdo_AAAAMMJJ --title "Revue de la semaine AAAA-Wss" --manifest <m> --body "Revue hebdomadaire écrite."`
   → `stage --manifest <m>` → `git commit -m "docs(revue): AAAA-Wss"`.

## Rapport final

Chemin de la page, les trois priorités, actions proposées, SHA du commit.
