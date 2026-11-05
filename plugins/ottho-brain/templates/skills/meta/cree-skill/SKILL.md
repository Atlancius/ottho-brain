---
name: cree-skill
description: "Crée ou améliore un skill, une règle, un agent ou une commande dans ia/ du cerveau de {{owner}}, puis le projette vers Claude et Codex. Déclencheurs : « crée un skill », « nouvelle règle », « fais-moi un agent », « améliore ce skill », « ajoute une commande »."
---

# Crée-skill

Runtime : `AskUserQuestion` (Claude Code) = question dans le chat (Codex).
Commandes lancées depuis la racine du cerveau (dossier qui contient
`ia/brain.config.json` ; depuis un autre projet, son chemin est dans le bloc
ottho-brain de `~/.claude/CLAUDE.md` ou `~/.codex/AGENTS.md`).

Un composant = une fonction. S'il faut « et » entre deux fonctions distinctes,
ce sont deux composants.

## Invariants

- Le canonique vit sous `ia/`, jamais dans `~/.claude/`, `~/.agents/` ou
  `~/.codex/` : ces dossiers ne reçoivent que des projections, écrasées ou
  signalées comme dérive au prochain `sync`.
- Aucun fait personnel ou métier dans `ia/` : un skill renvoie par lien vers la
  page du cerveau qui porte le fait (`{{r.perso}}/`, `{{r.pro}}/`, `{{r.savoir}}/`).
- Aucun secret, token, e-mail ou chemin absolu personnel dans un composant.
- Un skill ne recopie jamais une règle : il la lie et ne la contredit pas.

## Checklist

```text
- [ ] 1. Cadrer (but, déclencheurs, entrées, sorties, outils)
- [ ] 2. Choisir le type et vérifier les doublons
- [ ] 3. Écrire le composant
- [ ] 4. Valider (boucle jusqu'à zéro erreur)
- [ ] 5. Projeter et clore la mutation
```

## 1. Cadrer

Poser au plus trois questions, seulement ce que la demande ne dit pas :

- le but en une phrase (ce que le composant produit) ;
- trois formulations réelles qui doivent le déclencher ;
- entrées, sortie attendue, outils ou services utilisés.

## 2. Choisir le type et vérifier les doublons

| Type | Quand | Emplacement canonique |
|---|---|---|
| **skill** (défaut) | procédure ou savoir-faire réutilisable ; partagé par Claude et Codex | `ia/skills/<pack>/<nom>/SKILL.md` |
| règle | directive toujours vraie, courte, vérifiable | `ia/rules/core/` (toujours active) ou `ia/rules/<thème>/` (à la demande) |
| agent | sous-agent Claude Code délégable | `ia/agents/<nom>.md` |
| commande | prompt `/nom` Claude seul (préférer un skill) | `ia/commands/<nom>.md` |

`<pack>` : pack existant (`cerveau`, `rituels`, `meta-ia`, `projets`) ou
`perso` pour les composants de {{owner}}.

Doublons, avant d'écrire :

```bash
node scripts/brain.mjs ia-search "<comportement>"
ls ~/.claude/skills ~/.agents/skills
```

Un composant proche existe : l'enrichir plutôt que dupliquer. Un nom déjà pris
dans `~/.claude/skills` ou `~/.agents/skills` (autre plugin, autre skill) :
choisir un autre nom, `sync` ne remplace jamais un dossier existant.

## 3. Écrire

### Skill

Nom : minuscules, chiffres, tirets, 64 caractères au plus, identique au nom du
dossier, jamais `claude` ni `anthropic`, jamais un nom natif (`init`, `loop`,
`schedule`, `run`, `code-review`, `simplify`, `security-review`).

```markdown
---
name: <nom>
description: "<Ce que fait le skill>. Déclencheurs : « <phrase 1> », « <phrase 2> », « <phrase 3> »."
---

# <Titre>

<Une phrase : le résultat produit.>

## Invariants
- <Ce qui doit rester vrai à chaque exécution.>

## Workflow
1. <Étape impérative, commande exacte si fragile.>

## Rapport final
<Ce que le skill rend à {{owner}}.>
```

- Description en français, quoi + quand, déclencheurs en tête, moins de
  1024 caractères (viser 250).
- Corps impératif, le plus important d'abord, moins de 200 lignes. Au-delà,
  déplacer le détail dans `references/<sujet>.md`, lié depuis `SKILL.md` avec le
  moment où l'ouvrir.
- Une seule approche par défaut, pas un menu. Une étape qui utilise un outil
  propre à Claude donne son équivalent Codex en une ligne.
- Script seulement pour un travail déterministe ; chemins par
  `${CLAUDE_SKILL_DIR}` (dans Codex : le dossier de ce `SKILL.md`).

### Règle

Forme de `ia/rules/--instructions.md` : frontmatter `title`, `tldr`,
`type: rule`, `domain: ia`, `updated` ; sections « Faire » et « Ne jamais » ;
une puce par directive. Règle à la demande pour Claude : `paths: ["<glob>"]`.

### Agent

Forme de `ia/agents/--instructions.md` : `name`, `description` (quand
déléguer), `tools` limités au besoin ; corps = rôle, sortie, critère d'arrêt.

## 4. Valider

Répéter jusqu'à zéro erreur :

```bash
node scripts/brain.mjs build      # index, liens, frontmatter, SKILL.md sans name ou description
node scripts/brain.mjs pii        # aucun secret ni donnée privée
```

À la main : les liens résolvent, la description déclencherait sur les trois
phrases du cadrage, rien n'est dupliqué entre `SKILL.md` et `references/`.

## 5. Projeter et clore

```bash
node scripts/brain.mjs sync       # lien ~/.claude/skills/<nom> et ~/.agents/skills/<nom> ; copies pour règles, agents, commandes
node scripts/brain.mjs verify
```

`sync` signale un conflit (nom déjà pris, copie modifiée hors du cerveau) sans
jamais l'écraser : renommer le composant dans `ia/` et relancer.

Puis le contrat de mutation (`ia/workflows/processus-git.md`) :

```bash
node scripts/brain.mjs manifest init evt_<nom>_<AAAAMMJJ>
# déclarer dans le manifeste : created (fichiers du composant), modified (log.md, index régénérés)
node scripts/brain.mjs log --type maintenance --id evt_<nom>_<AAAAMMJJ> --title "Création du skill <nom>" --manifest .local/private/staging/evt_<nom>_<AAAAMMJJ>.json --body "Nouveau composant IA <type> <nom>."
node scripts/brain.mjs stage --manifest .local/private/staging/evt_<nom>_<AAAAMMJJ>.json
git commit -m "feat(ia): ajouter <type> <nom>"
```

Les index générés à déclarer : `git status --porcelain` après `build`.
Redémarrer la session Claude ou Codex pour charger le nouveau skill.

## Améliorer un composant existant

1. Lire tout le paquet ; lancer la validation pour avoir l'état de départ.
2. Corriger ce qui est faux, périmé, dupliqué ; raccourcir ; ne rien ajouter
   « pour être complet ».
3. Revalider, `sync`, puis mutation avec un titre « Amélioration du skill <nom> ».

## Rapport final

Chemin canonique, type, fichiers et leur rôle, résultat de `build`, `pii`,
`sync` et `verify`, SHA du commit, et ce qu'il reste à faire (redémarrer la
session, tester sur une vraie tâche).
