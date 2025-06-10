/**
 * Perfil Screen Controller
 * Maneja la funcionalidad de la pantalla de perfil
 */

class PerfilScreen {
    constructor() {
        this.ttsManager = null;
        this.init();
    }

    /**
     * Inicializa la pantalla de perfil
     */
    init() {
        this.setupTTS();
        this.setupNavigation();
        this.setupSettings();
        this.setupDeviceControls();
        this.setupEmergencyContacts();
        this.setupAccessibility();
        
        console.log('Perfil screen initialized');
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

        // Botón Logros
        const logrosBtn = document.getElementById('logros-btn');
        if (logrosBtn) {
            logrosBtn.addEventListener('click', () => {
                this.navigateTo('logros.html', 'Ir a logros');
            });
        }
    }

    /**
     * Configura las funcionalidades de configuraciones
     */
    setupSettings() {
        // Manejar cambios en toggle switches
        const toggleSwitches = document.querySelectorAll('.toggle-switch input');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', (event) => {
                this.handleToggleChange(event.target);
            });
        });

        // Botón de cambiar foto
        const changePhotoBtn = document.querySelector('.change-photo-btn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => {
                this.handlePhotoChange();
            });
        }

        // Botones de configuración
        const settingButtons = document.querySelectorAll('.setting-button');
        settingButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.handleSettingButtonClick(event.target);
            });
        });
    }

    /**
     * Maneja cambios en los toggle switches
     * @param {HTMLElement} toggle - El toggle que cambió
     */
    handleToggleChange(toggle) {
        const settingItem = toggle.closest('.setting-item');
        const settingLabel = settingItem.querySelector('.setting-label').textContent;
        const isEnabled = toggle.checked;
        
        // Feedback auditivo
        if (this.ttsManager) {
            const status = isEnabled ? 'activado' : 'desactivado';
            this.ttsManager.speak(`${settingLabel} ${status}`);
        }

        // Simular guardado de configuración
        console.log(`Setting changed: ${settingLabel} = ${isEnabled}`);
        
        // Efecto visual de confirmación
        settingItem.style.background = 'rgba(76, 175, 80, 0.2)';
        setTimeout(() => {
            settingItem.style.background = '';
        }, 1000);
    }

    /**
     * Maneja el cambio de foto de perfil
     */
    handlePhotoChange() {
        if (this.ttsManager) {
            this.ttsManager.speak('Función de cambio de foto. Esta funcionalidad se conectaría con la cámara del dispositivo.');
        }

        // Crear modal de selección de foto
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
            max-width: 300px;
            width: 100%;
            text-align: center;
        `;

        modalContent.innerHTML = `
            <h3 style="color: #2196F3; margin-bottom: 15px;">Cambiar Foto de Perfil</h3>
            <p style="margin-bottom: 20px;">Seleccione una opción:</p>
            <button id="take-photo" style="
                background: linear-gradient(135deg, #2196F3, #4CAF50);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 20px;
                margin: 5px;
                cursor: pointer;
            ">📷 Tomar Foto</button>
            <button id="select-photo" style="
                background: linear-gradient(135deg, #2196F3, #4CAF50);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 20px;
                margin: 5px;
                cursor: pointer;
            ">🖼️ Seleccionar</button>
            <br>
            <button id="cancel-photo" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 20px;
                margin-top: 10px;
                cursor: pointer;
            ">Cancelar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('take-photo').addEventListener('click', () => {
            if (this.ttsManager) {
                this.ttsManager.speak('Abriendo cámara para tomar foto');
            }
            document.body.removeChild(modal);
        });

        document.getElementById('select-photo').addEventListener('click', () => {
            if (this.ttsManager) {
                this.ttsManager.speak('Abriendo galería para seleccionar foto');
            }
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-photo').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    /**
     * Maneja clicks en botones de configuración
     * @param {HTMLElement} button - El botón clickeado
     */
    handleSettingButtonClick(button) {
        const settingItem = button.closest('.setting-item');
        const settingLabel = settingItem.querySelector('.setting-label').textContent;
        
        if (settingLabel.includes('Objetivos diarios')) {
            this.showGoalsModal();
        }
    }

    /**
     * Muestra modal para ajustar objetivos
     */
    showGoalsModal() {
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
            max-width: 350px;
            width: 100%;
        `;

        modalContent.innerHTML = `
            <h3 style="color: #2196F3; margin-bottom: 15px; text-align: center;">Ajustar Objetivos Diarios</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Meta de pasos:</label>
                <input type="range" id="steps-goal" min="1000" max="10000" step="500" value="5000" style="width: 100%;">
                <div style="text-align: center; margin-top: 5px;">
                    <span id="steps-value">5,000</span> pasos
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Tiempo activo (minutos):</label>
                <input type="range" id="time-goal" min="15" max="60" step="5" value="30" style="width: 100%;">
                <div style="text-align: center; margin-top: 5px;">
                    <span id="time-value">30</span> minutos
                </div>
            </div>
            <div style="text-align: center;">
                <button id="save-goals" style="
                    background: linear-gradient(135deg, #2196F3, #4CAF50);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    margin-right: 10px;
                    cursor: pointer;
                ">Guardar</button>
                <button id="cancel-goals" style="
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                ">Cancelar</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Actualizar valores en tiempo real
        const stepsSlider = document.getElementById('steps-goal');
        const timeSlider = document.getElementById('time-goal');
        const stepsValue = document.getElementById('steps-value');
        const timeValue = document.getElementById('time-value');

        stepsSlider.addEventListener('input', () => {
            stepsValue.textContent = Number(stepsSlider.value).toLocaleString();
        });

        timeSlider.addEventListener('input', () => {
            timeValue.textContent = timeSlider.value;
        });

        // Event listeners
        document.getElementById('save-goals').addEventListener('click', () => {
            if (this.ttsManager) {
                this.ttsManager.speak(`Objetivos guardados: ${stepsValue.textContent} pasos y ${timeValue.textContent} minutos diarios`);
            }
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-goals').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    /**
     * Configura controles del dispositivo
     */
    setupDeviceControls() {
        const syncButton = document.querySelector('.sync-button');
        if (syncButton) {
            syncButton.addEventListener('click', () => {
                this.handleDeviceSync();
            });
        }
    }

    /**
     * Maneja la sincronización del dispositivo
     */
    handleDeviceSync() {
        if (this.ttsManager) {
            this.ttsManager.speak('Sincronizando con zapatilla K-Tech');
        }

        // Simular proceso de sincronización
        const syncButton = document.querySelector('.sync-button');
        const originalText = syncButton.textContent;
        
        syncButton.textContent = 'Sincronizando...';
        syncButton.disabled = true;
        syncButton.style.opacity = '0.6';

        setTimeout(() => {
            syncButton.textContent = originalText;
            syncButton.disabled = false;
            syncButton.style.opacity = '1';
            
            if (this.ttsManager) {
                this.ttsManager.speak('Sincronización completada exitosamente');
            }

            // Actualizar timestamp
            const syncStat = document.querySelector('.device-stat:last-child');
            if (syncStat) {
                syncStat.textContent = '🔄 Última sincronización: Hace unos segundos';
            }
        }, 2000);
    }

    /**
     * Configura funcionalidad de contactos de emergencia
     */
    setupEmergencyContacts() {
        const callButtons = document.querySelectorAll('.call-button');
        callButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                this.handleEmergencyCall(event.target);
            });
        });
    }

    /**
     * Maneja llamadas de emergencia
     * @param {HTMLElement} button - Botón de llamada clickeado
     */
    handleEmergencyCall(button) {
        const contactCard = button.closest('.contact-card');
        const contactName = contactCard.querySelector('h4').textContent;
        const contactPhone = contactCard.querySelector('.contact-phone').textContent;
        
        if (this.ttsManager) {
            this.ttsManager.speak(`Llamando a ${contactName}`);
        }

        // Simular llamada
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 300px;
            width: 100%;
        `;

        modalContent.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 15px;">📞</div>
            <h3 style="color: #2196F3; margin-bottom: 10px;">Llamando...</h3>
            <p style="margin-bottom: 5px; font-weight: 500;">${contactName}</p>
            <p style="margin-bottom: 20px; color: #666;">${contactPhone}</p>
            <button id="end-call" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
            ">Colgar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        document.getElementById('end-call').addEventListener('click', () => {
            document.body.removeChild(modal);
            if (this.ttsManager) {
                this.ttsManager.speak('Llamada terminada');
            }
        });
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
                        this.ttsManager.speak('Página de perfil. Gestione su información personal, configuraciones y contactos de emergencia.');
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
        const focusableElements = document.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
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
        
        // Título
        content.push('Mi perfil. Gestiona tu información personal y configuraciones.');
        
        // Información personal
        const personalDetails = document.querySelectorAll('.detail-item');
        personalDetails.forEach(item => {
            const label = item.querySelector('.detail-label');
            const value = item.querySelector('.detail-value');
            if (label && value) {
                content.push(`${label.textContent} ${value.textContent}`);
            }
        });
        
        // Configuraciones
        content.push('Configuraciones disponibles incluyen recordatorios de voz, notificaciones, objetivos diarios y modo nocturno.');
        
        // Dispositivo
        content.push('Su zapatilla K-Tech Smart Walker Pro está conectada con 87% de batería.');
        
        // Contactos de emergencia
        content.push('Contactos de emergencia configurados para asistencia médica y familiar.');
        
        return content.join('. ');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.perfilScreen = new PerfilScreen();
}); 