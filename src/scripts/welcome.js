/**
 * K-Tech App - Script Pantalla de Bienvenida
 * Funcionalidad específica para la pantalla de bienvenida
 */

/**
 * Clase para manejar la pantalla de bienvenida
 */
class WelcomeScreen {
    constructor() {
        this.elements = {};
        this.isReady = false;
        
        // Bindear métodos
        this.handleTTSWelcome = this.handleTTSWelcome.bind(this);
        this.handleTTSCustom = this.handleTTSCustom.bind(this);
        this.handleStartButton = this.handleStartButton.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        
        this.init();
    }

    /**
     * Inicializar la pantalla de bienvenida
     */
    async init() {
        try {
            await this.waitForDOMReady();
            this.cacheElements();
            this.setupEventListeners();
            this.setupTTSEvents();
            this.setupKeyboardNavigation();
            this.validateAccessibility();
            
            this.isReady = true;
            
            console.log('Pantalla de bienvenida inicializada correctamente');
            
            // Anunciar que la aplicación está lista
            this.announceReady();
            
        } catch (error) {
            console.error('Error inicializando pantalla de bienvenida:', error);
        }
    }

    /**
     * Esperar a que el DOM esté listo
     */
    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Cachear elementos del DOM
     */
    cacheElements() {
        // Elementos principales
        this.elements.screen = document.querySelector(DOM_SELECTORS.welcome.screen);
        this.elements.title = document.querySelector(DOM_SELECTORS.welcome.title);
        this.elements.ttsButton = document.querySelector(DOM_SELECTORS.welcome.ttsButton);
        this.elements.customText = document.querySelector(DOM_SELECTORS.welcome.customText);
        this.elements.customTtsButton = document.querySelector(DOM_SELECTORS.welcome.customTtsButton);
        this.elements.startButton = document.querySelector(DOM_SELECTORS.welcome.startButton);

        // Validar que elementos críticos existen
        const requiredElements = ['screen', 'ttsButton', 'customText', 'customTtsButton', 'startButton'];
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                throw new Error(`Elemento requerido no encontrado: ${elementName}`);
            }
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botón TTS de bienvenida
        this.elements.ttsButton.addEventListener('click', this.handleTTSWelcome);
        
        // Botón TTS personalizado
        this.elements.customTtsButton.addEventListener('click', this.handleTTSCustom);
        
        // Botón de inicio
        this.elements.startButton.addEventListener('click', this.handleStartButton);
        
        // Validación en tiempo real del textarea
        this.elements.customText.addEventListener('input', this.handleCustomTextInput.bind(this));
        
