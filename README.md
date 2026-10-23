# NEON PONG — Meta Ray-Ban Display

Jeu Pong autonome Vite + TypeScript + Three.js, avec tests Vitest.

## Exécution

```bash
npm install
npm run dev
npm test
npm run build
```

Déployer le contenu de `dist/` sur une URL **HTTPS publique** (Vercel, Netlify, GitHub Pages avec chemin de base adapté, etc.). Le manifeste doit être accessible à `https://votre-domaine/.well-known/meta-wearables-manifest.json` si le jeu est à la racine. Ajouter l'URL du jeu depuis le parcours Web Apps des Meta Ray-Ban Display, puis vérifier sur le matériel le rendu et l'icône dans la liste des apps.

## Contrôles

- Dans le menu : haut/bas pour naviguer (navigation Chromium native), pincement de validation (Enter) pour activer.
- Pendant le jeu : poignet en mode capteur `RelativeOrientationSensor({sensorId:'emg-wrist'})`, calibrage accessible depuis le menu, ou gestes directionnels haut/bas pour déplacer la raquette.
- Enter : pause; Enter sur Reprendre : continue; changement de difficulté et de mode dans le menu.
- Souris : cliquer sur les boutons; clavier : flèches / Enter sur navigateur desktop.

## Important

Le capteur `emg-wrist` est une API propre aux appareils compatibles Meta. Les API standard clavier fonctionnent comme repli. Le sens, l'amplitude et la stabilité du mouvement du poignet nécessitent des essais physiques sur le Neural Band : le capteur est optionnel et la disponibilité n'est pas garantie sur desktop. Le suivi utilise ici une projection quaternion simple, susceptible de nécessiter un ajustement selon les essais sur appareil. Le capteur est arrêté quand la page est masquée pour économiser la batterie.

Icône native des lunettes : `public/.well-known/meta-wearables-manifest.json` → `public/icons/neon-pong.webp`, différente du favicon SVG.
