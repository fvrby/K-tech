/**
 * Ejercicios Screen Controller
 * Maneja la funcionalidad de la pantalla de ejercicios
 */

class EjerciciosScreen {
    constructor() {
        this.ttsManager = null;
        this.init();
    }

    /**
     * Inicializa la pantalla de ejercicios
     */
    init() {
        this.setupTTS();
        this.setupNavigation();
        this.setupEjercicios();
        this.setupAccessibility();
        
        console.log('Ejercicios screen initialized');
    }

    /**
     * Configura el sistema Text-to-Speech
     */
    setupTTS() {
        if (typeof TTSManager !== 'undefined') {
            this.ttsManager = new TTSManager();
            
            // TTS del header
            const headerTTSBtn = document.getElementById('header-tts-btn');
            if (headerTTSBtn) {
                headerTTSBtn.addEventListener('click', () => {
                    const content = this.getPageContent();
                    this.ttsManager.speak(content);
                });
            }

            // TTS personalizado
            const customTTSBtn = document.getElementById('custom-tts-btn');
            const customTextInput = document.getElementById('custom-text-input');
            
            if (customTTSBtn && customTextInput) {
                customTTSBtn.addEventListener('click', () => {
                    const text = customTextInput.value.trim();
                    if (text) {
                        this.ttsManager.speak(text);
                    } else {
                        this.ttsManager.speak('Por favor, escriba algún texto para reproducir');
                    }
                });
            }
        }
    }

