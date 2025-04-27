document.addEventListener('DOMContentLoaded', function() {
    // Integração com sistema de pagamento
    setupPaymentSystem();
    
    // Configuração dos métodos de pagamento
    setupPaymentMethods();
});

function setupPaymentSystem() {
    // Configuração do Revolut
    function setupRevolutPayment() {
        return {
            initialize: function(amount, currency, description) {
                console.log(`Inicializando pagamento Revolut: ${amount} ${currency} - ${description}`);
                return {
                    paymentId: 'rev_' + Math.random().toString(36).substr(2, 9),
                    checkoutUrl: 'https://pay.revolut.com/checkout/dummy'
                };
            },
            processPayment: function(paymentId) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            success: true,
                            transactionId: 'trans_' + Math.random().toString(36).substr(2, 9)
                        });
                    }, 1500);
                });
            }
        };
    }
    
    // Configuração do PayPal
    function setupPayPalPayment() {
        return {
            initialize: function(amount, currency, description) {
                console.log(`Inicializando pagamento PayPal: ${amount} ${currency} - ${description}`);
                return {
                    paymentId: 'pp_' + Math.random().toString(36).substr(2, 9),
                    checkoutUrl: 'https://www.paypal.com/checkoutnow/dummy'
                };
            },
            processPayment: function(paymentId) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            success: true,
                            transactionId: 'trans_' + Math.random().toString(36).substr(2, 9)
                        });
                    }, 1500);
                });
            }
        };
    }
    
    // Configuração do processamento de cartão de crédito
    function setupCreditCardPayment() {
        return {
            initialize: function(amount, currency, description) {
                console.log(`Inicializando pagamento com Cartão: ${amount} ${currency} - ${description}`);
                return {
                    paymentId: 'cc_' + Math.random().toString(36).substr(2, 9)
                };
            },
            processPayment: function(paymentId, cardDetails) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            success: true,
                            transactionId: 'trans_' + Math.random().toString(36).substr(2, 9)
                        });
                    }, 1500);
                });
            }
        };
    }
    
    // Expor os métodos de pagamento globalmente
    window.paymentProviders = {
        revolut: setupRevolutPayment(),
        paypal: setupPayPalPayment(),
        creditCard: setupCreditCardPayment()
    };
}

function setupPaymentMethods() {
    // Seleção de método de pagamento
    const paymentMethods = document.querySelectorAll('.payment-method');
    let selectedPaymentMethod = null;
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover seleção anterior
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Adicionar seleção ao método clicado
            this.classList.add('selected');
            selectedPaymentMethod = this.getAttribute('data-method');
        });
    });
    
    // Botão de confirmar marcação e pagamento
    document.getElementById('confirm-booking').addEventListener('click', function() {
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
        if (!selectedPaymentMethod) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }
        
        // Obter detalhes da reserva
        const sessionType = document.getElementById('session-type').value;
        const sessionDuration = parseInt(document.getElementById('session-duration').value);
        const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
        const finalPrice = parseFloat(document.getElementById('final-price').textContent.replace('€', ''));
        
        // Criar descrição da reserva
        const bookingDescription = `${sessionQuantity} sessão(ões) de ${sessionDuration} minutos - ${sessionType === 'remote' ? 'Remota' : 'Presencial'}`;
        
        // Processar pagamento com base no método selecionado
        processPayment(selectedPaymentMethod, finalPrice, bookingDescription, {
            name: userName,
            email: userEmail,
            phone: userPhone
        });
    });
}

