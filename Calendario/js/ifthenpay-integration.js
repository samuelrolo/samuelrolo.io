// Integração com a API ifthenpay para métodos de pagamento
document.addEventListener('DOMContentLoaded', function() {
    // Selecionar todos os métodos de pagamento
    const paymentMethods = document.querySelectorAll('.payment-method, [data-method]');
    
    if (paymentMethods.length > 0) {
        console.log('Métodos de pagamento encontrados:', paymentMethods.length);
        
        // Adicionar evento de clique a cada método de pagamento
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remover seleção anterior
                paymentMethods.forEach(m => m.classList.remove('selected'));
                // Adicionar seleção ao método clicado
                this.classList.add('selected');
                
                // Obter o método selecionado
                const paymentMethod = this.getAttribute('data-method') || 
                                     (this.classList.contains('multibanco') ? 'mb' : 
                                     (this.classList.contains('mbway') ? 'mbway' : 
                                     (this.classList.contains('payshop') ? 'payshop' : 
                                     (this.classList.contains('transferencia') ? 'bank-transfer' : null))));
                
                console.log('Método de pagamento selecionado:', paymentMethod);
            });
        });
        
        // Configurar botão de confirmação
        const confirmButton = document.querySelector('#confirmar-marcacao, .confirmar-marcacao, button[type="submit"]');
        if (confirmButton) {
            confirmButton.addEventListener('click', function(event) {
                // Verificar se um método de pagamento foi selecionado
                const selectedMethod = document.querySelector('.payment-method.selected, [data-method].selected');
                if (!selectedMethod) {
                    event.preventDefault();
                    alert('Por favor, selecione um método de pagamento.');
                    return;
                }
                
                // Obter o método selecionado
                const paymentMethod = selectedMethod.getAttribute('data-method') || 
                                     (selectedMethod.classList.contains('multibanco') ? 'mb' : 
                                     (selectedMethod.classList.contains('mbway') ? 'mbway' : 
                                     (selectedMethod.classList.contains('payshop') ? 'payshop' : 
                                     (selectedMethod.classList.contains('transferencia') ? 'bank-transfer' : null))));
                
                // Processar pagamento com base no método selecionado
                processPayment(paymentMethod);
            });
        }
    }
    
    // Função para processar pagamento
    function processPayment(method) {
        console.log('Processando pagamento:', method);
        
        // Simular integração com API ifthenpay
        // Em produção, isto seria substituído pela chamada real à API
        
        // Mostrar feedback ao utilizador
        const paymentInfo = document.createElement('div');
        paymentInfo.className = 'payment-info';
        paymentInfo.style.margin = '20px 0';
        paymentInfo.style.padding = '15px';
        paymentInfo.style.backgroundColor = '#f8f9fa';
        paymentInfo.style.border = '1px solid #ddd';
        paymentInfo.style.borderRadius = '5px';
        
        let infoHTML = '';
        
        switch(method) {
            case 'mb':
                infoHTML = `
                    <h3>Pagamento por Multibanco</h3>
                    <p>Utilize os seguintes dados para efetuar o pagamento:</p>
                    <div style="margin: 15px 0; font-size: 1.1em;">
                        <p><strong>Entidade:</strong> 11111</p>
                        <p><strong>Referência:</strong> 999 999 999</p>
                        <p><strong>Valor:</strong> 75.00€</p>
                    </div>
                    <p><small>Esta referência é válida por 48 horas.</small></p>
                `;
                break;
            case 'mbway':
                infoHTML = `
                    <h3>Pagamento por MB WAY</h3>
                    <p>Foi enviado um pedido de pagamento para o seu telemóvel:</p>
                    <div style="margin: 15px 0; font-size: 1.1em;">
                        <p><strong>Telemóvel:</strong> 9********</p>
                        <p><strong>Valor:</strong> 75.00€</p>
                    </div>
                    <p><small>Por favor, aceite o pedido na aplicação MB WAY.</small></p>
                `;
                break;
            case 'payshop':
                infoHTML = `
                    <h3>Pagamento por Payshop</h3>
                    <p>Utilize a seguinte referência para efetuar o pagamento:</p>
                    <div style="margin: 15px 0; font-size: 1.1em;">
                        <p><strong>Referência:</strong> 999 999 999</p>
                        <p><strong>Valor:</strong> 75.00€</p>
                    </div>
                    <p><small>Esta referência é válida por 5 dias.</small></p>
                `;
                break;
            case 'bank-transfer':
                infoHTML = `
                    <h3>Pagamento por Transferência Bancária</h3>
                    <p>Utilize os seguintes dados para efetuar a transferência:</p>
                    <div style="margin: 15px 0; font-size: 1.1em;">
                        <p><strong>IBAN:</strong> PT50 0000 0000 0000 0000 0000 0</p>
                        <p><strong>BIC/SWIFT:</strong> TOTAPTPL</p>
                        <p><strong>Beneficiário:</strong> Share2Inspire</p>
                        <p><strong>Valor:</strong> 75.00€</p>
                    </div>
                    <p><small>Por favor, inclua o seu nome e email na descrição da transferência.</small></p>
                `;
                break;
            default:
                infoHTML = `
                    <h3>Método de pagamento não suportado</h3>
                    <p>Por favor, selecione outro método de pagamento.</p>
                `;
                break;
        }
        
        paymentInfo.innerHTML = infoHTML;
        
        // Adicionar ao DOM
        const paymentSection = document.querySelector('.payment-methods, #payment-methods');
        if (paymentSection) {
            // Remover informações anteriores se existirem
            const existingInfo = document.querySelector('.payment-info');
            if (existingInfo) {
                existingInfo.remove();
            }
            
            paymentSection.parentNode.insertBefore(paymentInfo, paymentSection.nextSibling);
        }
    }
});
