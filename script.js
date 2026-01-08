// ==========================================
// SCROLL ANIMATION FOR HEADER
// ==========================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// ==========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ==========================================
// CARD HOVER EFFECTS
// ==========================================
const cards = document.querySelectorAll('.about-card, .facility-card, .achievement-card, .teacher-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==========================================
// OPTIONAL: ACTIVE NAVIGATION HIGHLIGHT
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function highlightNavigation() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==========================================
// GALLERY ITEMS INTERACTION (OPTIONAL)
// ==========================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        // Optional: Add lightbox functionality here
        console.log('Gallery item clicked:', this.querySelector('h3')?.textContent);
    });
});

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// SCROLL TO TOP BUTTON (OPTIONAL)
// ==========================================
// Uncomment this section if you want to add a scroll-to-top button

/*
// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--accent);
    color: var(--text-dark);
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
*/

/* ==========================================
   INSTRUKSI:
   Copy SEMUA JavaScript di bawah ini dan paste ke
   BAGIAN PALING BAWAH file script.js Anda
   ========================================== */


// ==========================================
// COUNTER ANIMATION - ANIMASI ANGKA NAIK
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Kecepatan animasi (semakin kecil semakin cepat)

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        
        const updateCount = () => {
            const increment = target / speed;
            
            if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCount();
    });
}

// Trigger counter animation ketika section terlihat
const statsSection = document.querySelector('.statistics');
let counterAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    });
}, {
    threshold: 0.5
});

if (statsSection) {
    statsObserver.observe(statsSection);
}


// ==========================================
// TESTIMONIAL CAROUSEL - SLIDER OTOMATIS
// ==========================================
class TestimonialCarousel {
    constructor() {
        this.track = document.querySelector('.testimonial-track');
        this.slides = Array.from(document.querySelectorAll('.testimonial-card'));
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.indicators = Array.from(document.querySelectorAll('.indicator'));
        
        this.currentIndex = 0;
        this.slideWidth = this.slides[0]?.offsetWidth || 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (!this.track || this.slides.length === 0) return;
        
        // Event listeners untuk tombol navigasi
        this.prevBtn?.addEventListener('click', () => this.goToPrev());
        this.nextBtn?.addEventListener('click', () => this.goToNext());
        
        // Event listeners untuk indicator dots
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto play setiap 5 detik
        this.startAutoPlay();
        
        // Pause auto play saat hover
        const carouselElement = document.querySelector('.testimonial-carousel');
        carouselElement?.addEventListener('mouseenter', () => this.stopAutoPlay());
        carouselElement?.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Update slideWidth saat window resize
        window.addEventListener('resize', () => {
            this.slideWidth = this.slides[0]?.offsetWidth || 0;
            this.updateCarousel();
        });
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    goToNext() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    goToPrev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Update posisi track
        const offset = -this.currentIndex * (this.slideWidth + 32); // 32px = margin
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update indicator aktif
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.goToNext();
        }, 5000); // Ganti slide setiap 5 detik
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize carousel setelah DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialCarousel();
});


// ==========================================
// TOUCH/SWIPE SUPPORT untuk Mobile
// ==========================================
class TouchCarousel {
    constructor(carousel) {
        this.carousel = carousel;
        this.track = carousel.querySelector('.testimonial-track');
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        if (!this.track) return;
        
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.track.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Mouse events (untuk desktop)
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseUp());
        this.track.addEventListener('mouseleave', () => this.handleMouseUp());
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
    }
    
    handleTouchEnd() {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        
        // Swipe threshold: 50px
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next
                document.querySelector('.next-btn')?.click();
            } else {
                // Swipe right - prev
                document.querySelector('.prev-btn')?.click();
            }
        }
        
        this.isDragging = false;
    }
    
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }
    
    handleMouseUp() {
        if (!this.isDragging) return;
        
        const diff = this.startX - this.currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                document.querySelector('.next-btn')?.click();
            } else {
                document.querySelector('.prev-btn')?.click();
            }
        }
        
        this.isDragging = false;
        this.track.style.cursor = 'grab';
    }
}

// Initialize touch carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        new TouchCarousel(carousel);
        
        // Set cursor style
        const track = carousel.querySelector('.testimonial-track');
        if (track) {
            track.style.cursor = 'grab';
        }
    }
});


// ==========================================
// KEYBOARD NAVIGATION untuk Accessibility
// ==========================================
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    // Arrow keys untuk navigasi
    if (e.key === 'ArrowLeft') {
        document.querySelector('.prev-btn')?.click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.next-btn')?.click();
    }
});


