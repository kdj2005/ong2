const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dbconnection = require('./database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
dbconnection()
    .catch((error) => console.error("Erreur de connexion à la base de données:", error));


// Routes
app.use('/api/events', require('./route/event_Routes'));
app.use('/api/articles', require('./route/article_Route'));
app.use('/api/testimonials', require('./route/temognage_Routes'));
app.use('/api/messages', require('./route/message_Routes'));
// Endpoint de contact: enregistre le message
const { createMessage } = require('./controllers/message');
app.post('/api/contact', createMessage);

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});


// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});