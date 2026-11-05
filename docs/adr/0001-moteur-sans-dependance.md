# ADR 0001 — Moteur sans dépendance

Date : 2026-11-05. Statut : acceptée.

## Contexte

BrainOS repose sur un toolchain Bun/TypeScript (retrieval, index, registres,
contrats, schémas AJV, lint PII, adaptateurs, puppeteer). Les élèves n'ont pas
forcément Bun, et un `npm install` est un point d'échec.

## Options

- **Port fidèle Bun** : le plus proche, mais exige Bun et des dépendances.
- **100 % Markdown** : aucun script, mais index et contrôles dérivent.
- **Moteur JS unique sans dépendance** : un fichier, Node ≥ 18 ou Bun.

## Décision

Moteur unique `brain.mjs` sans dépendance, choisi par Jeff le 2026-11-05.

## Conséquences

- Installation sans `npm install`, tourne partout où Claude Code ou Codex
  tourne avec Node.
- Pas de registres machine ni de schémas : les contrôles sont codés dans
  `check`.
- La recherche est un BM25 simple : moins fine que celle de BrainOS.
