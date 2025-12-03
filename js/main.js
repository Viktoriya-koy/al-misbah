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

// nombres-allah.js - Interactividad para los 99 Nombres
class NombresAllahMejorados {
    constructor() {
        this.nombres = [
            {
                arabic: "الرَّحْمَنُ",
                latin: "Ar-Rahman",
                significado: "El Misericordiosísimo",
                explicacion: "Aquel cuya misericordia abarca todas las cosas en esta vida y en la otra. Es la misericordia universal que alcanza a creyentes y no creyentes por igual.",
                categoria: "amor",
                referencia: "Mencionado 57 veces en el Corán",
                beneficios: "Invocar este nombre trae misericordia y bendición a todos los aspectos de la vida."
            },
            {
                arabic: "الرَّحِيمُ",
                latin: "Ar-Rahim",
                significado: "El Compasivo",
                explicacion: "Aquel que otorga Su misericordia especialmente a los creyentes en la Otra Vida. Es la misericordia especial reservada para quienes creen.",
                categoria: "amor",
                referencia: "Mencionado 114 veces en el Corán",
                beneficios: "Trae perdón, misericordia especial y recompensa en la Otra Vida."
            },
            // Agregar más nombres aquí...
        ];
        
        this.init();
    }
    
    init() {
        this.setupFiltros();
        this.setupModal();
        this.setupAnimaciones();
        this.setupHoverEffects();
    }
    
    setupFiltros() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Quitar activo de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                // Activar este
                btn.classList.add('active');
                
                // Aplicar filtro
                const filter = btn.dataset.filter;
                this.aplicarFiltro(filter);
                
                // Efecto visual
                this.animarFiltro(btn);
            });
        });
    }
    
    aplicarFiltro(filter) {
        const nombres = document.querySelectorAll('.nombre-item');
        
        nombres.forEach(nombre => {
            if(filter === 'all' || nombre.dataset.category === filter) {
                nombre.style.display = 'block';
                setTimeout(() => {
                    nombre.style.opacity = '1';
                    nombre.style.transform = 'translateY(0)';
                }, 10);
            } else {
                nombre.style.opacity = '0';
                nombre.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    nombre.style.display = 'none';
                }, 300);
            }
        });
    }
    
    animarFiltro(btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
    
    setupModal() {
        const modal = document.getElementById('nombreModal');
        const closeBtn = document.getElementById('modalClose');
        const nombresItems = document.querySelectorAll('.nombre-item');
        
        if(!modal) return;
        
        // Abrir modal al hacer clic en un nombre
        nombresItems.forEach(item => {
            item.addEventListener('click', () => {
                this.abrirModal(item);
            });
        });
        
        // Cerrar modal
        closeBtn?.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
    
    abrirModal(item) {
        const modal = document.getElementById('nombreModal');
        const content = document.getElementById('modalContent');
        
        if(!modal || !content) return;
        
        const arabic = item.querySelector('.nombre-arabic')?.textContent || '';
        const latin = item.querySelector('.nombre-latin')?.textContent || '';
        const significado = item.querySelector('.nombre-significado')?.textContent || '';
        const explicacion = item.querySelector('.nombre-explicacion')?.textContent || '';
        const categoria = item.querySelector('.nombre-categoria')?.textContent || '';
        
        const nombreCompleto = this.nombres.find(n => n.arabic === arabic) || {};
        
        content.innerHTML = `
            <div style="padding: 3rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-family: var(--font-arabic); font-size: 4rem; color: var(--verde-profundo); 
                         direction: rtl; margin-bottom: 1rem; text-shadow: 0 5px 15px rgba(13, 115, 119, 0.1);">
                        ${arabic}
                    </div>
                    <div style="font-size: 1.8rem; font-weight: 600; color: var(--gris-texto); margin-bottom: 0.5rem;">
                        ${latin}
                    </div>
                    <div style="font-size: 1.4rem; color: var(--dorado-sutil); font-weight: 500; margin-bottom: 2rem;">
                        ${significado}
                    </div>
                    <span style="display: inline-block; padding: 0.5rem 1.5rem; background: rgba(212, 175, 55, 0.1); 
                          color: var(--dorado-sutil); border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.3);">
                        ${categoria}
                    </span>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: var(--verde-profundo); margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-book-open"></i> Significado Profundo
                    </h3>
                    <p style="color: #555; line-height: 1.7; font-size: 1.1rem;">
                        ${nombreCompleto.explicacion || explicacion}
                    </p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                    <div style="background: var(--blanco-rotura); padding: 1.5rem; border-radius: 15px; border-left: 4px solid var(--turquesa);">
                        <h4 style="color: var(--verde-profundo); margin-bottom: 0.5rem;">
                            <i class="fas fa-quran"></i> En el Corán
                        </h4>
                        <p style="color: #666;">
                            ${nombreCompleto.referencia || 'Mencionado múltiples veces en el Corán'}
                        </p>
                    </div>
                    
                    <div style="background: var(--blanco-rotura); padding: 1.5rem; border-radius: 15px; border-left: 4px solid var(--dorado-sutil);">
                        <h4 style="color: var(--verde-profundo); margin-bottom: 0.5rem;">
                            <i class="fas fa-hands-praying"></i> Beneficios
                        </h4>
                        <p style="color: #666;">
                            ${nombreCompleto.beneficios || 'Invocar este nombre acerca al creyente a Dios'}
                        </p>
                    </div>
                </div>
                
                <div style="margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--gris-claro); text-align: center;">
                    <p style="color: #666; font-style: italic;">
                        <i class="fas fa-lightbulb"></i> Reflexiona sobre este nombre hoy. ¿Cómo se manifiesta en tu vida?
                    </p>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
    
    setupAnimaciones() {
        // Animación de entrada escalonada
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.nombre-item').forEach(item => {
            observer.observe(item);
        });
    }
    
    setupHoverEffects() {
        const nombres = document.querySelectorAll('.nombre-item');
        
        nombres.forEach(nombre => {
            nombre.addEventListener('mouseenter', () => {
                const arabic = nombre.querySelector('.nombre-arabic');
                if(arabic) {
                    arabic.style.transform = 'scale(1.05)';
                    arabic.style.transition = 'transform 0.3s ease';
                }
            });
            
            nombre.addEventListener('mouseleave', () => {
                const arabic = nombre.querySelector('.nombre-arabic');
                if(arabic) {
                    arabic.style.transform = 'scale(1)';
                }
            });
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('.nombres-allah')) {
        new NombresAllahMejorados();
    }
});

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
