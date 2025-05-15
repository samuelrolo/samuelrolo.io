document.addEventListener("DOMContentLoaded", function() {
    // Banner Slider Functionality
    const headerSlides = document.querySelectorAll('.header-slide');
    let currentSlideIndex = 0;
    
    function showSlide(index) {
        headerSlides.forEach(slide => slide.classList.remove('active'));
        headerSlides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % headerSlides.length;
        showSlide(currentSlideIndex);
    }
    
    // Iniciar o slider automático se houver slides
    if (headerSlides.length > 0) {
        setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }
    
    // Carrossel da secção intro
    const introSlides = document.querySelectorAll('.intro-slide');
    const introDots = document.querySelectorAll('.dot');
    let introCurrentSlide = 0;
    
    function showIntroSlide(index) {
        introSlides.forEach(slide => slide.classList.remove('active'));
        introDots.forEach(dot => dot.classList.remove('active'));
        
        introCurrentSlide = (index + introSlides.length) % introSlides.length;
        introSlides[introCurrentSlide].classList.add('active');
        introDots[introCurrentSlide].classList.add('active');
    }
    
    function nextIntroSlide() {
        showIntroSlide(introCurrentSlide + 1);
    }
    
    // Adicionar evento de clique aos dots
    introDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showIntroSlide(index);
        });
    });
    
    // Mudar slide a cada 5 segundos se houver slides
    if (introSlides.length > 0) {
        setInterval(nextIntroSlide, 5000);
    }
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll("header nav ul li a[href^='#']"); // Target only hash links
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId.startsWith("#") && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); 
                    const scrollOffset = 0;
                    window.scrollTo({
                        top: targetElement.offsetTop - scrollOffset,
                        behavior: "smooth"
                    });
                    
                    // Close mobile menu if open
                    const menuItems = document.querySelector(".menu-items");
                    if (menuItems && menuItems.classList.contains("active")) {
                        menuItems.classList.remove("active");
                        const menuToggle = document.querySelector(".menu-toggle");
                        if (menuToggle) {
                            menuToggle.setAttribute("aria-expanded", "false");
                            const hamburgerIcon = menuToggle.querySelector(".hamburger-icon");
                            if (hamburgerIcon) {
                                hamburgerIcon.classList.remove("active");
                            }
                        }
                    }
                }
            } 
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const menuItems = document.querySelector(".menu-items");
    const hamburgerIcon = document.querySelector(".hamburger-icon");

    if (menuToggle && menuItems && hamburgerIcon) {
        menuToggle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true" || false;
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            menuItems.classList.toggle("active");
            hamburgerIcon.classList.toggle("active");
            console.log("Menu toggle clicked, isExpanded:", !isExpanded);
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener("click", function(e) {
            if (menuItems.classList.contains("active") && !menuItems.contains(e.target) && !menuToggle.contains(e.target)) {
                menuItems.classList.remove("active");
                hamburgerIcon.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Service Cards Interaction
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
                    serviceRequestMessage.textContent = "";
                    serviceRequestMessage.style.display = "none";
                }
                if (serviceRequestForm) {
                    serviceRequestForm.reset(); 
                }
                serviceRequestModal.style.display = "block";
            }
        });
    });

    if (closeModalButton && serviceRequestModal) {
        closeModalButton.addEventListener("click", function() {
            serviceRequestModal.style.display = "none";
        });
    }

    if (serviceRequestModal) {
        window.addEventListener("click", function(event) {
            if (event.target == serviceRequestModal) {
                serviceRequestModal.style.display = "none";
            }
        });
    }

    if (serviceRequestForm) {
        serviceRequestForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nameInput = this.querySelector("input[name='name']");
            const emailInput = this.querySelector("input[name='email']");
            const detailsInput = this.querySelector("textarea[name='details']");
            
            if (serviceRequestMessage) {
                serviceRequestMessage.textContent = "";
                serviceRequestMessage.style.display = "none";
            }

            if (!nameInput || !emailInput || !detailsInput || nameInput.value.trim() === "" || emailInput.value.trim() === "" || detailsInput.value.trim() === "") {
                if (serviceRequestMessage) {
                    serviceRequestMessage.textContent = "Por favor, preencha todos os campos obrigatórios.";
                    serviceRequestMessage.style.color = "red";
                    serviceRequestMessage.style.display = "block";
                }
                return;
            }

            console.log("Service Request Submitted:", {
                name: nameInput.value,
                email: emailInput.value,
                phone: this.querySelector("input[name='phone']") ? this.querySelector("input[name='phone']").value : '',
                service_type: this.querySelector("select[name='service_type']") ? this.querySelector("select[name='service_type']").value : '',
                details: detailsInput.value
            });

            if (serviceRequestMessage) {
                serviceRequestMessage.textContent = "O seu pedido foi enviado com sucesso! Entraremos em contacto em breve.";
                serviceRequestMessage.style.color = "green";
                serviceRequestMessage.style.display = "block";
            }
        });
    }

    // Feedback Stars Interaction - Improved
    const starRatingContainer = document.querySelector(".star-rating");
    if (starRatingContainer) {
        const stars = starRatingContainer.querySelectorAll(".fa-star");
        const ratingValueInput = document.getElementById("rating-value");

        // Initialize with proper classes
        function resetStarsVisual() {
            stars.forEach(star => {
                star.classList.remove("fas");
                star.classList.remove("selected");
                star.classList.add("far");
            });
        }

        function highlightStars(value) {
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value);
                if (starValue <= value) {
                    star.classList.remove("far"); // empty star
                    star.classList.add("fas"); // full star
                    star.classList.add("selected");
                } else {
                    star.classList.remove("fas");
                    star.classList.remove("selected");
                    star.classList.add("far");
                }
            });
        }
        
        function updateAriaChecked(selectedValue) {
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value);
                star.setAttribute("aria-checked", starValue === selectedValue ? "true" : "false");
            });
        }

        // Apply initial state if there's a saved value
        if (ratingValueInput && ratingValueInput.value && parseInt(ratingValueInput.value) > 0) {
            highlightStars(parseInt(ratingValueInput.value));
            updateAriaChecked(parseInt(ratingValueInput.value));
        }

        stars.forEach(star => {
            // Hover effect
            star.addEventListener("mouseover", function() {
                resetStarsVisual();
                const currentValue = parseInt(this.dataset.value);
                highlightStars(currentValue);
            });

            // Restore selected state on mouseout
            star.addEventListener("mouseout", function() {
                resetStarsVisual();
                const selectedRating = ratingValueInput && ratingValueInput.value ? parseInt(ratingValueInput.value) : 0;
                if (selectedRating > 0) {
                    highlightStars(selectedRating);
                }
            });

            // Click to select
            star.addEventListener("click", function() {
                const currentValue = parseInt(this.dataset.value);
                if (ratingValueInput) {
                    ratingValueInput.value = currentValue;
                }
                resetStarsVisual();
                highlightStars(currentValue);
                updateAriaChecked(currentValue);
                console.log("Star rating selected:", currentValue);
            });
            
            // Keyboard accessibility
            star.addEventListener("keydown", function(event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }

    const feedbackForm = document.getElementById("feedback-form");
    const feedbackMessage = document.getElementById("feedback-message");

    if (feedbackForm) {
        feedbackForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const ratingInput = document.getElementById("rating-value");
            const feedbackTextInput = this.querySelector("textarea[name='comment']");

            if (feedbackMessage) {
                feedbackMessage.textContent = "";
                feedbackMessage.style.display = "none";
            }

            if (!ratingInput || !ratingInput.value || parseInt(ratingInput.value) < 1) {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, selecione uma avaliação (1-5 estrelas).";
                    feedbackMessage.style.color = "red";
                    feedbackMessage.style.display = "block";
                }
                return;
            }

            if (!feedbackTextInput || feedbackTextInput.value.trim() === "") {
                if (feedbackMessage) {
                    feedbackMessage.textContent = "Por favor, escreva o seu feedback.";
                    feedbackMessage.style.color = "red";
                    feedbackMessage.style.display = "block";
                }
                return;
            }
            
            console.log("Feedback Rating:", ratingInput.value);
            console.log("Feedback Text:", feedbackTextInput.value);
            
            if (feedbackMessage) {
                feedbackMessage.textContent = "Obrigado pelo seu feedback!";
                feedbackMessage.style.color = "green";
                feedbackMessage.style.display = "block";
            }
            
            // Reset form and stars
            this.reset();
            if (ratingInput) ratingInput.value = "0";
            const stars = document.querySelectorAll(".star-rating .fa-star");
            stars.forEach(star => {
                star.classList.remove("fas", "selected");
                star.classList.add("far");
                star.setAttribute("aria-checked", "false");
            });
        });
    }

    // Survey Widget Functionality
    const openSurveyButton = document.getElementById("open-survey-widget");
    const surveyWidgetContainer = document.getElementById("survey-widget-container");
    const closeSurveyButton = surveyWidgetContainer ? surveyWidgetContainer.querySelector(".close-survey-widget") : null;

    if (openSurveyButton && surveyWidgetContainer) {
        openSurveyButton.addEventListener("click", function(event) {
            event.preventDefault();
            surveyWidgetContainer.style.display = "block";
            console.log("Survey widget opened");
        });
    }

    if (closeSurveyButton && surveyWidgetContainer) {
        closeSurveyButton.addEventListener("click", function() {
            surveyWidgetContainer.style.display = "none";
        });
    }

    if (surveyWidgetContainer) {
        window.addEventListener("click", function(event) {
            if (event.target === surveyWidgetContainer) {
                surveyWidgetContainer.style.display = "none";
            }
        });
    }

    // Recommendations Carousel Logic - Updated to load from JSON
    const carousel = document.querySelector(".carousel-container");
    if (carousel) {
        const slidesContainer = carousel.querySelector(".carousel-slides");
        const nextButton = carousel.querySelector(".carousel-button.next");
        const prevButton = carousel.querySelector(".carousel-button.prev");
        let currentIndex = 0;
        let slides = []; // Initialize as empty, will be populated after fetch

        const populateRecommendations = (recommendations) => {
            if (!slidesContainer) return;
            slidesContainer.innerHTML = ''; // Clear any existing static content

            recommendations.forEach(rec => {
                const slideDiv = document.createElement('div');
                slideDiv.classList.add('recomendacao-card', 'carousel-slide');

                const img = document.createElement('img');
                img.src = rec.avatar; // Using the URL from JSON
                img.alt = `Foto de ${rec.name}`;
                img.classList.add('recomendacao-foto');
                // Handle image loading errors gracefully
                img.onerror = function() {
                    this.alt = `Foto de ${rec.name}`;
                    this.src = 'images/default_avatar.png'; // Provide a fallback image path
                    console.warn(`Failed to load image: ${rec.avatar}. Using fallback.`);
                };

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('recomendacao-conteudo');

                const textP = document.createElement('p');
                textP.classList.add('recomendacao-texto');
                textP.textContent = rec.text;

                const authorP = document.createElement('p');
                authorP.classList.add('recomendacao-autor');
                const strongAuthor = document.createElement('strong');
                strongAuthor.textContent = rec.name;
                authorP.appendChild(strongAuthor);

                const titleP = document.createElement('p');
                titleP.classList.add('recomendacao-cargo');
                titleP.textContent = rec.title;

                contentDiv.appendChild(textP);
                contentDiv.appendChild(authorP);
                contentDiv.appendChild(titleP);

                slideDiv.appendChild(img);
                slideDiv.appendChild(contentDiv);

                slidesContainer.appendChild(slideDiv);
            });

            slides = Array.from(slidesContainer.children);
            if (slides.length > 0) {
                moveToSlide(0);
                console.log(`Loaded ${slides.length} recommendations`);
            }
        };

        const moveToSlide = (targetIndex) => {
            if (!slidesContainer || slides.length === 0) return;
            slidesContainer.style.transform = `translateX(-${targetIndex * 100}%)`;
            currentIndex = targetIndex;
        };

        // Load recommendations from JSON file
        fetch('linkedin_recommendations.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.recommendations && Array.isArray(data.recommendations)) {
                    populateRecommendations(data.recommendations);
                    console.log("Recommendations loaded successfully");
                } else {
                    console.error('JSON data is not in the expected format or recommendations array is missing.');
                    if (slidesContainer) slidesContainer.innerHTML = '<p style="color:white; text-align:center;">Formato de recomendações inválido.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching or parsing recommendations JSON:', error);
                if (slidesContainer) {
                    slidesContainer.innerHTML = '<p style="color:white; text-align:center;">Não foi possível carregar as recomendações.</p>';
                }
            });

        if (nextButton && prevButton) {
            nextButton.addEventListener("click", () => {
                if (slides.length === 0) return;
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) {
                    newIndex = 0;
                }
                moveToSlide(newIndex);
                console.log("Next recommendation clicked, showing index:", newIndex);
            });

            prevButton.addEventListener("click", () => {
                if (slides.length === 0) return;
                let newIndex = currentIndex - 1;
                if (newIndex < 0) {
                    newIndex = slides.length - 1;
                }
                moveToSlide(newIndex);
                console.log("Previous recommendation clicked, showing index:", newIndex);
            });
        }
    }

    // Header Image Slider Logic
    const headerSlider = document.querySelector(".header-slider-container");
    if (headerSlider) {
        const slides = headerSlider.querySelectorAll(".header-slide");
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) {
                    slide.classList.add("active");
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Initialize slider
        if (slides.length > 0) {
            showSlide(0);
            setInterval(nextSlide, slideInterval);
            console.log("Header slider initialized with", slides.length, "slides");
        }
    }

    // Center LinkedIn Subscribe Button
    const linkedinButton = document.querySelector(".linkedin-button");
    if (linkedinButton) {
        linkedinButton.style.display = "block";
        linkedinButton.style.margin = "0 auto";
        linkedinButton.style.textAlign = "center";
        console.log("LinkedIn button centered");
    }

    // Initialize survey widget if it exists
    const surveyWidget = document.getElementById("survey-widget-container");
    if (surveyWidget && !surveyWidget.innerHTML.trim()) {
        surveyWidget.innerHTML = `
            <div class="survey-widget">
                <span class="close-survey-widget">&times;</span>
                <h3>Questionário dos Arquétipos de Liderança</h3>
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfQGcnL-qWxE8bGP5tJBMQUCjFWYiKtxQebMFfUyDo9PzOUmQ/viewform?embedded=true" 
                        width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0">
                    A carregar…
                </iframe>
            </div>
        `;
        console.log("Survey widget initialized");
    }

    console.log("Document fully loaded and all scripts initialized");
});
