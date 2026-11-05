---
name: usage-ia
description: "Mesure l'usage réel des skills du cerveau de {{owner}} dans les sessions Claude Code et Codex (noms seulement), classe jamais utilisés, rares et fréquents, et propose retraits ou fusions. Déclencheurs : « usage ia », « quels skills je n'utilise jamais », « fais le ménage dans mes skills », « mes skills servent-ils »."
---

# Usage-ia

Commandes depuis la racine du cerveau.

## Ce que mesure le moteur

`node scripts/brain.mjs usage [--days 30]` parcourt les fichiers `.jsonl`
modifiés dans la période sous `~/.claude/projects/` et `~/.codex/sessions/`
(fichiers de plus de 50 Mo ignorés) et compte, pour chaque skill de
`ia/skills/`, ses invocations : appel `"skill": "<nom>"`, lecture de
`skills/.../<nom>/SKILL.md`, ou `$<nom>`. C'est une estimation : un nom très
court ou commun peut être surcompté.

## Invariants

- Noms et nombres seulement : ne jamais citer, résumer ni ouvrir le contenu
  d'une session dans la réponse.
- Aucun retrait sans accord explicite de {{owner}}, skill par skill.
- Un skill du pack `cerveau` (dont `{{ingest}}`) n'est jamais proposé au
  retrait : il sert la mécanique du cerveau même s'il est rare.

## Workflow

1. Période : 30 jours par défaut ; `--days 90` si le cerveau est récent ou si
   {{owner}} le demande.
2. Lancer `node scripts/brain.mjs usage --days <N>`.
3. Présenter trois groupes : **jamais utilisés** (0), **rares** (1 à 2),
   **fréquents** (3 et plus), avec le pack de chacun
   (`node scripts/brain.mjs ia-search "<nom>"` donne son chemin).
4. Proposer au plus cinq actions, la plus utile d'abord :
   - **retirer** un skill jamais utilisé et sans valeur de secours ;
   - **fusionner** deux skills qui se recouvrent (le plus utilisé absorbe
     l'autre ; skill `cree-skill`, mode amélioration) ;
   - **réécrire la description** d'un skill utile mais jamais déclenché ;
   - **garder** un skill rare mais critique.
5. Sur accord pour un retrait :

   ```bash
   node scripts/brain.mjs trash ia/skills/<pack>/<nom>
   node scripts/brain.mjs build
   node scripts/brain.mjs sync      # retire les liens projetés devenus orphelins
   node scripts/brain.mjs verify
   ```

   Puis contrat de mutation (`ia/workflows/processus-git.md`) :
   `deleted` = fichiers du skill, `modified` = index régénérés et `log.md`,
   `log --type maintenance --title "Retrait de skills inutilisés"`, `stage`,
   commit `chore(ia): retirer <N> skills inutilisés`. Le dossier reste
   récupérable dans `.trash/` et dans l'historique Git.

## Rapport final

Période, nombre de sessions lues, tableau des trois groupes, actions
proposées, actions faites avec le SHA du commit.