function processPayment(method, amount, description, userDetails) {
    // Mostrar indicador de carregamento
    showLoadingIndicator('Processando pagamento...');
    
    let paymentProvider;
    
    switch(method) {
        case 'revolut':
            paymentProvider = window.paymentProviders.revolut;
            break;
        case 'paypal':
            paymentProvider = window.paymentProviders.paypal;
            break;
        case 'credit-card':
            paymentProvider = window.paymentProviders.creditCard;
            break;
        default:
            hideLoadingIndicator();
            alert('Método de pagamento não suportado.');
            return;
    }
    
    // Inicializar pagamento
    const paymentInit = paymentProvider.initialize(amount, 'EUR', description);
    
    if (method === 'credit-card') {
        // Para cartão de crédito, mostrar formulário de cartão
        showCreditCardForm(paymentInit.paymentId, userDetails);
    } else {
        // Para outros métodos, redirecionar para a página de checkout
        simulateRedirect(paymentInit.checkoutUrl, method);
        
        // Simular processamento e retorno
        setTimeout(() => {
            const result = {
                success: true,
                transactionId: 'trans_' + Math.random().toString(36).substr(2, 9)
            };
            
            handlePaymentResult(result, description, userDetails);
        }, 3000);
    }
}

function showCreditCardForm(paymentId, userDetails) {
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
                    <div class="form-row">
                        <div class="form-group" style="flex: 1; margin-right: 10px;">
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
    document.getElementById('cc-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular processamento do cartão
        document.getElementById('cc-modal').remove();
        showLoadingIndicator('Processando pagamento...');
        
        setTimeout(() => {
            const result = {
                success: true,
                transactionId: 'cc_' + Math.random().toString(36).substr(2, 9)
            };
            
            handlePaymentResult(result, 'Pagamento com Cartão', userDetails);
        }, 2000);
    });
}

function simulateRedirect(url, method) {
    // Criar e mostrar modal de redirecionamento
    const modalHtml = `
        <div id="redirect-modal" class="modal" style="display: block;">
            <div class="modal-content" style="text-align: center;">
                <h2>Redirecionando para ${method === 'revolut' ? 'Revolut' : 'PayPal'}</h2>
                <p>Você será redirecionado para a página de pagamento em instantes...</p>
                <div class="loader" style="margin: 20px auto; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
                <p>URL: ${url}</p>
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
    }, 3000);
}

function showLoadingIndicator(message) {
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
}

function hideLoadingIndicator() {
    // Remover indicador de carregamento
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.remove();
    }
}

function handlePaymentResult(result, description, userDetails) {
    hideLoadingIndicator();
    
    if (result.success) {
        // Pagamento bem-sucedido
        showSuccessMessage(result.transactionId, description, userDetails);
        
        // Aqui seria implementada a integração com o Gmail Calendar
        syncWithGoogleCalendar(description, userDetails);
    } else {
        // Pagamento falhou
        alert(`Erro no pagamento: ${result.error || 'Ocorreu um erro ao processar o pagamento.'}`);
    }
}

function showSuccessMessage(transactionId, description, userDetails) {
    // Criar e mostrar modal de sucesso
    const modalHtml = `
        <div id="success-modal" class="modal" style="display: block;">
            <div class="modal-content">
                <span class="close" onclick="document.getElementById('success-modal').remove()">&times;</span>
                <h2 style="color: #2ecc71;"><i class="fas fa-check-circle" style="margin-right: 10px;"></i>Pagamento Confirmado!</h2>
                <div style="margin: 20px 0;">
                    <p><strong>ID da Transação:</strong> ${transactionId}</p>
                    <p><strong>Descrição:</strong> ${description}</p>
                    <p><strong>Nome:</strong> ${userDetails.name}</p>
                    <p><strong>Email:</strong> ${userDetails.email}</p>
                </div>
                <p>Um email de confirmação foi enviado para ${userDetails.email} com os detalhes da sua marcação.</p>
                <p>A sua sessão foi adicionada ao calendário e o coach entrará em contato antes da data marcada.</p>
                <button onclick="document.getElementById('success-modal').remove(); window.location.reload();" class="btn btn-primary" style="margin-top: 20px;">Concluir</button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
}

function syncWithGoogleCalendar(description, userDetails) {
    console.log(`Sincronizando com Google Calendar: ${description} para ${userDetails.name} (${userDetails.email})`);
    // Esta função seria implementada com a API do Google Calendar
    // Para fins de demonstração, apenas logamos a intenção
}
