---
name: ajoute-log
description: "Ajoute à log.md un seul événement assaini et append-only, signé par le HMAC du manifeste privé de la mutation, puis stage exactement ce manifeste. Utiliser à la fin de toute mutation validée du cerveau (ingestion, note, décision, maintenance, rituel, import, correction), avant le commit."
---

# Ajoute log

Ajouter un seul événement à la fin de `log.md`. Ne jamais modifier,
réordonner, consolider ou supprimer un octet historique : le hook Git refuse un
journal réécrit.

## Entrée

- `event_type` parmi `ingest`, `query-filed`, `lint`, `daily`, `weekly`,
  `monthly`, `session`, `init`, `maintenance`, `decision`, `migration`,
  `release`, `incident`, `correction`, `import`, `sync` ;
- `event_id` unique et immuable `evt_<sujet>_<AAAAMMJJ>` (minuscules, chiffres,
  tirets ; suffixe `_2` si déjà pris le même jour) ;
- titre de huit mots maximum ;
- description C4 : totaux et racines seulement, jamais un nom privé, un chemin
  sensible, une URL avec paramètre, un extrait, un montant ou un identifiant.
- Pour `correction` : `--corrects <event_id>` existant.

## Procédure

1. Créer le manifeste privé :
   `node scripts/brain.mjs manifest init <event_id>` → crée
   `.local/private/staging/<event_id>.json` (hors Git) avec `log.md` déjà déclaré.
2. Y déclarer exactement les chemins de la mutation :
   ```json
   { "event_id": "<event_id>", "created": ["<chemin>"], "modified": ["log.md", "<index régénéré>"], "deleted": [], "moved": [{ "from": "<a>", "to": "<b>" }] }
   ```
   Sources : la liste de l'appelant et la sortie de
   `git status --porcelain=v1 -uall` après `build`. Aucun changement antérieur
   de {{owner}}, aucun fichier de `{{drop.dir}}/`, de {{sas.label}} ou de `.local/`.
3. Journaliser :
   ```bash
   node scripts/brain.mjs log --type <type> --id <event_id> --title "<titre>" --manifest .local/private/staging/<event_id>.json --body "<description C4>" --actor <claude|codex>
   ```
   Le moteur calcule le HMAC (clé locale `.local/private/hmac.key`), ajoute
   l'entrée et prouve que le préfixe du journal est intact. Un événement déjà
   présent n'est pas dupliqué.
4. Stager exactement :
   `node scripts/brain.mjs stage --manifest .local/private/staging/<event_id>.json`.
   Le moteur refuse un chemin hors cerveau, un glob, un dépôt du Sas, un index
   Git déjà chargé hors manifeste, et vérifie que l'index Git = le manifeste.
5. Retourner l'`event_id` et le résultat du staging. Le commit appartient à
   l'appelant (`git commit -m "<type>(<route>): <action>"`).

## Format produit

```markdown
## [AAAA-MM-JJTHH:MM:SS+01:00] maintenance | evt_<sujet>_<AAAAMMJJ> | Titre court
<!-- brain:event {"actor":"claude","manifest_hmac":"hmac-sha256:…"} -->

Description concise et non sensible.
```

Corriger un fait ancien : nouvel événement `correction`, jamais une réécriture.
