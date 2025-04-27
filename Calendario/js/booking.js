document.addEventListener('DOMContentLoaded', function() {
    // Integração com sistema de pagamento
    setupPaymentSystem();
    
    // Configuração dos métodos de pagamento
    setupPaymentMethods();
    
    // Configuração do botão de agendamento na página principal
    setupBookingButton();
});

function setupBookingButton() {
    // Adicionar evento de clique para o botão de agendamento na página principal
    const bookingButtons = document.querySelectorAll('a[href="#agendar"]');
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirecionar para a página de agendamento
            window.location.href = '/Calendario/';
        });
    });
}

function setupPaymentSystem() {
    // Configuração do Apple Pay
    function setupApplePayPayment() {
        return {
            initialize: function(amount, currency, description) {
                console.log(`Inicializando pagamento Apple Pay: ${amount} ${currency} - ${description}`);
                return {
                    paymentId: 'ap_' + Math.random().toString(36).substr(2, 9),
                    checkoutUrl: 'https://apple.com/apple-pay/checkout/dummy'
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
        applePay: setupApplePayPayment(),
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
            paymentMethods.forEach(m => {
                m.classList.remove('selected');
                m.style.backgroundColor = '';
                m.style.borderColor = '';
            });
            // Adicionar seleção ao método clicado
            this.classList.add('selected');
            selectedPaymentMethod = this.getAttribute('data-method');
            
            // Adicionar indicação visual de seleção
            this.style.backgroundColor = '#e8f4fc';
            this.style.borderColor = '#3498db';
            
            // Atualizar botão de confirmação para mostrar que o pagamento é necessário
            const confirmButton = document.getElementById('confirm-booking');
            if (confirmButton) {
                confirmButton.textContent = 'Pagar e Confirmar Marcação';
                confirmButton.classList.add('payment-ready');
            }
        });
    });
    
    // Botão de confirmar marcação e pagamento
    const confirmButton = document.getElementById('confirm-booking');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
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
            
            // Calcular valor do pagamento (50% para valores acima de 10€, com mínimo de 10€)
            let paymentAmount = finalPrice;
            let isPartialPayment = false;
            
            if (finalPrice > 10) {
                paymentAmount = Math.max(finalPrice * 0.5, 10);
                isPartialPayment = paymentAmount < finalPrice;
            }
            
            // Atualizar o valor a ser pago no resumo
            document.getElementById('payment-amount').textContent = `${paymentAmount.toFixed(2)}€`;
            if (isPartialPayment) {
                document.getElementById('payment-type').textContent = 'Pagamento Parcial (50%)';
                document.getElementById('remaining-amount').textContent = `${(finalPrice - paymentAmount).toFixed(2)}€`;
                document.getElementById('remaining-payment-info').style.display = 'block';
            } else {
                document.getElementById('payment-type').textContent = 'Pagamento Total';
                document.getElementById('remaining-payment-info').style.display = 'none';
            }
            
            // Criar descrição da reserva
            const bookingDescription = `${sessionQuantity} sessão(ões) de ${sessionDuration} minutos - ${sessionType === 'remote' ? 'Remota' : 'Presencial'}`;
            
            // Processar pagamento com base no método selecionado
            processPayment(selectedPaymentMethod, paymentAmount, bookingDescription, {
                name: userName,
                email: userEmail,
                phone: userPhone,
                totalAmount: finalPrice,
                isPartialPayment: isPartialPayment
            });
        });
    }
}

function processPayment(method, amount, description, userDetails) {
    // Mostrar indicador de carregamento
    showLoadingIndicator('Processando pagamento...');
    
    let paymentProvider;
    
    switch(method) {
        case 'apple-pay':
            paymentProvider = window.paymentProviders.applePay;
            break;
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
        showCreditCardForm(paymentInit.paymentId, userDetails, amount);
    } else {
        // Para outros métodos, redirecionar para a página de checkout
        simulateRedirect(paymentInit.checkoutUrl, method);
        
        // Simular processamento e retorno
        setTimeout(() => {
            const result = {
                success: true,
                transactionId: 'trans_' + Math.random().toString(36).substr(2, 9)
            };
            
            handlePaymentResult(result, description, userDetails, amount);
        }, 3000);
    }
}

