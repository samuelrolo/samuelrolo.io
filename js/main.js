document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll("header nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let headerOffset = 70;
                const header = document.querySelector("header");
                if (header) {
                    headerOffset = header.offsetHeight;
                }
                window.scrollTo({
                    top: targetElement.offsetTop - headerOffset,
                    behavior: "smooth"
                });
            }
        });
    });

    // Service Cards Interaction
    const servicoCards = document.querySelectorAll(".servico-card");
    const serviceRequestModal = document.getElementById("service-request-modal");
    const serviceRequestForm = document.getElementById("service-request-form");
    const serviceTypeSelect = document.getElementById("service-type");
    const closeModalButton = serviceRequestModal.querySelector(".close-button");
    const serviceRequestMessage = document.getElementById("service-request-message");

    servicoCards.forEach(card => {
        card.addEventListener("click", function() {
            const action = this.dataset.action;
            const url = this.dataset.url;
            const serviceName = this.dataset.service;

            if (action === "redirect" && url) {
                window.open(url, "_blank");
            } else if (serviceName) {
                // Pre-select service type
                if (serviceTypeSelect) {
                    serviceTypeSelect.value = serviceName;
                }
                // Clear previous messages and reset form
                if (serviceRequestMessage) {
                    serviceRequestMessage.textContent = "";
                    serviceRequestMessage.style.display = "none";
                }
                if (serviceRequestForm) {
                    serviceRequestForm.reset(); 
                }
                // Open modal
                if (serviceRequestModal) {
                    serviceRequestModal.style.display = "block";
                }
            }
        });
    });

    // Close Modal
    if (closeModalButton) {
        closeModalButton.addEventListener("click", function() {
            if (serviceRequestModal) {
                serviceRequestModal.style.display = "none";
            }
        });
    }

    // Close modal if clicked outside of it
    window.addEventListener("click", function(event) {
        if (event.target == serviceRequestModal) {
            serviceRequestModal.style.display = "none";
        }
    });

    // Service Request Form Handling
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nameInput = this.querySelector("input[name=\'name\']");
            const emailInput = this.querySelector("input[name=\'email\']");
            const detailsInput = this.querySelector("textarea[name=\'details\']");
            
            // Clear previous messages
            if (serviceRequestMessage) {
                serviceRequestMessage.textContent = "";
                serviceRequestMessage.style.display = "none";
            }

            // Basic validation
            if (nameInput.value.trim() === "" || emailInput.value.trim() === "" || detailsInput.value.trim() === "") {
                serviceRequestMessage.textContent = "Por favor, preencha todos os campos obrigatórios.";
                serviceRequestMessage.style.color = "red";
                serviceRequestMessage.style.display = "block";
                return;
            }

            // Placeholder for actual submission (e.g., to Brevo API)
            console.log("Service Request Submitted:", {
                name: nameInput.value,
                email: emailInput.value,
                phone: this.querySelector("input[name=\'phone\']").value,
                service_type: this.querySelector("select[name=\'service_type\']").value,
                details: detailsInput.value
            });

            serviceRequestMessage.textContent = "O seu pedido foi enviado com sucesso! Entraremos em contacto em breve.";
            serviceRequestMessage.style.color = "green";
            serviceRequestMessage.style.display = "block";
            // Do not reset the form immediately, let user see the message
            // setTimeout(() => { 
            //     this.reset(); 
            //     if (serviceRequestModal) serviceRequestModal.style.display = "none"; 
            // }, 3000); // Optionally close modal and reset after a delay
        });
    }

    // Feedback form handling
    const feedbackForm = document.getElementById("feedback-form");
    const feedbackMessage = document.getElementById("feedback-message");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            
            const ratingInput = this.querySelector("input[name=\'rating\']:checked");
            const feedbackTextInput = this.querySelector("#feedback-text");

            // Clear previous messages
            if (feedbackMessage) {
                feedbackMessage.textContent = "";
                feedbackMessage.style.display = "none";
            }

            if (!ratingInput) {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, selecione uma avaliação (1-5 estrelas).";
                    feedbackMessage.style.color = "red";
                    feedbackMessage.style.display = "block";
                }
                return;
            }

            if (feedbackTextInput.value.trim() === "") {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, escreva o seu feedback.";
                    feedbackMessage.style.color = "red";
                    feedbackMessage.style.display = "block";
                }
                return;
            }
            
            const ratingValue = ratingInput.value;
            const feedbackTextValue = feedbackTextInput.value;

            // Placeholder for actual submission logic (e.g., to Brevo API)
            console.log("Feedback Rating:", ratingValue);
            console.log("Feedback Text:", feedbackTextValue);
            
            if (feedbackMessage) {
                feedbackMessage.textContent = "Obrigado pelo seu feedback!";
                feedbackMessage.style.color = "green";
                feedbackMessage.style.display = "block";
            }
            this.reset(); // Reset form after successful (simulated) submission
        });
    }

    // Survey Widget Modal Logic (Loja Page)
    const openSurveyButton = document.getElementById("open-survey-widget");
    const surveyWidgetContainer = document.getElementById("survey-widget-container");
    const closeSurveyButton = surveyWidgetContainer ? surveyWidgetContainer.querySelector(".close-survey-widget") : null;

    if (openSurveyButton && surveyWidgetContainer) {
        openSurveyButton.addEventListener("click", function() {
            surveyWidgetContainer.style.display = "block";
        });
    }

    if (closeSurveyButton && surveyWidgetContainer) {
        closeSurveyButton.addEventListener("click", function() {
            surveyWidgetContainer.style.display = "none";
        });
    }

    // Close survey widget if clicked outside of its content
    if (surveyWidgetContainer) {
        surveyWidgetContainer.addEventListener("click", function(event) {
            if (event.target === surveyWidgetContainer) { // Clicked on the overlay
                surveyWidgetContainer.style.display = "none";
            }
        });
    }

    // Recommendations Carousel Logic
    const carousel = document.querySelector(".carousel-container");
    if (carousel) {
        const slidesContainer = carousel.querySelector(".carousel-slides");
        const slides = Array.from(slidesContainer.children);
        const nextButton = carousel.querySelector(".carousel-button.next");
        const prevButton = carousel.querySelector(".carousel-button.prev");
        let currentIndex = 0;
        const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width : 0; // Assuming all slides have the same width

        // Arrange slides next to each other
        // slidesContainer.style.width = `${slideWidth * slides.length}px`; // Set total width for flex items

        const moveToSlide = (targetIndex) => {
            if (!slidesContainer) return;
            slidesContainer.style.transform = `translateX(-${targetIndex * 100}%)`; // Use percentage for responsiveness
            currentIndex = targetIndex;
        };

        if (nextButton && prevButton) {
            nextButton.addEventListener("click", () => {
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) {
                    newIndex = 0; // Loop to the first slide
                }
                moveToSlide(newIndex);
            });

            prevButton.addEventListener("click", () => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) {
                    newIndex = slides.length - 1; // Loop to the last slide
                }
                moveToSlide(newIndex);
            });
        }
        
        // Initialize carousel position
        if(slides.length > 0) {
             moveToSlide(0);
        }
    }
});

