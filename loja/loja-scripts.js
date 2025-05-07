// Scripts para a loja de e-books

document.addEventListener("DOMContentLoaded", function() {
    const formComprarEbook = document.getElementById("formComprarEbook");

    if (formComprarEbook) {
        formComprarEbook.addEventListener("submit", function(event) {
            event.preventDefault(); // Previne o envio tradicional do formulário

            const nomeInput = document.getElementById("nome");
            const emailInput = document.getElementById("email");

            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();

            if (!nome || !email) {
                alert("Por favor, preencha o seu nome e e-mail.");
                return;
            }

            // Validar formato do e-mail (simples)
            if (!email.includes("@") || !email.includes(".")) {
                alert("Por favor, introduza um endereço de e-mail válido.");
                return;
            }

            const orderData = {
                product_id: "ebook_gestao_mudanca",
                product_name: "GESTÃO DA MUDANÇA",
                amount: "7.50", // A API ifthenpay geralmente espera o valor como string
                currency: "EUR",
                customer_name: nome,
                customer_email: email,
                // Estes URLs seriam usados pelo backend para configurar o link de pagamento da ifthenpay
                // e para onde o cliente é redirecionado após a tentativa de pagamento.
                success_url: window.location.origin + "/loja/pagamento-sucesso.html",
                error_url: window.location.origin + "/loja/pagamento-erro.html",
                cancel_url: window.location.origin + "/loja/gestao-da-mudanca/index.html"
            };

            console.log("Dados da encomenda (a serem enviados para o backend - simulação):", orderData);
            alert("A processar a sua compra... Esta é uma simulação.\nEm um ambiente real, os seus dados seriam enviados de forma segura para o nosso servidor para processar o pagamento com ifthenpay.");

            // SIMULAÇÃO DE CHAMADA AO BACKEND E REDIRECIONAMENTO
            // Num cenário real, o frontend enviaria `orderData` para um endpoint de backend.
            // O backend, por sua vez, chamaria a API da ifthenpay com a GATEWAY_KEY (secreta).
            // A ifthenpay retornaria um link de pagamento (RedirectUrl).
            // O backend retornaria esse RedirectUrl para o frontend.
            // O frontend então redirecionaria o utilizador para esse RedirectUrl.

            // Simulação de espera pela resposta do backend
            setTimeout(() => {
                // URL de pagamento simulado (como se viesse da ifthenpay via backend)
                const simulatedIfthenpayRedirectUrl = "https://www.ifthenpay.com/sandbox/pagamento-simulado/?orderId=" + Date.now() + "&valor=" + orderData.amount;
                
                console.log("Backend simulado respondeu. A redirecionar para (simulação):", simulatedIfthenpayRedirectUrl);
                alert("Será agora redirecionado para uma página de pagamento simulada da ifthenpay.\nURL: " + simulatedIfthenpayRedirectUrl);
                
                // Redirecionamento para a página de pagamento (simulada)
                window.location.href = simulatedIfthenpayRedirectUrl;
            }, 2500);

            // A lógica de backend (não implementada aqui) seria responsável por:
            // 1. Receber os dados do formulário.
            // 2. Chamar a API ifthenpay para gerar o link de pagamento (usando a GATEWAY_KEY).
            // 3. Retornar o link de pagamento para o frontend.
            // 4. Aguardar a notificação (callback) da ifthenpay sobre o estado do pagamento.
            // 5. Se o pagamento for bem-sucedido, chamar a API Brevo para enviar o e-book.
        });
    }
});