function showCreditCardForm(paymentId, userDetails, amount) {
    // Criar e mostrar modal de formulário de cartão
    const modalHtml = `
        <div id="cc-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 500px;">
                <span class="close" onclick="document.getElementById('cc-modal').remove()">&times;</span>
                <h2>Pagamento com Cartão de Crédito</h2>
                <p style="margin-bottom: 20px;">Valor a pagar: <strong>${amount.toFixed(2)}€</strong></p>
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
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Pagar ${amount.toFixed(2)}€</button>
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
            
            handlePaymentResult(result, 'Pagamento com Cartão', userDetails, amount);
        }, 2000);
    });
}

function simulateRedirect(url, method) {
    // Criar e mostrar modal de redirecionamento
    let methodName = '';
    switch(method) {
        case 'apple-pay':
            methodName = 'Apple Pay';
            break;
        case 'revolut':
            methodName = 'Revolut';
            break;
        case 'paypal':
            methodName = 'PayPal';
            break;
        default:
            methodName = method;
    }
    
    const modalHtml = `
        <div id="redirect-modal" class="modal" style="display: block;">
            <div class="modal-content" style="text-align: center;">
                <h2>Redirecionando para ${methodName}</h2>
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

function handlePaymentResult(result, description, userDetails, paidAmount) {
    hideLoadingIndicator();
    
    if (result.success) {
        // Pagamento bem-sucedido
        showSuccessMessage(result.transactionId, description, userDetails, paidAmount);
        
        // Enviar informações para o email srshare2inspire.pt sem visibilidade do utilizador
        sendBookingInfoToEmail(description, userDetails, result.transactionId, paidAmount);
    } else {
        // Pagamento falhou
        alert(`Erro no pagamento: ${result.error || 'Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.'}`);
    }
}

function showSuccessMessage(transactionId, description, userDetails, paidAmount) {
    // Criar e mostrar mensagem de sucesso
    const successHtml = `
        <div id="success-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 600px; text-align: center;">
                <h2 style="color: #4CAF50;"><i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 20px;"></i><br>Pagamento Confirmado!</h2>
                <p>O seu pagamento de <strong>${paidAmount.toFixed(2)}€</strong> foi processado com sucesso.</p>
                <p>ID da Transação: <strong>${transactionId}</strong></p>
                
                <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px; text-align: left;">
                    <h3>Detalhes da Marcação:</h3>
                    <p><strong>Serviço:</strong> ${description}</p>
                    <p><strong>Nome:</strong> ${userDetails.name}</p>
                    <p><strong>Email:</strong> ${userDetails.email}</p>
                    <p><strong>Telefone:</strong> ${userDetails.phone}</p>
                    <p><strong>Valor Total:</strong> ${userDetails.totalAmount.toFixed(2)}€</p>
                    ${userDetails.isPartialPayment ? 
                        `<p><strong>Valor Pago:</strong> ${paidAmount.toFixed(2)}€ (50% do valor total)</p>
                         <p><strong>Valor Restante:</strong> ${(userDetails.totalAmount - paidAmount).toFixed(2)}€ (a pagar no dia da sessão)</p>` 
                        : 
                        `<p><strong>Valor Pago:</strong> ${paidAmount.toFixed(2)}€ (pagamento total)</p>`
                    }
                </div>
                
                <p>Um email de confirmação foi enviado para <strong>${userDetails.email}</strong> com todos os detalhes da sua marcação.</p>
                <p>Obrigado por escolher a Share2Inspire!</p>
                
                <button onclick="window.location.href='/'" class="btn btn-primary" style="margin-top: 20px;">Voltar para a Página Inicial</button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    const successContainer = document.createElement('div');
    successContainer.innerHTML = successHtml;
    document.body.appendChild(successContainer.firstElementChild);
}

function sendBookingInfoToEmail(description, userDetails, transactionId, paidAmount) {
    // Simular envio de email
    console.log('Enviando email de confirmação para:', userDetails.email);
    console.log('Enviando email de notificação para: srshare2inspire@gmail.com');
    
    // Conteúdo do email para o cliente
    const clientEmailContent = `
        Olá ${userDetails.name},
        
        Obrigado por agendar uma sessão na Share2Inspire!
        
        Detalhes da sua marcação:
        - Serviço: ${description}
        - ID da Transação: ${transactionId}
        - Valor Total: ${userDetails.totalAmount.toFixed(2)}€
        ${userDetails.isPartialPayment ? 
            `- Valor Pago: ${paidAmount.toFixed(2)}€ (50% do valor total)
             - Valor Restante: ${(userDetails.totalAmount - paidAmount).toFixed(2)}€ (a pagar no dia da sessão)` 
            : 
            `- Valor Pago: ${paidAmount.toFixed(2)}€ (pagamento total)`
        }
        
        Em caso de dúvidas, entre em contato através do email srshare2inspire@gmail.com.
        
        Atenciosamente,
        Equipe Share2Inspire
    `;
    
    // Conteúdo do email para o administrador
    const adminEmailContent = `
        Nova marcação recebida!
        
        Detalhes da marcação:
        - Serviço: ${description}
        - Cliente: ${userDetails.name}
        - Email: ${userDetails.email}
        - Telefone: ${userDetails.phone}
        - ID da Transação: ${transactionId}
        - Valor Total: ${userDetails.totalAmount.toFixed(2)}€
        ${userDetails.isPartialPayment ? 
            `- Valor Pago: ${paidAmount.toFixed(2)}€ (50% do valor total)
             - Valor Restante: ${(userDetails.totalAmount - paidAmount).toFixed(2)}€ (a pagar no dia da sessão)` 
            : 
            `- Valor Pago: ${paidAmount.toFixed(2)}€ (pagamento total)`
        }
    `;
    
    console.log('Email para cliente:', clientEmailContent);
    console.log('Email para administrador:', adminEmailContent);
}
