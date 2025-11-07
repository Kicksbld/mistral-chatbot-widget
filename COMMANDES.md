# 📝 Commandes Utiles

Liste de toutes les commandes utiles pour développer et déployer l'application.

## 🚀 Développement

### Installation
```bash
# Installation des dépendances
npm install

# Installation d'une dépendance spécifique
npm install <package-name>

# Installation en dev
npm install -D <package-name>
```

### Serveur de développement
```bash
# Lancer le serveur de dev (port 3000)
npm run dev

# Lancer sur un port spécifique
PORT=3001 npm run dev

# Arrêter le serveur
Ctrl + C
```

### Build
```bash
# Build de production
npm run build

# Lancer en mode production
npm run start

# Build + Start
npm run build && npm run start
```

### Linting
```bash
# Vérifier le code
npm run lint

# Fix automatique
npm run lint -- --fix
```

## 🗄️ Supabase

### CLI Supabase (optionnel)
```bash
# Installation
npm install -g supabase

# Login
supabase login

# Initialiser le projet local
supabase init

# Link avec projet distant
supabase link --project-ref <votre-project-ref>

# Créer une migration
supabase migration new <nom-de-la-migration>

# Appliquer les migrations
supabase db push

# Reset de la BDD locale
supabase db reset

# Dump du schema
supabase db dump --schema public > schema.sql
```

### Via Dashboard
```bash
# Ouvrir le SQL Editor dans votre navigateur
1. Aller sur supabase.com
2. Ouvrir votre projet
3. SQL Editor > New query
4. Coller le SQL de la migration
5. Run
```

## 🚢 Déploiement

### Vercel
```bash
# Installation CLI
npm install -g vercel

# Login
vercel login

# Déployer (première fois)
vercel

# Déployer en production
vercel --prod

# Voir les logs
vercel logs

# Liste des déploiements
vercel list
```

### Variables d'environnement Vercel
```bash
# Ajouter une variable
vercel env add MISTRAL_API_KEY

# Lister les variables
vercel env ls

# Pull les variables en local
vercel env pull
```

## 🔍 Debug

### Logs de développement
```bash
# Voir les logs du serveur
# Les logs s'affichent dans le terminal où npm run dev tourne

# Logs détaillés Next.js
DEBUG=* npm run dev
```

### Logs de production (Vercel)
```bash
# Via CLI
vercel logs

# Via Dashboard
# Aller sur vercel.com > votre projet > Deployments > [deployment] > Logs
```

### Analyser le bundle
```bash
# Installer l'analyzer
npm install -D @next/bundle-analyzer

# Ajouter dans next.config.ts:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })

# Analyser
ANALYZE=true npm run build
```

## 🧪 Tests (à implémenter)

### Jest (tests unitaires)
```bash
# Installation
npm install -D jest @testing-library/react @testing-library/jest-dom

# Lancer les tests
npm test

# Avec coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Playwright (tests E2E)
```bash
# Installation
npm install -D @playwright/test

# Lancer les tests
npx playwright test

# Mode UI
npx playwright test --ui

# Générer un test
npx playwright codegen
```

## 🔧 Maintenance

### Mettre à jour les dépendances
```bash
# Vérifier les versions outdated
npm outdated

# Mettre à jour toutes les deps
npm update

# Mettre à jour une dep spécifique
npm update <package-name>

# Upgrade majeur (attention!)
npm install <package-name>@latest
```

### Nettoyer
```bash
# Supprimer node_modules et .next
rm -rf node_modules .next

# Réinstaller
npm install

# Nettoyer le cache npm
npm cache clean --force
```

## 📦 Git

### Workflow de base
```bash
# Vérifier le statut
git status

# Ajouter des fichiers
git add .
git add <fichier>

# Commit
git commit -m "feat: votre message"

# Push
git push

# Pull
git pull
```

### Branches
```bash
# Créer une branche
git checkout -b feature/ma-fonctionnalite

# Changer de branche
git checkout main

# Lister les branches
git branch -a

# Supprimer une branche
git branch -d feature/ma-fonctionnalite
```

### Conventional Commits
```bash
# Types de commits recommandés
git commit -m "feat: ajout nouvelle fonctionnalité"
git commit -m "fix: correction bug"
git commit -m "docs: mise à jour documentation"
git commit -m "style: formatage code"
git commit -m "refactor: refactorisation"
git commit -m "test: ajout tests"
git commit -m "chore: tâches diverses"
```

## 🔐 Sécurité

### Vérifier les vulnérabilités
```bash
# Audit npm
npm audit

# Fix automatique
npm audit fix

# Fix avec breaking changes
npm audit fix --force
```

### Variables d'environnement
```bash
# Ne jamais commiter .env.local
git status # vérifier qu'il est dans .gitignore

# Backup des variables
cp .env.local .env.backup

# Restaurer
cp .env.backup .env.local
```

## 📊 Base de données

### Backup Supabase
```bash
# Via CLI
supabase db dump -f backup.sql

# Restaurer
supabase db reset --db-url postgresql://...
```

### Requêtes SQL utiles
```sql
-- Compter les agents
SELECT COUNT(*) FROM agents;

-- Compter les conversations
SELECT COUNT(*) FROM conversations;

-- Stats globales
SELECT
  COUNT(DISTINCT agents.id) as total_agents,
  COUNT(DISTINCT conversations.id) as total_conversations,
  COUNT(messages.id) as total_messages
FROM agents
LEFT JOIN conversations ON conversations.agent_id = agents.id
LEFT JOIN messages ON messages.conversation_id = conversations.id;

-- Top 5 agents par conversations
SELECT
  agents.name,
  COUNT(DISTINCT conversations.id) as conversation_count
FROM agents
LEFT JOIN conversations ON conversations.agent_id = agents.id
GROUP BY agents.id, agents.name
ORDER BY conversation_count DESC
LIMIT 5;
```

## 🎯 Raccourcis utiles

### VS Code
```bash
# Ouvrir le projet
code .

# Chercher dans les fichiers
Cmd/Ctrl + Shift + F

# Formater le document
Shift + Alt + F

# Quick fix
Cmd/Ctrl + .
```

### Terminal
```bash
# Historique des commandes
history

# Chercher dans l'historique
Ctrl + R

# Effacer le terminal
clear # ou Cmd/Ctrl + L
```

## 📱 Mobile (développement)

### Tester le widget sur mobile
```bash
# 1. Trouver l'IP locale
ipconfig getifaddr en0  # Mac
hostname -I             # Linux
ipconfig                # Windows

# 2. Modifier NEXT_PUBLIC_APP_URL
# Dans .env.local: NEXT_PUBLIC_APP_URL=http://192.168.1.X:3000

# 3. Relancer le serveur
npm run dev

# 4. Accéder depuis le mobile
# http://192.168.1.X:3000
```

## 🔥 Commandes d'urgence

### Build ne fonctionne pas
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Erreur de cache
```bash
npm cache clean --force
rm -rf .next
npm run dev
```

### Reset complet
```bash
# Sauvegarder .env.local !
cp .env.local .env.backup

# Reset total
rm -rf .next node_modules .env.local
npm install
cp .env.backup .env.local
npm run dev
```

## 📚 Ressources

### Documentation
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Mistral AI](https://docs.mistral.ai)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### CLI Help
```bash
npx next --help
supabase --help
vercel --help
npm --help
```

---

💡 **Astuce** : Ajoutez ces commandes à vos snippets VS Code pour gagner du temps !
