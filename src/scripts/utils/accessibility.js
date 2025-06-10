/**
 * K-Tech App - Utilidades de Accesibilidad
 * Funciones auxiliares para mejorar la accesibilidad
 */

/**
 * Clase para manejar utilidades de accesibilidad
 */
class AccessibilityUtils {
    constructor() {
        this.isKeyboardUser = false;
        this.init();
    }

    /**
     * Inicializar utilidades de accesibilidad
     */
    init() {
        this.detectKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
        this.announcePageLoad();
    }

    /**
     * Detectar si el usuario navega con teclado
     */
    detectKeyboardNavigation() {
        // Detectar uso de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.isKeyboardUser = true;
                document.body.classList.add(CSS_CLASSES.accessibility.keyboardUser);
            }
        });

        // Detectar uso de mouse
        document.addEventListener('mousedown', () => {
            this.isKeyboardUser = false;
            document.body.classList.remove(CSS_CLASSES.accessibility.keyboardUser);
        });

        // Detectar uso de touch
        document.addEventListener('touchstart', () => {
            this.isKeyboardUser = false;
            document.body.classList.remove(CSS_CLASSES.accessibility.keyboardUser);
        });
    }

    /**
     * Configurar manejo mejorado del foco
     */
    setupFocusManagement() {
        // Trap focus en modales (cuando se implementen)
        this.setupFocusTrap();
        
        // Skip links para navegación rápida
        this.createSkipLinks();
    }

    /**
     * Crear enlaces de salto para navegación rápida
     */
    createSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;

        // Mostrar cuando recibe foco
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Agregar ID al contenido principal si no existe
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    }

    /**
     * Configurar trap de foco para modales
     */
    setupFocusTrap() {
        // Esta función se expandirá cuando se implementen modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Cerrar modales o elementos activos
                this.handleEscapeKey();
            }
        });
    }

    /**
     * Manejar tecla Escape
     */
    handleEscapeKey() {
        // Detener TTS si está activo
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            this.announceToScreenReader('Lectura detenida');
        }
    }

    /**
     * Configurar respeto por preferencias de movimiento reducido
     */
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        handleMotionPreference(mediaQuery);
        mediaQuery.addEventListener('change', handleMotionPreference);
    }

    /**
     * Anunciar carga de página a lectores de pantalla
     */
    announcePageLoad() {
        // Crear región live para anuncios
        this.createLiveRegion();
        
        // Anunciar después de que la página se cargue completamente
        setTimeout(() => {
            this.announceToScreenReader(
                `${APP_CONFIG.name} cargado. ${ACCESSIBILITY_MESSAGES.welcome.description}`
            );
        }, 1000);
    }

    /**
     * Crear región live para anuncios dinámicos
     */
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    /**
     * Anunciar mensaje a lectores de pantalla
     * @param {string} message - Mensaje a anunciar
     * @param {string} priority - 'polite' o 'assertive'
     */
    announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('sr-live-region') || this.createLiveRegion();
        
        // Cambiar prioridad si es necesario
        liveRegion.setAttribute('aria-live', priority);
        
        // Limpiar y establecer mensaje
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);

        // Limpiar después de un tiempo
        setTimeout(() => {
            liveRegion.textContent = '';
        }, TIMING.tts.successDisplayDuration);
    }

    /**
     * Validar que un elemento sea accesible
     * @param {HTMLElement} element - Elemento a validar
     * @returns {Object} Resultado de la validación
     */
    validateAccessibility(element) {
        const issues = [];

        // Verificar si botones tienen texto accesible
        if (element.tagName === 'BUTTON') {
            const hasText = element.textContent.trim().length > 0;
            const hasAriaLabel = element.hasAttribute('aria-label');
            const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');

            if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
                issues.push('Botón sin texto accesible');
            }
        }

        // Verificar contraste (simplificado)
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        const textColor = style.color;

        // Verificar tamaño mínimo de área de toque
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            const rect = element.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                issues.push('Área de toque menor a 44px');
            }
        }

        return {
            isAccessible: issues.length === 0,
            issues: issues
        };
    }

    /**
     * Obtener información del usuario sobre tecnologías asistivas
     * @returns {Object} Información sobre capacidades del navegador
     */
    getAssistiveTechInfo() {
        return {
            speechSynthesis: 'speechSynthesis' in window,
            speechRecognition: 'speechRecognition' in window || 'webkitSpeechRecognition' in window,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            screenReader: this.detectScreenReader()
        };
    }

    /**
     * Detectar si se está usando un lector de pantalla
     * @returns {boolean} True si se detecta un lector de pantalla
     */
    detectScreenReader() {
        // Métodos para detectar lectores de pantalla
        const hasScreenReader = (
            // Verificar si existe la API de accesibilidad
            'speechSynthesis' in window ||
            // Verificar usuario-agente específico
            /NVDA|JAWS|DRAGON|VoiceOver/i.test(navigator.userAgent) ||
            // Verificar si se prefiere texto sobre imágenes
            window.matchMedia('(prefers-reduced-data: reduce)').matches
        );

        return hasScreenReader;
    }

    /**
     * Mejorar foco visible en elementos
     * @param {HTMLElement} element - Elemento al que mejorar el foco
     */
    enhanceFocus(element) {
        element.addEventListener('focus', () => {
            element.style.outline = '3px solid #005fcc';
            element.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    }

    /**
     * Crear tooltip accesible
     * @param {HTMLElement} element - Elemento que tendrá el tooltip
     * @param {string} text - Texto del tooltip
     */
    createAccessibleTooltip(element, text) {
        const tooltipId = `tooltip-${Date.now()}`;
        
        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.textContent = text;
        tooltip.className = 'accessible-tooltip sr-only';
        tooltip.setAttribute('role', 'tooltip');
        
        document.body.appendChild(tooltip);
        
        element.setAttribute('aria-describedby', tooltipId);
        
        element.addEventListener('focus', () => {
            tooltip.classList.remove('sr-only');
        });
        
        element.addEventListener('blur', () => {
            tooltip.classList.add('sr-only');
        });
    }
}

// Inicializar utilidades de accesibilidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityUtils = new AccessibilityUtils();
});

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityUtils;
} 