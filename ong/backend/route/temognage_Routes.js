const{Router}=require("express")
const{createTestimonial,approveTestimonial,deleteTestimonial,getTestimonialById,getApprovedTestimonials,getApprovedTestimonialsAlias}=require('../controllers/temognage')

const testimonialRouter=Router()

// Aligner avec le frontend: GET /api/testimonials?approved=true
testimonialRouter.get('/', getApprovedTestimonials);
testimonialRouter.get('/approved', getApprovedTestimonialsAlias);
testimonialRouter.post('/', createTestimonial);
testimonialRouter.patch('/:id/approve', approveTestimonial);
testimonialRouter.delete('/:id', deleteTestimonial);
testimonialRouter.get('/:id', getTestimonialById);

module.exports = testimonialRouter;
