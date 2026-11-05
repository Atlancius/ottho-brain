---
name: doc-projet
description: "Documente un projet (site, app, code, création, motion) dans son propre dossier et garde sa doc vraie : stack et versions, choix en ADR, erreurs (symptôme, cause, correctif, preuve), essais avec recettes et anti-recettes, JOURNAL daté. Modes init, --audit, --sync, --adr, --err, --essai. Utiliser sur « documente ce projet », « mets à jour la doc », « note cet essai », « ADR », « fiche d'erreur », en fin de séance de travail."
---

# Doc projet

Chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans Codex : le dossier
qui contient ce SKILL.md) ; `references/` est relatif à lui.

Applique la règle `ia/rules/core/documentation.md` du cerveau : ne jamais
refaire deux fois la même erreur. La doc vit dans le **dossier du projet**
(`docs/`), jamais dans le cerveau ni seulement dans le chat. Le cerveau garde la
fiche du projet (`fiche-projet`) qui pointe vers cette doc.

## Invariants

- Racine du projet : `git rev-parse --show-toplevel`, sinon le dossier courant
  confirmé par {{owner}}. Aucune écriture hors de cette racine.
- Propriété : ne jamais écraser un fichier écrit à la main. Une page existante
  est enrichie (ajout en fin de section, ou section neuve) ; un conflit est
  montré en diff et attend un oui.
- `JOURNAL.md` et les registres sont append-only : on ajoute, on ne réécrit pas.
- Aucun pourquoi inventé : chaque raison est citée (commit `sha`, fichier
  `chemin:ligne`, parole de {{owner}} mot pour mot), marquée `(déduction)` avec
  l'observation qui la fonde, ou posée en question ouverte.
- Secrets : ne jamais lire `.env*`, `*.pem`, `*.key`, `*credentials*`, ni un
  fichier ignoré par git ; d'un `.env.example`, seulement les noms de clés.
  Nommer une variable, jamais sa valeur.
- Aucun commit, push ou PR dans le projet sans demande explicite de {{owner}}.
- Lecture seule du code : aucune commande d'install, de build ou de migration
  pour documenter.

## Mode

Choisir par l'argument, sinon par l'état : pas de `docs/JOURNAL.md` → `init` ;
sinon → `--sync`.

| Mode | Effet | Écrit |
|---|---|---|
| `init` | Crée l'arborescence `docs/` depuis les gabarits, remplit la stack détectée, première entrée de JOURNAL. | oui |
| `--audit` | Lit la doc et le dépôt, liste ce qui manque ou est périmé (stack, décisions non tracées, essais sans fiche). | non |
| `--sync` | Après une séance : nouveaux commits depuis la dernière entrée de JOURNAL, essais du jour, décisions et erreurs à ficher. | oui |
| `--adr "<sujet>"` | Une décision au format ADR, numéro suivant, ligne d'index. | oui |
| `--err "<symptôme>"` | Une fiche au registre des erreurs. | oui |
| `--essai "<sortie>"` | Une fiche au registre des essais, puis recette ou anti-recette. | oui |

## Arborescence

```text
<projet>/
├── docs/
│   ├── README.md                 carte du projet : objectif, stack et versions, liens
│   ├── JOURNAL.md                entrées datées, append-only
│   ├── adr/
│   │   ├── README.md             index des décisions
│   │   └── 0001-<slug>.md
│   ├── erreurs/
│   │   └── REGISTRE-ERREURS.md
│   └── essais/
│       ├── REGISTRE-ESSAIS.md
│       ├── RECETTES.md
│       └── ANTI-RECETTES.md
└── AGENTS.md / CLAUDE.md         pointeur vers docs/README.md, posé une fois
```

Gabarits exacts : [references/gabarits.md](references/gabarits.md).

## Workflow

1. **Situer** : racine du projet, `git status -sb` (arbre sale : écrire
   seulement les fichiers de doc, l'annoncer), dernière entrée de
   `docs/JOURNAL.md`, `git log --oneline` depuis cette date.
2. **Détecter la stack** en lecture seule : manifestes (`package.json`,
   lockfile, `pyproject.toml`, `Cargo.toml`, `go.mod`, `composer.json`,
   `Gemfile`…), fichiers de config (framework, bundler, déploiement). Version =
   celle du lockfile quand il existe. Pour une création (vidéo, image, motion) :
   outils, versions, formats de sortie.
3. **Écrire selon le mode** :
   - `init` : copier les gabarits, remplir `docs/README.md` (objectif demandé à
     {{owner}} en une question si absent), première entrée de JOURNAL ; poser le
     pointeur dans `AGENTS.md` ou `CLAUDE.md` du projet (une ligne, ajoutée,
     jamais en remplaçant le contenu) :
     `Avant de modifier ce projet, lire docs/README.md, docs/essais/RECETTES.md et docs/essais/ANTI-RECETTES.md.`
   - `--sync` : une entrée de JOURNAL datée (ce qui a été fait, commits cités,
     ce qui reste) ; pour chaque choix durable repéré, proposer un ADR ; pour
     chaque correctif (`fix:` dans les commits), proposer une fiche d'erreur ;
     pour chaque rendu, build ou export de la séance, exiger sa fiche d'essai.
   - `--adr`, `--err`, `--essai` : une fiche selon son gabarit, numéro suivant,
     ligne ajoutée à l'index du registre.
4. **Essais** : toute sortie (rendu, export, build, prompt, version), retenue
   ou non, a sa fiche dès qu'elle sort : intention, ce qui a changé, recette
   exacte (outil, version, commande, paramètres, prompt, seed), résultat, retour
   de {{owner}} mot pour mot, ce qui allait, ce qui n'allait pas et pourquoi,
   verdict. Verdict retenu → étapes dans `RECETTES.md` ; rejeté →
   `ANTI-RECETTES.md` avec cause, signe d'alerte et alternative. Une fiche
   ratée n'est jamais supprimée.
5. **Avant de recoder une partie** (quand {{owner}} annonce une reprise) : lire
   et résumer en cinq lignes les recettes, anti-recettes, ADR et erreurs qui la
   concernent, avant toute modification.
6. **Remonter au cerveau** (proposer, ne pas exécuter sans accord) :
   {{#if has.projets}}- mettre à jour la fiche du projet par `fiche-projet` (statut, prochaine étape, lien vers `docs/README.md`) ;{{/if}}
   - une leçon réutilisable hors de ce projet → proposer une règle dans
     `ia/rules/` du cerveau (forme dans `ia/rules/--instructions.md`), avec le
     projet en source ;
   - une connaissance générale apprise → `note-ca`.
7. **Vérifier** : chaque lien relatif de `docs/` résout, aucune valeur de
   secret, aucune fiche d'essai sans verdict.

## Rapport final

Mode, fichiers créés et modifiés (chemins), fiches ajoutées (ADR, erreurs,
essais), questions ouvertes à {{owner}}, propositions de remontée au cerveau.
Rappeler que rien n'est commité dans le projet sauf demande.

## Exemple

Fin de séance sur un site : trois commits, dont `fix: menu mobile invisible`,
et deux rendus de la page d'accueil.
→ `--sync` : entrée de JOURNAL ; fiche d'erreur « menu mobile invisible »
(cause tirée du diff) ; deux fiches d'essai, l'une retenue (recette ajoutée),
l'autre rejetée (anti-recette) ; fiche projet du cerveau proposée à jour.
