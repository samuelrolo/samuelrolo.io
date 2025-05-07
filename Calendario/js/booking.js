document.addEventListener("DOMContentLoaded", function() {
    // Cache DOM elements that are static or globally needed
    const coachingServiceButton = document.getElementById("select-coaching");
    const cvReviewServiceButton = document.getElementById("select-cv-review");

    // DEBUG: Verificar se os botões de serviço são encontrados
    console.log("DEBUG: Tentando encontrar o botão de serviço de coaching:", coachingServiceButton);
    console.log("DEBUG: Tentando encontrar o botão de serviço de revisão de CV:", cvReviewServiceButton);

    const coachingOptionsDiv = document.getElementById("coaching-options");
    console.log("DEBUG: Valor inicial de coachingOptionsDiv:", coachingOptionsDiv); // DEBUG ADICIONADO
    const cvReviewOptionsDiv = document.getElementById("cv-review-options");
    const calendarDiv = document.getElementById("calendar-container"); // Assuming this is the main calendar display area
    console.log("DEBUG: Valor inicial de calendarDiv:", calendarDiv); // DEBUG ADICIONADO

    // Coaching flow specific elements (some might be initialized later)
    const coachingTypeSelect = document.getElementById("coaching-type");
    const coachingDurationSelect = document.getElementById("coaching-duration");
    const coachingQuantitySelect = document.getElementById("coaching-quantity");
    const coachingSummarySection = document.getElementById("booking-summary-coaching"); // This is key
    console.log("DEBUG: Valor inicial de coachingSummarySection:", coachingSummarySection);
    const coachingBookingContainer = document.getElementById("coaching-flow")?.querySelector(".booking-container");


    // CV Review flow specific elements
    const cvReviewSummarySection = document.getElementById("booking-summary-cv-review");
    console.log("DEBUG: Valor inicial de cvReviewSummarySection:", cvReviewSummarySection);
    const cvReviewForm = document.getElementById("cv-review-form");
    const userNameCvInput = document.getElementById("user-name-cv");
    const userEmailCvInput = document.getElementById("user-email-cv");
    const userPhoneCvInput = document.getElementById("user-phone-cv");
    const userNotesCvInput = document.getElementById("user-notes-cv");
    const cvFileUploadInput = document.getElementById("cv-file-upload");
    const confirmBookingCvBtn = document.getElementById("confirm-booking-cv-review");
    const cvBookingContainer = document.getElementById("cv-review-flow")?.querySelector(".booking-container");


    // Modal elements
    const termsModal = document.getElementById("terms-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");

    // Backend URL (ensure this is correct for production)
    const backendUrl = "http://localhost:3000"; // Update if necessary

    // --- Service Selection ---
    if (coachingServiceButton) {
        coachingServiceButton.addEventListener("click", () => {
            console.log("DEBUG: Botão de serviço de Coaching CLICADO");
            showCoachingOptions();
            hideCvReviewOptions();
            console.log("DEBUG: Tentando mostrar o calendário. calendarDiv:", calendarDiv); // DEBUG ADICIONADO
            if (calendarDiv) calendarDiv.classList.remove("hidden"); // Show calendar for coaching
        });
    }

    if (cvReviewServiceButton) {
        cvReviewServiceButton.addEventListener("click", () => {
            console.log("DEBUG: Botão de serviço de Revisão de CV CLICADO");
            showCvReviewOptions();
            hideCoachingOptions();
            if (calendarDiv) calendarDiv.classList.add("hidden"); // Hide calendar for CV review
            if (cvReviewSummarySection) cvReviewSummarySection.classList.remove("hidden"); // Show CV summary directly
            if (cvBookingContainer) cvBookingContainer.style.display = "none"; // Hide CV options
            if (typeof window.initializeCvReviewInteractions === "function") {
                window.initializeCvReviewInteractions();
            }
        });
    }

    function showCoachingOptions() {
        console.log("DEBUG: showCoachingOptions() chamada. coachingOptionsDiv:", coachingOptionsDiv); // DEBUG ADICIONADO
        if (coachingOptionsDiv) coachingOptionsDiv.classList.remove("hidden");
        if (coachingSummarySection) coachingSummarySection.classList.add("hidden"); // Hide summary initially
    }

    function hideCoachingOptions() {
        if (coachingOptionsDiv) coachingOptionsDiv.classList.add("hidden");
    }

    function showCvReviewOptions() { // This might be combined with showing the summary directly
        if (cvReviewOptionsDiv) cvReviewOptionsDiv.classList.remove("hidden");
        if (cvReviewSummarySection) cvReviewSummarySection.classList.add("hidden");
    }

    function hideCvReviewOptions() {
        if (cvReviewOptionsDiv) cvReviewOptionsDiv.classList.add("hidden");
    }

    // --- Modal Logic ---
    function openModalGlobal(serviceType) {
        // This function might need to be adapted if modal content is dynamic
        if (termsModal) termsModal.style.display = "block";
    }
    window.openModalGlobal = openModalGlobal; // Make it globally accessible if needed by other scripts

    if (closeModalButtons) {
        closeModalButtons.forEach(button => {
            button.addEventListener("click", () => {
                if (termsModal) termsModal.style.display = "none";
            });
        });
    }
    window.addEventListener("click", function(event) {
        if (event.target == termsModal) {
            termsModal.style.display = "none";
        }
    });

    // --- Coaching Flow Specific Initializations (Moved to a callable function) ---
    // These elements are defined globally or within DOMContentLoaded for broader access if needed,
    // but their event listeners are set up dynamically.
    const userFormCoaching = document.getElementById("booking-form"); // Assuming this is the coaching form
    const userNameCoachingInput = document.getElementById("user-name-coaching");
    const userEmailCoachingInput = document.getElementById("user-email-coaching");
    const userPhoneCoachingInput = document.getElementById("user-phone-coaching");
    const userNotesCoachingInput = document.getElementById("user-notes-coaching");


    function initializeCoachingSummaryInteractions() {
        console.log("DEBUG: Chamando initializeCoachingSummaryInteractions...");

        if (!coachingSummarySection) {
            console.error("ERRO CRÍTICO: coachingSummarySection não está definida ao iniciar initializeCoachingSummaryInteractions.");
            return;
        }

        // LINHA DE DEBUG CRUCIAL (as per user, this was line 244 in their file)
        console.log("DEBUG: innerHTML de coachingSummarySection DENTRO de initializeCoachingSummaryInteractions:", coachingSummarySection.innerHTML);

        let paymentOptionsCoachingDiv = coachingSummarySection.querySelector(".payment-options");
        if (!paymentOptionsCoachingDiv) {
            console.error("ERRO: .payment-options não encontrado no resumo de coaching (dentro de initializeCoachingSummaryInteractions).");
            return;
        }

        let paymentMethodsCoachingDiv = paymentOptionsCoachingDiv.querySelector(".payment-methods");
        if (!paymentMethodsCoachingDiv) {
            console.error("ERRO: .payment-methods não encontrado dentro de .payment-options.");
            return;
        }

        let termsAcceptCoachingCheckbox = document.getElementById("terms-accept-coaching");
        let openTermsModalCoachingLink = document.getElementById("open-terms-modal-coaching");
        let backButtonCoaching = coachingSummarySection.querySelector(".back-button");
        let confirmBookingCoachingBtn = document.getElementById("confirm-booking-coaching");

        // Event listeners with cloneNode to prevent duplicates
        if (paymentMethodsCoachingDiv) {
            const paymentButtons = paymentMethodsCoachingDiv.querySelectorAll("button");
            paymentButtons.forEach(button => {
                let newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener("click", function() {
                    paymentButtons.forEach(btn => btn.classList.remove("selected"));
                    this.classList.add("selected");
                    // Store selected method if needed, e.g., in a data attribute or variable
                    // handlePaymentMethodSelection(this.dataset.method);
                });
            });
        }


        if (openTermsModalCoachingLink) {
            let newLink = openTermsModalCoachingLink.cloneNode(true);
            openTermsModalCoachingLink.parentNode.replaceChild(newLink, openTermsModalCoachingLink);
            newLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (typeof openModalGlobal === "function") openModalGlobal("coaching");
            });
        }

        if (backButtonCoaching) {
            let newBackButton = backButtonCoaching.cloneNode(true);
            backButtonCoaching.parentNode.replaceChild(newBackButton, backButtonCoaching);
            newBackButton.addEventListener("click", () => {
                if (coachingSummarySection) coachingSummarySection.classList.add("hidden");
                if (coachingBookingContainer) coachingBookingContainer.style.display = "block";
            });
        }

        if (confirmBookingCoachingBtn) {
            let newConfirmButton = confirmBookingCoachingBtn.cloneNode(true);
            confirmBookingCoachingBtn.parentNode.replaceChild(newConfirmButton, confirmBookingCoachingBtn);
            newConfirmButton.addEventListener("click", () => {
                if (termsAcceptCoachingCheckbox && !termsAcceptCoachingCheckbox.checked) {
                    alert("Por favor, aceite os termos e condições para prosseguir.");
                    return;
                }
                handleBookingSubmission("coaching");
            });
        }
        console.log("DEBUG: Interações do resumo de coaching inicializadas.");
    }
    window.initializeCoachingSummaryInteractions = initializeCoachingSummaryInteractions;


    // --- CV Review Flow Specific Initializations ---
    function initializeCvReviewInteractions() {
        console.log("DEBUG: Chamando initializeCvReviewInteractions...");
        if (!cvReviewSummarySection) {
            console.error("ERRO: cvReviewSummarySection não encontrada ao tentar inicializar interações.");
            return;
        }

        let paymentOptionsCvDiv = cvReviewSummarySection.querySelector(".payment-options");
        if (!paymentOptionsCvDiv) {
            console.error("ERRO: .payment-options não encontrado no resumo de CV review.");
            // return; // Decide if fatal
        }

        if (paymentOptionsCvDiv) {
            let paymentMethodsCvDiv = paymentOptionsCvDiv.querySelector(".payment-methods");
            if (paymentMethodsCvDiv) {
                const paymentButtonsCv = paymentMethodsCvDiv.querySelectorAll("button");
                paymentButtonsCv.forEach(button => {
                    let newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener("click", function() {
                        paymentButtonsCv.forEach(btn => btn.classList.remove("selected"));
                        this.classList.add("selected");
                    });
                });
            } else {
                console.error("ERRO: .payment-methods não encontrado dentro de .payment-options (CV Review).");
            }
        }


        let termsAcceptCvCheckbox = document.getElementById("terms-accept-cv-review");
        let openTermsModalCvLink = document.getElementById("open-terms-modal-cv-review");
        let backButtonCv = cvReviewSummarySection.querySelector(".back-button"); // Assuming one exists
        // confirmBookingCvBtn is already defined globally, ensure its listener is correctly managed

        if (openTermsModalCvLink) {
            let newLink = openTermsModalCvLink.cloneNode(true);
            openTermsModalCvLink.parentNode.replaceChild(newLink, openTermsModalCvLink);
            newLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (typeof openModalGlobal === "function") openModalGlobal("cv-review");
            });
        }

        if (backButtonCv) { // If CV review has a back button to its options
            let newBackButton = backButtonCv.cloneNode(true);
            backButtonCv.parentNode.replaceChild(newBackButton, backButtonCv);
            newBackButton.addEventListener("click", () => {
                if (cvReviewSummarySection) cvReviewSummarySection.classList.add("hidden");
                if (cvReviewOptionsDiv) cvReviewOptionsDiv.classList.remove("hidden"); // Show CV options again
                if (cvBookingContainer) cvBookingContainer.style.display = "block";
            });
        }

        if (confirmBookingCvBtn) { // confirmBookingCvBtn is already defined
            let newConfirmButton = confirmBookingCvBtn.cloneNode(true);
            confirmBookingCvBtn.parentNode.replaceChild(newConfirmButton, confirmBookingCvBtn);
            newConfirmButton.addEventListener("click", () => {
                if (termsAcceptCvCheckbox && !termsAcceptCvCheckbox.checked) {
                    alert("Por favor, aceite os termos e condições para prosseguir.");
                    return;
                }
                handleBookingSubmission("cv-review");
            });
        }
        console.log("DEBUG: Interações do resumo de CV review inicializadas.");
    }
    window.initializeCvReviewInteractions = initializeCvReviewInteractions;


    // --- Booking Submission Logic ---
    async function handleBookingSubmission(serviceType) {
        let payload = {};
        let url = "";
        let userName, userEmail, userPhone, userNotes;

        if (serviceType === "coaching") {
            userName = userNameCoachingInput ? userNameCoachingInput.value : "";
            userEmail = userEmailCoachingInput ? userEmailCoachingInput.value : "";
            userPhone = userPhoneCoachingInput ? userPhoneCoachingInput.value : "";
            userNotes = userNotesCoachingInput ? userNotesCoachingInput.value : "";

            const selectedType = coachingTypeSelect ? coachingTypeSelect.value : "";
            const selectedDuration = coachingDurationSelect ? coachingDurationSelect.value : "";
            const selectedQuantity = coachingQuantitySelect ? coachingQuantitySelect.value : "";
            const selectedDate = document.getElementById("selected-date-coaching") ? document.getElementById("selected-date-coaching").textContent : "";
            const selectedTime = document.getElementById("selected-time-coaching") ? document.getElementById("selected-time-coaching").textContent : "";
            const selectedPaymentMethod = coachingSummarySection.querySelector(".payment-methods button.selected")?.dataset.method;

            if (!selectedPaymentMethod) {
                alert("Por favor, selecione um método de pagamento.");
                return;
            }

            payload = {
                serviceType: "coaching",
                userName, userEmail, userPhone, userNotes,
                coachingType: selectedType,
                duration: selectedDuration,
                quantity: selectedQuantity,
                date: selectedDate,
                time: selectedTime,
                paymentMethod: selectedPaymentMethod
            };
            url = `${backendUrl}/create-booking`; // Replace with your actual endpoint

        } else if (serviceType === "cv-review") {
            userName = userNameCvInput ? userNameCvInput.value : "";
            userEmail = userEmailCvInput ? userEmailCvInput.value : "";
            userPhone = userPhoneCvInput ? userPhoneCvInput.value : "";
            userNotes = userNotesCvInput ? userNotesCvInput.value : "";
            const selectedPaymentMethodCv = cvReviewSummarySection.querySelector(".payment-methods button.selected")?.dataset.method;

            if (!selectedPaymentMethodCv) {
                alert("Por favor, selecione um método de pagamento para a revisão de CV.");
                return;
            }
            // For CV review, you'll likely use FormData for file uploads
            const formData = new FormData();
            formData.append("serviceType", "cv-review");
            formData.append("userName", userName);
            formData.append("userEmail", userEmail);
            formData.append("userPhone", userPhone);
            formData.append("userNotes", userNotes);
            formData.append("paymentMethod", selectedPaymentMethodCv);
            if (cvFileUploadInput && cvFileUploadInput.files[0]) {
                formData.append("cvFile", cvFileUploadInput.files[0]);
            } else {
                alert("Por favor, anexe o seu CV.");
                return;
            }
            payload = formData; // Payload is FormData
            url = `${backendUrl}/create-cv-request`; // Replace with your actual endpoint
        }

        console.log("Submitting booking/request:", payload);

        try {
            const fetchOptions = {
                method: "POST",
                // Headers might differ for FormData vs JSON
                headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
                body: payload instanceof FormData ? payload : JSON.stringify(payload),
            };

            const response = await fetch(url, fetchOptions);
            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Pedido enviado com sucesso!");
                // Optionally, redirect or clear form
                // initiatePayment(result.paymentIntentClientSecret, serviceType); // If payment is separate step
            } else {
                alert(result.error || "Ocorreu um erro ao enviar o pedido.");
            }
        } catch (error) {
            console.error("Erro na submissão:", error);
            alert("Erro de comunicação ao enviar o pedido.");
        }
    }

    // Placeholder for payment initiation if needed separately
    // async function initiatePayment(clientSecret, serviceType) {
    //     // Logic to handle payment with Stripe, PayPal, etc.
    //     console.log(`Initiating payment for ${serviceType} with secret: ${clientSecret}`);
    // }

    // Initial setup if needed - e.g., hide summaries
    if (coachingSummarySection) coachingSummarySection.classList.add("hidden");
    if (cvReviewSummarySection) cvReviewSummarySection.classList.add("hidden");
    if (calendarDiv) calendarDiv.classList.add("hidden"); // Hide calendar initially until service selected
    hideCoachingOptions();
    hideCvReviewOptions();

}); // End of DOMContentLoaded

