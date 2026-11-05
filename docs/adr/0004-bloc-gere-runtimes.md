# ADR 0004 — Bloc géré dans ~/.claude/CLAUDE.md et ~/.codex/AGENTS.md

Date : 2026-11-05. Statut : acceptée.

## Contexte

Jeff demande que le plugin modifie le `CLAUDE.md` de `~/.claude` et le
`AGENTS.md` de `~/.codex` pour pointer vers le cerveau. Ces fichiers
contiennent souvent déjà des consignes de l'élève.

## Options

- Remplacer le fichier : perte des consignes existantes.
- Ajouter à la fin : le boot du cerveau est lu après des consignes qui
  peuvent le contredire, et la mise à jour est difficile.
- **Bloc balisé en tête**, régénéré à l'identique, reste du fichier préservé,
  sauvegarde avant chaque changement.

## Décision

Bloc `<!-- ottho-brain:<slug>:start -->` … `<!-- ottho-brain:<slug>:end -->`
en tête, court (aucun fait), différent par runtime : Claude reçoit déjà les
règles par `~/.claude/rules/<slug>/`, Codex est invité à lire
`ia/rules/core/*.md`.

## Conséquences

- `verify` détecte un bloc périmé ; `unsync` retire le bloc et rend le
  fichier d'origine.
- Le slug dans les balises permet plusieurs cerveaux sur une machine.
- Le chemin du cerveau est absolu dans le bloc : un déplacement exige
  `node scripts/brain.mjs sync` (géré par `reparer-cerveau`).
