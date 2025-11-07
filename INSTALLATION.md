# Guide d'Installation - ChatBot Widget SaaS

Ce guide vous aidera à installer et déployer votre application SaaS de chatbot IA propulsée par Mistral AI et Supabase.

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation Supabase](#installation-supabase)
3. [Installation Mistral AI](#installation-mistral-ai)
4. [Configuration du projet](#configuration-du-projet)
5. [Déploiement](#déploiement)
6. [Utilisation](#utilisation)
7. [Troubleshooting](#troubleshooting)

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Node.js 18+ installé
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Mistral AI](https://mistral.ai) avec une clé API
- Git installé

## Installation Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et votre **clé anon**

### 2. Créer les tables de base de données

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase/migrations/00001_initial_schema.sql`
3. Exécutez le script SQL

Cela créera :
- Table `agents` : stocke les configurations des agents
- Table `conversations` : stocke les sessions de chat
- Table `messages` : stocke les messages échangés
- Vue `agent_statistics` : pour les statistiques
- Politiques RLS (Row Level Security) pour la sécurité

### 3. Configurer l'authentification

Dans Supabase Dashboard :
1. Allez dans **Authentication** > **Providers**
2. Activez **Email** provider
3. (Optionnel) Configurez les emails de confirmation

## Installation Mistral AI

### 1. Obtenir une clé API

1. Inscrivez-vous sur [console.mistral.ai](https://console.mistral.ai)
2. Créez une nouvelle clé API
3. Notez votre clé API (elle commence par `sk-...`)

### 2. Choisir votre modèle

Les modèles disponibles :
- `mistral-small-latest` : Rapide et économique (recommandé pour démarrer)
- `mistral-medium-latest` : Équilibré
- `mistral-large-latest` : Plus puissant

## Configuration du projet

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd chatbot-widget
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` avec vos vraies valeurs :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase

# Pour les opérations admin (widget API)
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role

# Mistral AI Configuration
MISTRAL_API_KEY=votre-cle-mistral

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important** :
- La `SUPABASE_SERVICE_ROLE_KEY` se trouve dans **Settings** > **API** de votre projet Supabase
- Ne commitez JAMAIS le fichier `.env.local` dans Git

### 4. Lancer en développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Déploiement

### Déploiement sur Vercel (recommandé)

1. Installez Vercel CLI :
```bash
npm i -g vercel
```

2. Déployez :
```bash
vercel
```

3. Configurez les variables d'environnement dans le dashboard Vercel :
   - Allez dans **Settings** > **Environment Variables**
   - Ajoutez toutes les variables de `.env.local`

4. Important : Mettez à jour `NEXT_PUBLIC_APP_URL` avec votre URL de production

### Déploiement alternatif

Vous pouvez également déployer sur :
- **Netlify** : Configurez les variables d'environnement dans les settings
- **Railway** : Importez le projet et ajoutez les variables
- **Render** : Créez un nouveau Web Service

## Utilisation

### Créer votre premier agent

1. Créez un compte sur votre application
2. Connectez-vous au dashboard
3. Cliquez sur "Créer un agent"
4. Configurez :
   - **Nom** : ex. "Support Client"
   - **Rôle** : ex. "assistant de support"
   - **Instructions** : Décrivez le comportement de votre agent
   - **Modèle** : Choisissez `mistral-small-latest` pour commencer
   - **Température** : 0.7 (bon équilibre créativité/précision)

5. Cliquez sur "Créer l'agent"

### Intégrer le widget sur votre site

1. Dans le dashboard, cliquez sur "Code Widget" sur votre agent
2. Copiez le code fourni
3. Collez-le juste avant `</body>` dans votre site web

Exemple :
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Site</title>
</head>
<body>
    <!-- Votre contenu -->

    <!-- Widget ChatBot - Coller ici -->
    <div id="chatbot-widget"></div>
    <script>
      (function() {
        const widgetConfig = {
          apiUrl: 'https://votre-app.vercel.app/api/widget/chat',
          apiKey: 'agent_xxx',
          agentName: 'Support Client',
          agentRole: 'assistant',
          position: 'bottom-right',
          primaryColor: '#2563eb',
          greetingMessage: 'Bonjour ! Comment puis-je vous aider ?'
        };
        // ... reste du code
      })();
    </script>
</body>
</html>
```

### Personnaliser le widget

Vous pouvez personnaliser :
- `position` : `'bottom-right'` ou `'bottom-left'`
- `primaryColor` : Couleur principale (ex: `'#ff5722'`)
- `greetingMessage` : Message d'accueil personnalisé

## Architecture

```
chatbot-widget/
├── app/
│   ├── api/
│   │   ├── agents/          # CRUD des agents
│   │   ├── auth/            # Authentification
│   │   └── widget/          # API du widget
│   ├── dashboard/           # Dashboard admin
│   ├── login/               # Page de connexion
│   └── signup/              # Page d'inscription
├── components/              # Composants React
├── lib/
│   ├── supabase/           # Configuration Supabase
│   ├── types.ts            # Types TypeScript
│   └── utils.ts            # Utilitaires
├── public/
│   ├── widget.js           # Widget embeddable
│   └── widget.css          # Styles du widget
└── supabase/
    └── migrations/         # Migrations SQL
```

## Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS pour garantir que :
- Les utilisateurs ne peuvent voir que leurs propres agents
- Les conversations et messages sont protégés
- Le widget API utilise une clé API unique par agent

### Bonnes pratiques

1. **Ne jamais exposer** `SUPABASE_SERVICE_ROLE_KEY` côté client
2. **Utiliser HTTPS** en production
3. **Limiter les requêtes** au niveau de l'API si besoin
4. **Monitorer les coûts** Mistral AI via leur dashboard

## Troubleshooting

### Erreur "Invalid API key"

- Vérifiez que votre clé Mistral AI est correcte
- Assurez-vous qu'elle est bien dans `.env.local`

### Erreur de connexion Supabase

- Vérifiez l'URL et les clés Supabase
- Assurez-vous que les migrations SQL sont exécutées
- Vérifiez que RLS est activé

### Le widget ne s'affiche pas

- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que `NEXT_PUBLIC_APP_URL` est correct
- Vérifiez que l'agent est actif

### Erreur 401 sur l'API widget

- Vérifiez que la clé API de l'agent est correcte
- Assurez-vous que l'agent existe et est actif

## Support

Pour toute question ou problème :
1. Consultez les logs de développement : `npm run dev`
2. Vérifiez la console du navigateur
3. Consultez les logs Vercel en production
4. Ouvrez une issue sur GitHub

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Mistral AI](https://docs.mistral.ai)
- [Guide Tailwind CSS](https://tailwindcss.com/docs)

## Licence

MIT
