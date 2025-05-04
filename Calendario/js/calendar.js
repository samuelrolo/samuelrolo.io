document.addEventListener('DOMContentLoaded', function() {
    console.log("calendar.js loaded");
    const calendarEl = document.getElementById('calendar');
    const coachingBookingContainer = document.getElementById('coaching-flow')?.querySelector('.booking-container');
    const coachingSummarySection = document.getElementById('booking-summary-coaching');
    
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
        if (summaryTypeSpan) summaryTypeSpan.textContent = sessionTypeSelect.options[sessionTypeSelect.selectedIndex].text;
        if (summaryDurationSpan) summaryDurationSpan.textContent = sessionDurationSelect.options[sessionDurationSelect.selectedIndex].text.split(' - ')[0]; // Only duration
        if (summaryDatetimeSpan) summaryDatetimeSpan.textContent = `${date} ${time}`;
        if (summaryQuantitySpan) summaryQuantitySpan.textContent = quantity;
        if (summaryPriceSpan) summaryPriceSpan.textContent = `${totalFinalPrice.toFixed(2)}€`;
        if (paymentTypeSpan) paymentTypeSpan.textContent = paymentTypeText;
        if (paymentAmountSpan) paymentAmountSpan.textContent = `${paymentAmount.toFixed(2)}€`;
        
        if (remainingPaymentInfoDiv && remainingAmountSpan) {
            if (remainingAmount > 0) {
                remainingAmountSpan.textContent = `${remainingAmount.toFixed(2)}€`;
                remainingPaymentInfoDiv.style.display = 'block';
            } else {
                remainingPaymentInfoDiv.style.display = 'none';
            }
        }

        // Show summary, hide calendar/options
        if (coachingSummarySection) coachingSummarySection.classList.remove('hidden');
        if (coachingBookingContainer) coachingBookingContainer.style.display = 'none';
    }

    // Add event listeners for price calculation
    if (sessionDurationSelect) sessionDurationSelect.addEventListener('change', calculatePrice);
    if (sessionQuantitySelect) sessionQuantitySelect.addEventListener('change', calculatePrice);

    // --- Calendar Initialization ---
    if (calendarEl) {
        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                },
                locale: 'pt',
                slotMinTime: '09:00:00',
                slotMaxTime: '22:00:00',
                allDaySlot: false,
                height: 'auto',
                selectable: false, // Keep false if using dateClick
                nowIndicator: true,
                businessHours: { // Define business hours
                    daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
                    startTime: '09:00', 
                    endTime: '18:00', 
                },
                // Use dateClick to handle slot selection
                dateClick: function(info) {
                    // Basic validation: Prevent clicking past dates/times or outside business hours (optional)
                    if (info.date < new Date()) {
                        alert("Não pode selecionar datas ou horas passadas.");
                        return;
                    }
                    // You might add more sophisticated availability checks here later
                    
                    const clickedDate = info.dateStr.substring(0, 10); // YYYY-MM-DD
                    const clickedTime = info.dateStr.substring(11, 16); // HH:MM
                    
                    console.log('Date clicked:', info.dateStr);
                    // Call the function to update summary and store date/time
                    window.updateBookingSummary(clickedDate, clickedTime);
                },
                eventTimeFormat: { // Format time display
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }
                // Removed: select, selectMirror, selectConstraint, eventClick 
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

    // --- Terms Modal Logic (Copied from booking.js for completeness if needed here) ---
    const termsModal = document.getElementById("terms-modal");
    const closeTermsModalBtn = document.getElementById("close-terms-modal");
    const acceptTermsModalBtn = document.getElementById("accept-terms-modal");
    const openTermsModalCoachingLink = document.getElementById("open-terms-modal-coaching");
    const openTermsModalCvLink = document.getElementById("open-terms-modal-cv");
    const termsAcceptCoachingCheckbox = document.getElementById("terms-accept-coaching");
    const termsAcceptCvCheckbox = document.getElementById("terms-accept-cv");

    function openModal() { if (termsModal) termsModal.style.display = "block"; }
    function closeModal() { if (termsModal) termsModal.style.display = "none"; }

    if (openTermsModalCoachingLink) openTermsModalCoachingLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (openTermsModalCvLink) openTermsModalCvLink.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeTermsModalBtn) closeTermsModalBtn.addEventListener('click', closeModal);
    if (acceptTermsModalBtn) {
        acceptTermsModalBtn.addEventListener('click', () => {
            if (window.currentFlow === 'coaching' && termsAcceptCoachingCheckbox) termsAcceptCoachingCheckbox.checked = true;
            if (window.currentFlow === 'cv' && termsAcceptCvCheckbox) termsAcceptCvCheckbox.checked = true;
            closeModal();
        });
    }
    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == termsModal) {
            closeModal();
        }
    });

});

