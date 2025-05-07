#!/bin/bash

# Script de instalação para o Calendário Interativo Share2Inspire

echo "Iniciando instalação do Calendário Interativo Share2Inspire..."

# Verificar se o diretório de destino foi fornecido
if [ -z "$1" ]; then
  INSTALL_DIR="/var/www/html/calendario"
  echo "Nenhum diretório de destino fornecido. Usando o padrão: $INSTALL_DIR"
else
  INSTALL_DIR="$1"
  echo "Diretório de destino: $INSTALL_DIR"
fi

# Criar diretório de instalação se não existir
if [ ! -d "$INSTALL_DIR" ]; then
  echo "Criando diretório de instalação: $INSTALL_DIR"
  mkdir -p "$INSTALL_DIR"
  mkdir -p "$INSTALL_DIR/css"
  mkdir -p "$INSTALL_DIR/js"
else
  echo "O diretório de instalação já existe. Verificando subdiretórios..."
  if [ ! -d "$INSTALL_DIR/css" ]; then
    mkdir -p "$INSTALL_DIR/css"
  fi
  if [ ! -d "$INSTALL_DIR/js" ]; then
    mkdir -p "$INSTALL_DIR/js"
  fi
fi

# Copiar arquivos para o diretório de instalação
echo "Copiando arquivos para o diretório de instalação..."

# Copiar arquivo HTML principal
cp index.html "$INSTALL_DIR/"
cp documentacao.html "$INSTALL_DIR/"

# Copiar arquivos CSS
cp css/styles.css "$INSTALL_DIR/css/"

# Copiar arquivos JavaScript
cp js/calendar.js "$INSTALL_DIR/js/"
cp js/booking.js "$INSTALL_DIR/js/"
cp js/booking-manager.js "$INSTALL_DIR/js/"
cp js/booking-integration.js "$INSTALL_DIR/js/"
cp js/price-system.js "$INSTALL_DIR/js/"
cp js/payment-system.js "$INSTALL_DIR/js/"
cp js/google-calendar-integration.js "$INSTALL_DIR/js/"
cp js/integration.js "$INSTALL_DIR/js/"
cp js/test-system.js "$INSTALL_DIR/js/"

echo "Arquivos copiados com sucesso."

# Verificar permissões
echo "Configurando permissões..."
chmod -R 755 "$INSTALL_DIR"
chmod -R 644 "$INSTALL_DIR"/*.html
chmod -R 644 "$INSTALL_DIR"/css/*.css
chmod -R 644 "$INSTALL_DIR"/js/*.js

echo "Permissões configuradas."

# Instruções finais
echo ""
echo "Instalação concluída com sucesso!"
echo ""
echo "Para configurar as integrações, você precisará editar os seguintes arquivos:"
echo "- $INSTALL_DIR/js/google-calendar-integration.js (para Google Calendar)"
echo "- $INSTALL_DIR/js/payment-system.js (para sistemas de pagamento)"
echo ""
echo "Consulte a documentação em $INSTALL_DIR/documentacao.html para mais informações."
echo ""
echo "Para acessar o calendário, abra o arquivo $INSTALL_DIR/index.html no seu navegador."
echo ""
