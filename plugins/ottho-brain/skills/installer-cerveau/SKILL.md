---
name: installer-cerveau
description: "Installe un second cerveau complet sur le modèle BrainOS par un questionnaire interactif : profil, emplacement, structure des dossiers, noms de la boîte de dépôt, du Sas et du skill d'ingestion, sécurité, Git, branchement de Claude Code (~/.claude/CLAUDE.md) et Codex (~/.codex/AGENTS.md), rapatriement des skills existants, packs de skills. Utiliser sur « installe mon second cerveau », « crée mon cerveau », « setup ottho-brain », « je veux un BrainOS »."
---

# Installer un second cerveau

Convention de chemins : `${CLAUDE_SKILL_DIR}` = dossier de ce skill (dans
Codex : le dossier qui contient ce SKILL.md). Le plugin est
`${CLAUDE_SKILL_DIR}/../..` : installateur `scripts/install.mjs`, moteur
`engine/brain.mjs`, gabarits `templates/`.

Objectif : livrer à la personne le meilleur second cerveau pour **sa** façon de
ranger, aussi solide que BrainOS : hub `index.md`, routes à responsabilité
exclusive, index locaux générés, règles, plan de contrôle `ia/`, Sas
d'ingestion C0–C4, journal append-only signé, Git local avec hook, moteur de
recherche sans dépendance, branché sur Claude Code et Codex.

## Règles de conduite

- **Interactif, jamais à l'arrache.** Une phase à la fois. Chaque question
  propose une option recommandée en premier et accepte une réponse libre.
  Claude : outil `AskUserQuestion` (4 questions maximum par appel). Codex ou
  sans outil : poser les questions dans le chat, numérotées, avec les options.
- Adapter les questions suivantes aux réponses précédentes : une étudiante ne
  reçoit pas les mêmes sous-dossiers qu'un freelance.
- Ne jamais demander ni écrire une donnée privée : adresse, téléphone,
  e-mail, date de naissance, santé, revenus, identifiants. Le profil reste
  professionnel et public. Si la personne en donne, ne pas les reprendre.
- Rien n'est écrit avant le récapitulatif validé (phase 7). Rien n'est modifié
  dans `~/.claude` ou `~/.codex` avant un second oui (phase 9).
- Tutoyer par défaut ; vouvoyer si la personne vouvoie.

## Phase 0 — Détection (sans question)

1. Système : `node --version` (18 ou plus exigé ; sinon `bun --version`).
   Aucun des deux : expliquer comment installer Node.js LTS (nodejs.org) et
   s'arrêter.
2. `git --version` ; identité : `git config --global user.name` et
   `user.email` (ne pas les afficher en entier, dire seulement si elles sont
   présentes).
3. Runtimes : existence de `~/.claude/` et de `~/.codex/` (ou `$CODEX_HOME`).
   Lire `~/.claude/CLAUDE.md` et `~/.codex/AGENTS.md` s'ils existent :
   noter s'ils contiennent déjà un bloc `ottho-brain:` (cerveau déjà
   installé → proposer `reparer-cerveau` et s'arrêter si la personne préfère).
4. Inventaire des composants existants (lecture seule) :
   `node "${CLAUDE_SKILL_DIR}/../../scripts/install.mjs" --inventory` : skills
   de `~/.claude/skills`, `~/.agents/skills`, `~/.codex/skills`, agents,
   commandes et règles de `~/.claude`, avec les liens externes signalés.
5. Obsidian : présence d'un dossier `.obsidian` dans les emplacements usuels
   proposés plus tard (Documents, dossier personnel).

Annoncer en trois lignes ce qui a été trouvé, puis lancer la phase 1.

## Phases 1 à 6 — Questionnaire

Suivre [questionnaire](references/questionnaire.md) : profil (1), emplacement
et nom (2), structure des dossiers (3, avec les
[modèles de structure](references/structures.md)), ingestion (4), sécurité et
Git (5), IA : Claude, Codex, rapatriement, packs et style de réponse (6).

## Phase 7 — Récapitulatif et aperçu

1. Écrire les réponses dans un fichier temporaire **hors** du futur cerveau
   (dossier temporaire du système), au format de
   [réponses](references/reponses.md).
