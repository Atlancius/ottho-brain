# Gabarits de doc-projet

Copier dans le projet et remplacer chaque `<placeholder>`. Omettre une section
vide plutôt que d'écrire « N/A ».

## docs/README.md

```markdown
# <Nom du projet>

<Objectif en une phrase : pour qui, pour quoi.>

## Stack

| Élément | Version | Source |
|---|---|---|
| <framework ou outil> | <version> | <lockfile ou fichier de config> |

## Commandes

| Action | Commande |
|---|---|
| Lancer | `<commande>` |
| Tester | `<commande>` |
| Déployer | `<commande>` |

## Variables d'environnement

| Nom | Rôle |
|---|---|
| `<NOM_DE_CLE>` | <à quoi elle sert> — valeur jamais écrite ici |

## Documentation

- [Journal](JOURNAL.md)
- [Décisions](adr/README.md)
- [Erreurs](erreurs/REGISTRE-ERREURS.md)
- [Essais](essais/REGISTRE-ESSAIS.md) · [Recettes](essais/RECETTES.md) · [Anti-recettes](essais/ANTI-RECETTES.md)

## Ce qui n'est pas documenté

- <zone connue mais non décrite, et pourquoi>
```

## docs/JOURNAL.md

```markdown
# Journal — <Nom du projet>

Append-only : une entrée par séance, la plus récente en bas.

## AAAA-MM-JJ — <titre court>

- Fait : <action> (`<sha>`)
- Essais : <E-NNN verdict>
- Décisions : <ADR-NNNN>
- Erreurs : <ERR-NNN>
- Reste : <prochaine étape>
```

## docs/adr/README.md

```markdown
# Décisions

| N° | Titre | Statut | Date |
|---|---|---|---|
| [0001](0001-<slug>.md) | <titre> | accepted | AAAA-MM-JJ |
```

## docs/adr/NNNN-slug.md

```markdown
# ADR-NNNN — <Titre>

Statut : proposed | accepted | superseded par ADR-NNNN · Date : AAAA-MM-JJ

## Contexte
<Pourquoi décider maintenant, contraintes, faits cités.>

## Options
### A — <option>
- Pour : <…>
- Contre : <…>
### B — <option>
- Pour : <…>
- Contre : <…>

## Décision
Pour <besoin>, choisir <option> plutôt que <autre>, parce que <raison>.

## Conséquences
- Positives : <…>
- Négatives acceptées : <…>

## Quand réviser
- <condition observable>
```

## docs/erreurs/REGISTRE-ERREURS.md

```markdown
# Registre des erreurs

| N° | Symptôme | Statut | Date |
|---|---|---|---|
| ERR-001 | <symptôme> | corrigé | AAAA-MM-JJ |

## ERR-001 — <symptôme>

- Date : AAAA-MM-JJ
- Symptôme : <ce qu'on observe, exactement>
- Cause racine : <cause, citée ou (déduction)>
- Correctif : <ce qui a été changé> (`<sha>`)
- Preuve : <test, capture, commande qui montre que c'est réglé>
- Bien faire du premier coup : <la consigne qui aurait évité l'erreur>
```

## docs/essais/REGISTRE-ESSAIS.md

```markdown
# Registre des essais

| N° | Sortie | Verdict | Date |
|---|---|---|---|
| E-001 | <fichier ou URL> | retenu | AAAA-MM-JJ |

## E-001 — <sortie>

- Date : AAAA-MM-JJ
- Intention : <ce qu'on voulait obtenir>
- Ce qui a changé : <par rapport à l'essai précédent>
- Recette exacte : outil <nom> <version> · commande `<commande>` · paramètres <…> · prompt « <…> » · seed <…>
- Résultat : <description factuelle>
- Retour de {{owner}} (mot pour mot) : « <…> »
- Ce qui allait : <…>
- Ce qui n'allait pas : <…> — cause : <…>
- Verdict : retenu | rejeté | à refaire
```

## docs/essais/RECETTES.md

```markdown
# Recettes

Méthodes éprouvées à réutiliser telles quelles.

## R-001 — <résultat obtenu>

Source : E-001 · Date : AAAA-MM-JJ

1. <étape exacte, avec outil, version et paramètres>
2. <étape>

Vérification : <comment savoir que c'est réussi>
```

## docs/essais/ANTI-RECETTES.md

```markdown
# Anti-recettes

Ce qu'il ne faut jamais refaire.

## AR-001 — <ce qui a échoué>

Source : E-002 · Date : AAAA-MM-JJ

- Cause : <pourquoi ça échoue>
- Signe d'alerte : <ce qui doit faire arrêter tôt>
- Alternative : <ce qu'il faut faire à la place> (R-NNN)
```
