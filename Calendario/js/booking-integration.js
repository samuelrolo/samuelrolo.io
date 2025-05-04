// Integração do BookingManager com o calendário e sistema de pagamento
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o BookingManager já foi inicializado
    if (!window.bookingManager) {
        window.bookingManager = new BookingManager();
        window.bookingManager.loadBookings();
    }
    
    // Referência ao calendário
    const calendarEl = document.getElementById('calendar');
    let calendar;
    
    // Verificar se o calendário já foi inicializado pelo calendar.js
    if (calendarEl.innerHTML === '') {
        console.error('Calendário não inicializado. Verifique se calendar.js está carregado corretamente.');
        return;
    }
    
    // Obter referência ao objeto de calendário do FullCalendar
    calendar = calendarEl._fullCalendar;
    
    // Se não conseguir obter a referência, usar uma abordagem alternativa
    if (!calendar) {
        // Aguardar a inicialização do calendário
        const checkCalendar = setInterval(() => {
            if (calendarEl._fullCalendar) {
                calendar = calendarEl._fullCalendar;
                clearInterval(checkCalendar);
                setupCalendarIntegration();
            }
        }, 100);
    } else {
        setupCalendarIntegration();
    }
    
    // Configurar integração com o calendário
    function setupCalendarIntegration() {
        // Carregar reservas existentes no calendário
        const bookings = window.bookingManager.getAllBookings();
        
        bookings.forEach(booking => {
            calendar.addEvent({
                title: booking.type === 'remote' ? 'Sessão Remota' : 'Sessão Presencial',
                start: new Date(booking.startTime),
                end: new Date(booking.endTime),
                backgroundColor: booking.type === 'remote' ? '#3498db' : '#e74c3c',
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
                
                // Adicionar evento de bloqueio (invisível para o usuário)
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
        });
        
        // Sobrescrever o manipulador de clique de data do calendar.js
        calendar.setOption('dateClick', function(info) {
            handleDateClick(info);
        });
    }
    
    // Manipulador de clique em data no calendário
    function handleDateClick(info) {
        const clickedDate = new Date(info.date);
        const sessionType = document.getElementById('session-type').value;
        const sessionDuration = parseInt(document.getElementById('session-duration').value);
        const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
        
        // Verificar disponibilidade com o BookingManager
        const availabilityCheck = window.bookingManager.checkAvailability(
            clickedDate,
            sessionDuration,
            sessionType
        );
        
        if (!availabilityCheck.available) {
            alert(availabilityCheck.reason);
            return;
        }
        
        // Calcular horário de término
        const endDate = new Date(clickedDate.getTime() + sessionDuration * 60000);
        
        // Adicionar evento temporário ao calendário
        const tempEvent = calendar.addEvent({
            title: sessionType === 'remote' ? 'Sessão Remota (Pendente)' : 'Sessão Presencial (Pendente)',
            start: clickedDate,
            end: endDate,
            backgroundColor: sessionType === 'remote' ? '#3498db' : '#e74c3c',
            textColor: 'white',
            extendedProps: {
                isPending: true,
                sessionType: sessionType,
                duration: sessionDuration
            }
        });
        
        // Se for sessão presencial, adicionar bloqueio temporário do dia
        let tempBlocker = null;
        if (sessionType === 'presential') {
            // Definir início do dia (00:00)
            const dayStart = new Date(clickedDate);
            dayStart.setHours(0, 0, 0, 0);
            
            // Definir fim do dia (23:59)
            const dayEnd = new Date(clickedDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            // Adicionar evento de bloqueio temporário
            tempBlocker = calendar.addEvent({
                title: 'Dia Bloqueado (Pendente)',
                start: dayStart,
                end: dayEnd,
                display: 'background',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                extendedProps: {
                    isPending: true,
                    isBlocker: true
                }
            });
        }
        
        // Mostrar resumo da marcação
        showBookingSummary(clickedDate, endDate, tempEvent, tempBlocker);
    }
    
    // Função para mostrar o resumo da marcação
    function showBookingSummary(startDate, endDate, tempEvent, tempBlocker) {
        const sessionType = document.getElementById('session-type').value;
        const sessionDuration = parseInt(document.getElementById('session-duration').value);
        const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
        
        // Formatar data e hora
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedStart = startDate.toLocaleDateString('pt-PT', options);
        
        // Criar objeto de reserva temporário para cálculo de preço
        const tempBooking = {
            type: sessionType,
            duration: sessionDuration,
            quantity: sessionQuantity,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            userEmail: '' // Será preenchido depois
        };
        
        // Verificar se é uma das primeiras 10 vagas
        if (window.bookingManager.earlyBookingCount < window.bookingManager.maxEarlyBookings && sessionQuantity === 1) {
            tempBooking.hasEarlyDiscount = true;
        } else {
            tempBooking.hasEarlyDiscount = false;
        }
        
        // Calcular preço final
        const finalPrice = window.bookingManager.calculatePrice(tempBooking);
        
        // Atualizar informações de preço no formulário
        const basePrice = (sessionDuration / 15) * 10;
        document.getElementById('base-price').textContent = `${basePrice.toFixed(2)}€`;
        document.getElementById('discount').textContent = `${(basePrice * sessionQuantity - finalPrice).toFixed(2)}€`;
        document.getElementById('final-price').textContent = `${finalPrice.toFixed(2)}€`;
        
        // Atualizar resumo da marcação
        document.getElementById('summary-type').textContent = sessionType === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)';
        document.getElementById('summary-duration').textContent = `${sessionDuration} minutos`;
        document.getElementById('summary-datetime').textContent = formattedStart;
        document.getElementById('summary-quantity').textContent = `${sessionQuantity} sessão(ões)`;
        document.getElementById('summary-price').textContent = `${finalPrice.toFixed(2)}€`;
        
        // Mostrar seção de resumo
        document.getElementById('booking-summary').classList.remove('hidden');
        
        // Rolar para a seção de resumo
        document.getElementById('booking-summary').scrollIntoView({ behavior: 'smooth' });
        
        // Configurar botão de voltar
        document.getElementById('back-button').onclick = function() {
            // Remover eventos temporários
            if (tempEvent) tempEvent.remove();
            if (tempBlocker) tempBlocker.remove();
            
            // Esconder resumo
            document.getElementById('booking-summary').classList.add('hidden');
        };
        
        // Configurar botão de confirmar
        document.getElementById('confirm-booking').onclick = function() {
            if (!document.getElementById('terms-accept').checked) {
                alert('Por favor, aceite os termos e condições para continuar.');
                return;
            }
            
            // Verificar se todos os campos obrigatórios estão preenchidos
            const userName = document.getElementById('user-name').value;
            const userEmail = document.getElementById('user-email').value;
            const userPhone = document.getElementById('user-phone').value;
            const userNotes = document.getElementById('user-notes').value;
            
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
            
            // Criar objeto de reserva completo
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
                paymentMethod: selectedPayment.getAttribute('data-method')
            };
            
            // Processar pagamento
            processPaymentAndConfirmBooking(booking, tempEvent, tempBlocker);
        };
    }
    
    // Função para processar pagamento e confirmar reserva
    function processPaymentAndConfirmBooking(booking, tempEvent, tempBlocker) {
        // Mostrar indicador de carregamento
        showLoadingIndicator('Processando pagamento...');
        
        // Simular processamento de pagamento
        setTimeout(() => {
            // Remover eventos temporários
            if (tempEvent) tempEvent.remove();
            if (tempBlocker) tempBlocker.remove();
            
            // Adicionar reserva ao gerenciador
            const confirmedBooking = window.bookingManager.addBooking(booking);
            
            // Adicionar evento confirmado ao calendário
            const eventTitle = booking.type === 'remote' ? 'Sessão Remota' : 'Sessão Presencial';
            const eventColor = booking.type === 'remote' ? '#3498db' : '#e74c3c';
            
            const confirmedEvent = calendar.addEvent({
                title: eventTitle,
                start: new Date(booking.startTime),
                end: new Date(booking.endTime),
                backgroundColor: eventColor,
                extendedProps: {
                    bookingId: confirmedBooking.id,
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
                        relatedBookingId: confirmedBooking.id
                    }
                });
            }
            
            // Esconder indicador de carregamento
            hideLoadingIndicator();
            
            // Mostrar mensagem de sucesso
            showSuccessMessage(confirmedBooking);
            
            // Sincronizar com Google Calendar
            syncWithGoogleCalendar(confirmedBooking);
            
            // Esconder resumo
            document.getElementById('booking-summary').classList.add('hidden');
            
            // Limpar formulário
            document.getElementById('user-form').reset();
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('selected');
            });
            document.getElementById('terms-accept').checked = false;
        }, 2000);
    }
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage(booking) {
        // Formatar data e hora
        const startDate = new Date(booking.startTime);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedStart = startDate.toLocaleDateString('pt-PT', options);
        
        // Criar e mostrar modal de sucesso
        const modalHtml = `
            <div id="success-modal" class="modal" style="display: block;">
                <div class="modal-content">
                    <span class="close" onclick="document.getElementById('success-modal').remove()">&times;</span>
                    <h2 style="color: #2ecc71;"><i class="fas fa-check-circle" style="margin-right: 10px;"></i>Reserva Confirmada!</h2>
                    <div style="margin: 20px 0;">
                        <p><strong>ID da Reserva:</strong> ${booking.id}</p>
                        <p><strong>Tipo de Sessão:</strong> ${booking.type === 'remote' ? 'Remota (Online)' : 'Presencial (Distrito de Lisboa)'}</p>
                        <p><strong>Data e Hora:</strong> ${formattedStart}</p>
                        <p><strong>Duração:</strong> ${booking.duration} minutos</p>
                        <p><strong>Quantidade:</strong> ${booking.quantity} sessão(ões)</p>
                        <p><strong>Preço Total:</strong> ${booking.finalPrice.toFixed(2)}€</p>
                    </div>
                    <p>Um email de confirmação foi enviado para ${booking.userEmail} com os detalhes da sua marcação.</p>
                    <p>A sua sessão foi adicionada ao calendário e o coach entrará em contato antes da data marcada.</p>
                    <button onclick="document.getElementById('success-modal').remove();" class="btn btn-primary" style="margin-top: 20px;">Concluir</button>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
    }
    
    // Função para sincronizar com Google Calendar
    function syncWithGoogleCalendar(booking) {
        console.log(`Sincronizando com Google Calendar: Reserva ${booking.id}`);
        // Esta função seria implementada com a API do Google Calendar
        // Para fins de demonstração, apenas logamos a intenção
    }
    
    // Função para mostrar indicador de carregamento
    function showLoadingIndicator(message) {
        // Criar e mostrar indicador de carregamento
        const loaderHtml = `
            <div id="loader-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
                <div style="background-color: white; padding: 30px; border-radius: 5px; text-align: center;">
                    <div class="loader" style="margin: 0 auto 20px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;"></div>
                    <p>${message}</p>
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                </div>
            </div>
        `;
        
        // Adicionar loader ao DOM
        const loaderContainer = document.createElement('div');
        loaderContainer.innerHTML = loaderHtml;
        document.body.appendChild(loaderContainer.firstElementChild);
    }
    
    // Função para esconder indicador de carregamento
    function hideLoadingIndicator() {
        // Remover indicador de carregamento
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.remove();
        }
    }
});
