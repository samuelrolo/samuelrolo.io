const fetch = require("node-fetch");

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const recipientEmail = "srshare2inspire@gmail.com"; // Your email address
    const senderEmail = "srshare2inspire@gmail.com"; // Brevo requires a validated sender
    const senderName = "Share2Inspires Website";

    if (!brevoApiKey) {
        console.error("Brevo API Key not found in environment variables.");
        return { statusCode: 500, body: "Server configuration error." };
    }

    try {
        const data = JSON.parse(event.body);

        // Basic validation
        if (!data.email || !data.source) {
            return { statusCode: 400, body: "Missing required fields (email, source)." };
        }

        let subject = "";
        let htmlContent = "";

        // Customize email based on the source form
        if (data.source === "contact_form") {
            subject = `Novo Contacto de ${data.name || 'Visitante'} via Website`;
            htmlContent = `
                <h1>Nova Mensagem de Contacto</h1>
                <p><strong>Nome:</strong> ${data.name || 'Não fornecido'}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${data.message || 'Não fornecida'}</p>
            `;
        } else if (data.source === "questionnaire_result") {
            subject = `Interesse no Resultado do Questionário: ${data.archetype || 'N/A'}`;
            htmlContent = `
                <h1>Interesse no Resultado do Questionário</h1>
                <p>Um utilizador expressou interesse em saber mais sobre o seu resultado.</p>
                <p><strong>Arquétipo Obtido:</strong> ${data.archetype || 'Não especificado'}</p>
                <p><strong>Email do Utilizador:</strong> ${data.email}</p>
            `;
        } else {
            return { statusCode: 400, body: "Invalid form source specified." };
        }

        const payload = {
            sender: { name: senderName, email: senderEmail },
            to: [{ email: recipientEmail }],
            replyTo: { email: data.email, name: data.name || data.email }, // Set reply-to for easy response
            subject: subject,
            htmlContent: htmlContent,
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "api-key": brevoApiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseBody = await response.json();

        if (!response.ok) {
            console.error("Brevo API Error:", response.status, responseBody);
            // Don't expose detailed error messages to the client
            return { statusCode: 500, body: "Failed to send email. Please try again later." };
        }

        console.log("Email sent successfully via Brevo:", responseBody);
        return { statusCode: 200, body: JSON.stringify({ message: "Email sent successfully!" }) };

    } catch (error) {
        console.error("Error processing email request:", error);
        // Check for JSON parsing errors specifically
        if (error instanceof SyntaxError) {
             return { statusCode: 400, body: "Invalid request format." };
        }
        return { statusCode: 500, body: "An internal error occurred." };
    }
};

