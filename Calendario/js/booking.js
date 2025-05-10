// booking_coaching_FORCE_VISIBLE.js
// Tenta forçar a visibilidade do fluxo de Coaching usando !important.

document.addEventListener("DOMContentLoaded", function() {
    // Cache DOM elements
    const coachingServiceButton = document.getElementById("select-coaching");
    
    console.log("DEBUG: Botão de serviço de coaching:", coachingServiceButton);

    // Ocultar permanentemente o fluxo de Revisão de CV
    const cvServiceOptionDiv = document.getElementById("select-cv-review");
    if (cvServiceOptionDiv) cvServiceOptionDiv.style.display = 'none';
    const cvReviewFlowDiv = document.getElementById("cv-review-flow");
    if (cvReviewFlowDiv) cvReviewFlowDiv.style.display = 'none';

    const serviceSelectionSection = document.getElementById("service-selection");
    const coachingFlowDiv = document.getElementById("coaching-flow"); 
    console.log("DEBUG: coachingFlowDiv:", coachingFlowDiv);

    const coachingOptionsDiv = document.getElementById("coaching-options");
    console.log("DEBUG: coachingOptionsDiv:", coachingOptionsDiv);
    const calendarDiv = document.getElementById("calendar"); 
    console.log("DEBUG: calendarDiv:", calendarDiv);
    const priceSummarySection = coachingFlowDiv ? coachingFlowDiv.querySelector(".price-summary") : null;
    console.log("DEBUG: priceSummarySection:", priceSummarySection);
    const coachingBookingContainer = coachingFlowDiv ? coachingFlowDiv.querySelector(".booking-container") : null; 
    console.log("DEBUG: coachingBookingContainer:", coachingBookingContainer);

    const coachingSummarySection = document.getElementById("booking-summary-coaching");
    console.log("DEBUG: coachingSummarySection:", coachingSummarySection);

    const userNameCoachingInput = document.getElementById("user-name-coaching");
    const userEmailCoachingInput = document.getElementById("user-email-coaching");
    const userPhoneCoachingInput = document.getElementById("user-phone-coaching");

    let currentSelectedDate = null;
    let currentSelectedTime = null;

    const termsModal = document.getElementById("terms-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");

    const backendUrl = "http://localhost:3000";

    if (coachingServiceButton) {
        coachingServiceButton.addEventListener("click", () => {
            console.log("DEBUG: Botão de serviço de Coaching CLICADO");
            if (serviceSelectionSection) serviceSelectionSection.style.display = 'none';
            
            if (coachingFlowDiv) {
                coachingFlowDiv.style.cssText = 'display: block !important;'; 
                console.log("DEBUG: coachingFlowDiv tornado visível com !important.");
            } else {
                console.error("ERRO: coachingFlowDiv não encontrado!");
                return;
            }
            showCoachingFormAndCalendar();
        });
    }

    function showCoachingFormAndCalendar() {
        console.log("DEBUG: showCoachingFormAndCalendar() chamada.");
        if (coachingBookingContainer) { 
            coachingBookingContainer.style.cssText = 'display: block !important;'; 
            console.log("DEBUG: coachingBookingContainer (options+calendar) tornado visível com !important.");
        }
        if (coachingOptionsDiv) {
            coachingOptionsDiv.classList.remove("hidden");
            coachingOptionsDiv.style.cssText = 'display: block !important;'; 
            console.log("DEBUG: coachingOptionsDiv tornado visível com !important.");
        }
        if (calendarDiv) {
            calendarDiv.classList.remove("hidden");
            calendarDiv.style.cssText = 'display: block !important;';
            console.log("DEBUG: calendarDiv tornado visível com !important.");
        }
        if (priceSummarySection) { 
            priceSummarySection.style.cssText = 'display: block !important;'; 
            console.log("DEBUG: priceSummarySection (tabela de preços) tornada visível com !important.");
        }
        if (coachingSummarySection) {
            coachingSummarySection.classList.add("hidden"); 
            coachingSummarySection.style.display = 'none';
            console.log("DEBUG: coachingSummarySection (resumo) ocultado.");
        }
    }

    function openModalGlobal() {
        if (termsModal) termsModal.style.display = "block";
    }
    window.openModalGlobal = openModalGlobal;

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

    function setBookingDateTime(date, time) {
        currentSelectedDate = date;
        currentSelectedTime = time;
        console.log(`DEBUG: Data e Hora selecionadas pelo calendário: ${date} ${time}`);
    }
    window.setBookingDateTime = setBookingDateTime; 

    function updateCoachingSummaryDetails() {
        console.log("DEBUG: updateCoachingSummaryDetails() chamada.");
        if (!coachingSummarySection) return;

        const sessionTypeSelect = document.getElementById("session-type");
        const sessionDurationSelect = document.getElementById("session-duration");
        const sessionQuantitySelect = document.getElementById("session-quantity");

        const summaryTypeSpan = document.getElementById("summary-type");
        const summaryDurationSpan = document.getElementById("summary-duration");
        const summaryQuantitySpan = document.getElementById("summary-quantity");
        const summaryDateTimeSpan = document.getElementById("summary-datetime");
        
        if (summaryTypeSpan && sessionTypeSelect) summaryTypeSpan.textContent = sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text;
        if (summaryDurationSpan && sessionDurationSelect) summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text;
        if (summaryQuantitySpan && sessionQuantitySelect) summaryQuantitySpan.textContent = sessionQuantitySelect.options[sessionQuantitySelect.selectedIndex].text;
        
        if (summaryDateTimeSpan) {
            summaryDateTimeSpan.textContent = currentSelectedDate && currentSelectedTime ? `${currentSelectedDate} às ${currentSelectedTime}` : "Não selecionado";
        }
        
        const priceInfo = window.calculatePrice ? window.calculatePrice() : { finalPrice: "N/A", paymentAmount: "N/A" }; 
        const summaryPriceSpan = document.getElementById("summary-price");
        const paymentAmountSpan = document.getElementById("payment-amount");
        if(summaryPriceSpan) summaryPriceSpan.textContent = priceInfo.finalPrice + "€";
        if(paymentAmountSpan) paymentAmountSpan.textContent = priceInfo.paymentAmount + "€";

        console.log("DEBUG: Detalhes do resumo de coaching atualizados.");
    }
    window.updateCoachingSummaryDetails = updateCoachingSummaryDetails; 

    function initializeCoachingSummaryInteractions() {
        console.log("DEBUG: initializeCoachingSummaryInteractions() chamada.");

        if (!coachingSummarySection) {
            console.error("ERRO CRÍTICO: coachingSummarySection não definida.");
            return;
        }
        
        updateCoachingSummaryDetails(); 

        if (coachingBookingContainer) { 
             coachingBookingContainer.style.display = 'none'; 
             console.log("DEBUG: coachingBookingContainer (options+calendar) ocultado.");
        }

        coachingSummarySection.classList.remove("hidden");
        coachingSummarySection.style.cssText = 'display: block !important;';
        console.log("DEBUG: coachingSummarySection (resumo) tornado visível com !important.");

        let paymentOptionsCoachingDiv = coachingSummarySection.querySelector(".payment-options");
        if (!paymentOptionsCoachingDiv) {
            console.error("ERRO: .payment-options não encontrado no resumo de coaching.");
            return;
        }

        let paymentMethodsCoachingDiv = paymentOptionsCoachingDiv.querySelector(".payment-methods");
        if (!paymentMethodsCoachingDiv) {
            console.error("ERRO: .payment-methods não encontrado dentro de .payment-options.");
            return;
        }

        const mbwayButton = paymentMethodsCoachingDiv.querySelector("button[data-method='mbway']");
        const paypalButton = paymentMethodsCoachingDiv.querySelector("button[data-method='paypal']");
        const transferenciaButton = paymentMethodsCoachingDiv.querySelector("button[data-method='transferencia']");

        if (paypalButton) paypalButton.style.display = 'none';
        if (transferenciaButton) transferenciaButton.style.display = 'none';

        if (mbwayButton) {
            let newMbwayButton = mbwayButton.cloneNode(true);
            mbwayButton.parentNode.replaceChild(newMbwayButton, mbwayButton);
            newMbwayButton.classList.add("selected"); 
        } else {
            console.error("ERRO: Botão MBWAY não encontrado.");
        }

        const mbwayInstructionsDiv = coachingSummarySection.querySelector("#mbway-instructions");
        if (mbwayInstructionsDiv) {
            mbwayInstructionsDiv.classList.remove("hidden");
            mbwayInstructionsDiv.style.cssText = 'display: block !important;';
        } else {
            console.error("ERRO: Instruções MBWAY não encontradas.");
        }

        let termsAcceptCoachingCheckbox = document.getElementById("terms-accept-coaching");
        let openTermsModalCoachingLink = document.getElementById("open-terms-modal-coaching");
        let backButtonCoaching = coachingSummarySection.querySelector(".back-button");
        let confirmBookingCoachingBtn = document.getElementById("confirm-booking-coaching");

        if (openTermsModalCoachingLink) {
            let newLink = openTermsModalCoachingLink.cloneNode(true);
            openTermsModalCoachingLink.parentNode.replaceChild(newLink, openTermsModalCoachingLink);
            newLink.addEventListener("click", (e) => {
                e.preventDefault();
                openModalGlobal();
            });
        }

        if (backButtonCoaching) {
            let newBackButton = backButtonCoaching.cloneNode(true);
            backButtonCoaching.parentNode.replaceChild(newBackButton, backButtonCoaching);
            newBackButton.addEventListener("click", () => {
                if (coachingSummarySection) {
                    coachingSummarySection.classList.add("hidden");
                    coachingSummarySection.style.display = 'none';
                }
                showCoachingFormAndCalendar(); 
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
                handleBookingSubmission();
            });
        }
        console.log("DEBUG: Interações do resumo de coaching inicializadas e MBWAY configurado.");
    }
    window.initializeCoachingSummaryInteractions = initializeCoachingSummaryInteractions;

    async function handleBookingSubmission() {
        console.log("DEBUG: handleBookingSubmission() para Coaching chamada.");
        let payload = {};
        let url = `${backendUrl}/create-booking`; 

        const userName = userNameCoachingInput ? userNameCoachingInput.value : "";
        const userEmail = userEmailCoachingInput ? userEmailCoachingInput.value : "";
        const userPhone = userPhoneCoachingInput ? userPhoneCoachingInput.value : "";
        
        const sessionTypeSelect = document.getElementById("session-type");
        const sessionDurationSelect = document.getElementById("session-duration");
        const sessionQuantitySelect = document.getElementById("session-quantity");

        const selectedType = sessionTypeSelect ? sessionTypeSelect.value : "";
        const selectedDuration = sessionDurationSelect ? sessionDurationSelect.value : "";
        const selectedQuantity = sessionQuantitySelect ? sessionQuantitySelect.value : "";
        
        const paymentMethod = "mbway";

        if (!userName || !userEmail || !userPhone) {
            alert("Por favor, preencha todos os seus dados (Nome, Email, Telefone).");
            return;
        }
        if (!currentSelectedDate || !currentSelectedTime) {
            alert("Por favor, selecione uma data e hora no calendário.");
            return;
        }

        payload = {
            serviceType: "coaching",
            userName, userEmail, userPhone,
            coachingType: selectedType,
            duration: selectedDuration,
            quantity: selectedQuantity,
            date: currentSelectedDate,
            time: currentSelectedTime,
            paymentMethod: paymentMethod
        };
        
        console.log("Payload a ser enviado:", payload);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Agendamento criado com sucesso:", result);
                alert("Agendamento realizado com sucesso! Receberá um email de confirmação em breve e instruções para pagamento por MBWAY.");
                if(coachingSummarySection) {
                    coachingSummarySection.classList.add("hidden");
                    coachingSummarySection.style.display = 'none';
                }
                if(serviceSelectionSection) serviceSelectionSection.style.display = 'block'; 

            } else {
                const errorResult = await response.text(); 
                console.error("Falha ao criar agendamento:", response.status, errorResult);
                alert(`Erro ao realizar o agendamento: ${response.status} - ${errorResult}. Por favor, tente novamente ou contacte o suporte.`);
            }
        } catch (error) {
            console.error("Erro de rede ou JavaScript ao submeter agendamento:", error);
            alert("Ocorreu um erro de comunicação ao tentar realizar o agendamento. Verifique a sua ligação à internet e tente novamente.");
        }
    }
});


