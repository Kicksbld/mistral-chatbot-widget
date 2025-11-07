# 🚀 Quick Start - ChatBot SaaS

Guide rapide pour lancer votre application en **5 minutes** !

## Étape 1 : Installation des dépendances (30 sec)

```bash
npm install
```

## Étape 2 : Configuration Supabase (2 min)

### 2.1 Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "New Project"
3. Choisir un nom et un mot de passe pour la base de données
4. Attendre que le projet soit créé (~1 min)

### 2.2 Exécuter la migration SQL

1. Dans votre projet Supabase, aller dans **SQL Editor**
2. Cliquer sur "New query"
3. Copier tout le contenu de `supabase/migrations/00001_initial_schema.sql`
4. Coller dans l'éditeur et cliquer sur "Run"
5. ✅ Vérifier qu'il n'y a pas d'erreurs

### 2.3 Récupérer les clés

1. Aller dans **Settings** > **API**
2. Copier :
   - **URL** (Project URL)
   - **anon public** key
   - **service_role** key (cliquer sur "Reveal" pour l'afficher)

## Étape 3 : Configuration Mistral AI (1 min)

1. Aller sur [console.mistral.ai](https://console.mistral.ai)
2. Se créer un compte si nécessaire
3. Aller dans **API Keys**
4. Cliquer sur "Create API Key"
5. Copier la clé (commence par `sk-...`)

## Étape 4 : Configuration de l'application (1 min)

### 4.1 Créer le fichier .env.local

```bash
cp .env.local.example .env.local
```

### 4.2 Éditer .env.local

Ouvrir `.env.local` et remplacer les valeurs :

```env
# Coller l'URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Coller la clé anon de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Coller la clé service_role de Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Coller votre clé Mistral AI
MISTRAL_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Laisser tel quel en local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Étape 5 : Lancement (30 sec)

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎉 Premier test

### 1. Créer un compte

1. Cliquer sur "Commencer" ou "Créer un compte"
2. Entrer un email et mot de passe
3. Cliquer sur "Créer mon compte"
4. Vous êtes automatiquement redirigé vers le dashboard

### 2. Créer votre premier agent

1. Cliquer sur "Créer un agent"
2. Remplir le formulaire :
   - **Nom** : "Agent Test"
   - **Rôle** : "assistant"
   - **Instructions** : "Tu es un assistant serviable qui répond aux questions."
   - **Modèle** : "mistral-small-latest" (recommandé pour commencer)
   - Laisser les autres paramètres par défaut
3. Cliquer sur "Créer l'agent"

### 3. Tester le widget

1. Cliquer sur "Code Widget" sur votre agent
2. Créer un fichier `test.html` :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Widget</title>
</head>
<body>
    <h1>Test de mon ChatBot</h1>
    <p>Le widget devrait apparaître en bas à droite.</p>

    <!-- Coller le code widget ici -->
    <!-- Il ressemble à ça : -->
    <div id="chatbot-widget"></div>
    <script>
      (function() {
        const widgetConfig = {
          apiUrl: 'http://localhost:3000/api/widget/chat',
          apiKey: 'agent_xxxxxxxxx',
          agentName: 'Agent Test',
          agentRole: 'assistant',
          position: 'bottom-right',
          primaryColor: '#2563eb',
          greetingMessage: 'Bonjour ! Comment puis-je vous aider ?'
        };

        const script = document.createElement('script');
        script.src = 'http://localhost:3000/widget.js';
        script.onload = function() {
          if (window.ChatbotWidget) {
            window.ChatbotWidget.init(widgetConfig);
          }
        };
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'http://localhost:3000/widget.css';
        document.head.appendChild(link);
      })();
    </script>
</body>
</html>
```

3. Ouvrir `test.html` dans un navigateur
4. Cliquer sur le bouton du widget en bas à droite
5. Envoyer un message : "Bonjour !"
6. ✅ Vous devriez recevoir une réponse de l'IA !

## 📊 Vérifier les logs

1. Retourner sur le dashboard
2. Les statistiques de votre agent seront mises à jour
3. (Futur) Vous pourrez voir toutes les conversations

## ⚠️ Problèmes courants

### "Invalid API key" (Mistral)
- Vérifier que `MISTRAL_API_KEY` est correct dans `.env.local`
- Redémarrer le serveur : `Ctrl+C` puis `npm run dev`

### "Failed to fetch" (Widget)
- Vérifier que `npm run dev` est toujours en cours
- Vérifier que l'URL est bien `http://localhost:3000` dans le code widget

### "Agent not found" (Widget)
- Vérifier que l'agent est bien créé dans le dashboard
- Vérifier que `api_key` dans le code widget correspond

### La page ne charge pas
- Vérifier que toutes les dépendances sont installées : `npm install`
- Vérifier que `.env.local` existe et est rempli
- Regarder les erreurs dans la console

## 🎯 Prochaines étapes

Une fois que tout fonctionne en local :

1. **Personnaliser** : Modifier les couleurs, le texte, les instructions
2. **Tester** : Essayer différents modèles et paramètres
3. **Déployer** : Suivre `INSTALLATION.md` pour déployer sur Vercel
4. **Utiliser** : Intégrer sur votre vrai site web

## 📚 Documentation

- [README.md](README.md) - Vue d'ensemble du projet
- [INSTALLATION.md](INSTALLATION.md) - Guide d'installation détaillé
- [SCHEMA.md](SCHEMA.md) - Schéma de base de données
- [PROJET_COMPLET.md](PROJET_COMPLET.md) - Documentation complète

## 💡 Astuces

### Créer plusieurs agents
- Vous pouvez créer autant d'agents que vous voulez
- Chaque agent a sa propre configuration et API key
- Utile pour différents sites ou cas d'usage

### Modifier un agent
- Actuellement, il faut supprimer et recréer
- (Amélioration future : édition en place)

### Tester différents modèles
- **mistral-small-latest** : Rapide et économique (bon pour FAQ)
- **mistral-medium-latest** : Équilibré (bon pour support)
- **mistral-large-latest** : Puissant (bon pour cas complexes)

### Instructions efficaces
Soyez spécifique dans les instructions :
- ❌ "Tu es un assistant"
- ✅ "Tu es un assistant de support pour une boutique de vêtements. Tu réponds aux questions sur les tailles, la livraison et les retours. Tu es toujours courtois et concis."

## 🆘 Besoin d'aide ?

Si vous êtes bloqué :
1. Consulter les logs : Terminal où `npm run dev` tourne
2. Consulter la console : F12 dans le navigateur
3. Vérifier `.env.local` : Toutes les clés sont renseignées ?
4. Redémarrer : `Ctrl+C` puis `npm run dev`

Bon développement ! 🚀
