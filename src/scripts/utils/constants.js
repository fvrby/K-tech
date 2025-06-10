/**
 * K-Tech App - Constantes Globales
 * Configuración y constantes de la aplicación
 */

// Configuración de la aplicación
const APP_CONFIG = {
    name: 'K-Tech',
    version: '1.0.0',
    description: 'Aplicación de control de zapatilla inteligente con accesibilidad avanzada'
};

// Configuración de Text-to-Speech
const TTS_CONFIG = {
    lang: 'es-ES',
    rate: 0.8,        // Velocidad de lectura (0.1 - 10)
    pitch: 1,         // Tono de voz (0 - 2)
    volume: 0.8,      // Volumen (0 - 1)
    voice: null       // Se establecerá dinámicamente
};

// Mensajes predefinidos para accesibilidad
const ACCESSIBILITY_MESSAGES = {
    welcome: {
        title: 'Bienvenido a K-Tech',
        description: 'Tu aplicación de apoyo y conexión con tu zapatilla inteligente. Diseñada especialmente con accesibilidad avanzada para una experiencia óptima.',
        instructions: 'Usa los botones de voz para escuchar cualquier texto. Puedes escribir tu propio texto en el área de texto y escucharlo presionando el botón correspondiente.'
    },
    buttons: {
        tts: 'Botón de lectura en voz alta activado',
        start: 'Comenzando la aplicación K-Tech',
        customText: 'Leyendo tu texto personalizado'
    },
    errors: {
        ttsNotSupported: 'Lo siento, tu navegador no soporta la función de texto a voz.',
        ttsError: 'Ha ocurrido un error al intentar leer el texto.',
        emptyText: 'No hay texto para leer. Por favor escribe algo en el área de texto.'
    },
    success: {
        ttsStarted: 'Iniciando lectura en voz alta',
        ttsStopped: 'Lectura detenida',
        ttsCompleted: 'Lectura completada'
    }
};

// Selectores de elementos DOM
const DOM_SELECTORS = {
    welcome: {
        screen: '.welcome-screen',
        title: '#welcome-title',
        ttsButton: '#tts-welcome',
        customText: '#custom-text',
        customTtsButton: '#tts-custom',
        startButton: '#start-button'
    },
    accessibility: {
        ttsButtons: '.tts-button',
        customTextInput: '.custom-text-input',
        srMessage: '.sr-message'
    }
};

// Clases CSS para estados
const CSS_CLASSES = {
    states: {
        speaking: 'speaking',
        error: 'error',
        loading: 'loading',
        active: 'active',
        hidden: 'hidden'
    },
    accessibility: {
        srOnly: 'sr-only',
        keyboardUser: 'keyboard-user'
    }
};

// Configuración de eventos
const EVENTS = {
    tts: {
        start: 'tts-start',
        end: 'tts-end',
        error: 'tts-error',
        pause: 'tts-pause',
        resume: 'tts-resume'
    },
    app: {
        ready: 'app-ready',
        navigate: 'app-navigate'
    }
};

// Configuración de localStorage
const STORAGE_KEYS = {
    user: {
        preferences: 'ktech-user-preferences',
        profile: 'ktech-user-profile'
    },
    app: {
        settings: 'ktech-app-settings',
        lastVisit: 'ktech-last-visit'
    }
};

// Configuración de timeouts y delays
const TIMING = {
    tts: {
        pauseBetweenSentences: 300,
        errorDisplayDuration: 3000,
        successDisplayDuration: 2000
    },
    animations: {
        fadeIn: 300,
        fadeOut: 200,
        slideUp: 400
    },
    interactions: {
        debounceDelay: 300,
        doubleClickThreshold: 300
    }
};

// Configuración de URLs y rutas
const ROUTES = {
    welcome: 'index.html',
    register: 'register.html',
    // Se añadirán más rutas según se desarrollen las pantallas
};

// Configuración de validación
const VALIDATION = {
    text: {
        minLength: 1,
        maxLength: 1000
    },
    user: {
        nameMinLength: 2,
        nameMaxLength: 50,
        ageMin: 1,
        ageMax: 120
    }
};

// Export para uso en otros módulos (si se usa ES6 modules en el futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_CONFIG,
        TTS_CONFIG,
        ACCESSIBILITY_MESSAGES,
        DOM_SELECTORS,
        CSS_CLASSES,
        EVENTS,
        STORAGE_KEYS,
        TIMING,
        ROUTES,
        VALIDATION
    };
} 