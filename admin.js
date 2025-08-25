// URL de l'API backend (gardé cohérent avec main.js)
const API_BASE_URL = 'http://localhost:3000/api';

// ------------------------- Utilitaires -------------------------
function formatDate(dateString) {
	if (!dateString) return '';
	try {
		return new Date(dateString).toLocaleString('fr-FR');
	} catch (_) {
		return dateString;
	}
}

async function fetchJSON(url, options = {}) {
	const response = await fetch(url, {
		headers: { 'Content-Type': 'application/json' },
		...options
	});
	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `HTTP ${response.status}`);
	}
	return response.json().catch(() => ({}));
}

function $(id) {
	return document.getElementById(id);
}

// ------------------------- Auth simple -------------------------
function showLogin() {
	$('loginScreen').style.display = 'block';
	$('adminDashboard').style.display = 'none';
}

function showAdmin() {
	$('loginScreen').style.display = 'none';
	$('adminDashboard').style.display = 'block';
	showSection('dashboard');
	loadDashboardCounts();
	loadEventsTable();
	loadArticlesTable();
	loadTestimonialsTable();
	loadMessagesTable();
}

function logout() {
	localStorage.removeItem('adminLoggedIn');
	showLogin();
}

// ------------------------- Sections -------------------------
function showSection(section) {
	const sections = ['dashboard', 'events', 'articles', 'testimonials', 'messages'];
	sections.forEach(s => {
		const el = $(s + 'Section');
		if (el) el.style.display = s === section ? 'block' : 'none';
	});
}

// ------------------------- Dashboard -------------------------
async function loadDashboardCounts() {
	try {
		const [events, articles, testimonials, unread] = await Promise.all([
			fetchJSON(`${API_BASE_URL}/events`),
			fetchJSON(`${API_BASE_URL}/articles`),
			fetchJSON(`${API_BASE_URL}/testimonials`),
			fetchJSON(`${API_BASE_URL}/messages?onlyUnread=true`)
		]);
		$('eventsCount').textContent = Array.isArray(events) ? events.length : 0;
		$('articlesCount').textContent = Array.isArray(articles) ? articles.length : 0;
		$('testimonialsCount').textContent = Array.isArray(testimonials) ? testimonials.length : 0;
		$('pendingCount').textContent = Array.isArray(unread) ? unread.length : 0;
	} catch (e) {
		$('eventsCount').textContent = '0';
		$('articlesCount').textContent = '0';
		$('testimonialsCount').textContent = '0';
		$('pendingCount').textContent = '0';
	}
}

// ------------------------- Événements -------------------------
	function openEventForm(editData) {
	$('eventForm').style.display = 'block';
	$('eventFormTitle').textContent = editData ? 'Modifier l\'événement' : 'Nouvel événement';
	$('eventId').value = editData?._id || '';
	$('eventTitle').value = editData?.title || '';
	$('eventDate').value = editData?.date ? new Date(editData.date).toISOString().slice(0,16) : '';
	$('eventLocation').value = editData?.location || '';
	$('eventDescription').value = editData?.description || '';
	$('eventImageUrl').value = editData?.imageUrl || '';
}

function hideEventForm() {
	$('eventForm').style.display = 'none';
	$('eventFormElement').reset();
	$('eventId').value = '';
}

async function loadEventsTable() {
	const tbody = $('eventsTableBody');
	if (!tbody) return;
	tbody.innerHTML = '<tr><td colspan="4" class="text-center">Chargement...</td></tr>';
	try {
		const data = await fetchJSON(`${API_BASE_URL}/events?sort=-date`);
		if (!Array.isArray(data) || data.length === 0) {
			tbody.innerHTML = '<tr><td colspan="4" class="text-center">Aucun événement</td></tr>';
			return;
		}
		tbody.innerHTML = data.map(e => `
			<tr>
				<td>${e.title}</td>
				<td>${formatDate(e.date)}</td>
				<td>${e.location || ''}</td>
				<td>
					<button class="btn btn-sm btn-secondary me-2" data-action="edit-event" data-id="${e._id}">Modifier</button>
					<button class="btn btn-sm btn-danger" data-action="delete-event" data-id="${e._id}">Supprimer</button>
				</td>
			</tr>
		`).join('');
	} catch (e) {
		tbody.innerHTML = '<tr><td colspan="4" class="text-center">Erreur de chargement</td></tr>';
	}
}

// ------------------------- Articles -------------------------
	function openArticleForm(editData) {
	$('articleForm').style.display = 'block';
	$('articleFormTitle').textContent = editData ? 'Modifier l\'article' : 'Nouvel article';
	$('articleId').value = editData?._id || '';
	$('articleTitle').value = editData?.title || '';
	$('articleAuthor').value = editData?.author || '';
	$('articleSummary').value = editData?.summary || '';
	$('articleContent').value = editData?.content || '';
	$('articleImageUrl').value = editData?.imageUrl || '';
	$('articlePublished').checked = editData?.isPublished ?? true;
}

