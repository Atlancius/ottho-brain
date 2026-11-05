# Gabarit — décision (ADR)

Choix durable et non trivial, compréhensible lors d'une future session.
Destination selon le périmètre :

- choix personnel sans lien avec l'activité → contexte sous `{{r.perso}}/` ;
- choix d'activité, de client, de site ou de projet → contexte sous `{{r.pro}}/` ;
- décision méthodologique ou technique réutilisable →
  `{{r.savoir}}/decisions/AAAA-MM-JJ-<slug>.md`.

Jamais sous `ia/` : si la décision change un comportement d'agent, modifier
séparément le composant dans `ia/` et y lier la décision. Refuser une
micro-décision réversible sans effet durable.

## Frontmatter

```yaml
type: decision
status: accepted        # proposed | accepted | superseded
supersedes: []          # chemins des décisions remplacées
```

## Corps

````markdown
# ADR — Titre court

## Contexte

Pourquoi décider maintenant, contraintes et faits sourcés.

## Options

### Option A

- Bénéfices
- Coûts et risques

### Option B

- Bénéfices
- Coûts et risques

## Décision

Une phrase : pour X, choisir Y plutôt que Z, parce que W.

## Raisons

1. Argument prouvé.

## Conséquences

- Positives
- Négatives acceptées
- Incertitudes

## Quand réviser

- Condition observable.

## Connexions

- [Page canonique](../sujets/<thème>/<page>.md) — impact.
````

Pour remplacer une décision : nouvelle ADR, `supersedes` renseigné, ancienne en
`status: superseded`. Ne jamais supprimer l'historique. Journal : `decision`.
