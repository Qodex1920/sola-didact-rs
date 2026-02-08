# Analyse : Sola Didact Studio (Gemini App)

## Résumé

Application interne générée par Google AI Studio (Gemini) pour créer des visuels marketing (images et vidéos) pour les produits Sola Didact (jeux éducatifs et mobilier scolaire). L'app utilise React 19 + Vite + TypeScript + Google GenAI SDK.

---

## Architecture Actuelle

```
/
├── .env.local              # Clé API Gemini (EXPOSEE!)
├── index.html              # HTML avec Tailwind CDN + import maps
├── index.tsx               # Point d'entrée React
├── App.tsx                 # Composant principal (280 lignes, monolithique)
├── types.ts                # Types/enums
├── constants.ts            # Prompts et contextes visuels
├── components/
│   ├── Header.tsx          # Header simple
│   ├── ImageUploader.tsx   # Upload d'image (file picker)
│   └── ResultDisplay.tsx   # Affichage image/vidéo générée
├── services/
│   └── geminiService.ts    # Appels API Gemini (4 fonctions)
├── vite.config.ts
├── package.json
└── tsconfig.json
```

### Fonctionnalités actuelles (4 modes)
1. **Analyser** - Gemini 3 Pro analyse un produit uploadé
2. **Mise en situation** (Edit) - Gemini 2.5 Flash recontextualise le produit
3. **Génération Créative** (Pro) - Gemini 3 Pro Image génère depuis un prompt pur
4. **Vidéo** - Veo 3.1 anime une image produit

---

## PROBLEMES CRITIQUES

### 1. Sécurité : Clé API exposée côté client
- **Fichier** : `.env.local:1`, `vite.config.ts:14-15`, `services/geminiService.ts:18-21`
- La clé `GEMINI_API_KEY` est injectée dans le bundle client via `process.env.API_KEY`
- N'importe qui peut l'extraire depuis le navigateur (DevTools > Sources)
- **Impact** : Utilisation frauduleuse de l'API, facturation non contrôlée
- **Solution** : Proxy backend (API Route / serverless function) ou au minimum restreindre la clé à un domaine

### 2. Tailwind via CDN en production
- **Fichier** : `index.html:8`
- `<script src="https://cdn.tailwindcss.com">` est explicitement marqué "for development only"
- Pas de purge CSS, bundle non optimisé, dépendance à un CDN externe
- **Solution** : Installer Tailwind CSS en dépendance et configurer PostCSS

### 3. Double système de dépendances
- **Fichier** : `index.html:33-42` (import maps) vs `package.json:11-14` (npm)
- React et @google/genai sont déclarés à la fois dans les import maps (esm.sh) ET dans package.json
- Confusion entre ce qui est réellement utilisé à l'exécution
- **Solution** : Supprimer les import maps, utiliser uniquement le bundler Vite

### 4. Pas de fichier CSS
- **Fichier** : `index.html:43` - `<link rel="stylesheet" href="/index.css">`
- Ce fichier `index.css` n'existe pas dans le projet
- **Impact** : 404 silencieux en prod

---

## PROBLEMES STRUCTURELS

### 5. App.tsx monolithique
- **Fichier** : `App.tsx` (280 lignes)
- Mélange UI, état, logique métier dans un seul composant
- 7 variables d'état dans le composant racine
- Tout le workflow est dans `handleAction()` (lignes 30-80)
- **Solution** : Extraire des hooks custom (`useGeneration`, `useImageUpload`)

### 6. Pas de structure `src/`
- Tous les fichiers sont à la racine, mélangés avec les configs
- **Solution** : Structure `src/components`, `src/hooks`, `src/services`, `src/lib`

### 7. Aucun test
- Pas de fichier de test, pas de config Jest/Vitest
- **Solution** : Ajouter Vitest (intégré à Vite)

### 8. Pas de linting
- Pas d'ESLint, pas de Prettier configuré
- Scripts `lint` et `format` dans package.json réfèrent à des outils non installés

---

## PROBLEMES UX / FONCTIONNELS

### 9. Gestion d'erreurs avec `alert()`
- **Fichier** : `App.tsx:77`
- Utilisation de `alert()` natif du navigateur
- **Solution** : Système de toast/notifications (ex: Sonner, react-hot-toast)

### 10. Pas d'historique des générations
- Chaque nouvelle génération écrase la précédente
- Impossible de comparer ou revenir en arrière
- **Solution** : Galerie/historique local (localStorage ou state)

### 11. Pas de drag & drop pour l'upload
- **Fichier** : `components/ImageUploader.tsx`
- Seulement un file picker classique
- **Solution** : Ajouter le support drag & drop