function hideArticleForm() {
	$('articleForm').style.display = 'none';
	$('articleFormElement').reset();
	$('articleId').value = '';
}

async function loadArticlesTable() {
	const tbody = $('articlesTableBody');
	if (!tbody) return;
	tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chargement...</td></tr>';
	try {
		const data = await fetchJSON(`${API_BASE_URL}/articles?sort=-date`);
		if (!Array.isArray(data) || data.length === 0) {
			tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun article</td></tr>';
			return;
		}
		tbody.innerHTML = data.map(a => `
			<tr>
				<td>${a.title}</td>
				<td>${a.author}</td>
				<td>${formatDate(a.date)}</td>
				<td>${a.isPublished ? 'Publié' : 'Brouillon'}</td>
				<td>
					<button class="btn btn-sm btn-secondary me-2" data-action="edit-article" data-id="${a._id}">Modifier</button>
					<button class="btn btn-sm btn-danger" data-action="delete-article" data-id="${a._id}">Supprimer</button>
				</td>
			</tr>
		`).join('');
	} catch (e) {
		tbody.innerHTML = '<tr><td colspan="5" class="text-center">Erreur de chargement</td></tr>';
	}
}

// ------------------------- Témoignages -------------------------
	function openTestimonialForm(editData) {
	$('testimonialForm').style.display = 'block';
	$('testimonialFormTitle').textContent = 'Nouveau témoignage';
	$('testimonialId').value = '';
	$('testimonialName').value = '';
	$('testimonialAge').value = '';
	$('testimonialContent').value = '';
	$('testimonialApproved').checked = true;
}

function hideTestimonialForm() {
	$('testimonialForm').style.display = 'none';
	$('testimonialFormElement').reset();
	$('testimonialId').value = '';
}

async function loadTestimonialsTable() {
	const tbody = $('testimonialsTableBody');
	if (!tbody) return;
	tbody.innerHTML = '<tr><td colspan="5" class="text-center">Chargement...</td></tr>';
	try {
		const data = await fetchJSON(`${API_BASE_URL}/testimonials`);
		if (!Array.isArray(data) || data.length === 0) {
			tbody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun témoignage</td></tr>';
			return;
		}
		tbody.innerHTML = data.map(t => `
			<tr>
				<td>${t.name}</td>
				<td>${t.age}</td>
				<td>${t.content}</td>
				<td>${t.approved ? 'Approuvé' : 'En attente'}</td>
				<td>
					<button class="btn btn-sm btn-danger" data-action="delete-testimonial" data-id="${t._id}">Supprimer</button>
				</td>
			</tr>
		`).join('');
	} catch (e) {
		tbody.innerHTML = '<tr><td colspan="5" class="text-center">Erreur de chargement</td></tr>';
	}
}

// ------------------------- Messages -------------------------
async function loadMessagesTable(onlyUnread = false) {
	const tbody = $('messagesTableBody');
	if (!tbody) return;
	tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chargement...</td></tr>';
	try {
		const data = await fetchJSON(`${API_BASE_URL}/messages${onlyUnread ? '?onlyUnread=true' : ''}`);
		if (!Array.isArray(data) || data.length === 0) {
			tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun message</td></tr>';
			return;
		}
		tbody.innerHTML = data.map(m => `
			<tr>
				<td>${m.name}</td>
				<td><a href="mailto:${m.email}">${m.email}</a></td>
				<td>${m.message}</td>
				<td>${formatDate(m.created)}</td>
				<td>${m.read ? 'Lu' : 'Non lu'}</td>
				<td>
					<button class="btn btn-sm btn-outline-success me-2" data-action="msg-read" data-id="${m._id}" ${m.read ? 'disabled' : ''}>Marquer lu</button>
					<button class="btn btn-sm btn-danger" data-action="msg-delete" data-id="${m._id}">Supprimer</button>
				</td>
			</tr>
		`).join('');
	} catch (e) {
		tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erreur de chargement</td></tr>';
	}
}

