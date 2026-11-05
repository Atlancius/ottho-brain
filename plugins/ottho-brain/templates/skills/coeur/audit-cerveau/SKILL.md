---
name: audit-cerveau
description: "Audite le cerveau de {{owner}} sans rien modifier : index, liens, frontmatter, classification, secrets et données privées, Git, projections Claude et Codex, pages orphelines ou périmées ; constats classés par sévérité avec au plus trois corrections proposées. Utiliser sur « audite mon cerveau », « santé du cerveau », « audit-cerveau », une fois par mois ou après une mise à jour du plugin."
---

# Audit cerveau

Lecture seule. Commandes lancées depuis la racine du cerveau.

## Exécution

1. `git status --porcelain=v1 -uall` : noter l'état (il doit être identique à
   la fin).
2. Contrôles déterministes, sans s'arrêter au premier échec :
   ```bash
   node scripts/brain.mjs check
   node scripts/brain.mjs doctor
   node scripts/brain.mjs stats
   node scripts/brain.mjs scan
   ```
   `check` vérifie sans écrire (un index périmé est une erreur, pas une
   régénération). `doctor` ajoute moteur, Git, hook pre-commit et projections.
3. Signaux sémantiques, bornés aux chemins cités par les sorties :
   - tldr « À décrire. » ou vide ;
   - page sans lien entrant hors de son index (`git grep -l "<nom>.md"`),
     limitée à 20 pages tirées des sorties ;
   - faits datés « au AAAA-MM-JJ » de plus de 6 mois dans les pages ouvertes ;
   - avertissements e-mail ou téléphone : vérifier s'il s'agit d'une donnée
     publique professionnelle (à ajouter à `pii_allow` dans
     `ia/brain.config.json` avec l'accord de {{owner}}) ou privée (à retirer).
   - éléments en attente dans `{{drop.dir}}/` depuis longtemps.
4. Fréquence : dernier audit dans `stats` (« Dernier audit »). Audit de moins
   d'une semaine sans mutation depuis : s'en tenir aux sorties déterministes.
5. Présenter les constats par sévérité — **bloquant** (erreur de contrôle),
   **à corriger** (avertissement, orphelin, projection périmée), **info**
   (statistiques) — chacun avec la commande qui le prouve et le chemin. Plus de
   50 constats : regrouper par cause. Tout vert : le dire, ne rien inventer.
6. Proposer au plus trois corrections, la plus bloquante d'abord.
7. Vérifier que `git status` n'a pas changé.

## Contrat

- Aucune écriture suivie par Git ; aucun extrait détecté par le scan de
  secrets n'est cité (le moteur masque déjà les valeurs).
- Correction seulement sur demande de {{owner}} : pages par `note-ca`, index
  par `maj-index`, projections par `sync-ia` ou `node scripts/brain.mjs sync`,
  puis journal `lint` par `ajoute-log` et commit local.
- {{sas.label}} est contrôlé par Git (aucun dépôt suivi), jamais lu comme corpus.