    /**
     * Configura la navegación entre pantallas
     */
    setupNavigation() {
        // Botón Inicio
        const inicioBtn = document.getElementById('inicio-btn');
        if (inicioBtn) {
            inicioBtn.addEventListener('click', () => {
                this.navigateTo('index.html', 'Ir al inicio');
            });
        }

        // Botón Tutorial
        const tutorialBtn = document.getElementById('tutorial-btn');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', () => {
                this.navigateTo('tutorial.html', 'Ir al tutorial');
            });
        }

        // Botón Logros
        const logrosBtn = document.getElementById('logros-btn');
        if (logrosBtn) {
            logrosBtn.addEventListener('click', () => {
                this.navigateTo('logros.html', 'Ir a logros');
            });
        }

        // Botón Perfil
        const perfilBtn = document.getElementById('perfil-btn');
        if (perfilBtn) {
            perfilBtn.addEventListener('click', () => {
                this.navigateTo('perfil.html', 'Ir al perfil');
            });
        }
    }

    /**
     * Configura la funcionalidad de los ejercicios
     */
    setupEjercicios() {
        const ejercicioBtns = document.querySelectorAll('.ejercicio-btn');
        
        ejercicioBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const ejercicioType = event.target.getAttribute('data-ejercicio');
                this.iniciarEjercicio(ejercicioType);
            });
        });
    }

    /**
     * Inicia un ejercicio específico
     * @param {string} tipo - Tipo de ejercicio a iniciar
     */
    iniciarEjercicio(tipo) {
        const ejercicios = {
            caminata: {
                nombre: 'Caminata Suave',
                duracion: '15-30 minutos',
                instrucciones: 'Comience con una caminata suave a ritmo cómodo. Mantenga la espalda recta y respire profundamente.'
            },
            equilibrio: {
                nombre: 'Equilibrio y Estabilidad',
                duracion: '10-15 minutos',
                instrucciones: 'Ejercicios de balance. Manténgase cerca de una silla para apoyo si es necesario.'
            },
            fuerza: {
                nombre: 'Fortalecimiento Suave',
                duracion: '20 minutos',
                instrucciones: 'Ejercicios de resistencia suave. Use movimientos lentos y controlados.'
            },
            coordinacion: {
                nombre: 'Coordinación',
                duracion: '15 minutos',
                instrucciones: 'Movimientos coordinados para mejorar agilidad mental y física.'
            },
            matutina: {
                nombre: 'Rutina Matutina',
                duracion: '25 minutos',
                instrucciones: 'Secuencia completa de ejercicios para empezar el día con energía.'
            },
            nocturna: {
                nombre: 'Relajación Nocturna',
                duracion: '15 minutos',
                instrucciones: 'Estiramientos suaves y ejercicios de relajación para terminar el día.'
            }
        };

        const ejercicio = ejercicios[tipo];
        
        if (ejercicio) {
            // Feedback auditivo
            if (this.ttsManager) {
                this.ttsManager.speak(`Iniciando ${ejercicio.nombre}. ${ejercicio.instrucciones}`);
            }
            
            // Simular inicio de ejercicio
            this.mostrarModalEjercicio(ejercicio);
        }
    }

    /**
     * Muestra un modal con la información del ejercicio
     * @param {Object} ejercicio - Datos del ejercicio
     */
    mostrarModalEjercicio(ejercicio) {
        // Crear modal simple
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            box-sizing: border-box;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 15px;
            max-width: 400px;
            width: 100%;
            text-align: center;
        `;

        modalContent.innerHTML = `
            <h3 style="color: #2196F3; margin-bottom: 10px;">${ejercicio.nombre}</h3>
            <p style="margin-bottom: 10px;"><strong>Duración:</strong> ${ejercicio.duracion}</p>
            <p style="margin-bottom: 20px; line-height: 1.4;">${ejercicio.instrucciones}</p>
            <button id="comenzar-ejercicio" style="
                background: linear-gradient(135deg, #2196F3, #4CAF50);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                margin-right: 10px;
            ">Comenzar</button>
            <button id="cerrar-modal" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
            ">Cancelar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners del modal
        document.getElementById('cerrar-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('comenzar-ejercicio').addEventListener('click', () => {
            if (this.ttsManager) {
                this.ttsManager.speak('Ejercicio iniciado. ¡Disfrute su actividad física!');
            }
            document.body.removeChild(modal);
            
            // Aquí se podría integrar con la funcionalidad real de la zapatilla
            console.log(`Ejercicio ${ejercicio.nombre} iniciado`);
        });

        // Cerrar con Escape
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    /**
     * Navega a una URL específica
     * @param {string} url - URL de destino
     * @param {string} action - Descripción de la acción para TTS
     */
    navigateTo(url, action) {
        if (this.ttsManager) {
            this.ttsManager.speak(action);
        }
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    /**
     * Configura características de accesibilidad
     */
    setupAccessibility() {
        // Navegación por teclado
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'Escape':
                    this.navigateTo('index.html', 'Volviendo al inicio');
                    break;
                
                case 'F1':
                    event.preventDefault();
                    if (this.ttsManager) {
                        this.ttsManager.speak('Página de ejercicios. Seleccione un ejercicio para comenzar o use los botones de navegación.');
                    }
                    break;
                
                case 'Enter':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        const content = this.getPageContent();
                        if (this.ttsManager) {
                            this.ttsManager.speak(content);
                        }
                    }
                    break;
            }
        });

        // Mejorar focus visible
        const focusableElements = document.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid #2196F3';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    /**
     * Obtiene el contenido completo de la página para TTS
     * @returns {string} Contenido de la página
     */
    getPageContent() {
        const content = [];
        
        // Título y subtítulo
        content.push('Ejercicios diarios. Rutinas seguras y efectivas diseñadas para adultos mayores.');
        
        // Ejercicios disponibles
        const ejercicioCards = document.querySelectorAll('.ejercicio-card');
        ejercicioCards.forEach(card => {
            const titulo = card.querySelector('h3');
            const descripcion = card.querySelector('p:last-of-type');
            if (titulo && descripcion) {
                content.push(`${titulo.textContent}: ${descripcion.textContent}`);
            }
        });
        
        // Estadísticas
        content.push('Su progreso semanal incluye ejercicios completados, minutos activos y días consecutivos.');
        
        return content.join('. ');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.ejerciciosScreen = new EjerciciosScreen();
}); 