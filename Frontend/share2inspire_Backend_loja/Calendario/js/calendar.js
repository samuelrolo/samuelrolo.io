/**** calendar_corrigido_v2.js ****/
document.addEventListener("DOMContentLoaded", function() {
    console.log("calendar.js loaded");
    const calendarEl = document.getElementById("calendar");
    const coachingBookingContainer = document.getElementById("coaching-flow")?.querySelector(".booking-container");
    const coachingSummarySection = document.getElementById("booking-summary-coaching");
    
    // References to summary elements (needed for update)
    const summaryTypeSpan = document.getElementById("summary-type");
    const summaryDurationSpan = document.getElementById("summary-duration");
    const summaryDatetimeSpan = document.getElementById("summary-datetime");
    const summaryQuantitySpan = document.getElementById("summary-quantity");
    const summaryPriceSpan = document.getElementById("summary-price");
    const paymentTypeSpan = document.getElementById("payment-type");
    const paymentAmountSpan = document.getElementById("payment-amount");
    const remainingPaymentInfoDiv = document.getElementById("remaining-payment-info");
    const remainingAmountSpan = document.getElementById("remaining-amount");

    // References to form elements (needed for price calculation)
    const sessionTypeSelect = document.getElementById("session-type");
    const sessionDurationSelect = document.getElementById("session-duration");
    const sessionQuantitySelect = document.getElementById("session-quantity");
    const finalPriceSpanCoaching = document.getElementById("final-price"); // In the form section
    const basePriceSpan = document.getElementById("base-price");
    const discountSpan = document.getElementById("discount");

    // Globally accessible variables for booking.js
    window.selectedDate = null;
    window.selectedTime = null;
    window.currentFlow = ""; // Para saber qual fluxo está ativo (coaching ou cv)

    // --- Price Calculation Logic ---
    const prices = {
        15: 10,
        30: 20,
        45: 30,
        60: 40
    };
    const discounts = {
        15: 0, // No discount for 15 min
        30: 2.5,
        45: 5,
        60: 7.5
    };

    function calculatePrice() {
        if (!sessionDurationSelect || !sessionQuantitySelect) return { base: 0, discount: 0, final: 0, finalPerSession: 0 };
        
        const duration = parseInt(sessionDurationSelect.value, 10);
        const quantity = parseInt(sessionQuantitySelect.value, 10);
        
        if (!duration || !quantity) return { base: 0, discount: 0, final: 0, finalPerSession: 0 };

        const basePricePerSession = prices[duration] || 0;
        let discountPerSession = 0;
        if (quantity >= 2) {
            discountPerSession = discounts[duration] || 0;
        }
        
        const finalPricePerSession = basePricePerSession - discountPerSession;
        const totalBasePrice = basePricePerSession * quantity;
        const totalDiscount = discountPerSession * quantity;
        const totalFinalPrice = finalPricePerSession * quantity;

        // Update form price info
        if (basePriceSpan) basePriceSpan.textContent = `${totalBasePrice.toFixed(2)}€`;
        if (discountSpan) discountSpan.textContent = `${totalDiscount.toFixed(2)}€`;
        if (finalPriceSpanCoaching) finalPriceSpanCoaching.textContent = `${totalFinalPrice.toFixed(2)}€`;

        return { base: totalBasePrice, discount: totalDiscount, final: totalFinalPrice, finalPerSession: finalPricePerSession };
    }

    // --- Update Booking Summary Function ---
    window.updateBookingSummary = function(date, time) {
        console.log(`Updating summary for ${date} ${time}`);
        window.selectedDate = date;
        window.selectedTime = time;

        const calculatedPrice = calculatePrice();
        const totalFinalPrice = calculatedPrice.final;
        const quantity = parseInt(sessionQuantitySelect.value, 10);
        
        // Determine payment amount
        let paymentAmount = totalFinalPrice;
        let paymentTypeText = "Pagamento Total";
        let remainingAmount = 0;
        if (totalFinalPrice > 10) {
            paymentAmount = Math.max(10, totalFinalPrice * 0.5); // 50% or 10€ minimum
            remainingAmount = totalFinalPrice - paymentAmount;
            paymentTypeText = "Pagamento Parcial (50% ou 10€ min)";
        }

        // Update summary fields
        if (summaryTypeSpan && sessionTypeSelect) summaryTypeSpan.textContent = sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text;
        if (summaryDurationSpan && sessionDurationSelect) summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text.split(" - ")[0]; // Only duration
        if (summaryDatetimeSpan) summaryDatetimeSpan.textContent = `${date} ${time}`;
        if (summaryQuantitySpan) summaryQuantitySpan.textContent = quantity;
        if (summaryPriceSpan) summaryPriceSpan.textContent = `${totalFinalPrice.toFixed(2)}€`;
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

        // Show summary, hide calendar/options
        if (coachingSummarySection) {
            coachingSummarySection.classList.remove("hidden");
            if (coachingBookingContainer) coachingBookingContainer.style.display = "none";

            // CHAMA A FUNÇÃO DE INICIALIZAÇÃO DO BOOKING.JS APÓS MOSTRAR O RESUMO
            if (typeof window.initializeCoachingSummaryInteractions === "function") {
                console.log("DEBUG: Chamando initializeCoachingSummaryInteractions de calendar.js");
                window.initializeCoachingSummaryInteractions();
            } else {
                console.warn("Função initializeCoachingSummaryInteractions não encontrada. Verifique booking.js.");
            }
        }
    }

    // Add event listeners for price calculation
    if (sessionDurationSelect) sessionDurationSelect.addEventListener("change", calculatePrice);
    if (sessionQuantitySelect) sessionQuantitySelect.addEventListener("change", calculatePrice);

    // --- Calendar Initialization ---
    if (calendarEl) {
        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: "timeGridWeek",
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay"
                },
                locale: "pt",
                slotMinTime: "09:00:00",
                slotMaxTime: "22:00:00",
                allDaySlot: false,
                height: "auto",
                selectable: false, 
                nowIndicator: true,
                businessHours: { 
                    daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
                    startTime: "09:00", 
                    endTime: "18:00", 
                },
                dateClick: function(info) {
                    if (info.date < new Date()) {
                        alert("Não pode selecionar datas ou horas passadas.");
                        return;
                    }
                    
                    const clickedDate = info.dateStr.substring(0, 10); // YYYY-MM-DD
                    const clickedTime = info.dateStr.substring(11, 16); // HH:MM
                    
                    console.log("Date clicked:", info.dateStr);
                    window.updateBookingSummary(clickedDate, clickedTime);
                },
                eventTimeFormat: { 
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }
            });
            calendar.render();
            console.log("FullCalendar rendered with dateClick handler.");
            
            // Initial price calculation on load
            calculatePrice();

        } catch (error) {
            console.error("Error initializing FullCalendar:", error);
            alert("Erro ao carregar o calendário. Por favor, tente recarregar a página.");
        }
    } else {
        console.warn("Calendar element not found.");
    }

    // --- Terms Modal Logic (Mantida para consistência, mas a lógica principal está em booking.js) ---
    const termsModal = document.getElementById("terms-modal");
    const closeTermsModalBtn = document.getElementById("close-terms-modal");
    const acceptTermsModalBtn = document.getElementById("accept-terms-modal");
    // Os links openTermsModalCoachingLink e openTermsModalCvLink são configurados em booking.js

    function closeModalHelper() { 
        if (termsModal) termsModal.style.display = "none"; 
    }
    
    if (closeTermsModalBtn) closeTermsModalBtn.addEventListener("click", closeModalHelper);
    
    if (acceptTermsModalBtn) {
        acceptTermsModalBtn.addEventListener("click", () => {
            // A lógica de marcar o checkbox correspondente ao fluxo (coaching/cv)
            // já está em booking.js dentro da função openModalGlobal e no listener do acceptTermsModalBtn lá.
            // Aqui, apenas fechamos o modal.
            closeModalHelper();
        });
    }

    // Fechar modal se clicado fora (esta lógica pode ser centralizada em booking.js também se preferir)
    window.addEventListener("click", (event) => {
        if (event.target == termsModal) {
            closeModalHelper();
        }
    });

}); // Fim do DOMContentLoaded

