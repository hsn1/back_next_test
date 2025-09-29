# Frontend - Application Next.js
Ce projet correspond à la partie frontend de l’application.
Il s’agit d’une application Next.js qui permet d’afficher une liste d’articles, de rechercher par texte et de communiquer avec le backend (FastAPI) pour le module de chatbot.

## Technologies utilisées
- **React**
- **Next.js**
- **TypeScript**
- **zod** pour la validation des entrées
- **Docker / Docker Compose**(pour développement et déploiement)
- **Fetch API**

## Architecture
```
front/
├── components/              # Composants React réutilisables (ex: ArticleList)
│   ├── ArticleList.tsx
│   
├── pages/                   # Pages Next.js
│   ├── articles/           
│       └── index.ts         # Page principale affichant les articles
│   └── api/            
│       └── articles.ts      # gestion des query
├── data/                    # Ressources statiques (images, icons, favicons)
│   └── articles.json        # base de données des articles
├── utils/             
│   ├── search.ts            # gestion des recherches de texte dans les articles
├── lib/             
│   ├── chatApi.ts           # gestion de requete qui fait appel au chatbot du backend python
│   └── vallidate.ts         # validation des entrées avec zod
├── Dockerfile               # Dockerfile pour frontend
├── package.json             # Dépendances et scripts npm
├── package-lock.json        # Lock file npm
├── tsconfig.json            # Configuration TypeScript
└── .env.local               # variables d'environnement

```

## Fonctionnalités principales
- Affichage d’une liste d’articles avec : titre, date, résumé (dans la page http://localhost:3000/articles)
- On peut aussi ajouter directement els filtres dans le lien comme
http://localhost:3000/articles?query=optim&sort=asc
où query : le mot qu'on recherche et sort = desc ou sort = asc
- Recherche **full-text** sur le titre et le résumé des articles. POur faire simple pour l'instant à partir du query de l'utilisateur, on fait une recherche avec un full match correspondant au query entré.
- Tri par date (du plus récent au plus ancien et inversement)
- Chatbot finance: Champ de saisie pour envoyer un message, appel à l’API backend pour obtenir la réponse, affichage de la réponse et des sources

## Base de données
utilisation d'une base de donnée simple qui est stockée dans un fichier **articles.json** qui se trouve dans le directory data

## Configuration
Les variables d’environnement sont définies dans le fichier **.env.local** à la racine du dossier front/.
exemple:
\# URL de l'API Chat (doit être accessible depuis le navigateur)
NEXT_PUBLIC_CHAT_API=http://localhost:8000/chat

Les variables stockées sont:
- URL de l'API Chat **NEXT_PUBLIC_CHAT_API=http://localhost:8000/chat**
- chemin du fichier contenant les articles  **ARTICLE_PATH=articles.json**


## Lancement
Le frontend tourne sur le port 3000 mais on peut toujours changer le port selon le mode de lancement.
npm run dev -- -p 4000
par exemple
Il y a deux types de lancement
### 1- Lancement normal
- On installe les prérequis 
cd front
npm install
- On lance l'application en **Mode développement (avec hot-reload)**
npm run dev
### 2- Avec docker
Si on veut changer le port on accède au fichier Dcokerfile et on change la commande
CMD ["npm", "run", "dev"]
en remplaçant par  CMD["npm", "run", "dev", "-p", "4000"]

Et il en va de suite pour les deux fichiers docker-compose qui se trouve à la racine et aussi celui qui se trouve dans le dossier front.


Après, on lance simplement docker-compse up --build à la racine de front/ et back/ et ça lancera automatiquement la partie front et back en même temps  

