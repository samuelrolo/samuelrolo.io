// Sistema de pagamento para o calendário de marcações
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do sistema de pagamento
    const paymentSystem = {
        // Configurações de API
        apiKeys: {
            revolut: 'sandbox_revolut_api_key',
            paypal: 'sandbox_paypal_api_key',
            stripe: 'sandbox_stripe_api_key'
        },
        
        // URLs de API (sandbox/teste)
        apiUrls: {
            revolut: 'https://sandbox.revolut.com/api/1.0/payments',
            paypal: 'https://api.sandbox.paypal.com/v2/checkout/orders',
            stripe: 'https://api.stripe.com/v1/payment_intents'
        },
        
        // Inicializar sistema de pagamento
        init: function() {
            this.setupPaymentMethodSelection();
            this.setupPaymentConfirmation();
            console.log('Sistema de pagamento inicializado');
        },
        
        // Configurar seleção de método de pagamento
        setupPaymentMethodSelection: function() {
            const paymentMethods = document.querySelectorAll('.payment-method');
            
            paymentMethods.forEach(method => {
                method.addEventListener('click', function() {
                    // Remover seleção anterior
                    paymentMethods.forEach(m => m.classList.remove('selected'));
                    // Adicionar seleção ao método clicado
                    this.classList.add('selected');
                });
            });
        },
        
        // Configurar confirmação de pagamento
        setupPaymentConfirmation: function() {
            const confirmButton = document.getElementById('confirm-booking');
            
            if (confirmButton) {
                confirmButton.addEventListener('click', () => {
                    this.processPaymentFlow();
                });
            }
        },
        
        // Processar fluxo de pagamento
        processPaymentFlow: function() {
            // Verificar termos e condições
            if (!document.getElementById('terms-accept').checked) {
                alert('Por favor, aceite os termos e condições para continuar.');
                return;
            }
            
            // Verificar se todos os campos obrigatórios estão preenchidos
            const userName = document.getElementById('user-name').value;
            const userEmail = document.getElementById('user-email').value;
            const userPhone = document.getElementById('user-phone').value;
            
            if (!userName || !userEmail || !userPhone) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Verificar se um método de pagamento foi selecionado
            const selectedPayment = document.querySelector('.payment-method.selected');
            if (!selectedPayment) {
                alert('Por favor, selecione um método de pagamento.');
                return;
            }
            
            // Obter método de pagamento selecionado
            const paymentMethod = selectedPayment.getAttribute('data-method');
            
            // Obter detalhes da reserva
            const sessionType = document.getElementById('session-type').value;
            const sessionDuration = parseInt(document.getElementById('session-duration').value);
            const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
            const finalPrice = parseFloat(document.getElementById('final-price').textContent.replace('€', ''));
            
            // Criar objeto de reserva
            const booking = {
                type: sessionType,
                duration: sessionDuration,
                quantity: sessionQuantity,
                userName: userName,
                userEmail: userEmail,
                userPhone: userPhone,
                price: finalPrice,
                paymentMethod: paymentMethod
            };
            
            // Processar pagamento com base no método selecionado
            this.processPayment(paymentMethod, booking);
        },
        
        // Processar pagamento
        processPayment: function(method, booking) {
            // Mostrar indicador de carregamento
            this.showLoadingIndicator('Processando pagamento...');
            
            // Selecionar método de pagamento apropriado
            switch(method) {
                case 'revolut':
                    this.processRevolutPayment(booking);
                    break;
                case 'paypal':
                    this.processPayPalPayment(booking);
                    break;
                case 'credit-card':
                    this.processCreditCardPayment(booking);
                    break;
                default:
                    this.hideLoadingIndicator();
                    alert('Método de pagamento não suportado.');
                    break;
            }
        },
        
        // Processar pagamento com Revolut
        processRevolutPayment: function(booking) {
            // Em um ambiente real, isso faria uma chamada à API Revolut
            // Para fins de demonstração, simulamos o processo
            
            console.log('Processando pagamento Revolut:', booking);
            
            // Simular redirecionamento para Revolut
            this.simulateRedirect('revolut', booking);
            
            // Simular processamento e retorno
            setTimeout(() => {
                const result = {
                    success: true,
                    transactionId: 'rev_' + Math.random().toString(36).substr(2, 9),
                    method: 'revolut'
                };
                
                this.handlePaymentResult(result, booking);
            }, 3000);
        },
        
        // Processar pagamento com PayPal
        processPayPalPayment: function(booking) {
            // Em um ambiente real, isso faria uma chamada à API PayPal
            // Para fins de demonstração, simulamos o processo
            
            console.log('Processando pagamento PayPal:', booking);
            
            // Simular redirecionamento para PayPal
            this.simulateRedirect('paypal', booking);
            
            // Simular processamento e retorno
            setTimeout(() => {
                const result = {
                    success: true,
                    transactionId: 'pp_' + Math.random().toString(36).substr(2, 9),
                    method: 'paypal'
                };
                
                this.handlePaymentResult(result, booking);
            }, 3000);
        },
        
        // Processar pagamento com cartão de crédito
        processCreditCardPayment: function(booking) {
            // Em um ambiente real, isso usaria Stripe ou outra API de processamento de cartão
            // Para fins de demonstração, mostramos um formulário de cartão
            
            console.log('Processando pagamento com cartão:', booking);
            
            // Mostrar formulário de cartão de crédito
            this.showCreditCardForm(booking);
        },
        
        // Mostrar formulário de cartão de crédito
        showCreditCardForm: function(booking) {
            // Esconder indicador de carregamento
            this.hideLoadingIndicator();
            
            // Criar e mostrar modal de formulário de cartão
            const modalHtml = `
                <div id="cc-modal" class="modal" style="display: block;">
                    <div class="modal-content" style="max-width: 500px;">
                        <span class="close" onclick="document.getElementById('cc-modal').remove()">&times;</span>
                        <h2>Pagamento com Cartão de Crédito</h2>
                        <form id="cc-form">
                            <div class="form-group">
                                <label for="cc-number">Número do Cartão:</label>
                                <input type="text" id="cc-number" placeholder="1234 5678 9012 3456" required>
                            </div>
                            <div class="form-row" style="display: flex; gap: 10px;">
                                <div class="form-group" style="flex: 1;">
                                    <label for="cc-expiry">Validade (MM/AA):</label>
                                    <input type="text" id="cc-expiry" placeholder="MM/AA" required>
                                </div>
                                <div class="form-group" style="flex: 1;">
                                    <label for="cc-cvc">CVC:</label>
                                    <input type="text" id="cc-cvc" placeholder="123" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="cc-name">Nome no Cartão:</label>
                                <input type="text" id="cc-name" placeholder="NOME COMO APARECE NO CARTÃO" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Pagar</button>
                        </form>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
            
            // Configurar envio do formulário
            const self = this;
            document.getElementById('cc-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simular processamento do cartão
                document.getElementById('cc-modal').remove();
                self.showLoadingIndicator('Processando pagamento...');
                
                setTimeout(() => {
                    const result = {
                        success: true,
                        transactionId: 'cc_' + Math.random().toString(36).substr(2, 9),
                        method: 'credit-card'
                    };
                    
                    self.handlePaymentResult(result, booking);
                }, 2000);
            });
        },
        
        // Simular redirecionamento para gateway de pagamento
        simulateRedirect: function(provider, booking) {
            // Esconder indicador de carregamento
            this.hideLoadingIndicator();
            
            // Determinar nome e URL do provedor
            const providerName = provider === 'revolut' ? 'Revolut' : 'PayPal';
            const providerUrl = provider === 'revolut' ? 
                'https://pay.revolut.com/checkout/dummy' : 
                'https://www.paypal.com/checkoutnow/dummy';
            
            // Criar e mostrar modal de redirecionamento
            const modalHtml = `
                <div id="redirect-modal" class="modal" style="display: block;">
                    <div class="modal-content" style="text-align: center;">
                        <h2>Redirecionando para ${providerName}</h2>
                        <p>Você será redirecionado para a página de pagamento em instantes...</p>
                        <div class="loader" style="margin: 20px auto; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
                        <p>Valor: ${booking.price.toFixed(2)}€</p>
                        <p>URL: ${providerUrl}</p>
                        <style>
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        </style>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
            
            // Remover modal após alguns segundos
            setTimeout(() => {
                document.getElementById('redirect-modal').remove();
                this.showLoadingIndicator('Aguardando confirmação de pagamento...');
            }, 3000);
        },
        
        // Tratar resultado do pagamento
        handlePaymentResult: function(result, booking) {
            // Esconder indicador de carregamento
            this.hideLoadingIndicator();
            
            if (result.success) {
                // Adicionar ID de transação à reserva
                booking.transactionId = result.transactionId;
                booking.paymentDate = new Date().toISOString();
                
                // Salvar reserva no sistema
                this.saveBooking(booking);
                
                // Mostrar mensagem de sucesso
                this.showSuccessMessage(booking);
                
                // Sincronizar com Google Calendar
                this.syncWithGoogleCalendar(booking);
            } else {
                // Mostrar mensagem de erro
                alert(`Erro no pagamento: ${result.error || 'Ocorreu um erro ao processar o pagamento.'}`);
            }
        },
        
        // Salvar reserva no sistema
        saveBooking: function(booking) {
            // Em um ambiente real, isso salvaria no banco de dados
            // Para fins de demonstração, usamos localStorage
            
            // Gerar ID único para a reserva
            booking.id = 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Obter reservas existentes
            let bookings = [];
            const savedBookings = localStorage.getItem('share2inspire_confirmed_bookings');
            
            if (savedBookings) {
                bookings = JSON.parse(savedBookings);
            }
            
            // Adicionar nova reserva
            bookings.push(booking);
            
            // Salvar no localStorage
            localStorage.setItem('share2inspire_confirmed_bookings', JSON.stringify(bookings));
            
            console.log('Reserva salva:', booking);
            
            // Se o BookingManager estiver disponível, adicionar a reserva lá também
            if (window.bookingManager) {
                window.bookingManager.addBooking(booking);
            }
            
            return booking;
        },
        
        // Mostrar mensagem de sucesso
        showSuccessMessage: function(booking) {
            // Formatar data e hora (simulado)
            const formattedDate = new Date().toLocaleDateString('pt-PT', {
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            // Formatar método de pagamento
            let paymentMethodText = '';
            switch(booking.paymentMethod) {
                case 'revolut':
                    paymentMethodText = 'Revolut';
                    break;
                case 'paypal':
                    paymentMethodText = 'PayPal';
                    break;
                case 'credit-card':
                    paymentMethodText = 'Cartão de Crédito';
                    break;
                default:
                    paymentMethodText = booking.paymentMethod;
            }
            
            // Criar e mostrar modal de sucesso
            const modalHtml = `
                <div id="success-modal" class="modal" style="display: block;">
                    <div class="modal-content">
                        <span class="close" onclick="document.getElementById('success-modal').remove()">&times;</span>
                        <h2 style="color: #2ecc71;"><i class="fas fa-check-circle" style="margin-right: 10px;"></i>Pagamento Confirmado!</h2>
                        <div style="margin: 20px 0;">
                            <p><strong>ID da Reserva:</strong> ${booking.id}</p>
                            <p><strong>ID da Transação:</strong> ${booking.transactionId}</p>
                            <p><strong>Método de Pagamento:</strong> ${paymentMethodText}</p>
                            <p><strong>Valor:</strong> ${booking.price.toFixed(2)}€</p>
                            <p><strong>Data do Pagamento:</strong> ${formattedDate}</p>
                        </div>
                        <p>Um email de confirmação foi enviado para ${booking.userEmail} com os detalhes da sua marcação.</p>
                        <p>A sua sessão foi adicionada ao calendário e o coach entrará em contato antes da data marcada.</p>
                        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                            <button onclick="window.location.reload();" class="btn btn-secondary">Nova Marcação</button>
                            <button onclick="document.getElementById('success-modal').remove();" class="btn btn-primary">Concluir</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar modal ao DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
        },
        
        // Sincronizar com Google Calendar
        syncWithGoogleCalendar: function(booking) {
            console.log('Sincronizando com Google Calendar:', booking);
            // Esta função seria implementada com a API do Google Calendar
            // Para fins de demonstração, apenas logamos a intenção
        },
        
        // Mostrar indicador de carregamento
        showLoadingIndicator: function(message) {
            // Remover indicador existente, se houver
            this.hideLoadingIndicator();
            
            // Criar e mostrar indicador de carregamento
            const loaderHtml = `
                <div id="loader-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
                    <div style="background-color: white; padding: 30px; border-radius: 5px; text-align: center;">
                        <div class="loader" style="margin: 0 auto 20px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
                        <p>${message}</p>
                        <style>
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        </style>
                    </div>
                </div>
            `;
            
            // Adicionar loader ao DOM
            const loaderContainer = document.createElement('div');
            loaderContainer.innerHTML = loaderHtml;
            document.body.appendChild(loaderContainer.firstElementChild);
        },
        
        // Esconder indicador de carregamento
        hideLoadingIndicator: function() {
            // Remover indicador de carregamento
            const loader = document.getElementById('loader-overlay');
            if (loader) {
                loader.remove();
            }
        },
        
        // Obter histórico de pagamentos
        getPaymentHistory: function(userEmail) {
            // Em um ambiente real, isso buscaria do banco de dados
            // Para fins de demonstração, usamos localStorage
            
            const savedBookings = localStorage.getItem('share2inspire_confirmed_bookings');
            
            if (!savedBookings) {
                return [];
            }
            
            const bookings = JSON.parse(savedBookings);
            
            // Filtrar por email do usuário, se fornecido
            if (userEmail) {
                return bookings.filter(booking => booking.userEmail === userEmail);
            }
            
            return bookings;
        }
    };
    
    // Inicializar sistema de pagamento
    paymentSystem.init();
    
    // Expor sistema de pagamento globalmente
    window.paymentSystem = paymentSystem;
});
