# ADR 0002 — Skills installés dans le cerveau, pas servis par le plugin

Date : 2026-11-05. Statut : acceptée.

## Contexte

Le nom du skill d'ingestion est choisi par l'élève, et les skills doivent
connaître les noms de ses dossiers. Un skill servi par le plugin a un nom et
un texte figés.

## Options

- **Skills dans le plugin** : mis à jour avec le plugin, mais noms figés et
  chemins génériques.
- **Skills rendus dans `ia/skills/` du cerveau** et projetés vers
  `~/.claude/skills` et `~/.agents/skills` : noms et chemins personnalisés,
  même modèle que BrainOS (canonique dans `ia/`, projections ailleurs).

## Décision

Rendre les skills dans le cerveau. Le plugin ne garde que `installer-cerveau`
et `reparer-cerveau`. Les gabarits restent sous `templates/` (hors du dossier
`skills/` découvert par les runtimes).

## Conséquences

- Le cerveau fonctionne même sans le plugin.
- La mise à jour passe par `install.mjs --upgrade` : un gabarit modifié par
  l'élève n'est jamais écrasé (empreintes dans `ia/registre/installation.json`).
- Conflit possible avec un skill homonyme existant : jamais écrasé, signalé.
