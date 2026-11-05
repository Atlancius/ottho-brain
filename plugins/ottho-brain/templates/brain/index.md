---
title: "{{name}} — Index universel"
tldr: "Point de départ unique du cerveau de {{owner}} pour {{owner}}, Claude et Codex : comment une session arrive ici, les routes, la recherche bornée et le plan de contrôle IA."
type: index
canonical_id: "bno_hub_{{slug}}"
domain: navigation
updated: {{date}}
---

# {{name}} — Index universel

> **Commencer ici, une seule fois par tâche.** Choisir ensuite une route et
> suivre ses index locaux. Ne jamais charger toute l'arborescence.

## 1. Comment une session arrive ici

Chaque runtime charge au démarrage un pointeur minimal **généré** depuis `ia/`.
Ce pointeur ne contient aucun fait : il impose de lire ce fichier une fois,
puis de récupérer le contexte à la demande.

| Runtime | Fichier chargé au démarrage | Généré par |
|---|---|---|
| Claude Code, dans n'importe quel projet | `~/.claude/CLAUDE.md` (bloc géré) | `node scripts/brain.mjs sync` |
| Claude Code, dans ce cerveau | `CLAUDE.md` (racine) | `node scripts/brain.mjs sync` |
| Codex CLI ou app, dans n'importe quel projet | `~/.codex/AGENTS.md` (bloc géré) | `node scripts/brain.mjs sync` |
| Codex, dans ce cerveau | `AGENTS.md` (racine) | `node scripts/brain.mjs sync` |

Claude reçoit aussi une copie des règles de `ia/rules/` dans
`~/.claude/rules/{{slug}}/`. Codex lit les règles `ia/rules/core/` signalées
par son pointeur et retrouve les autres par `ia-search`.

## 2. Les routes

{{ROUTES}}

## Choisir sans ambiguïté

- « Cela décrit {{owner}} sans lien avec son activité » → **{{label.perso}}**.
- « Cela décrit, protège ou fait avancer son activité » → **{{label.pro}}**.
- « Cela resterait utile dans un autre projet ou à une autre personne » → **{{label.savoir}}**.
- « Le fichier est lu ou exécuté comme configuration par Claude ou Codex » → **IA**.
- « La provenance, la sécurité, les droits ou la destination ne sont pas encore validés » → **{{sas.label}}**.

Autres routes déclarées :

{{extra_domains}}

En cas de recouvrement, une seule page reste canonique. Les autres pointent
vers elle par un lien.

## 3. Trouver un fait ou un comportement

1. Ouvrir l'index de la route choisie.
2. Descendre uniquement par les sous-dossiers listés.
3. Lire `--instructions.md` lorsqu'il est référencé.
4. Ouvrir la page cible, puis ses seuls liens utiles.

Depuis n'importe quel projet, lancer la recherche depuis la racine du cerveau :

```bash
node scripts/brain.mjs search "<question>"      # un fait
node scripts/brain.mjs context "<sujet>"        # un paquet de contexte borné
node scripts/brain.mjs ia-search "<besoin>"     # une règle, un skill, un workflow
node scripts/brain.mjs stats                    # l'état du cerveau
```

`bun scripts/brain.mjs …` marche aussi. {{sas.label}} et `{{drop.dir}}/` sont
toujours exclus de la recherche.

## 4. Le plan de contrôle IA

Tout ce qu'un runtime lit comme configuration a **un seul chemin canonique sous
`ia/`**. Claude et Codex n'en reçoivent que des projections : on ne les édite
jamais.

| Type | Canonique | Claude Code reçoit | Codex reçoit |
|---|---|---|---|
| Skills | `ia/skills/<pack>/<nom>/` | lien `~/.claude/skills/<nom>` | lien `~/.agents/skills/<nom>` |
| Règles | `ia/rules/**` | copies `~/.claude/rules/{{slug}}/` | lecture des règles `core` signalées par `~/.codex/AGENTS.md` |
| Agents | `ia/agents/**` | copies `~/.claude/agents/` | — |
| Commandes | `ia/commands/**` | copies `~/.claude/commands/` | — |
| Workflows | `ia/workflows/**` | non projetés : `ia-search` | non projetés : `ia-search` |

Modifier un composant : éditer son fichier sous `ia/`, puis
`node scripts/brain.mjs sync` et `node scripts/brain.mjs verify`.

## 5. Ingestion

Une seule voie : le skill `{{ingest}}`. Déposer un clipping, une note, un PDF,
une URL ou un export dans `{{drop.dir}}/`, puis lancer `{{ingest}}`. Il scanne,
classe, vérifie, écrit la connaissance au bon endroit, journalise et commite
localement. Les originaux de `{{drop.dir}}/` partent à la corbeille du cerveau ;
ceux de {{sas.label}} sont archivés, jamais supprimés.

## Invariants

1. Une information possède une seule source de vérité.
2. Tout dossier géré possède exactement son `--index-<dossier>.md`.
3. Chaque index référence son parent, ses enfants directs, ses pages directes et ses instructions locales.
4. Toute création, suppression ou relocalisation met à jour navigation et backlinks dans la même mutation.
5. `ia/` ne contient que la configuration des agents ; aucun fait personnel ou métier.
6. Une arrivée commence `C0_UNKNOWN` et n'entre ni dans Git, ni dans la recherche, ni dans un prompt avant admission.
7. Seul un contenu classé `C4_INTERNAL_STANDARD` entre dans Git ; C4 ne vaut jamais autorisation de publication.
8. Jamais `rm` : `node scripts/brain.mjs trash <chemin>`.
9. `log.md` est append-only : on ajoute, on ne réécrit jamais.
10. Toute mutation se termine par contrôles, journal et commit limité aux chemins déclarés.

## Fichiers racine

| Fichier | Rôle |
|---|---|
| [`README.md`](README.md) | Mode d'emploi humain du cerveau. |
| `index.md` | Ce boot et hub de navigation. |
| [`log.md`](log.md) | Journal append-only ; historique, pas autorité courante. |
| `CLAUDE.md` / `AGENTS.md` | Pointeurs générés vers ce fichier. |
| `scripts/brain.mjs` | Moteur du cerveau (installé par le plugin ottho-brain). |
