const { Router } = require('express');
const { listMessages, createMessage, markRead, removeMessage } = require('../controllers/message');

const router = Router();

router.get('/', listMessages);
router.post('/', createMessage);
router.patch('/:id/read', markRead);
router.delete('/:id', removeMessage);

module.exports = router;


