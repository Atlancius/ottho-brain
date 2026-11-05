---
name: sync-ia
description: "Projette ia/ du cerveau de {{owner}} vers Claude Code et Codex (pointeurs CLAUDE.md et AGENTS.md, liens des skills, copies des règles, agents et commandes), contrôle la dérive, ou retire ces projections. Déclencheurs : « synchronise l'IA », « mes skills ne sont pas vus », « mets à jour CLAUDE.md », « vérifie les projections », « désinstalle le cerveau de Claude »."
---

# Sync-ia

Runtime : `AskUserQuestion` (Claude Code) = question dans le chat (Codex).
Commandes depuis la racine du cerveau.

## Ce que fait réellement `sync`

| Cible | Action |
|---|---|
| `CLAUDE.md` et `AGENTS.md` à la racine du cerveau | réécrits entiers (pointeur local généré) |
| `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md` | seul le bloc `ottho-brain:{{slug}}` est créé ou remplacé, en tête ; le reste du fichier reste intact ; copie de sauvegarde dans `.local/backups/home/<horodatage>/` avant toute modification |
| skills `ia/skills/**/SKILL.md` | lien `~/.claude/skills/<nom>` et `~/.agents/skills/<nom>` (jonction sous Windows, lien symbolique ailleurs) ; lien orphelin d'un skill retiré : supprimé |
| règles, agents, commandes | copies dans `~/.claude/rules/{{slug}}/`, `~/.claude/agents/`, `~/.claude/commands/`, suivies par empreinte dans `.local/state/projections.json` |

Conflits, jamais écrasés : un dossier `~/.claude/skills/<nom>` qui n'est pas
un lien vers le cerveau (autre skill du même nom) ; une copie modifiée hors du
cerveau. `sync` les liste et sort en code 1. Runtime désactivé dans
`ia/brain.config.json` (`runtimes.claude` ou `runtimes.codex` à `false`) :
aucune projection vers lui.

## Workflow

1. **Aperçu** : `node scripts/brain.mjs sync --dry-run`. Montrer à {{owner}} les
   fichiers et liens qui changeraient. Pour les pointeurs globaux, afficher le
   bloc qui sera écrit (texte entre les marqueurs `ottho-brain:{{slug}}`) et
   rappeler que le reste de `~/.claude/CLAUDE.md` et `~/.codex/AGENTS.md` ne
   bouge pas. Première fois ou bloc absent : demander un oui explicite.
2. **Projeter** : `node scripts/brain.mjs sync`.
3. **Conflits** : pour chacun, demander :
   - skill du même nom déjà présent : renommer le skill dans `ia/` (dossier et
     `name`, puis `build`) ou garder l'existant sans projection ;
   - copie modifiée hors du cerveau : reporter la modification dans le
     canonique sous `ia/`, puis déplacer la copie modifiée hors de
     `~/.claude` (sauvegarde) et relancer `sync`.
   Ne jamais supprimer ni écraser le dossier en conflit.
4. **Contrôler** : `node scripts/brain.mjs verify` jusqu'à « projections Claude
   et Codex à jour ».
5. **Livrer** : `sync` ne modifie rien de suivi par Git hors `CLAUDE.md` et
   `AGENTS.md` du cerveau. Aucun commit si `ia/` n'a pas changé ; sinon
   contrat de mutation (`ia/workflows/processus-git.md`, `log --type sync`).
6. Rappeler de redémarrer Claude Code et Codex pour charger les changements.

## Désinstaller du runtime

Sur demande explicite seulement, après avoir redit l'effet et obtenu un oui :

```bash
node scripts/brain.mjs unsync
```

Retire le bloc géré des deux pointeurs globaux, les liens de skills qui
pointent vers le cerveau, et déplace les copies intactes dans
`.local/backups/unsync-<horodatage>/`. Le cerveau lui-même reste intact ;
`sync` le rebranche.

## Diagnostic rapide

- Un skill n'apparaît pas : `verify`, puis vérifier son `SKILL.md` (`name`,
  `description`) avec `build`, puis redémarrer la session.
- Codex ne lit pas le cerveau : vérifier le bloc dans `~/.codex/AGENTS.md`
  (ou `$CODEX_HOME/AGENTS.md`).
- Lien impossible sous Windows : le dossier cible existe peut-être déjà ; le
  message de `sync` donne le code d'erreur.

## Rapport final

Fichiers écrits, liens créés ou retirés, conflits et décision prise pour
chacun, résultat de `verify`, commit éventuel.
