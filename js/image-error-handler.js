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
      } else if (img.src.includes('icons/') && img.src.endsWith('.png')) {
        // Tentar corrigir ícones específicos
        const iconName = img.src.split('/').pop();
        if (['coaching-icon.png', 'inspiration-icon.png', 'digital-icon.png', 'cv-icon.png'].includes(iconName)) {
          // Usar ícones genéricos para substituir os vazios
          img.src = 'https://via.placeholder.com/64/3498db/ffffff?text=' + iconName.replace('-icon.png', '');
        }
      } else if (img.src.includes('images/') && img.src.endsWith('.jpg')) {
        // Tratar imagens JPG ausentes na newsletter
        const imgName = img.src.split('/').pop();
        const imgAlt = img.alt || 'Imagem';
        // Usar placeholders para imagens ausentes
        img.src = 'https://via.placeholder.com/350x200/3498db/ffffff?text=' + imgAlt.replace(/ /g, '+');
      }
    };
    
    // Verificar imagens que já estão no DOM
    if (img.complete && img.naturalHeight === 0) {
      img.onerror();
    }
  });
  
  console.log('Tratamento de erros de imagens inicializado');
});
