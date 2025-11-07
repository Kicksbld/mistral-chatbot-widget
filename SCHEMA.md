# Schéma de Base de Données

## Vue d'ensemble

Cette application utilise Supabase (PostgreSQL) avec 3 tables principales et 1 vue pour les statistiques.

## Tables

### 1. `agents`

Stocke la configuration des agents conversationnels.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `user_id` | UUID | Référence vers auth.users (FK) |
| `name` | VARCHAR(255) | Nom de l'agent |
| `role` | VARCHAR(255) | Rôle de l'agent (ex: "assistant") |
| `instructions` | TEXT | Instructions système pour l'IA |
| `model` | VARCHAR(100) | Modèle Mistral (ex: "mistral-small-latest") |
| `temperature` | DECIMAL(3,2) | Température de l'IA (0-1) |
| `max_tokens` | INTEGER | Nombre max de tokens par réponse |
| `top_p` | DECIMAL(3,2) | Top P sampling |
| `api_key` | VARCHAR(500) | Clé API unique pour le widget |
| `is_active` | BOOLEAN | Agent actif ou non |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

**Indexes :**
- `idx_agents_user_id` sur `user_id`
- `idx_agents_api_key` sur `api_key`

**RLS (Row Level Security) :**
- Les utilisateurs peuvent CRUD uniquement leurs propres agents

### 2. `conversations`

Stocke les sessions de chat entre les visiteurs et les agents.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `agent_id` | UUID | Référence vers agents (FK) |
| `session_id` | VARCHAR(255) | ID de session généré par le widget |
| `visitor_id` | VARCHAR(255) | ID du visiteur (optionnel) |
| `metadata` | JSONB | Métadonnées (URL, user agent, etc.) |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

**Indexes :**
- `idx_conversations_agent_id` sur `agent_id`
- `idx_conversations_session_id` sur `session_id`

**RLS :**
- Les utilisateurs peuvent voir les conversations de leurs agents

### 3. `messages`

Stocke les messages échangés dans chaque conversation.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (PK) |
| `conversation_id` | UUID | Référence vers conversations (FK) |
| `role` | VARCHAR(50) | "user" ou "assistant" |
| `content` | TEXT | Contenu du message |
| `tokens_used` | INTEGER | Nombre de tokens utilisés (pour stats) |
| `response_time_ms` | INTEGER | Temps de réponse en millisecondes |
| `created_at` | TIMESTAMP | Date de création |

**Indexes :**
- `idx_messages_conversation_id` sur `conversation_id`
- `idx_messages_created_at` sur `created_at`

**RLS :**
- Les utilisateurs peuvent voir les messages de leurs agents

## Vue : `agent_statistics`

Vue matérialisée pour les statistiques des agents.

```sql
SELECT
    a.id as agent_id,
    a.user_id,
    a.name,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(m.id) as total_messages,
    SUM(CASE WHEN m.role = 'user' THEN 1 ELSE 0 END) as user_messages,
    SUM(CASE WHEN m.role = 'assistant' THEN 1 ELSE 0 END) as assistant_messages,
    SUM(m.tokens_used) as total_tokens_used,
    AVG(m.response_time_ms) as avg_response_time_ms,
    MAX(c.created_at) as last_conversation_date
FROM agents a
LEFT JOIN conversations c ON c.agent_id = a.id
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY a.id, a.user_id, a.name;
```

## Relations

```
users (auth.users)
  │
  └─── agents (1:N)
         │
         └─── conversations (1:N)
                │
                └─── messages (1:N)
```

## Diagramme ER

```
┌─────────────────┐
│   auth.users    │
│  (Supabase)     │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│     agents      │
│                 │
│ - id            │
│ - user_id (FK)  │
│ - name          │
│ - api_key       │
│ - model         │
│ - instructions  │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│ conversations   │
│                 │
│ - id            │
│ - agent_id (FK) │
│ - session_id    │
│ - metadata      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│    messages     │
│                 │
│ - id            │
│ - conversation_ │
│   id (FK)       │
│ - role          │
│ - content       │
│ - tokens_used   │
└─────────────────┘
```

## Triggers

### `update_updated_at_column()`

Fonction trigger qui met à jour automatiquement `updated_at` sur UPDATE.

Appliquée sur :
- `agents`
- `conversations`

## Sécurité (RLS)

### Politique générale

Row Level Security (RLS) est activé sur toutes les tables pour garantir que :
- Seuls les utilisateurs authentifiés peuvent accéder aux données
- Chaque utilisateur ne peut voir/modifier que ses propres données
- Le widget utilise une API key spécifique qui bypass RLS via le service role

### Accès Widget

Le widget utilise `SUPABASE_SERVICE_ROLE_KEY` pour :
1. Trouver l'agent par API key
2. Créer/lire les conversations et messages
3. Bypasser RLS car il n'y a pas d'utilisateur authentifié côté widget

## Migrations

Les migrations sont dans `supabase/migrations/`:
- `00001_initial_schema.sql` : Création initiale de toutes les tables

Pour appliquer les migrations :
1. Via Supabase Dashboard : SQL Editor
2. Via Supabase CLI : `supabase db push`

## Performances

### Indexes recommandés

Tous les indexes sont créés dans la migration initiale pour optimiser :
- Recherche d'agents par user_id
- Recherche d'agents par api_key (widget)
- Recherche de conversations par agent_id
- Recherche de messages par conversation_id
- Tri des messages par date

### Optimisations futures

Si le volume augmente, considérer :
- Partitionnement de la table `messages` par date
- Archivage des anciennes conversations
- Index additionnels selon les requêtes fréquentes
