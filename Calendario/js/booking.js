// booking_final.js
// Versão final com correção no cálculo e exibição do preço no resumo.

document.addEventListener("DOMContentLoaded", function() {
    // Cache DOM elements
    const coachingServiceButton = document.getElementById("select-coaching");
    
    console.log("DEBUG (booking_final.js): Script carregado.");

    const cvServiceOptionDiv = document.getElementById("select-cv-review");
    if (cvServiceOptionDiv) cvServiceOptionDiv.style.display = 'none';
    const cvReviewFlowDiv = document.getElementById("cv-review-flow");
    if (cvReviewFlowDiv) cvReviewFlowDiv.style.display = 'none';

    const serviceSelectionSection = document.getElementById("service-selection");
    const coachingFlowDiv = document.getElementById("coaching-flow"); 

    const coachingOptionsDiv = document.getElementById("coaching-options");
    const calendarDiv = document.getElementById("calendar"); 
    const priceSummarySection = coachingFlowDiv ? coachingFlowDiv.querySelector(".price-summary") : null;
    const coachingBookingContainer = coachingFlowDiv ? coachingFlowDiv.querySelector(".booking-container") : null; 

    const coachingSummarySection = document.getElementById("booking-summary-coaching");

    const userNameCoachingInput = document.getElementById("user-name-coaching");
    const userEmailCoachingInput = document.getElementById("user-email-coaching");
    const userPhoneCoachingInput = document.getElementById("user-phone-coaching");

    let currentSelectedDate = null;
    let currentSelectedTime = null;

    const termsModal = document.getElementById("terms-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");

    const backendUrl = "http://localhost:3000"; // ATUALIZAR PARA PRODUÇÃO

    if (coachingServiceButton) {
        coachingServiceButton.addEventListener("click", () => {
            console.log("DEBUG: Botão de serviço de Coaching CLICADO");
            if (serviceSelectionSection) serviceSelectionSection.style.display = 'none';
            
            if (coachingFlowDiv) {
                coachingFlowDiv.style.cssText = 'display: block !important;'; 
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
        }
        if (coachingOptionsDiv) {
            coachingOptionsDiv.classList.remove("hidden");
            coachingOptionsDiv.style.cssText = 'display: block !important;'; 
        }
        if (calendarDiv) {
            calendarDiv.classList.remove("hidden");
            calendarDiv.style.cssText = 'display: block !important;';
        }
        if (priceSummarySection) { 
            priceSummarySection.style.cssText = 'display: block !important;'; 
        }
        if (coachingSummarySection) {
            coachingSummarySection.classList.add("hidden"); 
            coachingSummarySection.style.display = 'none';
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
            if (termsModal) termsModal.style.display = "none";
        }
    });

    function setBookingDateTime(date, time) {
        currentSelectedDate = date;
        currentSelectedTime = time;
        console.log(`DEBUG (booking_final.js): Data e Hora selecionadas pelo calendário: ${date} ${time}`);
    }
    window.setBookingDateTime = setBookingDateTime; 

    function updateCoachingSummaryDetails() {
        console.log("DEBUG (booking_final.js): updateCoachingSummaryDetails() chamada.");
        if (!coachingSummarySection) return;

        const sessionTypeSelect = document.getElementById("session-type");
        const sessionDurationSelect = document.getElementById("session-duration");
        const sessionQuantitySelect = document.getElementById("session-quantity");

        const summaryTypeSpan = document.getElementById("summary-type");
        const summaryDurationSpan = document.getElementById("summary-duration");
        const summaryQuantitySpan = document.getElementById("summary-quantity");
        const summaryDateTimeSpan = document.getElementById("summary-datetime");
        
        if (summaryTypeSpan && sessionTypeSelect) summaryTypeSpan.textContent = sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text;
        if (summaryDurationSpan && sessionDurationSelect) summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text.split(" - ")[0];
        if (summaryQuantitySpan && sessionQuantitySelect) summaryQuantitySpan.textContent = sessionQuantitySelect.options[sessionQuantitySelect.selectedIndex].text;
        
        if (summaryDateTimeSpan) {
            summaryDateTimeSpan.textContent = currentSelectedDate && currentSelectedTime ? `${currentSelectedDate} às ${currentSelectedTime}` : "Não selecionado";
        }
        
        // CORREÇÃO DO CÁLCULO E EXIBIÇÃO DO PREÇO
        const summaryPriceSpan = document.getElementById("summary-price");
        const paymentTypeSpan = document.getElementById("payment-type"); // Para "Pagamento Parcial..."
        const paymentAmountSpan = document.getElementById("payment-amount");
        const remainingPaymentInfoDiv = document.getElementById("remaining-payment-info");
        const remainingAmountSpan = document.getElementById("remaining-amount");

        if (typeof window.calculatePrice === 'function') {
            const priceDetails = window.calculatePrice(); // Chama a função global do calendar.js
            const totalFinalPrice = priceDetails.final;

            if (summaryPriceSpan) summaryPriceSpan.textContent = `${totalFinalPrice.toFixed(2)}€`;

            let paymentAmount = totalFinalPrice;
            let paymentTypeText = "Pagamento Total";
            let remainingAmount = 0;

            if (totalFinalPrice > 10) { // Lógica de pagamento parcial
                paymentAmount = Math.max(10, totalFinalPrice * 0.50); // 50% ou 10€ mínimo
                remainingAmount = totalFinalPrice - paymentAmount;
                paymentTypeText = "Pagamento Parcial (50% ou 10€ min)";
            }

            if (paymentTypeSpan) paymentTypeSpan.textContent = paymentTypeText;
            if (paymentAmountSpan) paymentAmountSpan.textContent = `${paymentAmount.toFixed(2)}€`;

            if (remainingPaymentInfoDiv && remainingAmountSpan) {
                if (remainingAmount > 0) {
                    remainingAmountSpan.textContent = `${remainingAmount.toFixed(2)}€`;
                    remainingPaymentInfoDiv.style.display = "block";
                } else {
                    remainingPaymentInfoDiv.style.display = "none";
                }
            }
        } else {
            console.error("ERRO (booking_final.js): window.calculatePrice não está definida. Verifique calendar.js");
            if (summaryPriceSpan) summaryPriceSpan.textContent = "N/A";
            if (paymentAmountSpan) paymentAmountSpan.textContent = "N/A";
        }

        console.log("DEBUG (booking_final.js): Detalhes do resumo de coaching atualizados.");
    }
    window.updateCoachingSummaryDetails = updateCoachingSummaryDetails; 

    function initializeCoachingSummaryInteractions() {
        console.log("DEBUG (booking_final.js): initializeCoachingSummaryInteractions() chamada.");

        if (!coachingSummarySection) {
            console.error("ERRO CRÍTICO: coachingSummarySection não definida.");
            return;
        }
        
        updateCoachingSummaryDetails(); 

        if (coachingBookingContainer) { 
             coachingBookingContainer.style.display = 'none'; 
        }

        coachingSummarySection.classList.remove("hidden");
        coachingSummarySection.style.cssText = 'display: block !important;';

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
        console.log("DEBUG (booking_final.js): Interações do resumo de coaching inicializadas e MBWAY configurado.");
    }
    window.initializeCoachingSummaryInteractions = initializeCoachingSummaryInteractions;

    async function handleBookingSubmission() {
        console.log("DEBUG (booking_final.js): handleBookingSubmission() para Coaching chamada.");
        let payload = {};
        let url = backendUrl + "/create-booking"; 

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


