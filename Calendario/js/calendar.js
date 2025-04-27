document.addEventListener('DOMContentLoaded', function() {
    // Configuração do calendário
    const calendarEl = document.getElementById('calendar');
    
    // Definir horários disponíveis
    const availableTimeSlots = {
        // Sábados: 09:30 às 16:00 (pausa de almoço das 12:00 às 13:00)
        0: [], // Domingo - não disponível
        1: [], // Segunda - 18:30 às 21:30
        2: [], // Terça - 18:30 às 21:30
        3: [], // Quarta - 18:30 às 21:30
        4: [], // Quinta - 18:30 às 21:30
        5: [], // Sexta - 18:30 às 21:30
        6: []  // Sábado - 09:30 às 16:00 (pausa 12:00-13:00)
    };
    
    // Preencher horários disponíveis para dias de semana (18:30 às 21:30)
    for (let day = 1; day <= 5; day++) {
        let startTime = 18 * 60 + 30; // 18:30 em minutos
        const endTime = 21 * 60 + 30;  // 21:30 em minutos
        
        while (startTime < endTime) {
            const hour = Math.floor(startTime / 60);
            const minute = startTime % 60;
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            
            availableTimeSlots[day].push(`${formattedHour}:${formattedMinute}`);
            startTime += 15; // Incremento de 15 minutos
        }
    }
    
    // Preencher horários disponíveis para sábados (09:30 às 16:00, pausa 12:00-13:00)
    let startTime = 9 * 60 + 30; // 09:30 em minutos
    const lunchStart = 12 * 60; // 12:00 em minutos
    const lunchEnd = 13 * 60;   // 13:00 em minutos
    const endTime = 16 * 60;    // 16:00 em minutos
    
    while (startTime < endTime) {
        // Pular horário de almoço
        if (startTime >= lunchStart && startTime < lunchEnd) {
            startTime = lunchEnd;
            continue;
        }
        
        const hour = Math.floor(startTime / 60);
        const minute = startTime % 60;
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        
        availableTimeSlots[6].push(`${formattedHour}:${formattedMinute}`);
        startTime += 15; // Incremento de 15 minutos
    }
    
    // Inicializar o calendário
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
        slotDuration: '00:15:00',
        allDaySlot: false,
        height: 'auto',
        expandRows: true,
        selectable: true,
        selectMirror: true,
        nowIndicator: true,
        businessHours: [
            {
                daysOfWeek: [1, 2, 3, 4, 5], // Segunda a sexta
                startTime: '18:30',
                endTime: '21:30'
            },
            {
                daysOfWeek: [6], // Sábado
                startTime: '09:30',
                endTime: '12:00'
            },
            {
                daysOfWeek: [6], // Sábado (após almoço)
                startTime: '13:00',
                endTime: '16:00'
            }
        ],
        selectConstraint: 'businessHours',
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        select: function(info) {
            handleTimeSlotSelection(info);
        },
        eventClick: function(info) {
            // Ao clicar em um evento existente
            alert('Este horário já está reservado.');
        },
        dateClick: function(info) {
            // Verificar se o horário clicado está dentro dos horários disponíveis
            const clickedDate = new Date(info.date);
            const dayOfWeek = clickedDate.getDay();
            const hour = clickedDate.getHours();
            const minute = clickedDate.getMinutes();
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            const timeString = `${formattedHour}:${formattedMinute}`;
            
            if (availableTimeSlots[dayOfWeek].includes(timeString)) {
                // Horário disponível
                const sessionDuration = parseInt(document.getElementById('session-duration').value);
                const sessionType = document.getElementById('session-type').value;
                
                // Verificar se é uma sessão presencial (que requer 60 minutos mínimo)
                if (sessionType === 'presential' && sessionDuration < 60) {
                    alert('Sessões presenciais requerem duração mínima de 60 minutos.');
                    return;
                }
                
                // Verificar antecedência mínima
                const now = new Date();
                const timeDiff = clickedDate.getTime() - now.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (sessionType === 'remote' && hoursDiff < 48) {
                    alert('Sessões remotas devem ser marcadas com pelo menos 48 horas de antecedência.');
                    return;
                }
                
                if (sessionType === 'presential' && hoursDiff < 120) { // 5 dias = 120 horas
                    alert('Sessões presenciais devem ser marcadas com pelo menos 5 dias úteis de antecedência.');
                    return;
                }
                
                // Calcular horário de término com base na duração selecionada
                const endDate = new Date(clickedDate);
                endDate.setMinutes(endDate.getMinutes() + sessionDuration);
                
                // Verificar se o horário de término está dentro do horário disponível
                // Para simplificar, apenas verificamos se não ultrapassa o horário de funcionamento
                if ((dayOfWeek >= 1 && dayOfWeek <= 5 && endDate.getHours() > 21) || 
                    (dayOfWeek === 6 && (endDate.getHours() > 16 || (endDate.getHours() === 16 && endDate.getMinutes() > 0)))) {
                    alert('O horário selecionado ultrapassa o horário de funcionamento.');
                    return;
                }
                
                // Se for sessão presencial, verificar se já existe alguma sessão presencial no mesmo dia
                if (sessionType === 'presential') {
                    const events = calendar.getEvents();
                    const sameDay = events.filter(event => {
                        const eventDate = event.start;
                        return eventDate.getFullYear() === clickedDate.getFullYear() &&
                               eventDate.getMonth() === clickedDate.getMonth() &&
                               eventDate.getDate() === clickedDate.getDate() &&
                               event.extendedProps.sessionType === 'presential';
                    });
                    
                    if (sameDay.length > 0) {
                        alert('Já existe uma sessão presencial marcada para este dia. Sessões presenciais bloqueiam o dia inteiro.');
                        return;
                    }
                }
                
                // Adicionar evento ao calendário
                calendar.addEvent({
                    title: sessionType === 'remote' ? 'Sessão Remota' : 'Sessão Presencial',
                    start: clickedDate,
                    end: endDate,
                    backgroundColor: sessionType === 'remote' ? '#3498db' : '#e74c3c',
                    extendedProps: {
                        sessionType: sessionType,
                        duration: sessionDuration
                    }
                });
                
                // Se for sessão presencial, bloquear o resto do dia
                if (sessionType === 'presential') {
                    // Definir início do dia (00:00)
                    const dayStart = new Date(clickedDate);
                    dayStart.setHours(0, 0, 0, 0);
                    
                    // Definir fim do dia (23:59)
                    const dayEnd = new Date(clickedDate);
                    dayEnd.setHours(23, 59, 59, 999);
                    
                    // Adicionar evento de bloqueio (invisível para o usuário)
                    calendar.addEvent({
                        title: 'Dia Bloqueado (Sessão Presencial)',
                        start: dayStart,
                        end: dayEnd,
                        display: 'background',
                        backgroundColor: 'rgba(231, 76, 60, 0.3)',
                        extendedProps: {
                            isBlocker: true
                        }
                    });
                }
                
                // Mostrar resumo da marcação
                showBookingSummary(clickedDate, endDate);
            } else {
                alert('Este horário não está disponível para marcação.');
            }
        }
    });
    
    calendar.render();
    
    // Função para mostrar o resumo da marcação
    function showBookingSummary(startDate, endDate) {
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
        
        // Calcular preço
        const basePrice = (sessionDuration / 15) * 10;
        let discount = 0;
        
        if (sessionQuantity >= 2) {
            if (sessionDuration === 30) {
                discount = 2.5;
            } else if (sessionDuration === 45) {
                discount = 5;
            } else if (sessionDuration === 60) {
                discount = 7.5;
            }
        }
        
        // Verificar se é uma das primeiras 10 vagas (simulação)
        const isEarlyBooking = Math.random() < 0.5; // Simulação: 50% de chance de ser uma das primeiras 10 vagas
        let earlyDiscount = 0;
        
        if (isEarlyBooking && sessionQuantity === 1) {
            earlyDiscount = basePrice * 0.25;
        }
        
        const totalDiscount = discount + earlyDiscount;
        const finalPrice = (basePrice - discount) * sessionQuantity - earlyDiscount;
        
        // Atualizar informações de preço no formulário
        document.getElementById('base-price').textContent = `${basePrice.toFixed(2)}€`;
        document.getElementById('discount').textContent = `${totalDiscount.toFixed(2)}€`;
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
    }
    
    // Atualizar preços quando a duração ou quantidade mudar
    document.getElementById('session-duration').addEventListener('change', updatePrice);
    document.getElementById('session-quantity').addEventListener('change', updatePrice);
    
    function updatePrice() {
        const sessionDuration = parseInt(document.getElementById('session-duration').value);
        const sessionQuantity = parseInt(document.getElementById('session-quantity').value);
        
        // Calcular preço base
        const basePrice = (sessionDuration / 15) * 10;
        let discount = 0;
        
        // Aplicar desconto para múltiplas sessões
        if (sessionQuantity >= 2) {
            if (sessionDuration === 30) {
                discount = 2.5;
            } else if (sessionDuration === 45) {
                discount = 5;
            } else if (sessionDuration === 60) {
                discount = 7.5;
            }
        }
        
        // Verificar se é uma das primeiras 10 vagas (simulação)
        const isEarlyBooking = Math.random() < 0.5; // Simulação: 50% de chance de ser uma das primeiras 10 vagas
        let earlyDiscount = 0;
        
        if (isEarlyBooking && sessionQuantity === 1) {
            earlyDiscount = basePrice * 0.25;
        }
        
        const totalDiscount = discount + earlyDiscount;
        const finalPrice = (basePrice - discount) * sessionQuantity - earlyDiscount;
        
        // Atualizar informações de preço
        document.getElementById('base-price').textContent = `${basePrice.toFixed(2)}€`;
        document.getElementById('discount').textContent = `${totalDiscount.toFixed(2)}€`;
        document.getElementById('final-price').textContent = `${finalPrice.toFixed(2)}€`;
    }
    
    // Inicializar preço
    updatePrice();
    
    // Verificar tipo de sessão para validar duração mínima
    document.getElementById('session-type').addEventListener('change', function() {
        const sessionType = this.value;
        const durationSelect = document.getElementById('session-duration');
        
        if (sessionType === 'presential') {
            // Para sessões presenciais, duração mínima de 60 minutos
            const options = durationSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (parseInt(options[i].value) < 60) {
                    options[i].disabled = true;
                }
            }
            
            // Selecionar automaticamente 60 minutos se a duração atual for menor
            if (parseInt(durationSelect.value) < 60) {
                durationSelect.value = '60';
                updatePrice();
            }
        } else {
            // Para sessões remotas, habilitar todas as opções
            const options = durationSelect.options;
            for (let i = 0; i < options.length; i++) {
                options[i].disabled = false;
            }
        }
    });
    
    // Botão de voltar no resumo
    document.getElementById('back-button').addEventListener('click', function() {
        document.getElementById('booking-summary').classList.add('hidden');
    });
    
    // Modal de termos e condições
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const closeBtn = document.getElementsByClassName('close')[0];
    const acceptTermsBtn = document.getElementById('accept-terms');
    
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        termsModal.style.display = 'none';
    });
    
    acceptTermsBtn.addEventListener('click', function() {
        document.getElementById('terms-accept').checked = true;
        termsModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === termsModal) {
            termsModal.style.display = 'none';
        }
    });
    
    // Botão de confirmar marcação
    document.getElementById('confirm-booking').addEventListener('click', function() {
        if (!document.getElementById('terms-accept').checked) {
            alert('Por favor, aceite os termos e condições para continuar.');
            return;
        }
        
        // Verificar se todos os campos obrigatórios estão preenchidos
        const userName = document.getElementById('user-name').value;
        const userEmail = document.getElementById('user-email').value;
        const userPhone = document.getElementById('user-phone').value;
        
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
        
        // Aqui seria implementada a integração com o sistema de pagamento
        alert('Redirecionando para o sistema de pagamento...');
        
        // Simulação de pagamento bem-sucedido
        setTimeout(function() {
            alert('Pagamento realizado com sucesso! Sua sessão foi confirmada.');
            // Aqui seria implementada a integração com o Gmail Calendar
        }, 2000);
    });
    
    // Seleção de método de pagamento
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover seleção anterior
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Adicionar seleção ao método clicado
            this.classList.add('selected');
        });
    });
});
