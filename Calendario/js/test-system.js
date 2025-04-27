// Script para testar o sistema completo de calendário interativo
document.addEventListener('DOMContentLoaded', function() {
    // Configuração dos testes
    const testSystem = {
        // Status dos testes
        testStatus: {
            interfaceTests: false,
            bookingLogicTests: false,
            pricingTests: false,
            paymentTests: false,
            calendarIntegrationTests: false,
            responsiveTests: false
        },
        
        // Inicializar testes
        init: function() {
            console.log('Iniciando testes do sistema de marcações');
            
            // Verificar se todos os componentes necessários estão disponíveis
            if (!this.checkComponents()) {
                console.error('Nem todos os componentes necessários estão disponíveis. Os testes não podem ser executados.');
                return;
            }
            
            // Adicionar botão de teste à interface
            this.addTestButton();
            
            // Configurar eventos de teste
            this.setupTestEvents();
        },
        
        // Verificar se todos os componentes necessários estão disponíveis
        checkComponents: function() {
            // Verificar componentes principais
            const components = [
                { name: 'BookingManager', obj: window.bookingManager },
                { name: 'PriceSystem', obj: window.priceSystem },
                { name: 'PaymentSystem', obj: window.paymentSystem },
                { name: 'GoogleCalendarIntegration', obj: window.googleCalendarIntegration }
            ];
            
            let allComponentsAvailable = true;
            
            components.forEach(component => {
                if (!component.obj) {
                    console.error(`Componente ${component.name} não encontrado`);
                    allComponentsAvailable = false;
                }
            });
            
            return allComponentsAvailable;
        },
        
        // Adicionar botão de teste à interface
        addTestButton: function() {
            // Verificar se já existe um botão de teste
            if (document.getElementById('test-button')) {
                return;
            }
            
            // Criar botão de teste
            const testButton = document.createElement('button');
            testButton.id = 'test-button';
            testButton.className = 'btn btn-secondary';
            testButton.style.position = 'fixed';
            testButton.style.bottom = '20px';
            testButton.style.right = '20px';
            testButton.style.zIndex = '1000';
            testButton.style.padding = '10px 15px';
            testButton.style.backgroundColor = '#f39c12';
            testButton.style.color = 'white';
            testButton.style.border = 'none';
            testButton.style.borderRadius = '4px';
            testButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            testButton.style.cursor = 'pointer';
            testButton.innerHTML = '<i class="fas fa-vial"></i> Testar Sistema';
            
            // Adicionar botão ao DOM
            document.body.appendChild(testButton);
            
            // Configurar evento de clique
            testButton.addEventListener('click', () => {
                this.runAllTests();
            });
        },
        
        // Configurar eventos de teste
        setupTestEvents: function() {
            // Adicionar evento para testar responsividade
            window.addEventListener('resize', () => {
                this.testResponsiveness();
            });
        },
        
        // Executar todos os testes
        runAllTests: function() {
            console.log('Executando todos os testes...');
            
            // Mostrar modal de testes
            this.showTestModal();
            
            // Executar testes em sequência
            this.testInterface()
                .then(() => this.testBookingLogic())
                .then(() => this.testPricing())
                .then(() => this.testPayment())
                .then(() => this.testCalendarIntegration())
                .then(() => this.testResponsiveness())
                .then(() => {
                    // Verificar se todos os testes passaram
                    const allTestsPassed = Object.values(this.testStatus).every(status => status === true);
                    
                    // Atualizar status final
                    this.updateTestStatus('all-tests', allTestsPassed);
                    
                    // Mostrar resultado final
                    const resultElement = document.getElementById('test-result');
                    if (resultElement) {
                        if (allTestsPassed) {
                            resultElement.innerHTML = '<div class="test-success"><i class="fas fa-check-circle"></i> Todos os testes passaram com sucesso!</div>';
                        } else {
                            resultElement.innerHTML = '<div class="test-failure"><i class="fas fa-times-circle"></i> Alguns testes falharam. Verifique os detalhes acima.</div>';
                        }
                    }
                });
        },
        
        // Mostrar modal de testes
        showTestModal: function() {
            // Criar e mostrar modal de testes
            const modalHtml = `
                <div id="test-modal" class="modal" style="display: block;">
                    <div class="modal-content" style="max-width: 800px;">
                        <span class="close" onclick="document.getElementById('test-modal').remove()">&times;</span>
                        <h2>Testes do Sistema</h2>
                        <div id="test-progress">
                            <div class="test-item">
                                <span class="test-name">Interface do Usuário</span>
                                <span id="interface-test-status" class="test-status">Pendente</span>
                            </div>
                            <div class="test-item">
                                <span class="test-name">Lógica de Reserva</span>
                                <span id="booking-logic-test-status" class="test-status">Pendente</span>
                            </div>
                            <div class="test-item">
                                <span class="test-name">Sistema de Preços</span>
                                <span id="pricing-test-status" class="test-status">Pendente</span>
                            </div>
                            <div class="test-item">
                                <span class="test-name">Sistema de Pagamento</span>
                                <span id="payment-test-status" class="test-status">Pendente</span>
                            </div>
                            <div class="test-item">
                                <span class="test-name">Integração com Google Calendar</span>
                                <span id="calendar-integration-test-status" class="test-status">Pendente</span>
                            </div>
                            <div class="test-item">
                                <span class="test-name">Responsividade</span>
                                <span id="responsive-test-status" class="test-status">Pendente</span>
                            </div>
                        </div>
                        <div id="test-details"></div>
                        <div id="test-result" style="margin-top: 20px; text-align: center;"></div>
                        <style>
                            .test-item {
                                display: flex;
                                justify-content: space-between;
                                padding: 10px;
                                border-bottom: 1px solid #eee;
                            }
                            .test-status {
                                font-weight: bold;
                            }
                            .test-pending {
                                color: #f39c12;
                            }
                            .test-running {
                                color: #3498db;
                            }
                            .test-success {
                                color: #2ecc71;
                            }
                            .test-failure {
                                color: #e74c3c;
                            }
                            #test-details {
                                margin-top: 20px;
                                max-height: 300px;
                                overflow-y: auto;
                                padding: 10px;
                                background-color: #f9f9f9;
                                border-radius: 4px;
                            }
                        </style>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
        },
        
        // Atualizar status de um teste
        updateTestStatus: function(testName, success, details) {
            // Determinar ID do elemento de status
            let statusId;
            switch(testName) {
                case 'interface':
                    statusId = 'interface-test-status';
                    this.testStatus.interfaceTests = success;
                    break;
                case 'booking-logic':
                    statusId = 'booking-logic-test-status';
                    this.testStatus.bookingLogicTests = success;
                    break;
                case 'pricing':
                    statusId = 'pricing-test-status';
                    this.testStatus.pricingTests = success;
                    break;
                case 'payment':
                    statusId = 'payment-test-status';
                    this.testStatus.paymentTests = success;
                    break;
                case 'calendar-integration':
                    statusId = 'calendar-integration-test-status';
                    this.testStatus.calendarIntegrationTests = success;
                    break;
                case 'responsive':
                    statusId = 'responsive-test-status';
                    this.testStatus.responsiveTests = success;
                    break;
                default:
                    return;
            }
            
            // Atualizar elemento de status
            const statusElement = document.getElementById(statusId);
            if (statusElement) {
                if (success) {
                    statusElement.className = 'test-status test-success';
                    statusElement.textContent = 'Sucesso';
                } else {
                    statusElement.className = 'test-status test-failure';
                    statusElement.textContent = 'Falha';
                }
            }
            
            // Adicionar detalhes, se fornecidos
            if (details) {
                const detailsElement = document.getElementById('test-details');
                if (detailsElement) {
                    const testDetails = document.createElement('div');
                    testDetails.className = success ? 'test-success' : 'test-failure';
                    testDetails.innerHTML = `<h4>${this.getTestTitle(testName)}</h4><p>${details}</p>`;
                    detailsElement.appendChild(testDetails);
                }
            }
        },
        
        // Obter título do teste
        getTestTitle: function(testName) {
            switch(testName) {
                case 'interface':
                    return 'Teste de Interface do Usuário';
                case 'booking-logic':
                    return 'Teste de Lógica de Reserva';
                case 'pricing':
                    return 'Teste de Sistema de Preços';
                case 'payment':
                    return 'Teste de Sistema de Pagamento';
                case 'calendar-integration':
                    return 'Teste de Integração com Google Calendar';
                case 'responsive':
                    return 'Teste de Responsividade';
                default:
                    return 'Teste Desconhecido';
            }
        },
        
        // Testar interface do usuário
        testInterface: function() {
            return new Promise((resolve) => {
                console.log('Testando interface do usuário...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('interface-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar elementos essenciais da interface
                const essentialElements = [
                    { id: 'calendar', name: 'Calendário' },
                    { id: 'session-type', name: 'Seletor de Tipo de Sessão' },
                    { id: 'session-duration', name: 'Seletor de Duração' },
                    { id: 'session-quantity', name: 'Seletor de Quantidade' },
                    { id: 'booking-form', name: 'Formulário de Reserva' },
                    { id: 'user-form', name: 'Formulário de Dados do Usuário' }
                ];
                
                const missingElements = essentialElements.filter(element => !document.getElementById(element.id));
                
                // Verificar resultado
                if (missingElements.length === 0) {
                    // Todos os elementos estão presentes
                    this.updateTestStatus('interface', true, 'Todos os elementos essenciais da interface estão presentes.');
                } else {
                    // Alguns elementos estão faltando
                    const missingNames = missingElements.map(element => element.name).join(', ');
                    this.updateTestStatus('interface', false, `Elementos faltando: ${missingNames}`);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        },
        
        // Testar lógica de reserva
        testBookingLogic: function() {
            return new Promise((resolve) => {
                console.log('Testando lógica de reserva...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('booking-logic-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar se o BookingManager está disponível
                if (!window.bookingManager) {
                    this.updateTestStatus('booking-logic', false, 'BookingManager não encontrado.');
                    setTimeout(resolve, 1000);
                    return;
                }
                
                // Testar verificação de disponibilidade
                const now = new Date();
                const futureDate = new Date();
                futureDate.setDate(now.getDate() + 7); // 7 dias no futuro
                
                // Ajustar para horário de funcionamento
                if (futureDate.getDay() >= 1 && futureDate.getDay() <= 5) {
                    // Dias de semana: 18:30
                    futureDate.setHours(18, 30, 0, 0);
                } else {
                    // Sábado: 09:30
                    futureDate.setHours(9, 30, 0, 0);
                }
                
                // Verificar disponibilidade para sessão remota
                const remoteAvailability = window.bookingManager.checkAvailability(futureDate, 30, 'remote');
                
                // Verificar disponibilidade para sessão presencial
                const presentialAvailability = window.bookingManager.checkAvailability(futureDate, 60, 'presential');
                
                // Verificar resultado
                if (remoteAvailability.available && presentialAvailability.available) {
                    // Ambas as verificações passaram
                    this.updateTestStatus('booking-logic', true, 'Verificação de disponibilidade funcionando corretamente para sessões remotas e presenciais.');
                } else {
                    // Alguma verificação falhou
                    let errorMessage = 'Problemas na verificação de disponibilidade: ';
                    
                    if (!remoteAvailability.available) {
                        errorMessage += `Sessão remota: ${remoteAvailability.reason}. `;
                    }
                    
                    if (!presentialAvailability.available) {
                        errorMessage += `Sessão presencial: ${presentialAvailability.reason}. `;
                    }
                    
                    this.updateTestStatus('booking-logic', false, errorMessage);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        },
        
        // Testar sistema de preços
        testPricing: function() {
            return new Promise((resolve) => {
                console.log('Testando sistema de preços...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('pricing-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar se o PriceSystem está disponível
                if (!window.priceSystem) {
                    this.updateTestStatus('pricing', false, 'PriceSystem não encontrado.');
                    setTimeout(resolve, 1000);
                    return;
                }
                
                // Testar cálculo de preços para diferentes cenários
                const testCases = [
                    { duration: 15, quantity: 1, type: 'remote', expectedBase: 10 },
                    { duration: 30, quantity: 1, type: 'remote', expectedBase: 20 },
                    { duration: 45, quantity: 1, type: 'remote', expectedBase: 30 },
                    { duration: 60, quantity: 1, type: 'remote', expectedBase: 40 },
                    { duration: 30, quantity: 2, type: 'remote', expectedDiscount: 2.5 * 2 },
                    { duration: 45, quantity: 2, type: 'remote', expectedDiscount: 5 * 2 },
                    { duration: 60, quantity: 2, type: 'remote', expectedDiscount: 7.5 * 2 },
                    { duration: 60, quantity: 1, type: 'presential', expectedBase: 40 }
                ];
                
                // Executar testes
                const results = testCases.map(testCase => {
                    const priceDetails = window.priceSystem.calculatePrice(
                        testCase.duration,
                        testCase.quantity,
                        testCase.type
                    );
                    
                    // Verificar preço base
                    const baseCorrect = Math.abs(priceDetails.basePrice - testCase.expectedBase) < 0.01;
                    
                    // Verificar desconto, se aplicável
                    let discountCorrect = true;
                    if (testCase.expectedDiscount) {
                        discountCorrect = Math.abs(priceDetails.quantityDiscount - testCase.expectedDiscount) < 0.01;
                    }
                    
                    return {
                        testCase,
                        priceDetails,
                        baseCorrect,
                        discountCorrect,
                        success: baseCorrect && discountCorrect
                    };
                });
                
                // Verificar resultado
                const allTestsPassed = results.every(result => result.success);
                
                if (allTestsPassed) {
                    // Todos os testes passaram
                    this.updateTestStatus('pricing', true, 'Cálculo de preços funcionando corretamente para todos os cenários testados.');
                } else {
                    // Alguns testes falharam
                    const failedTests = results.filter(result => !result.success);
                    const errorMessages = failedTests.map(result => {
                        return `Falha no teste: duração=${result.testCase.duration}, quantidade=${result.testCase.quantity}, tipo=${result.testCase.type}`;
                    }).join('. ');
                    
                    this.updateTestStatus('pricing', false, `Problemas no cálculo de preços: ${errorMessages}`);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        },
        
        // Testar sistema de pagamento
        testPayment: function() {
            return new Promise((resolve) => {
                console.log('Testando sistema de pagamento...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('payment-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar se o PaymentSystem está disponível
                if (!window.paymentSystem) {
                    this.updateTestStatus('payment', false, 'PaymentSystem não encontrado.');
                    setTimeout(resolve, 1000);
                    return;
                }
                
                // Verificar métodos essenciais do sistema de pagamento
                const essentialMethods = [
                    'processPayment',
                    'handlePaymentResult',
                    'saveBooking',
                    'showSuccessMessage'
                ];
                
                const missingMethods = essentialMethods.filter(method => typeof window.paymentSystem[method] !== 'function');
                
                // Verificar resultado
                if (missingMethods.length === 0) {
                    // Todos os métodos estão presentes
                    this.updateTestStatus('payment', true, 'Sistema de pagamento implementado corretamente com todos os métodos necessários.');
                } else {
                    // Alguns métodos estão faltando
                    const missingNames = missingMethods.join(', ');
                    this.updateTestStatus('payment', false, `Métodos faltando no sistema de pagamento: ${missingNames}`);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        },
        
        // Testar integração com Google Calendar
        testCalendarIntegration: function() {
            return new Promise((resolve) => {
                console.log('Testando integração com Google Calendar...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('calendar-integration-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar se o GoogleCalendarIntegration está disponível
                if (!window.googleCalendarIntegration) {
                    this.updateTestStatus('calendar-integration', false, 'GoogleCalendarIntegration não encontrado.');
                    setTimeout(resolve, 1000);
                    return;
                }
                
                // Verificar métodos essenciais da integração com Google Calendar
                const essentialMethods = [
                    'authenticate',
                    'addEvent',
                    'syncBooking',
                    'getEvents'
                ];
                
                const missingMethods = essentialMethods.filter(method => typeof window.googleCalendarIntegration[method] !== 'function');
                
                // Verificar resultado
                if (missingMethods.length === 0) {
                    // Todos os métodos estão presentes
                    this.updateTestStatus('calendar-integration', true, 'Integração com Google Calendar implementada corretamente com todos os métodos necessários.');
                } else {
                    // Alguns métodos estão faltando
                    const missingNames = missingMethods.join(', ');
                    this.updateTestStatus('calendar-integration', false, `Métodos faltando na integração com Google Calendar: ${missingNames}`);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        },
        
        // Testar responsividade
        testResponsiveness: function() {
            return new Promise((resolve) => {
                console.log('Testando responsividade...');
                
                // Atualizar status para "em execução"
                const statusElement = document.getElementById('responsive-test-status');
                if (statusElement) {
                    statusElement.className = 'test-status test-running';
                    statusElement.textContent = 'Testando...';
                }
                
                // Verificar se o CSS tem media queries para responsividade
                const styleSheets = document.styleSheets;
                let hasMediaQueries = false;
                
                for (let i = 0; i < styleSheets.length; i++) {
                    try {
                        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                        
                        for (let j = 0; j < rules.length; j++) {
                            if (rules[j].type === CSSRule.MEDIA_RULE) {
                                hasMediaQueries = true;
                                break;
                            }
                        }
                        
                        if (hasMediaQueries) {
                            break;
                        }
                    } catch (e) {
                        // Erro ao acessar regras CSS (provavelmente devido a CORS)
                        console.warn('Não foi possível acessar regras CSS:', e);
                    }
                }
                
                // Verificar se elementos principais têm estilos responsivos
                const viewportWidth = window.innerWidth;
                const isMobile = viewportWidth < 768;
                
                // Verificar se o calendário se adapta ao tamanho da tela
                const calendar = document.getElementById('calendar');
                let calendarResponsive = false;
                
                if (calendar) {
                    const calendarWidth = calendar.offsetWidth;
                    calendarResponsive = calendarWidth <= viewportWidth;
                }
                
                // Verificar se o formulário de reserva se adapta ao tamanho da tela
                const bookingForm = document.getElementById('booking-form');
                let formResponsive = false;
                
                if (bookingForm) {
                    const formWidth = bookingForm.offsetWidth;
                    formResponsive = formWidth <= viewportWidth;
                }
                
                // Verificar resultado
                if (hasMediaQueries && calendarResponsive && formResponsive) {
                    // Todos os testes passaram
                    this.updateTestStatus('responsive', true, 'A interface é responsiva e se adapta a diferentes tamanhos de tela.');
                } else {
                    // Alguns testes falharam
                    let errorMessage = 'Problemas de responsividade: ';
                    
                    if (!hasMediaQueries) {
                        errorMessage += 'Não foram encontradas media queries no CSS. ';
                    }
                    
                    if (!calendarResponsive) {
                        errorMessage += 'O calendário não se adapta corretamente ao tamanho da tela. ';
                    }
                    
                    if (!formResponsive) {
                        errorMessage += 'O formulário de reserva não se adapta corretamente ao tamanho da tela. ';
                    }
                    
                    this.updateTestStatus('responsive', false, errorMessage);
                }
                
                // Resolver promessa após um pequeno atraso
                setTimeout(resolve, 1000);
            });
        }
    };
    
    // Inicializar sistema de testes
    testSystem.init();
    
    // Expor sistema de testes globalmente
    window.testSystem = testSystem;
});
