// Obter todos os links da barra de navegação
const links = document.querySelectorAll('body > nav > div > div.relative > div > div > a');

// Iterar sobre cada link
links.forEach(link => {
    // Verificar se o atributo aria-current está definido como 'page'
    if (link.getAttribute('href') === window.location.pathname) {
        // Adicionar uma classe para destacar visualmente o link da página atual
        link.classList.add('menu-active');
    }
});
