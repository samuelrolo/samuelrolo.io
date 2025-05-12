// Main JavaScript file for Share2Inspire

document.addEventListener('DOMContentLoaded', function() {
    console.log('Share2Inspire site inicializado.');

    // Exemplo: Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Outras interatividades globais podem ser adicionadas aqui
    // Por exemplo, manipulação de menu mobile, animações, etc.

});

// Lógica para o widget de feedback discreto (se for diferente do survey da loja)
// Se o survey da loja for o único formulário, esta parte pode ser removida ou adaptada.
// Exemplo de como poderia ser um widget de feedback simples:
/*
const feedbackButton = document.createElement('div');
feedbackButton.classList.add('feedback-widget');
feedbackButton.textContent = 'Feedback';
document.body.appendChild(feedbackButton);

feedbackButton.addEventListener('click', () => {
    // Lógica para mostrar um formulário de feedback modal
    alert('Formulário de feedback apareceria aqui.');
});
*/

