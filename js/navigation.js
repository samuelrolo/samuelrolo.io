// Sistema de navegação corrigido para o site Share2Inspire (SPA Style)
document.addEventListener("DOMContentLoaded", function() {
    // Menu mobile
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle"); // Assuming ID is mobile-menu-toggle
    const navLinksContainer = document.querySelector(".nav-links"); // Assuming class is nav-links

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener("click", function() {
            navLinksContainer.classList.toggle("active");
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

    // --- Sistema de Navegação por Secções (SPA Style) ---
    const allNavLinks = document.querySelectorAll("nav a, .nav-link, .footer-links a"); // Links que controlam a navegação
    const sections = document.querySelectorAll(".page-section"); // Todas as secções da página
    const pageContainer = document.getElementById("page-container"); // Container das secções
    let currentSection = document.querySelector(".page-section.active") || sections[0]; // Assume a primeira secção se nenhuma estiver ativa

    // Função para mostrar uma seção específica
    function showSection(sectionId) {
        const targetSection = document.getElementById(sectionId);

        if (targetSection && targetSection !== currentSection) {
            console.log(`Navigating from ${currentSection ? currentSection.id : 'none'} to ${sectionId}`);

            // 1. Remover classe 'active' e adicionar 'prev' à secção atual (para transição)
            if (currentSection) {
                currentSection.classList.remove("active");
                currentSection.classList.add("prev"); // Adiciona 'prev' para possível animação de saída
                // Remover 'prev' após a transição (opcional, depende do CSS)
                // setTimeout(() => { currentSection.classList.remove("prev"); }, 600); // Tempo igual à transição CSS
            }

            // 2. Adicionar classe 'active' à nova secção
            targetSection.classList.remove("prev"); // Garante que não tem 'prev' se for a anterior
            targetSection.classList.add("active");

            // 3. Atualizar a secção atual
            currentSection = targetSection;

            // 4. Atualizar links ativos no menu
            allNavLinks.forEach(link => {
                // Verifica se o href do link corresponde ao ID da secção alvo
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            // 5. (Opcional) Scroll para o topo da nova secção se houver scroll interno
            targetSection.scrollTop = 0;

        } else if (!targetSection) {
            console.warn(`Section with ID ${sectionId} not found.`);
        } else {
            console.log(`Already on section ${sectionId}`);
        }
    }

    // Adicionar event listeners para os links de navegação
    allNavLinks.forEach(link => {
        const href = link.getAttribute("href");
        // Verificar se o link é interno (começa com #) e não é apenas "#"
        if (href && href.startsWith("#") && href.length > 1) {
            link.addEventListener("click", function(e) {
                e.preventDefault(); // Previne o comportamento padrão do link anchor
                const targetId = href.substring(1);
                showSection(targetId);

                // Fechar menu mobile se estiver aberto e for um link do menu principal
                if (navLinksContainer && navLinksContainer.classList.contains("active") && link.closest('.nav-links')) {
                    navLinksContainer.classList.remove("active");
                }
            });
        }
    });

    // Inicializar: Garantir que a secção inicial (ex: #hero) está ativa
    const initialHash = window.location.hash;
    if (initialHash && initialHash.length > 1) {
        showSection(initialHash.substring(1));
    } else if (currentSection) {
        // Se não houver hash, ativa a secção 'currentSection' (primeira ou a que já tem .active)
        showSection(currentSection.id);
    } else if (sections.length > 0) {
        // Fallback para a primeira secção se tudo o resto falhar
        showSection(sections[0].id);
    }

});