### 12. Pas de personnalisation du prompt
- L'utilisateur ne peut pas ajuster le prompt envoyé à Gemini
- Il est limité aux contextes prédéfinis
- **Solution** : Ajouter un champ texte optionnel pour ajuster/enrichir le prompt

### 13. Aspect ratio fixe (1:1) pour l'édition
- **Fichier** : `services/geminiService.ts:73`
- Pas de choix de format (1:1, 4:5, 16:9, 9:16)
- **Solution** : Sélecteur d'aspect ratio par mode

### 14. Pas de validation de taille d'image
- Le message dit "Max 5MB" mais aucune validation côté code
- **Fichier** : `components/ImageUploader.tsx:47`

### 15. Pas de compression d'image avant envoi
- Les images sont envoyées en base64 brut sans optimisation
- Impact sur les temps de réponse et les coûts API

---

## PROBLEMES DE CONTEXTE vs CONTEXT.MD

### 16. Couleurs erronées dans CONTEXT.MD
- **Fichier** : `CONTEXT.MD:139-140`
- "Rouge brique : #5dac3e" -> C'est un VERT, pas du rouge brique
- "Beige clair : #3a383e" -> C'est un GRIS FONCE, pas du beige
- Le code utilise les bonnes couleurs (`#C43333`, `#F9F7F4`) mais le doc est faux

### 17. Contextes manquants par rapport aux guidelines
- Le CONTEXT.MD mentionne des types de contenus non couverts :
  - Contenus saisonniers (Noël, rentrée, Saint-Nicolas)
  - Vie de la boutique (ambiance magasin, jeux testés)
  - Pas de mode "Comparaison avant/après"

### 18. Prompts uniquement en anglais
- Tous les prompts Gemini sont en anglais (`constants.ts`)
- Le contexte métier est 100% francophone
- Pas nécessairement un problème (Gemini comprend l'anglais mieux), mais incohérent

---

## FICHIERS CLES

| Fichier | Lignes | Rôle | Problèmes |
|---------|--------|------|-----------|
| `App.tsx` | 280 | Composant principal | Monolithique, trop de responsabilités |
| `services/geminiService.ts` | 158 | 4 fonctions API | Clé exposée, pas de retry, pas de timeout |
| `constants.ts` | 100 | Prompts et contextes | Prompts en anglais, contextes limités |
| `types.ts` | 27 | Types TypeScript | Correct mais minimal |
| `index.html` | 48 | HTML racine | CDN Tailwind, import maps, CSS manquant |
| `vite.config.ts` | 23 | Config Vite | Expose API_KEY dans le bundle |
| `components/ImageUploader.tsx` | 68 | Upload image | Pas de drag&drop, pas de validation |
| `components/ResultDisplay.tsx` | 53 | Affichage résultat | Pas d'historique, download basique |
| `components/Header.tsx` | 21 | Header | Statique, pas de navigation |

---

## AMELIORATIONS PROPOSEES (par priorité)

### P0 - Critique (sécurité)
1. **Backend proxy pour l'API Gemini** - Ne jamais exposer la clé côté client
2. **Supprimer les import maps** et utiliser uniquement Vite
3. **Installer Tailwind CSS** correctement (PostCSS)

### P1 - Structure
4. **Réorganiser en `src/`** avec dossiers logiques
5. **Extraire la logique dans des hooks** (`useGeneration`, `useProductUpload`)
6. **Ajouter ESLint + Prettier**
7. **Créer le fichier CSS manquant** ou supprimer la référence

### P2 - Fonctionnel
8. **Historique/Galerie** des générations (localStorage)
9. **Choix d'aspect ratio** par mode (1:1, 4:5, 16:9, 9:16)
10. **Champ prompt custom** pour ajuster les prompts
11. **Drag & drop upload** + validation taille
12. **Toast notifications** au lieu d'alert()
13. **Compression d'image** avant envoi API

### P3 - Enrichissement
14. **Contextes saisonniers** (Noël, rentrée, etc.)
15. **Mode comparaison** avant/après
16. **Batch processing** (plusieurs images à la fois)
17. **Download multi-format** (PNG, JPG, WebP)
18. **Corriger CONTEXT.MD** (couleurs hex erronées)

---

## PATTERNS A SUIVRE

- React 19 avec hooks fonctionnels (déjà en place)
- TypeScript strict avec interfaces (déjà en place)
- Tailwind CSS pour le styling (à installer correctement)
- Convention de nommage camelCase/PascalCase (cohérent)
- Structure en features ou par domaine pour l'organisation

---

## Prochaine étape

Lancer `/apex:2-plan` pour créer un plan d'implémentation priorisé.
