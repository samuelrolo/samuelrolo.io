document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust offset if header is fixed, 70 is a common value for header height
                let headerOffset = 70;
                const header = document.querySelector('header');
                if (header) {
                    headerOffset = header.offsetHeight;
                }
                window.scrollTo({
                    top: targetElement.offsetTop - headerOffset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Feedback form handling
    const feedbackBtn = document.getElementById('submit-feedback-btn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function() {
            const feedbackForm = document.getElementById('feedback-form');
            const ratingInput = feedbackForm.querySelector('input[name="rating"]:checked');
            const feedbackTextInput = feedbackForm.querySelector('#feedback-text');
            const feedbackMessage = document.getElementById('feedback-message');

            // Clear previous messages
            feedbackMessage.textContent = '';
            feedbackMessage.style.display = 'none';

            if (!ratingInput) {
                feedbackMessage.textContent = 'Por favor, selecione uma avaliação (1-5 estrelas).';
                feedbackMessage.style.color = 'red';
                feedbackMessage.style.display = 'block';
                return;
            }

            if (feedbackTextInput.value.trim() === '') {
                feedbackMessage.textContent = 'Por favor, escreva o seu feedback.';
                feedbackMessage.style.color = 'red';
                feedbackMessage.style.display = 'block';
                return;
            }
            
            const ratingValue = ratingInput.value;
            const feedbackTextValue = feedbackTextInput.value;

            // Placeholder for actual submission logic (e.g., to Brevo API)
            console.log('Feedback Rating:', ratingValue);
            console.log('Feedback Text:', feedbackTextValue);
            
            // Simulate submission (for now, just a success message)
            // In a real scenario, you would make an AJAX call here to your backend or Brevo API.
            // The user was informed that Brevo API integration would require their configuration (e.g., API key).
            
            feedbackMessage.textContent = 'Obrigado pelo seu feedback!';
            feedbackMessage.style.color = 'green';
            feedbackMessage.style.display = 'block';
            feedbackForm.reset();
        });
    }
});
