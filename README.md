# ChatBot Widget SaaS

Application SaaS complète pour créer et intégrer des agents conversationnels IA sur n'importe quel site web. Propulsée par **Mistral AI** et **Supabase**.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Mistral AI](https://img.shields.io/badge/Mistral-AI-orange)

## 🚀 Fonctionnalités

- ✅ **Interface Admin complète** : Dashboard pour créer et gérer vos agents
- ✅ **Authentification sécurisée** : Supabase Auth avec Row Level Security
- ✅ **IA Mistral puissante** : Intégration des modèles Mistral (small, medium, large)
- ✅ **Widget embeddable** : Code JavaScript simple à intégrer sur n'importe quel site
- ✅ **Configuration flexible** : Personnalisez le comportement de chaque agent
- ✅ **Logs et statistiques** : Suivez les conversations et analysez les performances
- ✅ **Responsive** : Fonctionne sur desktop et mobile
- ✅ **TypeScript** : Code typé pour une meilleure maintenabilité

## 📋 Prérequis

- Node.js 18+
- Un compte [Supabase](https://supabase.com) (gratuit)
- Une clé API [Mistral AI](https://console.mistral.ai)

## 🛠️ Installation rapide

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd chatbot-widget
npm install
```

### 2. Configuration

Créez un fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Mistral AI
MISTRAL_API_KEY=votre_cle_mistral

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configurer la base de données

1. Allez dans votre projet Supabase > SQL Editor
2. Exécutez le script `supabase/migrations/00001_initial_schema.sql`

### 4. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📚 Documentation complète

- **[Guide d'installation](INSTALLATION.md)** - Instructions détaillées
- **[Schéma de base de données](SCHEMA.md)** - Structure des tables

## 🏗️ Architecture

```
chatbot-widget/
├── app/
│   ├── api/              # API Routes Next.js
│   │   ├── agents/       # CRUD agents
│   │   ├── auth/         # Authentification
│   │   └── widget/       # API du widget
│   ├── dashboard/        # Interface admin
│   ├── login/            # Page de connexion
│   └── signup/           # Inscription
├── components/           # Composants React
├── lib/
│   ├── supabase/        # Configuration Supabase
│   └── types.ts         # Types TypeScript
├── public/
│   ├── widget.js        # Widget JavaScript
│   └── widget.css       # Styles du widget
└── supabase/
    └── migrations/      # Migrations SQL
```

## 🎯 Stack technique

- **Frontend** : Next.js 16 (App Router), React 19, TypeScript
- **Styling** : Tailwind CSS 4
- **Backend** : Next.js API Routes
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **AI** : Mistral AI API
- **Déploiement** : Vercel (recommandé)

## 🔐 Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne voit que ses données
- **Clés API uniques** : Chaque agent a sa propre clé API
- **Validation** : Toutes les entrées sont validées côté serveur
- **HTTPS** : Requis en production

## 📖 Utilisation

### Créer un agent

1. Inscrivez-vous et connectez-vous
2. Cliquez sur "Créer un agent"
3. Configurez votre agent :
   - Nom et rôle
   - Instructions système
   - Modèle Mistral (small/medium/large)
   - Paramètres (température, max tokens)

### Intégrer le widget

1. Cliquez sur "Code Widget" sur votre agent
2. Copiez le code fourni
3. Collez-le avant `</body>` sur votre site

Exemple :
```html
<div id="chatbot-widget"></div>
<script>
  (function() {
    const widgetConfig = {
      apiUrl: 'https://votre-app.vercel.app/api/widget/chat',
      apiKey: 'agent_xxx',
      agentName: 'Mon Agent',
      position: 'bottom-right',
      primaryColor: '#2563eb'
    };
    // ... code du widget
  })();
</script>
```

## 🚀 Déploiement

### Vercel (recommandé)

```bash
npm i -g vercel
vercel
```

Configurez les variables d'environnement dans le dashboard Vercel.

### Autres plateformes

- **Netlify** : Importez le repo et configurez les variables
- **Railway** : Déployez depuis GitHub
- **Render** : Créez un Web Service

## 📊 API Endpoints

### Agents
- `GET /api/agents` - Liste des agents
- `POST /api/agents` - Créer un agent
- `GET /api/agents/:id` - Détails d'un agent
- `PATCH /api/agents/:id` - Modifier un agent
- `DELETE /api/agents/:id` - Supprimer un agent
- `GET /api/agents/:id/statistics` - Statistiques

### Widget
- `POST /api/widget/chat` - Envoyer un message

### Auth
- `POST /api/auth/login` - Connexion
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/logout` - Déconnexion

## 🐛 Troubleshooting

**Erreur "Invalid API key"**
- Vérifiez votre clé Mistral AI dans `.env.local`

**Erreur de connexion Supabase**
- Vérifiez les URL et clés Supabase
- Assurez-vous que les migrations sont exécutées

**Le widget ne s'affiche pas**
- Vérifiez la console du navigateur
- Assurez-vous que `NEXT_PUBLIC_APP_URL` est correct

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT

## 🔗 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Mistral AI](https://docs.mistral.ai)
- [Guide Tailwind CSS](https://tailwindcss.com/docs)

---

**Made with ❤️ using Next.js, Supabase & Mistral AI**
# mistral-chatbot-widget
