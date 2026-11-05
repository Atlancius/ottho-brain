# Registre des erreurs

Append-only. Une fiche par bug : symptôme, cause racine, correctif, preuve,
comment bien faire du premier coup.

## E001 — Déplacement impossible entre deux disques (2026-11-05)

- **Symptôme** : rapatriement, `unsync` et corbeille en échec quand le cerveau
  et le dossier personnel sont sur deux volumes (D: et C:). Repéré en revue
  par le sous-agent du pack méta.
- **Cause** : `fs.renameSync` lève `EXDEV` entre volumes.
- **Correctif** : `moveSafe` (rename, sinon copie vérifiée puis retrait de la
  source) ; rapatriement enveloppé élément par élément dans un `try`.
- **Preuve** : `tests/smoke.mjs` sections 3 et 6.
- **Du premier coup** : tout déplacement de fichier entre le cerveau et `~`
  passe par `moveSafe`, jamais par `renameSync`.

## E002 — Instructions de route exigées comme des pages (2026-11-05)

- **Symptôme** : premier test d'installation, `check` en erreur sur
  `perso/--instructions.md` (canonical_id et classification manquants).
- **Cause** : `--instructions.md` traité comme une page de contenu.
- **Correctif** : contrôle dédié aux instructions (title, tldr, domain).
- **Preuve** : installation t2 « checks: OK ».

## E003 — Faux positif téléphone dans un identifiant (2026-11-05)

- **Symptôme** : avertissement « téléphone détecté » sur
  `bno_0123456789abcdef…` dans le gabarit de `note-ca`.
- **Cause** : motif sans garde sur les caractères de mot.
- **Correctif** : `(?<![\w.+])…(?![\w])`.
- **Preuve** : `pii` à 0 avertissement sur un cerveau neuf.

## E004 — Skill homonyme rapatrié en double (2026-11-05)

- **Symptôme** : un `~/.claude/skills/note-ca` existant était copié dans
  `ia/skills/importes/note-ca`, d'où deux skills du même nom.
- **Cause** : `importApply` ne comparait qu'au dossier cible, pas aux noms
  des skills déjà présents dans le cerveau.
- **Correctif** : refus d'un skill dont le `name` existe déjà dans le cerveau.
- **Preuve** : `tests/smoke.mjs` « rapatriement de 3 composants, homonyme laissé ».
- **Du premier coup** : dédoublonner sur le nom fonctionnel, pas sur le chemin.

## E005 — Bloc de boot trop long (2026-11-05)

- **Symptôme** : chemin absolu répété huit fois dans `~/.claude/CLAUDE.md`,
  chargé à chaque session.
- **Cause** : commandes écrites avec `cd "<chemin>"` à chaque ligne.
- **Correctif** : `<racine>` défini une fois, commandes relatives, texte par
  runtime.
- **Preuve** : bloc régénéré, `verify` vert.

## E006 — `ia-search` remontait les annexes des skills (2026-11-05)

- **Symptôme** : « ingérer un pdf » renvoyait `references/source.md` sans
  résumé au lieu du skill d'ingestion.
- **Cause** : tous les `.md` de `ia/` indexés, sans racinisation.
- **Correctif** : un skill indexé par son seul `SKILL.md`, racinisation légère,
  préfixe réciproque, instructions exclues de `search`.
- **Preuve** : `tests/smoke.mjs` section 5.