// ==========================================
// CATATAN PENGGUNAAN:
// 
// 1. Counter akan otomatis animasi saat section terlihat
// 2. Carousel auto-play setiap 5 detik
// 3. Hover pada carousel akan pause auto-play
// 4. Support swipe di mobile
// 5. Support keyboard navigation (arrow keys)
// 6. Responsive dan smooth animation
//
// CUSTOMISASI:
// - Ubah speed counter di variable 'speed' (line 10)
// - Ubah interval auto-play di 'startAutoPlay()' (line 89)
// - Ubah swipe threshold di 'handleTouchEnd()' (line 127)
// ==========================================

/* ==========================================
   INSTRUKSI:
   Copy SEMUA JavaScript di bawah ini dan paste ke
   BAGIAN PALING BAWAH file script.js Anda
   (setelah JavaScript Counter & Testimonial sebelumnya)
   ========================================== */


// ==========================================
// WHATSAPP FLOATING BUTTON
// ==========================================
class WhatsAppButton {
    constructor() {
        this.button = document.querySelector('.whatsapp-float');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Show/hide button on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Show button after scrolling 300px
            if (currentScroll > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
            
            lastScroll = currentScroll;
        });
        
        // Initial hide
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
        this.button.style.transition = 'all 0.3s ease';
    }
}

// Initialize WhatsApp Button
document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppButton();
});


// ==========================================
// GALLERY FILTER SYSTEM
// ==========================================
class GalleryFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }
    
    init() {
        if (this.filterButtons.length === 0) return;
        
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter gallery items
                this.filterGallery(filter);
            });
        });
    }
    
    filterGallery(filter) {
        this.galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            // Add animation delay
            setTimeout(() => {
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hide');
                }
            }, index * 50);
        });
    }
}

// Initialize Gallery Filter
document.addEventListener('DOMContentLoaded', () => {
    new GalleryFilter();
});


// ==========================================
// GALLERY LIGHTBOX
// ==========================================
class GalleryLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = this.lightbox?.querySelector('.lightbox-image');
        this.lightboxTitle = this.lightbox?.querySelector('.lightbox-title');
        this.lightboxDescription = this.lightbox?.querySelector('.lightbox-description');
        this.lightboxCurrent = this.lightbox?.querySelector('.lightbox-current');
        this.lightboxTotal = this.lightbox?.querySelector('.lightbox-total');
        
        this.closeBtn = this.lightbox?.querySelector('.lightbox-close');
        this.prevBtn = this.lightbox?.querySelector('.lightbox-prev');
        this.nextBtn = this.lightbox?.querySelector('.lightbox-next');
        
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        this.currentIndex = 0;
        
        // Gallery data - CUSTOMIZE INI sesuai kebutuhan
        this.galleryData = [
            {
                title: 'Kegiatan Belajar Mengajar',
                description: 'Suasana pembelajaran interaktif di ruang kelas dengan metode diskusi kelompok dan presentasi.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%231e3a8a" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="white" font-size="80" font-family="Arial"%3E📖%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EKegiatan Belajar Mengajar%3C/text%3E%3C/svg%3E'
            },
            {
                title: 'Praktikum Laboratorium',
                description: 'Siswa melakukan eksperimen sains di laboratorium Fisika dengan peralatan modern dan bimbingan guru.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%2306b6d4" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="white" font-size="80" font-family="Arial"%3E🔬%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EPraktikum Laboratorium%3C/text%3E%3C/svg%3E'
            },
            {
                title: 'Penerimaan Penghargaan',
                description: 'Momen bangga saat siswa menerima medali emas Olimpiade Sains Nasional 2024 di Jakarta.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23fbbf24" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="%231f2937" font-size="80" font-family="Arial"%3E🏆%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="%231f2937" font-size="24" font-family="Arial"%3EPenerimaan Penghargaan%3C/text%3E%3C/svg%3E'
            },
            {
                title: 'Festival Seni Budaya',
                description: 'Penampilan spektakuler tari tradisional Jawa dalam acara Festival Seni Budaya tahunan sekolah.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%231e3a8a" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="white" font-size="80" font-family="Arial"%3E🎭%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EFestival Seni Budaya%3C/text%3E%3C/svg%3E'
            },
            {
                title: 'Kegiatan Olahraga',
                description: 'Kompetisi futsal antar kelas yang seru dan latihan atletik untuk persiapan kejuaraan regional.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%2306b6d4" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="white" font-size="80" font-family="Arial"%3E⚽%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="white" font-size="24" font-family="Arial"%3EKegiatan Olahraga%3C/text%3E%3C/svg%3E'
            },
            {
                title: 'Wisuda Kelulusan',
                description: 'Perayaan keberhasilan dan kebahagiaan lulusan angkatan 2024 bersama keluarga dan guru.',
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23fbbf24" width="800" height="600"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="%231f2937" font-size="80" font-family="Arial"%3E🎓%3C/text%3E%3Ctext x="400" y="380" text-anchor="middle" fill="%231f2937" font-size="24" font-family="Arial"%3EWisuda Kelulusan%3C/text%3E%3C/svg%3E'
            }
        ];
        
        this.init();
    }
    
    init() {
        if (!this.lightbox) return;
        
        // Set total images
        if (this.lightboxTotal) {
            this.lightboxTotal.textContent = this.galleryData.length;
        }
        
        // Click event pada gallery items
        this.galleryItems.forEach((item) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(item.getAttribute('data-index'));
                    this.openLightbox(index);
                });
            }
            
            // Also open on item click
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                this.openLightbox(index);
            });
        });
        
        // Close button
        this.closeBtn?.addEventListener('click', () => this.closeLightbox());
        
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevImage());
        this.nextBtn?.addEventListener('click', () => this.nextImage());
        
        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
        
        // Touch/Swipe support
        this.addSwipeSupport();
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    }
    
    updateLightboxContent() {
        const data = this.galleryData[this.currentIndex];
        
        if (this.lightboxImage) {
            this.lightboxImage.src = data.image;
            this.lightboxImage.alt = data.title;
        }
        
        if (this.lightboxTitle) {
            this.lightboxTitle.textContent = data.title;
        }
        
        if (this.lightboxDescription) {
            this.lightboxDescription.textContent = data.description;
        }
        
        if (this.lightboxCurrent) {
            this.lightboxCurrent.textContent = this.currentIndex + 1;
        }
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
        this.updateLightboxContent();
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryData.length) % this.galleryData.length;
        this.updateLightboxContent();
    }
    
    addSwipeSupport() {
        let startX = 0;
        let endX = 0;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.lightbox.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        
        this.lightbox.addEventListener('touchend', () => {
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextImage(); // Swipe left
                } else {
                    this.prevImage(); // Swipe right
                }
            }
        });
    }
}

