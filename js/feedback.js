document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById("feedback-form");
    if (feedbackForm) {
        const stars = feedbackForm.querySelectorAll(".rating-group .star");
        const ratingValueInput = document.getElementById("rating-value");
        const feedbackMessageTextarea = document.getElementById("message");
        const feedbackResponseDiv = document.getElementById("feedback-response");
        let currentRating = 0;

        if (stars.length > 0 && ratingValueInput) {
            stars.forEach(star => {
                star.addEventListener("mouseover", () => {
                    const hoverValue = parseInt(star.dataset.value);
                    stars.forEach((s, i) => {
                        if (i < hoverValue) {
                            s.style.color = 'gold';
                        } else {
                            s.style.color = '#ddd';
                        }
                    });
                });

                star.addEventListener("mouseout", () => {
                    stars.forEach((s, i) => {
                        if (i < currentRating) {
                            s.style.color = 'gold';
                        } else {
                            s.style.color = '#ddd';
                        }
                    });
                });

                star.addEventListener("click", () => {
                    currentRating = parseInt(star.dataset.value);
                    ratingValueInput.value = currentRating;
                    stars.forEach((s, i) => {
                        if (i < currentRating) {
                            s.style.color = 'gold';
                        } else {
                            s.style.color = '#ddd';
                        }
                    });
                });
            });
        }

        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (feedbackResponseDiv) {
                feedbackResponseDiv.textContent = "A enviar...";
                feedbackResponseDiv.className = ""; 
            }

            const rating = currentRating;
            const comment = feedbackMessageTextarea ? feedbackMessageTextarea.value : "";

            if (rating === 0) {
                if (feedbackResponseDiv) {
                    feedbackResponseDiv.textContent = "Por favor, selecione uma classificação.";
                    feedbackResponseDiv.className = "error";
                }
                return;
            }

            const apiUrl = "https://api.brevo.com/v3/smtp/email";
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
                console.log("Feedback Data:", { rating, comment });
                console.log("Email Payload (Simulation):", emailData);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (feedbackResponseDiv) {
                    feedbackResponseDiv.textContent = "Obrigado pelo seu feedback! (Simulação - Backend necessário)";
                    feedbackResponseDiv.className = "success";
                }
                feedbackForm.reset();
                currentRating = 0;
                if (ratingValueInput) {
                    ratingValueInput.value = 0;
                }
                stars.forEach(s => s.style.color = '#ddd');

            } catch (error) {
                console.error("Error sending feedback:", error);
                if (feedbackResponseDiv) {
                    feedbackResponseDiv.textContent = "Erro ao enviar feedback. Verifique a consola.";
                    feedbackResponseDiv.className = "error";
                }
            }
        });
    }
});

