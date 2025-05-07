document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const questionContainers = document.querySelectorAll('.question-container');
    const resultsContainer = document.getElementById('results-container');
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Variáveis de estado
    let currentQuestionIndex = 0;
    const totalQuestions = questionContainers.length;
    const userAnswers = {};
    
    // Definição dos arquétipos
    const archetypes = {
        'A': {
            name: 'Líder Visionário',
            title: 'O Pioneiro Inspirador',
            color: '#e74c3c',
            icon: 'fa-bolt',
            description: 'Tu és um líder movido pela inovação e pelo desejo de transformar o futuro. Tens uma visão clara do que queres alcançar e motivas os outros a seguir essa jornada contigo. Para ti, desafios são oportunidades, e não tens medo de correr riscos para alcançar grandes objetivos. A tua energia e paixão contagiam a equipa, e és frequentemente visto como uma fonte de inspiração.',
            strengths: [
                'Carisma e capacidade de motivação',
                'Visão estratégica a longo prazo',
                'Criatividade e disposição para arriscar'
            ],
            weaknesses: [
                'Podes ser impaciente com processos e detalhes',
                'Às vezes, corres riscos sem avaliar todas as consequências',
                'Precisas de garantir que toda a equipa acompanha o ritmo da tua visão'
            ],
            growthTip: 'Para maximizar o teu impacto, combina a tua visão inovadora com um plano estruturado, garantindo que a execução acompanha a ambição.'
        },
        'B': {
            name: 'Líder Estratega',
            title: 'O Mestre da Eficiência',
            color: '#3498db',
            icon: 'fa-chart-line',
            description: 'Tens uma mente analítica e estruturada, e és conhecido pela tua capacidade de tomar decisões baseadas em dados e lógica. Para ti, liderança significa criar processos eficientes, resolver problemas complexos e garantir que tudo funciona de forma otimizada. Não tomas decisões por impulso e gostas de analisar todas as variáveis antes de agir.',
            strengths: [
                'Raciocínio lógico e análise rigorosa',
                'Organização e planeamento estruturado',
                'Capacidade de resolver problemas com eficácia'
            ],
            weaknesses: [
                'Podes ser visto como demasiado racional e distante',
                'Tens tendência a focar-te mais nos números do que nas pessoas',
                'O perfeccionismo pode atrasar decisões importantes'
            ],
            growthTip: 'Complementa a tua abordagem racional com mais empatia e comunicação emocional para fortalecer a conexão com a equipa.'
        },
        'C': {
            name: 'Líder Colaborativo',
            title: 'O Construtor de Equipes',
            color: '#2ecc71',
            icon: 'fa-users',
            description: 'A tua liderança é baseada na empatia, na motivação das pessoas e na criação de um ambiente harmonioso. Acreditas que equipas fortes são a chave para o sucesso, e esforças-te para garantir que todos se sentem valorizados e envolvidos. És um grande ouvinte e tens facilidade em mediar conflitos, promovendo cooperação e crescimento coletivo.',
            strengths: [
                'Construção de relações fortes e confiáveis',
                'Capacidade de inspirar e motivar a equipa',
                'Ambiente de trabalho positivo e inclusivo'
            ],
            weaknesses: [
                'Podes evitar tomar decisões difíceis para não desagradar os outros',
                'Às vezes, colocas as necessidades da equipa à frente dos objetivos estratégicos',
                'A dificuldade em dizer "não" pode gerar sobrecarga de trabalho'
            ],
            growthTip: 'Garante que a tua preocupação com a equipa não te impede de tomar decisões firmes e estratégicas quando necessário.'
        },
        'D': {
            name: 'Líder Guardião',
            title: 'O Defensor dos Valores',
            color: '#9b59b6',
            icon: 'fa-compass',
            description: 'Para ti, a liderança é um compromisso com a ética, os princípios e a estabilidade da organização. Acreditas que um bom líder deve ser íntegro e tomar decisões alinhadas com os valores da empresa. És um mentor para a equipa, garantindo que todos seguem um propósito maior. Quando há desafios, recorres sempre aos teus princípios para guiar as tuas escolhas.',
            strengths: [
                'Consistência e confiabilidade',
                'Capacidade de tomar decisões baseadas em princípios sólidos',
                'Foco no propósito e na missão da organização'
            ],
            weaknesses: [
                'Podes ser resistente a mudanças rápidas',
                'A tua abordagem pode ser vista como rígida ou inflexível',
                'O excesso de foco nos valores pode, por vezes, impedir decisões pragmáticas'
            ],
            growthTip: 'Mantém a tua integridade, mas procura um equilíbrio entre valores e flexibilidade para se adaptar a novas realidades.'
        }
    };
    
    // Inicialização
    function init() {
        // Configurar contadores
        totalQuestionsSpan.textContent = totalQuestions;
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        
        // Mostrar primeira pergunta
        updateQuestionVisibility();
        
        // Adicionar event listeners
        prevBtn.addEventListener('click', goToPreviousQuestion);
        nextBtn.addEventListener('click', goToNextQuestion);
        
        // Adicionar event listeners para as opções
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                selectOption(this);
            });
        });
        
        // Adicionar event listener para o formulário de coaching
        document.getElementById('coaching-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitCoachingForm();
        });
        
        // Adicionar event listeners para compartilhamento
        setupSharingLinks();
    }
    
    // Atualizar visibilidade das perguntas
    function updateQuestionVisibility() {
        // Esconder todas as perguntas
        questionContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        // Mostrar pergunta atual
        if (currentQuestionIndex < totalQuestions) {
            questionContainers[currentQuestionIndex].classList.add('active');
            
            // Atualizar barra de progresso
            const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            
            // Atualizar contador de perguntas
            currentQuestionSpan.textContent = currentQuestionIndex + 1;
            
            // Atualizar estado dos botões
            prevBtn.disabled = currentQuestionIndex === 0;
            
            // Verificar se a pergunta atual já foi respondida
            const currentQuestionId = questionContainers[currentQuestionIndex].dataset.question;
            if (userAnswers[currentQuestionId]) {
                // Marcar a opção selecionada anteriormente
                const selectedOption = questionContainers[currentQuestionIndex].querySelector(`.option[data-type="${userAnswers[currentQuestionId]}"]`);
                if (selectedOption) {
                    selectOption(selectedOption, false);
                }
            } else {
                // Limpar seleções anteriores
                questionContainers[currentQuestionIndex].querySelectorAll('.option').forEach(option => {
                    option.classList.remove('selected');
                });
            }
            
            // Verificar se é a última pergunta
            if (currentQuestionIndex === totalQuestions - 1) {
                nextBtn.textContent = 'Ver Resultados';
            } else {
                nextBtn.textContent = 'Próxima';
            }
        } else {
            // Mostrar resultados
            showResults();
        }
    }
    
    // Selecionar uma opção
    function selectOption(optionElement, enableNext = true) {
        // Remover seleção anterior
        const questionContainer = optionElement.closest('.question-container');
        questionContainer.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Adicionar seleção à opção clicada
        optionElement.classList.add('selected');
        
        // Guardar resposta
        const questionId = questionContainer.dataset.question;
        const answerType = optionElement.dataset.type;
        userAnswers[questionId] = answerType;
        
        // Habilitar botão de próxima pergunta
        if (enableNext) {
            nextBtn.disabled = false;
        }
    }
    
    // Ir para a pergunta anterior
    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionVisibility();
        }
    }
    
    // Ir para a próxima pergunta
    function goToNextQuestion() {
        const currentQuestionId = questionContainers[currentQuestionIndex].dataset.question;
        
        // Verificar se a pergunta atual foi respondida
        if (!userAnswers[currentQuestionId]) {
            alert('Por favor, seleciona uma opção antes de avançar.');
            return;
        }
        
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            updateQuestionVisibility();
        } else {
            // Mostrar resultados
            currentQuestionIndex = totalQuestions;
            updateQuestionVisibility();
        }
    }
    
    // Calcular resultados
    function calculateResults() {
        const counts = {
            'A': 0,
            'B': 0,
            'C': 0,
            'D': 0
        };
        
        // Contar respostas por tipo
        Object.values(userAnswers).forEach(answerType => {
            counts[answerType]++;
        });
        
        // Encontrar o tipo dominante
        let dominantType = 'A';
        let maxCount = counts['A'];
        
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }
        
        // Verificar se há empate
        const tiedTypes = [];
        for (const type in counts) {
            if (counts[type] === maxCount && type !== dominantType) {
                tiedTypes.push(type);
            }
        }
        
        // Em caso de empate, usar as últimas perguntas como desempate
        if (tiedTypes.length > 0) {
            tiedTypes.push(dominantType);
            
            // Verificar as últimas 5 perguntas
            for (let i = totalQuestions; i > totalQuestions - 5; i--) {
                const questionId = i.toString();
                if (userAnswers[questionId] && tiedTypes.includes(userAnswers[questionId])) {
                    dominantType = userAnswers[questionId];
                    break;
                }
            }
        }
        
        return {
            dominantType,
            counts
        };
    }
    
    // Mostrar resultados
    function showResults() {
        // Esconder perguntas e botões de navegação
        document.querySelectorAll('.question-container').forEach(container => {
            container.style.display = 'none';
        });
        document.querySelector('.navigation-buttons').style.display = 'none';
        
        // Calcular resultados
        const results = calculateResults();
        const dominantArchetype = archetypes[results.dominantType];
        
        // Atualizar elementos de resultado
        document.getElementById('results-icon').innerHTML = `<i class="fas ${dominantArchetype.icon}"></i>`;
        document.getElementById('results-icon').style.backgroundColor = dominantArchetype.color;
        document.getElementById('archetype-title').textContent = `${dominantArchetype.name} - ${dominantArchetype.title}`;
        document.getElementById('archetype-description').textContent = dominantArchetype.description;
        
        // Preencher pontos fortes
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = '';
        dominantArchetype.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            strengthsList.appendChild(li);
        });
        
        // Preencher áreas de melhoria
        const weaknessesList = document.getElementById('weaknesses-list');
        weaknessesList.innerHTML = '';
        dominantArchetype.weaknesses.forEach(weakness => {
            const li = document.createElement('li');
            li.textContent = weakness;
            weaknessesList.appendChild(li);
        });
        
        // Preencher dica de crescimento
        document.getElementById('growth-tip').textContent = dominantArchetype.growthTip;
        
        // Criar gráfico de resultados
        createResultsChart(results.counts);
        
        // Mostrar container de resultados
        resultsContainer.style.display = 'block';
    }
    
    // Criar gráfico de resultados
    function createResultsChart(counts) {
        const ctx = document.getElementById('results-chart').getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (window.resultsChart) {
            window.resultsChart.destroy();
        }
        
        window.resultsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Visionário',
                    'Estratega',
                    'Colaborativo',
                    'Guardião'
                ],
                datasets: [{
                    label: 'Teu Perfil de Liderança',
                    data: [
                        counts['A'],
                        counts['B'],
                        counts['C'],
                        counts['D']
                    ],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: [
                        '#e74c3c',
                        '#3498db',
                        '#2ecc71',
                        '#9b59b6'
                    ],
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }
            }
        });
    }
    
    // Enviar formulário de coaching
    function submitCoachingForm() {
        const form = document.getElementById('coaching-form');
        const formData = new FormData(form);
        
        // Aqui você pode implementar o envio do formulário para um servidor
        // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
        
        alert('Obrigado! A tua sessão de coaching foi agendada com sucesso. Entraremos em contacto em breve para confirmar os detalhes.');
        form.reset();
    }
    
    // Configurar links de compartilhamento
    function setupSharingLinks() {
        const shareTitle = 'Descobri o meu arquétipo de liderança no Share2inspire.pt!';
        const shareUrl = window.location.href;
        
        document.getElementById('share-linkedin').addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`, '_blank');
        });
        
        document.getElementById('share-twitter').addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        });
        
        document.getElementById('share-facebook').addEventListener('click', function(e) {
            e.preventDefault();
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        });
        
        document.getElementById('share-email').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent('Olá! Acabei de descobrir o meu arquétipo de liderança no Share2inspire.pt. Descobre o teu também: ' + shareUrl)}`;
        });
    }
    
    // Iniciar o questionário
    init();
});
