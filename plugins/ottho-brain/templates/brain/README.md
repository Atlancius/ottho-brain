# {{name}}

Second cerveau de {{owner}}, installé le {{date}} par le plugin
**ottho-brain** (Ottho Academy). C'est à la fois une base de connaissances
lisible dans n'importe quel éditeur Markdown (Obsidian compris) et la source de
vérité locale de Claude Code et Codex.

Le principe vient du *LLM Wiki* d'Andrej Karpathy : l'humain choisit les
sources et les décisions ; l'IA classe, synthétise, relie et entretient. Le
cerveau ne se charge jamais en entier dans un prompt : une petite entrée de
navigation (`index.md`), puis seulement le contexte utile.

## Les routes

| Dossier | Responsabilité |
|---|---|
| `{{r.perso}}/` | {{label.perso}} : {{owner}} à titre personnel. |
| `{{r.pro}}/` | {{label.pro}} : activité, projets, clients, stratégie. |
| `{{r.savoir}}/` | {{label.savoir}} : connaissance durable et sourcée. |
| `ia/` | Règles, skills, workflows, agents et commandes lus par Claude et Codex. Rien d'autre. |
| `{{sas.dir}}/` | {{sas.label}} : arrivées à qualifier, quarantaine, archives des originaux. |
| `{{drop.dir}}/` | Boîte de dépôt, hors Git : tu y poses ce que tu veux faire ingérer. |

## Au quotidien

| Je veux… | Je dis à Claude ou Codex |
|---|---|
| ajouter un article, une vidéo, un PDF, une note | je le pose dans `{{drop.dir}}/`, puis « `{{ingest}}` » |
| noter une idée, une décision, une fiche | « note ça : … » (skill `note-ca`) |
| retrouver une info | « cherche dans mon cerveau … » (skill `cherche-cerveau`) |
{{#if has.rituels}}| écrire mon journal du jour | « journal du jour » |
| faire ma revue de la semaine | « revue hebdo » |
| capturer vite une idée ou une tâche | « capture : … » |
| faire le bilan du mois | « bilan mensuel » |
{{/if}}{{#if has.projets}}| créer la fiche d'un projet | « fiche projet … » |
| voir où en sont mes projets | « portefeuille » |
| documenter un projet de code ou de création | « doc-projet » |
{{/if}}{{#if has.meta}}| créer un nouveau skill ou une règle | « crée un skill … » |
| ramener mes skills existants dans le cerveau | « rapatrie mes skills » |
| voir quels skills je n'utilise jamais | « usage ia » |
{{/if}}| vérifier la santé du cerveau | « audite mon cerveau » |

## Le moteur

`scripts/brain.mjs` n'a aucune dépendance : il tourne avec `node` (18 ou plus)
ou `bun`. `node scripts/brain.mjs help` liste toutes les commandes.

## Sécurité

- Tout ce qui arrive est classé `C0_UNKNOWN` : hors Git, hors recherche, lu
  seulement par `{{ingest}}`.
- Seul le contenu `C4_INTERNAL_STANDARD` (interne, non sensible) entre dans le
  cerveau. Secrets, mots de passe, IBAN, santé, coordonnées privées : jamais.
- Un hook Git bloque tout commit qui contient un secret ou casse la navigation.
- Rien n'est jamais supprimé avec `rm` : la corbeille est `.trash/`.
- Aucun push n'est fait sans ta demande explicite. Si tu ajoutes un dépôt
  distant, qu'il soit **privé**.

## Mise à jour

Le plugin évolue : « répare mon cerveau » (skill `reparer-cerveau` du plugin)
met à jour le moteur et les gabarits que tu n'as pas modifiés, sans toucher à
tes pages.
