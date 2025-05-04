
            // Feedback Form Logic
            const feedbackForm = document.getElementById("feedback-form");
            const ratingStarsContainer = feedbackForm.querySelector(".rating-stars");
            const stars = ratingStarsContainer.querySelectorAll(".star");
            const feedbackText = document.getElementById("feedback-text");
            const feedbackStatus = document.getElementById("feedback-status");
            let currentRating = 0;

            stars.forEach(star => {
                star.addEventListener("mouseover", () => {
                    const hoverValue = parseInt(star.dataset.value);
                    stars.forEach((s, i) => {
                        s.classList.toggle("selected", i < hoverValue);
                    });
                });

                star.addEventListener("mouseout", () => {
                    stars.forEach((s, i) => {
                        s.classList.toggle("selected", i < currentRating);
                    });
                });

                star.addEventListener("click", () => {
                    currentRating = parseInt(star.dataset.value);
                    ratingStarsContainer.dataset.rating = currentRating;
                    // Keep stars highlighted up to the clicked one
                    stars.forEach((s, i) => {
                        s.classList.toggle("selected", i < currentRating);
                    });
                });
            });

            feedbackForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                feedbackStatus.textContent = "A enviar...";
                feedbackStatus.className = ""; // Reset class

                const rating = currentRating;
                const comment = feedbackText.value;

                if (rating === 0) {
                    feedbackStatus.textContent = "Por favor, selecione uma classificação.";
                    feedbackStatus.className = "error";
                    return;
                }

                // --- Brevo API Integration --- 
                // IMPORTANT: Direct API call from frontend is insecure as it exposes the API key.
                // A backend proxy (e.g., serverless function) is recommended.
                // The code below simulates the structure but requires a secure backend implementation.
                
                // const apiKey = "3532-9893-7426-5310"; // API Key REMOVED - DO NOT USE DIRECTLY IN PRODUCTION FRONTEND
                const apiUrl = "https://api.brevo.com/v3/smtp/email";

                const emailData = {
                    sender: {
                        name: "Feedback Site Share2Inspire",
                        email: "noreply@share2inspire.pt" // Use a verified sender email in Brevo
                    },
                    to: [{
                        email: "srshare2inspire@gmail.com", // Destination email provided by user
                        name: "Samuel Rolo"
                    }],
                    subject: `Novo Feedback (${rating} estrelas) do Site Share2Inspire`,
                    htmlContent: `<html><body>
                                     <h2>Novo Feedback Recebido</h2>
                                     <p><strong>Classificação:</strong> ${"⭐".repeat(rating)} (${rating}/5)</p>
                                     <p><strong>Comentário:</strong></p>
                                     <p>${comment.replace(/\n/g, "<br>")}</p>
                                   </body></html>`
                };

                try {
                    /* 
                    // *** INSECURE - DO NOT USE IN PRODUCTION FRONTEND ***
                    // Placeholder for secure backend call logic
                    // Example: Send data to your backend endpoint
                    const backendResponse = await fetch('/api/send-feedback', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ rating, comment })
                    });
                    
                    if (backendResponse.ok) {
                         feedbackStatus.textContent = "Obrigado pelo seu feedback!";
                         feedbackStatus.className = "success";
                         // Reset form
                    } else {
                         feedbackStatus.textContent = "Erro ao enviar feedback.";
                         feedbackStatus.className = "error";
                    }
                    */

                    // **Placeholder for secure backend call simulation (REMOVE THIS in final implementation)**
                    console.log("Feedback Data:", { rating, comment });
                    // console.log("Brevo API Key (REMOVED - Insecure if used here)"); 
                    console.log("Email Payload (Simulation):", emailData);
                    
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
                    feedbackStatus.textContent = "Obrigado pelo seu feedback! (Simulação - Backend necessário)";
                    feedbackStatus.className = "success";
                    feedbackForm.reset();
                    currentRating = 0;
                    ratingStarsContainer.dataset.rating = 0;
                    stars.forEach(s => s.classList.remove("selected"));
                    // End simulation

                } catch (error) {
                    console.error("Error sending feedback:", error);
                    feedbackStatus.textContent = "Erro ao enviar feedback. Verifique a consola.";
                    feedbackStatus.className = "error";
                }
            });

