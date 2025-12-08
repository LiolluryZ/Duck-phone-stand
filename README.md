# Zenika phone stand — Landing

Petite landing statique pour le Zenika phone stand (support téléphone imprimé en PLA).

## Démarrer en local

1. Installer les dépendances :

```powershell
npm install
```

2. Lancer le serveur de développement (live-server) :

```powershell
npm run dev
```

Le site sera servi sur `http://localhost:8080` (port configuré dans le script `dev`).

Appuyez sur `Ctrl+C` dans le terminal pour arrêter le serveur.

## Optimiser les images

Un script npm `optimize` est ajouté pour compresser les images du dossier `src/assets` et écrire les résultats dans `src/assets/optimized` :

```powershell
npm run optimize
```

Ce script utilise `npx imagemin` : si `imagemin` n'est pas installé globalement, `npx` téléchargera la CLI temporairement.

Remarque : vous pouvez préférer installer et configurer des outils dédiés (`imagemin-cli`, `sharp`, ou des outils hors-node) pour un contrôle plus fin.

### Conversion WebP

Un petit script est fourni pour convertir vos images sources (JPEG/PNG) présentes dans `resources/` vers le format WebP. Le script conserve la structure relative et écrit les fichiers convertis dans `src/assets/`.

- Exécuter la conversion :

```powershell
npm run to-webp
```

- Détails :
	- Source : `resources/` (récursif)
	- Destination : `src/assets/` (même arborescence, extensions `.webp`)
	- Outil : `sharp` (installé en `devDependencies`)
	- Qualité par défaut : 80 (paramétrable dans `scripts/to-webp.js`)

- Bonnes pratiques :
	- Ne commitez que les images nécessaires en production ; vous pouvez ajouter `src/assets/**/*.webp` à `.gitignore` si vous préférez générer ces fichiers en CI.
	- Vérifiez les images résultantes avant remplacement automatique des références dans `index.html`.
	- Pour convertir d'autres formats ou ajuster la qualité, modifiez `scripts/to-webp.js`.

## Structure du projet

- `index.html` — page d'accueil
- `src/styles/main.css` — styles
- `src/scripts/main.js` — animations et comportements
- `src/assets/` — images et logos
- `Dockerfile` — (présent, non inspecté dans ce README)

## Prochaines étapes possibles

- Ajouter un script de CI pour optimiser les images automatiquement.
- Générer des images WebP et remplacer les références dans le HTML pour production.
- Minifier CSS/JS pour la mise en production.
