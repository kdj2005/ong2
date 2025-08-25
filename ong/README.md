# Solidarité Jeunes Filles Mères - Site Web et Dashboard Admin

## 🚀 Vue d'ensemble

Ce projet comprend un site web public pour l'ONG "Solidarité Jeunes Filles Mères" et un dashboard administrateur complet pour la gestion du contenu.

## 📁 Structure du projet

```
ong/
├── backend/                 # API Node.js + Express + MongoDB
│   ├── app.js             # Serveur principal
│   ├── database.js        # Connexion MongoDB
│   ├── seed.js            # Script de données de test
│   ├── controllers/       # Logique métier
│   ├── models/            # Modèles Mongoose
│   ├── routes/            # Routes API
│   └── package.json       # Dépendances backend
├── frontend/               # Interface utilisateur
│   ├── index.html         # Page d'accueil
│   ├── admin.html         # Dashboard administrateur
│   ├── evenements.html    # Page événements
│   ├── articles.html      # Page articles
│   ├── contact.html       # Page contact
│   ├── don.html           # Page don
│   ├── main.js            # JavaScript principal
│   ├── admin.js           # JavaScript admin
│   └── style.css          # Styles CSS
└── README.md              # Ce fichier
```

## 🛠️ Installation et démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (local ou Atlas)
- Navigateur web moderne

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration de la base de données
Créez un fichier `.env` dans le dossier `backend/` :
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ong
PORT=3000
```

**Ou utilisez MongoDB Atlas :**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ong
PORT=3000
```

### 3. Démarrage du serveur
```bash
cd backend
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### 4. Peuplement de la base de données (optionnel)
```bash
cd backend
npm run seed
```

Ce script créera des exemples d'événements, articles et témoignages.

## 🌐 Utilisation du site

### Site public
- **Accueil** : `frontend/index.html`
- **Événements** : `frontend/evenements.html`
- **Articles** : `frontend/articles.html`
- **Contact** : `frontend/contact.html`
- **Don** : `frontend/don.html`

### Dashboard administrateur
- **URL** : `frontend/admin.html`
- **Identifiants** : `admin` / `admin123`

## 🔐 Dashboard Admin - Fonctionnalités

### Tableau de bord
- Statistiques en temps réel
- Nombre d'événements, articles et témoignages
- Compteur des témoignages en attente d'approbation

### Gestion des événements
- ✅ Créer un nouvel événement
- ✅ Modifier un événement existant
- ✅ Supprimer un événement
- ✅ Champs : titre, date, lieu, description, image

### Gestion des articles
- ✅ Créer un nouvel article
- ✅ Modifier un article existant
- ✅ Supprimer un article
- ✅ Publier/dépublier des articles
- ✅ Champs : titre, auteur, résumé, contenu, image, statut

### Gestion des témoignages
- ✅ Créer un nouveau témoignage
- ✅ Modifier un témoignage existant
- ✅ Supprimer un témoignage
- ✅ Approuver/rejeter des témoignages
- ✅ Champs : nom, âge, contenu, statut d'approbation

## 📡 API Endpoints

### Événements
- `GET /api/events` - Liste des événements
- `GET /api/events/:id` - Détail d'un événement
- `POST /api/events` - Créer un événement
- `PUT /api/events/:id` - Modifier un événement
- `DELETE /api/events/:id` - Supprimer un événement

### Articles
- `GET /api/articles` - Liste des articles publiés
- `GET /api/articles/:id` - Détail d'un article
- `POST /api/articles` - Créer un article
- `PUT /api/articles/:id` - Modifier un article
- `DELETE /api/articles/:id` - Supprimer un article

### Témoignages
- `GET /api/testimonials` - Liste des témoignages approuvés
- `GET /api/testimonials/:id` - Détail d'un témoignage
- `POST /api/testimonials` - Créer un témoignage
- `PATCH /api/testimonials/:id/approve` - Approuver un témoignage
- `DELETE /api/testimonials/:id` - Supprimer un témoignage

### Contact
- `POST /api/contact` - Envoyer un message de contact

## 🔧 Personnalisation

### Modifier les identifiants admin
Dans `frontend/admin.js`, ligne 15 :
```javascript
if (username === 'admin' && password === 'admin123') {
    // Changez 'admin' et 'admin123' par vos identifiants
}
```

### Ajouter de nouveaux champs
1. Modifiez le modèle dans `backend/models/`
2. Mettez à jour le contrôleur correspondant
3. Ajoutez les champs dans le formulaire admin
4. Mettez à jour la logique JavaScript

### Changer le thème
Modifiez les variables CSS dans `frontend/style.css` :
```css
:root {
    --primary-color: #8e44ad;    /* Couleur principale */
    --secondary-color: #9b59b6;  /* Couleur secondaire */
    --accent-color: #e74c3c;     /* Couleur d'accent */
}
```

## 🚨 Sécurité

**⚠️ IMPORTANT :** Ce dashboard utilise une authentification basique pour la démonstration. En production :

1. **Implémentez JWT** pour l'authentification
2. **Ajoutez la validation des données** côté serveur
3. **Utilisez HTTPS** en production
4. **Limitez les tentatives de connexion**
5. **Ajoutez des logs de sécurité**

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez les variables d'environnement dans `.env`
- Vérifiez que le port 3000 est libre

### Erreurs de base de données
- Vérifiez la connexion MongoDB
- Exécutez `npm run seed` pour créer des données de test
- Vérifiez les logs du serveur

### Le dashboard ne se charge pas
- Vérifiez que le serveur backend fonctionne
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que l'URL de l'API est correcte dans `admin.js`

## 📝 Développement

### Ajouter une nouvelle fonctionnalité
1. Créez le modèle dans `backend/models/`
2. Ajoutez le contrôleur dans `backend/controllers/`
3. Créez les routes dans `backend/routes/`
4. Ajoutez la section dans `frontend/admin.html`
5. Implémentez la logique dans `frontend/admin.js`

### Tests
Pour tester l'API, vous pouvez utiliser :
- **Postman** ou **Insomnia** pour les requêtes API
- **MongoDB Compass** pour visualiser la base de données
- **Console du navigateur** pour déboguer le frontend

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce README
2. Consultez les logs du serveur
3. Vérifiez la console du navigateur
4. Testez les endpoints API individuellement

## 🎯 Prochaines étapes

- [ ] Système d'authentification JWT
- [ ] Upload d'images
- [ ] Notifications en temps réel
- [ ] Système de rôles (admin, modérateur)
- [ ] API de recherche avancée
- [ ] Export des données
- [ ] Sauvegarde automatique
- [ ] Tests automatisés

---

**Solidarité Jeunes Filles Mères** - Ensemble pour un avenir meilleur 🌟



