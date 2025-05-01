document.addEventListener('DOMContentLoaded', function() {
    console.log("Simplified calendar.js loaded");
    const calendarEl = document.getElementById('calendar');
    
    // Basic calendar initialization (commented out most features)
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
                height: 'auto'
                // Commented out: selectable, selectMirror, nowIndicator, businessHours, selectConstraint, eventTimeFormat, select, eventClick, dateClick
            });
            calendar.render();
            console.log("Basic FullCalendar rendered.");
        } catch (error) {
            console.error("Error initializing FullCalendar:", error);
        }
    } else {
        console.warn("Calendar element not found.");
    }

    // Commented out: showBookingSummary, updatePrice, session-type change listener, back-button listener, terms modal logic
});

