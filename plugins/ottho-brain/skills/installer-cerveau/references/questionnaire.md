# Questionnaire d'installation

Une phase à la fois. Option recommandée en premier, marquée « (recommandé) ».
Réponse libre toujours possible. Reformuler en une ligne ce qui a été retenu à
la fin de chaque phase, sans redemander.

## Phase 1 — Profil

But : adapter structure, sous-dossiers et style de réponse. Rien de privé.

1. **Prénom ou pseudo** à utiliser dans le cerveau (réponse libre).
2. **Usage principal** : perso et pro mélangés (recommandé) · surtout pro
   (freelance, entrepreneur) · études · salarié · création de contenu · autre.
3. **Activités** (si pro) : une ligne par activité ou marque (« studio de
   design », « chaîne YouTube », « mission chez un client »). Rien de
   confidentiel : pas de nom de client sous NDA.
4. **Ce que le cerveau doit t'apporter** (choix multiple) : ne plus perdre mes
   idées · capitaliser ce que j'apprends · piloter mes projets · donner du
   contexte à Claude et Codex · garder une trace de mes décisions.

## Phase 2 — Emplacement et nom

1. **Dossier du cerveau** : `~/Documents/<nom>` (recommandé) · un dossier
   synchronisé (OneDrive, iCloud, Dropbox : prévenir que la synchro de `.git`
   peut créer des conflits si plusieurs machines écrivent en même temps) · un
   chemin précis. Vérifier que le dossier n'existe pas ou est vide.
   - Un coffre Obsidian existant : proposer un dossier neuf (recommandé) et
     d'ingérer les anciennes notes ensuite par la boîte de dépôt ; ou
     l'adoption (`adopt: true`) : les fichiers existants restent en place,
     hors des routes, jusqu'à ingestion.
2. **Nom du cerveau** : « Cerveau de <prénom> » (recommandé) · « BrainOS » ·
   libre. Le slug technique en est dérivé.

## Phase 3 — Structure des dossiers

Expliquer en deux phrases : trois routes de connaissance à responsabilité
exclusive (moi / mon activité / ce que j'apprends), plus `ia/` et le Sas,
toujours présents. Leurs noms et leurs sous-dossiers sont libres.

1. **Modèle de départ** selon le profil, avec l'aperçu de l'arbre (voir
   [structures](structures.md)) : le modèle adapté au profil (recommandé) ·
   Classique BrainOS · un autre modèle · tout personnaliser.
2. **Noms des trois routes** : garder ceux du modèle (recommandé) ou les
   renommer (ex. `moi`, `boulot`, `connaissances`). Kebab-case sans accent ;
   les libellés affichés peuvent avoir des accents.
3. **Sous-dossiers** de chaque route : montrer la proposition du modèle,
   demander quoi ajouter, retirer ou renommer. Pour chaque ajout, demander une
   phrase « ce qui y va ». Les sous-dossiers de la route savoir (`sources`,
   `sujets`, `modeles`, `pratiques`, `references`, `decisions`, `syntheses`)
   sont imposés : les skills d'écriture en dépendent. `identite/` (perso),
   `journal/`, `revues/` (perso, pack rituels) et `projets/` (pro, pack
   projets) sont ajoutés automatiquement.
4. **Route supplémentaire** (rare) : non (recommandé) · oui → nom, ce qui y
   appartient, ce qui n'y appartient pas.

## Phase 4 — Ingestion

1. **Nom de la boîte de dépôt** (dossier où l'on pose ce qu'il faut ingérer,
   hors Git) : `raw` (recommandé, comme BrainOS) · `a-ingerer` · `inbox` ·
   `depot` · libre.
2. **Nom du Sas** (dépôts à conserver, quarantaine, archives) : `sas`
   (recommandé, « Le Sas ») · `entree` · libre, avec son libellé affiché.
3. **Nom du skill d'ingestion** (ce qu'on dira pour ingérer) :
   `bouffe-tout` (recommandé) · `ingere` · `miam` · `digere` · libre.
   Vérifier qu'aucun skill du même nom n'existe déjà dans
   `~/.claude/skills` ou `~/.agents/skills`.

## Phase 5 — Sécurité et Git

Expliquer la classification en trois lignes : tout ce qui arrive est inconnu
(C0) ; secrets et données privées (C1, C2) ne rentrent jamais ; seul le
contenu interne non sensible (C4) est écrit et versionné.

1. **Git local** : oui, avec hook de contrôle avant chaque commit
   (recommandé) · non (déconseillé : plus de journal vérifiable ni de retour
   arrière). Sans identité Git : expliquer la commande, ne pas la configurer.
2. **Dépôt distant** : pas maintenant (recommandé) · plus tard, privé
   seulement. Aucun push n'est fait par l'installation.
3. **Obsidian** : oui, préparer les réglages (liens Markdown relatifs, dossiers
   techniques masqués) (recommandé si Obsidian est installé) · non.
4. **E-mails publics autorisés** (optionnel) : adresse professionnelle
   publique à ne pas signaler comme donnée privée (va dans `pii_allow`).

## Phase 6 — IA

1. **Runtimes à brancher** : Claude Code et Codex (recommandé) · Claude Code
   seul · Codex seul. Montrer qu'on ajoutera un bloc géré en tête de
   `~/.claude/CLAUDE.md` et de `~/.codex/AGENTS.md`, le reste du fichier
   conservé et sauvegardé, retirable à tout moment.
2. **Règles pour Claude** : copier les règles du cerveau dans
   `~/.claude/rules/<slug>/` pour qu'elles soient toujours actives
   (recommandé) · non (Claude les lira comme Codex, via le boot).
3. **Rapatriement** (si l'inventaire de la phase 0 trouve des composants) :
   montrer les totaux par type et les liens externes. Choix : tout rapatrier
   dans `ia/` (recommandé : une seule source, versionnée) · choisir lesquels ·
   seulement les skills · rien. Préciser : les originaux sont sauvegardés dans
   le cerveau (`.local/backups/`), remplacés par des liens, et les plugins
   installés ne sont jamais touchés.
4. **Packs de skills** (choix multiple, le cœur est toujours installé) :
   rituels (journal, revue hebdo, capture, bilan mensuel) · méta IA (créer,
   rapatrier, projeter, mesurer les skills) · projets (doc-projet, fiche
   projet, portefeuille). Tous cochés par défaut.
5. **Style de réponse des agents** : direct et concis (recommandé) ·
   pédagogique, explique chaque étape · personnalisé (2 à 5 règles libres).
   Langue des réponses : français par défaut. Ces réponses deviennent
   `ia/rules/core/communication.md`.
