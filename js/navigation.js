// Sistema de navegação para o site Share2Inspire
document.addEventListener("DOMContentLoaded", function() {
    // Menu mobile
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle"); // Assuming ID is mobile-menu-toggle
    const navLinks = document.querySelector(".nav-links"); // Assuming class is nav-links

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    }

    // Mostrar o questionário quando o botão for clicado (se existir)
    const showSurveyBtn = document.getElementById("show-survey-btn");
    const surveyContainer = document.getElementById("survey-container");

    if (showSurveyBtn && surveyContainer) {
        showSurveyBtn.addEventListener("click", function() {
            surveyContainer.classList.add("active");
            showSurveyBtn.style.display = "none";
        });
    }

    // Sistema de navegação melhorado (incluindo links do footer)
    const allNavLinks = document.querySelectorAll("nav a, .nav-link, .footer-links a");
    const sections = document.querySelectorAll("section");

    // Função para mostrar uma seção específica e fazer scroll suave
    function showSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Scroll suave para a seção
            targetSection.scrollIntoView({ behavior: "smooth" });

            // Atualizar links ativos (opcional, pode ser complexo com scroll)
            allNavLinks.forEach(link => {
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        } else {
            console.warn(`Section with ID ${sectionId} not found.`);
        }
    }

    // Adicionar event listeners para os links de navegação
    allNavLinks.forEach(link => {
        // Verificar se o link é interno (começa com #)
        if (link.getAttribute("href") && link.getAttribute("href").startsWith("#")) {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                const targetId = this.getAttribute("href").substring(1);
                showSection(targetId);

                // Fechar menu mobile se estiver aberto
                if (navLinks && navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                }
            });
        }
    });

    // Opcional: Atualizar link ativo ao fazer scroll (pode ser complexo e ter impacto na performance)
    // window.addEventListener('scroll', () => { ... });
});

