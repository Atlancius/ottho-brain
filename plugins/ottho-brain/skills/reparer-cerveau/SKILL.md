---
name: reparer-cerveau
description: "Diagnostique, met à jour, rebranche, déplace ou débranche un second cerveau installé par ottho-brain : moteur et gabarits mis à jour sans toucher aux pages, pointeurs ~/.claude/CLAUDE.md et ~/.codex/AGENTS.md régénérés, liens de skills réparés, désinstallation propre qui garde le cerveau. Utiliser sur « répare mon cerveau », « mets à jour mon cerveau », « mon cerveau ne marche plus », « j'ai déplacé mon cerveau », « débranche mon cerveau »."
---

# Réparer le cerveau

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans
Codex : le dossier qui contient ce SKILL.md). Plugin :
`${CLAUDE_SKILL_DIR}/../..`. Les commandes `node scripts/brain.mjs` se lancent
depuis la racine du cerveau.

## 0. Trouver le cerveau

1. Racine indiquée dans le bloc `ottho-brain:` de `~/.claude/CLAUDE.md` ou de
   `~/.codex/AGENTS.md` (« Racine du cerveau »).
2. Sinon, dossier courant ou parent qui contient `ia/brain.config.json`.
3. Sinon, demander le chemin. Aucun cerveau : proposer `installer-cerveau`.

Si un distant Git existe : `git fetch`, arrêt si divergé. Arbre non propre :
lister les changements et ne jamais les inclure dans la mutation.

## 1. Choisir le mode

Si la demande ne le dit pas, demander (question interactive si disponible) :
diagnostic (recommandé) · mise à jour du plugin · rebrancher Claude et Codex ·
cerveau déplacé · débrancher.

## Diagnostic (lecture seule)

`node scripts/brain.mjs doctor`, puis `node scripts/brain.mjs check`.
Présenter chaque ✗ avec sa cause probable et la réparation :

| Constat | Réparation |
|---|---|
| Node absent ou trop ancien | installer Node.js LTS ; `bun` marche aussi |
| hook pre-commit inactif | `git config core.hooksPath .githooks` |
| index périmés | `node scripts/brain.mjs index` puis mutation `maintenance` |
| liens cassés, frontmatter | corriger la page (skill `note-ca`) |
| projections périmées ou absentes | mode « rebrancher » |
| `modifié hors du cerveau` | quelqu'un a édité la copie dans `~/.claude` : reporter la modification dans `ia/`, puis rebrancher |
| moteur plus ancien que le plugin | mode « mise à jour » |

Version du moteur : `node scripts/brain.mjs version` ; version du plugin :
`${CLAUDE_SKILL_DIR}/../../.claude-plugin/plugin.json`.

## Mise à jour du plugin

1. Aperçu :
   `node "${CLAUDE_SKILL_DIR}/../../scripts/install.mjs" --upgrade --root "<cerveau>" --dry-run`.
   Sortie : `updated` (gabarits non modifiés par la personne, remplacés),
   `created` (nouveaux fichiers), `kept` (modifiés par la personne, jamais
   écrasés).
2. Présenter les trois listes ; pour `kept`, proposer de comparer avec le
   nouveau gabarit et de fusionner à la main, fichier par fichier, sur accord.
3. Accord → même commande sans `--dry-run`. Pages, journal, configuration et
   profil ne sont jamais touchés.
4. `node scripts/brain.mjs build`, `sync`, `verify`.
5. Contrat de mutation (`ia/workflows/processus-git.md`) avec
   `event_type: migration`, titre « Mise à jour ottho-brain <version> », commit
   local `chore(ia): mettre a jour ottho-brain <version>`.

## Rebrancher Claude et Codex

`node scripts/brain.mjs sync --dry-run`, montrer ce qui change, accord, puis
`sync` et `verify`. Conflit de nom de skill : jamais écraser ; proposer de
renommer le skill du cerveau. Rappeler de redémarrer Claude Code et Codex.

## Cerveau déplacé

Après un déplacement du dossier, les pointeurs contiennent l'ancien chemin et
les liens de skills pointent dans le vide.

1. Depuis le nouvel emplacement : `node scripts/brain.mjs sync` — le bloc géré
   est réécrit avec le nouveau chemin et les liens orphelins de ce cerveau sont
   refaits.
2. `node scripts/brain.mjs verify` ; un lien signalé « existe déjà » qui pointe
   vers l'ancien emplacement encore présent : demander si l'ancien dossier est
   une copie à abandonner, puis le traiter sur accord seulement.
3. `node scripts/brain.mjs doctor`.

## Débrancher (désinstallation)

Le cerveau reste intact : seules les projections disparaissent.

1. Décrire ce qui sera retiré : blocs gérés de `~/.claude/CLAUDE.md` et
   `~/.codex/AGENTS.md`, liens de skills de ce cerveau, copies de règles,
   d'agents et de commandes non modifiées (déplacées dans
   `.local/backups/unsync-*`).
2. Accord explicite → `node scripts/brain.mjs unsync`.
3. Skills rapatriés : ils vivent maintenant dans `ia/skills/importes/` ; les
   originaux sont dans `.local/backups/rapatriement-*/`. Proposer de les
   remettre à leur place si la personne abandonne le cerveau (copie, sur
   accord, élément par élément).
4. Désinstaller le plugin lui-même : Claude Code `/plugin` → ottho-brain →
   désinstaller ; Codex `codex plugin remove ottho-brain`.

## Rapport final

Mode exécuté, constats avant et après (`doctor`), fichiers mis à jour, créés
et conservés, projections réécrites, sauvegardes créées, SHA du commit, et ce
qui reste à faire par la personne.
