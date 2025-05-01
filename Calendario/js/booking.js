document.addEventListener("DOMContentLoaded", function() {
    console.log("Booking script loaded and DOM fully parsed");

    const backendUrl = "http://localhost:3000"; // Adjust if backend runs elsewhere

    // --- Common Elements ---
    const serviceSelectionScreen = document.getElementById("service-selection");
    const coachingFlow = document.getElementById("coaching-flow");
    const cvReviewFlow = document.getElementById("cv-review-flow");
    const selectCoachingBtn = document.getElementById("select-coaching");
    const selectCvReviewBtn = document.getElementById("select-cv-review");

    // --- Coaching Flow Elements ---
    const backButtonCoaching = document.getElementById("back-button"); // Back button in coaching summary
    const coachingForm = document.getElementById("booking-form"); // Main coaching form
    const userFormCoaching = document.getElementById("user-form"); // User details form in coaching
    const confirmBookingCoachingBtn = document.getElementById("confirm-booking");
    const bookingSummarySection = document.getElementById("booking-summary");
    // Add other coaching elements as needed

    // --- CV Review Flow Elements ---
    const backButtonCvReview = document.getElementById("cv-back-button");
    const cvReviewForm = document.getElementById("cv-review-form");
    const cvServiceSelection = document.getElementById("cv-service-selection");
    const cvFinalPriceSpan = document.getElementById("cv-final-price");
    const cvUploadInput = document.getElementById("cv-upload");
    const cvTermsAcceptCheckbox = document.getElementById("cv-terms-accept");
    const cvConfirmButton = document.getElementById("cv-confirm-booking");
    const cvUserNameInput = document.getElementById("cv-user-name");
    const cvUserEmailInput = document.getElementById("cv-user-email");
    const cvUserPhoneInput = document.getElementById("cv-user-phone");
    const cvUserNotesInput = document.getElementById("cv-user-notes");

    // Basic check for essential elements
    if (!serviceSelectionScreen || !coachingFlow || !cvReviewFlow || !selectCoachingBtn || !selectCvReviewBtn) {
        console.error("One or more essential elements for service selection are missing!");
        return; 
    }
    console.log("Service selection elements found.");

    // --- Event Listeners for Service Selection ---
    selectCoachingBtn.addEventListener("click", () => {
        console.log("Coaching button clicked");
        serviceSelectionScreen.style.display = "none";
        coachingFlow.style.display = "block";
        cvReviewFlow.style.display = "none";
    });

    selectCvReviewBtn.addEventListener("click", () => {
        console.log("CV Review button clicked");
        serviceSelectionScreen.style.display = "none";
        coachingFlow.style.display = "none";
        cvReviewFlow.style.display = "block";
    });

    // --- Event Listeners for Back Buttons ---
    if (backButtonCoaching) {
        backButtonCoaching.addEventListener("click", () => {
            console.log("Back button (Coaching Summary) clicked");
            if (bookingSummarySection) bookingSummarySection.classList.add("hidden");
            // Show calendar/options again? Or go back to service selection?
            // For now, go back to service selection
            serviceSelectionScreen.style.display = "block";
            coachingFlow.style.display = "none"; 
            cvReviewFlow.style.display = "none";
        });
    } else {
        console.warn("Back button for coaching flow summary not found.");
    }

    if (backButtonCvReview) {
        backButtonCvReview.addEventListener("click", () => {
            console.log("Back button (CV Review) clicked");
            serviceSelectionScreen.style.display = "block";
            coachingFlow.style.display = "none";
            cvReviewFlow.style.display = "none";
            // Reset CV review form state if needed
            if (cvReviewForm) cvReviewForm.reset();
            if (cvFinalPriceSpan) cvFinalPriceSpan.textContent = "0€";
        });
    } else {
        console.warn("Back button for CV review flow not found.");
    }

    // --- CV Review Flow Logic ---
    if (cvServiceSelection && cvFinalPriceSpan) {
        cvServiceSelection.addEventListener("change", function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.dataset.price;
            cvFinalPriceSpan.textContent = price ? price + "€" : "0€";
        });
    } else {
        console.error("CV Service selection or price span not found.");
    }

    if (cvReviewForm) {
        cvReviewForm.addEventListener("submit", async function(event) { // Make async for await
            event.preventDefault();
            console.log("CV Review form submitted");

            // --- Validation ---
            const selectedOption = cvServiceSelection.options[cvServiceSelection.selectedIndex];
            const serviceName = selectedOption.text;
            const priceText = cvFinalPriceSpan.textContent;
            const amount = parseFloat(priceText.replace("€", ""));
            const userName = cvUserNameInput.value.trim();
            const userEmail = cvUserEmailInput.value.trim();
            const userPhone = cvUserPhoneInput.value.trim();
            const userNotes = cvUserNotesInput.value.trim();
            const cvFile = cvUploadInput.files.length > 0 ? cvUploadInput.files[0] : null;
            const termsAccepted = cvTermsAcceptCheckbox.checked;

            if (!selectedOption.value) {
                alert("Por favor, selecione o serviço desejado."); return;
            }
            if (!userName || !userEmail || !userPhone) {
                alert("Por favor, preencha todos os seus dados (Nome, Email, Telefone)."); return;
            }
            if (!cvFile) {
                alert("Por favor, anexe o seu CV."); return;
            }
            const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowedTypes.includes(cvFile.type)) {
                 alert("Tipo de ficheiro inválido. Por favor, anexe um PDF, DOC ou DOCX."); return;
            }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (cvFile.size > maxSize) {
                alert("O ficheiro excede o tamanho máximo de 5MB."); return;
            }
            if (!termsAccepted) {
                alert("Por favor, leia e aceite os termos e condições."); return;
            }

            // Disable button
            if(cvConfirmButton) cvConfirmButton.disabled = true;
            if(cvConfirmButton) cvConfirmButton.textContent = "A processar...";

            try {
                // --- Step 1: Initiate Payment (MB WAY) --- 
                console.log("Initiating MB WAY payment via backend...");
                const orderId = `CV_${Date.now()}`; // Simple unique order ID
                const paymentPayload = {
                    amount: amount,
                    phone: userPhone, // Assuming user phone is for MB WAY
                    orderId: orderId,
                    description: `Revisão CV/Entrevista: ${serviceName}`
                };

                const paymentResponse = await fetch(`${backendUrl}/api/create-mbway-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paymentPayload)
                });

                const paymentResult = await paymentResponse.json();

                if (!paymentResponse.ok || !paymentResult.success) {
                    console.error("Payment initiation failed:", paymentResult);
                    alert(`Erro ao iniciar pagamento: ${paymentResult.message || "Tente novamente."}`);
                    // Re-enable button on failure
                    if(cvConfirmButton) cvConfirmButton.disabled = false;
                    if(cvConfirmButton) cvConfirmButton.textContent = "Pagar e Enviar Pedido";
                    return; 
                }

                console.log("Payment initiation successful (simulated or real):", paymentResult);
                alert(paymentResult.message); // Show message like "Aguarde confirmação na app..."

                // --- Step 2: Send Confirmation Email (after successful payment initiation) ---
                // NOTE: In a real scenario, email might be sent *after* payment confirmation via callback,
                // but for now, we send after successful *initiation*.
                console.log("Sending confirmation email via backend...");
                const emailSubject = `Confirmação Pedido Share2Inspire - ${serviceName}`;
                const emailTextBody = `Olá ${userName},

O seu pedido para "${serviceName}" (ID: ${orderId}) foi recebido e o pagamento MB WAY iniciado.
Valor: ${amount}€

Analisaremos o seu CV e entraremos em contacto em breve.

Notas adicionais: ${userNotes || "Nenhuma"}

Obrigado,
Equipa Share2Inspire`;
                const emailHtmlBody = `<p>Olá ${userName},</p>
<p>O seu pedido para "<b>${serviceName}</b>" (ID: ${orderId}) foi recebido e o pagamento MB WAY iniciado.</p>
<p><b>Valor:</b> ${amount}€</p>
<p>Analisaremos o seu CV e entraremos em contacto em breve.</p>
<p><b>Notas adicionais:</b> ${userNotes || "Nenhuma"}</p>
<p>Obrigado,<br>Equipa Share2Inspire</p>`;

                const emailPayload = {
                    to: userEmail,
                    subject: emailSubject,
                    text: emailTextBody,
                    html: emailHtmlBody
                };

                const emailResponse = await fetch(`${backendUrl}/api/send-confirmation-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(emailPayload)
                });

                const emailResult = await emailResponse.json();

                if (!emailResponse.ok || !emailResult.success) {
                    console.error("Email sending failed:", emailResult);
                    // Inform user, but maybe don't block the process entirely if payment worked
                    alert(`Pagamento iniciado, mas houve um erro ao enviar o e-mail de confirmação: ${emailResult.message || "Verifique a sua caixa de correio."}`);
                } else {
                    console.log("Confirmation email sent successfully (simulated or real):", emailResult);
                    // Optional: Show a specific success message for email
                    // alert(emailResult.message);
                }

                // --- Final Step: Reset form and UI ---
                alert("Pedido concluído com sucesso! Verifique o seu e-mail e a aplicação MB WAY.");
                cvReviewForm.reset();
                cvFinalPriceSpan.textContent = "0€";
                serviceSelectionScreen.style.display = "block";
                coachingFlow.style.display = "none";
                cvReviewFlow.style.display = "none";

            } catch (error) {
                console.error("Error during CV review submission process:", error);
                alert("Ocorreu um erro inesperado ao processar o seu pedido. Por favor, tente novamente.");
            } finally {
                 // Always re-enable button unless already handled in specific error cases
                 if(cvConfirmButton) cvConfirmButton.disabled = false;
                 if(cvConfirmButton) cvConfirmButton.textContent = "Pagar e Enviar Pedido";
            }
        });
    } else {
        console.error("CV Review form not found.");
    }

    // --- Placeholder for Coaching Flow Logic (including backend calls) ---
    // TODO: Implement similar fetch calls for payment and email in the coaching flow confirmation
    if (confirmBookingCoachingBtn) {
        confirmBookingCoachingBtn.addEventListener("click", async () => {
             console.log("Coaching confirm button clicked - Placeholder for backend integration");
             // 1. Get data from coachingForm and userFormCoaching
             // 2. Perform validation
             // 3. Call backend /api/create-mbway-payment
             // 4. If payment ok, call backend /api/send-confirmation-email
             // 5. Show success/error messages, reset UI
             alert("Funcionalidade de confirmação de Coaching ainda não integrada com o backend.");
        });
    }

    // --- Placeholder for common functions (like modal handling) ---
    // Add later if needed

});

