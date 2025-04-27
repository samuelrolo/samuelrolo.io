// Código para detetar e reportar erros de carregamento de imagens
document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar se uma imagem carregou corretamente
    function verificarImagem(img) {
        if (!img.complete || img.naturalWidth === 0) {
            console.error('Erro ao carregar imagem:', img.src);
            
            // Adicionar classe para destacar imagens com erro
            img.classList.add('erro-carregamento');
            
            // Tentar caminhos alternativos
            if (img.src.indexOf('/') === -1) {
                // Se a imagem estiver na raiz, tentar na pasta images
                const novoCaminho = 'images/' + img.src;
                console.log('Tentando caminho alternativo:', novoCaminho);
                img.src = novoCaminho;
            } else if (img.src.indexOf('images/') === 0) {
                // Se a imagem estiver na pasta images, tentar na raiz
                const novoCaminho = img.src.replace('images/', '');
                console.log('Tentando caminho alternativo:', novoCaminho);
                img.src = novoCaminho;
            } else if (img.src.indexOf('imagens/') === 0) {
                // Se a imagem estiver na pasta imagens (que não existe), tentar na pasta images
                const novoCaminho = img.src.replace('imagens/', 'images/');
                console.log('Tentando caminho alternativo:', novoCaminho);
                img.src = novoCaminho;
            }
        }
    }
    
    // Verificar todas as imagens existentes
    document.querySelectorAll('img').forEach(function(img) {
        if (img.complete) {
            verificarImagem(img);
        } else {
            img.addEventListener('load', function() {
                verificarImagem(img);
            });
            
            img.addEventListener('error', function() {
                console.error('Erro ao carregar imagem:', img.src);
                
                // Tentar caminhos alternativos
                if (img.src.indexOf('/') === -1) {
                    // Se a imagem estiver na raiz, tentar na pasta images
                    const novoCaminho = 'images/' + img.src;
                    console.log('Tentando caminho alternativo:', novoCaminho);
                    img.src = novoCaminho;
                } else if (img.src.indexOf('images/') === 0) {
                    // Se a imagem estiver na pasta images, tentar na raiz
                    const novoCaminho = img.src.replace('images/', '');
                    console.log('Tentando caminho alternativo:', novoCaminho);
                    img.src = novoCaminho;
                } else if (img.src.indexOf('imagens/') === 0) {
                    // Se a imagem estiver na pasta imagens (que não existe), tentar na pasta images
                    const novoCaminho = img.src.replace('imagens/', 'images/');
                    console.log('Tentando caminho alternativo:', novoCaminho);
                    img.src = novoCaminho;
                }
            });
        }
    });
});
