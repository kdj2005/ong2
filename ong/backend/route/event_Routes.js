const{Router}=require("express")
const{createEvent,updateEvent
    ,deleteEvent,getEventById,getEvents}=require("../controllers/event")

const eventRouter=Router()

// Aligner avec le frontend: GET /api/events?limit=&sort=
eventRouter.get('/', getEvents);
eventRouter.post('/', createEvent);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);
eventRouter.get('/:id', getEventById);
    

module.exports = eventRouter;