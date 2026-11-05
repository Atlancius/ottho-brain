# Gabarit — pratique (recipe)

Procédure pas à pas réutilisable, vérifiée sur une source officielle ou une
exécution réelle. Chemin : `{{r.savoir}}/pratiques/<slug>.md`. Une procédure
propre à l'activité de {{owner}} va dans son contexte sous `{{r.pro}}/`.

## Frontmatter

```yaml
type: recipe
when_to_use: "Situation précise où suivre cette procédure"
sources: 1
```

## Corps

````markdown
# Pratique — Titre

Objectif : de l'état de départ au résultat vérifiable.

## Prérequis

- Outil, version et accès nécessaires, datés « au AAAA-MM-JJ ».

## Étapes

### 1. Étape

Commande ou action, puis résultat attendu.

## Vérification

Comment prouver que le résultat est atteint.

## Pièges

- Erreur fréquente et correction.

## Connexions

- [Source](../sources/<thème>/<page>.md) — origine de la procédure.
````

Chaque commande vient d'une source officielle ou d'une exécution constatée ;
ne jamais inventer un flag ou une option.
