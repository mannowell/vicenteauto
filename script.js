// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

let isMenuOpen = false;

function toggleMenu() {
    if (!mobileMenu) return;
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
}
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Sticky Header Effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

// CAR FILTERING LOGIC (Only runs on viaturas.html)
const filterFuel = document.getElementById('filter-fuel');
const filterPrice = document.getElementById('filter-price');
const filterYear = document.getElementById('filter-year');
const carCards = document.querySelectorAll('.car-card');
const noCarsMsg = document.getElementById('no-cars-msg');

function applyFilters() {
    if (!filterFuel || !filterPrice || !filterYear) return;
    
    const fuelVal = filterFuel.value;
    const priceVal = filterPrice.value;
    const yearVal = filterYear.value;
    
    let visibleCount = 0;

    carCards.forEach(card => {
        const cardFuel = card.dataset.fuel;
        const cardPrice = parseInt(card.dataset.price);
        const cardYear = parseInt(card.dataset.year);

        let showFuel = fuelVal === 'all' || cardFuel === fuelVal;
        
        let showPrice = false;
        if (priceVal === 'all') showPrice = true;
        else if (priceVal === 'under5k' && cardPrice <= 5000) showPrice = true;
        else if (priceVal === '5k-15k' && cardPrice > 5000 && cardPrice <= 15000) showPrice = true;
        else if (priceVal === 'over15k' && cardPrice > 15000) showPrice = true;

        let showYear = false;
        if (yearVal === 'all') showYear = true;
        else if (yearVal === '2015+' && cardYear >= 2015) showYear = true;
        else if (yearVal === '2005-2014' && cardYear >= 2005 && cardYear <= 2014) showYear = true;
        else if (yearVal === 'pre2005' && cardYear < 2005) showYear = true;

        if (showFuel && showPrice && showYear) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noCarsMsg) {
        if (visibleCount === 0) {
            noCarsMsg.classList.remove('hidden');
        } else {
            noCarsMsg.classList.add('hidden');
        }
    }
}

function resetFilters() {
    if (filterFuel) filterFuel.value = 'all';
    if (filterPrice) filterPrice.value = 'all';
    if (filterYear) filterYear.value = 'all';
    applyFilters();
}

if (filterFuel) filterFuel.addEventListener('change', applyFilters);
if (filterPrice) filterPrice.addEventListener('change', applyFilters);
if (filterYear) filterYear.addEventListener('change', applyFilters);


// GALLERY MODAL LOGIC
const galleries = {
    'bmw': { path: 'images/bmw/bmw-serie1-', count: 13, ext: '.jpg' },
    'corsa': { path: 'images/corsa/corsa-', count: 5, ext: '.jpg' },
    'peugeot': { path: 'images/peugeot/peugeot-308-', count: 6, ext: '.jpg' },
    'polo': { path: 'images/polo/polo-', count: 9, ext: '.jpg' }
};

const modal = document.getElementById('gallery-modal');
const mainImg = document.getElementById('gallery-main-img');
const counter = document.getElementById('gallery-counter');
const closeBtn = document.getElementById('close-gallery');
const prevBtns = [document.getElementById('prev-btn'), document.getElementById('prev-btn-mobile')];
const nextBtns = [document.getElementById('next-btn'), document.getElementById('next-btn-mobile')];

let currentGallery = '';
let currentIndex = 1;

function updateGalleryImage() {
    if (!mainImg || !counter) return;
    
    const fallbackSrc = `https://placehold.co/800x600/1a1a1a/f59e0b?text=Imagem+${currentIndex}`;
    const realSrc = `${galleries[currentGallery].path}${currentIndex}${galleries[currentGallery].ext}`;
    
    mainImg.src = realSrc;
    mainImg.onerror = function() {
        this.src = fallbackSrc;
    };
    
    counter.textContent = `${currentIndex} / ${galleries[currentGallery].count}`;
}

window.openGallery = function(carId) {
    if (!galleries[carId] || !modal) return;
    currentGallery = carId;
    currentIndex = 1; 
    updateGalleryImage();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function nextImage() {
    if (!currentGallery) return;
    currentIndex++;
    if (currentIndex > galleries[currentGallery].count) {
        currentIndex = 1;
    }
    updateGalleryImage();
}

function prevImage() {
    if (!currentGallery) return;
    currentIndex--;
    if (currentIndex < 1) {
        currentIndex = galleries[currentGallery].count;
    }
    updateGalleryImage();
}

if (closeBtn) closeBtn.addEventListener('click', closeGallery);

nextBtns.forEach(btn => { if (btn) btn.addEventListener('click', nextImage); });
prevBtns.forEach(btn => { if (btn) btn.addEventListener('click', prevImage); });

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGallery();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (!modal || modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});
