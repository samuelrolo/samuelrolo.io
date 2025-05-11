document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const questionContainers = document.querySelectorAll('.question-container');
    const resultsContainer = document.getElementById('results-container');
    const surveyContentContainer = document.getElementById('survey-content-container');
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
            description: 'A tua liderança é baseada na empatia, na motivação das pessoas e na criação de um ambiente harmonioso. Acreditas que equipas fortes constroem resultados fortes e investes tempo a desenvolver o potencial de cada membro. Para ti, o sucesso é um esforço de grupo.',
            strengths: [
                'Excelentes capacidades de comunicação e escuta ativa',
                'Foco no desenvolvimento de talentos e bem-estar da equipa',
                'Criação de um ambiente de trabalho positivo e inclusivo'
            ],
            weaknesses: [
                'Podes ter dificuldade em tomar decisões difíceis que afetem negativamente a equipa',
                'Às vezes, evitas conflitos para manter a harmonia, mesmo quando o debate é necessário',
                'Podes dar demasiada importância ao consenso, atrasando a ação'
            ],
            growthTip: 'Equilibra o teu foco no bem-estar da equipa com a necessidade de tomar decisões firmes e orientadas para resultados, mesmo que sejam impopulares.'
        },
        'D': {
            name: 'Líder Guardião',
            title: 'O Pilar da Estabilidade',
            color: '#f39c12',
            icon: 'fa-shield-alt',
            description: 'És um líder que valoriza a estabilidade, a consistência e o cumprimento de promessas. A tua abordagem é focada em manter padrões elevados, garantir a qualidade e proteger os valores da organização. És visto como alguém de confiança, que oferece segurança e direção clara, especialmente em tempos de incerteza.',
            strengths: [
                'Elevado sentido de responsabilidade e integridade',
                'Consistência e fiabilidade na tomada de decisões',
                'Capacidade de criar sistemas e processos robustos'
            ],
            weaknesses: [
                'Podes ser resistente à mudança e a novas ideias',
                'Às vezes, o foco excessivo em regras e processos pode limitar a criatividade',
                'Podes ter dificuldade em delegar, preferindo controlar todos os detalhes'
            ],
            growthTip: 'Abre-te mais à inovação e aprende a delegar com confiança, permitindo que a tua equipa cresça e explore novas abordagens, mantendo sempre os teus altos padrões de qualidade.'
        }
    };

    function init() {
        if (totalQuestions === 0 || !questionContainers || questionContainers.length === 0) {
            console.error("Question containers not found or empty.");
            if(totalQuestionsSpan) totalQuestionsSpan.textContent = '0';
            if(currentQuestionSpan) currentQuestionSpan.textContent = '0';
            return;
        }
        if(totalQuestionsSpan) totalQuestionsSpan.textContent = totalQuestions;
        updateQuestionView();
        attachEventListeners();
    }

    function attachEventListeners() {
        questionContainers.forEach((container, index) => {
            const options = container.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                option.addEventListener('change', () => {
                    userAnswers[index] = option.value;
                    updateButtonStates();
                });
            });
        });

        if(prevBtn) prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                updateQuestionView();
            }
        });

        if(nextBtn) nextBtn.addEventListener('click', () => {
            if (userAnswers[currentQuestionIndex] === undefined && currentQuestionIndex < totalQuestions -1) {
                 // Optionally, provide feedback to the user that an answer is required
                return;
            }
            if (currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
                updateQuestionView();
            } else {
                if (userAnswers[currentQuestionIndex] !== undefined) { // Ensure last question is answered
                    displayResults();
                }
            }
        });
    }

    function updateQuestionView() {
        questionContainers.forEach((container, index) => {
            container.style.display = index === currentQuestionIndex ? 'block' : 'none';
        });
        if(currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
        updateProgressBar();
        updateButtonStates();
    }

    function updateProgressBar() {
        if (!progressFill) return;
        const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
        progressFill.style.width = `${progress}%`;
    }

    function updateButtonStates() {
        if(prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if(nextBtn) {
            if (currentQuestionIndex === totalQuestions - 1) {
                nextBtn.textContent = 'Ver Resultado';
                nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
            } else {
                nextBtn.textContent = 'Próxima';
                nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
            }
        }
    }

    function calculateArchetype() {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        for (const key in userAnswers) {
            if (userAnswers.hasOwnProperty(key) && counts.hasOwnProperty(userAnswers[key])){
                 counts[userAnswers[key]]++;
            }
        }

        let maxCount = 0;
        let dominantArchetype = '';
        for (const type in counts) {
            if (counts.hasOwnProperty(type) && counts[type] > maxCount) {
                maxCount = counts[type];
                dominantArchetype = type;
            }
        }
        // Basic tie-breaking: if multiple archetypes have the same maxCount, the first one encountered (A, B, C, D order) will be chosen.
        // If no answers, or all counts are 0, it might return empty. Default to 'A' or handle as an error.
        return dominantArchetype || (Object.keys(userAnswers).length > 0 ? Object.keys(counts).find(key => counts[key] === maxCount) || 'A' : 'A');
    }

    function displayResults() {
        if (!resultsContainer || !surveyContentContainer) {
            console.error("Results container or survey content container not found.");
            return;
        }
        const archetypeKey = calculateArchetype();
        const result = archetypes[archetypeKey];

        if (!result) {
            resultsContainer.innerHTML = '<p>Não foi possível determinar o seu arquétipo. Por favor, tente novamente.</p>';
            surveyContentContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            return;
        }

        let answersHtml = '<ul style="text-align: left; list-style-position: inside;">';
        for (let i = 0; i < totalQuestions; i++) {
            const answerValue = userAnswers[i] || 'Não respondida';
            answersHtml += `<li>Questão ${i + 1}: Opção ${answerValue}</li>`;
        }
        answersHtml += '</ul>';

        const email = "srshare2inspire@gmail.com";
        const subject = "Pedido de Reunião - Análise Arquétipo de Liderança";
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

        resultsContainer.innerHTML = `
            <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: ${result.color};"><i class="fas ${result.icon}" style="margin-right: 10px;"></i>O Teu Arquétipo: ${result.name} (${result.title})</h2>
                <p>${result.description}</p>
                <h3>Pontos Fortes:</h3>
                <ul>${result.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
                <h3>Pontos a Desenvolver:</h3>
                <ul>${result.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
                <p><strong>Dica de Crescimento:</strong> ${result.growthTip}</p>
                <hr>
                <h3>Respostas Submetidas:</h3>
                ${answersHtml}
                <p style="margin-top: 20px; font-style: italic;">Este é um resultado preliminar.</p>
                <a href="${mailtoLink}" class="contact-button" target="_blank">Marcar Reunião de Análise</a>
            </div>
        `;
        surveyContentContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
    }

    init();
});

