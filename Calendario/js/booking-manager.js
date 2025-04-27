// Classe para gerenciar as reservas
class BookingManager {
    constructor() {
        this.bookings = [];
        this.earlyBookingCount = 0; // Contador para as primeiras 10 vagas
        this.maxEarlyBookings = 10;
        this.userBookingCount = {}; // Contador de reservas por usuário para oferta de sessão gratuita
    }

    // Adicionar uma nova reserva
    addBooking(booking) {
        // Gerar ID único para a reserva
        booking.id = 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Verificar se ainda há vagas com desconto de primeiras marcações
        if (this.earlyBookingCount < this.maxEarlyBookings && booking.quantity === 1) {
            booking.hasEarlyDiscount = true;
            this.earlyBookingCount++;
        } else {
            booking.hasEarlyDiscount = false;
        }
        
        // Atualizar contador de reservas do usuário
        if (!this.userBookingCount[booking.userEmail]) {
            this.userBookingCount[booking.userEmail] = 0;
        }
        this.userBookingCount[booking.userEmail] += booking.quantity;
        
        // Verificar se o usuário tem direito a sessão gratuita
        if (this.userBookingCount[booking.userEmail] >= 5) {
            booking.hasFreeSession = true;
            this.userBookingCount[booking.userEmail] -= 5; // Resetar contador
        } else {
            booking.hasFreeSession = false;
        }
        
        // Calcular preço final
        booking.finalPrice = this.calculatePrice(booking);
        
        // Adicionar timestamp de criação
        booking.createdAt = new Date().toISOString();
        
        // Adicionar à lista de reservas
        this.bookings.push(booking);
        
        // Salvar no localStorage para persistência
        this.saveBookings();
        
        return booking;
    }
    
    // Calcular preço com base nas regras de negócio
    calculatePrice(booking) {
        // Preço base por duração
        const basePrice = (booking.duration / 15) * 10;
        let discount = 0;
        
        // Desconto para múltiplas sessões (não aplicável para sessões presenciais)
        if (booking.type !== 'presential' && booking.quantity >= 2) {
            if (booking.duration === 30) {
                discount = 2.5;
            } else if (booking.duration === 45) {
                discount = 5;
            } else if (booking.duration === 60) {
                discount = 7.5;
            }
        }
        
        // Desconto para primeiras 10 vagas (25% na primeira marcação)
        let earlyDiscount = 0;
        if (booking.hasEarlyDiscount) {
            earlyDiscount = basePrice * 0.25;
        }
        
        // Desconto para sessão gratuita
        let freeSessionDiscount = 0;
        if (booking.hasFreeSession) {
            freeSessionDiscount = basePrice; // Uma sessão gratuita
        }
        
        // Cálculo do preço final
        const totalDiscount = discount * booking.quantity + earlyDiscount + freeSessionDiscount;
        const finalPrice = (basePrice * booking.quantity) - totalDiscount;
        
        return Math.max(0, finalPrice); // Garantir que o preço não seja negativo
    }
    
    // Verificar disponibilidade de um slot
    checkAvailability(date, duration, type) {
        // Converter para objeto Date se for string
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        // Verificar se o horário está dentro dos horários disponíveis
        if (!this.isWithinBusinessHours(date)) {
            return {
                available: false,
                reason: 'Horário fora do período de funcionamento'
            };
        }
        
        // Verificar antecedência mínima
        const now = new Date();
        const timeDiff = date.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (type === 'remote' && hoursDiff < 48) {
            return {
                available: false,
                reason: 'Sessões remotas devem ser marcadas com pelo menos 48 horas de antecedência'
            };
        }
        
        if (type === 'presential' && hoursDiff < 120) { // 5 dias = 120 horas
            return {
                available: false,
                reason: 'Sessões presenciais devem ser marcadas com pelo menos 5 dias úteis de antecedência'
            };
        }
        
        // Verificar se já existe uma sessão presencial no mesmo dia
        if (type === 'presential') {
            const sameDay = this.bookings.filter(booking => {
                const bookingDate = new Date(booking.startTime);
                return bookingDate.getFullYear() === date.getFullYear() &&
                       bookingDate.getMonth() === date.getMonth() &&
                       bookingDate.getDate() === date.getDate() &&
                       booking.type === 'presential';
            });
            
            if (sameDay.length > 0) {
                return {
                    available: false,
                    reason: 'Já existe uma sessão presencial marcada para este dia'
                };
            }
        }
        
        // Verificar se o slot já está reservado
        const endTime = new Date(date.getTime() + duration * 60000);
        
        const conflictingBookings = this.bookings.filter(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            
            // Verificar sobreposição de horários
            return (date < bookingEnd && endTime > bookingStart);
        });
        
