# /home/ubuntu/share2inspire_Backend/src/utils/email_service.py

import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "noreply@yourdomain.com") # Fallback sender
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "Samuel Rolo") # Fallback sender name

def send_brevo_email(to_email, to_name, subject, html_content, attachment_path=None, attachment_name=None):
    """
    Envia um e-mail usando a API da Brevo (Sendinblue).

    Args:
        to_email (str): E-mail do destinatário.
        to_name (str): Nome do destinatário.
        subject (str): Assunto do e-mail.
        html_content (str): Conteúdo HTML do e-mail.
        attachment_path (str, optional): Caminho absoluto para o ficheiro a ser anexado.
        attachment_name (str, optional): Nome do ficheiro anexado (como aparecerá no e-mail).

    Returns:
        bool: True se o e-mail foi enviado com sucesso, False caso contrário.
    """
    if not BREVO_API_KEY:
        print("ERRO CRÍTICO: A variável de ambiente BREVO_API_KEY não está definida! O e-mail não pode ser enviado.")
        return False

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    sender_details = {"email": BREVO_SENDER_EMAIL, "name": BREVO_SENDER_NAME}
    to_details = [{"email": to_email, "name": to_name}]

    email_to_send = sib_api_v3_sdk.SendSmtpEmail(
        to=to_details,
        sender=sender_details,
        subject=subject,
        html_content=html_content
    )

    if attachment_path and attachment_name:
        try:
            with open(attachment_path, "rb") as f:
                attachment_content = f.read()
            
            import base64
            encoded_content = base64.b64encode(attachment_content).decode()
            
            email_to_send.attachment = [
                sib_api_v3_sdk.SendSmtpEmailAttachment(
                    name=attachment_name,
                    content=encoded_content
                )
            ]
        except FileNotFoundError:
            print(f"ERRO: Ficheiro de anexo não encontrado em {attachment_path}")
            return False
        except Exception as e:
            print(f"ERRO ao processar anexo: {e}")
            return False

    try:
        api_response = api_instance.send_transac_email(email_to_send)
        print(f"E-mail enviado via Brevo para {to_email}. Resposta: {api_response}")
        return True
    except ApiException as e:
        print(f"Exceção ao chamar a API da Brevo (Sendinblue) para enviar e-mail: {e}\n")
        return False
    except Exception as e:
        print(f"Erro inesperado ao tentar enviar e-mail via Brevo: {e}")
        return False

if __name__ == '__main__':
    # Exemplo de teste (requer que BREVO_API_KEY e BREVO_SENDER_EMAIL estejam configurados no .env)
    # Crie um ficheiro .env na raiz do projeto share2inspire_Backend com as chaves
    print("A testar o envio de e-mail...")
    # Substitua com um e-mail de teste real
    test_to_email = "teste@exemplo.com"
    test_to_name = "Utilizador Teste"
    test_subject = "Teste de E-mail Brevo a partir de email_service.py"
    test_html_content = "<h1>Olá!</h1><p>Este é um e-mail de teste enviado através do email_service.py.</p>"
    
    # Para testar com anexo, crie um ficheiro dummy.txt na raiz do projeto share2inspire_Backend
    # com algum conteúdo.
    # test_attachment_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "dummy.txt")
    # if os.path.exists(test_attachment_path):
    #     if send_brevo_email(test_to_email, test_to_name, test_subject, test_html_content, attachment_path=test_attachment_path, attachment_name="documento_teste.txt"):
    #         print("E-mail de teste com anexo enviado com sucesso!")
    #     else:
    #         print("Falha ao enviar e-mail de teste com anexo.")
    # else:
    #     print(f"Ficheiro de anexo de teste não encontrado em {test_attachment_path}, a enviar sem anexo.")
    #     if send_brevo_email(test_to_email, test_to_name, test_subject, test_html_content):
    #         print("E-mail de teste (sem anexo) enviado com sucesso!")
    #     else:
    #         print("Falha ao enviar e-mail de teste (sem anexo).")

    # Teste simples sem anexo:
    if send_brevo_email(test_to_email, test_to_name, test_subject, test_html_content):
        print("E-mail de teste (sem anexo) enviado com sucesso!")
    else:
        print("Falha ao enviar e-mail de teste (sem anexo).")

