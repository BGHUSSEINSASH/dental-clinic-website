// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('header');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Here you would typically send the data to a server
        // For now, we'll just show an alert
        alert('شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً.');
        
        // Reset form
        contactForm.reset();
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards, gallery items, and features
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .feature, .qual-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Gallery Item Click Handler (for future image modal implementation)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // Here you can implement a lightbox/modal to show full images
        console.log('Gallery item clicked');
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#7b1e3a'; // active maroon
            } else {
                navLink.style.color = '#2a0e14'; // default dark
            }
        }
    });
});

/* ===================== NEWS & NEWSLETTER LOGIC ===================== */
const NEWS_KEY = 'clinic_news_items';
const SUBSCRIBERS_KEY = 'clinic_newsletter_subscribers';

function loadStoredArray(key){
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function saveStoredArray(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

// Render news on index page
function renderNewsFeed(){
    const container = document.getElementById('newsItems');
    if(!container) return;
    const items = loadStoredArray(NEWS_KEY).sort((a,b)=> new Date(b.date) - new Date(a.date));
    container.innerHTML = '';
    if(items.length === 0){
        container.innerHTML = '<div class="empty-news">لا توجد أخبار بعد. قم بزيارة لوحة التحكم لإضافة أول خبر.</div>';
        return;
    }
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-card';
        div.innerHTML = `
            <h4>${escapeHtml(item.title)}</h4>
            <div class="news-meta">
                <span><i class="far fa-calendar"></i> ${new Date(item.date).toLocaleDateString('ar-EG')}</span>
                ${item.category ? `<span><i class="fas fa-tag"></i> ${escapeHtml(item.category)}</span>` : ''}
            </div>
            <p>${escapeHtml(item.body)}</p>
        `;
        container.appendChild(div);
    });
}

// Newsletter subscription
function setupNewsletter(){
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const messageBox = document.getElementById('newsletterMessage');
    const latest = document.getElementById('latestSubscriber');
    if(!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = (emailInput.value || '').trim().toLowerCase();
        if(!validateEmail(email)){
            showNewsletterMessage('الرجاء إدخال بريد صالح.', 'error');
            return;
        }
        const subs = loadStoredArray(SUBSCRIBERS_KEY);
        if(subs.includes(email)){
            showNewsletterMessage('هذا البريد مشترك مسبقاً.', 'error');
            return;
        }
        subs.push(email);
        saveStoredArray(SUBSCRIBERS_KEY, subs);
        showNewsletterMessage('تم الاشتراك بنجاح! شكراً لانضمامك.', 'success');
        latest.hidden = false;
        latest.textContent = 'آخر مشترك: ' + email;
        form.reset();
    });
}

function showNewsletterMessage(msg, type){
    const box = document.getElementById('newsletterMessage');
    if(!box) return;
    box.className = 'newsletter-message ' + type;
    box.textContent = msg;
}

// Admin logic (news & subscribers)
function setupAdminPanel(){
    const newsForm = document.getElementById('newsForm');
    const adminNewsList = document.getElementById('adminNewsList');
    const subscriberList = document.getElementById('subscriberList');
    const clearNewsBtn = document.getElementById('clearNews');
    const clearSubsBtn = document.getElementById('clearSubscribers');
    if(!newsForm) return; // not on admin page

    // Render existing items
    renderAdminNews();
    renderSubscribers();

    newsForm.addEventListener('submit', e => {
        e.preventDefault();
        const title = document.getElementById('newsTitle').value.trim();
        const body = document.getElementById('newsBody').value.trim();
        const category = document.getElementById('newsCategory').value.trim();
        if(!title || !body){ return; }
        const items = loadStoredArray(NEWS_KEY);
        items.push({ id: Date.now(), title, body, category, date: new Date().toISOString() });
        saveStoredArray(NEWS_KEY, items);
        newsForm.reset();
        renderAdminNews();
    });

    clearNewsBtn && clearNewsBtn.addEventListener('click', () => {
        if(confirm('هل تريد فعلاً مسح كل الأخبار؟')){
            saveStoredArray(NEWS_KEY, []);
            renderAdminNews();
        }
    });

    clearSubsBtn && clearSubsBtn.addEventListener('click', () => {
        if(confirm('مسح جميع المشتركين؟')){
            saveStoredArray(SUBSCRIBERS_KEY, []);
            renderSubscribers();
        }
    });

    function renderAdminNews(){
        const items = loadStoredArray(NEWS_KEY).sort((a,b)=> new Date(b.date)-new Date(a.date));
        adminNewsList.innerHTML='';
        if(items.length===0){
            adminNewsList.innerHTML='<div class="empty-news">لا توجد أخبار بعد.</div>';
            renderNewsFeed();
            return;
        }
        items.forEach(item => {
            const wrap = document.createElement('div');
            wrap.className='news-admin-item';
            wrap.innerHTML = `
                <h4>${escapeHtml(item.title)}</h4>
                <small>${new Date(item.date).toLocaleString('ar-EG')} ${item.category? ' | '+escapeHtml(item.category): ''}</small>
                <p style="margin:0;font-size:.8rem;color:#555;">${escapeHtml(item.body)}</p>
                <button class="delete-news" data-id="${item.id}" title="حذف">حذف</button>
            `;
            adminNewsList.appendChild(wrap);
        });
        adminNewsList.querySelectorAll('.delete-news').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                let items = loadStoredArray(NEWS_KEY);
                items = items.filter(i => i.id !== id);
                saveStoredArray(NEWS_KEY, items);
                renderAdminNews();
            });
        });
        renderNewsFeed(); // update public page if open in same tab
    }

    function renderSubscribers(){
        const subs = loadStoredArray(SUBSCRIBERS_KEY);
        subscriberList.innerHTML='';
        if(subs.length===0){
            subscriberList.innerHTML='<li style="background:#fff;">لا يوجد مشتركون.</li>';
            return;
        }
        subs.forEach(email => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${email}</span><button class="remove-subscriber" data-email="${email}" title="حذف">حذف</button>`;
            subscriberList.appendChild(li);
        });
        subscriberList.querySelectorAll('.remove-subscriber').forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-email');
                let subs = loadStoredArray(SUBSCRIBERS_KEY).filter(s => s !== email);
                saveStoredArray(SUBSCRIBERS_KEY, subs);
                renderSubscribers();
            });
        });
    }
}

// Helpers
function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function escapeHtml(str){
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

// Init depending on page
document.addEventListener('DOMContentLoaded', () => {
    renderNewsFeed();
    setupNewsletter();
    setupAdminPanel();
});