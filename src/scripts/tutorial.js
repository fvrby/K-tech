/**
 * Tutorial Screen Controller
 * Maneja la funcionalidad de la pantalla de tutorial
 */

class TutorialScreen {
    constructor() {
        this.ttsManager = null;
        this.init();
    }

    /**
     * Inicializa la pantalla de tutorial
     */
    init() {
        this.setupTTS();
        this.setupNavigation();
        this.setupAccessibility();
        this.setupVideoAccessibility();
        
        console.log('Tutorial screen initialized');
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

        // Botón Ejercicios
        const ejerciciosBtn = document.getElementById('ejercicios-btn');
        if (ejerciciosBtn) {
            ejerciciosBtn.addEventListener('click', () => {
                this.navigateTo('ejercicios.html', 'Ir a ejercicios');
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
     * Navega a una URL específica
     * @param {string} url - URL de destino
     * @param {string} action - Descripción de la acción para TTS
     */
    navigateTo(url, action) {
        // Feedback auditivo si TTS está disponible
        if (this.ttsManager) {
            this.ttsManager.speak(action);
        }
        
        // Pequeño delay para que se escuche el TTS antes de navegar
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
                    // Volver al inicio
                    this.navigateTo('index.html', 'Volviendo al inicio');
                    break;
                
                case 'F1':
                    event.preventDefault();
                    // Leer ayuda
                    if (this.ttsManager) {
                        this.ttsManager.speak('Página de tutorial. Use las teclas Tab para navegar, Escape para volver al inicio, o los botones en pantalla para continuar.');
                    }
                    break;
                
                case 'Enter':
                    if (event.ctrlKey) {
                        // Ctrl+Enter para TTS de página completa
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
     * Configura accesibilidad específica para el video
     */
    setupVideoAccessibility() {
        const videoContainer = document.querySelector('.video-container');
        const iframe = videoContainer?.querySelector('iframe');
        
        if (iframe) {
            // Añadir controles de teclado para el iframe
            iframe.addEventListener('focus', () => {
                if (this.ttsManager) {
                    this.ttsManager.speak('Video tutorial de K-Tech. Use los controles del reproductor para reproducir o pausar.');
                }
            });
        }
    }

    /**
     * Obtiene el contenido completo de la página para TTS
     * @returns {string} Contenido de la página
     */
    getPageContent() {
        const content = [];
        
        // Título principal
        const title = document.querySelector('.tutorial-title');
        if (title) content.push(title.textContent);
        
        // Subtítulo
        const subtitle = document.querySelector('.tutorial-subtitle');
        if (subtitle) content.push(subtitle.textContent);
        
        // Sección de aprendizaje
        content.push('¿Qué aprenderá?');
        const learningItems = document.querySelectorAll('.learning-item');
        learningItems.forEach(item => {
            const title = item.querySelector('h4');
            const description = item.querySelector('p');
            if (title && description) {
                content.push(`${title.textContent}: ${description.textContent}`);
            }
        });
        
        // Instrucciones de navegación
        content.push('Use los botones de navegación para continuar: Inicio, Ejercicios, Logros, o Perfil.');
        
        return content.join('. ');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialScreen = new TutorialScreen();
}); 