// ------------------------- Listeners globaux -------------------------
document.addEventListener('DOMContentLoaded', () => {
	// Gestion login
	const loginForm = $('loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const username = $('username').value.trim();
			const password = $('password').value.trim();
			if (username === 'admin' && password === 'admin123') {
				localStorage.setItem('adminLoggedIn', 'true');
				showAdmin();
			} else {
				alert('Identifiants invalides');
			}
		});
	}

	if (localStorage.getItem('adminLoggedIn') === 'true') {
		showAdmin();
	} else {
		showLogin();
	}

	// Submit Événement
	const eventFormEl = $('eventFormElement');
	if (eventFormEl) {
		eventFormEl.addEventListener('submit', async (e) => {
			e.preventDefault();
			const id = $('eventId').value;
			const payload = {
				title: $('eventTitle').value.trim(),
				date: new Date($('eventDate').value).toISOString(),
				location: $('eventLocation').value.trim(),
				description: $('eventDescription').value.trim(),
				imageUrl: $('eventImageUrl').value.trim()
			};
			try {
				if (id) {
					await fetchJSON(`${API_BASE_URL}/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
				} else {
					await fetchJSON(`${API_BASE_URL}/events`, { method: 'POST', body: JSON.stringify(payload) });
				}
				hideEventForm();
				await loadEventsTable();
				await loadDashboardCounts();
			} catch (err) {
				alert('Erreur lors de l\'enregistrement de l\'événement');
			}
		});
	}

	// Submit Article
	const articleFormEl = $('articleFormElement');
	if (articleFormEl) {
		articleFormEl.addEventListener('submit', async (e) => {
			e.preventDefault();
			const id = $('articleId').value;
			const payload = {
				title: $('articleTitle').value.trim(),
				author: $('articleAuthor').value.trim(),
				summary: $('articleSummary').value.trim(),
				content: $('articleContent').value.trim(),
				imageUrl: $('articleImageUrl').value.trim(),
				isPublished: $('articlePublished').checked
			};
			try {
				if (id) {
					await fetchJSON(`${API_BASE_URL}/articles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
				} else {
					await fetchJSON(`${API_BASE_URL}/articles`, { method: 'POST', body: JSON.stringify(payload) });
				}
				hideArticleForm();
				await loadArticlesTable();
				await loadDashboardCounts();
			} catch (err) {
				alert('Erreur lors de l\'enregistrement de l\'article');
			}
		});
	}

	// Submit Témoignage
	const testimonialFormEl = $('testimonialFormElement');
	if (testimonialFormEl) {
		testimonialFormEl.addEventListener('submit', async (e) => {
			e.preventDefault();
			const age = parseInt($('testimonialAge').value, 10);
			if (isNaN(age) || age < 10 || age > 30) {
				alert('Âge invalide (10-30)');
				return;
			}
			const payload = {
				name: $('testimonialName').value.trim(),
				age,
				content: $('testimonialContent').value.trim(),
				approved: $('testimonialApproved').checked
			};
			try {
				await fetchJSON(`${API_BASE_URL}/testimonials`, { method: 'POST', body: JSON.stringify(payload) });
				hideTestimonialForm();
				await loadTestimonialsTable();
				await loadDashboardCounts();
			} catch (err) {
				alert('Erreur lors de l\'enregistrement du témoignage');
			}
		});
	}

	// Délégation actions tableaux
	document.body.addEventListener('click', async (e) => {
		const btn = e.target.closest('button[data-action]');
		if (!btn) return;
		const action = btn.getAttribute('data-action');
		const id = btn.getAttribute('data-id');

		try {
			if (action === 'edit-event') {
				const data = await fetchJSON(`${API_BASE_URL}/events/${id}`);
				showSection('events');
				openEventForm(data?.data || data);
			}
			if (action === 'delete-event') {
				if (confirm('Supprimer cet événement ?')) {
					await fetchJSON(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
					await loadEventsTable();
					await loadDashboardCounts();
				}
			}
			if (action === 'edit-article') {
				const data = await fetchJSON(`${API_BASE_URL}/articles/${id}`);
				const article = data?.data || data;
				showSection('articles');
				openArticleForm(article);
			}
			if (action === 'delete-article') {
				if (confirm('Supprimer cet article ?')) {
					await fetchJSON(`${API_BASE_URL}/articles/${id}`, { method: 'DELETE' });
					await loadArticlesTable();
					await loadDashboardCounts();
				}
			}
			if (action === 'delete-testimonial') {
				if (confirm('Supprimer ce témoignage ?')) {
					await fetchJSON(`${API_BASE_URL}/testimonials/${id}`, { method: 'DELETE' });
					await loadTestimonialsTable();
					await loadDashboardCounts();
				}
			}
			if (action === 'msg-read') {
				await fetchJSON(`${API_BASE_URL}/messages/${id}/read`, { method: 'PATCH' });
				await loadMessagesTable();
				await loadDashboardCounts();
			}
			if (action === 'msg-delete') {
				if (confirm('Supprimer ce message ?')) {
					await fetchJSON(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
					await loadMessagesTable();
					await loadDashboardCounts();
				}
			}
		} catch (err) {
			alert('Une erreur est survenue');
		}
	});
});

// Expose les fonctions utilisées dans le HTML inline
window.showSection = showSection;
window.logout = logout;
window.showEventForm = () => openEventForm();
window.hideEventForm = hideEventForm;
window.showArticleForm = () => openArticleForm();
window.hideArticleForm = hideArticleForm;
window.showTestimonialForm = () => openTestimonialForm();
window.hideTestimonialForm = hideTestimonialForm;


