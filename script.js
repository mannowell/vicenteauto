// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
let isMenuOpen = false;

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    
    // Create overlay
    const mobileOverlay = document.createElement('div');
    mobileOverlay.id = 'mobile-overlay';
    mobileOverlay.className = 'fixed inset-0 bg-black/80 z-[55] hidden transition-opacity duration-300 md:hidden';
    
    // Insert overlay before menu
    if (mobileMenu) {
        mobileMenu.parentNode.insertBefore(mobileOverlay, mobileMenu);
    }

    window.toggleMenu = function() {
        if (!mobileMenu) return;
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('translate-x-full');
            mobileOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            mobileOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
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
const searchCar = document.getElementById('search-car');
const resultsCounter = document.getElementById('results-counter');
const carCards = document.querySelectorAll('#cars-grid .car-card');
const noCarsMsg = document.getElementById('no-cars-msg');

function applyFilters() {
    // Only proceed if elements are present on the current page
    const hasFilters = filterFuel && filterPrice && filterYear;
    if (!hasFilters && !searchCar) return;
    
    const fuelVal = filterFuel ? filterFuel.value : 'all';
    const priceVal = filterPrice ? filterPrice.value : 'all';
    const yearVal = filterYear ? filterYear.value : 'all';
    const searchVal = searchCar ? searchCar.value.toLowerCase().trim() : '';
    
    let visibleCount = 0;
    const totalCount = carCards.length;

    carCards.forEach(card => {
        const cardFuel = card.dataset.fuel || '';
        const cardPrice = parseInt(card.dataset.price) || 0;
        const cardYear = parseInt(card.dataset.year) || 0;

        // Search match on title or subtitle / metadata
        const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const matchesSearch = searchVal === '' || cardTitle.includes(searchVal);

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

        if (showFuel && showPrice && showYear && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (resultsCounter) {
        resultsCounter.innerHTML = `A mostrar <span class="text-brand-accent font-bold">${visibleCount}</span> de <span class="text-white font-bold">${totalCount}</span> viaturas`;
    }

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
    if (searchCar) searchCar.value = '';
    applyFilters();
}

// Initial count/filtering setup
if (carCards.length > 0) {
    applyFilters();
}

if (filterFuel) filterFuel.addEventListener('change', applyFilters);
if (filterPrice) filterPrice.addEventListener('change', applyFilters);
if (filterYear) filterYear.addEventListener('change', applyFilters);
if (searchCar) searchCar.addEventListener('input', applyFilters);


// VEHICLE DATABASE
const vehicleDb = {
    'bmw': {
        name: 'BMW Série 1',
        subtitle: 'Pack M Sport / Extras',
        price: '15.900',
        numericPrice: 15900,
        year: '2015',
        kms: '191.000',
        fuel: 'Gasóleo',
        engine: '1.995 cc (2.0L)',
        power: '150 cv',
        gearbox: 'Manual (6 vel.)',
        color: 'Cinzento Mineral',
        seats: '5',
        doors: '5',
        equipment: [
            'Pack Desportivo M interior & exterior',
            'Jantes Especiais M de 18 polegadas',
            'Faróis LED direcionais de alta performance',
            'Estofos Desportivos em Alcantara M',
            'Sistema de Navegação GPS Business',
            'Sensores de Estacionamento Traseiros & Dianteiros',
            'Ar Condicionado Automático Dual Zone',
            'Cruise Control com função de travagem',
            'Modos de Condução (Eco Pro, Comfort, Sport, Sport+)',
            'Volante Desportivo M multifunções em pele',
            'Bluetooth & Entrada USB'
        ],
        gallery: { path: 'images/bmw/bmw-serie1-', count: 13, ext: '.jpg' }
    },
    'corsa': {
        name: 'Opel Corsa B',
        subtitle: '1.2 Swing / Inspeção Válida',
        price: '700',
        numericPrice: 700,
        year: '1996',
        kms: '222.000',
        fuel: 'Gasolina',
        engine: '1.196 cc',
        power: '45 cv',
        gearbox: 'Manual (5 vel.)',
        color: 'Branco',
        seats: '5',
        doors: '5',
        equipment: [
            'Rádio AM/FM com leitor de cassetes original',
            'Vidros Manuais de alta fiabilidade',
            'Inspeção Periódica Obrigatória válida',
            'Pneu suplente com kit de ferramentas completo',
            'Interiores originais em tecido muito bem conservados',
            'Ideal para primeiro carro ou deslocações diárias económicas',
            'Mecânica super simples e de baixíssima manutenção'
        ],
        gallery: { path: 'images/corsa/corsa-', count: 5, ext: '.jpg' }
    },
    'peugeot': {
        name: 'Peugeot 308',
        subtitle: '1.6 BlueHDi Style / Excelente Estado',
        price: '12.500',
        numericPrice: 12500,
        year: '2016',
        kms: '109.000',
        fuel: 'Gasóleo',
        engine: '1.560 cc',
        power: '120 cv',
        gearbox: 'Manual (6 vel.)',
        color: 'Preto Metalizado',
        seats: '5',
        doors: '5',
        equipment: [
            'Ecrã tátil multifunções de 9.7 polegadas',
            'Sistema de Navegação GPS 3D integrado',
            'Ar Condicionado Automático Bi-Zona',
            'Jantes de Liga Leve de 16 polegadas',
            'Sensores de Estacionamento Traseiros',
            'Luzes de Circulação Diurna em LED',
            'Cruise Control & Limitador de Velocidade',
            'Sensores de Luz e de Chuva Automáticos',
            'Retrovisores com Rebatimento Elétrico',
            'Volante desportivo compacto em pele multifunções'
        ],
        gallery: { path: 'images/peugeot/peugeot-308-', count: 6, ext: '.jpg' }
    },
    'polo': {
        name: 'Volkswagen Polo',
        subtitle: '1.2 Trendline / Ar Condicionado',
        price: '3.900',
        numericPrice: 3900,
        year: '2007',
        kms: '169.000',
        fuel: 'Gasolina',
        engine: '1.198 cc',
        power: '60 cv',
        gearbox: 'Manual (5 vel.)',
        color: 'Cinzento Metalizado',
        seats: '5',
        doors: '5',
        equipment: [
            'Ar Condicionado manual funcional',
            'Vidros Elétricos dianteiros',
            'Sensores de Estacionamento Traseiros instalados',
            'Direção Assistida progressiva',
            'Fecho Centralizado com comando à distância (2 chaves)',
            'Radio CD/MP3 com entrada auxiliar',
            'Excelente citadino extremamente fiável e seguro',
            'Baixo consumo de combustível e selo económico'
        ],
        gallery: { path: 'images/polo/polo-', count: 9, ext: '.jpg' }
    }
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
    if (!mainImg || !counter || !currentGallery) return;
    
    const car = vehicleDb[currentGallery];
    const fallbackSrc = `https://placehold.co/800x600/1a1a1a/f59e0b?text=Imagem+${currentIndex}`;
    const realSrc = `${car.gallery.path}${currentIndex}${car.gallery.ext}`;
    
    mainImg.src = realSrc;
    mainImg.onerror = function() {
        this.src = fallbackSrc;
    };
    
    counter.textContent = `${currentIndex} / ${car.gallery.count}`;

    // Update thumbnail highlights if containers exist
    document.querySelectorAll('.gallery-thumb-btn').forEach((btn, idx) => {
        if (idx === currentIndex - 1) {
            btn.classList.add('border-brand-accent', 'scale-105');
            btn.classList.remove('border-transparent', 'opacity-60');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            btn.classList.remove('border-brand-accent', 'scale-105');
            btn.classList.add('border-transparent', 'opacity-60');
        }
    });
}

window.openGallery = function(carId) {
    const car = vehicleDb[carId];
    if (!car || !modal) return;

    currentGallery = carId;
    currentIndex = 1; 

    // Populate details text if detail elements are present
    const titleEl = document.getElementById('modal-car-title');
    const subtitleEl = document.getElementById('modal-car-subtitle');
    const priceEl = document.getElementById('modal-car-price');
    const specsEl = document.getElementById('modal-car-specs');
    const equipmentEl = document.getElementById('modal-car-equipment');
    const waBtn = document.getElementById('modal-whatsapp-btn');

    if (titleEl) titleEl.textContent = car.name;
    if (subtitleEl) subtitleEl.textContent = car.subtitle;
    if (priceEl) priceEl.textContent = car.price + '€';

    if (specsEl) {
        specsEl.innerHTML = `
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="calendar" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Ano</div>
                    <div class="text-sm font-semibold text-white">${car.year}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="gauge" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Quilómetros</div>
                    <div class="text-sm font-semibold text-white">${car.kms} km</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="fuel" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Combustível</div>
                    <div class="text-sm font-semibold text-white">${car.fuel}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="milestone" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cilindrada</div>
                    <div class="text-sm font-semibold text-white">${car.engine}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="zap" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Potência</div>
                    <div class="text-sm font-semibold text-white">${car.power}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="cog" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Caixa</div>
                    <div class="text-sm font-semibold text-white">${car.gearbox}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="palette" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cor</div>
                    <div class="text-sm font-semibold text-white">${car.color}</div>
                </div>
            </div>
            <div class="flex items-center gap-2.5 bg-brand-light p-3 rounded-xl border border-gray-800">
                <i data-lucide="users" class="w-5 h-5 text-brand-accent shrink-0"></i>
                <div>
                    <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Lugares</div>
                    <div class="text-sm font-semibold text-white">${car.seats}</div>
                </div>
            </div>
        `;
    }

    if (equipmentEl) {
        equipmentEl.innerHTML = car.equipment.map(item => `
            <li class="flex items-start gap-2.5 text-sm text-gray-300">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-brand-accent shrink-0 mt-0.5"></i>
                <span>${item}</span>
            </li>
        `).join('');
    }

    if (waBtn) {
        const text = `Olá, tenho interesse no ${car.name} (${car.price}€) que vi no vosso site. Gostaria de agendar um teste drive ou saber mais detalhes.`;
        waBtn.href = `https://wa.me/351913230398?text=${encodeURIComponent(text)}`;
    }

    // Build thumbnails
    const thumbsContainer = document.getElementById('gallery-thumbnails-container');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        for (let i = 1; i <= car.gallery.count; i++) {
            const btn = document.createElement('button');
            btn.className = `gallery-thumb-btn w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all i-${i === 1 ? 'active' : 'inactive'}`;
            btn.innerHTML = `<img src="${car.gallery.path}${i}${car.gallery.ext}" alt="${car.name} - Imagem ${i}" class="w-full h-full object-cover">`;
            btn.onclick = () => {
                currentIndex = i;
                updateGalleryImage();
            };
            thumbsContainer.appendChild(btn);
        }
    }

    // Refresh Lucide Icons for dynamic content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

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
    const car = vehicleDb[currentGallery];
    currentIndex++;
    if (currentIndex > car.gallery.count) {
        currentIndex = 1;
    }
    updateGalleryImage();
}

function prevImage() {
    if (!currentGallery) return;
    const car = vehicleDb[currentGallery];
    currentIndex--;
    if (currentIndex < 1) {
        currentIndex = car.gallery.count;
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

// Hero Carousels (Mobile & Desktop)
const carTitles = [
    "BMW Série 1 Pack M",
    "Peugeot 308",
    "Volkswagen Polo",
    "Opel Corsa B 1.2"
];

// Mobile Hero Carousel
const mobileCarouselImages = document.querySelectorAll('.mobile-hero-carousel .carousel-img');
if (mobileCarouselImages.length > 0) {
    let currentImageIndex = 0;
    setInterval(() => {
        mobileCarouselImages[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % mobileCarouselImages.length;
        mobileCarouselImages[currentImageIndex].classList.add('active');
    }, 6000);
}

// Desktop Hero: single static BMW image (no carousel needed)

// Booking Form Handler
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> A processar...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            if (bookingSuccess) {
                bookingSuccess.classList.remove('hidden');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1200);
    });
}

window.resetBookingForm = function() {
    if (bookingForm) bookingForm.reset();
    if (bookingSuccess) bookingSuccess.classList.add('hidden');
};

window.submitBookingToWhatsApp = function() {
    if (!bookingForm) return;

    // Validate inputs manually
    const name = document.getElementById('book-name').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const service = document.getElementById('book-service').value;
    const vehicle = document.getElementById('book-vehicle').value.trim();
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;
    const notes = document.getElementById('book-notes').value.trim();

    if (!name || !phone || !service || !vehicle || !date || !time) {
        alert("Por favor, preencha todos os campos obrigatórios (*) antes de enviar para o WhatsApp.");
        return;
    }

    // Construct message
    let text = `Olá, gostaria de solicitar um agendamento de serviço na oficina:\n\n`;
    text += `👤 *Nome:* ${name}\n`;
    text += `📞 *Telemóvel:* ${phone}\n`;
    text += `🔧 *Serviço:* ${service}\n`;
    text += `🚗 *Viatura:* ${vehicle}\n`;
    text += `📅 *Data Preferencial:* ${date}\n`;
    text += `🕒 *Período:* ${time}\n`;
    if (notes) {
        text += `📝 *Notas:* ${notes}\n`;
    }

    const waUrl = `https://wa.me/351913230398?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
};

// Contact Form Submission Handler
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Dynamic loading & success transition simulation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> A enviar...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            if (formSuccess) {
                formSuccess.classList.remove('hidden');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1200);
    });
}

window.resetContactForm = function() {
    if (contactForm) contactForm.reset();
    if (formSuccess) formSuccess.classList.add('hidden');
};

// Mobile Folder Footer Tabs
window.switchFooterTab = function(tabId) {
    document.querySelectorAll('.mobile-folder-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mobile-folder-content').forEach(c => c.classList.remove('active'));
    
    // Select tab by matching the onclick attribute content
    const selectedTab = Array.from(document.querySelectorAll('.mobile-folder-tab')).find(tab => {
        const onclickAttr = tab.getAttribute('onclick') || '';
        return onclickAttr.includes(tabId);
    });
    
    const selectedContent = document.getElementById(tabId);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');
}

// FAQ Accordion Toggle Logic
window.toggleFaq = function(button) {
    const faqItem = button.closest('.faq-item');
    if (!faqItem) return;
    const content = faqItem.querySelector('.faq-content');
    const icon = faqItem.querySelector('.icon-chevron');

    const isActive = faqItem.classList.contains('active');

    // Close other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const itemContent = item.querySelector('.faq-content');
        if (itemContent) itemContent.style.maxHeight = '0px';
        const itemIcon = item.querySelector('.icon-chevron');
        if (itemIcon) itemIcon.style.transform = '';
    });

    if (!isActive) {
        faqItem.classList.add('active');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
};

// Sourcing Form Handler (Encomenda de Viatura)
const sourcingForm = document.getElementById('sourcing-form');
const sourcingSuccess = document.getElementById('sourcing-success');

if (sourcingForm) {
    sourcingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = sourcingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> A submeter...`;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            if (sourcingSuccess) {
                sourcingSuccess.classList.remove('hidden');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1200);
    });
}

window.resetSourcingForm = function() {
    if (sourcingForm) sourcingForm.reset();
    if (sourcingSuccess) sourcingSuccess.classList.add('hidden');
};

window.submitSourcingToWhatsApp = function() {
    if (!sourcingForm) return;

    const name = document.getElementById('source-name').value.trim();
    const phone = document.getElementById('source-phone').value.trim();
    const brand = document.getElementById('source-brand').value.trim();
    const budget = document.getElementById('source-budget').value.trim();
    const fuel = document.getElementById('source-fuel').value;
    const year = document.getElementById('source-year').value;
    const gearbox = document.getElementById('source-gearbox').value;
    const notes = document.getElementById('source-notes').value.trim();

    if (!name || !phone || !brand || !budget || !fuel || !year) {
        alert("Por favor, preencha todos os campos obrigatórios (*) antes de enviar para o WhatsApp.");
        return;
    }

    let text = `Olá, gostaria de solicitar uma encomenda de viatura personalizada:\n\n`;
    text += `👤 *Nome:* ${name}\n`;
    text += `📞 *Telemóvel:* ${phone}\n`;
    text += `🚗 *Viatura Pretendida:* ${brand}\n`;
    text += `💰 *Orçamento Máximo:* ${budget}\n`;
    text += `⛽ *Combustível:* ${fuel}\n`;
    text += `📅 *Ano Mínimo:* ${year}\n`;
    text += `⚙️ *Caixa de Velocidades:* ${gearbox}\n`;
    if (notes) {
        text += `📝 *Extras/Preferências:* ${notes}\n`;
    }

    const waUrl = `https://wa.me/351913230398?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
};
