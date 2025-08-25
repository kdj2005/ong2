// URL de l'API backend (à modifier selon votre configuration)
const API_BASE_URL = 'https://ong-3ani.onrender.com/api';

// Fonction pour formater la date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Charger les événements
async function loadEvents(limit = 3) {
    try {
        const response = await fetch(`${API_BASE_URL}/events?limit=${limit}&sort=date`);
        const events = await response.json();
        
        const container = document.getElementById('eventsPreview');
        if (!container) return;
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-center">Aucun événement prévu pour le moment.</p>';
            return;
        }
        
        let html = '';
        events.forEach(event => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card event-card">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text"><i class="fas fa-calendar me-2"></i> ${formatDate(event.date)}</p>
                            <p class="card-text"><i class="fas fa-map-marker-alt me-2"></i> ${event.location}</p>
                            <p class="card-text">${event.description.substring(0, 100)}...</p>
                            <a href="evenements.html#event-${event._id}" class="btn btn-primary">En savoir plus</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        document.getElementById('eventsPreview').innerHTML = 
            '<p class="text-center">Impossible de charger les événements.</p>';
    }
}

// Charger les articles
async function loadArticles(limit = 3) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles?limit=${limit}&sort=-date`);
        const articles = await response.json();
        
        const container = document.getElementById('articlesPreview');
        if (!container) return;
        
        if (articles.length === 0) {
            container.innerHTML = '<p class="text-center">Aucun article publié pour le moment.</p>';
            return;
        }
        
        let html = '';
        articles.forEach(article => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card article-card">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text"><small class="text-muted">Par ${article.author} • ${formatDate(article.date)}</small></p>
                            <p class="card-text">${article.content.substring(0, 150)}...</p>
                            <a href="articles.html#article-${article._id}" class="btn btn-primary">Lire la suite</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        document.getElementById('articlesPreview').innerHTML = 
            '<p class="text-center">Impossible de charger les articles.</p>';
    }
}

// Charger les témoignages
async function loadTestimonials() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials?approved=true`);
        const testimonials = await response.json();
        
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;
        
        if (testimonials.length === 0) {
            container.innerHTML = '<p class="text-center">Aucun témoignage pour le moment.</p>';
            return;
        }
        
        let html = '';
        testimonials.forEach(testimonial => {
            html += `
                <div class="col-md-6 mb-4">
                    <div class="testimonial-card">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="ms-3">
                                <h5 class="mb-0">${testimonial.name}, ${testimonial.age} ans</h5>
                                <p class="text-muted mb-0">Bénéficiaire du programme</p>
                            </div>
                        </div>
                        <p class="mb-0">"${testimonial.content}"</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
        document.getElementById('testimonialsContainer').innerHTML = 
            '<p class="text-center">Impossible de charger les témoignages.</p>';
    }
}

// Rendu détail Article
async function loadArticleDetail(articleId) {
    const listContainer = document.getElementById('articlesPreview');
    const detailContainer = document.getElementById('articleDetail');
    if (!detailContainer) return;

    if (!articleId) {
        if (detailContainer) detailContainer.innerHTML = '';
        if (listContainer) listContainer.style.display = '';
        return;
    }

    if (listContainer) listContainer.style.display = 'none';
    detailContainer.innerHTML = '<p>Chargement...</p>';

    try {
        const res = await fetch(`${API_BASE_URL}/articles/${articleId}`);
        const data = await res.json();
        const article = data?.data || data;
        if (!article || article.message === 'Article non trouvé') {
            detailContainer.innerHTML = '<div class="alert alert-warning">Article introuvable.</div>';
            return;
        }
        detailContainer.innerHTML = `
            <div class="article-detail">
                <h1 class="mb-3">${article.title}</h1>
                <p class="text-muted mb-4">Par ${article.author} • ${formatDate(article.date)}</p>
                ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" class="img-fluid rounded mb-4"/>` : ''}
                <div>${article.content.replace(/\n/g, '<br/>')}</div>
                <div class="mt-4">
                    <a href="articles.html" class="btn btn-primary">← Retour aux articles</a>
                </div>
            </div>
        `;
    } catch (e) {
        detailContainer.innerHTML = '<div class="alert alert-danger">Impossible de charger l\'article.</div>';
    }
}

// Rendu détail Événement
async function loadEventDetail(eventId) {
    const listContainer = document.getElementById('eventsPreview');
    const detailContainer = document.getElementById('eventDetail');
    if (!detailContainer) return;

    if (!eventId) {
        if (detailContainer) detailContainer.innerHTML = '';
        if (listContainer) listContainer.style.display = '';
        return;
    }

    if (listContainer) listContainer.style.display = 'none';
    detailContainer.innerHTML = '<p>Chargement...</p>';

    try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`);
        const data = await res.json();
        const event = data?.data || data;
        if (!event || event.message === 'Événement non trouvé') {
            detailContainer.innerHTML = '<div class="alert alert-warning">Événement introuvable.</div>';
            return;
        }
        detailContainer.innerHTML = `
            <div class="event-detail">
                <h1 class="mb-3">${event.title}</h1>
                <p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i>${formatDate(event.date)}</p>
                <p class="text-muted mb-4"><i class="fas fa-map-marker-alt me-2"></i>${event.location || ''}</p>
                ${event.imageUrl ? `<img src="${event.imageUrl}" alt="${event.title}" class="img-fluid rounded mb-4"/>` : ''}
                <div>${event.description.replace(/\n/g, '<br/>')}</div>
                <div class="mt-4">
                    <a href="evenements.html" class="btn btn-primary">← Retour aux événements</a>
                </div>
            </div>
        `;
    } catch (e) {
        detailContainer.innerHTML = '<div class="alert alert-danger">Impossible de charger l\'événement.</div>';
    }
}

function handleHashNavigation() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#article-')) {
        const id = hash.replace('#article-', '').trim();
        loadArticleDetail(id);
    } else if (hash.startsWith('#event-')) {
        const id = hash.replace('#event-', '').trim();
        loadEventDetail(id);
    } else {
        // Pas de hash: afficher les listes si présentes
        loadArticleDetail(null);
        loadEventDetail(null);
    }
}

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Charger le contenu dynamique selon la page
    if (document.getElementById('eventsPreview')) {
        loadEvents();
    }
    
    if (document.getElementById('articlesPreview')) {
        loadArticles();
    }
    
    if (document.getElementById('testimonialsContainer')) {
        loadTestimonials();
    }
    
    // Détails selon hash
    if (document.getElementById('articleDetail') || document.getElementById('eventDetail')) {
        handleHashNavigation();
        window.addEventListener('hashchange', handleHashNavigation);
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Votre message a été envoyé avec succès!');
                    contactForm.reset();
                } else {
                    alert('Une erreur est survenue. Veuillez réessayer.');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }
});