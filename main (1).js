document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector("header");
    const mainElement = document.querySelector("main");
    const navLinks = document.querySelectorAll("nav.top-nav ul li a");
    const sections = document.querySelectorAll("main section.page-section");

    function adjustMainPadding() {
        if (header && mainElement) {
            mainElement.style.paddingTop = header.offsetHeight + "px";
        }
    }

    adjustMainPadding();
    window.addEventListener("resize", adjustMainPadding);

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - header.offsetHeight,
                    behavior: "smooth"
                });
            }
        });
    });

    function highlightActiveLink() {
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSectionId) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", highlightActiveLink);
    highlightActiveLink();

    const servicoCards = document.querySelectorAll(".servico-card");
    const serviceRequestModal = document.getElementById("service-request-modal");
    const serviceRequestForm = document.getElementById("service-request-form");
    const serviceTypeSelect = document.getElementById("service-type");
    const closeModalButton = serviceRequestModal ? serviceRequestModal.querySelector(".close-button") : null;
    const serviceRequestMessage = document.getElementById("service-request-message");

    servicoCards.forEach(card => {
        card.addEventListener("click", function() {
            const action = this.dataset.action;
            const url = this.dataset.url;
            const serviceName = this.dataset.service;

            if (action === "redirect" && url) {
                window.open(url, "_blank");
            } else if (serviceName && serviceRequestModal) {
                if (serviceTypeSelect) {
                    serviceTypeSelect.value = serviceName;
                }
                if (serviceRequestMessage) {
                    serviceRequestMessage.innerHTML = ""; // Clear previous messages
                    serviceRequestMessage.style.display = "none";
                }
                if (serviceRequestForm) {
                    serviceRequestForm.reset();
                }
                serviceRequestModal.style.display = "block";
            }
        });
    });

    if (closeModalButton) {
        closeModalButton.addEventListener("click", function() {
            if (serviceRequestModal) {
                serviceRequestModal.style.display = "none";
            }
        });
    }

    window.addEventListener("click", function(event) {
        if (serviceRequestModal && event.target == serviceRequestModal) {
            serviceRequestModal.style.display = "none";
        }
    });

    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nameInput = this.querySelector("input[name='name']");
            const emailInput = this.querySelector("input[name='email']");
            const detailsInput = this.querySelector("textarea[name='details']");
            const proposalInput = this.querySelector("textarea[name='proposal']"); // Get proposal field
            
            if (serviceRequestMessage) {
                serviceRequestMessage.innerHTML = ""; // Clear previous messages
                serviceRequestMessage.style.display = "none";
            }

            // Basic validation (can be expanded)
            if (!nameInput || !emailInput || !detailsInput || 
                nameInput.value.trim() === "" || 
                emailInput.value.trim() === "" || 
                detailsInput.value.trim() === "") {
                if(serviceRequestMessage){
                    serviceRequestMessage.innerHTML = "Por favor, preencha todos os campos obrigatórios (Nome, Email, Breve Enquadramento).";
                    serviceRequestMessage.className = "message error"; // Use classes for styling
                    serviceRequestMessage.style.display = "block";
                }
                return;
            }

            // Simulate API call (replace with actual Brevo API call)
            console.log("Simulating Brevo API call with data:", {
                name: nameInput.value,
                email: emailInput.value,
                phone: this.querySelector("input[name='phone']") ? this.querySelector("input[name='phone']").value : '',
                service_type: serviceTypeSelect ? serviceTypeSelect.value : '',
                details: detailsInput.value,
                proposal: proposalInput ? proposalInput.value : '' // Include proposal data
            });

            // Simulate a random success/error for demonstration
            const isSuccess = Math.random() > 0.2; // 80% chance of success for demo

            if(serviceRequestMessage){
                if (isSuccess) {
                    serviceRequestMessage.innerHTML = "O e-mail foi enviado, agradecemos a tua confiança! Verifica o teu e-mail para validar a informação partilhada.<br><br>A nossa equipa entrará em contacto contigo nas próximas 48h úteis.";
                    serviceRequestMessage.className = "message success";
                    this.reset(); // Reset form on success
                } else {
                    serviceRequestMessage.innerHTML = "Erro ao processar o e-mail. Verifica se os dados estão corretos. Caso o erro se mantenha entra em contacto direto connosco (Consulta os nossos <a href='#contactos'>contactos</a>).";
                    serviceRequestMessage.className = "message error";
                }
                serviceRequestMessage.style.display = "block";
            }
        });
    }

    const openSurveyButton = document.getElementById("open-survey-widget");
    const surveyWidgetContainer = document.getElementById("survey-widget-container");
    const closeSurveyButton = surveyWidgetContainer ? surveyWidgetContainer.querySelector(".close-survey-widget") : null;

    if (openSurveyButton && surveyWidgetContainer) {
        openSurveyButton.addEventListener("click", function() {
            surveyWidgetContainer.style.display = "flex";
        });
    }

    if (closeSurveyButton && surveyWidgetContainer) {
        closeSurveyButton.addEventListener("click", function() {
            surveyWidgetContainer.style.display = "none";
        });
    }

    if (surveyWidgetContainer) {
        surveyWidgetContainer.addEventListener("click", function(event) {
            if (event.target === surveyWidgetContainer) {
                surveyWidgetContainer.style.display = "none";
            }
        });
    }
});




    // Lógica para o Carrossel de Recomendações
    const carouselSlides = document.querySelector(".carousel-slides");
    const carouselSlideItems = document.querySelectorAll(".carousel-slide");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");
    let currentIndex = 0;

    function updateCarousel() {
        if (carouselSlides && carouselSlideItems.length > 0) {
            const slideWidth = carouselSlideItems[0].offsetWidth;
            carouselSlides.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        }
    }

    if (nextButton && carouselSlideItems.length > 0) {
        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % carouselSlideItems.length;
            updateCarousel();
        });
    }

    if (prevButton && carouselSlideItems.length > 0) {
        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + carouselSlideItems.length) % carouselSlideItems.length;
            updateCarousel();
        });
    }
    
    // Ajustar o carrossel no redimensionamento da janela para recalcular a largura do slide
    window.addEventListener("resize", () => {
        if (carouselSlideItems.length > 0) {
            updateCarousel(); // Recalcula a posição baseada na nova largura
        }
    });

    // Inicializar o carrossel
    if (carouselSlideItems.length > 0) {
        updateCarousel();
    }




    // Lógica para o Formulário de Feedback com Estrelas
    const feedbackForm = document.getElementById("feedback-form");
    const feedbackMessage = document.getElementById("feedback-message");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const rating = this.querySelector('input[name="rating"]:checked');
            const feedbackText = this.querySelector('#feedback-text').value;

            if (feedbackMessage) {
                feedbackMessage.style.display = "none";
                feedbackMessage.textContent = "";
            }

            if (!rating) {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, selecione uma avaliação (1 a 5 estrelas).";
                    feedbackMessage.className = "error"; // Assume que tem estilos para .error
                    feedbackMessage.style.display = "block";
                }
                return;
            }

            // Simular envio de feedback
            console.log("Feedback Submetido:", { 
                rating: rating.value, 
                text: feedbackText 
            });

            if (feedbackMessage) {
                feedbackMessage.textContent = "Obrigado pelo seu feedback!";
                feedbackMessage.className = "success"; // Assume que tem estilos para .success
                feedbackMessage.style.display = "block";
            }
            this.reset(); // Limpar o formulário
        });
    }