        // Enter en textarea para activar TTS
        this.elements.customText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.handleTTSCustom();
            }
        });
    }

    /**
     * Configurar eventos de TTS
     */
    setupTTSEvents() {
        // Escuchar eventos del TTS Manager
        if (window.ttsManager) {
            window.ttsManager.on(EVENTS.tts.start, this.handleTTSStart.bind(this));
            window.ttsManager.on(EVENTS.tts.end, this.handleTTSEnd.bind(this));
            window.ttsManager.on(EVENTS.tts.error, this.handleTTSError.bind(this));
        }
    }

    /**
     * Configurar navegación por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', this.handleKeyboardNavigation);
    }

    /**
     * Manejar botón TTS de bienvenida
     */
    async handleTTSWelcome() {
        try {
            // Mensaje de bienvenida completo
            const welcomeText = `
                ${ACCESSIBILITY_MESSAGES.welcome.title}. 
                ${ACCESSIBILITY_MESSAGES.welcome.description} 
                ${ACCESSIBILITY_MESSAGES.welcome.instructions}
            `;

            this.setTTSButtonState(this.elements.ttsButton, 'speaking');
            await window.ttsManager.speak(welcomeText);
            
            // Anunciar a lectores de pantalla
            window.accessibilityUtils?.announceToScreenReader(
                ACCESSIBILITY_MESSAGES.buttons.tts
            );
            
        } catch (error) {
            this.handleTTSError({ error });
        }
    }

    /**
     * Manejar botón TTS personalizado
     */
    async handleTTSCustom() {
        try {
            const customText = this.elements.customText.value.trim();
            
            if (!customText) {
                // Mostrar mensaje de error
                this.showTemporaryMessage(
                    ACCESSIBILITY_MESSAGES.errors.emptyText,
                    'error'
                );
                
                // Enfocar el textarea
                this.elements.customText.focus();
                return;
            }

            this.setTTSButtonState(this.elements.customTtsButton, 'speaking');
            await window.ttsManager.speak(customText);
            
            // Anunciar éxito
            window.accessibilityUtils?.announceToScreenReader(
                ACCESSIBILITY_MESSAGES.buttons.customText
            );
            
        } catch (error) {
            this.handleTTSError({ error });
        }
    }

    /**
     * Manejar botón de inicio
     */
    handleStartButton() {
        try {
            // Anunciar acción
            window.accessibilityUtils?.announceToScreenReader(
                ACCESSIBILITY_MESSAGES.buttons.start
            );
            
            // Aquí se implementará la navegación a la siguiente pantalla
            console.log('Iniciando aplicación K-Tech...');
            
            // Temporal: mostrar mensaje de confirmación
            this.showTemporaryMessage(
                'Funcionalidad de navegación se implementará en el siguiente módulo',
                'info'
            );
            
        } catch (error) {
            console.error('Error en botón de inicio:', error);
        }
    }

    /**
     * Manejar cambios en el texto personalizado
     */
    handleCustomTextInput() {
        const text = this.elements.customText.value;
        const isValid = text.trim().length > 0 && text.length <= VALIDATION.text.maxLength;
        
        // Habilitar/deshabilitar botón TTS personalizado
        this.elements.customTtsButton.disabled = !isValid;
        
        // Feedback visual
        if (text.length > VALIDATION.text.maxLength) {
            this.elements.customText.style.borderColor = 'var(--contrast-error)';
            this.showTemporaryMessage(
                `Texto demasiado largo (máximo ${VALIDATION.text.maxLength} caracteres)`,
                'error'
            );
        } else {
            this.elements.customText.style.borderColor = '';
        }
    }

    /**
     * Manejar navegación por teclado
     */
    handleKeyboardNavigation(e) {
        // Escape para detener TTS
        if (e.key === 'Escape') {
            if (window.ttsManager?.getState().speaking) {
                window.ttsManager.stop();
                this.resetTTSButtons();
                
                window.accessibilityUtils?.announceToScreenReader(
                    ACCESSIBILITY_MESSAGES.success.ttsStopped
                );
            }
        }
        
        // F1 para ayuda rápida
        if (e.key === 'F1') {
            e.preventDefault();
            this.showQuickHelp();
        }
    }

    /**
     * Manejar inicio de TTS
     */
    handleTTSStart() {
        console.log('TTS iniciado en pantalla de bienvenida');
    }

    /**
     * Manejar fin de TTS
     */
    handleTTSEnd() {
        this.resetTTSButtons();
        
        window.accessibilityUtils?.announceToScreenReader(
            ACCESSIBILITY_MESSAGES.success.ttsCompleted
        );
    }

    /**
     * Manejar error de TTS
     */
    handleTTSError({ error }) {
        this.resetTTSButtons();
        this.setTTSButtonState(null, 'error');
        
        const errorMessage = error.message || ACCESSIBILITY_MESSAGES.errors.ttsError;
        this.showTemporaryMessage(errorMessage, 'error');
        
        console.error('Error TTS en pantalla de bienvenida:', error);
    }

    /**
     * Establecer estado de botón TTS
     * @param {HTMLElement} button - Botón a modificar
     * @param {string} state - Estado (speaking, error, normal)
     */
    setTTSButtonState(button, state) {
        // Resetear todos los botones TTS
        document.querySelectorAll('.tts-button').forEach(btn => {
            btn.classList.remove(CSS_CLASSES.states.speaking, CSS_CLASSES.states.error);
        });
        
        // Aplicar estado específico
        if (button && state !== 'normal') {
            button.classList.add(CSS_CLASSES.states[state]);
        }
    }

    /**
     * Resetear botones TTS
     */
    resetTTSButtons() {
        document.querySelectorAll('.tts-button').forEach(btn => {
            btn.classList.remove(
                CSS_CLASSES.states.speaking,
                CSS_CLASSES.states.error,
                CSS_CLASSES.states.loading
            );
        });
    }

    /**
     * Mostrar mensaje temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje (error, success, info)
     */
    showTemporaryMessage(message, type = 'info') {
        // Crear elemento de mensaje si no existe
        let messageEl = document.getElementById('temp-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'temp-message';
            messageEl.className = 'temporary-message';
            messageEl.setAttribute('role', 'alert');
            messageEl.setAttribute('aria-live', 'assertive');
            this.elements.screen.appendChild(messageEl);
        }

        // Configurar mensaje
        messageEl.textContent = message;
        messageEl.className = `temporary-message ${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? 'var(--contrast-error)' : 'var(--contrast-focus)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius-md);
            z-index: 1000;
            box-shadow: var(--shadow-lg);
            animation: fadeInDown 0.3s ease-out;
        `;

        // Remover después de un tiempo
        const duration = type === 'error' ? TIMING.tts.errorDisplayDuration : TIMING.tts.successDisplayDuration;
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'fadeOutUp 0.3s ease-in';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, duration);
    }

    /**
     * Mostrar ayuda rápida
     */
    showQuickHelp() {
        const helpText = `
            Ayuda rápida de K-Tech: 
            - Use Tab para navegar entre elementos
            - Presione Escape para detener la lectura de voz
            - Presione F1 para esta ayuda
            - Use Ctrl+Enter en el área de texto para leer texto personalizado
            - Todos los botones tienen funciones de voz integradas
        `;
        
        if (window.ttsManager) {
            window.ttsManager.speak(helpText);
        }
    }

    /**
     * Validar accesibilidad de elementos
     */
    validateAccessibility() {
        if (!window.accessibilityUtils) return;
        
        const elementsToValidate = [
            this.elements.ttsButton,
            this.elements.customTtsButton,
            this.elements.startButton
        ];
        
        elementsToValidate.forEach(element => {
            const validation = window.accessibilityUtils.validateAccessibility(element);
            if (!validation.isAccessible) {
                console.warn('Problemas de accesibilidad encontrados:', element, validation.issues);
            }
        });
    }

    /**
     * Anunciar que la aplicación está lista
     */
    announceReady() {
        setTimeout(() => {
            if (window.accessibilityUtils) {
                window.accessibilityUtils.announceToScreenReader(
                    'Pantalla de bienvenida de K-Tech lista para usar'
                );
            }
        }, 1500);
    }

    /**
     * Obtener estado de la pantalla
     */
    getState() {
        return {
            isReady: this.isReady,
            elementsFound: Object.keys(this.elements).length,
            ttsAvailable: !!window.ttsManager?.getState().supported,
            accessibilityReady: !!window.accessibilityUtils
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.welcomeScreen = new WelcomeScreen();
});

// Añadir estilos CSS adicionales para animaciones
const additionalStyles = `
    .temporary-message {
        font-weight: 500;
        font-size: 1rem;
        text-align: center;
        max-width: 90vw;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes fadeOutUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .reduced-motion .temporary-message {
        animation: none !important;
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WelcomeScreen;
} 