const Event = require('../model/event');

// GET /api/events - Récupérer tous les événements avec options de filtrage
async function getEvents(req, res) {
    try {
        const { limit, sort } = req.query;
        let query = Event.find();
        
        // Trier les événements
        if (sort === 'date') {
            query = query.sort({ date: 1 }); // Croissant
        } else if (sort === '-date') {
            query = query.sort({ date: -1 }); // Décroissant
        } else {
            query = query.sort({ date: 1 }); // Par défaut: date croissante
        }
        
        // Limiter le nombre de résultats
        if (limit) {
            query = query.limit(parseInt(limit));
        }
        
        const events = await query.exec();
        // Retourner un tableau pour correspondre au frontend
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// GET /api/events/:id - Récupérer un événement spécifique
async function getEventById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'événement manquant' });
    }
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        res.status(200).json({ message: 'Événement récupéré avec succès', data: event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/events - Créer un nouvel événement
async function createEvent(req, res) {
    try {
        const event = new Event(req.body);
        const newEvent = await event.save();
        res.status(201).json({ message: 'Événement créé avec succès', data: newEvent });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// PUT /api/events/:id - Mettre à jour un événement
async function updateEvent(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'événement manquant' });
    }
    try {
        const event = await Event.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /api/events/:id - Supprimer un événement
async function deleteEvent(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'événement manquant' });
    }
    try {
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }
        
        res.json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};