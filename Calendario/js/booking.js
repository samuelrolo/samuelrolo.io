// booking_coaching_simplificado.js
// Focado exclusivamente no fluxo de Coaching, com MBWAY e recolha de email.

document.addEventListener("DOMContentLoaded", function() {
    // Cache DOM elements
    const coachingServiceButton = document.getElementById("select-coaching");
    // const cvReviewServiceButton = document.getElementById("select-cv-review"); // CV Desativado

    console.log("DEBUG: Botão de serviço de coaching:", coachingServiceButton);
    // console.log("DEBUG: Botão de serviço de revisão de CV:", cvReviewServiceButton); // CV Desativado

    // Ocultar permanentemente o fluxo de Revisão de CV
    const cvServiceOptionDiv = document.getElementById("select-cv-review");
    if (cvServiceOptionDiv) cvServiceOptionDiv.style.display = 'none';
    const cvReviewFlowDiv = document.getElementById("cv-review-flow");
    if (cvReviewFlowDiv) cvReviewFlowDiv.style.display = 'none';

    const coachingOptionsDiv = document.getElementById("coaching-options");
    console.log("DEBUG: coachingOptionsDiv:", coachingOptionsDiv);
    const calendarDiv = document.getElementById("calendar"); 
    console.log("DEBUG: calendarDiv:", calendarDiv);

    const coachingSummarySection = document.getElementById("booking-summary-coaching");
    console.log("DEBUG: coachingSummarySection:", coachingSummarySection);
    const coachingBookingContainer = document.getElementById("coaching-flow")?.querySelector(".booking-container");

    const serviceSelectionSection = document.getElementById("service-selection");

    // Elementos do formulário de Coaching (dentro do resumo)
    const userNameCoachingInput = document.getElementById("user-name-coaching");
    const userEmailCoachingInput = document.getElementById("user-email-coaching");
    const userPhoneCoachingInput = document.getElementById("user-phone-coaching");
    // const userNotesCoachingInput = document.getElementById("user-notes-coaching"); // Se necessário

    // Variáveis para guardar data e hora selecionadas
    let currentSelectedDate = null;
    let currentSelectedTime = null;

    // Modal elements
    const termsModal = document.getElementById("terms-modal");
    const closeModalButtons = document.querySelectorAll(".close-modal");

    const backendUrl = "http://localhost:3000"; // ATUALIZAR PARA PRODUÇÃO

    // --- Seleção de Serviço de Coaching ---
    if (coachingServiceButton) {
        coachingServiceButton.addEventListener("click", () => {
            console.log("DEBUG: Botão de serviço de Coaching CLICADO");
            if (serviceSelectionSection) serviceSelectionSection.style.display = 'none'; // Ocultar seleção de serviço
            
            showCoachingOptionsAndCalendar();
        });
    }

    function showCoachingOptionsAndCalendar() {
        console.log("DEBUG: showCoachingOptionsAndCalendar() chamada.");
        if (coachingOptionsDiv) {
            coachingOptionsDiv.classList.remove("hidden");
            coachingOptionsDiv.style.display = 'block'; 
        }
        if (calendarDiv) {
            calendarDiv.classList.remove("hidden");
            calendarDiv.style.display = 'block';
        }
        if (coachingSummarySection) {
            coachingSummarySection.classList.add("hidden"); // Garantir que o resumo está oculto inicialmente
            coachingSummarySection.style.display = 'none';
        }
    }

    // --- Lógica do Modal de Termos ---
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

    // --- Funções para o Calendário (a serem chamadas pelo calendar.js) ---
    function setBookingDateTime(date, time) {
        currentSelectedDate = date;
        currentSelectedTime = time;
        console.log(`DEBUG: Data e Hora selecionadas pelo calendário: ${date} ${time}`);
        // Esta função é chamada pelo calendar.js quando um slot é selecionado.
        // O calendar.js também deve ser responsável por mostrar a secção de resumo e chamar initializeCoachingSummaryInteractions.
    }
    window.setBookingDateTime = setBookingDateTime; // Expor globalmente para calendar.js

    // --- Interações do Resumo de Coaching ---
    function updateCoachingSummaryDetails() {
        console.log("DEBUG: updateCoachingSummaryDetails() chamada.");
        if (!coachingSummarySection) return;

        // Atualizar tipo de sessão, duração, quantidade (assumindo que são lidos dos selects)
        const sessionTypeSelect = document.getElementById("session-type");
        const sessionDurationSelect = document.getElementById("session-duration");
        const sessionQuantitySelect = document.getElementById("session-quantity");

        const summaryTypeSpan = document.getElementById("summary-type");
        const summaryDurationSpan = document.getElementById("summary-duration");
        const summaryQuantitySpan = document.getElementById("summary-quantity");
        const summaryDateTimeSpan = document.getElementById("summary-datetime");
        // Adicionar spans para preço se necessário (ex: summary-price, payment-amount)

        if (summaryTypeSpan && sessionTypeSelect) summaryTypeSpan.textContent = sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text;
        if (summaryDurationSpan && sessionDurationSelect) summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text;
        if (summaryQuantitySpan && sessionQuantitySelect) summaryQuantitySpan.textContent = sessionQuantitySelect.options[sessionQuantitySelect.selectedIndex].text;
        
        if (summaryDateTimeSpan) {
            summaryDateTimeSpan.textContent = currentSelectedDate && currentSelectedTime ? `${currentSelectedDate} às ${currentSelectedTime}` : "Não selecionado";
        }
        
        // Lógica de cálculo de preço (simplificada, adaptar conforme necessário)
        // Esta lógica deve ser robusta e idealmente vir do price-system.js ou similar
        const priceInfo = window.calculatePrice ? window.calculatePrice() : { finalPrice: "N/A", paymentAmount: "N/A" }; // Exemplo
        const summaryPriceSpan = document.getElementById("summary-price");
        const paymentAmountSpan = document.getElementById("payment-amount");
        if(summaryPriceSpan) summaryPriceSpan.textContent = priceInfo.finalPrice + "€";
        if(paymentAmountSpan) paymentAmountSpan.textContent = priceInfo.paymentAmount + "€";

        console.log("DEBUG: Detalhes do resumo de coaching atualizados.");
    }
    window.updateCoachingSummaryDetails = updateCoachingSummaryDetails; // Expor se o calendar.js precisar chamar diretamente

    function initializeCoachingSummaryInteractions() {
        console.log("DEBUG: initializeCoachingSummaryInteractions() chamada.");

        if (!coachingSummarySection) {
            console.error("ERRO CRÍTICO: coachingSummarySection não definida.");
            return;
        }
        
        updateCoachingSummaryDetails(); // Preencher os detalhes do resumo

        coachingSummarySection.classList.remove("hidden");
        coachingSummarySection.style.display = 'block';
        if (coachingBookingContainer) {
             coachingBookingContainer.style.display = 'none'; // Ocultar opções e calendário
        }

        console.log("DEBUG: innerHTML de coachingSummarySection:", coachingSummarySection.innerHTML);

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

        // Configurar MBWAY como único método de pagamento
        const mbwayButton = paymentMethodsCoachingDiv.querySelector("button[data-method='mbway']");
        const paypalButton = paymentMethodsCoachingDiv.querySelector("button[data-method='paypal']");
        const transferenciaButton = paymentMethodsCoachingDiv.querySelector("button[data-method='transferencia']");

        if (paypalButton) paypalButton.style.display = 'none';
        if (transferenciaButton) transferenciaButton.style.display = 'none';

        if (mbwayButton) {
            let newMbwayButton = mbwayButton.cloneNode(true);
            mbwayButton.parentNode.replaceChild(newMbwayButton, mbwayButton);
            newMbwayButton.classList.add("selected"); // Pré-selecionar MBWAY
            // Não é necessário event listener se for o único e sempre selecionado
        } else {
            console.error("ERRO: Botão MBWAY não encontrado.");
        }

        const mbwayInstructionsDiv = coachingSummarySection.querySelector("#mbway-instructions");
        if (mbwayInstructionsDiv) {
            mbwayInstructionsDiv.classList.remove("hidden");
            mbwayInstructionsDiv.style.display = 'block';
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
                if (coachingBookingContainer) coachingBookingContainer.style.display = 'block'; // Mostrar opções e calendário novamente
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

    // --- Lógica de Submissão de Agendamento (Apenas Coaching) ---
    async function handleBookingSubmission() {
        console.log("DEBUG: handleBookingSubmission() para Coaching chamada.");
        let payload = {};
        let url = `${backendUrl}/create-booking`; // ATUALIZAR PARA PRODUÇÃO

        const userName = userNameCoachingInput ? userNameCoachingInput.value : "";
        const userEmail = userEmailCoachingInput ? userEmailCoachingInput.value : "";
        const userPhone = userPhoneCoachingInput ? userPhoneCoachingInput.value : "";
        // const userNotes = userNotesCoachingInput ? userNotesCoachingInput.value : ""; // Se necessário

        const sessionTypeSelect = document.getElementById("session-type");
        const sessionDurationSelect = document.getElementById("session-duration");
        const sessionQuantitySelect = document.getElementById("session-quantity");

        const selectedType = sessionTypeSelect ? sessionTypeSelect.value : "";
        const selectedDuration = sessionDurationSelect ? sessionDurationSelect.value : "";
        const selectedQuantity = sessionQuantitySelect ? sessionQuantitySelect.value : "";
        
        const paymentMethod = "mbway"; // Fixo para MBWAY

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
            // userNotes, // Se necessário
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
                // Limpar formulário, ocultar resumo, mostrar mensagem de sucesso, etc.
                if(coachingSummarySection) coachingSummarySection.style.display = 'none';
                if(serviceSelectionSection) serviceSelectionSection.style.display = 'block'; // Voltar à seleção inicial
                // Adicionar uma secção de confirmação/agradecimento?

            } else {
                const errorResult = await response.text(); // Tentar obter mais detalhes do erro
                console.error("Falha ao criar agendamento:", response.status, errorResult);
                alert(`Erro ao realizar o agendamento: ${response.status} - ${errorResult}. Por favor, tente novamente ou contacte o suporte.`);
            }
        } catch (error) {
            console.error("Erro de rede ou JavaScript ao submeter agendamento:", error);
            alert("Ocorreu um erro de comunicação ao tentar realizar o agendamento. Verifique a sua ligação à internet e tente novamente.");
        }
    }
});

// Nota: A lógica de cálculo de preço (calculatePrice) e a interação detalhada com o FullCalendar (eventos de clique, etc.)
// são assumidas como existentes em outros ficheiros (ex: price-system.js, calendar.js) ou precisam ser implementadas/
// integradas mais a fundo aqui se não existirem de forma modular.
// O calendar.js DEVE chamar window.setBookingDateTime(date, time) e window.initializeCoachingSummaryInteractions() 
// quando um slot é selecionado e o resumo deve ser mostrado.

