# Gabarit — sujet

Connaissance durable, substantielle et sourcée. Chemin :
`{{r.savoir}}/sujets/<thème>/<slug>.md` pour une connaissance réutilisable,
ou le contexte canonique sous `{{r.pro}}/` pour une procédure, une stratégie
ou un état propre à l'activité de {{owner}}.

Préférer `concept` pour un modèle mental court, `entity` pour une personne,
une organisation ou un outil, `synthesis` pour un croisement de pages, et
l'enrichissement d'une page existante pour une information étroite.

## Frontmatter

```yaml
type: topic
sources: 3          # nombre de sources canoniques citées
aliases: []
```

## Corps

````markdown
# Titre du sujet

## Résumé

Portée, thèse et utilité.

## Principes

Faits structurés, chacun lié à sa source canonique.

## Mise en pratique

Procédure, critères ou exemples.

## Quand ne pas utiliser

Limites, alternatives et risques.

## Points à rafraîchir

Versions, dates ou hypothèses mouvantes, datées « au AAAA-MM-JJ ».

## Connexions

- [Source](../../sources/<thème>/<page>.md) — fait apporté.
````

Écrire seulement ce que les sources prouvent ; signaler une recommandation
comme telle. Chaque nouvelle source citée reçoit un backlink vers ce sujet et
incrémente `sources`.
