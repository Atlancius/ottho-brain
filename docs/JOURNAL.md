# Journal

Append-only.

## 2026-11-05 — Création du plugin 1.0.0

- Demande de Jeff : plugin Ottho Academy qui déploie un second cerveau au plus
  près de BrainOS, interactif, branché sur `~/.claude/CLAUDE.md` et
  `~/.codex/AGENTS.md`, rapatriement des skills dans `ia/`, skill d'ingestion
  et dossier de dépôt nommés par l'élève, skills utiles, Claude et Codex.
- Cadrage validé par Jeff : moteur sans dépendance, sécurité complète
  (Sas, C0–C4, journal, Git), quatre packs (cœur, rituels, méta IA, projets),
  dépôt `ottho-brain` dans `D:\Projets Dev`.
- Lecture de BrainOS en lecture seule : `index.md`, README, Sas,
  classification, source de vérité, `bouffe-tout` et ses références,
  `write-page` et ses gabarits, `update-index`, `append-log`, `brainos-lint`,
  processus Git.
- Écrit : moteur `brain.mjs`, installateur `install.mjs`, gabarits du
  cerveau, 18 skills de cerveau (packs rituels+projets et méta écrits par deux
  sous-agents en parallèle, relus par la recette), skills `installer-cerveau`
  et `reparer-cerveau`, manifestes Claude et Codex, recette `tests/smoke.mjs`.
- Bugs E001 à E006 corrigés. Recette 57/57, `claude plugin validate` vert,
  installation Codex prouvée dans un `CODEX_HOME` temporaire.
- Non fait : publication GitHub et marketplace Ottho (attend Jeff), session
  réelle du questionnaire avec un humain.

## 2026-11-05 — Publication

- Dépôt GitHub `Atlancius/ottho-brain` créé en privé, historique réécrit avec l'adresse noreply (accord de Jeff, E007), puis rendu public sur sa demande.
- Installation prouvée depuis GitHub sur Claude Code et Codex dans des configurations temporaires.
- Couverture générée avec Codex `image_gen`, rangée dans `D:/Marketing/Projets/Ottho-Brain-Plugin-2026-11-05`, ajoutée au README.
- Fiche `plugin-ottho-brain` créée en brouillon puis publiée sur la marketplace Ottho Academy, étagère Agents (choix de Jeff).
- Reste : faire jouer le questionnaire par un élève réel et recueillir son retour.
