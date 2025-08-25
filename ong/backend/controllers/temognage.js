const Testimonial = require('../model/temoignages');

// GET /api/testimonials - Récupérer tous les témoignages approuvés
async function getApprovedTestimonials(req, res) {
    try {
        const testimonials = await Testimonial.find({ approved: true })
            .sort({ created: -1 });
        // Retourner un tableau pour correspondre au frontend
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/testimonials/approved - Récupérer les témoignages approuvés (alias)
async function getApprovedTestimonialsAlias(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 0;
        
        let query = Testimonial.find({ approved: true })
            .sort({ created: -1 });
        
        if (limit > 0) {
            query = query.limit(limit);
        }
        
        const testimonials = await query.exec();
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/testimonials - Créer un nouveau témoignage
async function createTestimonial(req, res) {
    try {
        const testimonial = new Testimonial(req.body);
        const newTestimonial = await testimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PATCH /api/testimonials/:id/approve - Approuver un témoignage
async function approveTestimonial(req, res) {
    const{id}=req.params
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            { approved: true },
            { new: true }
        );
        
        if (!testimonial) {
            return res.status(404).json({ message: 'Témoignage non trouvé' });
        }
        
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/testimonials/:id - Supprimer un témoignage
async function deleteTestimonial(req, res) {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return res.status(404).json({ message: 'Témoignage non trouvé' });
        }
        
        res.json({ message: 'Témoignage supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/testimonials/:id - Récupérer un témoignage par ID
async function getTestimonialById(req, res) {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Témoignage non trouvé' });
        }
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getApprovedTestimonials,
    getApprovedTestimonialsAlias,
    createTestimonial,
    approveTestimonial,
    deleteTestimonial,
    getTestimonialById
};