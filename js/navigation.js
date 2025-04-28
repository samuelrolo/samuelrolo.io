document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Mostrar o questionário quando o botão for clicado
    const showSurveyBtn = document.getElementById('show-survey-btn');
    const surveyContainer = document.getElementById('survey-container');
    
    if (showSurveyBtn && surveyContainer) {
        showSurveyBtn.addEventListener('click', function() {
            surveyContainer.classList.add('active');
            showSurveyBtn.style.display = 'none';
        });
    }
    
    // Sistema de navegação melhorado
    const allNavLinks = document.querySelectorAll('nav a, .nav-link');
    const sections = document.querySelectorAll('section');
    
    // Função para mostrar uma seção específica
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                setTimeout(() => {
                    section.classList.add('active');
                }, 50);
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
        
        // Atualizar links ativos
        allNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}` || 
                (link.id === 'nav-inicio' && sectionId === 'inicio')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Inicializar com a seção de início
    showSection('inicio');
    
    // Adicionar event listeners para os links de navegação
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Fechar menu mobile se estiver aberto
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
});
