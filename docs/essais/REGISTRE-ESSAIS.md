# Registre des essais

Append-only. Une fiche par essai, retenu ou non.

| # | Date | Essai | Recette | Résultat | Verdict |
|---|---|---|---|---|---|
| 1 | 2026-11-05 | Installation t1 (3 routes, pas de skill) | `install.mjs --config` dans le scratchpad, faux HOME | `check` en erreur sur `--instructions.md` | rejeté → E002 |
| 2 | 2026-11-05 | Installation t2 après correctif | idem | 36 fichiers, commit initial, hook actif, Sas ignoré par Git | retenu |
| 3 | 2026-11-05 | Installation t3 complète (4 packs, 18 skills) + sync + import | faux HOME avec skill, agent, règle, CLAUDE.md et AGENTS.md existants | sync, jonctions, règles copiées, rapatriement, mutation signée et commit OK ; faux positif téléphone, bloc de boot verbeux | retenu après E003, E005 |
| 4 | 2026-11-05 | Tests de sécurité de l'ingestion | dépôt de zip, js, faux pdf, fichier vide, clipping YouTube, note avec IBAN | blocages corrects ; commit d'une clé AWS refusé ; journal réécrit détecté | retenu |
| 5 | 2026-11-05 | Installation t4 personnalisée | routes `moi/etudes/connaissances`, dépôt `inbox`, Sas `entree`, skill `digere`, packs cœur+rituels, Claude seul, vouvoiement | aucune variable non rendue, checks OK, mise à jour à blanc sans écrasement | retenu |
| 6 | 2026-11-05 | Validation des manifestes | `claude plugin validate .` et `plugins/ottho-brain` | « Validation passed » ×2 | retenu |
| 7 | 2026-11-05 | Installation Codex | `CODEX_HOME` temporaire, `codex plugin marketplace add`, `codex plugin add ottho-brain@ottho-brain` | plugin installé, skills `installer-cerveau` et `reparer-cerveau` présents dans le cache | retenu |
| 8 | 2026-11-05 | Recette automatisée | `node tests/smoke.mjs` | 55/57 puis 57/57 après E004 et correction des attentes du test | retenu |
| 9 | 2026-11-05 | Installation depuis GitHub, comme un élève | dépôt public Atlancius/ottho-brain ; `CLAUDE_CONFIG_DIR` et `CODEX_HOME` temporaires ; `marketplace add` puis `install`/`add` | installé sur Claude Code et Codex, skills du plugin présents | retenu |
| 10 | 2026-11-05 | Couverture marketplace | Codex `image_gen`, références : couvertures Ottho Hermes VPS et Ottho Blog ; prompt et sortie dans `D:/Marketing/Projets/Ottho-Brain-Plugin-2026-11-05/manifest.json` | 1672×941, style conforme, aucun texte | retenu au premier essai |
