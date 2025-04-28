// Código para detetar e reparar problemas com imagens
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Adicionar tratamento de erro para cada imagem
    img.onerror = function() {
      console.log('Erro ao carregar imagem:', img.src);
      
      // Tentar corrigir caminhos comuns de erro
      if (img.src.includes('imagens/')) {
        // Corrigir caminho de 'imagens/' para 'images/'
        const newSrc = img.src.replace('imagens/', 'images/');
        console.log('Tentando caminho alternativo:', newSrc);
        img.src = newSrc;
      } else if (!img.src.includes('/') && !img.src.startsWith('data:') && !img.src.startsWith('http')) {
        // Se for um caminho relativo sem diretório, adicionar 'images/'
        const newSrc = 'images/' + img.src;
        console.log('Tentando caminho alternativo:', newSrc);
        img.src = newSrc;
      } else if (img.src.includes('icons/') && img.src.endsWith('.svg')) {
        // Não fazer nada, manter o SVG
        console.log('Mantendo o ícone SVG:', img.src);
      } else if (img.src.includes('icons/') && img.src.endsWith('.png')) {
        // Substituir PNGs vazios por SVGs correspondentes
        const newSrc = img.src.replace('.png', '.svg');
        console.log('Substituindo PNG por SVG:', newSrc);
        img.src = newSrc;
      }
    };
    
    // Verificar imagens que já estão no DOM
    if (img.complete && img.naturalHeight === 0) {
      img.onerror();
    }
  });
  
  console.log('Tratamento de erros de imagens inicializado');
});
