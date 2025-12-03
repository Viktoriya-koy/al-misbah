// main.js - Funcionalidades principales de Al-Misbah

// ===== CONTADOR DE TASBIH =====
// tasbih-enhanced.js - Contador de Tasbih mejorado
class TasbihMejorado {
    constructor() {
        this.contador = 0;
        this.totalPerlas = 33;
        this.formulas = [
            {
                arabic: "سُبْحَانَ الله",
                latin: "Subhanallah",
                significado: "Gloria a Alá",
                recomendacion: "33 veces"
            },
            {
                arabic: "الْحَمْدُ لِله",
                latin: "Alhamdulillah",
                significado: "Alabado sea Alá",
                recomendacion: "33 veces"
            },
            {
                arabic: "اللهُ أَكْبَر",
                latin: "Allahu Akbar",
                significado: "Alá es el más grande",
                recomendacion: "33 veces"
            },
            {
                arabic: "لا إله إلا الله",
                latin: "La ilaha illallah",
                significado: "No hay más dios que Alá",
                recomendacion: "1 vez (completa 100)"
            }
        ];
        
        this.formulaActual = 0;
        this.init();
    }
    
    init() {
        this.inicializarPerlas();
        this.setupEventListeners();
        this.actualizarInterfaz();
        this.setupPerlasClick();
    }
    
    inicializarPerlas() {
        const perlasGrid = document.getElementById('perlasGrid');
        if(!perlasGrid) return;
        
        perlasGrid.innerHTML = '';
        
        for(let i = 1; i <= this.totalPerlas; i++) {
            const perla = document.createElement('div');
            perla.className = 'perla';
            if(i === 33) perla.classList.add('marca-33');
            
            perla.innerHTML = `
                <span>${i}</span>
                <div class="perla-contador">${i}</div>
            `;
            
            perla.dataset.numero = i;
            perlasGrid.appendChild(perla);
        }
        
        this.actualizarPerlas();
    }
    
    setupPerlasClick() {
        const perlas = document.querySelectorAll('.perla');
        perlas.forEach(perla => {
            perla.addEventListener('click', () => {
                const numero = parseInt(perla.dataset.numero);
                this.contador = numero;
                this.actualizarInterfaz();
            });
        });
    }
    
    actualizarPerlas() {
        const perlas = document.querySelectorAll('.perla');
        
        perlas.forEach((perla, index) => {
            const numero = parseInt(perla.dataset.numero);
            
            // Resetear todas
            perla.classList.remove('activa');
            
            // Activar las que corresponden
            if(numero <= this.contador) {
                perla.classList.add('activa');
                
                // Efecto visual para la última activada
                if(numero === this.contador) {
                    this.animarPerla(perla);
                }
            }
            
            // Actualizar fórmula cada 33
            if(this.contador > 0 && this.contador % 33 === 0) {
                this.formulaActual = (this.contador / 33) % this.formulas.length;
                this.actualizarFormula();
            }
        });
    }
    
    animarPerla(perla) {
        perla.style.transform = 'scale(1.3)';
        setTimeout(() => {
            perla.style.transform = 'scale(1.15)';
        }, 150);
    }
    
    actualizarFormula() {
        const formula = this.formulas[this.formulaActual];
        
        // Actualizar indicador
        const indicador = document.querySelector('.dhikr-actual');
        const traduccion = document.querySelector('.dhikr-traduccion');
        const significado = document.querySelector('.dhikr-significado');
        
        if(indicador) indicador.textContent = formula.arabic;
        if(traduccion) traduccion.textContent = formula.latin;
        if(significado) significado.textContent = `${formula.significado} (${formula.recomendacion})`;
        
        // Actualizar fórmula activa en grid
        document.querySelectorAll('.formula-item').forEach((item, index) => {
            item.classList.toggle('activa', index === this.formulaActual);
        });
    }
    
    setupEventListeners() {
        // Botón +1
        const addBtn = document.getElementById('addOne');
        if(addBtn) {
            addBtn.addEventListener('click', () => {
                this.contador++;
                if(this.contador > 99) this.contador = 0; // Reset después de 99
                this.actualizarInterfaz();
                this.playClickSound();
            });
            
            // También con tecla espacio
            document.addEventListener('keydown', (e) => {
                if(e.code === 'Space' && !e.target.matches('input, textarea')) {
                    e.preventDefault();
                    this.contador++;
                    if(this.contador > 99) this.contador = 0;
                    this.actualizarInterfaz();
                    this.playClickSound();
                }
            });
        }
        
        // Botón reset
        const resetBtn = document.getElementById('resetCounter');
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.contador = 0;
                this.formulaActual = 0;
                this.actualizarInterfaz();
                this.playResetSound();
            });
        }
        
        // Botones de fórmula
        document.querySelectorAll('.formula-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.formulaActual = index;
                this.actualizarFormula();
            });
        });
    }
    
    actualizarInterfaz() {
        // Actualizar contador numérico
        const counter = document.getElementById('counter');
        if(counter) counter.textContent = this.contador;
        
        // Actualizar perlas visuales
        this.actualizarPerlas();
        
        // Actualizar fórmula si corresponde
        if(this.contador > 0 && this.contador % 33 === 0) {
            this.formulaActual = (this.contador / 33) % this.formulas.length;
        }
        this.actualizarFormula();
    }
    
    playClickSound() {
        // Sonido sutil de click (opcional)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Fallback silencioso si no hay AudioContext
        }
    }
    
    playResetSound() {
        // Sonido diferente para reset
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Fallback silencioso
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('perlasGrid')) {
        new TasbihMejorado();
    }
});

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
