document.addEventListener("DOMContentLoaded", function () {
    const questionContainers = document.querySelectorAll(".question-container");
    const resultsContainer = document.querySelector(".results-container");
    const surveyContent = document.getElementById("survey-content"); // Container for questions
    const progressFill = document.querySelector(".progress-fill");
    const currentQuestionSpan = document.getElementById("current-question");
    const totalQuestionsSpan = document.getElementById("total-questions");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-survey");
    const navigationContainer = document.querySelector(".survey-navigation");

    let currentQuestionIndex = 0;
    const totalQuestions = questionContainers.length; // Should be 20 now
    const userAnswers = {}; // Store answers as { questionIndex: answerType }

    // Archetype definitions with descriptions
    const archetypes = {
        A: { 
            name: "Líder Visionário", 
            description: "És um líder que inspira através de uma visão clara e motivadora. Tens facilidade em ver o quadro geral e em comunicar um futuro empolgante. A tua energia e carisma motivam os outros a seguir-te, mesmo em tempos de incerteza."
        },
        B: { 
            name: "Líder Analítico", 
            description: "És um líder que toma decisões baseadas em dados e análises cuidadosas. Valorizas a precisão, a eficiência e a resolução metódica de problemas. A tua abordagem estruturada traz clareza e direção em situações complexas."
        },
        C: { 
            name: "Líder Colaborativo", 
            description: "És um líder que valoriza as relações e o trabalho em equipa. Tens uma capacidade natural para ouvir, criar consenso e desenvolver o potencial dos outros. A tua liderança cria ambientes inclusivos onde todos se sentem valorizados."
        },
        D: { 
            name: "Líder Guardião", // Changed from Transformational for consistency with original options
            description: "És um líder guiado por valores e princípios fortes. Procuras criar impacto significativo e duradouro, alinhando ações com um propósito maior. A tua integridade e visão ética inspiram confiança e compromisso."
        },
    };

    function init() {
        if (totalQuestions === 0) {
            console.error("No question containers found!");
            return;
        }
        totalQuestionsSpan.textContent = totalQuestions;
        updateQuestionVisibility();
        setupOptionListeners();
        prevBtn.addEventListener("click", goToPreviousQuestion);
        nextBtn.addEventListener("click", goToNextQuestion);
        restartBtn.addEventListener("click", restartSurvey);
    }

    function setupOptionListeners() {
        document.querySelectorAll(".option").forEach((option) => {
            option.addEventListener("click", function () {
                selectOption(this);
                // Optional: Auto-advance after selection
                // setTimeout(goToNextQuestion, 300);
            });
        });
    }

    function updateQuestionVisibility() {
        questionContainers.forEach((container, index) => {
            container.classList.toggle("active", index === currentQuestionIndex);
        });

        if (currentQuestionIndex < totalQuestions) {
            surveyContent.style.display = "block";
            resultsContainer.style.display = "none";
            navigationContainer.style.display = "flex";

            const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            currentQuestionSpan.textContent = currentQuestionIndex + 1;

            prevBtn.disabled = currentQuestionIndex === 0;
            // Disable next button until an option is selected for the current question
            nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;

            // Update button text on the last question
            nextBtn.textContent = currentQuestionIndex === totalQuestions - 1 ? "Ver Resultados" : "Próxima";

            // Restore selected state if navigating back/forward
            if (userAnswers[currentQuestionIndex]) {
                 const selectedOption = questionContainers[currentQuestionIndex].querySelector(`.option[data-type="${userAnswers[currentQuestionIndex]}"]`);
                 if (selectedOption) {
                     // Ensure only the correct option is marked as selected
                     questionContainers[currentQuestionIndex].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
                     selectedOption.classList.add("selected");
                 }
            } else {
                 // Ensure no option is marked selected if no answer stored
                 questionContainers[currentQuestionIndex].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
            }

        } else {
            // This case should ideally not be reached here, showResults handles the transition
            console.log("Reached end index, showing results...");
            showResults();
        }
    }

    function selectOption(optionElement) {
        const questionContainer = optionElement.closest(".question-container");
        if (!questionContainer) return;
        const answerType = optionElement.dataset.type;

        // Remove selected class from siblings
        questionContainer.querySelectorAll(".option").forEach((opt) => {
            opt.classList.remove("selected");
        });

        // Add selected class to the clicked option
        optionElement.classList.add("selected");

        // Store the answer using the current index
        userAnswers[currentQuestionIndex] = answerType;
        console.log(`Answered Q${currentQuestionIndex + 1}: ${answerType}`); // Debug log

        // Enable the next button
        nextBtn.disabled = false;
    }

    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionVisibility();
        }
    }

    function goToNextQuestion() {
        // Check if an answer was selected for the current question
        if (userAnswers[currentQuestionIndex] === undefined) {
            // Button should be disabled, but double-check
            alert("Por favor, selecione uma opção.");
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            updateQuestionVisibility();
        } else {
            // Reached the end (after answering the last question), show results
            console.log("Last question answered, calculating results...");
            showResults();
        }
    }

    function calculateResults() {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        // Count answers based on the stored userAnswers object
        for (let i = 0; i < totalQuestions; i++) {
            if (userAnswers[i]) {
                counts[userAnswers[i]]++;
            }
        }
        console.log("Answer counts:", counts); // Debug log

        let dominantType = "A"; // Default
        let maxCount = 0;
        // Find the archetype with the highest count
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }
        
        // Simple tie-breaking: if counts are equal, the first one encountered wins (A > B > C > D)
        // More sophisticated tie-breaking could be added if needed.
        
        console.log("Dominant type:", dominantType); // Debug log
        return archetypes[dominantType] || { name: "Erro", description: "Não foi possível calcular o resultado." }; // Return archetype object or error
    }

    function showResults() {
        surveyContent.style.display = "none";
        navigationContainer.style.display = "none";
        resultsContainer.style.display = "block"; // Show the results container

        const result = calculateResults();
        const resultTitleElement = document.getElementById("result-title");
        const resultDescriptionElement = document.getElementById("result-description");

        if (resultTitleElement && resultDescriptionElement) {
             resultTitleElement.textContent = result.name;
             resultDescriptionElement.textContent = result.description;
        } else {
             console.error("Result title or description element not found!");
        }
        
        // Chart generation logic could be re-added here if needed
        // createResultsChart(counts); // Pass counts if chart is needed
    }

    function restartSurvey() {
        currentQuestionIndex = 0;
        // Clear stored answers
        for (let i = 0; i < totalQuestions; i++) {
             delete userAnswers[i]; 
        }
        // Reset visual selections (optional, updateQuestionVisibility handles it)
        // questionContainers.forEach(container => {
        //     container.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
        // });
        console.log("Survey restarted, answers cleared."); // Debug log
        updateQuestionVisibility(); // This will show the first question and hide results
    }

    // Initialize the survey
    init();
});

