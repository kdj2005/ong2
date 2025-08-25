const Message = require('../model/message');

async function listMessages(req, res) {
	try {
		const { onlyUnread } = req.query;
		const filter = onlyUnread === 'true' ? { read: false } : {};
		const messages = await Message.find(filter).sort({ created: -1 });
		res.json(messages);
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
}

async function createMessage(req, res) {
	try {
		const { name, email, message } = req.body || {};
		if (!name || !email || !message) {
			return res.status(400).json({ message: 'Champs manquants' });
		}
		const doc = await Message.create({ name, email, message });
		res.status(201).json(doc);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
}

async function markRead(req, res) {
	try {
		const { id } = req.params;
		const doc = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
		if (!doc) return res.status(404).json({ message: 'Message non trouvé' });
		res.json(doc);
	} catch (e) {
		res.status(400).json({ message: e.message });
	}
}

async function removeMessage(req, res) {
	try {
		const { id } = req.params;
		const doc = await Message.findByIdAndDelete(id);
		if (!doc) return res.status(404).json({ message: 'Message non trouvé' });
		res.json({ message: 'Message supprimé' });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
}

module.exports = { listMessages, createMessage, markRead, removeMessage };


