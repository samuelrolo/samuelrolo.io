// Script para controle do carrossel de recomendações
document.addEventListener('DOMContentLoaded', function()  {
    // Elementos do carrossel de recomendações
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    const prevRecommendationBtn = document.getElementById('prevRecommendation');
    const nextRecommendationBtn = document.getElementById('nextRecommendation');
    
    // Inicialização
    let currentRecommendationIndex = 0;
    
    // Esconder todas as recomendações exceto a primeira
    for (let i = 1; i < recommendationCards.length; i++) {
        recommendationCards[i].style.display = 'none';
    }
    
    // Função para mostrar uma recomendação específica
    function showRecommendation(index) {
        // Esconder todas as recomendações
        recommendationCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Mostrar a recomendação atual
        recommendationCards[index].style.display = 'block';
        
        // Adicionar animação de fade-in
        recommendationCards[index].style.opacity = 0;
        setTimeout(() => {
            recommendationCards[index].style.opacity = 1;
            recommendationCards[index].style.transition = 'opacity 0.5s ease-in-out';
        }, 50);
    }
    
    // Evento para o botão anterior
    prevRecommendationBtn.addEventListener('click', function() {
        currentRecommendationIndex--;
        if (currentRecommendationIndex < 0) {
            currentRecommendationIndex = recommendationCards.length - 1;
        }
        showRecommendation(currentRecommendationIndex);
    });
    
    // Evento para o botão próximo
    nextRecommendationBtn.addEventListener('click', function() {
        currentRecommendationIndex++;
        if (currentRecommendationIndex >= recommendationCards.length) {
            currentRecommendationIndex = 0;
        }
        showRecommendation(currentRecommendationIndex);
    });
    
    // Rotação automática a cada 5 segundos
    setInterval(function() {
        currentRecommendationIndex++;
        if (currentRecommendationIndex >= recommendationCards.length) {
            currentRecommendationIndex = 0;
        }
        showRecommendation(currentRecommendationIndex);
    }, 5000);
    
    // Adicionar efeito de hover nos cards de artigos
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Botão de subscrição da newsletter
    const subscribeBtn = document.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de subscrição será implementada em breve!');
        });
    }
});
