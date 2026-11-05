# Gabarit — modèle (concept)

Modèle mental, framework ou pattern réutilisable, indépendant d'un projet.
Chemin : `{{r.savoir}}/modeles/<slug>.md`. Refuser une idée générique, un cas
d'usage unique ou un choix propre à un projet (qui va sous `{{r.pro}}/`).

## Frontmatter

```yaml
type: concept
aliases: []
```

## Corps

````markdown
# Nom du modèle

## Définition

Définition précise en un paragraphe.

## Problème résolu

Contexte, alternatives et critère de choix.

## Application

Procédure ou règles.

## Exemples

### Exemple 1

Application concrète.

### Exemple 2

Application dans un autre contexte.

## Limites

Compromis, risques et cas où ne pas utiliser le modèle.

## Connexions

- [Page canonique](../sujets/<thème>/<page>.md) — relation.
````

Relier chaque fait externe à une page sous `{{r.savoir}}/sources/`. Distinguer
les faits des interprétations de {{owner}} ou de l'agent.
