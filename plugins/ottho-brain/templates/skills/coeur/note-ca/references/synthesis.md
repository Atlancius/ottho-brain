# Gabarit — synthèse

Croisement d'au moins trois pages canoniques qui produit un insight absent des
pages isolées. Exiger l'accord de {{owner}} pour l'archiver. Refuser un simple
résumé, une réponse ponctuelle ou une compilation sans apport.

Destination : analyse personnelle → `{{r.perso}}/` ; activité ou projet →
`{{r.pro}}/` ; synthèse réutilisable → `{{r.savoir}}/syntheses/<thème>/`.
Jamais sous `ia/`.

## Frontmatter

```yaml
type: synthesis
sources: 3          # pages croisées
```

## Corps

````markdown
# Synthèse — Thème

## Réponse directe

Conclusion en quelques phrases.

## Question et périmètre

Ce que la synthèse couvre et exclut.

## Pages croisées

| Page canonique | Apport |
|---|---|
| [Page](../../sujets/<thème>/<page>.md) | Fait ou angle utilisé |

## Analyse

Convergences, tensions, arbitrages et insight nouveau.

## Conclusion actionnable

- Recommandation et conditions.

## Limites

- Incertitudes, contradictions et données à rafraîchir.

## Connexions

- [Page canonique](../../sujets/<thème>/<page>.md) — relation.
````

Propager un backlink vers la synthèse seulement dans les pages réellement
concernées. Journal : `query-filed`.
