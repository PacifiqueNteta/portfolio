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
    autoPlayInterval = setInterval(autoSlide, 3000);

    toolsPrev.addEventListener('click', () => {
        if (toolsCurrent > 0) { 
            toolsCurrent--; 
            updateToolsCarousel();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 3000);
        }
    });

    toolsNext.addEventListener('click', () => {
        if (toolsCurrent < toolsMax) { 
            toolsCurrent++; 
            updateToolsCarousel();
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(autoSlide, 3000);
        }
    });

    updateToolsCarousel();
}

(function () {
    const cv = document.getElementById('hero-bg');
    const cx = cv.getContext('2d');
    let W, H, DPR;
 
    function resize() {
        DPR = window.devicePixelRatio || 1;
        const el = cv.parentElement;
        W = cv.width  = el.offsetWidth  * DPR;
        H = cv.height = el.offsetHeight * DPR;
        cv.style.width  = el.offsetWidth  + 'px';
        cv.style.height = el.offsetHeight + 'px';
        rebuildLayout();
    }
 
    const vw = () => W / DPR;
    const vh = () => H / DPR;
 
    /* ── Grid ── */
    const GRID = 44;
 
    /* ── Falling data streams ── */
    const COL_COUNT = 14;
    let streamCols = [];
 
    const METRICS = [
        () => (Math.random() * 100).toFixed(1) + '%',
        () => (Math.random() * 50 | 0) + 'ms',
        () => (Math.random() * 9999 | 0).toLocaleString(),
        () => 'p' + [50, 75, 90, 95, 99][Math.random() * 5 | 0],
        () => (Math.random() * 9.9 + 0.1).toFixed(2) + 'k',
        () => ['200', '201', '204', '304', '4xx'][Math.random() * 5 | 0],
        () => ['ETL', 'SQL', 'API', 'CDC', 'MQ', 'RPC'][Math.random() * 6 | 0],
        () => (Math.random() * 1.5 + 0.1).toFixed(3),
        () => (Math.random() * 3 + 0.1).toFixed(1) + 'M',
        () => ['OK', 'WARN', 'INFO', 'PASS'][Math.random() * 4 | 0],
    ];
 
    function randMetric() {
        return METRICS[Math.random() * METRICS.length | 0]();
    }
 
    /* ── Sparklines ── */
    const SPARKS = [
        { yFrac: 0.22, color: '#378ADD', speed: 1.2, amp: 24, freq: 0.018, phase: 0.0 },
        { yFrac: 0.50, color: '#2dd4bf', speed: 0.9, amp: 17, freq: 0.022, phase: 1.5 },
        { yFrac: 0.75, color: '#818cf8', speed: 1.4, amp: 20, freq: 0.014, phase: 3.1 },
    ];
    let sparkOffset = 0;
 
    /* ── Pipelines ── */
    const PIPE_FRACS = [0.14, 0.38, 0.62, 0.86];
    let pipes = [];
 
    function rebuildLayout() {
        streamCols = Array.from({ length: COL_COUNT }, (_, i) => ({
            x: (i / COL_COUNT) * vw() * 1.05 + (Math.random() - 0.5) * 16,
            items: Array.from({ length: 20 }, () => ({
                y: Math.random() * -900,
                speed: 0.28 + Math.random() * 0.45,
                val: randMetric(),
                alpha: 0.18 + Math.random() * 0.45,
            })),
        }));
 
        pipes = PIPE_FRACS.map((frac, pi) => ({
            y: frac,
            packets: Array.from({ length: 5 }, () => ({
                x: Math.random() * vw(),
                speed: 0.7 + Math.random() * 1.5,
                size: 2.2 + Math.random() * 2.8,
                color: pi % 2 === 0 ? '#378ADD' : '#2dd4bf',
            })),
        }));
    }
 
    /* ── Draw passes ── */
    function drawGrid() {
        cx.strokeStyle = 'rgba(30,58,138,0.5)';
        cx.lineWidth = 0.5 * DPR;
        for (let x = 0; x < vw() + GRID; x += GRID) {
            cx.beginPath(); cx.moveTo(x * DPR, 0); cx.lineTo(x * DPR, H); cx.stroke();
        }
        for (let y = 0; y < vh() + GRID; y += GRID) {
            cx.beginPath(); cx.moveTo(0, y * DPR); cx.lineTo(W, y * DPR); cx.stroke();
        }
    }
 
    function drawStreams() {
        cx.font = `${11 * DPR}px monospace`;
        streamCols.forEach(col => {
            col.items.forEach(item => {
                item.y += item.speed;
                if (item.y > vh() + 24) { item.y = -24 - Math.random() * 300; item.val = randMetric(); }
                const fade = Math.min(1, Math.min(item.y / 70, (vh() - item.y) / 70));
                cx.fillStyle = `rgba(56,132,210,${item.alpha * Math.max(0, fade)})`;
                cx.fillText(item.val, col.x * DPR, item.y * DPR);
            });
        });
    }
 
    function drawSparklines(t) {
        sparkOffset += 0.55;
        SPARKS.forEach(s => {
            const baseY = vh() * s.yFrac;
            cx.beginPath();
            let first = true;
            for (let x = -4; x < vw() + 4; x += 4) {
                const noise = Math.sin((x + sparkOffset * s.speed) * s.freq + s.phase) * s.amp
                            + Math.sin((x + sparkOffset * s.speed) * s.freq * 2.4 + s.phase) * (s.amp * 0.32)
                            + Math.sin(x * 0.006 + t * 0.00025) * (s.amp * 0.45);
                const py = baseY + noise;
                first ? cx.moveTo(x * DPR, py * DPR) : cx.lineTo(x * DPR, py * DPR);
                first = false;
            }
            cx.strokeStyle = s.color + '66';
            cx.lineWidth = 1.5 * DPR;
            cx.lineJoin = 'round';
            cx.stroke();
 
            /* leading dot */
            const dotX = vw() - 8;
            const dotNoise = Math.sin((dotX + sparkOffset * s.speed) * s.freq + s.phase) * s.amp
                           + Math.sin((dotX + sparkOffset * s.speed) * s.freq * 2.4 + s.phase) * (s.amp * 0.32)
                           + Math.sin(dotX * 0.006 + t * 0.00025) * (s.amp * 0.45);
            const dotY = (baseY + dotNoise) * DPR;
            cx.beginPath();
            cx.arc(dotX * DPR, dotY, 3.5 * DPR, 0, Math.PI * 2);
            cx.fillStyle = s.color;
            cx.fill();
        });
    }
 
    function drawPipelines(t) {
        pipes.forEach(pipe => {
            const y = vh() * pipe.y * DPR;
            cx.beginPath();
            cx.moveTo(0, y); cx.lineTo(W, y);
            cx.strokeStyle = 'rgba(30,58,138,0.75)';
            cx.lineWidth = 1 * DPR;
            cx.stroke();
 
            pipe.packets.forEach(pk => {
                pk.x += pk.speed;
                if (pk.x > vw() + 12) pk.x = -12;
                const pulse = (Math.sin(t * 0.003 + pk.x * 0.05) + 1) * 0.5;
                cx.beginPath();
                cx.arc(pk.x * DPR, y, pk.size * DPR, 0, Math.PI * 2);
                cx.fillStyle = pk.color + Math.round((0.45 + pulse * 0.55) * 255).toString(16).padStart(2, '0');
                cx.fill();
                cx.beginPath();
                cx.arc(pk.x * DPR, y, (pk.size + 4) * DPR, 0, Math.PI * 2);
                cx.strokeStyle = pk.color + Math.round((0.1 + pulse * 0.18) * 255).toString(16).padStart(2, '0');
                cx.lineWidth = 1 * DPR;
                cx.stroke();
            });
        });
    }
 
    function frame(t) {
        cx.clearRect(0, 0, W, H);
        cx.fillStyle = '#0f172a';
        cx.fillRect(0, 0, W, H);
        drawGrid();
        drawPipelines(t);
        drawStreams();
        drawSparklines(t);
        requestAnimationFrame(frame);
    }
 
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
})();