2. `node "${CLAUDE_SKILL_DIR}/../../scripts/install.mjs" --preview --config "<reponses.json>"`.
3. Présenter : emplacement, arbre des dossiers, noms choisis (boîte de dépôt,
   Sas, skill d'ingestion), packs et liste des skills, ce qui changera dans
   `~/.claude` et `~/.codex` (phase 9), rapatriement prévu.
4. Demander : « On installe ? » (oui / modifier un point / annuler). Modifier
   → revenir à la seule phase concernée, puis nouvel aperçu.

## Phase 8 — Installation

1. `node "${CLAUDE_SKILL_DIR}/../../scripts/install.mjs" --config "<reponses.json>"`.
   Il crée l'arborescence, les règles, les workflows, les skills (le skill
   d'ingestion sous le nom choisi), le moteur `scripts/brain.mjs`, le profil,
   les index, le premier événement du journal signé, `git init` avec le hook
   pre-commit et le commit initial si l'identité Git existe.
2. Lire le JSON de sortie. `checks` différent de `OK` : corriger (souvent un
   nom de dossier), sinon s'arrêter et rapporter. `commit` « non fait » :
   expliquer `git config --global user.name "<Nom>"` et `user.email`, sans
   les configurer à la place de la personne, puis proposer de faire le commit
   initial ensuite (`git add -A && git commit -m "feat: installer le second cerveau"`
   dans le cerveau, seul cas où l'ajout global est admis : rien n'y est encore
   suivi).
3. Supprimer le fichier de réponses temporaire avec la corbeille du système
   ou le laisser dans le dossier temporaire ; ne jamais le copier dans le
   cerveau.

## Phase 9 — Brancher Claude et Codex

1. Depuis la racine du cerveau : `node scripts/brain.mjs sync --dry-run`.
2. Montrer exactement ce qui change :
   - le **bloc géré** ajouté en tête de `~/.claude/CLAUDE.md` et de
     `~/.codex/AGENTS.md` : afficher le `CLAUDE.md` de la racine du cerveau,
     identique au bloc à ceci près que le chemin y devient absolu ; le reste
     des fichiers est conservé tel quel et sauvegardé dans
     `.local/backups/home/` ;
   - les liens de skills créés dans `~/.claude/skills/` et `~/.agents/skills/` ;
   - les règles copiées dans `~/.claude/rules/<slug>/` ;
   - les conflits (skill du même nom déjà présent : jamais écrasé).
3. Demander l'accord explicite. Oui → `node scripts/brain.mjs sync` puis
   `node scripts/brain.mjs verify`. Un conflit de nom : proposer de renommer
   le skill du cerveau (dossier + `name`), puis relancer.
4. Non → expliquer que le cerveau marche seulement quand on lance Claude ou
   Codex depuis son dossier (pointeurs locaux `CLAUDE.md` et `AGENTS.md`), et
   que `node scripts/brain.mjs sync` le branchera plus tard.

## Phase 10 — Rapatriement (si choisi en phase 6)

Dérouler le skill `rapatrie-ia` installé dans le cerveau (lire
`ia/skills/meta-ia/rapatrie-ia/SKILL.md`), avec la portée choisie : tout,
une sélection, ou les seuls skills. Sans pack méta :
`node scripts/brain.mjs import --list`, accord, puis
`node scripts/brain.mjs import --apply [--only …]`, `build`, `sync`, `verify`,
et commit via le contrat de mutation (`event_type: import`).

## Phase 11 — Preuve et prise en main

1. `node scripts/brain.mjs doctor` : tout vert attendu. Afficher le résultat.
2. Test de recherche : `node scripts/brain.mjs search "profil"` doit trouver la
   page de profil.
3. Proposer une première ingestion guidée (recommandé) : la personne pose un
   article ou une note dans la boîte de dépôt, puis on lance le skill
   d'ingestion. Ou une première note avec `note-ca`.
4. Expliquer en une minute [la prise en main](references/prise-en-main.md) :
   Obsidian (ouvrir le dossier comme coffre), Web Clipper vers la boîte de
   dépôt, les phrases à dire au quotidien, la mise à jour par
   `reparer-cerveau`, et le fait qu'il faut **redémarrer** Claude Code ou
   Codex pour que les nouveaux skills et le bloc de boot soient chargés.

## Rapport final

Emplacement du cerveau, routes et sous-dossiers, nom de la boîte de dépôt, du
Sas et du skill d'ingestion, packs et nombre de skills, état Git (SHA du
commit), fichiers `~/.claude` et `~/.codex` modifiés (avec chemin des
sauvegardes), éléments rapatriés et laissés en place, résultat de `doctor`,
et les trois phrases à essayer en premier.
