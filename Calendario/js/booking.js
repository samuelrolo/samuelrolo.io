document.addEventListener('DOMContentLoaded', function() {
    // Integração com sistema de pagamento
    setupPaymentSystem();
    
    // Configuração dos métodos de pagamento
    setupPaymentMethods();
    
    // Configuração do botão de agendamento na página principal
    setupBookingButton();
    
    // Configuração do sistema de confirmação e emails
    setupConfirmationSystem();
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
    
    // Configuração do MB WAY
    function setupMBWayPayment() {
        return {
            initialize: function(amount, currency, description) {
                console.log(`Inicializando pagamento MB WAY: ${amount} ${currency} - ${description}`);
                return {
                    paymentId: 'mbw_' + Math.random().toString(36).substr(2, 9),
                    checkoutUrl: 'https://mbway.pt/checkout/dummy'
                };
            },
            processPayment: function(paymentId, phoneNumber) {
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
        creditCard: setupCreditCardPayment(),
        mbway: setupMBWayPayment()
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
                isPartialPayment: isPartialPayment,
                sessionType: sessionType,
                sessionDuration: sessionDuration,
                sessionQuantity: sessionQuantity,
                notes: document.getElementById('user-notes').value,
                dateTime: document.getElementById('summary-datetime').textContent
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
        case 'mbway':
            paymentProvider = window.paymentProviders.mbway;
            break;
        case 'bank-transfer':
            // Mostrar informações de transferência bancária
            showBankTransferInfo(amount, userDetails);
            return;
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
    } else if (method === 'mbway') {
        // Para MB WAY, mostrar formulário de telefone
        showMBWayForm(paymentInit.paymentId, userDetails, amount);
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

function showBankTransferInfo(amount, userDetails) {
    // Criar e mostrar modal com informações de transferência bancária
    const modalHtml = `
        <div id="bank-transfer-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 500px;">
                <span class="close" onclick="document.getElementById('bank-transfer-modal').remove()">&times;</span>
                <h2>Pagamento por Transferência Bancária</h2>
                <p style="margin-bottom: 20px;">Valor a pagar: <strong>${amount.toFixed(2)}€</strong></p>
                <div class="payment-info" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p><strong>Dados para transferência:</strong></p>
                    <p><strong>IBAN:</strong> <span style="font-family: monospace; font-size: 1.1em;">LT38 32 50 0674 3397 9375</span></p>
                    <p><strong>Beneficiário:</strong> Samuel Rolo</p>
                    <p><strong>Referência:</strong> Share2Inspire_${userDetails.name.split(' ')[0]}</p>
                </div>
                <p style="margin: 15px 0; font-size: 0.9em; color: #666;">
                    Após realizar a transferência, envie o comprovativo para <strong>srshare2inspire@gmail.com</strong> com o seu nome e data da marcação.
                </p>
                <button onclick="handleBankTransferConfirmation('${userDetails.name}', ${amount})" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Confirmar que realizei a transferência</button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Esconder indicador de carregamento
    hideLoadingIndicator();
}

function handleBankTransferConfirmation(userName, amount) {
    // Remover modal
    document.getElementById('bank-transfer-modal').remove();
    
    // Mostrar mensagem de confirmação
    showLoadingIndicator('A processar a sua confirmação...');
    
    setTimeout(() => {
        const result = {
            success: true,
            transactionId: 'bank_' + Math.random().toString(36).substr(2, 9)
        };
        
        // Simular dados do utilizador para a confirmação
        const userDetails = {
            name: userName,
            dateTime: new Date().toLocaleString('pt-PT')
        };
        
        handlePaymentResult(result, 'Transferência Bancária', userDetails, amount);
    }, 2000);
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

function showMBWayForm(paymentId, userDetails, amount) {
    // Criar e mostrar modal de formulário MB WAY
    const modalHtml = `
        <div id="mbway-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 500px;">
                <span class="close" onclick="document.getElementById('mbway-modal').remove()">&times;</span>
                <h2>Pagamento com MB WAY</h2>
                <p style="margin-bottom: 20px;">Valor a pagar: <strong>${amount.toFixed(2)}€</strong></p>
                <div class="payment-info" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <p><strong>Envie o pagamento para:</strong></p>
                    <p style="font-size: 1.2em; margin: 10px 0;"><strong>+351961925050</strong></p>
                    <p style="font-size: 0.9em; color: #666;">Após enviar o pagamento, clique no botão abaixo para confirmar.</p>
                </div>
                <form id="mbway-form">
                    <div class="form-group">
                        <label for="mbway-phone">O seu número de telemóvel (para confirmação):</label>
                        <input type="tel" id="mbway-phone" placeholder="9XXXXXXXX" required>
                    </div>
                    <p style="margin: 15px 0; font-size: 0.9em; color: #666;">
                        Irá receber uma notificação na aplicação MB WAY para confirmar o pagamento.
                    </p>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Confirmar Pagamento MB WAY</button>
                </form>
            </div>
        </div>
    `;
    
    // Adicionar modal ao DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Configurar envio do formulário
    document.getElementById('mbway-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular processamento MB WAY
        document.getElementById('mbway-modal').remove();
        showLoadingIndicator('Enviando pedido para MB WAY...');
        
        setTimeout(() => {
            showLoadingIndicator('Aguardando confirmação na aplicação MB WAY...');
            
            setTimeout(() => {
                const result = {
                    success: true,
                    transactionId: 'mbw_' + Math.random().toString(36).substr(2, 9)
                };
                
                handlePaymentResult(result, 'Pagamento com MB WAY', userDetails, amount);
            }, 3000);
        }, 2000);
    });
}

function simulateRedirect(url, method) {
    // Criar e mostrar modal de redirecionamento
    let methodName = '';
    let paymentInfo = '';
    
    switch(method) {
        case 'apple-pay':
            methodName = 'Apple Pay';
            break;
        case 'revolut':
            methodName = 'Revolut';
            paymentInfo = `
                <div class="payment-info" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left;">
                    <p><strong>Envie o pagamento para:</strong></p>
                    <p style="font-size: 1.2em; margin: 10px 0;"><strong>@samuelrolo</strong></p>
                    <p style="font-size: 0.9em; color: #666;">Após enviar o pagamento, tire um screenshot da confirmação e envie para srshare2inspire@gmail.com</p>
                </div>
            `;
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
                <h2>Pagamento com ${methodName}</h2>
                ${paymentInfo}
                <p>Será redirecionado para a página de pagamento em instantes...</p>
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
    // Remover indicador existente, se houver
    const existingLoader = document.getElementById('loader-overlay');
    if (existingLoader) {
        existingLoader.remove();
    }
    
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
    const loader = document.getElementById('loader-overlay');
    if (loader) {
        loader.remove();
    }
}

function handlePaymentResult(result, description, userDetails, amount) {
    hideLoadingIndicator();
    
    if (result.success) {
        // Pagamento bem-sucedido
        showSuccessMessage(result.transactionId, userDetails);
        
        // Enviar emails de confirmação
        sendConfirmationEmails(userDetails, result.transactionId, amount);
    } else {
        // Pagamento falhou
        alert('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    }
}

function setupConfirmationSystem() {
    // Criar seção de confirmação se não existir
    if (!document.getElementById('booking-confirmation')) {
        const confirmationSection = document.createElement('section');
        confirmationSection.id = 'booking-confirmation';
        confirmationSection.className = 'booking-confirmation hidden';
        confirmationSection.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Reserva Confirmada!</h2>
                <p class="confirmation-message">A sua reserva foi efetuada e receberá uma confirmação da mesma no seu email. Nas próximas 48h receberá outro e-mail com os detalhes para o serviço selecionado. O e-mail será enviado de srshare2inspire.pt</p>
                <div class="confirmation-details">
                    <p><strong>ID da Transação:</strong> <span id="transaction-id"></span></p>
                    <p><strong>Data e Hora:</strong> <span id="confirmation-datetime"></span></p>
                </div>
                <button id="return-home" class="btn btn-primary">Voltar para a Página Inicial</button>
            </div>
        `;
        
        // Adicionar após a seção de resumo
        const bookingSummary = document.getElementById('booking-summary');
        if (bookingSummary) {
            bookingSummary.parentNode.insertBefore(confirmationSection, bookingSummary.nextSibling);
        } else {
            document.querySelector('main').appendChild(confirmationSection);
        }
        
        // Configurar botão de retorno
        document.getElementById('return-home').addEventListener('click', function() {
            window.location.href = '/';
        });
    }
}

function showSuccessMessage(transactionId, userDetails) {
    // Esconder todas as seções
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar seção de confirmação
    const confirmationSection = document.getElementById('booking-confirmation');
    confirmationSection.classList.remove('hidden');
    
    // Preencher detalhes da confirmação
    document.getElementById('transaction-id').textContent = transactionId;
    document.getElementById('confirmation-datetime').textContent = userDetails.dateTime;
}

function sendConfirmationEmails(userDetails, transactionId, amount) {
    console.log('Enviando emails de confirmação...');
    
    // Simular envio de email para o cliente
    const clientEmailContent = generateClientEmailContent(userDetails, transactionId, amount);
    console.log('Email para cliente:', clientEmailContent);
    
    // Simular envio de email para o administrador
    const adminEmailContent = generateAdminEmailContent(userDetails, transactionId, amount);
    console.log('Email para administrador:', adminEmailContent);
    
    // Simular geração de convite para calendário
    const calendarInvite = generateCalendarInvite(userDetails);
    console.log('Convite para calendário gerado:', calendarInvite);
    
    // Em um ambiente real, aqui seria feita uma chamada AJAX para um endpoint de backend
    // que processaria o envio real dos emails com os convites anexados
    
    // Simulação de envio de email
    setTimeout(() => {
        console.log('Emails enviados com sucesso para', userDetails.email, 'e srshare2inspire@gmail.com');
    }, 1000);
}

function generateClientEmailContent(userDetails, transactionId, amount) {
    // Gerar conteúdo do email para o cliente
    return `
        <h2>Confirmação de Reserva - Share2Inspire</h2>
        <p>Olá ${userDetails.name},</p>
        <p>A sua reserva foi confirmada com sucesso!</p>
        
        <h3>Detalhes da Reserva:</h3>
        <ul>
            <li><strong>Tipo de Sessão:</strong> ${userDetails.sessionType === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)'}</li>
            <li><strong>Duração:</strong> ${userDetails.sessionDuration} minutos</li>
            <li><strong>Quantidade:</strong> ${userDetails.sessionQuantity} sessão(ões)</li>
            <li><strong>Data e Hora:</strong> ${userDetails.dateTime}</li>
            <li><strong>Valor Total:</strong> ${userDetails.totalAmount.toFixed(2)}€</li>
            <li><strong>Valor Pago:</strong> ${amount.toFixed(2)}€</li>
            ${userDetails.isPartialPayment ? `<li><strong>Valor Restante:</strong> ${(userDetails.totalAmount - amount).toFixed(2)}€ (a pagar no dia da sessão)</li>` : ''}
            <li><strong>ID da Transação:</strong> ${transactionId}</li>
        </ul>
        
        <p>Nas próximas 48h receberá outro e-mail com os detalhes para o serviço selecionado.</p>
        
        <p>Obrigado por escolher a Share2Inspire!</p>
        
        <p>Atenciosamente,<br>
        Equipa Share2Inspire<br>
        srshare2inspire@gmail.com</p>
    `;
}

function generateAdminEmailContent(userDetails, transactionId, amount) {
    // Gerar conteúdo do email para o administrador
    return `
        <h2>Nova Reserva Recebida - Share2Inspire</h2>
        
        <h3>Detalhes do Cliente:</h3>
        <ul>
            <li><strong>Nome:</strong> ${userDetails.name}</li>
            <li><strong>Email:</strong> ${userDetails.email}</li>
            <li><strong>Telefone:</strong> ${userDetails.phone}</li>
        </ul>
        
        <h3>Detalhes da Reserva:</h3>
        <ul>
            <li><strong>Tipo de Sessão:</strong> ${userDetails.sessionType === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)'}</li>
            <li><strong>Duração:</strong> ${userDetails.sessionDuration} minutos</li>
            <li><strong>Quantidade:</strong> ${userDetails.sessionQuantity} sessão(ões)</li>
            <li><strong>Data e Hora:</strong> ${userDetails.dateTime}</li>
            <li><strong>Valor Total:</strong> ${userDetails.totalAmount.toFixed(2)}€</li>
            <li><strong>Valor Pago:</strong> ${amount.toFixed(2)}€</li>
            ${userDetails.isPartialPayment ? `<li><strong>Valor Restante:</strong> ${(userDetails.totalAmount - amount).toFixed(2)}€ (a pagar no dia da sessão)</li>` : ''}
            <li><strong>ID da Transação:</strong> ${transactionId}</li>
        </ul>
        
        ${userDetails.notes ? `<h3>Notas do Cliente:</h3><p>${userDetails.notes}</p>` : ''}
    `;
}

function generateCalendarInvite(userDetails) {
    // Em um ambiente real, aqui seria gerado um arquivo .ics (iCalendar)
    // compatível com Google Calendar e Microsoft Outlook
    
    // Exemplo simplificado de estrutura de dados para um convite de calendário
    return {
        summary: `Sessão de Coaching - Share2Inspire`,
        description: `Sessão de ${userDetails.sessionDuration} minutos - ${userDetails.sessionType === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)'}`,
        location: userDetails.sessionType === 'remote' ? 'Online (link será enviado)' : 'Distrito de Lisboa (local a confirmar)',
        start: userDetails.dateTime,
        duration: userDetails.sessionDuration,
        attendees: [
            { email: userDetails.email, name: userDetails.name },
            { email: 'srshare2inspire@gmail.com', name: 'Share2Inspire' }
        ]
    };
}
