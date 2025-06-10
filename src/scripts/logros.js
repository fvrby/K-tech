/**
 * Logros Screen Controller
 * Maneja la funcionalidad de la pantalla de logros
 */

class LogrosScreen {
    constructor() {
        this.ttsManager = null;
        this.init();
    }

    /**
     * Inicializa la pantalla de logros
     */
    init() {
        this.setupTTS();
        this.setupNavigation();
        this.setupProgressAnimations();
        this.setupAccessibility();
        
        console.log('Logros screen initialized');
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

        // Botón Ejercicios
        const ejerciciosBtn = document.getElementById('ejercicios-btn');
        if (ejerciciosBtn) {
            ejerciciosBtn.addEventListener('click', () => {
                this.navigateTo('ejercicios.html', 'Ir a ejercicios');
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
     * Configura las animaciones de progreso
     */
    setupProgressAnimations() {
        // Animar barras de progreso cuando se cargan
        const progressBars = document.querySelectorAll('.progress-fill');
        
        // Usar setTimeout para permitir que el CSS se cargue primero
        setTimeout(() => {
            progressBars.forEach((bar, index) => {
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 200);
            });
        }, 500);

        // Agregar interactividad a las tarjetas de logros
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showAchievementDetails(card);
            });
        });
    }

    /**
     * Muestra detalles de un logro específico
     * @param {HTMLElement} card - Tarjeta del logro
     */
    showAchievementDetails(card) {
        const title = card.querySelector('h4').textContent;
        const description = card.querySelector('p').textContent;
        const isUnlocked = card.classList.contains('unlocked');
        
        let statusText = '';
        if (isUnlocked) {
            const date = card.querySelector('.achievement-date');
            statusText = date ? date.textContent : 'Logro desbloqueado';
        } else {
            const progress = card.querySelector('.achievement-progress');
            statusText = progress ? progress.textContent : 'Logro bloqueado';
        }

        // Feedback auditivo
        if (this.ttsManager) {
            this.ttsManager.speak(`${title}. ${description}. ${statusText}`);
        }

        // Efecto visual
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
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
                        this.ttsManager.speak('Página de logros. Vea su progreso, logros desbloqueados y estadísticas generales. Use los botones de navegación para continuar.');
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
        const focusableElements = document.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), .achievement-card');
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

        // Hacer las tarjetas de logros accesibles por teclado
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Logro ${index + 1}: ${card.querySelector('h4').textContent}`);
            
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.showAchievementDetails(card);
                }
            });
        });
    }

    /**
     * Obtiene el contenido completo de la página para TTS
     * @returns {string} Contenido de la página
     */
    getPageContent() {
        const content = [];
        
        // Información del usuario
        const userName = document.querySelector('.user-name');
        const userLevel = document.querySelector('.user-level');
        if (userName && userLevel) {
            content.push(`Perfil de ${userName.textContent}, ${userLevel.textContent}`);
        }

        // Título de logros
        content.push('Mis logros. Celebra cada paso hacia una vida más saludable.');
        
        // Progreso semanal
        content.push('Progreso de esta semana:');
        const progressItems = document.querySelectorAll('.progress-item');
        progressItems.forEach(item => {
            const label = item.querySelector('.progress-label');
            const value = item.querySelector('.progress-value');
            if (label && value) {
                content.push(`${label.textContent}: ${value.textContent}`);
            }
        });
        
        // Logros desbloqueados
        const unlockedAchievements = document.querySelectorAll('.achievement-card.unlocked');
        if (unlockedAchievements.length > 0) {
            content.push(`Tiene ${unlockedAchievements.length} logros desbloqueados:`);
            unlockedAchievements.forEach(card => {
                const title = card.querySelector('h4');
                if (title) {
                    content.push(title.textContent);
                }
            });
        }
        
        // Estadísticas generales
        const stats = document.querySelectorAll('.stat-card');
        if (stats.length > 0) {
            content.push('Resumen general:');
            stats.forEach(stat => {
                const number = stat.querySelector('.stat-number');
                const label = stat.querySelector('.stat-label');
                if (number && label) {
                    content.push(`${number.textContent} ${label.textContent}`);
                }
            });
        }
        
        return content.join('. ');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.logrosScreen = new LogrosScreen();
}); 