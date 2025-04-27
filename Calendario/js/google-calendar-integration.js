// Integração com Google Calendar para o sistema de marcações
document.addEventListener('DOMContentLoaded', function() {
    // Configuração da integração com Google Calendar
    const googleCalendarIntegration = {
        // Configurações da API
        apiConfig: {
            clientId: 'your-client-id.apps.googleusercontent.com', // Substituir pelo Client ID real
            apiKey: 'your-api-key', // Substituir pela API Key real
            calendarId: 'share2inspire@gmail.com',
            scopes: 'https://www.googleapis.com/auth/calendar'
        },
        
        // Estado da autenticação
        authState: {
            isAuthenticated: false,
            tokenExpiry: null
        },
        
        // Inicializar integração
        init: function() {
            console.log('Inicializando integração com Google Calendar');
            
            // Em um ambiente real, carregaríamos a biblioteca do Google API Client
            // Para fins de demonstração, simulamos a funcionalidade
            
            // Verificar se já existe token salvo
            this.checkSavedAuth();
            
            // Configurar botão de autenticação, se existir
            const authButton = document.getElementById('google-auth-button');
            if (authButton) {
                authButton.addEventListener('click', () => this.authenticate());
            }
        },
        
        // Verificar se já existe autenticação salva
        checkSavedAuth: function() {
            const savedToken = localStorage.getItem('google_auth_token');
            const savedExpiry = localStorage.getItem('google_auth_expiry');
            
            if (savedToken && savedExpiry) {
                const expiryDate = new Date(savedExpiry);
                
                if (expiryDate > new Date()) {
                    // Token ainda válido
                    this.authState.isAuthenticated = true;
                    this.authState.tokenExpiry = expiryDate;
                    console.log('Token de autenticação do Google válido encontrado');
                    return true;
                }
            }
            
            console.log('Nenhum token de autenticação válido encontrado');
            return false;
        },
        
        // Autenticar com Google
        authenticate: function() {
            console.log('Iniciando processo de autenticação com Google');
            
            // Em um ambiente real, isso abriria o fluxo de autenticação OAuth
            // Para fins de demonstração, simulamos o processo
            
            this.showAuthSimulation();
        },
        
        // Simular processo de autenticação
        showAuthSimulation: function() {
            // Criar e mostrar modal de simulação de autenticação
            const modalHtml = `
                <div id="auth-modal" class="modal" style="display: block;">
                    <div class="modal-content" style="max-width: 500px;">
                        <span class="close" onclick="document.getElementById('auth-modal').remove()">&times;</span>
                        <h2>Autenticação Google</h2>
                        <div style="text-align: center; margin: 20px 0;">
                            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google Logo" style="width: 150px;">
                            <p style="margin-top: 20px;">Escolha a conta para acessar o Google Calendar:</p>
                            <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" onclick="document.getElementById('auth-loading').style.display = 'block'; setTimeout(() => { document.getElementById('auth-modal').remove(); window.googleCalendarIntegration.handleAuthSuccess(); }, 2000);">
                                <div style="display: flex; align-items: center;">
                                    <div style="width: 40px; height: 40px; background-color: #4285F4; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; margin-right: 15px;">S</div>
                                    <div style="text-align: left;">
                                        <div>share2inspire@gmail.com</div>
                                        <div style="font-size: 0.8em; color: #666;">Conta Google</div>
                                    </div>
                                </div>
                            </div>
                            <div id="auth-loading" style="display: none; margin-top: 20px;">
                                <div class="loader" style="margin: 0 auto 10px; border: 4px solid #f3f3f3; border-top: 4px solid #4285F4; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite;"></div>
                                <p>Autenticando...</p>
                            </div>
                            <style>
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            </style>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
        },
        
        // Tratar sucesso de autenticação
        handleAuthSuccess: function() {
            console.log('Autenticação com Google bem-sucedida');
            
            // Simular token e expiração
            const token = 'simulated_' + Math.random().toString(36).substr(2);
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 1); // Token válido por 1 hora
            
            // Salvar estado de autenticação
            this.authState.isAuthenticated = true;
            this.authState.tokenExpiry = expiry;
            
            // Salvar no localStorage
            localStorage.setItem('google_auth_token', token);
            localStorage.setItem('google_auth_expiry', expiry.toISOString());
            
            // Mostrar mensagem de sucesso
            this.showSuccessMessage();
            
            // Atualizar UI, se necessário
            this.updateAuthUI();
        },
        
        // Mostrar mensagem de sucesso de autenticação
        showSuccessMessage: function() {
            alert('Autenticação com Google Calendar concluída com sucesso! Agora as marcações serão sincronizadas automaticamente.');
        },
        
        // Atualizar UI com base no estado de autenticação
        updateAuthUI: function() {
            const authButton = document.getElementById('google-auth-button');
            const authStatus = document.getElementById('google-auth-status');
            
            if (authButton) {
                if (this.authState.isAuthenticated) {
                    authButton.textContent = 'Reconectar Google Calendar';
                    authButton.classList.add('authenticated');
                } else {
                    authButton.textContent = 'Conectar Google Calendar';
                    authButton.classList.remove('authenticated');
                }
            }
            
            if (authStatus) {
                if (this.authState.isAuthenticated) {
                    const expiryTime = this.authState.tokenExpiry.toLocaleTimeString();
                    authStatus.innerHTML = `<span class="status-connected"><i class="fas fa-check-circle"></i> Conectado até ${expiryTime}</span>`;
                } else {
                    authStatus.innerHTML = `<span class="status-disconnected"><i class="fas fa-times-circle"></i> Não conectado</span>`;
                }
            }
        },
        
        // Adicionar evento ao Google Calendar
        addEvent: function(booking) {
            console.log('Adicionando evento ao Google Calendar:', booking);
            
            // Verificar autenticação
            if (!this.authState.isAuthenticated) {
                console.log('Não autenticado. Iniciando autenticação...');
                this.authenticate();
                return false;
            }
            
            // Em um ambiente real, isso faria uma chamada à API do Google Calendar
            // Para fins de demonstração, simulamos o processo
            
            // Criar evento no formato do Google Calendar
            const event = this.createCalendarEvent(booking);
            
            // Simular adição do evento
            setTimeout(() => {
                console.log('Evento adicionado ao Google Calendar:', event);
                
                // Salvar ID do evento no booking
                booking.googleEventId = 'event_' + Math.random().toString(36).substr(2);
                
                // Se o sistema de pagamento estiver disponível, atualizar a reserva
                if (window.paymentSystem) {
                    window.paymentSystem.updateBooking(booking);
                }
                
                // Mostrar notificação de sucesso
                this.showEventAddedNotification(booking);
            }, 1000);
            
            return true;
        },
        
        // Criar evento no formato do Google Calendar
        createCalendarEvent: function(booking) {
            // Determinar título do evento
            const eventTitle = booking.type === 'remote' ? 
                'Sessão Remota - Kickstart Pro Coaching' : 
                'Sessão Presencial - Kickstart Pro Coaching';
            
            // Determinar descrição do evento
            const eventDescription = `
                Sessão de Coaching para ${booking.userName}
                Tipo: ${booking.type === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)'}
                Duração: ${booking.duration} minutos
                Quantidade: ${booking.quantity} sessão(ões)
                ID da Reserva: ${booking.id}
                
                Contato:
                Email: ${booking.userEmail}
                Telefone: ${booking.userPhone}
                
                ${booking.userNotes ? 'Notas: ' + booking.userNotes : ''}
            `;
            
            // Determinar cor do evento
            const eventColor = booking.type === 'remote' ? '1' : '11'; // Azul para remoto, vermelho para presencial
            
            // Criar objeto de evento
            return {
                summary: eventTitle,
                description: eventDescription,
                start: {
                    dateTime: booking.startTime,
                    timeZone: 'Europe/Lisbon'
                },
                end: {
                    dateTime: booking.endTime,
                    timeZone: 'Europe/Lisbon'
                },
                colorId: eventColor,
                reminders: {
                    useDefault: false,
                    overrides: [
                        {method: 'email', minutes: 24 * 60}, // 1 dia antes
                        {method: 'popup', minutes: 60}       // 1 hora antes
                    ]
                }
            };
        },
        
        // Mostrar notificação de evento adicionado
        showEventAddedNotification: function(booking) {
            // Criar e mostrar notificação
            const notificationHtml = `
                <div id="calendar-notification" style="position: fixed; bottom: 20px; right: 20px; background-color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px; animation: slideIn 0.3s ease-out;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <i class="fas fa-calendar-check" style="color: #4285F4; font-size: 20px; margin-right: 10px;"></i>
                        <h4 style="margin: 0; color: #333;">Evento Adicionado</h4>
                    </div>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">A sessão foi adicionada ao Google Calendar com sucesso.</p>
                    <button onclick="document.getElementById('calendar-notification').remove();" style="background: none; border: none; color: #4285F4; cursor: pointer; font-weight: bold; padding: 0; text-align: right; width: 100%;">Fechar</button>
                    <style>
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    </style>
                </div>
            `;
            
            // Adicionar notificação ao DOM
            const notificationContainer = document.createElement('div');
            notificationContainer.innerHTML = notificationHtml;
            document.body.appendChild(notificationContainer.firstElementChild);
            
            // Remover notificação após alguns segundos
            setTimeout(() => {
                const notification = document.getElementById('calendar-notification');
                if (notification) {
                    notification.remove();
                }
            }, 5000);
        },
        
        // Sincronizar reserva com Google Calendar
        syncBooking: function(booking) {
            console.log('Sincronizando reserva com Google Calendar:', booking);
            
            // Verificar se a reserva já tem um evento associado
            if (booking.googleEventId) {
                // Atualizar evento existente
                this.updateEvent(booking);
            } else {
                // Adicionar novo evento
                this.addEvent(booking);
            }
        },
        
        // Atualizar evento existente
        updateEvent: function(booking) {
            console.log('Atualizando evento no Google Calendar:', booking);
            
            // Verificar autenticação
            if (!this.authState.isAuthenticated) {
                console.log('Não autenticado. Iniciando autenticação...');
                this.authenticate();
                return false;
            }
            
            // Em um ambiente real, isso faria uma chamada à API do Google Calendar
            // Para fins de demonstração, simulamos o processo
            
            // Criar evento atualizado
            const event = this.createCalendarEvent(booking);
            
            // Simular atualização do evento
            setTimeout(() => {
                console.log('Evento atualizado no Google Calendar:', event);
                
                // Mostrar notificação de sucesso
                this.showEventUpdatedNotification(booking);
            }, 1000);
            
            return true;
        },
        
        // Mostrar notificação de evento atualizado
        showEventUpdatedNotification: function(booking) {
            // Criar e mostrar notificação
            const notificationHtml = `
                <div id="calendar-notification" style="position: fixed; bottom: 20px; right: 20px; background-color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px; animation: slideIn 0.3s ease-out;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <i class="fas fa-calendar-check" style="color: #4285F4; font-size: 20px; margin-right: 10px;"></i>
                        <h4 style="margin: 0; color: #333;">Evento Atualizado</h4>
                    </div>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">A sessão foi atualizada no Google Calendar com sucesso.</p>
                    <button onclick="document.getElementById('calendar-notification').remove();" style="background: none; border: none; color: #4285F4; cursor: pointer; font-weight: bold; padding: 0; text-align: right; width: 100%;">Fechar</button>
                    <style>
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    </style>
                </div>
            `;
            
            // Adicionar notificação ao DOM
            const notificationContainer = document.createElement('div');
            notificationContainer.innerHTML = notificationHtml;
            document.body.appendChild(notificationContainer.firstElementChild);
            
            // Remover notificação após alguns segundos
            setTimeout(() => {
                const notification = document.getElementById('calendar-notification');
                if (notification) {
                    notification.remove();
                }
            }, 5000);
        },
        
        // Cancelar evento
        cancelEvent: function(booking) {
            console.log('Cancelando evento no Google Calendar:', booking);
            
            // Verificar autenticação
            if (!this.authState.isAuthenticated) {
                console.log('Não autenticado. Iniciando autenticação...');
                this.authenticate();
                return false;
            }
            
            // Verificar se a reserva tem um evento associado
            if (!booking.googleEventId) {
                console.log('Reserva não tem evento associado no Google Calendar');
                return false;
            }
            
            // Em um ambiente real, isso faria uma chamada à API do Google Calendar
            // Para fins de demonstração, simulamos o processo
            
            // Simular cancelamento do evento
            setTimeout(() => {
                console.log('Evento cancelado no Google Calendar:', booking.googleEventId);
                
                // Mostrar notificação de sucesso
                this.showEventCanceledNotification();
            }, 1000);
            
            return true;
        },
        
        // Mostrar notificação de evento cancelado
        showEventCanceledNotification: function() {
            // Criar e mostrar notificação
            const notificationHtml = `
                <div id="calendar-notification" style="position: fixed; bottom: 20px; right: 20px; background-color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px; animation: slideIn 0.3s ease-out;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <i class="fas fa-calendar-times" style="color: #ea4335; font-size: 20px; margin-right: 10px;"></i>
                        <h4 style="margin: 0; color: #333;">Evento Cancelado</h4>
                    </div>
                    <p style="margin: 0 0 10px 0; font-size: 14px;">A sessão foi removida do Google Calendar com sucesso.</p>
                    <button onclick="document.getElementById('calendar-notification').remove();" style="background: none; border: none; color: #4285F4; cursor: pointer; font-weight: bold; padding: 0; text-align: right; width: 100%;">Fechar</button>
                    <style>
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    </style>
                </div>
            `;
            
            // Adicionar notificação ao DOM
            const notificationContainer = document.createElement('div');
            notificationContainer.innerHTML = notificationHtml;
            document.body.appendChild(notificationContainer.firstElementChild);
            
            // Remover notificação após alguns segundos
            setTimeout(() => {
                const notification = document.getElementById('calendar-notification');
                if (notification) {
                    notification.remove();
                }
            }, 5000);
        },
        
        // Obter eventos do Google Calendar
        getEvents: function(startDate, endDate) {
            console.log('Obtendo eventos do Google Calendar:', startDate, endDate);
            
            // Verificar autenticação
            if (!this.authState.isAuthenticated) {
                console.log('Não autenticado. Iniciando autenticação...');
                this.authenticate();
                return false;
            }
            
            // Em um ambiente real, isso faria uma chamada à API do Google Calendar
            // Para fins de demonstração, simulamos o processo
            
            // Simular obtenção de eventos
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Gerar alguns eventos aleatórios para demonstração
                    const events = this.generateRandomEvents(startDate, endDate);
                    console.log('Eventos obtidos do Google Calendar:', events);
                    resolve(events);
                }, 1000);
            });
        },
        
        // Gerar eventos aleatórios para demonstração
        generateRandomEvents: function(startDate, endDate) {
            const events = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            
            // Gerar entre 0 e 5 eventos para o período
            const numEvents = Math.floor(Math.random() * 6);
            
            for (let i = 0; i < numEvents; i++) {
                // Escolher um dia aleatório no período
                const randomDay = Math.floor(Math.random() * days);
                const eventDate = new Date(start);
                eventDate.setDate(eventDate.getDate() + randomDay);
                
                // Escolher um horário aleatório
                const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                let hour, minute;
                
                if (isWeekend) {
                    // Sábado: 09:30 às 16:00 (exceto 12:00-13:00)
                    if (Math.random() < 0.5) {
                        hour = 9 + Math.floor(Math.random() * 3); // 9-11
                    } else {
                        hour = 13 + Math.floor(Math.random() * 3); // 13-15
                    }
                } else {
                    // Dias de semana: 18:30 às 21:30
                    hour = 18 + Math.floor(Math.random() * 3); // 18-20
                }
                
                minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
                
                eventDate.setHours(hour, minute, 0, 0);
                
                // Determinar duração (15, 30, 45 ou 60 minutos)
                const durations = [15, 30, 45, 60];
                const duration = durations[Math.floor(Math.random() * durations.length)];
                
                // Criar data de término
                const endDate = new Date(eventDate);
                endDate.setMinutes(endDate.getMinutes() + duration);
                
                // Determinar tipo (remoto ou presencial)
                const isRemote = Math.random() < 0.7; // 70% de chance de ser remoto
                
                // Criar evento
                events.push({
                    id: 'event_' + Math.random().toString(36).substr(2),
                    summary: isRemote ? 'Sessão Remota - Kickstart Pro Coaching' : 'Sessão Presencial - Kickstart Pro Coaching',
                    start: {
                        dateTime: eventDate.toISOString(),
                        timeZone: 'Europe/Lisbon'
                    },
                    end: {
                        dateTime: endDate.toISOString(),
                        timeZone: 'Europe/Lisbon'
                    },
                    colorId: isRemote ? '1' : '11'
                });
            }
            
            return events;
        }
    };
    
    // Inicializar integração com Google Calendar
    googleCalendarIntegration.init();
    
    // Expor integração globalmente
    window.googleCalendarIntegration = googleCalendarIntegration;
    
    // Adicionar botão de autenticação à interface, se não existir
    const addAuthButton = function() {
        const bookingOptions = document.querySelector('.booking-options');
        if (bookingOptions && !document.getElementById('google-calendar-section')) {
            const calendarSection = document.createElement('div');
            calendarSection.id = 'google-calendar-section';
            calendarSection.className = 'google-calendar-section';
            
            calendarSection.innerHTML = `
                <h4>Integração com Google Calendar</h4>
                <p>Conecte-se ao Google Calendar para sincronizar automaticamente as suas marcações.</p>
                <div class="google-auth-container">
                    <button id="google-auth-button" class="btn btn-secondary">Conectar Google Calendar</button>
                    <div id="google-auth-status" class="auth-status">
                        <span class="status-disconnected"><i class="fas fa-times-circle"></i> Não conectado</span>
                    </div>
                </div>
            `;
            
            // Adicionar estilos para a seção de Google Calendar
            const style = document.createElement('style');
            style.textContent = `
                .google-calendar-section {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    border-left: 4px solid #4285F4;
                }
                .google-calendar-section h4 {
                    margin-bottom: 10px;
                    color: #2c3e50;
                }
                .google-calendar-section p {
                    margin-bottom: 15px;
                    font-size: 0.9em;
                }
                .google-auth-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .auth-status {
                    font-size: 0.9em;
                }
                .status-connected {
                    color: #2ecc71;
                }
                .status-disconnected {
                    color: #e74c3c;
                }
                #google-auth-button.authenticated {
                    background-color: #4285F4;
                    color: white;
                }
            `;
            document.head.appendChild(style);
            
            bookingOptions.appendChild(calendarSection);
            
            // Configurar botão de autenticação
            const authButton = document.getElementById('google-auth-button');
            if (authButton) {
                authButton.addEventListener('click', () => {
                    window.googleCalendarIntegration.authenticate();
                });
            }
            
            // Atualizar UI com base no estado de autenticação
            window.googleCalendarIntegration.updateAuthUI();
        }
    };
    
    // Adicionar seção de Google Calendar após um pequeno atraso
    setTimeout(addAuthButton, 500);
    
    // Integrar com sistema de pagamento, se disponível
    if (window.paymentSystem) {
        // Sobrescrever método de tratamento de resultado de pagamento
        const originalHandlePaymentResult = window.paymentSystem.handlePaymentResult;
        
        window.paymentSystem.handlePaymentResult = function(result, booking) {
            // Chamar método original
            originalHandlePaymentResult.call(window.paymentSystem, result, booking);
            
            // Se pagamento bem-sucedido, sincronizar com Google Calendar
            if (result.success && window.googleCalendarIntegration.authState.isAuthenticated) {
                window.googleCalendarIntegration.syncBooking(booking);
            }
        };
    }
});
