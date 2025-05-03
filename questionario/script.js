document.addEventListener("DOMContentLoaded", function () {
    const questionContainers = document.querySelectorAll(".question-container");
    const resultsContainer = document.querySelector(".results-container");
    const surveyContent = document.getElementById("survey-content");
    const progressFill = document.querySelector(".progress-fill");
    const currentQuestionSpan = document.getElementById("current-question");
    const totalQuestionsSpan = document.getElementById("total-questions");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-survey");
    const navigationContainer = document.querySelector(".survey-navigation");

    let currentQuestionIndex = 0;
    const totalQuestions = questionContainers.length;
    const userAnswers = {}; // Store answers as { questionIndex: answerType }

    // Archetype definitions (simplified for brevity)
    const archetypes = {
        A: { name: "Líder Visionário", description: "Focado na inovação e futuro." },
        B: { name: "Líder Estratega", description: "Analítico e focado em eficiência." },
        C: { name: "Líder Colaborativo", description: "Focado nas pessoas e harmonia." },
        D: { name: "Líder Guardião", description: "Focado em valores e estabilidade." },
    };

    function init() {
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
                // Automatically move to next question after a short delay
                // setTimeout(goToNextQuestion, 300); // Optional: uncomment for auto-advance
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

            // Restore selected state if navigating back
            if (userAnswers[currentQuestionIndex]) {
                 const selectedOption = questionContainers[currentQuestionIndex].querySelector(`.option[data-type="${userAnswers[currentQuestionIndex]}"]`);
                 if (selectedOption) {
                     // Ensure only the correct option is marked as selected
                     questionContainers[currentQuestionIndex].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
                     selectedOption.classList.add("selected");
                 }
            }

        } else {
            // Show results
            showResults();
        }
    }

    function selectOption(optionElement) {
        const questionContainer = optionElement.closest(".question-container");
        const answerType = optionElement.dataset.type;

        // Remove selected class from siblings
        questionContainer.querySelectorAll(".option").forEach((opt) => {
            opt.classList.remove("selected");
        });

        // Add selected class to the clicked option
        optionElement.classList.add("selected");

        // Store the answer
        userAnswers[currentQuestionIndex] = answerType;

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
            // Optionally alert the user, though the button should be disabled
            // alert("Por favor, selecione uma opção.");
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            updateQuestionVisibility();
        } else {
            // Reached the end, show results
            currentQuestionIndex = totalQuestions; // Move index past the last question
            showResults();
        }
    }

    function calculateResults() {
        const counts = { A: 0, B: 0, C: 0, D: 0 };
        Object.values(userAnswers).forEach((answerType) => {
            counts[answerType]++;
        });

        let dominantType = "A";
        let maxCount = 0;
        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }
        // Basic tie-breaking: just picks the first one encountered in case of a tie
        return archetypes[dominantType];
    }

    function showResults() {
        surveyContent.style.display = "none";
        navigationContainer.style.display = "none";
        resultsContainer.style.display = "block";

        const result = calculateResults();
        document.getElementById("result-title").textContent = result.name;
        document.getElementById("result-description").textContent = result.description;
        // Chart generation logic could be added here if needed
    }

    function restartSurvey() {
        currentQuestionIndex = 0;
        for (let i = 0; i < totalQuestions; i++) {
             delete userAnswers[i]; // Clear answers
             // Clear visual selection
             questionContainers[i].querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
        }
        updateQuestionVisibility();
    }

    // Initialize the survey
    init();
});

