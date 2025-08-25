const mongoose = require('mongoose');
const Event = require('./model/event');
const Article = require('./model/articles');
const Testimonial = require('./model/temoignages');
require('dotenv').config();

// Connexion à MongoDB
async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ong';
        await mongoose.connect(uri);
        console.log('Connexion à la base de données réussie');
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
}

// Données de test
const sampleEvents = [
    {
        title: "Atelier de soutien scolaire",
        date: new Date('2024-02-15T14:00:00'),
        location: "Centre communautaire de Paris",
        description: "Atelier de soutien scolaire pour les jeunes mères. Nous proposons de l'aide aux devoirs et des techniques d'étude adaptées.",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500"
    },
    {
        title: "Groupe de parole",
        date: new Date('2024-02-20T19:00:00'),
        location: "Maison des associations",
        description: "Groupe de parole et de soutien psychologique pour partager nos expériences et s'entraider.",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500"
    },
    {
        title: "Formation en informatique",
        date: new Date('2024-03-01T10:00:00'),
        location: "Espace numérique",
        description: "Formation aux outils informatiques essentiels pour faciliter la recherche d'emploi et les études.",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"
    }
];

const sampleArticles = [
    {
        title: "Comment concilier études et maternité",
        author: "Dr. Marie Dubois",
        content: "Être mère et étudiante peut sembler un défi insurmontable, mais c'est tout à fait possible avec la bonne organisation et le bon soutien. Dans cet article, nous explorons les stratégies qui ont fait leurs preuves pour de nombreuses jeunes mères...",
        summary: "Découvrez les conseils pratiques pour réussir vos études tout en élevant votre enfant.",
        isPublished: true,
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"
    },
    {
        title: "Les ressources disponibles pour les jeunes mères",
        author: "Sophie Martin",
        content: "De nombreuses organisations et programmes existent pour soutenir les jeunes mères dans leur parcours. Nous avons compilé une liste des ressources les plus utiles, des aides financières aux services de garde d'enfants...",
        summary: "Un guide complet des aides et ressources disponibles pour les jeunes mères.",
        isPublished: true,
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500"
    },
    {
        title: "Témoignage : Mon parcours de jeune mère étudiante",
        author: "Camille Rousseau",
        content: "À 19 ans, j'ai découvert que j'étais enceinte. J'étais en première année d'université et je pensais que tout était fini. Mais grâce au soutien de mon entourage et des associations, j'ai pu continuer mes études...",
        summary: "L'histoire inspirante d'une jeune mère qui a réussi à concilier maternité et études.",
        isPublished: true,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500"
    }
];

const sampleTestimonials = [
    {
        name: "Sarah",
        age: 22,
        content: "Grâce au programme de soutien, j'ai pu reprendre mes études en informatique. Les cours de soutien scolaire m'ont vraiment aidée à rattraper mon retard.",
        approved: true
    },
    {
        name: "Emma",
        age: 20,
        content: "Le groupe de parole m'a permis de rencontrer d'autres jeunes mères dans la même situation que moi. On s'entraide et on se soutient mutuellement.",
        approved: true
    },
    {
        name: "Léa",
        age: 24,
        content: "Les ateliers de gestion du temps et d'organisation m'ont appris à mieux concilier ma vie de mère et mes projets professionnels.",
        approved: true
    },
    {
        name: "Julie",
        age: 19,
        content: "J'étais perdue quand j'ai découvert ma grossesse. L'accompagnement psychologique m'a aidée à retrouver confiance en moi et à construire un projet de vie.",
        approved: false
    }
];

// Fonction pour vider la base de données
async function clearDB() {
    try {
        await Event.deleteMany({});
        await Article.deleteMany({});
        await Testimonial.deleteMany({});
        console.log('Base de données vidée');
    } catch (error) {
        console.error('Erreur lors du vidage de la base:', error);
    }
}

// Fonction pour insérer les données de test
async function seedDB() {
    try {
        // Insérer les événements
        const events = await Event.insertMany(sampleEvents);
        console.log(`${events.length} événements créés`);

        // Insérer les articles
        const articles = await Article.insertMany(sampleArticles);
        console.log(`${articles.length} articles créés`);

        // Insérer les témoignages
        const testimonials = await Testimonial.insertMany(sampleTestimonials);
        console.log(`${testimonials.length} témoignages créés`);

        console.log('Base de données peuplée avec succès !');
    } catch (error) {
        console.error('Erreur lors du peuplement de la base:', error);
    }
}

// Fonction principale
async function main() {
    await connectDB();
    
    const args = process.argv.slice(2);
    const append = args.includes('--append') || process.env.SEED_APPEND === '1';
    
    // Demander confirmation avant de vider la base
    console.log('⚠️  ATTENTION: Ce script va vider la base de données existante !');
    console.log('Pour continuer, modifiez le code et décommentez la ligne clearDB()');
    
    // Décommentez la ligne suivante pour vider la base (attention !)
    // await clearDB();
    
    // Vérifier si la base est déjà peuplée
    const eventCount = await Event.countDocuments();
    const articleCount = await Article.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    
    if (append) {
        console.log("Mode ajout: insertion des données de test sans vider la base.");
        await seedDB();
    } else if (eventCount === 0 && articleCount === 0 && testimonialCount === 0) {
        await seedDB();
    } else {
        console.log('La base de données contient déjà des données:');
        console.log(`- Événements: ${eventCount}`);
        console.log(`- Articles: ${articleCount}`);
        console.log(`- Témoignages: ${testimonialCount}`);
        console.log('Pour ajouter des données sans vider, lancez: node seed.js --append ou SEED_APPEND=1 node seed.js');
        console.log('Pour refaire le peuplement en repartant de zéro, videz d\'abord la base avec clearDB()');
    }
    
    await mongoose.disconnect();
    console.log('Déconnexion de la base de données');
}

// Exécuter le script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { connectDB, clearDB, seedDB };

