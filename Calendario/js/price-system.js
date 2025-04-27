// Sistema de preços e descontos para o calendário de marcações
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do sistema de preços
    const priceSystem = {
        // Preços base por duração (em minutos)
        baseRates: {
            15: 10,  // 15 minutos: 10€
            30: 20,  // 30 minutos: 20€
            45: 30,  // 45 minutos: 30€
            60: 40   // 60 minutos: 40€
        },
        
        // Descontos para múltiplas sessões (em euros)
        quantityDiscounts: {
            30: 2.5,  // 30 minutos: -2,5€ em 2 ou mais marcações
            45: 5,    // 45 minutos: -5€ em 2 ou mais sessões
            60: 7.5   // 60 minutos: -7,5€ em mais do que duas marcações
        },
        
        // Desconto para primeiras 10 vagas
        earlyBookingDiscount: 0.25,  // 25% de desconto
        maxEarlyBookings: 10,        // Primeiras 10 vagas
        
        // Sessão gratuita a cada 5 sessões
        freeSessionThreshold: 5,
        
        // Contador de reservas (simulado)
        bookingCount: 0,
        
        // Inicializar sistema de preços
        init: function() {
            // Carregar contagem de reservas do localStorage
            const savedCount = localStorage.getItem('share2inspire_bookingCount');
            if (savedCount) {
                this.bookingCount = parseInt(savedCount);
            }
            
            // Configurar eventos para atualização de preços
            this.setupPriceUpdateEvents();
            
            // Atualizar preços iniciais
            this.updatePriceDisplay();
        },
        
        // Configurar eventos para atualização de preços
        setupPriceUpdateEvents: function() {
            const durationSelect = document.getElementById('session-duration');
            const quantitySelect = document.getElementById('session-quantity');
            const sessionTypeSelect = document.getElementById('session-type');
            
            if (durationSelect && quantitySelect && sessionTypeSelect) {
                durationSelect.addEventListener('change', () => this.updatePriceDisplay());
                quantitySelect.addEventListener('change', () => this.updatePriceDisplay());
                sessionTypeSelect.addEventListener('change', () => this.updatePriceDisplay());
            }
        },
        
        // Calcular preço com base na duração, quantidade e tipo de sessão
        calculatePrice: function(duration, quantity, sessionType) {
            // Obter preço base
            const basePrice = this.baseRates[duration] || 0;
            
            // Inicializar variáveis de desconto
            let quantityDiscount = 0;
            let earlyDiscount = 0;
            let freeSessionDiscount = 0;
            
            // Aplicar desconto para múltiplas sessões (não aplicável para sessões presenciais)
            if (sessionType !== 'presential' && quantity >= 2) {
                quantityDiscount = this.quantityDiscounts[duration] || 0;
            }
            
            // Verificar se é uma das primeiras 10 vagas
            const isEarlyBooking = this.bookingCount < this.maxEarlyBookings;
            if (isEarlyBooking && quantity === 1) {
                earlyDiscount = basePrice * this.earlyBookingDiscount;
            }
            
            // Verificar se tem direito a sessão gratuita
            const userSessionCount = this.getUserSessionCount();
            if (userSessionCount >= this.freeSessionThreshold) {
                freeSessionDiscount = basePrice; // Uma sessão gratuita
            }
            
            // Calcular preço final
            const totalDiscount = (quantityDiscount * quantity) + earlyDiscount + freeSessionDiscount;
            const finalPrice = (basePrice * quantity) - totalDiscount;
            
            return {
                basePrice: basePrice,
                quantityDiscount: quantityDiscount * quantity,
                earlyDiscount: earlyDiscount,
                freeSessionDiscount: freeSessionDiscount,
                totalDiscount: totalDiscount,
                finalPrice: Math.max(0, finalPrice) // Garantir que o preço não seja negativo
            };
        },
        
        // Obter contagem de sessões do usuário (simulado)
        getUserSessionCount: function() {
            // Em uma implementação real, isso seria baseado no usuário logado
            // Para fins de demonstração, usamos um valor aleatório
            return Math.floor(Math.random() * 10); // 0-9 sessões
        },
        
        // Atualizar exibição de preços na interface
        updatePriceDisplay: function() {
            const durationSelect = document.getElementById('session-duration');
            const quantitySelect = document.getElementById('session-quantity');
            const sessionTypeSelect = document.getElementById('session-type');
            
            if (!durationSelect || !quantitySelect || !sessionTypeSelect) {
                return;
            }
            
            const duration = parseInt(durationSelect.value);
            const quantity = parseInt(quantitySelect.value);
            const sessionType = sessionTypeSelect.value;
            
            // Calcular preço
            const priceDetails = this.calculatePrice(duration, quantity, sessionType);
            
            // Atualizar elementos de preço na interface
            const basePriceElement = document.getElementById('base-price');
            const discountElement = document.getElementById('discount');
            const finalPriceElement = document.getElementById('final-price');
            
            if (basePriceElement) {
                basePriceElement.textContent = `${priceDetails.basePrice.toFixed(2)}€`;
            }
            
            if (discountElement) {
                discountElement.textContent = `${priceDetails.totalDiscount.toFixed(2)}€`;
            }
            
            if (finalPriceElement) {
                finalPriceElement.textContent = `${priceDetails.finalPrice.toFixed(2)}€`;
            }
            
            // Atualizar detalhes de desconto (se existirem elementos para isso)
            this.updateDiscountDetails(priceDetails);
        },
        
        // Atualizar detalhes de desconto na interface
        updateDiscountDetails: function(priceDetails) {
            // Verificar se existem elementos para mostrar detalhes de desconto
            const discountDetailsElement = document.getElementById('discount-details');
            
            if (discountDetailsElement) {
                let detailsHtml = '';
                
                if (priceDetails.quantityDiscount > 0) {
                    detailsHtml += `<p>Desconto por quantidade: -${priceDetails.quantityDiscount.toFixed(2)}€</p>`;
                }
                
                if (priceDetails.earlyDiscount > 0) {
                    detailsHtml += `<p>Desconto primeiras 10 vagas (25%): -${priceDetails.earlyDiscount.toFixed(2)}€</p>`;
                }
                
                if (priceDetails.freeSessionDiscount > 0) {
                    detailsHtml += `<p>Sessão gratuita (a cada 5 sessões): -${priceDetails.freeSessionDiscount.toFixed(2)}€</p>`;
                }
                
                discountDetailsElement.innerHTML = detailsHtml;
            }
        },
        
        // Incrementar contador de reservas
        incrementBookingCount: function() {
            this.bookingCount++;
            localStorage.setItem('share2inspire_bookingCount', this.bookingCount);
        },
        
        // Obter informações sobre descontos disponíveis
        getDiscountInfo: function() {
            return {
                earlyBookingAvailable: this.bookingCount < this.maxEarlyBookings,
                remainingEarlyBookings: Math.max(0, this.maxEarlyBookings - this.bookingCount),
                userSessionCount: this.getUserSessionCount(),
                sessionsUntilFree: this.freeSessionThreshold - (this.getUserSessionCount() % this.freeSessionThreshold)
            };
        }
    };
    
    // Inicializar sistema de preços
    priceSystem.init();
    
    // Expor sistema de preços globalmente
    window.priceSystem = priceSystem;
    
    // Adicionar elemento para detalhes de desconto se não existir
    if (!document.getElementById('discount-details')) {
        const priceInfo = document.querySelector('.price-info');
        if (priceInfo) {
            const discountDetails = document.createElement('div');
            discountDetails.id = 'discount-details';
            discountDetails.className = 'discount-details';
            priceInfo.appendChild(discountDetails);
            
            // Adicionar estilos para os detalhes de desconto
            const style = document.createElement('style');
            style.textContent = `
                .discount-details {
                    margin-top: 10px;
                    font-size: 0.9em;
                    color: #2ecc71;
                }
                .discount-details p {
                    margin: 5px 0;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Adicionar informações sobre descontos disponíveis
    const addDiscountInfoSection = function() {
        const bookingOptions = document.querySelector('.booking-options');
        if (bookingOptions && !document.getElementById('discount-info-section')) {
            const discountInfo = priceSystem.getDiscountInfo();
            
            const discountInfoSection = document.createElement('div');
            discountInfoSection.id = 'discount-info-section';
            discountInfoSection.className = 'discount-info-section';
            
            let infoHtml = '<h4>Descontos Disponíveis</h4>';
            
            if (discountInfo.earlyBookingAvailable) {
                infoHtml += `<p><i class="fas fa-tag"></i> Promoção: 25% de desconto na primeira marcação (restam ${discountInfo.remainingEarlyBookings} vagas)</p>`;
            }
            
            infoHtml += `<p><i class="fas fa-gift"></i> Sessão gratuita: faltam ${discountInfo.sessionsUntilFree} sessões para ganhar uma sessão gratuita</p>`;
            infoHtml += `<p><i class="fas fa-users"></i> Desconto para múltiplas sessões: -2,5€ (30min), -5€ (45min), -7,5€ (60min) em 2 ou mais marcações</p>`;
            
            discountInfoSection.innerHTML = infoHtml;
            
            // Adicionar estilos para a seção de informações de desconto
            const style = document.createElement('style');
            style.textContent = `
                .discount-info-section {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    border-left: 4px solid #3498db;
                }
                .discount-info-section h4 {
                    margin-bottom: 10px;
                    color: #2c3e50;
                }
                .discount-info-section p {
                    margin: 8px 0;
                    font-size: 0.9em;
                }
                .discount-info-section i {
                    margin-right: 5px;
                    color: #3498db;
                }
            `;
            document.head.appendChild(style);
            
            bookingOptions.appendChild(discountInfoSection);
        }
    };
    
    // Adicionar seção de informações de desconto após um pequeno atraso
    setTimeout(addDiscountInfoSection, 500);
    
    // Integrar sistema de preços com o processo de reserva
    if (window.bookingManager) {
        // Sobrescrever método de cálculo de preço no BookingManager
        const originalCalculatePrice = window.bookingManager.calculatePrice;
        
        window.bookingManager.calculatePrice = function(booking) {
            // Usar o sistema de preços para calcular o preço
            const priceDetails = window.priceSystem.calculatePrice(
                booking.duration,
                booking.quantity,
                booking.type
            );
            
            // Incrementar contador de reservas quando uma reserva é confirmada
            window.priceSystem.incrementBookingCount();
            
            return priceDetails.finalPrice;
        };
    }
});
