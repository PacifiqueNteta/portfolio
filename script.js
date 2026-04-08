 // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["A Data Engineer","A Data Analyst", "An Industrial Engineer"],
        typeSpeed: 90,
        backSpeed: 60,
        loop: true
    });


 // Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = mobileMenuBtn.querySelector('i');

   mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                if (mobileMenu.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });


// Animate skill bars on scroll
document.addEventListener('DOMContentLoaded', function() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Tools carousel
// Tools carousel
const toolsTrack = document.getElementById('tools-track');
const toolsPrev  = document.getElementById('tools-prev');
const toolsNext  = document.getElementById('tools-next');

if (toolsTrack) {
    const toolsVisible = window.innerWidth <= 640 ? 2 : 4;
    const toolsTotal   = toolsTrack.children.length;
    const toolsMax     = toolsTotal - toolsVisible;
    let toolsCurrent   = 0;
    let autoPlayInterval;

    function updateToolsCarousel() {
        const pct = (100 / toolsVisible) * toolsCurrent;
        toolsTrack.style.transform = `translateX(-${pct}%)`;
        toolsPrev.disabled = toolsCurrent === 0;
        toolsNext.disabled = toolsCurrent >= toolsMax;
    }

    function autoSlide() {
        if (toolsCurrent < toolsMax) {
            toolsCurrent++;
        } else {
            toolsCurrent = 0; // Loop back to start
        }
        updateToolsCarousel();
    }

    // Start auto-play (1500ms = every 1.5 seconds)
    autoPlayInterval = setInterval(autoSlide, 2000);

    toolsPrev.addEventListener('click', () => {
        if (toolsCurrent > 0) { 
            toolsCurrent--; 
            updateToolsCarousel();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 2000);
        }
    });

    toolsNext.addEventListener('click', () => {
        if (toolsCurrent < toolsMax) { 
            toolsCurrent++; 
            updateToolsCarousel();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 2000);
        }
    });

    updateToolsCarousel();
}