// Initialize Gallery Lightbox
document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
});


// ==========================================
// PRELOAD IMAGES (Optional - untuk performa)
// ==========================================
function preloadLightboxImages() {
    const lightbox = new GalleryLightbox();
    
    // Preload beberapa gambar pertama
    lightbox.galleryData.slice(0, 3).forEach(data => {
        const img = new Image();
        img.src = data.image;
    });
}

// Preload after page load
window.addEventListener('load', () => {
    setTimeout(preloadLightboxImages, 2000);
});


// ==========================================
// CATATAN PENGGUNAAN:
//
// WHATSAPP BUTTON:
// - Otomatis muncul setelah scroll 300px
// - Smooth bounce animation
// - Tooltip muncul saat hover (desktop)
//
// GALLERY FILTER:
// - Click button untuk filter kategori
// - Animated transition saat filter
// - 'all' menampilkan semua galeri
//
// GALLERY LIGHTBOX:
// - Click gallery item atau button "Lihat Detail"
// - Navigation: Arrow buttons, keyboard (← →), atau swipe (mobile)
// - Close: X button, Esc key, atau click background
// - Counter menunjukkan posisi gambar (1/6)
//
// CUSTOMISASI:
// 1. Ganti nomor WhatsApp di HTML (line 12)
// 2. Update galleryData dengan gambar real (line 110-151)
// 3. Tambah/kurangi gallery items di HTML
// 4. Sesuaikan filter categories
//
// TIPS:
// - Gunakan gambar berukuran maksimal 1920x1080px
// - Format: JPG/PNG untuk foto, SVG untuk ilustrasi
// - Compress gambar untuk loading cepat
// ==========================================

/* ==========================================
   INSTRUKSI:
   Copy SEMUA JavaScript di bawah ini dan paste ke
   BAGIAN PALING BAWAH file script.js Anda
   ========================================== */




// ==========================================
// SOCIAL MEDIA TABS
// ==========================================
class SocialMediaTabs {
    constructor() {
        this.tabs = document.querySelectorAll('.social-tab');
        this.feeds = document.querySelectorAll('.social-feed');
        this.init();
    }
    
    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const socialPlatform = tab.getAttribute('data-social');
                this.switchFeed(socialPlatform);
            });
        });
    }
    
    switchFeed(platform) {
        // Update tabs
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-social') === platform) {
                tab.classList.add('active');
            }
        });
        
        // Update feeds
        this.feeds.forEach(feed => {
            feed.classList.remove('active');
            if (feed.id === `${platform}-feed`) {
                feed.classList.add('active');
            }
        });
    }
}


