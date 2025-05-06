/**** booking_corrigido.js ****/
document.addEventListener("DOMContentLoaded", function() {
    console.log("Booking script loaded and DOM fully parsed");

    // URL do Backend - AJUSTAR SE O BACKEND CORRER NOUTRO LADO
    const backendUrl = "http://localhost:3000"; 

    // --- Elementos Comuns e Seleção de Fluxo ---
    const serviceSelectionScreen = document.getElementById("service-selection");
    const coachingFlow = document.getElementById("coaching-flow");
    const cvReviewFlow = document.getElementById("cv-review-flow");
    const selectCoachingBtn = document.getElementById("select-coaching");
    const selectCvReviewBtn = document.getElementById("select-cv-review");

    const bookingConfirmationScreen = document.getElementById("booking-confirmation"); // Para mensagens de confirmação genéricas
    const confirmationText = document.getElementById("confirmation-text");
    const paymentConfirmationDetails = document.getElementById("payment-confirmation-details");

    // Elementos do Modal de Termos (partilhados)
    const termsModal = document.getElementById("terms-modal");
    const closeTermsModalBtn = document.getElementById("close-terms-modal");
    const acceptTermsModalBtn = document.getElementById("accept-terms-modal");

    // --- Elementos do Fluxo de Coaching (alguns são inicializados mais tarde) ---
    const coachingBookingContainer = coachingFlow ? coachingFlow.querySelector(".booking-container") : null;
    const coachingSummarySection = document.getElementById("booking-summary-coaching");
    const coachingForm = document.getElementById("booking-form");
    const sessionTypeSelect = document.getElementById("session-type");
    const sessionDurationSelect = document.getElementById("session-duration");
    const sessionQuantitySelect = document.getElementById("session-quantity");
    const finalPriceSpanCoaching = document.getElementById("final-price");
    const calendarEl = document.getElementById("calendar");

    // Elementos do Resumo de Coaching (alguns são inicializados mais tarde)
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

    // --- Elementos do Fluxo de Revisão de CV (inicializados quando o fluxo é ativado) ---
    // Estes serão obtidos dentro de uma função de inicialização para o fluxo de CV, se necessário.

    // --- Lógica de Navegação entre Fluxos ---
    if (selectCoachingBtn) {
        selectCoachingBtn.addEventListener("click", () => {
            if (serviceSelectionScreen) serviceSelectionScreen.style.display = "none";
            if (coachingFlow) coachingFlow.style.display = "block";
            if (cvReviewFlow) cvReviewFlow.style.display = "none";
            window.currentFlow = "coaching"; // Para lógica de termos e condições
            // A inicialização específica do resumo de coaching será chamada pelo calendar.js
        });
    }

    if (selectCvReviewBtn) {
        selectCvReviewBtn.addEventListener("click", () => {
            if (serviceSelectionScreen) serviceSelectionScreen.style.display = "none";
            if (cvReviewFlow) cvReviewFlow.style.display = "block";
            if (coachingFlow) coachingFlow.style.display = "none";
            window.currentFlow = "cv"; // Para lógica de termos e condições
            initializeCvReviewInteractions(); // Chamada para inicializar interações do fluxo de CV
        });
    }

    // --- Funções de Utilidade (Mostrar/Esconder Instruções de Pagamento) ---
    function showPaymentInstructions(flowType, method) {
        // Esconder todas as instruções primeiro
        document.querySelectorAll(".payment-instructions").forEach(el => el.classList.add("hidden"));

        let instructionsDivId = ``;
        if (flowType === "coaching") {
            instructionsDivId = `${method}-instructions-coaching`;
            if (method === "mb") instructionsDivId = `mb-reference-coaching`;
            if (method === "payshop") instructionsDivId = `payshop-reference-coaching`;
        } else if (flowType === "cv") {
            instructionsDivId = `${method}-instructions-cv`;
            if (method === "mb") instructionsDivId = `mb-reference-cv`;
            if (method === "payshop") instructionsDivId = `payshop-reference-cv`;
        }
        
        const instructionsDiv = document.getElementById(instructionsDivId);
        if (instructionsDiv) {
            instructionsDiv.classList.remove("hidden");
        } else {
            console.warn(`Div de instruções de pagamento não encontrada: ${instructionsDivId}`);
        }

        // Mostrar a área de detalhes do pagamento se uma instrução for mostrada
        const detailsAreaId = flowType === "coaching" ? "payment-details-coaching" : "payment-details-cv";
        const detailsArea = document.getElementById(detailsAreaId);
        if (detailsArea && instructionsDiv) {
            detailsArea.classList.remove("hidden");
        }
    }

    // --- Função para Submissão de Marcação (Coaching e CV) ---
    async function handleBookingSubmission(flowType) {
        let bookingData = {};
        let formValid = true;
        let termsCheckboxId = ``;
        let endpoint = ``;

        if (flowType === "coaching") {
            if (!window.selectedDate || !window.selectedTime) {
                alert("Por favor, selecione uma data e hora no calendário.");
                return;
            }
            const selectedPaymentMethodCoaching = coachingSummarySection.querySelector(".payment-method.selected");
            if (!selectedPaymentMethodCoaching) {
                alert("Por favor, selecione um método de pagamento.");
                return;
            }

            bookingData = {
                service: "Kickstart Pro ! Express coaching",
                sessionType: sessionTypeSelect.value,
                duration: sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text,
                quantity: parseInt(sessionQuantitySelect.value, 10),
                dateTime: `${window.selectedDate} ${window.selectedTime}`,
                userName: userNameCoachingInput.value,
                userEmail: userEmailCoachingInput.value,
                userPhone: userPhoneCoachingInput.value,
                notes: userNotesCoachingInput.value,
                price: parseFloat(summaryPriceSpan.textContent.replace("€", "")),
                paymentMethod: selectedPaymentMethodCoaching.dataset.method,
                amountToPay: parseFloat(paymentAmountSpan.textContent.replace("€", "")),
                flow: "coaching"
            };
            termsCheckboxId = "terms-accept-coaching";
            endpoint = `${backendUrl}/create-booking`; 

        } else if (flowType === "cv") {
            const cvServiceSelect = document.getElementById("cv-service-selection");
            const cvUserNameInput = document.getElementById("cv-user-name");
            const cvUserEmailInput = document.getElementById("cv-user-email");
            const cvUserPhoneInput = document.getElementById("cv-user-phone");
            const cvFileUpload = document.getElementById("cv-upload");
            const cvUserNotesInput = document.getElementById("cv-user-notes");
            const selectedPaymentMethodCv = cvReviewFlow.querySelector(".payment-method.selected");
            const cvFinalPriceSpan = document.getElementById("cv-final-price");

            if (!cvServiceSelect.value) { alert("Por favor, selecione um serviço de CV."); return; }
            if (!selectedPaymentMethodCv) { alert("Por favor, selecione um método de pagamento."); return; }
            if (!cvUserNameInput.value || !cvUserEmailInput.value || !cvUserPhoneInput.value) { alert("Por favor, preencha todos os seus dados."); return; }

            bookingData = {
                service: cvServiceSelect.options[cvServiceSelect.selectedIndex].text,
                userName: cvUserNameInput.value,
                userEmail: cvUserEmailInput.value,
                userPhone: cvUserPhoneInput.value,
                notes: cvUserNotesInput.value,
                price: parseFloat(cvFinalPriceSpan.textContent.replace("€", "")),
                paymentMethod: selectedPaymentMethodCv.dataset.method,
                amountToPay: parseFloat(cvFinalPriceSpan.textContent.replace("€", "")), // Para CV, o valor a pagar é o total
                flow: "cv"
                // Para o CV, o ficheiro será tratado no backend se for enviado via FormData
            };
            termsCheckboxId = "terms-accept-cv";
            endpoint = `${backendUrl}/create-cv-request`; 
        }

        const termsCheckbox = document.getElementById(termsCheckboxId);
        if (!termsCheckbox || !termsCheckbox.checked) {
            alert("Por favor, aceite os termos e condições para prosseguir.");
            return;
        }

        // Simular carregamento
        const confirmButton = document.getElementById(flowType === "coaching" ? "confirm-booking-coaching" : "confirm-booking-cv");
        if (confirmButton) {
            confirmButton.disabled = true;
            confirmButton.textContent = "A processar...";
        }

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Mostrar mensagem de sucesso e detalhes do pagamento (se houver)
                if (confirmationText) confirmationText.innerHTML = result.message || `A sua marcação para ${bookingData.service} foi pedida com sucesso! Receberá um e-mail de confirmação em breve.`;
                
                if (paymentConfirmationDetails && result.paymentInfo) {
                    let detailsHtml = "";
                    if (result.paymentInfo.method === "mbway") {
                        detailsHtml = `<p>Confirme o pagamento de ${result.paymentInfo.amount}€ na sua app MB WAY no número ${result.paymentInfo.phone}.</p>`;
                    } else if (result.paymentInfo.method === "mb") {
                        detailsHtml = `<p>Dados para pagamento Multibanco:</p><ul><li>Entidade: ${result.paymentInfo.entity}</li><li>Referência: ${result.paymentInfo.reference}</li><li>Valor: ${result.paymentInfo.amount}€</li></ul>`;
                    } else if (result.paymentInfo.method === "payshop") {
                        detailsHtml = `<p>Dados para pagamento Payshop:</p><ul><li>Referência: ${result.paymentInfo.reference}</li><li>Valor: ${result.paymentInfo.amount}€</li></ul>`;
                    }
                    paymentConfirmationDetails.innerHTML = detailsHtml;
                    paymentConfirmationDetails.classList.remove("hidden");
                } else if (paymentConfirmationDetails) {
                    paymentConfirmationDetails.classList.add("hidden");
                }

                if (bookingConfirmationScreen) bookingConfirmationScreen.classList.remove("hidden");
                if (flowType === "coaching" && coachingSummarySection) coachingSummarySection.classList.add("hidden");
                if (flowType === "cv" && cvReviewFlow.querySelector(".cv-review-form-container")) cvReviewFlow.querySelector(".cv-review-form-container").style.display = "none";

            } else {
                alert(result.message || "Ocorreu um erro ao processar a sua marcação. Por favor, tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao submeter marcação:", error);
            alert("Ocorreu um erro de comunicação. Por favor, tente novamente.");
        } finally {
            if (confirmButton) {
                confirmButton.disabled = false;
                confirmButton.textContent = flowType === "coaching" ? "Confirmar Marcação" : "Confirmar Pedido";
            }
        }
    }
    window.handleBookingSubmissionGlobal = handleBookingSubmission; // Expor globalmente se necessário

    // --- Função de Inicialização para Interações do Resumo de Coaching ---
    function initializeCoachingSummaryInteractions() {
        console.log("DEBUG: Chamando initializeCoachingSummaryInteractions...");
        // A variável coachingSummarySection já está definida globalmente neste script

        if (!coachingSummarySection) {
            console.error("ERRO: coachingSummarySection não encontrada ao tentar inicializar interações.");
            return;
        }

        const paymentOptionsCoachingDiv = coachingSummarySection.querySelector(".payment-options");
        const termsAcceptCoachingCheckbox = document.getElementById("terms-accept-coaching");
        const openTermsModalCoachingLink = document.getElementById("open-terms-modal-coaching");
        const backButtonCoaching = document.getElementById("back-button-coaching");
        const confirmBookingCoachingBtn = document.getElementById("confirm-booking-coaching");

        if (paymentOptionsCoachingDiv) {
            const paymentMethodsCoachingDiv = paymentOptionsCoachingDiv.querySelector(".payment-methods");
            if (paymentMethodsCoachingDiv) {
                const paymentMethodButtons = paymentMethodsCoachingDiv.querySelectorAll(".payment-method");
                paymentMethodButtons.forEach(button => {
                    // Remover listeners antigos para evitar duplicação se esta função for chamada múltiplas vezes
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    
                    newButton.addEventListener('click', function() {
                        paymentMethodsCoachingDiv.querySelectorAll(".payment-method").forEach(btn => btn.classList.remove('selected'));
                        this.classList.add('selected');
                        const selectedMethod = this.dataset.method;
                        showPaymentInstructions('coaching', selectedMethod);
                    });
                });
            } else {
                console.error("ERRO: .payment-methods não encontrado dentro de .payment-options no resumo de coaching.");
            }
        } else {
            console.error("ERRO: .payment-options não encontrado no resumo de coaching.");
        }

        if (openTermsModalCoachingLink) {
            const newLink = openTermsModalCoachingLink.cloneNode(true);
            openTermsModalCoachingLink.parentNode.replaceChild(newLink, openTermsModalCoachingLink);
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof openModal === 'function') openModal('coaching');
            });
        }

        if (backButtonCoaching) {
            const newBackButton = backButtonCoaching.cloneNode(true);
            backButtonCoaching.parentNode.replaceChild(newBackButton, backButtonCoaching);
            newBackButton.addEventListener('click', () => {
                if (coachingSummarySection) coachingSummarySection.classList.add('hidden');
                if (coachingBookingContainer) coachingBookingContainer.style.display = 'block'; 
            });
        }

        if (confirmBookingCoachingBtn) {
            const newConfirmButton = confirmBookingCoachingBtn.cloneNode(true);
            confirmBookingCoachingBtn.parentNode.replaceChild(newConfirmButton, confirmBookingCoachingBtn);
            newConfirmButton.addEventListener('click', () => {
                handleBookingSubmission('coaching');
            });
        }
        console.log("DEBUG: Interações do resumo de coaching inicializadas.");
    }
    window.initializeCoachingSummaryInteractions = initializeCoachingSummaryInteractions;

    // --- Função de Inicialização para Interações da Revisão de CV ---
    function initializeCvReviewInteractions() {
        console.log("DEBUG: Chamando initializeCvReviewInteractions...");
        if (!cvReviewFlow) return;

        const cvServiceSelect = document.getElementById("cv-service-selection");
        const cvFinalPriceSpan = document.getElementById("cv-final-price");
        const paymentOptionsCvDiv = cvReviewFlow.querySelector(".payment-options"); // Assumindo que existe uma div similar para CV
        const termsAcceptCvCheckbox = document.getElementById("terms-accept-cv");
        const openTermsModalCvLink = document.getElementById("open-terms-modal-cv");
        const backButtonCv = document.getElementById("back-button-cv"); // Assumindo que existe
        const confirmBookingCvBtn = document.getElementById("confirm-booking-cv");

        if (cvServiceSelect && cvFinalPriceSpan) {
            cvServiceSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const price = selectedOption.dataset.price || "0";
                cvFinalPriceSpan.textContent = `${parseFloat(price).toFixed(2)}€`;
            });
            // Trigger change on load to set initial price if a service is pre-selected
            if(cvServiceSelect.value) cvServiceSelect.dispatchEvent(new Event('change'));
        }

        if (paymentOptionsCvDiv) {
            const paymentMethodsCvDiv = paymentOptionsCvDiv.querySelector(".payment-methods");
            if (paymentMethodsCvDiv) {
                const paymentMethodButtons = paymentMethodsCvDiv.querySelectorAll(".payment-method");
                paymentMethodButtons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    button.parentNode.replaceChild(newButton, button);
                    newButton.addEventListener('click', function() {
                        paymentMethodsCvDiv.querySelectorAll(".payment-method").forEach(btn => btn.classList.remove('selected'));
                        this.classList.add('selected');
                        const selectedMethod = this.dataset.method;
                        showPaymentInstructions('cv', selectedMethod);
                    });
                });
            }
        }

        if (openTermsModalCvLink) {
            const newLink = openTermsModalCvLink.cloneNode(true);
            openTermsModalCvLink.parentNode.replaceChild(newLink, openTermsModalCvLink);
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof openModal === 'function') openModal('cv');
            });
        }
        
        if (backButtonCv) { // Voltar para a seleção de serviço
            const newBackButton = backButtonCv.cloneNode(true);
            backButtonCv.parentNode.replaceChild(newBackButton, backButtonCv);
            newBackButton.addEventListener('click', () => {
                if (cvReviewFlow) cvReviewFlow.style.display = "none";
                if (serviceSelectionScreen) serviceSelectionScreen.style.display = "block";
            });
        }

        if (confirmBookingCvBtn) {
            const newConfirmButton = confirmBookingCvBtn.cloneNode(true);
            confirmBookingCvBtn.parentNode.replaceChild(newConfirmButton, confirmBookingCvBtn);
            newConfirmButton.addEventListener('click', () => {
                handleBookingSubmission('cv');
            });
        }
        console.log("DEBUG: Interações da revisão de CV inicializadas.");
    }
    // Não precisa expor globalmente se chamada apenas internamente ao selecionar o fluxo de CV

    // --- Lógica do Modal de Termos (Partilhada) ---
    function openModal(flow) {
        window.currentModalFlow = flow; // Para saber qual checkbox marcar ao aceitar
        if (termsModal) termsModal.style.display = "block";
    }
    window.openModalGlobal = openModal; // Expor se for chamada de fora

    function closeModal() {
        if (termsModal) termsModal.style.display = "none";
    }

    if (closeTermsModalBtn) closeTermsModalBtn.addEventListener('click', closeModal);
    if (acceptTermsModalBtn) {
        acceptTermsModalBtn.addEventListener('click', () => {
            const termsCheckboxCoaching = document.getElementById("terms-accept-coaching");
            const termsCheckboxCv = document.getElementById("terms-accept-cv");
            if (window.currentModalFlow === 'coaching' && termsCheckboxCoaching) termsCheckboxCoaching.checked = true;
            if (window.currentModalFlow === 'cv' && termsCheckboxCv) termsCheckboxCv.checked = true;
            closeModal();
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target == termsModal) {
            closeModal();
        }
    });

    // Remover as linhas de depuração que adicionámos anteriormente, se ainda existirem
    // console.log("DEBUG: Tentando encontrar booking-summary-coaching:", document.getElementById("booking-summary-coaching"));
    // console.log("DEBUG: coachingSummarySection ANTES de .querySelector('.payment-options'):", coachingSummarySection);
    // console.log("DEBUG: Resultado de coachingSummarySection.querySelector('.payment-options'):", coachingSummarySection ? coachingSummarySection.querySelector(".payment-options") : "coachingSummarySection tornou-se null AQUI");
    // console.log("DEBUG: innerHTML of coachingSummarySection:", coachingSummarySection ? coachingSummarySection.innerHTML : "coachingSummarySection é null");

});

