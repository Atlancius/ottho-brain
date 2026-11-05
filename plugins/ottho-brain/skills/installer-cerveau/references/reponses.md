# Format du fichier de réponses

Fichier JSON lu par `scripts/install.mjs`. L'écrire dans le dossier temporaire
du système, jamais dans le cerveau. Chemins avec `/` (aussi sous Windows).

```json
{
  "name": "Cerveau de Léa",
  "owner": "Léa",
  "target": "C:/Users/lea/Documents/cerveau-lea",
  "tutoiement": true,
  "adopt": false,
  "domains": [
    {
      "role": "perso", "dir": "perso", "label": "Perso",
      "owns": "Léa à titre personnel : identité, préférences, objectifs.",
      "not": "Activité, clients et connaissance générale.",
      "children": [
        { "dir": "preferences", "label": "Préférences", "owns": "Goûts, outils et façons de travailler." }
      ]
    },
    {
      "role": "pro", "dir": "business", "label": "Business",
      "owns": "Le studio de Léa : offres, clients, marketing.",
      "not": "Vie privée et savoir réutilisable.",
      "children": [
        { "dir": "clients", "label": "Clients", "owns": "Fiches clients assainies." }
      ]
    },
    {
      "role": "savoir", "dir": "savoir", "label": "Savoir",
      "owns": "Connaissance durable et sourcée, réutilisable partout.",
      "not": "Faits propres à Léa ou à son activité."
    }
  ],
  "drop": { "dir": "raw", "label": "Boîte de dépôt" },
  "sas": { "dir": "sas", "label": "Le Sas" },
  "ingest_skill": "bouffe-tout",
  "packs": ["coeur", "rituels", "meta", "projets"],
  "runtimes": { "claude": true, "codex": true, "claude_rules_copy": true },
  "git": { "enabled": true, "commit_init": true },
  "obsidian": true,
  "pii_allow": [],
  "profile": {
    "usage": "freelance design",
    "activités": ["studio de design"],
    "attentes": "capitaliser ce que j'apprends, piloter mes projets"
  },
  "communication": {
    "language": "français",
    "rules": ["Réponses courtes et directes.", "Code d'abord, explication ensuite."]
  }
}
```

## Contraintes vérifiées par l'installateur

- Exactement un domaine de rôle `perso`, `pro` et `savoir` ; d'autres
  domaines possibles avec `role: "autre"`.
- `dir` : kebab-case ASCII, 41 caractères max, unique, différent de `ia`,
  `scripts` et des noms de la boîte de dépôt et du Sas.
- Chaque domaine a `label` et `owns`.
- `ingest_skill`, `drop.dir`, `sas.dir` : kebab-case ASCII.
- `profile` : seulement des informations publiques et professionnelles.
- `pii_allow` : valeurs publiques à ne pas signaler (e-mail pro public).