// ==========================================
// VIDEO PROFILE PLAYER
// Paste ini di BAGIAN PALING BAWAH file script.js Anda
// (setelah semua JavaScript yang sudah ada)
// ==========================================

function playVideo() {
    const player = document.getElementById('videoPlayer');
    const overlay = document.querySelector('.video-overlay');
    const thumbnail = document.querySelector('.video-thumbnail');
    
    if (player && overlay) {
        player.classList.add('active');
        overlay.style.display = 'none';
        
        // Optional: hide thumbnail juga
        if (thumbnail) {
            thumbnail.style.opacity = '0';
        }
    }
}

// Alternative: Class-based approach (lebih terstruktur)
class VideoProfilePlayer {
    constructor() {
        this.wrapper = document.querySelector('.video-wrapper');
        this.playBtn = document.querySelector('.video-play-btn');
        this.thumbnail = document.querySelector('.video-thumbnail');
        this.overlay = document.querySelector('.video-overlay');
        this.player = document.getElementById('videoPlayer');
        this.iframe = this.player?.querySelector('iframe');
        
        this.init();
    }
    
    init() {
        if (!this.playBtn) return;
        
        this.playBtn.addEventListener('click', () => this.play());
        
        // Optional: Click anywhere on video wrapper to play
        this.wrapper?.addEventListener('click', (e) => {
            if (e.target === this.wrapper || e.target === this.thumbnail) {
                this.play();
            }
        });
    }
    
    play() {
        // Hide overlay dan thumbnail
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
        if (this.thumbnail) {
            this.thumbnail.style.opacity = '0';
        }
        
        // Show player
        if (this.player) {
            this.player.classList.add('active');
        }
        
        // Auto-play video (jika belum dimulai)
        if (this.iframe && !this.iframe.src.includes('autoplay=1')) {
            const currentSrc = this.iframe.src;
            this.iframe.src = currentSrc.includes('?') 
                ? currentSrc + '&autoplay=1' 
                : currentSrc + '?autoplay=1';
        }
    }
    
    // Optional: Method untuk pause
    pause() {
        if (this.iframe) {
            // Send postMessage to iframe to pause
            this.iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    }
    
    // Optional: Method untuk reset
    reset() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
        }
        if (this.thumbnail) {
            this.thumbnail.style.opacity = '1';
        }
        if (this.player) {
            this.player.classList.remove('active');
        }
    }
}

// Initialize saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Gunakan salah satu approach:
    
    // Approach 1: Simple function (sudah digunakan di HTML onclick)
    // Tidak perlu initialize apa-apa, cukup function playVideo() di atas
    
    // Approach 2: Class-based (lebih advanced)
    // Uncomment baris di bawah jika ingin pakai class
    // const videoPlayer = new VideoProfilePlayer();
});


// ==========================================
// BONUS: Video Analytics Tracking (Optional)
// ==========================================
function trackVideoPlay() {
    // Track ke Google Analytics atau service analytics lainnya
    console.log('Video Profile dimainkan');
    
    // Contoh Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
            'event_category': 'Video',
            'event_label': 'Profile SD NO.1 PUNGGUL',
            'video_url': 'https://youtu.be/fP1ufnVzec4'
        });
    }
}

// Tambahkan tracking saat video play
const originalPlayVideo = playVideo;
playVideo = function() {
    originalPlayVideo();
    trackVideoPlay();
};





// ==========================================
// FLOATING BUTTON ANIMATION
// ==========================================
function initFloatingButtons() {
    const inquiryBtn = document.querySelector('.inquiry-float');
    const whatsappBtn = document.querySelector('.whatsapp-float');
    
    // Show buttons after scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        if (scrollY > 300) {
            if (inquiryBtn) {
                inquiryBtn.style.opacity = '1';
                inquiryBtn.style.visibility = 'visible';
            }
            if (whatsappBtn) {
                whatsappBtn.style.opacity = '1';
                whatsappBtn.style.visibility = 'visible';
            }
        } else {
            if (inquiryBtn) {
                inquiryBtn.style.opacity = '0';
                inquiryBtn.style.visibility = 'hidden';
            }
            if (whatsappBtn) {
                whatsappBtn.style.opacity = '0';
                whatsappBtn.style.visibility = 'hidden';
            }
        }
    });
    
    // Initial hide
    if (inquiryBtn) {
        inquiryBtn.style.transition = 'all 0.3s ease';
        inquiryBtn.style.opacity = '0';
        inquiryBtn.style.visibility = 'hidden';
    }
}





