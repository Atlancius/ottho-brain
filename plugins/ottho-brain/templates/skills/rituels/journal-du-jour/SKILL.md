---
name: journal-du-jour
description: "Écrit ou enrichit le journal du jour de {{owner}} dans {{r.journal}}/AAAA/AAAA-MM-JJ.md : faits marquants, avancées, décisions, idées, liens vers les pages touchées. Utiliser sur « journal du jour », « journal », « note ma journée », « fin de journée », « ce que j'ai fait aujourd'hui »."
---

# Journal du jour

Une page par jour dans `{{r.journal}}/AAAA/AAAA-MM-JJ.md`. Le journal garde la
trace datée ; la connaissance durable va ailleurs, par `note-ca`.

Racine du cerveau : le dossier qui contient `ia/brain.config.json` (depuis un
autre projet, le chemin est dans le bloc ottho-brain de `CLAUDE.md` ou
`AGENTS.md`). Toutes les commandes partent de cette racine.

## Invariants

- Seul du contenu C4 : jamais de détail de santé, montant réel, coordonnée
  privée, identifiant ou propos privé sur un tiers nommé. Humeur et énergie
  restent des mots ou une note de 1 à 5, jamais un diagnostic.
- Une page existante du jour est enrichie, jamais réécrite : ajouter, dater
  l'ajout si utile (« 18 h — … »).
- Le journal ne remplace pas une décision ou une fiche : une décision durable
  est proposée à `note-ca` (gabarit decision), un fait sur un projet à
  `fiche-projet`.
- Aucun push. Un seul commit local, celui de l'étape 6.

## Workflow

1. **Contexte du jour** (sans question) :
   - `git status -sb` : arrêter si l'arbre contient des changements hors du
     journal du jour, les signaler à {{owner}}.
   - `git log --since=midnight --oneline` : mutations du jour (ingestions,
     notes, projets).
   - Lire la page du jour si elle existe ; sinon celle de la veille, pour la
     section « Demain » à reprendre.
2. **Questions courtes**, une seule série, toutes facultatives (AskUserQuestion
   si disponible, sinon dans le chat) ; si {{owner}} a déjà tout dit, n'en poser
   aucune :
   - Ce qui a avancé aujourd'hui ?
   - Ce qui bloque ou a surpris ?
   - Une décision prise ? Une idée à garder ?
   - Énergie du jour (1 à 5) et un mot d'humeur, facultatifs.
   - Ce qui compte pour demain ?
3. **Filtrer** les réponses : retirer toute donnée C1/C2 et le signaler en une
   ligne (« retiré : coordonnée privée »), sans la recopier.
4. **Écrire** la page. Créer `{{r.journal}}/AAAA/` si besoin : l'index du
   dossier sera généré par `build`. Identifiant : `node scripts/brain.mjs id`.

   ```markdown
   ---
   title: "Journal — AAAA-MM-JJ"
   tldr: "<une phrase : l'essentiel de la journée>"
   type: journal
   canonical_id: "<sortie de node scripts/brain.mjs id>"
   domain: {{r.perso}}
   tags: [journal]
   created: AAAA-MM-JJ
   updated: AAAA-MM-JJ
   classification: C4_INTERNAL_STANDARD
   status: active
   retrieval: included
   ---

   # Journal — AAAA-MM-JJ

   ## En bref
   Énergie : <1-5> · Humeur : <mot>

   ## Avancées
   - <fait> — [page touchée](../../../<route>/<page>.md)

   ## Blocages et surprises
   - <fait>

   ## Décisions
   - <décision> — durable ? proposée à note-ca

   ## Idées
   - <idée>

   ## Demain
   - <priorité>

   ## Connexions
   - [Journal de la veille](AAAA-MM-JJ.md)
   ```

   Omettre les sections vides. Liens Markdown relatifs, jamais de wikilink.
   Relier chaque commit du jour à la page qu'il a touchée.
5. **Proposer** (sans exécuter) : `note-ca` pour chaque décision durable ou
   idée substantielle, `{{ingest}}` si `{{drop.dir}}/` contient des dépôts
   (`node scripts/brain.mjs scan`), `fiche-projet` pour un projet qui a bougé.
6. **Livrer** selon `ia/workflows/processus-git.md` :
   - `node scripts/brain.mjs build` (exit 0 exigé) ;
   - `node scripts/brain.mjs manifest init evt_journal_AAAAMMJJ` (suffixe
     `_2`, `_3` si l'identifiant existe déjà) ;
   - déclarer dans le manifeste la page (`created` ou `modified`), les index
     régénérés et `log.md` ;
   - `node scripts/brain.mjs log --type daily --id evt_journal_AAAAMMJJ --title "Journal du AAAA-MM-JJ" --manifest .local/private/staging/evt_journal_AAAAMMJJ.json --body "Journal du jour écrit."` ;
   - `node scripts/brain.mjs stage --manifest .local/private/staging/evt_journal_AAAAMMJJ.json` ;
   - `git commit -m "docs(journal): AAAA-MM-JJ"`.

## Rapport final

Chemin de la page, sections remplies, éléments retirés pour classification,
propositions faites, SHA du commit.

## Exemple

« journal : j'ai fini la maquette du site client, bloqué sur l'hébergement,
décidé de passer sur Vercel. »
→ Aucune question sauf « Demain ? » ; page créée ; décision « hébergement sur
Vercel » proposée à `note-ca` ; commit `docs(journal): 2026-11-05`.
