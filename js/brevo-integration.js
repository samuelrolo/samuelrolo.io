// Integração com a API Brevo para envio de solicitações
document.addEventListener('DOMContentLoaded', function() {
    const serviceRequestForm = document.getElementById("service-request-form");
    const serviceRequestMessage = document.getElementById("service-request-message");

    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Obter os dados do formulário
            const nameInput = this.querySelector("input[name='name']");
            const emailInput = this.querySelector("input[name='email']");
            const phoneInput = this.querySelector("input[name='phone']");
            const serviceTypeSelect = this.querySelector("select[name='service_type']");
            const detailsInput = this.querySelector("textarea[name='details']");
            
            // Validar campos obrigatórios
            if (!nameInput || !emailInput || !detailsInput || 
                nameInput.value.trim() === "" || 
                emailInput.value.trim() === "" || 
                detailsInput.value.trim() === "") {
                
                if (serviceRequestMessage) {
                    serviceRequestMessage.textContent = "Por favor, preencha todos os campos obrigatórios.";
                    serviceRequestMessage.style.color = "red";
                    serviceRequestMessage.style.display = "block";
                }
                return;
            }

            // Mostrar indicador de carregamento
            if (serviceRequestMessage) {
                serviceRequestMessage.textContent = "A enviar solicitação...";
                serviceRequestMessage.style.color = "#B08D57";
                serviceRequestMessage.style.display = "block";
            }

            // Preparar dados para envio
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput ? phoneInput.value : '',
                service_type: serviceTypeSelect ? serviceTypeSelect.value : '',
                details: detailsInput.value,
                to_email: "srshare2inspire@gmail.com"
            };

            // Enviar dados para a API Brevo
            fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'xkeysib-YOUR-API-KEY-HERE' // Substituir pela chave API real
                },
                body: JSON.stringify({
                    sender: {
                        name: formData.name,
                        email: formData.email
                    },
                    to: [{
                        email: formData.to_email,
                        name: "Share2Inspire"
                    }],
                    subject: `Nova solicitação de serviço: ${formData.service_type}`,
                    htmlContent: `
                        <h2>Nova solicitação de serviço</h2>
                        <p><strong>Nome:</strong> ${formData.name}</p>
                        <p><strong>Email:</strong> ${formData.email}</p>
                        <p><strong>Telefone:</strong> ${formData.phone}</p>
                        <p><strong>Serviço:</strong> ${formData.service_type}</p>
                        <p><strong>Detalhes:</strong> ${formData.details}</p>
                    `
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar solicitação');
                }
                return response.json();
            })
            .then(data => {
                console.log("Solicitação enviada com sucesso:", data);
                
                // Mostrar mensagem de sucesso
                if (serviceRequestMessage) {
                    serviceRequestMessage.textContent = "A sua solicitação foi enviada com sucesso! Entraremos em contacto em breve.";
                    serviceRequestMessage.style.color = "green";
                    serviceRequestMessage.style.display = "block";
                }
                
                // Limpar formulário
                serviceRequestForm.reset();
            })
            .catch(error => {
                console.error("Erro ao enviar solicitação:", error);
                
                // Mostrar mensagem de erro
                if (serviceRequestMessage) {
                    serviceRequestMessage.textContent = "Ocorreu um erro ao enviar a solicitação. Por favor, tente novamente mais tarde.";
                    serviceRequestMessage.style.color = "red";
                    serviceRequestMessage.style.display = "block";
                }
            });
        });
    }
});
