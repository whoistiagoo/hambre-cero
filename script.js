// Variables del carrusel
let currentIndex = 0;
let autoPlayInterval;
let isAutoPlaying = true;
const totalSlides = 6;

// Elementos DOM
const slides = document.getElementById('slides');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const indicadores = document.getElementById('indicadores');
const btnAutoPlay = document.getElementById('btnAutoPlay');
const contador = document.getElementById('contador');

// Crear indicadores
function crearIndicadores() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = i;
        dot.addEventListener('click', () => irASlide(i));
        indicadores.appendChild(dot);
    }
}

function actualizarIndicadores() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function actualizarContador() {
    contador.textContent = `${currentIndex + 1} / ${totalSlides}`;
}

function irASlide(index) {
    if (index < 0) {
        currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }
    
    const desplazamiento = -currentIndex * 100;
    slides.style.transform = `translateX(${desplazamiento}%)`;
    
    actualizarIndicadores();
    actualizarContador();
}

function siguienteSlide() {
    irASlide(currentIndex + 1);
}

function anteriorSlide() {
    irASlide(currentIndex - 1);
}

function iniciarAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(siguienteSlide, 3500);
    isAutoPlaying = true;
    btnAutoPlay.textContent = '⏸ Pausar';
}

function detenerAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    isAutoPlaying = false;
    btnAutoPlay.textContent = '▶ Iniciar';
}

function toggleAutoPlay() {
    if (isAutoPlaying) {
        detenerAutoPlay();
    } else {
        iniciarAutoPlay();
    }
}

// Eventos
btnPrev.addEventListener('click', () => {
    detenerAutoPlay();
    anteriorSlide();
    if (isAutoPlaying) iniciarAutoPlay();
});

btnNext.addEventListener('click', () => {
    detenerAutoPlay();
    siguienteSlide();
    if (isAutoPlaying) iniciarAutoPlay();
});

btnAutoPlay.addEventListener('click', toggleAutoPlay);

// Navegación por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        detenerAutoPlay();
        anteriorSlide();
        if (isAutoPlaying) iniciarAutoPlay();
    } else if (e.key === 'ArrowRight') {
        detenerAutoPlay();
        siguienteSlide();
        if (isAutoPlaying) iniciarAutoPlay();
    }
});

// Pausar al pasar mouse
const carrusel = document.querySelector('.carrusel');
if (carrusel) {
    carrusel.addEventListener('mouseenter', () => {
        if (isAutoPlaying) detenerAutoPlay();
    });
    carrusel.addEventListener('mouseleave', () => {
        if (!isAutoPlaying && autoPlayInterval === null) {
            iniciarAutoPlay();
        }
    });
}

// Navegación suave entre secciones
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Actualizar clase activa
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Detectar scroll para actualizar navegación activa
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Inicializar
function init() {
    crearIndicadores();
    irASlide(0);
    iniciarAutoPlay();
}

document.addEventListener('DOMContentLoaded', init);