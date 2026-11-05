---
name: rapatrie-ia
description: "Rapatrie dans le cerveau de {{owner}} les skills, agents, commandes et règles déjà présents dans ~/.claude, ~/.agents ou ~/.codex, puis les reprojette pour qu'ils marchent comme avant. Déclencheurs : « rapatrie mes skills », « ramène mes skills dans le cerveau », « range mes règles dans ia », « importe mes agents »."
---

# Rapatrie-ia

Runtime : `AskUserQuestion` (Claude Code) = question dans le chat (Codex).
Commandes depuis la racine du cerveau.

Après rapatriement, `ia/` devient l'unique source : `~/.claude` et `~/.agents`
ne gardent que des liens et des copies générés par `sync`.

## Ce que fait réellement le moteur

- `import --list` inventorie, sans rien modifier :
  - skills : dossiers avec `SKILL.md` dans `~/.claude/skills`, `~/.agents/skills`
    et `~/.codex/skills` (un même nom présent à plusieurs endroits = un seul
    élément) ; les liens qui pointent déjà vers le cerveau sont ignorés ;
  - agents `~/.claude/agents/*.md`, commandes `~/.claude/commands/**/*.md`,
    règles `~/.claude/rules/**/*.md` (hors `~/.claude/rules/{{slug}}/` et hors
    copies déjà projetées par le cerveau).
  - Un élément qui est lui-même un lien vers un autre dossier (autre cerveau,
    dépôt) est marqué « lien → … ».
- `import --apply` pour chaque élément retenu :
  1. copie le contenu réel dans `ia/skills/importes/<nom>/`,
     `ia/agents/importes/`, `ia/commands/` ou `ia/rules/importees/` ;
  2. déplace chaque original vers `.local/backups/rapatriement-<horodatage>/`
     (un lien y est remplacé par un fichier `.lien.txt` qui garde sa cible) ;
  3. ne touche jamais un nom qui existe déjà dans `ia/` (signalé « existe déjà »).
- Les liens externes restent en place, sauf avec `--include-links` (le contenu
  pointé est alors copié et le lien retiré).
- `~/.claude/plugins/` n'est jamais lu ni modifié : les skills de plugins
  restent gérés par leur plugin.

## Invariants

- Rien n'est supprimé : les originaux vont dans la sauvegarde locale.
- Un composant rapatrié qui contient un secret, un token ou une donnée privée
  ne part jamais dans Git : commit bloqué, signalement à {{owner}}.
- Aucun rapatriement sans accord explicite sur la liste exacte.

## Workflow

1. **Contrôle de départ** : `git status -sb`. Arrêt si l'arbre contient des
   changements en cours : ne pas mélanger.
2. **Inventaire** : `node scripts/brain.mjs import --list` (ou `--json` pour
   compter). Rien : « Rien à rapatrier », fin.
3. **Présenter par type** (skills, agents, commandes, règles) avec le nombre,
   le runtime d'origine, la description courte et les liens externes.
4. **Demander** à {{owner}} :
   - tout rapatrier, choisir (liste de noms), ou rien ;
   - pour les liens externes : les laisser (défaut) ou copier leur contenu ;
   - par type si utile (`--kinds skill,rule`).
5. **Aperçu** : redire la liste exacte qui sera rapatriée et où elle ira ; c'est
   l'équivalent d'un dry-run (`import` n'en a pas d'autre). Attendre un oui.
6. **Appliquer** :

   ```bash
   node scripts/brain.mjs import --apply [--only <a,b>] [--kinds <types>] [--include-links]
   ```

   Noter le chemin de sauvegarde affiché.
7. **Scanner** : `node scripts/brain.mjs pii`. Une erreur dans un composant
   rapatrié : ne pas committer ; signaler le fichier et le type de donnée
   (jamais la valeur) ; proposer de retirer la donnée du composant ou de le
   sortir du cerveau (`node scripts/brain.mjs trash <dossier>`), puis rescanner.
8. **Valider** : `node scripts/brain.mjs build` jusqu'à exit 0 (un `SKILL.md`
   sans `name` ou `description` se corrige dans `ia/`).
9. **Reprojeter** : `node scripts/brain.mjs sync` puis
   `node scripts/brain.mjs verify`. Les skills reviennent en liens
   (jonctions sous Windows) dans `~/.claude/skills/<nom>` et
   `~/.agents/skills/<nom>` ; règles, agents et commandes en copies suivies par
   empreinte. Les règles rapatriées sont recopiées sous
   `~/.claude/rules/{{slug}}/importees/`.
10. **Tester** : pour un skill rapatrié, vérifier que `~/.claude/skills/<nom>`
    existe et pointe vers `ia/skills/importes/<nom>` (et pareil côté
    `~/.agents/skills` si Codex est actif).
11. **Clore la mutation** (`ia/workflows/processus-git.md`) : `manifest init
    evt_rapatriement_<AAAAMMJJ>` ; déclarer les fichiers créés sous `ia/`, les
    index régénérés, `ia/brain.config.json` s'il a changé et `log.md` ;
    `log --type import --title "Rapatriement des composants IA"` avec un corps
    qui donne seulement les totaux par type ; `stage --manifest` ; commit
    `feat(ia): rapatrier <N> composants`.

## Revenir en arrière

1. `node scripts/brain.mjs trash ia/skills/importes/<nom>` (ou le fichier
   rapatrié), puis `node scripts/brain.mjs sync` : le lien projeté est retiré.
2. Remettre l'original depuis `.local/backups/rapatriement-<horodatage>/`
   à son emplacement d'origine (le nom du fichier sauvegardé encode son chemin
   relatif au dossier personnel, `/` remplacé par `__`). Un `.lien.txt`
   contient la cible d'un lien à recréer.
3. Mutation de maintenance pour le retrait dans `ia/`.

## Rapport final

Par type : rapatriés, ignorés (et pourquoi), liens externes laissés ;
chemin de la sauvegarde ; résultat de `pii`, `build`, `sync`, `verify` ; SHA
du commit ; redémarrer Claude et Codex pour recharger les skills.
