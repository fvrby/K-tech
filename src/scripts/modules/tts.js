/**
 * K-Tech App - Módulo Text-to-Speech
 * Funcionalidad completa de síntesis de voz para accesibilidad
 */

/**
 * Clase para manejar funcionalidades de Text-to-Speech
 */
class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isSupported = 'speechSynthesis' in window;
        this.isInitialized = false;
        
        // Configuración por defecto
        this.config = { ...TTS_CONFIG };
        
        // Estado del TTS
        this.state = {
            speaking: false,
            paused: false,
            error: false
        };
        
        // Callbacks de eventos
        this.eventCallbacks = new Map();
        
        this.init();
    }

    /**
     * Inicializar el módulo TTS
     */
    async init() {
        if (!this.isSupported) {
            console.warn('Speech Synthesis no está soportada en este navegador');
            return;
        }

        try {
            await this.loadVoices();
            this.setupEventListeners();
            this.isInitialized = true;
            
            console.log('TTS Manager inicializado correctamente');
        } catch (error) {
            console.error('Error inicializando TTS Manager:', error);
        }
    }

    /**
     * Cargar voces disponibles
     */
    async loadVoices() {
        return new Promise((resolve) => {
            const loadVoicesAttempt = () => {
                this.voices = this.synth.getVoices();
                
                if (this.voices.length > 0) {
                    this.selectBestVoice();
                    resolve();
                } else {
                    // Algunos navegadores cargan voces asíncronamente
                    setTimeout(loadVoicesAttempt, 100);
                }
            };

            // Evento cuando las voces estén disponibles
            this.synth.addEventListener('voiceschanged', loadVoicesAttempt);
            
            // Intentar cargar inmediatamente
            loadVoicesAttempt();
        });
    }

    /**
     * Seleccionar la mejor voz disponible para español
     */
    selectBestVoice() {
        // Prioridad de voces en español
        const preferredVoices = [
            'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es'
        ];

        let selectedVoice = null;

        // Buscar voz en orden de preferencia
        for (const lang of preferredVoices) {
            selectedVoice = this.voices.find(voice => 
                voice.lang.startsWith(lang) && !voice.name.includes('Google')
            );
            if (selectedVoice) break;
        }

        // Si no encuentra voz nativa, usar Google
        if (!selectedVoice) {
            selectedVoice = this.voices.find(voice => 
                voice.lang.startsWith('es')
            );
        }

        // Usar voz por defecto si no hay ninguna en español
        if (!selectedVoice && this.voices.length > 0) {
            selectedVoice = this.voices[0];
        }

        this.config.voice = selectedVoice;
        
        console.log('Voz seleccionada:', selectedVoice?.name || 'Ninguna');
    }

    /**
     * Configurar listeners de eventos
     */
    setupEventListeners() {
        // Limpiar voces cuando cambien
        this.synth.addEventListener('voiceschanged', () => {
            this.loadVoices();
        });
    }

    /**
     * Hablar texto
     * @param {string} text - Texto a leer
     * @param {Object} options - Opciones de configuración
     * @returns {Promise} Promise que se resuelve cuando termina de hablar
     */
    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                const error = new Error(ACCESSIBILITY_MESSAGES.errors.ttsNotSupported);
                this.triggerEvent(EVENTS.tts.error, { error });
                reject(error);
                return;
            }

            if (!text || text.trim().length === 0) {
                const error = new Error(ACCESSIBILITY_MESSAGES.errors.emptyText);
                this.triggerEvent(EVENTS.tts.error, { error });
                reject(error);
                return;
            }

            // Detener cualquier lectura en curso
            this.stop();

            // Crear nueva utterance
            this.currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Configurar utterance
            this.configureUtterance(this.currentUtterance, options);
            
            // Configurar eventos
            this.setupUtteranceEvents(this.currentUtterance, resolve, reject);
            
            // Comenzar a hablar
            try {
                this.synth.speak(this.currentUtterance);
                this.state.speaking = true;
                this.state.error = false;
                this.triggerEvent(EVENTS.tts.start, { text });
            } catch (error) {
                this.state.error = true;
                this.triggerEvent(EVENTS.tts.error, { error });
                reject(error);
            }
        });
    }

    /**
     * Configurar utterance con opciones
     * @param {SpeechSynthesisUtterance} utterance - Utterance a configurar
     * @param {Object} options - Opciones de configuración
     */
    configureUtterance(utterance, options) {
        // Aplicar configuración
        utterance.voice = options.voice || this.config.voice;
        utterance.rate = options.rate || this.config.rate;
        utterance.pitch = options.pitch || this.config.pitch;
        utterance.volume = options.volume || this.config.volume;
        utterance.lang = options.lang || this.config.lang;
    }

    /**
     * Configurar eventos de utterance
     * @param {SpeechSynthesisUtterance} utterance - Utterance
     * @param {Function} resolve - Función resolve de Promise
     * @param {Function} reject - Función reject de Promise
     */
    setupUtteranceEvents(utterance, resolve, reject) {
        utterance.onstart = () => {
            this.state.speaking = true;
            console.log('TTS iniciado');
        };

        utterance.onend = () => {
            this.state.speaking = false;
            this.state.paused = false;
            this.triggerEvent(EVENTS.tts.end);
            resolve();
        };

        utterance.onerror = (event) => {
            this.state.speaking = false;
            this.state.error = true;
            const error = new Error(`Error TTS: ${event.error}`);
            this.triggerEvent(EVENTS.tts.error, { error: event });
            reject(error);
        };

        utterance.onpause = () => {
            this.state.paused = true;
            this.triggerEvent(EVENTS.tts.pause);
        };

        utterance.onresume = () => {
            this.state.paused = false;
            this.triggerEvent(EVENTS.tts.resume);
        };
    }

    /**
     * Pausar lectura
     */
    pause() {
        if (this.isSupported && this.state.speaking && !this.state.paused) {
            this.synth.pause();
        }
    }

    /**
     * Reanudar lectura
     */
    resume() {
        if (this.isSupported && this.state.speaking && this.state.paused) {
            this.synth.resume();
        }
    }

    /**
     * Detener lectura
     */
    stop() {
        if (this.isSupported) {
            this.synth.cancel();
            this.state.speaking = false;
            this.state.paused = false;
            this.currentUtterance = null;
        }
    }

    /**
     * Obtener estado actual
     * @returns {Object} Estado del TTS
     */
    getState() {
        return {
            ...this.state,
            supported: this.isSupported,
            initialized: this.isInitialized,
            voices: this.voices.length,
            currentVoice: this.config.voice?.name || 'Ninguna'
        };
    }

    /**
     * Configurar opciones de TTS
     * @param {Object} newConfig - Nueva configuración
     */
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Si se especifica una voz por nombre, buscarla
        if (newConfig.voiceName) {
            const voice = this.voices.find(v => v.name === newConfig.voiceName);
            if (voice) {
                this.config.voice = voice;
            }
        }
    }

    /**
     * Obtener voces disponibles
     * @returns {Array} Lista de voces disponibles
     */
    getAvailableVoices() {
        return this.voices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService,
            default: voice.default
        }));
    }

    /**
     * Leer elemento del DOM
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Object} options - Opciones de lectura
     */
    async speakElement(element, options = {}) {
        const el = typeof element === 'string' ? 
            document.querySelector(element) : element;
        
        if (!el) {
            throw new Error('Elemento no encontrado');
        }

        // Extraer texto del elemento
        let text = '';
        
        // Priorizar aria-label
        if (el.hasAttribute('aria-label')) {
            text = el.getAttribute('aria-label');
        }
        // Luego aria-labelledby
        else if (el.hasAttribute('aria-labelledby')) {
            const labelId = el.getAttribute('aria-labelledby');
            const labelEl = document.getElementById(labelId);
            if (labelEl) {
                text = labelEl.textContent.trim();
            }
        }
        // Por último, contenido de texto
        else {
            text = el.textContent.trim();
        }

        return this.speak(text, options);
    }

    /**
     * Registrar callback de evento
     * @param {string} eventName - Nombre del evento
     * @param {Function} callback - Función callback
     */
    on(eventName, callback) {
        if (!this.eventCallbacks.has(eventName)) {
            this.eventCallbacks.set(eventName, []);
        }
        this.eventCallbacks.get(eventName).push(callback);
    }

    /**
     * Desregistrar callback de evento
     * @param {string} eventName - Nombre del evento
     * @param {Function} callback - Función callback
     */
    off(eventName, callback) {
        if (this.eventCallbacks.has(eventName)) {
            const callbacks = this.eventCallbacks.get(eventName);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Disparar evento
     * @param {string} eventName - Nombre del evento
     * @param {Object} data - Datos del evento
     */
    triggerEvent(eventName, data = {}) {
        if (this.eventCallbacks.has(eventName)) {
            this.eventCallbacks.get(eventName).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error en callback de evento TTS:', error);
                }
            });
        }
    }

    /**
     * Leer texto con pausas naturales
     * @param {string} text - Texto a leer
     * @param {Object} options - Opciones
     */
    async speakWithPauses(text, options = {}) {
        // Dividir texto en oraciones
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        for (let i = 0; i < sentences.length; i++) {
            await this.speak(sentences[i].trim(), options);
            
            // Pausa entre oraciones
            if (i < sentences.length - 1) {
                await new Promise(resolve => 
                    setTimeout(resolve, TIMING.tts.pauseBetweenSentences)
                );
            }
        }
    }
}

// Crear instancia global
window.ttsManager = new TTSManager();

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TTSManager;
} 