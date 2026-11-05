---
name: note-ca
description: "Crée ou enrichit une page canonique du cerveau de {{owner}} dans {{r.perso}}/, {{r.pro}}/ ou {{r.savoir}}/ (source, sujet, modèle, pratique, entité, décision, synthèse, note) : routage, recherche de l'existant, gabarit, frontmatter, tags, backlinks, index et commit. Utiliser sur « note ça », « retiens que », « crée la fiche », « ajoute au cerveau », ou depuis {{ingest}}."
---

# Note ça

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans
Codex : le dossier qui contient ce SKILL.md). Commandes lancées depuis la
racine du cerveau.

Écrire ou enrichir **une** page canonique dans `{{r.perso}}/`, `{{r.pro}}/`
ou `{{r.savoir}}/`, jamais dans `ia/` ni dans {{sas.label}}. Appliquer d'abord
la [classification](../../../rules/core/classification.md) : seul un contenu
C4 est écrit. Une donnée C1/C2 dictée par {{owner}} (mot de passe, IBAN,
adresse privée, santé, montant réel) : refuser de l'écrire et dire pourquoi.

## 1. Choisir le type

| Type | Quand | Destination | Gabarit |
|---|---|---|---|
| `source` | une source précise : article, vidéo, doc, PDF | `{{r.savoir}}/sources/<thème>/` | [source](references/source.md) |
| `topic` | connaissance durable et substantielle | `{{r.savoir}}/sujets/<thème>/` ou contexte sous `{{r.pro}}/` | [topic](references/topic.md) |
| `concept` | modèle mental avec au moins deux applications | `{{r.savoir}}/modeles/` | [concept](references/concept.md) |
| `recipe` | procédure pas à pas réutilisable | `{{r.savoir}}/pratiques/` | [pratique](references/pratique.md) |
| `entity` | personne, organisation, outil, client, projet notable | table du gabarit | [entity](references/entity.md) |
| `decision` | choix durable et non trivial (ADR) | `{{r.perso}}/`, `{{r.pro}}/` ou `{{r.savoir}}/decisions/` | [decision](references/decision.md) |
| `synthesis` | croisement d'au moins trois pages avec un insight nouveau | `{{r.savoir}}/syntheses/<thème>/` ou contexte | [synthesis](references/synthesis.md) |
| `note` | fait court sur {{owner}} ou son activité, sans autre type adapté | dossier de la route concernée | frontmatter commun seul |

Refuser une idée générique (concept), une mention passagère (entité), une
micro-décision réversible (décision), un simple résumé (synthèse) : enrichir
alors la page existante.

Routage : fait sur {{owner}} hors activité → `{{r.perso}}/` ; activité,
client, site ou projet → `{{r.pro}}/` ; connaissance réutilisable, y compris
sur l'IA → `{{r.savoir}}/`. Une configuration d'agent relève de `ia/` (skill
`cree-skill`). Destination incertaine → poser une question courte (outil de
question interactive si disponible, sinon dans le chat), ne pas écrire au
hasard. Lire le `--instructions.md` de la route visée.

## 2. Rechercher avant d'écrire

1. `node scripts/brain.mjs search "<sujet, nom, alias, synonymes>"` ; pour une
   source, aussi `git grep -l -F "<URL nettoyée>" -- {{r.perso}} {{r.pro}} {{r.savoir}}`.
2. Ouvrir seulement les résultats et l'index local de destination.
3. Page existante → l'enrichir : même `canonical_id`, `updated` du jour, faits
   nouveaux ajoutés, faits valides conservés sauf preuve de correction.

## 3. Frontmatter

```yaml
---
title: "Titre lisible"
tldr: "Une à trois phrases factuelles qui suffisent à décider d'ouvrir la page."
type: source            # topic | concept | recipe | entity | decision | synthesis | note
canonical_id: "bno_0123456789abcdef01234567"
domain: <route>         # racine exacte du chemin : {{r.perso}} | {{r.pro}} | {{r.savoir}}
tags: [claude-code, securite]
created: AAAA-MM-JJ
updated: AAAA-MM-JJ
classification: C4_INTERNAL_STANDARD
status: active
retrieval: included
---
```

- `canonical_id` : `node scripts/brain.mjs id`. Ne jamais modifier
  l'identifiant d'une page existante.
- `domain` vaut la racine du chemin ; `check` le vérifie.
- `status: historical` ou `archived`, `retrieval: excluded` : sortent la page
  de la recherche, seulement sur décision explicite de {{owner}}.
- Champs propres au type : dans chaque gabarit.

## 4. Tags

- kebab-case minuscule, deux ou trois mots au plus, singulier ;
- marque normalisée sans ponctuation (`nextjs`, `nodejs`, `claude-code`,
  `no-code`, `ia`) ;
- aucune donnée privée, aucun nom de client confidentiel ;
- réutiliser la forme dominante (`search "<tag>"`) ; n'en créer un que s'il
  décrira plusieurs pages.

## 5. Écrire

- Nom de fichier : `<slug>.md` en kebab-case ASCII (`source` :
  `AAAA-MM-JJ-<auteur>-<slug>.md`).
- Chaque fait porte sa preuve : lien vers la page source canonique ou une
  source officielle. Interprétations et recommandations séparées et attribuées.
- Dater tout fait périssable : « au AAAA-MM-JJ ».
- Synthétiser, ne jamais recopier l'original ; citations courtes.
- Liens Markdown relatifs vers le chemin canonique ; jamais de `[[wikilink]]`.
- Omettre les sections vides.

## 6. Finaliser

1. Backlinks utiles dans les deux sens (section « Connexions »), sans copie.
2. `node scripts/brain.mjs build` (régénère les index ; exit 0 exigé). Voir
   [maj-index](../maj-index/SKILL.md).
3. Mutation : [ajoute-log](../ajoute-log/SKILL.md) puis staging exact et
   commit local selon le [processus Git](../../../workflows/processus-git.md).
   `event_type` : `decision` pour une ADR, `query-filed` pour une synthèse,
   sinon `maintenance`.
4. Rapport : chemin, `canonical_id`, liste exacte des chemins créés et
   modifiés, SHA du commit.

Appelé par un orchestrateur qui écrit plusieurs pages (ex. `{{ingest}}`) :
sauter les étapes 2 à 3 du §6 ; l'orchestrateur régénère, journalise et
commite une seule fois pour toute la mutation.
