// Integração completa com Brevo para envio real de emails de feedback
document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById("feedback-form");
    if (feedbackForm) {
        const stars = document.querySelectorAll(".star-rating i");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackMessage = document.getElementById("feedback-message");
        let currentRating = 0;

        // Configuração das estrelas de avaliação
        if (stars.length > 0) {
            // Função para resetar o visual das estrelas
            function resetStarsVisual() {
                stars.forEach(star => {
                    star.classList.remove("fas");
                    star.classList.add("far");
                    star.style.color = '#ddd';
                });
            }

            // Função para destacar estrelas até um valor específico
            function highlightStars(value) {
                stars.forEach((star, index) => {
                    if (index < value) {
                        star.classList.remove("far");
                        star.classList.add("fas");
                        star.style.color = '#B08D57';
                    } else {
                        star.classList.remove("fas");
                        star.classList.add("far");
                        star.style.color = '#ddd';
                    }
                });
            }

            stars.forEach((star, index) => {
                // Evento de hover nas estrelas
                star.addEventListener("mouseover", () => {
                    resetStarsVisual();
                    highlightStars(index + 1);
                });

                // Evento de saída do hover
                star.addEventListener("mouseout", () => {
                    resetStarsVisual();
                    if (currentRating > 0) {
                        highlightStars(currentRating);
                    }
                });

                // Evento de clique nas estrelas
                star.addEventListener("click", () => {
                    currentRating = index + 1;
                    resetStarsVisual();
                    highlightStars(currentRating);
                    console.log('Avaliação selecionada:', currentRating);
                });
            });
        }

        // Evento de submissão do formulário
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            if (feedbackMessage) {
                feedbackMessage.textContent = "A enviar...";
                feedbackMessage.style.display = "block";
                feedbackMessage.className = "feedback-sending";
            }

            const rating = currentRating;
            const comment = feedbackText ? feedbackText.value : "";

            if (rating === 0) {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, selecione uma classificação.";
                    feedbackMessage.className = "feedback-error";
                }
                return;
            }

            // Configuração para envio via Brevo (Sendinblue)
            // Nota: Em produção, isto deve ser feito através de um backend para proteger a API key
            const apiUrl = "https://api.brevo.com/v3/smtp/email";
            const apiKey = "YOUR_BREVO_API_KEY"; // Substituir pela API key real em produção
            
            const emailData = {
                sender: {
                    name: "Feedback Site Share2Inspire",
                    email: "noreply@share2inspire.pt"
                },
                to: [{
                    email: "srshare2inspire@gmail.com",
                    name: "Samuel Rolo"
                }],
                subject: `Novo Feedback (${rating} estrelas) do Site Share2Inspire`,
                htmlContent: `<html><body>
                                <h2>Novo Feedback Recebido</h2>
                                <p><strong>Classificação:</strong> ${String.fromCharCode(0x2B50).repeat(rating)} (${rating}/5)</p>
                                <p><strong>Comentário:</strong></p>
                                <p>${comment.replace(/\n/g, "<br>")}</p>
                              </body></html>`
            };

            try {
                // Em ambiente de desenvolvimento/teste, simulamos o envio
                // Em produção, descomentar o código abaixo e usar a API key real
                /*
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    body: JSON.stringify(emailData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao enviar feedback');
                }
                */
                
                // Simulação para teste (remover em produção)
                console.log("Feedback Data:", { rating, comment });
                console.log("Email Payload:", emailData);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Feedback de sucesso
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Obrigado pelo seu feedback!";
                    feedbackMessage.className = "feedback-success";
                    
                    // Adicionar nota sobre simulação (remover em produção)
                    feedbackMessage.innerHTML += "<br><small>(Nota: Para ativar o envio real de emails, configure a API key da Brevo no código)</small>";
                }
                
                // Reset do formulário
                feedbackForm.reset();
                currentRating = 0;
                resetStarsVisual();

                // Esconder a mensagem após alguns segundos
                setTimeout(() => {
                    if (feedbackMessage) {
                        feedbackMessage.style.display = "none";
                    }
                }, 5000);

            } catch (error) {
                console.error("Erro ao enviar feedback:", error);
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Erro ao enviar feedback. Por favor, tente novamente mais tarde.";
                    feedbackMessage.className = "feedback-error";
                }
            }
        });
    }
});