        if (conflictingBookings.length > 0) {
            return {
                available: false,
                reason: 'Este horário já está reservado'
            };
        }
        
        // Se passou por todas as verificações, o slot está disponível
        return {
            available: true
        };
    }
    
    // Verificar se um horário está dentro do horário de funcionamento
    isWithinBusinessHours(date) {
        const day = date.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const hour = date.getHours();
        const minute = date.getMinutes();
        const timeInMinutes = hour * 60 + minute;
        
        // Verificar dias de semana (Segunda a Sexta: 18:30 às 21:30)
        if (day >= 1 && day <= 5) {
            return timeInMinutes >= 18 * 60 + 30 && timeInMinutes < 21 * 60 + 30;
        }
        
        // Verificar sábado (09:30 às 16:00, com pausa de 12:00 às 13:00)
        if (day === 6) {
            // Manhã: 09:30 às 12:00
            if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 12 * 60) {
                return true;
            }
            
            // Tarde: 13:00 às 16:00
            if (timeInMinutes >= 13 * 60 && timeInMinutes < 16 * 60) {
                return true;
            }
            
            return false;
        }
        
        // Domingo não tem horário disponível
        return false;
    }
    
    // Obter todas as reservas
    getAllBookings() {
        return this.bookings;
    }
    
    // Obter reservas de um usuário específico
    getUserBookings(email) {
        return this.bookings.filter(booking => booking.userEmail === email);
    }
    
    // Obter reservas para um dia específico
    getDayBookings(date) {
        // Converter para objeto Date se for string
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        return this.bookings.filter(booking => {
            const bookingDate = new Date(booking.startTime);
            return bookingDate.getFullYear() === date.getFullYear() &&
                   bookingDate.getMonth() === date.getMonth() &&
                   bookingDate.getDate() === date.getDate();
        });
    }
    
    // Cancelar uma reserva
    cancelBooking(bookingId, userEmail) {
        const bookingIndex = this.bookings.findIndex(booking => 
            booking.id === bookingId && booking.userEmail === userEmail
        );
        
        if (bookingIndex === -1) {
            return {
                success: false,
                reason: 'Reserva não encontrada'
            };
        }
        
        const booking = this.bookings[bookingIndex];
        const now = new Date();
        const bookingDate = new Date(booking.startTime);
        
        // Verificar se a reserva já ocorreu
        if (bookingDate < now) {
            return {
                success: false,
                reason: 'Não é possível cancelar uma reserva que já ocorreu'
            };
        }
        
        // Remover a reserva
        this.bookings.splice(bookingIndex, 1);
        
        // Salvar no localStorage
        this.saveBookings();
        
        // Calcular reembolso (se aplicável)
        let refundAmount = 0;
        
        // Verificar política de reembolso
        if (booking.quantity > 1) {
            // Em marcações com mais de uma sessão, apenas os valores além da primeira sessão podem ser reembolsados
            const singleSessionPrice = booking.finalPrice / booking.quantity;
            refundAmount = booking.finalPrice - singleSessionPrice;
        }
        
        return {
            success: true,
            refundAmount: refundAmount
        };
    }
    
    // Salvar reservas no localStorage
    saveBookings() {
        localStorage.setItem('share2inspire_bookings', JSON.stringify(this.bookings));
        localStorage.setItem('share2inspire_earlyBookingCount', this.earlyBookingCount);
        localStorage.setItem('share2inspire_userBookingCount', JSON.stringify(this.userBookingCount));
    }
    
    // Carregar reservas do localStorage
    loadBookings() {
        const savedBookings = localStorage.getItem('share2inspire_bookings');
        const savedEarlyBookingCount = localStorage.getItem('share2inspire_earlyBookingCount');
        const savedUserBookingCount = localStorage.getItem('share2inspire_userBookingCount');
        
        if (savedBookings) {
            this.bookings = JSON.parse(savedBookings);
        }
        
        if (savedEarlyBookingCount) {
            this.earlyBookingCount = parseInt(savedEarlyBookingCount);
        }
        
        if (savedUserBookingCount) {
            this.userBookingCount = JSON.parse(savedUserBookingCount);
        }
    }
}

// Exportar a classe para uso global
window.BookingManager = BookingManager;

// Inicializar o gerenciador de reservas quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Criar instância do gerenciador de reservas
    window.bookingManager = new BookingManager();
    
    // Carregar reservas salvas
    window.bookingManager.loadBookings();
    
    console.log('Sistema de reservas inicializado');
});
