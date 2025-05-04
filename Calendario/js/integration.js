// Integração final entre calendário, sistema de pagamento e Google Calendar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se todos os componentes necessários estão disponíveis
    const componentsReady = checkComponents();
    
    if (!componentsReady) {
        console.error('Nem todos os componentes necessários estão disponíveis. A integração completa não será possível.');
        return;
    }
    
    console.log('Iniciando integração completa do sistema de marcações');
    
    // Configurar integração entre calendário e sistema de pagamento
    setupCalendarPaymentIntegration();
    
    // Configurar integração entre sistema de pagamento e Google Calendar
    setupPaymentCalendarIntegration();
    
    // Configurar fluxo completo de reserva
    setupCompleteBookingFlow();
    
    console.log('Integração completa do sistema de marcações concluída');
    
    // Verificar se todos os componentes necessários estão disponíveis
    function checkComponents() {
        // Verificar BookingManager
        if (!window.bookingManager) {
            console.error('BookingManager não encontrado');
            return false;
        }
        
        // Verificar sistema de preços
        if (!window.priceSystem) {
            console.error('Sistema de preços não encontrado');
            return false;
        }
        
        // Verificar sistema de pagamento
        if (!window.paymentSystem) {
            console.error('Sistema de pagamento não encontrado');
            return false;
        }
        
        // Verificar integração com Google Calendar
        if (!window.googleCalendarIntegration) {
            console.error('Integração com Google Calendar não encontrada');
            return false;
        }
        
        return true;
    }
    
    // Configurar integração entre calendário e sistema de pagamento
    function setupCalendarPaymentIntegration() {
        console.log('Configurando integração entre calendário e sistema de pagamento');
        
        // Sobrescrever método de processamento de pagamento no BookingManager
        const originalProcessPaymentAndConfirmBooking = window.processPaymentAndConfirmBooking;
        
        if (typeof originalProcessPaymentAndConfirmBooking === 'function') {
            window.processPaymentAndConfirmBooking = function(booking, tempEvent, tempBlocker) {
                // Usar o sistema de pagamento para processar o pagamento
                const paymentMethod = booking.paymentMethod;
                
                // Mostrar indicador de carregamento
                window.paymentSystem.showLoadingIndicator('Processando pagamento...');
                
                // Processar pagamento com base no método selecionado
                window.paymentSystem.processPayment(paymentMethod, booking);
                
                // Remover eventos temporários do calendário
                if (tempEvent) tempEvent.remove();
                if (tempBlocker) tempBlocker.remove();
            };
        }
    }
    
    // Configurar integração entre sistema de pagamento e Google Calendar
    function setupPaymentCalendarIntegration() {
        console.log('Configurando integração entre sistema de pagamento e Google Calendar');
        
        // Sobrescrever método de tratamento de resultado de pagamento
        const originalHandlePaymentResult = window.paymentSystem.handlePaymentResult;
        
        if (typeof originalHandlePaymentResult === 'function') {
            window.paymentSystem.handlePaymentResult = function(result, booking) {
                // Chamar método original
                originalHandlePaymentResult.call(window.paymentSystem, result, booking);
                
                // Se pagamento bem-sucedido, sincronizar com Google Calendar
                if (result.success && window.googleCalendarIntegration.authState.isAuthenticated) {
                    window.googleCalendarIntegration.syncBooking(booking);
                }
                
                // Adicionar reserva confirmada ao BookingManager
                if (result.success && window.bookingManager) {
                    const confirmedBooking = window.bookingManager.addBooking(booking);
                    
                    // Atualizar contador de reservas no sistema de preços
                    if (window.priceSystem) {
                        window.priceSystem.incrementBookingCount();
                    }
                    
                    // Adicionar evento confirmado ao calendário
                    addConfirmedEventToCalendar(confirmedBooking);
                }
            };
        }
    }
    
    // Adicionar evento confirmado ao calendário
    function addConfirmedEventToCalendar(booking) {
        // Obter referência ao calendário
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl || !calendarEl._fullCalendar) {
            console.error('Calendário não encontrado');
            return;
        }
        
        const calendar = calendarEl._fullCalendar;
        
        // Adicionar evento confirmado ao calendário
        const eventTitle = booking.type === 'remote' ? 'Sessão Remota' : 'Sessão Presencial';
        const eventColor = booking.type === 'remote' ? '#3498db' : '#e74c3c';
        
        const confirmedEvent = calendar.addEvent({
            title: eventTitle,
            start: new Date(booking.startTime),
            end: new Date(booking.endTime),
            backgroundColor: eventColor,
            extendedProps: {
                bookingId: booking.id,
                sessionType: booking.type,
                duration: booking.duration
            }
        });
        
        // Se for sessão presencial, bloquear o resto do dia
        if (booking.type === 'presential') {
            const bookingDate = new Date(booking.startTime);
            
            // Definir início do dia (00:00)
            const dayStart = new Date(bookingDate);
            dayStart.setHours(0, 0, 0, 0);
            
            // Definir fim do dia (23:59)
            const dayEnd = new Date(bookingDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            // Adicionar evento de bloqueio
            calendar.addEvent({
                title: 'Dia Bloqueado (Sessão Presencial)',
                start: dayStart,
                end: dayEnd,
                display: 'background',
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                extendedProps: {
                    isBlocker: true,
                    relatedBookingId: booking.id
                }
            });
        }
    }
    
    // Configurar fluxo completo de reserva
    function setupCompleteBookingFlow() {
        console.log('Configurando fluxo completo de reserva');
        
        // Configurar botão de confirmar marcação
        const confirmButton = document.getElementById('confirm-booking');
        
        if (confirmButton) {
            confirmButton.addEventListener('click', function() {
                // Verificar termos e condições
                if (!document.getElementById('terms-accept').checked) {
                    alert('Por favor, aceite os termos e condições para continuar.');
                    return;
                }
                
                // Verificar se todos os campos obrigatórios estão preenchidos
                const userName = document.getElementById('user-name').value;
                const userEmail = document.getElementById('user-email').value;
                const userPhone = document.getElementById('user-phone').value;
                const userNotes = document.getElementById('user-notes')?.value || '';
                
                if (!userName || !userEmail || !userPhone) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }
                
                // Verificar se um método de pagamento foi selecionado
                const selectedPayment = document.querySelector('.payment-method.selected');
                if (!selectedPayment) {
                    alert('Por favor, selecione um método de pagamento.');
                    return;
                }
                
                // Obter detalhes da reserva
                const sessionType = document.getElementById('session-type').value;
                const sessionDuration = parseInt(document.getElementById('session-duration').value);
                const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
                const finalPrice = parseFloat(document.getElementById('final-price').textContent.replace('€', ''));
                
                // Obter datas de início e fim da reserva (simulado)
                const startDate = new Date();
                startDate.setDate(startDate.getDate() + 3); // 3 dias a partir de hoje
                
                // Ajustar para horário de funcionamento
                if (startDate.getDay() >= 1 && startDate.getDay() <= 5) {
                    // Dias de semana: 18:30
                    startDate.setHours(18, 30, 0, 0);
                } else {
                    // Sábado: 09:30
                    startDate.setHours(9, 30, 0, 0);
                }
                
                const endDate = new Date(startDate);
                endDate.setMinutes(endDate.getMinutes() + sessionDuration);
                
                // Criar objeto de reserva
                const booking = {
                    type: sessionType,
                    duration: sessionDuration,
                    quantity: sessionQuantity,
                    startTime: startDate.toISOString(),
                    endTime: endDate.toISOString(),
                    userName: userName,
                    userEmail: userEmail,
                    userPhone: userPhone,
                    userNotes: userNotes,
                    paymentMethod: selectedPayment.getAttribute('data-method'),
                    price: finalPrice
                };
                
                // Processar pagamento
                window.paymentSystem.processPayment(booking.paymentMethod, booking);
            });
        }
        
        // Carregar reservas existentes no calendário
        loadExistingBookings();
    }
    
    // Carregar reservas existentes no calendário
    function loadExistingBookings() {
        console.log('Carregando reservas existentes no calendário');
        
        // Obter reservas do BookingManager
        const bookings = window.bookingManager.getAllBookings();
        
        // Adicionar cada reserva ao calendário
        bookings.forEach(booking => {
            addConfirmedEventToCalendar(booking);
        });
        
        // Obter eventos do Google Calendar para o próximo mês
        if (window.googleCalendarIntegration.authState.isAuthenticated) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            
            window.googleCalendarIntegration.getEvents(startDate.toISOString(), endDate.toISOString())
                .then(events => {
                    // Converter eventos do Google Calendar para o formato do calendário
                    events.forEach(event => {
                        // Verificar se o evento já está no calendário
                        const existingBooking = bookings.find(booking => booking.googleEventId === event.id);
                        
                        if (!existingBooking) {
                            // Determinar tipo de sessão com base na cor do evento
                            const isRemote = event.colorId === '1';
                            
                            // Adicionar evento ao calendário
                            const calendarEl = document.getElementById('calendar');
                            if (calendarEl && calendarEl._fullCalendar) {
                                const calendar = calendarEl._fullCalendar;
                                
                                calendar.addEvent({
                                    title: isRemote ? 'Sessão Remota (Google)' : 'Sessão Presencial (Google)',
                                    start: new Date(event.start.dateTime),
                                    end: new Date(event.end.dateTime),
                                    backgroundColor: isRemote ? '#3498db' : '#e74c3c',
                                    extendedProps: {
                                        googleEventId: event.id,
                                        sessionType: isRemote ? 'remote' : 'presential'
                                    }
                                });
                                
                                // Se for sessão presencial, bloquear o resto do dia
                                if (!isRemote) {
                                    const eventDate = new Date(event.start.dateTime);
                                    
                                    // Definir início do dia (00:00)
                                    const dayStart = new Date(eventDate);
                                    dayStart.setHours(0, 0, 0, 0);
                                    
                                    // Definir fim do dia (23:59)
                                    const dayEnd = new Date(eventDate);
                                    dayEnd.setHours(23, 59, 59, 999);
                                    
                                    // Adicionar evento de bloqueio
                                    calendar.addEvent({
                                        title: 'Dia Bloqueado (Google)',
                                        start: dayStart,
                                        end: dayEnd,
                                        display: 'background',
                                        backgroundColor: 'rgba(231, 76, 60, 0.3)',
                                        extendedProps: {
                                            isBlocker: true,
                                            googleEventId: event.id
                                        }
                                    });
                                }
                            }
                        }
                    });
                });
        }
    }
});