// ==========================================
// INITIALIZE ALL COMPONENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Paket A Components
    new InquiryModal();
    new VideoPlayer();
    new FAQAccordion();
    new FAQSearch();
    
    // Additional features
    initFloatingButtons();
    initFormValidation();
});


// ==========================================
// ANALYTICS TRACKING (OPTIONAL)
// ==========================================
function trackEvent(eventName, data) {
    // CUSTOMIZE: Integrate with Google Analytics, Facebook Pixel, etc.
    console.log('Event:', eventName, data);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, data);
    // }
}

// Track form submission
document.getElementById('inquiryForm')?.addEventListener('submit', () => {
    trackEvent('form_submission', {
        form_type: 'inquiry',
        form_location: 'modal'
    });
});

// Track video play
document.getElementById('videoPlayBtn')?.addEventListener('click', () => {
    trackEvent('video_play', {
        video_type: 'profile',
        video_location: 'homepage'
    });
});


// ==========================================
// CATATAN PENGGUNAAN:
//
// FORM PENDAFTARAN:
// - Modal otomatis terbuka saat klik floating button
// - Form validation real-time
// - Success/error messages
// - Auto-close setelah 5 detik
// - WhatsApp notification optional
//
// VIDEO PROFILE:
// - YouTube embed lazy loading
// - Autoplay saat play button diklik
// - Responsive video player
// - Stats display
//
// FAQ:
// - Accordion expand/collapse
// - Category filter (5 categories)
// - Search functionality
// - Smooth animations
// - Auto-scroll to opened item
//
// CUSTOMISASI PENTING:
// 1. Ganti VIDEO_ID di HTML dengan YouTube video ID Anda
// 2. Ganti nomor WhatsApp di sendWhatsAppNotification()
// 3. Setup backend API untuk menyimpan data form
// 4. Integrate dengan email service (optional)
// 5. Add Google Analytics tracking (optional)
//
// ==========================================

/* ==========================================
   INSTRUKSI:
   Copy SEMUA JavaScript di bawah ini dan paste ke
   BAGIAN PALING BAWAH file script.js Anda
   ========================================== */
   
document.addEventListener('DOMContentLoaded', () => {
    // Animate admin cards on scroll
    const adminCards = document.querySelectorAll('.admin-card');
    
    const adminObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Staggered animation
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Set initial state and observe
    adminCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        adminObserver.observe(card);
    });
    
    // Add hover interaction
    adminCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Optional: Click to show more info (alert example)
document.querySelectorAll('.admin-card').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.querySelector('h3').textContent;
        const position = this.querySelector('.admin-position').textContent;
        const description = this.querySelector('.admin-description').textContent;
        
        // Customize this to show modal or expand card
        console.log(`${name} - ${position}: ${description}`);
        
        // Example: Add active class
        document.querySelectorAll('.admin-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mapIframe = document.getElementById('googleMap');
    const mapLoading = document.getElementById('mapLoading');
    
    // Hide loading when iframe loaded
    if (mapIframe && mapLoading) {
        mapIframe.addEventListener('load', () => {
            setTimeout(() => {
                mapLoading.classList.add('hidden');
            }, 500); // Delay 500ms untuk smooth transition
        });
        
        // Fallback: hide loading after 3 seconds
        setTimeout(() => {
            if (mapLoading) {
                mapLoading.classList.add('hidden');
            }
        }, 3000);
    }
    
    // Optional: Track map interaction
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('click', () => {
            console.log('User interacted with map');
            // Add analytics tracking here if needed
        });
    }
});

// Optional: Lazy load map (untuk performa lebih baik)
function lazyLoadMap() {
    const mapSection = document.getElementById('contact');
    
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                }
                mapObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    if (mapSection) {
        mapObserver.observe(mapSection);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Track social media clicks
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const platform = this.classList.contains('instagram') ? 'Instagram' :
                           this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('youtube') ? 'YouTube' :
                           this.classList.contains('twitter') ? 'Twitter' : 'Unknown';
            
            console.log(`User clicked: ${platform}`);
            
            // Optional: Send to Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'platform': platform,
                    'location': 'footer'
                });
            }
        });
    });
    
    // Add ripple effect on click
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.background = 'rgba(255,255,255,0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);