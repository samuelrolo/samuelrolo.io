/**** calendar_final_sync_v2.js ****/
document.addEventListener("DOMContentLoaded", function() {
    console.log("calendar.js (final_sync_v2) loaded");
    const calendarEl = document.getElementById("calendar");
    
    // References to form elements (needed for price calculation)
    const sessionTypeSelect = document.getElementById("session-type");
    const sessionDurationSelect = document.getElementById("session-duration");
    const sessionQuantitySelect = document.getElementById("session-quantity");
    const finalPriceSpanCoaching = document.getElementById("final-price"); // In the form section
    const basePriceSpan = document.getElementById("base-price");
    const discountSpan = document.getElementById("discount");

    // --- Price Calculation Logic (mantida para o formulário inicial) ---
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

        if (basePriceSpan) basePriceSpan.textContent = `${totalBasePrice.toFixed(2)}€`;
        if (discountSpan) discountSpan.textContent = `${totalDiscount.toFixed(2)}€`;
        if (finalPriceSpanCoaching) finalPriceSpanCoaching.textContent = `${totalFinalPrice.toFixed(2)}€`;

        // Esta função é chamada pelo booking.js, por isso precisa de existir globalmente
        // ou ser chamada explicitamente pelo booking.js se ele precisar destes valores.
        // Por agora, o booking.js tem a sua própria lógica de cálculo para o resumo.
        return { base: totalBasePrice, discount: totalDiscount, final: totalFinalPrice, finalPerSession: finalPricePerSession };
    }
    window.calculatePrice = calculatePrice; // Expor para booking.js se necessário, ou booking.js usa a sua.

    // Add event listeners for price calculation no formulário
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
                    
                    console.log("DEBUG (calendar.js): Date clicked:", info.dateStr);

                    // 1. Chamar setBookingDateTime do booking.js
                    if (typeof window.setBookingDateTime === "function") {
                        console.log("DEBUG (calendar.js): Chamando window.setBookingDateTime com:", clickedDate, clickedTime);
                        window.setBookingDateTime(clickedDate, clickedTime);
                    } else {
                        console.error("ERRO (calendar.js): Função window.setBookingDateTime não encontrada em booking.js.");
                        alert("Erro de configuração: setBookingDateTime não encontrada. Contacte o suporte.");
                        return; // Não continuar se a função crucial não existir
                    }

                    // 2. Chamar initializeCoachingSummaryInteractions do booking.js para mostrar e preencher o resumo
                    if (typeof window.initializeCoachingSummaryInteractions === "function") {
                        console.log("DEBUG (calendar.js): Chamando window.initializeCoachingSummaryInteractions.");
                        window.initializeCoachingSummaryInteractions();
                    } else {
                        console.error("ERRO (calendar.js): Função window.initializeCoachingSummaryInteractions não encontrada em booking.js.");
                        alert("Erro de configuração: initializeCoachingSummaryInteractions não encontrada. Contacte o suporte.");
                    }
                },
                eventTimeFormat: { 
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }
            });
            calendar.render();
            console.log("FullCalendar rendered with MODIFIED dateClick handler (final_sync_v2).");
            
            // Initial price calculation on load for the form
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

    function closeModalHelper() { 
        if (termsModal) termsModal.style.display = "none"; 
    }
    
    if (closeTermsModalBtn) closeTermsModalBtn.addEventListener("click", closeModalHelper);
    
    if (acceptTermsModalBtn) {
        acceptTermsModalBtn.addEventListener("click", () => {
            closeModalHelper();
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target == termsModal) {
            closeModalHelper();
        }
    });

}); // Fim do DOMContentLoaded

