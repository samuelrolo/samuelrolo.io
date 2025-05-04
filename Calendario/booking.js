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

    // --- Helper Functions --    const showScreen = (screenToShow) => {
        console.log("[showScreen] Called for:", screenToShow ? screenToShow.id : 'null'); // Debug
        [serviceSelectionScreen, coachingFlow, cvReviewFlow, bookingConfirmationScreen].forEach(screen => {
            if (screen) {
                screen.style.display = "none";
                // console.log(`[showScreen] Hid screen: ${screen.id}`); // Debug - Less verbose
            }
        });
        if (screenToShow) {
            console.log(`[showScreen] Attempting to show screen: ${screenToShow.id}`); // Debug
            screenToShow.style.display = "block";
            // Add a small delay to check computed style, as it might not update instantly
            setTimeout(() => {
                console.log(`[showScreen] Computed display style for ${screenToShow.id}:`, window.getComputedStyle(screenToShow).display); // Debug
            }, 100); 
        } else {
            console.log("[showScreen] screenToShow is null or undefined"); // Debug
        }
    };    // --- Original showScreen function commented out for debugging ---
    /*
    const showScreen = (screenToShow) => {
        console.log("showScreen called for:", screenToShow ? screenToShow.id : 'null'); // Debug
        [serviceSelectionScreen, coachingFlow, cvReviewFlow, bookingConfirmationScreen].forEach(screen => {
            if (screen) {
                // console.log(`Hiding screen: ${screen.id}`); // Debug - too verbose
                screen.style.display = "none";
            }
        });
        if (screenToShow) {
            console.log(`Attempting to show screen: ${screenToShow.id}`); // Debug
            screenToShow.style.display = "block";
            console.log(`Current display style for ${screenToShow.id}:`, window.getComputedStyle(screenToShow).display); // Debug
        } else {
            console.log("screenToShow is null or undefined"); // Debug
        }
    };
    */

    // --- Use the temporary function for debugging ---
    // const showScreen = showScreen_TEMP_DEBUG;

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

    // --- DEBUG: Check if selectCvReviewBtn exists before adding listener ---
    if (selectCvReviewBtn) {
        console.log("DEBUG: selectCvReviewBtn element found, attaching listener.");
        selectCvReviewBtn.addEventListener("click", () => {
            alert("CV Review button clicked! Attempting to show screen..."); // DEBUG ALERT
            console.log("CV Review button clicked");
            currentFlow = "cv";
            resetForm(cvReviewForm);
            showScreen(cvReviewFlow);
        });
    } else {
        console.error("DEBUG: selectCvReviewBtn element NOT found!");
    }
    // --- END DEBUG ---

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

            if (!userName || !userEmail || !userPhone) { alert("Por favor, preenche todos os teus dados (Nome, Email, Telefone)."); return; }
            if (!cvFile) { alert("Por favor, anexe o teu CV (ficheiro PDF, DOC ou DOCX)."); return; }
            if (!termsAccepted) { alert("Por favor, aceite os termos e condições."); return; }
            if (amount <= 0) { alert("Por favor, selecione um serviço válido."); return; }

            disableConfirmButton("cv");

            currentBookingData = {
                serviceName: serviceName,
                userName: userName,
                userEmail: userEmail,
                userPhone: userPhone,
                userNotes: userNotes,
                price: amount,
                priceText: priceText,
                paymentMethod: selectedPaymentMethod,
                paymentMethodText: selectedPaymentMethod.replace("-", " ").toUpperCase(), // Basic text representation
                flow: "cv"
                // No dateTime for CV review
            };

            console.log("Booking data (CV):", currentBookingData);

            // Simulate backend interaction for payment initiation
            try {
                // For MB WAY, MB, Payshop - simulate getting reference/starting process
                if (["mbway", "mb", "payshop"].includes(selectedPaymentMethod)) {
                    console.log(`Simulating ${selectedPaymentMethod} payment initiation...`);
                    // Simulate API call to backend
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                    const mockPaymentDetails = {
                        orderId: `CV_${Date.now()}`,
                        amount: amount,
                        phone: selectedPaymentMethod === "mbway" ? userPhone : undefined,
                        entity: selectedPaymentMethod === "mb" ? "12345" : undefined,
                        reference: selectedPaymentMethod === "mb" || selectedPaymentMethod === "payshop" ? Math.floor(100000000 + Math.random() * 900000000).toString() : undefined,
                        expiryDate: selectedPaymentMethod === "mb" || selectedPaymentMethod === "payshop" ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-PT") : undefined
                    };
                    currentBookingData.orderId = mockPaymentDetails.orderId;
                    updatePaymentDetails("cv", selectedPaymentMethod, mockPaymentDetails);
                    // For MB/Payshop, we just show details. For MB WAY, we might show a waiting message.
                    if (selectedPaymentMethod === "mbway") {
                         // Keep button disabled, user confirms in app
                         disableConfirmButton("cv", "Confirme na App MB WAY");
                         // In a real scenario, backend would poll or receive webhook
                         // For simulation, we'll just wait a bit then show confirmation
                         setTimeout(() => {
                             console.log("Simulating MB WAY payment confirmation...");
                             // Simulate sending confirmation email
                             sendConfirmationEmail(currentBookingData);
                             showConfirmationScreen(currentBookingData);
                         }, 10000); // Wait 10 seconds
                    } else {
                        // MB / Payshop: User needs to pay manually. Show confirmation screen with details.
                        sendConfirmationEmail(currentBookingData); // Send email immediately
                        const paymentInfo = document.getElementById(`${selectedPaymentMethod}-reference-cv`).innerHTML;
                        document.getElementById("payment-confirmation-details").innerHTML = `<p><strong>Detalhes para Pagamento (${currentBookingData.paymentMethodText}):</strong></p>${paymentInfo}`;
                        document.getElementById("confirmation-text").textContent = "O seu pedido foi recebido. A confirmação final será enviada após validação do pagamento.";
                        showScreen(confirmationScreen);
                        // No need to re-enable button here as flow ends
                    }
                } else {
                    // Revolut / Bank Transfer - Already shown details. Just proceed to confirmation.
                    currentBookingData.orderId = `CV_${Date.now()}`;
                    updatePaymentDetails("cv", selectedPaymentMethod, { amount: amount, orderId: currentBookingData.orderId }); // Update with final order ID
                    sendConfirmationEmail(currentBookingData);
                    const paymentInfo = document.getElementById(`other-payment-details-cv`).innerHTML;
                    document.getElementById("payment-confirmation-details").innerHTML = `<p><strong>Detalhes para Pagamento (${currentBookingData.paymentMethodText}):</strong></p>${paymentInfo}`;
                    document.getElementById("confirmation-text").textContent = "O seu pedido foi recebido. A confirmação final será enviada após envio e validação do comprovativo.";
                    showScreen(confirmationScreen);
                }

            } catch (error) {
                console.error("Error during CV booking submission:", error);
                alert("Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.");
                enableConfirmButton("cv");
            }
        });
    } else {
        console.error("CV Review form not found.");
    }

    // --- Coaching Flow Logic (Placeholder/Simplified) ---
    // ... (Existing coaching logic for price calculation, calendar interaction etc.) ...
    // Need to integrate the booking summary and confirmation logic similar to CV review
    if (coachingForm) {
        // Add listeners for coaching form changes (duration, quantity) to update price
        // Add logic for calendar selection to store date/time
        // Add logic for confirmBookingCoachingBtn click
        // Similar validation, backend call simulation, confirmation screen display
    }

    // --- Common Modal Logic ---
    const openModal = (flowType) => {
        // Load specific policy text if needed
        const policyText = flowType === "coaching" ?
            "Para valores acima de 10€, é exigido apenas 50% do valor total no momento da reserva (mínimo 10€)." :
            "Pagamento integral no momento da solicitação.";
        document.getElementById("modal-payment-policy").textContent = policyText;
        termsModal.style.display = "block";
    };
    const closeModal = () => {
        termsModal.style.display = "none";
    };

    if (openTermsModalCoachingLink) openTermsModalCoachingLink.addEventListener("click", (e) => { e.preventDefault(); openModal("coaching"); });
    if (openTermsModalCvLink) openTermsModalCvLink.addEventListener("click", (e) => { e.preventDefault(); openModal("cv"); });
    termsModal.querySelector(".close-button").addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target == termsModal) closeModal();
    });

    // --- Email Sending Function ---
    async function sendConfirmationEmail(data) {
        console.log("Attempting to send confirmation email with data:", data);
        try {
            const response = await fetch(`${backendUrl}/send-confirmation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Confirmation email sent successfully:', result);
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            // Inform user? Maybe not critical path if booking is stored
        }
    }

    // Initial setup
    showScreen(serviceSelectionScreen);
    console.log("Initial screen set to service selection.");

});

