// MODO ESCURO/CLARO
const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.style.getPropertyValue('--cor-primaria') === 'black';

    if (isDark) {
        root.style.setProperty('--cor-primaria', 'white');
        root.style.setProperty('--cor-secundaria', 'black');
    } else {
        root.style.setProperty('--cor-primaria', 'black');
        root.style.setProperty('--cor-secundaria', 'white');
    }
};

// BOTÃO DE TEMA
const btn = document.createElement('button');
btn.innerText = '🌗 Alternar Tema';
btn.style.position = 'fixed';
btn.style.top = '20px';
btn.style.right = '20px';
btn.style.padding = '10px';
btn.style.borderRadius = '8px';
btn.style.backgroundColor = 'dodgerblue';
btn.style.color = 'white';
btn.style.fontWeight = 'bold';
btn.style.border = 'none';
btn.style.cursor = 'pointer';
btn.onclick = toggleTheme;
document.body.appendChild(btn);

// MENSAGEM DE SAUDAÇÃO DINÂMICA
const saudacao = () => {
    const horas = new Date().getHours();
    let mensagem = 'Olá!';

    if (horas < 12) mensagem = 'Bom dia!';
    else if (horas < 18) mensagem = 'Boa tarde!';
    else mensagem = 'Boa noite!';

    alert(`${mensagem} Bem-vindo ao meu portfólio!`);
};

window.onload = saudacao;

// ANIMAÇÃO DE DIGITAÇÃO NO TÍTULO
const titulo = document.querySelector(".apresentacao__conteudo__titulo");
const textoOriginal = titulo.textContent;
titulo.textContent = '';
let i = 0;

function digitar() {
    if (i < textoOriginal.length) {
        titulo.textContent += textoOriginal.charAt(i);
        i++;
        setTimeout(digitar, 30);
    }
}

digitar();
