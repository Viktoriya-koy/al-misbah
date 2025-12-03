// main.js - Funcionalidades principales de Al-Misbah

// ===== CONTADOR DE TASBIH =====
class ContadorTasbih {
    constructor() {
        this.contador = 0;
        this.totalPerlas = 33;
        this.init();
    }
    
    init() {
        this.inicializarPerlas();
        this.setupEventListeners();
    }
    
    inicializarPerlas() {
        const perlasGrid = document.getElementById('perlasGrid');
        if(!perlasGrid) return;
        
        perlasGrid.innerHTML = '';
        for(let i = 1; i <= this.totalPerlas; i++) {
            const perla = document.createElement('div');
            perla.className = 'perla';
            perla.textContent = i;
            perlasGrid.appendChild(perla);
        }
        this.actualizarPerlas();
    }
    
    actualizarPerlas() {
        const perlas = document.querySelectorAll('.perla');
        const counter = document.getElementById('counter');
        
        if(counter) counter.textContent = this.contador;
        
        perlas.forEach((perla, index) => {
            if(index < this.contador) {
                perla.classList.add('activa');
            } else {
                perla.classList.remove('activa');
            }
        });
    }
    
    setupEventListeners() {
        const addBtn = document.getElementById('addOne');
        const resetBtn = document.getElementById('resetCounter');
        
        if(addBtn) {
            addBtn.addEventListener('click', () => {
                this.contador++;
                if(this.contador > this.totalPerlas) this.contador = 1;
                this.actualizarPerlas();
            });
        }
        
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.contador = 0;
                this.actualizarPerlas();
            });
        }
    }
}

// ===== VERSO DEL DÍA =====
class VersoDelDia {
    constructor() {
        this.versos = [
            {
                arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌۖ أُجِيبُ دَعۡوَةَ ٱلدَّاعِ إِذَا دَعَانِۖ",
                traduccion: "Y cuando Mis siervos te pregunten por Mí, (diles que) ciertamente estoy cerca. Respondo la súplica de quien Me invoca cuando Me invoca.",
                referencia: "Corán 2:186",
                tema: "Cercanía de Dios",
                reflexion: "Dios está más cerca de nosotros que nuestra vena yugular. Nunca estamos solos en nuestras súplicas."
            },
            {
                arabic: "إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرٗا",
                traduccion: "Ciertamente, con la dificultad viene la facilidad.",
                referencia: "Corán 94:6",
                tema: "Esperanza",
                reflexion: "Después de cada dificultad, Dios promete alivio. Esta es una ley divina que nos da esperanza en los momentos más oscuros."
            },
            {
                arabic: "وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهۡدِيَنَّهُمۡ سُبُلَنَاۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلۡمُحۡسِنِينَ",
                traduccion: "Y a quienes se esfuerzan por Nuestra causa, ciertamente les guiaremos por Nuestros caminos. En verdad, Alá está con los que hacen el bien.",
                referencia: "Corán 29:69",
                tema: "Esfuerzo y Guía",
                reflexion: "El esfuerzo sincero (jihad an-nafs) es la llave que abre las puertas de la guía divina."
            }
        ];
        
        this.init();
    }
    
    init() {
        this.mostrarVersoAleatorio();
        this.setupEventListeners();
    }
    
    mostrarVersoAleatorio() {
        const verso = this.versos[Math.floor(Math.random() * this.versos.length)];
        
        document.getElementById('versoArabic') && (document.getElementById('versoArabic').textContent = verso.arabic);
        document.getElementById('versoTraduccion') && (document.getElementById('versoTraduccion').textContent = `"${verso.traduccion}"`);
        document.getElementById('versoReferencia') && (document.getElementById('versoReferencia').textContent = verso.referencia);
        document.getElementById('versoTema') && (document.getElementById('versoTema').textContent = verso.tema);
        document.getElementById('versoReflexion') && (document.getElementById('versoReflexion').textContent = verso.reflexion);
    }
    
    setupEventListeners() {
        const nuevoBtn = document.getElementById('nuevoVerso');
        const compartirBtn = document.getElementById('compartirVerso');
        
        if(nuevoBtn) {
            nuevoBtn.addEventListener('click', () => this.mostrarVersoAleatorio());
        }
        
        if(compartirBtn) {
            compartirBtn.addEventListener('click', () => this.compartirVerso());
        }
    }
    
    compartirVerso() {
        const arabic = document.getElementById('versoArabic')?.textContent || '';
        const traduccion = document.getElementById('versoTraduccion')?.textContent || '';
        const texto = `📖 Verso del Corán del Día:\n\n${arabic}\n\n${traduccion}\n\nCompartido desde Al-Misbah`;
        
        if(navigator.share) {
            navigator.share({
                title: 'Verso del Corán',
                text: texto,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(texto).then(() => {
                alert('¡Verso copiado al portapapeles!');
            });
        }
    }
}

// ===== FILTRO 99 NOMBRES =====
function setupFiltroNombres() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar elementos
            const filter = this.dataset.filter;
            const nombres = document.querySelectorAll('.nombre-item');
            
            nombres.forEach(nombre => {
                if(filter === 'all' || nombre.dataset.category === filter) {
                    nombre.style.display = 'block';
                } else {
                    nombre.style.display = 'none';
                }
            });
        });
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes si existen en la página
    if(document.getElementById('perlasGrid')) {
        new ContadorTasbih();
    }
    
    if(document.getElementById('versoArabic')) {
        new VersoDelDia();
    }
    
    if(document.querySelector('.filter-btn')) {
        setupFiltroNombres();
    }
    
    // Mostrar fecha actual
    const hoy = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaElement = document.getElementById('fechaHoy');
    if(fechaElement) {
        fechaElement.textContent = hoy.toLocaleDateString('es-ES', opciones);
    }
});
