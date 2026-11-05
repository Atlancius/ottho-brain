# Gabarit — entité

Fiche canonique d'une personne, organisation, client, entreprise, outil ou
projet notable et documenté. Pas de fiche pour une mention passagère.

| Entité | Destination |
|---|---|
| {{owner}} à titre personnel | `{{r.identite}}/` |
| activité ou entreprise de {{owner}} | sous `{{r.pro}}/` (dossier de l'activité) |
| client ou prospect | `{{r.pro}}/clients/<slug>/` (créer le dossier avec `nouveau-dossier` s'il manque) |
| projet ou site professionnel | `{{r.projets}}/<slug>/` (skill `fiche-projet` si installé) |
| personne publique de référence | `{{r.savoir}}/references/personnes/` |
| organisation publique de référence | `{{r.savoir}}/references/organisations/` |
| outil réutilisable | `{{r.savoir}}/references/outils/` |

Une fiche client ne contient que des informations professionnelles publiques
ou assainies : jamais de coordonnées privées, contrat, signature, identifiant,
montant ou note confidentielle.

## Frontmatter

```yaml
type: entity
entity_type: tool          # person | organization | company | client | activity | project | tool
sources: 1
aliases: []
```

## Corps

````markdown
# Nom affichable

## Résumé

Description factuelle et raison de sa présence dans le cerveau.

## Faits vérifiés

- Fait daté — [source canonique](../../sources/<thème>/<page>.md).

## Pertinence

Relation avec {{owner}}, son activité ou la base de connaissances.

## Connexions

- [Page canonique](../../sujets/<thème>/<page>.md) — nature de la relation.

## Liens publics vérifiés

- [Site officiel](https://example.org)
````

Lors d'une mise à jour, ajouter faits, alias et connexions nouveaux ; ne jamais
réécrire un fait valide sans preuve de correction.
