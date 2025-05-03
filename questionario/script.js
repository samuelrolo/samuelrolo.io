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
    const emailForm = document.getElementById("email-form");
    const userEmailInput = document.getElementById("user-email");
    const formMessage = document.getElementById("form-message");

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
        console.log("Initializing survey...");
        if (totalQuestions === 0) {
            console.error("No question containers found!");
            return;
        }
        console.log(`Found ${totalQuestions} questions.`);
        totalQuestionsSpan.textContent = totalQuestions;
        updateQuestionVisibility();
        setupOptionListeners();
        prevBtn.addEventListener("click", goToPreviousQuestion);
        nextBtn.addEventListener("click", goToNextQuestion);
        if (restartBtn) {
            restartBtn.addEventListener("click", restartSurvey);
        } else {
            console.warn("Restart button not found in the DOM.");
        }
        // Add email form listener
        if (emailForm) {
            emailForm.addEventListener("submit", handleEmailSubmit);
        } else {
             console.warn("Email form not found in the DOM.");
        }
        console.log("Survey initialized.");
    }

    function setupOptionListeners() {
        document.querySelectorAll(".option").forEach((option) => {
            option.addEventListener("click", function () {
                selectOption(this);
            });
        });
    }

    function updateQuestionVisibility() {
        console.log(`Updating visibility for question index: ${currentQuestionIndex}`);
        questionContainers.forEach((container, index) => {
            container.classList.toggle("active", index === currentQuestionIndex);
        });

        if (currentQuestionIndex < totalQuestions) {
            console.log("Displaying question content.");
            surveyContent.style.display = "block";
            resultsContainer.style.display = "none";
            navigationContainer.style.display = "flex";

            const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            currentQuestionSpan.textContent = currentQuestionIndex + 1;

            prevBtn.disabled = currentQuestionIndex === 0;
            nextBtn.disabled = userAnswers[currentQuestionIndex] === undefined;
            nextBtn.textContent = currentQuestionIndex === totalQuestions - 1 ? "Ver Resultados" : "Próxima";

            if (userAnswers[currentQuestionIndex]) {
                 const selectedOption = questionContainers[currentQuestionIndex].querySelector(`.option[data-type="${userAnswers[currentQuestionIndex]}"]`);
                 if (selectedOption) {
                     questionContainers[currentQuestionIndex].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
                     selectedOption.classList.add("selected");
                 }
            } else {
                 questionContainers[currentQuestionIndex].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
            }

        } else {
            console.log("Reached end index in updateQuestionVisibility, calling showResults...");
            showResults();
        }
    }

    function selectOption(optionElement) {
        const questionContainer = optionElement.closest(".question-container");
        if (!questionContainer) return;
        const answerType = optionElement.dataset.type;

        questionContainer.querySelectorAll(".option").forEach((opt) => {
            opt.classList.remove("selected");
        });
        optionElement.classList.add("selected");

        userAnswers[currentQuestionIndex] = answerType;
        console.log(`Answered Q${currentQuestionIndex + 1}: ${answerType}`);
        nextBtn.disabled = false;
    }

    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionVisibility();
        }
    }

    function goToNextQuestion() {
        console.log(`goToNextQuestion called. Current index: ${currentQuestionIndex}`);
        if (userAnswers[currentQuestionIndex] === undefined) {
            alert("Por favor, selecione uma opção.");
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            console.log(`Moving to next question index: ${currentQuestionIndex}`);
            updateQuestionVisibility();
        } else {
            console.log("Last question answered, calling showResults...");
            showResults();
        }
    }

    function calculateResults() {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        for (let i = 0; i < totalQuestions; i++) {
            if (userAnswers[i]) {
                counts[userAnswers[i]]++;
            }
        }
        console.log("Answer counts:", counts);

        let dominantType = "A";
        let maxCount = -1;
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }
        
        console.log("Dominant type calculated:", dominantType);
        return archetypes[dominantType] || { name: "Erro", description: "Não foi possível calcular o resultado." };
    }

    function showResults() {
        console.log("Executing showResults function...");
        if (!surveyContent || !navigationContainer || !resultsContainer) {
             console.error("Core containers (surveyContent, navigationContainer, resultsContainer) not found!");
             return;
        }
        surveyContent.style.display = "none";
        navigationContainer.style.display = "none";
        resultsContainer.style.display = "block";
        console.log(`Results container display set to: ${resultsContainer.style.display}`);

        const result = calculateResults();
        const resultTitleElement = document.getElementById("result-title");
        const resultDescriptionElement = document.getElementById("result-description");

        if (resultTitleElement && resultDescriptionElement) {
             console.log(`Setting result title to: ${result.name}`);
             resultTitleElement.textContent = result.name;
             console.log(`Setting result description to: ${result.description}`);
             resultDescriptionElement.textContent = result.description;
        } else {
             console.error("Result title or description element not found in the DOM!");
        }
        console.log("showResults function finished.");
    }

    function restartSurvey() {
        console.log("Restarting survey...");
        currentQuestionIndex = 0;
        for (let i = 0; i < totalQuestions; i++) {
             delete userAnswers[i]; 
        }
        console.log("Answers cleared.");
        updateQuestionVisibility();
    }

    async function handleEmailSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const userEmail = userEmailInput.value;
        const result = calculateResults(); // Get the calculated archetype
        
        if (!userEmail) {
            alert("Por favor, introduza o seu endereço de e-mail.");
            return;
        }

        if (formMessage) {
            formMessage.textContent = "A enviar...";
            formMessage.style.color = "var(--secondary-color)"; // Use a neutral color
            formMessage.style.display = "block";
        }

        const data = {
            email: userEmail,
            archetype: result.name || "N/A",
            source: "questionnaire_result" // Identify the source
        };

        try {
            // Use a relative path, assuming deployment on Netlify/Vercel
            // Adjust path if needed based on deployment setup
            const response = await fetch("/.netlify/functions/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                if (formMessage) {
                    formMessage.textContent = "Pedido enviado com sucesso! Entraremos em contacto em breve.";
                    formMessage.style.color = "#4CAF50"; // Green for success
                }
                userEmailInput.value = ""; // Clear the input
            } else {
                const errorResult = await response.json();
                if (formMessage) {
                    formMessage.textContent = `Erro ao enviar: ${errorResult.message || "Tente novamente."}`;
                    formMessage.style.color = "#F44336"; // Red for error
                }
            }
        } catch (error) {
            console.error("Error submitting questionnaire email form:", error);
            if (formMessage) {
                formMessage.textContent = "Erro ao enviar o pedido. Verifique a sua ligação ou tente mais tarde.";
                formMessage.style.color = "#F44336"; // Red for error
            }
        }
    }

    // Initialize the survey
    init();
});

