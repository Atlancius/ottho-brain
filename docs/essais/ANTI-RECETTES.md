# Anti-recettes

## `fs.renameSync` entre le cerveau et le dossier personnel

- **Cause** : `EXDEV` dès que les deux sont sur des volumes différents.
- **Signe d'alerte** : un `renameSync` dont source et destination ne sont pas
  dans le même dossier racine.
- **Alternative** : `moveSafe` du moteur.

## Écrire des `{{` dans un exemple de gabarit

- **Cause** : le moteur de rendu remplace ou laisse des variables inconnues.
- **Signe d'alerte** : `git grep "{{"` non vide dans un cerveau installé
  (hors `scripts/`).
- **Alternative** : placeholders `<comme-ceci>`.

## Répéter le chemin absolu dans le bloc de boot

- **Cause** : le bloc est chargé à chaque session de chaque projet.
- **Alternative** : définir `<racine>` une fois.
