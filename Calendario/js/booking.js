document.addEventListener("DOMContentLoaded", function() {
    console.log("Booking script loaded and DOM fully parsed");

    const backendUrl = "http://localhost:3000"; // Adjust if backend runs elsewhere

    // --- Common Elements ---
    const serviceSelectionScreen = document.getElementById("service-selection");
    const coachingFlow = document.getElementById("coaching-flow");
    const cvReviewFlow = document.getElementById("cv-review-flow");
    const selectCoachingBtn = document.getElementById("select-coaching");
    const selectCvReviewBtn = document.getElementById("select-cv-review");
    const bookingConfirmationScreen = document.getElementById("booking-confirmation");
    const termsModal = document.getElementById("terms-modal");
    const closeTermsModalBtn = document.getElementById("close-terms-modal");
    const acceptTermsModalBtn = document.getElementById("accept-terms-modal");

    // --- Coaching Flow Elements ---
    const coachingBookingContainer = coachingFlow.querySelector(".booking-container");
    const coachingSummarySection = document.getElementById("booking-summary-coaching");
    const coachingForm = document.getElementById("booking-form");
    const sessionTypeSelect = document.getElementById("session-type");
    const sessionDurationSelect = document.getElementById("session-duration");
    const sessionQuantitySelect = document.getElementById("session-quantity");
    const basePriceSpan = document.getElementById("base-price");
    const discountSpan = document.getElementById("discount");
    const finalPriceSpanCoaching = document.getElementById("final-price");
    const calendarEl = document.getElementById("calendar");
    // Coaching Summary Elements
    const summaryTypeSpan = document.getElementById("summary-type");
    const summaryDurationSpan = document.getElementById("summary-duration");
    const summaryDatetimeSpan = document.getElementById("summary-datetime");
    const summaryQuantitySpan = document.getElementById("summary-quantity");
    const summaryPriceSpan = document.getElementById("summary-price");
    const paymentTypeSpan = document.getElementById("payment-type");
    const paymentAmountSpan = document.getElementById("payment-amount");
    const remainingPaymentInfoDiv = document.getElementById("remaining-payment-info");
    const remainingAmountSpan = document.getElementById("remaining-amount");
    const userFormCoaching = document.getElementById("user-form-coaching");
    const userNameCoachingInput = document.getElementById("user-name-coaching");
    const userEmailCoachingInput = document.getElementById("user-email-coaching");
    const userPhoneCoachingInput = document.getElementById("user-phone-coaching");
    const userNotesCoachingInput = document.getElementById("user-notes-coaching");
    const paymentOptionsCoachingDiv = coachingSummarySection.querySelector(".payment-options");
    const paymentMethodsCoachingDiv = paymentOptionsCoachingDiv.querySelector(".payment-methods");
    const paymentDetailsCoachingDiv = document.getElementById("payment-details-coaching");
    const termsAcceptCoachingCheckbox = document.getElementById("terms-accept-coaching");
    const openTermsModalCoachingLink = document.getElementById("open-terms-modal-coaching");
    const backButtonCoaching = document.getElementById("back-button-coaching");
    const confirmBookingCoachingBtn = document.getElementById("confirm-booking-coaching");

    // --- CV Review Flow Elements ---
    const cvReviewFormContainer = cvReviewFlow.querySelector(".cv-review-form-container");
    const cvReviewForm = document.getElementById("cv-review-form");
    const cvServiceSelection = document.getElementById("cv-service-selection");
    const cvFinalPriceSpan = document.getElementById("cv-final-price");
    const cvUserNameInput = document.getElementById("cv-user-name");
    const cvUserEmailInput = document.getElementById("cv-user-email");
    const cvUserPhoneInput = document.getElementById("cv-user-phone");
    const cvUploadInput = document.getElementById("cv-upload");
    const cvUserNotesInput = document.getElementById("cv-user-notes");
    const paymentOptionsCvDiv = cvReviewFormContainer.querySelector(".payment-options");
    const paymentMethodsCvDiv = paymentOptionsCvDiv.querySelector(".payment-methods");
    const paymentDetailsCvDiv = document.getElementById("payment-details-cv");
    const termsAcceptCvCheckbox = document.getElementById("terms-accept-cv");
    const openTermsModalCvLink = document.getElementById("open-terms-modal-cv");
    const backButtonCv = document.getElementById("back-button-cv");
    const confirmBookingCvBtn = document.getElementById("confirm-booking-cv");

    // --- Confirmation Screen Elements ---
    const confirmServiceSpan = document.getElementById("confirm-service");
    const confirmNameSpan = document.getElementById("confirm-name");
    const confirmEmailSpan = document.getElementById("confirm-email");
    const confirmDatetimeSpan = document.getElementById("confirm-datetime");
    const confirmPriceSpan = document.getElementById("confirm-price");
    const confirmPaymentMethodSpan = document.getElementById("confirm-payment-method");

    // --- State Variables ---
    let selectedDate = null;
    let selectedTime = null;
    let currentFlow = null; // "coaching" or "cv"
    let selectedPaymentMethod = null;
    let currentBookingData = {}; // To store data before confirmation

    // --- Helper Functions ---
    const showScreen = (screenToShow) => {
        [serviceSelectionScreen, coachingFlow, cvReviewFlow, bookingConfirmationScreen].forEach(screen => {
            if (screen) screen.style.display = "none";
        });
        if (screenToShow) screenToShow.style.display = "block";
    };

    const resetForm = (form) => {
        if (form) form.reset();
        // Reset specific elements if needed
        if (cvFinalPriceSpan) cvFinalPriceSpan.textContent = "0€";
        if (finalPriceSpanCoaching) finalPriceSpanCoaching.textContent = "10€"; // Reset to default
        if (basePriceSpan) basePriceSpan.textContent = "10€";
        if (discountSpan) discountSpan.textContent = "0€";
        selectedPaymentMethod = null;
        currentBookingData = {};
        // Reset payment details display
        hideAllPaymentInstructions("coaching");
        hideAllPaymentInstructions("cv");
        if (paymentDetailsCoachingDiv) paymentDetailsCoachingDiv.classList.add("hidden");
        if (paymentDetailsCvDiv) paymentDetailsCvDiv.classList.add("hidden");
        // Reset button states
        enableConfirmButton("coaching");
        enableConfirmButton("cv");
    };

    const enableConfirmButton = (flowType) => {
        const btn = flowType === "coaching" ? confirmBookingCoachingBtn : confirmBookingCvBtn;
        if (btn) {
            btn.disabled = false;
            btn.textContent = flowType === "coaching" ? "Confirmar Marcação" : "Confirmar Pedido";
        }
    };

    const disableConfirmButton = (flowType, text = "A processar...") => {
        const btn = flowType === "coaching" ? confirmBookingCoachingBtn : confirmBookingCvBtn;
        if (btn) {
            btn.disabled = true;
            btn.textContent = text;
        }
    };

    const hideAllPaymentInstructions = (flowType) => {
        const detailsDiv = flowType === "coaching" ? paymentDetailsCoachingDiv : paymentDetailsCvDiv;
        if (detailsDiv) {
            detailsDiv.querySelectorAll(".payment-instructions").forEach(el => el.classList.add("hidden"));
        }
    };

    const showPaymentInstructions = (flowType, method) => {
        hideAllPaymentInstructions(flowType);
        const detailsDiv = flowType === "coaching" ? paymentDetailsCoachingDiv : paymentDetailsCvDiv;
        if (detailsDiv) {
            detailsDiv.classList.remove("hidden");
            const instructionDiv = detailsDiv.querySelector(`#${method}-instructions-${flowType}`) || detailsDiv.querySelector(`#${method}-reference-${flowType}`) || detailsDiv.querySelector(`#other-payment-details-${flowType}`);
            if (instructionDiv) {
                instructionDiv.classList.remove("hidden");
            }
        }
    };

    const updatePaymentDetails = (flowType, method, details) => {
        const prefix = flowType === "coaching" ? "coaching" : "cv";
        if (method === "mbway") {
            document.getElementById(`mbway-phone-${prefix}`).textContent = details.phone || "";
        } else if (method === "mb") {
            document.getElementById(`mb-entity-${prefix}`).textContent = details.entity || "N/A";
            document.getElementById(`mb-ref-${prefix}`).textContent = details.reference || "N/A";
            document.getElementById(`mb-amount-${prefix}`).textContent = details.amount || "N/A";
            document.getElementById(`mb-expiry-${prefix}`).textContent = details.expiryDate || "N/A";
        } else if (method === "payshop") {
            document.getElementById(`payshop-ref-${prefix}`).textContent = details.reference || "N/A";
            document.getElementById(`payshop-amount-${prefix}`).textContent = details.amount || "N/A";
            document.getElementById(`payshop-expiry-${prefix}`).textContent = details.expiryDate || "N/A";
        } else if (method === "revolut" || method === "bank-transfer") {
            const otherDetailsDiv = document.getElementById(`other-payment-details-${prefix}`);
            if (otherDetailsDiv) {
                if (method === "revolut") {
                    otherDetailsDiv.innerHTML = `<p>Por favor, efetue o pagamento para o Revolut:</p><ul><li><strong>Username:</strong> @samuelrolo</li><li><strong>Valor:</strong> ${details.amount}€</li></ul><p>Envie o comprovativo para srshare2inspire@gmail.com mencionando o ID: ${details.orderId}.</p>`;
                } else { // bank-transfer
                    otherDetailsDiv.innerHTML = `<p>Por favor, efetue a transferência bancária para:</p><ul><li><strong>IBAN:</strong> LT38 3250 0674 3397 9375</li><li><strong>Nome:</strong> Samuel Rolo Gonçalves</li><li><strong>Valor:</strong> ${details.amount}€</li></ul><p>Envie o comprovativo para srshare2inspire@gmail.com mencionando o ID: ${details.orderId}.</p>`;
                }
            }
        }
        showPaymentInstructions(flowType, method);
    };

    const handlePaymentMethodSelection = (flowType, method) => {
        selectedPaymentMethod = method;
        console.log(`Payment method selected (${flowType}): ${method}`);
        const methodsContainer = flowType === "coaching" ? paymentMethodsCoachingDiv : paymentMethodsCvDiv;
        methodsContainer.querySelectorAll(".payment-method").forEach(btn => {
            btn.classList.remove("selected");
            if (btn.dataset.method === method) {
                btn.classList.add("selected");
            }
        });
        // Show relevant details area, hide others
        hideAllPaymentInstructions(flowType);
        const detailsDiv = flowType === "coaching" ? paymentDetailsCoachingDiv : paymentDetailsCvDiv;
        if (detailsDiv) detailsDiv.classList.remove("hidden"); // Show the container

        // For non-API methods, show details immediately
        if (method === "revolut" || method === "bank-transfer") {
            const amount = flowType === "coaching" ? parseFloat(paymentAmountSpan.textContent.replace("€","")) : parseFloat(cvFinalPriceSpan.textContent.replace("€",""));
            const orderId = currentBookingData.orderId || `TEMP_${Date.now()}`;
            updatePaymentDetails(flowType, method, { amount: amount, orderId: orderId });
        }
    };

    const showConfirmationScreen = (data) => {
        confirmServiceSpan.textContent = data.serviceName || "N/A";
        confirmNameSpan.textContent = data.userName || "N/A";
        confirmEmailSpan.textContent = data.userEmail || "N/A";
        confirmDatetimeSpan.textContent = data.dateTime || "N/A";
        confirmPriceSpan.textContent = data.priceText || "N/A";
        confirmPaymentMethodSpan.textContent = data.paymentMethodText || "N/A";
        showScreen(bookingConfirmationScreen);
    };

    // --- Event Listeners Setup ---
    if (!serviceSelectionScreen || !coachingFlow || !cvReviewFlow || !selectCoachingBtn || !selectCvReviewBtn) {
        console.error("One or more essential elements for service selection are missing!");
        return;
    }
    console.log("Service selection elements found.");

    selectCoachingBtn.addEventListener("click", () => {
        console.log("Coaching button clicked");
        currentFlow = "coaching";
        resetForm(userFormCoaching);
        resetForm(coachingForm);
        if (coachingSummarySection) coachingSummarySection.classList.add("hidden");
        if (coachingBookingContainer) coachingBookingContainer.style.display = "flex"; // Show options/calendar
        showScreen(coachingFlow);
        // Initialize or refresh calendar if needed
        if (window.initializeCalendar) window.initializeCalendar(); 
    });

    selectCvReviewBtn.addEventListener("click", () => {
        console.log("CV Review button clicked");
        currentFlow = "cv";
        resetForm(cvReviewForm);
        showScreen(cvReviewFlow);
    });

    // Back Buttons
    if (backButtonCoaching) {
        backButtonCoaching.addEventListener("click", () => {
            console.log("Back button (Coaching Summary) clicked");
            if (coachingSummarySection) coachingSummarySection.classList.add("hidden");
            if (coachingBookingContainer) coachingBookingContainer.style.display = "flex"; // Show options/calendar again
            // Don't go back to service selection, just hide summary
        });
    }
    if (backButtonCv) {
        backButtonCv.addEventListener("click", () => {
            console.log("Back button (CV Review) clicked");
            resetForm(cvReviewForm);
            showScreen(serviceSelectionScreen);
        });
    }

    // Payment Method Buttons
    paymentMethodsCoachingDiv.querySelectorAll(".payment-method").forEach(btn => {
        btn.addEventListener("click", () => handlePaymentMethodSelection("coaching", btn.dataset.method));
    });
    paymentMethodsCvDiv.querySelectorAll(".payment-method").forEach(btn => {
        btn.addEventListener("click", () => handlePaymentMethodSelection("cv", btn.dataset.method));
    });

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
        cvReviewForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            console.log("CV Review form submitted");

            if (!selectedPaymentMethod) {
                alert("Por favor, selecione um método de pagamento."); return;
            }

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
            const termsAccepted = termsAcceptCvCheckbox.checked;

            if (!selectedOption.value) { alert("Por favor, selecione o serviço desejado."); return; }
            if (!userName || !userEmail || !userPhone) { alert("Por favor, preencha todos os seus dados (Nome, Email, Telefone)."); return; }
            if (!cvFile) { alert("Por favor, anexe o seu CV."); return; }
            const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowedTypes.includes(cvFile.type)) { alert("Tipo de ficheiro inválido. Por favor, anexe um PDF, DOC ou DOCX."); return; }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (cvFile.size > maxSize) { alert("O ficheiro excede o tamanho máximo de 5MB."); return; }
            if (!termsAccepted) { alert("Por favor, leia e aceite os termos e condições."); return; }

            disableConfirmButton("cv");

            currentBookingData = {
                flow: "cv",
                serviceName: serviceName,
                amount: amount,
                userName: userName,
                userEmail: userEmail,
                userPhone: userPhone,
                userNotes: userNotes,
                orderId: `CV_${Date.now()}`,
                paymentMethod: selectedPaymentMethod,
                paymentMethodText: paymentMethodsCvDiv.querySelector(`.payment-method[data-method="${selectedPaymentMethod}"]`)?.innerText || selectedPaymentMethod,
                priceText: priceText
                // CV file needs handling separately if uploading to backend
            };

            try {
                let paymentResult = null;
                let endpoint = "";
                let payload = {};

                // --- Prepare Payment Request based on method ---
                if (selectedPaymentMethod === "mbway") {
                    endpoint = "/api/create-mbway-payment";
                    payload = {
                        amount: currentBookingData.amount,
                        phone: currentBookingData.userPhone,
                        orderId: currentBookingData.orderId,
                        description: `CV: ${currentBookingData.serviceName}`
                    };
                } else if (selectedPaymentMethod === "mb") {
                    endpoint = "/api/create-mb-reference";
                    payload = {
                        amount: currentBookingData.amount,
                        orderId: currentBookingData.orderId,
                        description: `CV: ${currentBookingData.serviceName}`,
                        // expiryDays: 3 // Optional: backend has default
                    };
                } else if (selectedPaymentMethod === "payshop") {
                    endpoint = "/api/create-payshop-reference";
                    payload = {
                        amount: currentBookingData.amount,
                        orderId: currentBookingData.orderId,
                        description: `CV: ${currentBookingData.serviceName}`,
                        // expiryDays: 2 // Optional: backend has default
                    };
                } else if (selectedPaymentMethod === "revolut" || selectedPaymentMethod === "bank-transfer") {
                    // No API call needed, just show instructions (already shown on selection)
                    console.log(`Processing ${selectedPaymentMethod} for CV Review`);
                    paymentResult = { success: true, message: `Instruções de pagamento (${selectedPaymentMethod}) apresentadas. Envie o comprovativo.` };
                } else {
                    throw new Error("Método de pagamento inválido selecionado.");
                }

                // --- Call Backend API (if applicable) ---
                if (endpoint) {
                    console.log(`Calling backend endpoint: ${endpoint}`);
                    const response = await fetch(`${backendUrl}${endpoint}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    paymentResult = await response.json();

                    if (!response.ok || !paymentResult.success) {
                        throw new Error(paymentResult.message || "Erro ao processar pagamento.");
                    }
                    console.log(`Backend response for ${selectedPaymentMethod}:`, paymentResult);
                }

                // --- Update UI based on Payment Result ---
                if (paymentResult.success) {
                    if (selectedPaymentMethod === "mbway") {
                        updatePaymentDetails("cv", "mbway", { phone: currentBookingData.userPhone });
                        alert(paymentResult.message); // "Aguarde confirmação..."
                        // Keep button disabled until callback (not implemented here)
                        disableConfirmButton("cv", "Aguarde Confirmação MB WAY"); 
                    } else if (selectedPaymentMethod === "mb" || selectedPaymentMethod === "payshop") {
                        updatePaymentDetails("cv", selectedPaymentMethod, paymentResult.paymentDetails);
                        alert(paymentResult.message); // "Referência gerada..."
                        disableConfirmButton("cv", "Referência Gerada"); // Disable after generating ref
                    } else { // Revolut, Bank Transfer
                         alert(paymentResult.message); // "Instruções apresentadas..."
                         disableConfirmButton("cv", "Aguarde Comprovativo");
                    }

                    // --- Send Confirmation Email --- 
                    // Send email regardless of payment method for now
                    console.log("Sending confirmation email via backend...");
                    const emailSubject = `Confirmação Pedido Share2Inspire - ${currentBookingData.serviceName}`;
                    const emailTextBody = `Olá ${currentBookingData.userName},

O seu pedido para "${currentBookingData.serviceName}" (ID: ${currentBookingData.orderId}) foi recebido.
Valor: ${currentBookingData.priceText}
Método de Pagamento: ${currentBookingData.paymentMethodText}

${selectedPaymentMethod === 'mbway' ? 'Aguarde a notificação na sua aplicação MB WAY para confirmar.' : ''}${selectedPaymentMethod === 'mb' || selectedPaymentMethod === 'payshop' ? 'Por favor, utilize a referência gerada para efetuar o pagamento.' : ''}${selectedPaymentMethod === 'revolut' || selectedPaymentMethod === 'bank-transfer' ? 'Por favor, efetue o pagamento conforme as instruções e envie o comprovativo para srshare2inspire@gmail.com.' : ''}

Analisaremos o seu CV e entraremos em contacto em breve (após confirmação do pagamento, se aplicável).

Notas adicionais: ${currentBookingData.userNotes || "Nenhuma"}

Obrigado,
Equipa Share2Inspire`;
                    const emailHtmlBody = `<p>Olá ${currentBookingData.userName},</p><p>O seu pedido para "<b>${currentBookingData.serviceName}</b>" (ID: ${currentBookingData.orderId}) foi recebido.</p><p><b>Valor:</b> ${currentBookingData.priceText}</p><p><b>Método de Pagamento:</b> ${currentBookingData.paymentMethodText}</p><p>${selectedPaymentMethod === 'mbway' ? 'Aguarde a notificação na sua aplicação MB WAY para confirmar.' : ''}${selectedPaymentMethod === 'mb' || selectedPaymentMethod === 'payshop' ? 'Por favor, utilize a referência gerada para efetuar o pagamento.' : ''}${selectedPaymentMethod === 'revolut' || selectedPaymentMethod === 'bank-transfer' ? 'Por favor, efetue o pagamento conforme as instruções e envie o comprovativo para srshare2inspire@gmail.com.' : ''}</p><p>Analisaremos o seu CV e entraremos em contacto em breve (após confirmação do pagamento, se aplicável).</p><p><b>Notas adicionais:</b> ${currentBookingData.userNotes || "Nenhuma"}</p><p>Obrigado,<br>Equipa Share2Inspire</p>`;

                    const emailPayload = { to: currentBookingData.userEmail, subject: emailSubject, text: emailTextBody, html: emailHtmlBody };
                    const emailResponse = await fetch(`${backendUrl}/api/send-confirmation-email`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(emailPayload)
                    });
                    const emailResult = await emailResponse.json();
                    if (!emailResponse.ok || !emailResult.success) {
                        console.error("Email sending failed:", emailResult);
                        alert(`Referência/Pagamento processado, mas houve um erro ao enviar o e-mail de confirmação: ${emailResult.message || "Verifique a sua caixa de correio."}`);
                    } else {
                        console.log("Confirmation email sent successfully (simulated or real):", emailResult);
                    }

                    // Optionally move to confirmation screen after a delay or specific action
                    // For MB/Payshop/Transfer, maybe don't go to final confirmation immediately
                    if (selectedPaymentMethod === "mbway") {
                         // Maybe wait for callback? For now, just leave the instructions visible.
                    } else {
                        // Maybe show a different confirmation message here?
                        // showConfirmationScreen(currentBookingData); // Or delay this
                    }

                } else { // Payment initiation/generation failed
                    throw new Error(paymentResult.message || "Erro desconhecido no pagamento.");
                }

            } catch (error) {
                console.error("Error during CV review submission process:", error);
                alert(`Ocorreu um erro: ${error.message}`);
                enableConfirmButton("cv"); // Re-enable button on error
            }
            // Note: Button might remain disabled for MBWAY/Ref payments until action/callback
        });
    } else {
        console.error("CV Review form not found.");
    }

    // --- Coaching Flow Logic ---
    // TODO: Implement Price Calculation Logic
    // TODO: Implement Calendar Interaction Logic (to select date/time)
    // TODO: Implement Coaching Summary Population

    if (confirmBookingCoachingBtn) {
        confirmBookingCoachingBtn.addEventListener("click", async () => {
            console.log("Coaching confirm button clicked");

            if (!selectedPaymentMethod) {
                alert("Por favor, selecione um método de pagamento."); return;
            }
            if (!selectedDate || !selectedTime) {
                 alert("Por favor, selecione uma data e hora no calendário."); return;
            }

            // --- Validation ---
            const serviceName = "Kickstart Pro ! Express coaching";
            const sessionType = sessionTypeSelect.value;
            const duration = sessionDurationSelect.value;
            const quantity = parseInt(sessionQuantitySelect.value, 10);
            const priceText = finalPriceSpanCoaching.textContent;
            const amountToPayNow = parseFloat(paymentAmountSpan.textContent.replace("€", "")); // Use amount to pay now
            const userName = userNameCoachingInput.value.trim();
            const userEmail = userEmailCoachingInput.value.trim();
            const userPhone = userPhoneCoachingInput.value.trim();
            const userNotes = userNotesCoachingInput.value.trim();
            const termsAccepted = termsAcceptCoachingCheckbox.checked;
            const dateTime = `${selectedDate} ${selectedTime}`;

            if (!userName || !userEmail || !userPhone) { alert("Por favor, preencha todos os seus dados (Nome, Email, Telefone)."); return; }
            if (!termsAccepted) { alert("Por favor, leia e aceite os termos e condições."); return; }

            disableConfirmButton("coaching");

            currentBookingData = {
                flow: "coaching",
                serviceName: serviceName,
                sessionType: sessionType,
                duration: duration,
                quantity: quantity,
                dateTime: dateTime,
                amount: amountToPayNow, // Amount to charge now
                totalAmount: parseFloat(summaryPriceSpan.textContent.replace("€","")), // Total booking price
                userName: userName,
                userEmail: userEmail,
                userPhone: userPhone,
                userNotes: userNotes,
                orderId: `COACH_${Date.now()}`,
                paymentMethod: selectedPaymentMethod,
                paymentMethodText: paymentMethodsCoachingDiv.querySelector(`.payment-method[data-method="${selectedPaymentMethod}"]`)?.innerText || selectedPaymentMethod,
                priceText: `${amountToPayNow}€` // Price text for confirmation screen
            };

            try {
                let paymentResult = null;
                let endpoint = "";
                let payload = {};

                // --- Prepare Payment Request based on method ---
                if (selectedPaymentMethod === "mbway") {
                    endpoint = "/api/create-mbway-payment";
                    payload = {
                        amount: currentBookingData.amount,
                        phone: currentBookingData.userPhone,
                        orderId: currentBookingData.orderId,
                        description: `Coaching: ${currentBookingData.dateTime}`
                    };
                } else if (selectedPaymentMethod === "mb") {
                    endpoint = "/api/create-mb-reference";
                    payload = {
                        amount: currentBookingData.amount,
                        orderId: currentBookingData.orderId,
                        description: `Coaching: ${currentBookingData.dateTime}`,
                    };
                } else if (selectedPaymentMethod === "payshop") {
                    endpoint = "/api/create-payshop-reference";
                    payload = {
                        amount: currentBookingData.amount,
                        orderId: currentBookingData.orderId,
                        description: `Coaching: ${currentBookingData.dateTime}`,
                    };
                } else if (selectedPaymentMethod === "revolut" || selectedPaymentMethod === "bank-transfer") {
                    console.log(`Processing ${selectedPaymentMethod} for Coaching`);
                    paymentResult = { success: true, message: `Instruções de pagamento (${selectedPaymentMethod}) apresentadas. Envie o comprovativo.` };
                } else {
                    throw new Error("Método de pagamento inválido selecionado.");
                }

                // --- Call Backend API (if applicable) ---
                if (endpoint) {
                    console.log(`Calling backend endpoint: ${endpoint}`);
                    const response = await fetch(`${backendUrl}${endpoint}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    paymentResult = await response.json();
                    if (!response.ok || !paymentResult.success) {
                        throw new Error(paymentResult.message || "Erro ao processar pagamento.");
                    }
                    console.log(`Backend response for ${selectedPaymentMethod}:`, paymentResult);
                }

                // --- Update UI based on Payment Result ---
                if (paymentResult.success) {
                    if (selectedPaymentMethod === "mbway") {
                        updatePaymentDetails("coaching", "mbway", { phone: currentBookingData.userPhone });
                        alert(paymentResult.message);
                        disableConfirmButton("coaching", "Aguarde Confirmação MB WAY");
                    } else if (selectedPaymentMethod === "mb" || selectedPaymentMethod === "payshop") {
                        updatePaymentDetails("coaching", selectedPaymentMethod, paymentResult.paymentDetails);
                        alert(paymentResult.message);
                        disableConfirmButton("coaching", "Referência Gerada");
                    } else { // Revolut, Bank Transfer
                         alert(paymentResult.message);
                         disableConfirmButton("coaching", "Aguarde Comprovativo");
                    }

                    // --- Send Confirmation Email --- 
                    console.log("Sending confirmation email via backend...");
                    const emailSubject = `Confirmação Marcação Share2Inspire - ${currentBookingData.serviceName}`;
                    const emailTextBody = `Olá ${currentBookingData.userName},

Confirmamos a sua marcação para "${currentBookingData.serviceName}" (ID: ${currentBookingData.orderId}).
Data/Hora: ${currentBookingData.dateTime}
Valor Pago/Pendente: ${currentBookingData.priceText}
Método de Pagamento: ${currentBookingData.paymentMethodText}

${selectedPaymentMethod === 'mbway' ? 'Aguarde a notificação na sua aplicação MB WAY para confirmar.' : ''}${selectedPaymentMethod === 'mb' || selectedPaymentMethod === 'payshop' ? 'Por favor, utilize a referência gerada para efetuar o pagamento.' : ''}${selectedPaymentMethod === 'revolut' || selectedPaymentMethod === 'bank-transfer' ? 'Por favor, efetue o pagamento conforme as instruções e envie o comprovativo para srshare2inspire@gmail.com.' : ''}

${currentBookingData.totalAmount > currentBookingData.amount ? `Valor restante a pagar no dia: ${currentBookingData.totalAmount - currentBookingData.amount}€` : ''}

Notas adicionais: ${currentBookingData.userNotes || "Nenhuma"}

Até breve,
Equipa Share2Inspire`;
                    const emailHtmlBody = `<p>Olá ${currentBookingData.userName},</p><p>Confirmamos a sua marcação para "<b>${currentBookingData.serviceName}</b>" (ID: ${currentBookingData.orderId}).</p><p><b>Data/Hora:</b> ${currentBookingData.dateTime}</p><p><b>Valor Pago/Pendente:</b> ${currentBookingData.priceText}</p><p><b>Método de Pagamento:</b> ${currentBookingData.paymentMethodText}</p><p>${selectedPaymentMethod === 'mbway' ? 'Aguarde a notificação na sua aplicação MB WAY para confirmar.' : ''}${selectedPaymentMethod === 'mb' || selectedPaymentMethod === 'payshop' ? 'Por favor, utilize a referência gerada para efetuar o pagamento.' : ''}${selectedPaymentMethod === 'revolut' || selectedPaymentMethod === 'bank-transfer' ? 'Por favor, efetue o pagamento conforme as instruções e envie o comprovativo para srshare2inspire@gmail.com.' : ''}</p><p>${currentBookingData.totalAmount > currentBookingData.amount ? `Valor restante a pagar no dia: <b>${currentBookingData.totalAmount - currentBookingData.amount}€</b>` : ''}</p><p><b>Notas adicionais:</b> ${currentBookingData.userNotes || "Nenhuma"}</p><p>Até breve,<br>Equipa Share2Inspire</p>`;

                    const emailPayload = { to: currentBookingData.userEmail, subject: emailSubject, text: emailTextBody, html: emailHtmlBody };
                    const emailResponse = await fetch(`${backendUrl}/api/send-confirmation-email`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(emailPayload)
                    });
                    const emailResult = await emailResponse.json();
                    if (!emailResponse.ok || !emailResult.success) {
                        console.error("Email sending failed:", emailResult);
                        alert(`Referência/Pagamento processado, mas houve um erro ao enviar o e-mail de confirmação: ${emailResult.message || "Verifique a sua caixa de correio."}`);
                    } else {
                        console.log("Confirmation email sent successfully (simulated or real):", emailResult);
                    }

                    // Optionally move to confirmation screen
                    // showConfirmationScreen(currentBookingData);

                } else { // Payment initiation/generation failed
                    throw new Error(paymentResult.message || "Erro desconhecido no pagamento.");
                }

            } catch (error) {
                console.error("Error during Coaching confirmation process:", error);
                alert(`Ocorreu um erro: ${error.message}`);
                enableConfirmButton("coaching"); // Re-enable button on error
            }
        });
    }

    // --- Modal Logic ---
    const openModal = () => termsModal.style.display = "block";
    const closeModal = () => termsModal.style.display = "none";

    if (openTermsModalCoachingLink) openTermsModalCoachingLink.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
    if (openTermsModalCvLink) openTermsModalCvLink.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
    if (closeTermsModalBtn) closeTermsModalBtn.addEventListener("click", closeModal);
    if (acceptTermsModalBtn) acceptTermsModalBtn.addEventListener("click", () => {
        if (currentFlow === "coaching" && termsAcceptCoachingCheckbox) termsAcceptCoachingCheckbox.checked = true;
        if (currentFlow === "cv" && termsAcceptCvCheckbox) termsAcceptCvCheckbox.checked = true;
        closeModal();
    });
    window.addEventListener("click", (event) => { // Close if clicked outside
        if (event.target == termsModal) closeModal();
    });

    // --- Global Calendar Event Callback (called from calendar.js) ---
    window.handleDateSelect = function(info) {
        console.log("Date selected:", info);
        selectedDate = info.startStr.split('T')[0]; // Store just the date
        selectedTime = info.startStr.split('T')[1]?.substring(0, 5); // Store HH:MM

        if (!selectedDate || !selectedTime) {
            console.error("Could not parse date/time from selection");
            return;
        }

        // Populate and show the coaching summary section
        if (coachingSummarySection) {
            // TODO: Update summary details based on coachingForm selections and selectedDate/Time
            summaryDatetimeSpan.textContent = `${selectedDate} às ${selectedTime}`;
            // Update other fields like price, duration, type based on form
            // Example: summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text;
            // Example: summaryPriceSpan.textContent = finalPriceSpanCoaching.textContent;
            // Calculate payment amount based on policy
            const totalAmount = parseFloat(finalPriceSpanCoaching.textContent.replace("€",""));
            let amountToPay = totalAmount;
            if (totalAmount > 10) {
                amountToPay = Math.max(10, totalAmount * 0.5);
                paymentTypeSpan.textContent = "Pagamento Parcial (50% ou 10€ min)";
                remainingAmountSpan.textContent = `${(totalAmount - amountToPay).toFixed(2)}€`;
                remainingPaymentInfoDiv.style.display = "block";
            } else {
                paymentTypeSpan.textContent = "Pagamento Total";
                remainingPaymentInfoDiv.style.display = "none";
            }
            paymentAmountSpan.textContent = `${amountToPay.toFixed(2)}€`;

            coachingBookingContainer.style.display = "none"; // Hide calendar/options
            coachingSummarySection.classList.remove("hidden");
        } else {
            console.error("Coaching summary section not found");
        }
    };

    // Initial setup
    showScreen(serviceSelectionScreen);

});

