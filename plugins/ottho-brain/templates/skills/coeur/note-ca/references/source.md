# Gabarit — source

Une page par source réelle (article, vidéo, documentation, guide, PDF,
conversation assainie). Chemin :
`{{r.savoir}}/sources/<thème>/AAAA-MM-JJ-<auteur>-<slug>.md`, où `<thème>` est
un sous-dossier de `{{r.savoir}}/sources/` (`ia`, `dev`, `business`,
`design`…). Jamais à la racine de `sources/`. Une source propre à l'activité de
{{owner}} va dans son contexte sous `{{r.pro}}/`.

## Frontmatter

Frontmatter commun du skill, plus :

```yaml
type: source
sources: 1
source_url: "https://example.org/article"   # nettoyée par node scripts/brain.mjs url
source_author: "Auteur public ou éditeur"
source_date: "AAAA-MM-JJ"                     # publication ; à défaut capture, signalée
```

Sans URL publique (note de {{owner}}, conversation), omettre `source_url` et
décrire l'origine dans « Contexte et provenance ».

## Corps

````markdown
# Titre

## Thèse

Une phrase factuelle.

## Contexte et provenance

| Champ | Valeur |
|---|---|
| Auteur | Auteur public ou éditeur |
| Date | Publication, ou capture si inconnue |
| Format | article, vidéo (durée), PDF (pages), guide… |
| Lecture | complète, partielle (limite) ou métadonnées seules |
| Droits | owned, allowed ou licensed (synthèse seulement) |
| Original | où il se trouve après ingestion |

## Faits

1. Fait — localisateur (page, timecode, ancre ou section).

## Interprétations

- Lecture critique séparée des faits ; opinion de l'auteur attribuée.

## Contradictions et limites

- Écart avec une source officielle ou une page canonique, partie non lue.

## Vérification

- Sources consultées : titre, URL nettoyée, date de consultation.
- Décompte : confirmées, corrigées, ajoutées, attribuées, écartées.

## Connexions

- [Sujet](../../sujets/<thème>/<page>.md) — ce que la source apporte.
````

Une même URL n'a qu'une page : une nouvelle lecture enrichit la page
existante, garde son `canonical_id` et ajoute une ligne datée à « Vérification ».
