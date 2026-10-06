// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

const API_URL =
    "http://127.0.0.1:8000";


// ============================================================
// ELEMENTOS DO GUSTAVO LAB
// ============================================================

const nomeVisitante =
    document.getElementById(
        "nome-visitante"
    );

const mensagemPositiva =
    document.getElementById(
        "mensagem-positiva"
    );

const btnEnviarMensagem =
    document.getElementById(
        "btn-enviar-mensagem"
    );

const mensagemStatus =
    document.getElementById(
        "mensagem-status"
    );

const listaMensagens =
    document.getElementById(
        "lista-mensagens"
    );

const anoAtual =
    document.getElementById(
        "ano-atual"
    );


// ============================================================
// LOCAL STORAGE
// ============================================================

const CHAVE_NOME =
    "gustavoLab_nomeVisitante";


function obterNomeSalvo() {

    try {

        return localStorage.getItem(
            CHAVE_NOME
        );

    } catch (erro) {

        return null;

    }

}


function salvarNome(nome) {

    try {

        localStorage.setItem(
            CHAVE_NOME,
            nome
        );

    } catch (erro) {

        console.warn(
            "Não foi possível salvar o nome.",
            erro
        );

    }

}


function carregarNomeSalvo() {

    const nomeSalvo =
        obterNomeSalvo();


    if (
        nomeSalvo &&
        nomeVisitante
    ) {

        nomeVisitante.value =
            nomeSalvo;

    }

}


// ============================================================
// ENVIAR MENSAGEM PARA API
// ============================================================

async function enviarMensagem(
    nome,
    mensagem
) {

    const resposta =
        await fetch(
            `${API_URL}/mensagens`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        nome,
                        mensagem

                    })

            }
        );


    const dados =
        await resposta.json();


    if (!resposta.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível enviar."
        );

    }


    return dados;

}


// ============================================================
// BOTÃO DO GUSTAVO LAB
// ============================================================

if (btnEnviarMensagem) {

    btnEnviarMensagem.addEventListener(
        "click",
        async () => {


            const nome =
                nomeVisitante.value.trim();


            const mensagem =
                mensagemPositiva.value.trim();


            if (!nome) {

                mensagemStatus.textContent =
                    "Digite seu nome para continuar.";

                return;

            }


            if (nome.length < 2) {

                mensagemStatus.textContent =
                    "Digite um nome válido.";

                return;

            }


            if (nome.length > 100) {

                mensagemStatus.textContent =
                    "O nome pode ter no máximo 100 caracteres.";

                return;

            }


            if (mensagem.length > 500) {

                mensagemStatus.textContent =
                    "A mensagem pode ter no máximo 500 caracteres.";

                return;

            }


            salvarNome(nome);


            btnEnviarMensagem.disabled =
                true;


            mensagemStatus.textContent =
                "Enviando...";


            try {

                await enviarMensagem(
                    nome,
                    mensagem
                );


                mensagemStatus.textContent =
                    "Mensagem registrada com sucesso.";


                mensagemPositiva.value =
                    "";


                await carregarMensagens();


            } catch (erro) {

                console.error(
                    erro
                );


                mensagemStatus.textContent =
                    "Não foi possível enviar agora. Verifique se a API está funcionando.";


            } finally {

                btnEnviarMensagem.disabled =
                    false;

            }

        }
    );

}


// ============================================================
// ENTER NO CAMPO DE NOME
// ============================================================

if (nomeVisitante) {

    nomeVisitante.addEventListener(
        "keypress",
        (evento) => {


            if (
                evento.key ===
                "Enter"
            ) {

                evento.preventDefault();


                if (btnEnviarMensagem) {

                    btnEnviarMensagem.click();

                }

            }

        }
    );

}


// ============================================================
// CARREGAR MENSAGENS
// ============================================================

async function carregarMensagens() {

    if (!listaMensagens) {

        return;

    }


    listaMensagens.innerHTML =
        '<p class="carregando">Carregando mensagens...</p>';


    try {

        const resposta =
            await fetch(
                `${API_URL}/mensagens`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar mensagens."
            );

        }


        const dados =
            await resposta.json();


        const mensagens =
            Array.isArray(dados)
                ? dados
                : dados.mensagens || [];


        listaMensagens.innerHTML =
            "";


        if (mensagens.length === 0) {

            listaMensagens.innerHTML =
                `
                    <div class="sem-mensagens">

                        <strong>
                            Seja o primeiro.
                        </strong>

                        <p>
                            Ainda não há mensagens por aqui.
                        </p>

                    </div>
                `;

            return;

        }


        mensagens.forEach(
            (item) => {


                const card =
                    document.createElement(
                        "article"
                    );


                card.classList.add(
                    "mensagem-card"
                );


                const nome =
                    escaparHTML(
                        item.nome
                    );


                const texto =
                    item.mensagem
                        ? escaparHTML(
                            item.mensagem
                        )
                        : "Passou por aqui.";


                const data =
                    formatarData(
                        item.data_mensagem
                    );


                card.innerHTML =
                    `
                        <div class="mensagem-card__nome">
                            ${nome}
                        </div>

                        <div class="mensagem-card__texto">
                            ${texto}
                        </div>

                        ${
                            data
                                ? `
                                    <div class="mensagem-card__data">
                                        ${data}
                                    </div>
                                `
                                : ""
                        }
                    `;


                listaMensagens.appendChild(
                    card
                );

            }
        );


    } catch (erro) {

        console.error(
            erro
        );


        listaMensagens.innerHTML =
            `
                <div class="erro-mensagens">

                    <strong>
                        Lab indisponível no momento.
                    </strong>

                    <p>
                        Quando a API estiver ativa,
                        as mensagens aparecem aqui.
                    </p>

                </div>
            `;

    }

}


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(data) {

    if (!data) {

        return "";

    }


    try {

        const dataFormatada =
            new Date(data);


        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {

            return "";

        }


        return dataFormatada.toLocaleString(
            "pt-BR"
        );


    } catch (erro) {

        return "";

    }

}


// ============================================================
// PROTEÇÃO CONTRA HTML
// ============================================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// ANIMAÇÕES DAS SEÇÕES
// ============================================================

function iniciarAnimacoes() {

    const itens =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        itens.forEach(
            (item) => {

                item.classList.add(
                    "visivel"
                );

            }
        );


        return;

    }


    const observer =
        new IntersectionObserver(

            (entradas) => {

                entradas.forEach(
                    (entrada) => {


                        if (
                            entrada.isIntersecting
                        ) {

                            entrada.target.classList.add(
                                "visivel"
                            );


                            observer.unobserve(
                                entrada.target
                            );

                        }

                    }
                );

            },

            {

                threshold: 0.12

            }

        );


    itens.forEach(
        (item) => {

            observer.observe(
                item
            );

        }
    );

}


// ============================================================
// PREPARAR STACK INTERATIVA
// ============================================================

function prepararStackInterativa() {

    const cards =
        document.querySelectorAll(
            ".stack-card"
        );


    if (!cards.length) {

        return;

    }


    cards.forEach(
        (card) => {


            const paragrafo =
                card.querySelector(
                    "p"
                );


            if (!paragrafo) {

                return;

            }


            const tecnologias =
                paragrafo.textContent
                    .split("·")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);


            paragrafo.innerHTML =
                "";


            tecnologias.forEach(
                (
                    tecnologia,
                    indice
                ) => {


                    const span =
                        document.createElement(
                            "span"
                        );


                    span.classList.add(
                        "stack-tech"
                    );


                    span.dataset.tech =
                        tecnologia.toUpperCase();


                    span.textContent =
                        tecnologia;


                    paragrafo.appendChild(
                        span
                    );


                    if (
                        indice <
                        tecnologias.length - 1
                    ) {

                        const separador =
                            document.createTextNode(
                                " · "
                            );


                        paragrafo.appendChild(
                            separador
                        );

                    }

                }
            );

        }
    );


    adicionarEstilosStackInterativa();

}


// ============================================================
// CSS DA STACK INTERATIVA
// ============================================================

function adicionarEstilosStackInterativa() {

    if (
        document.getElementById(
            "stack-interactive-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "stack-interactive-style";


    style.textContent =
        `
            .stack-tech {

                display: inline-block;

                padding: 2px 4px;

                margin: 1px 0;

                border-radius: 5px;

                transition:
                    color 0.3s ease,
                    background 0.3s ease,
                    box-shadow 0.3s ease,
                    transform 0.3s ease;

            }


            .stack-tech--ativo {

                color: #ffffff;

                background:
                    rgba(229, 72, 77, 0.18);

                box-shadow:
                    0 0 0 1px rgba(229, 72, 77, 0.40),
                    0 0 24px rgba(229, 72, 77, 0.28);

                transform:
                    translateY(-2px);

            }


            .stack-card {

                transition:
                    border-color 0.35s ease,
                    background 0.35s ease,
                    box-shadow 0.35s ease,
                    transform 0.35s ease;

            }


            .stack-card--ativo {

                position: relative;

                z-index: 2;

                border-color:
                    rgba(229, 72, 77, 0.55) !important;

                background:
                    linear-gradient(
                        145deg,
                        rgba(229, 72, 77, 0.09),
                        rgba(255, 255, 255, 0.018)
                    ) !important;

                box-shadow:
                    0 0 40px rgba(229, 72, 77, 0.10);

                transform:
                    translateY(-5px);

            }


            .stack-card--data {

                animation:
                    stackDataPulse 1.4s ease;

            }


            @keyframes stackDataPulse {

                0% {

                    box-shadow:
                        0 0 0 rgba(229, 72, 77, 0);

                }

                40% {

                    box-shadow:
                        0 0 45px rgba(229, 72, 77, 0.20);

                }

                100% {

                    box-shadow:
                        0 0 0 rgba(229, 72, 77, 0);

                }

            }
        `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// LIMPAR DESTAQUE DA STACK
// ============================================================

function limparDestaqueStack() {

    document
        .querySelectorAll(
            ".stack-tech--ativo"
        )
        .forEach(
            (elemento) => {

                elemento.classList.remove(
                    "stack-tech--ativo"
                );

            }
        );


    document
        .querySelectorAll(
            ".stack-card--ativo"
        )
        .forEach(
            (elemento) => {

                elemento.classList.remove(
                    "stack-card--ativo"
                );

            }
        );


    document
        .querySelectorAll(
            ".stack-card--data"
        )
        .forEach(
            (elemento) => {

                elemento.classList.remove(
                    "stack-card--data"
                );

            }
        );

}


// ============================================================
// DESTACAR TECNOLOGIA NA STACK
// ============================================================

let timeoutDestaqueStack;


function destacarTecnologiaNaStack(
    tecnologia
) {

    const stack =
        document.getElementById(
            "stack"
        );


    if (!stack) {

        return;

    }


    limparDestaqueStack();


    clearTimeout(
        timeoutDestaqueStack
    );


    const tecnologiaNormalizada =
        tecnologia.toUpperCase();


    let elementoTecnologia =
        null;


    let card =
        null;


    // --------------------------------------------------------
    // DATA DESTACA O CARD "DADOS"
    // --------------------------------------------------------

    if (
        tecnologiaNormalizada ===
        "DATA"
    ) {

        const cards =
            document.querySelectorAll(
                ".stack-card"
            );


        cards.forEach(
            (item) => {


                const titulo =
                    item.querySelector(
                        "h3"
                    );


                if (
                    titulo &&
                    titulo.textContent
                        .trim()
                        .toUpperCase() ===
                    "DADOS"
                ) {

                    card =
                        item;

                }

            }
        );


        if (card) {

            card.classList.add(
                "stack-card--ativo",
                "stack-card--data"
            );

        }

    } else {


        // ----------------------------------------------------
        // OUTRAS TECNOLOGIAS
        // ----------------------------------------------------

        const tecnologias =
            document.querySelectorAll(
                ".stack-tech"
            );


        tecnologias.forEach(
            (item) => {


                if (
                    item.dataset.tech ===
                    tecnologiaNormalizada
                ) {

                    elementoTecnologia =
                        item;

                }

            }
        );


        if (elementoTecnologia) {

            card =
                elementoTecnologia.closest(
                    ".stack-card"
                );


            elementoTecnologia.classList.add(
                "stack-tech--ativo"
            );


            if (card) {

                card.classList.add(
                    "stack-card--ativo"
                );

            }

        }

    }


    // --------------------------------------------------------
    // DESCER ATÉ A STACK
    // --------------------------------------------------------

    setTimeout(
        () => {

            stack.scrollIntoView(
                {

                    behavior:
                        "smooth",

                    block:
                        "center"

                }
            );

        },
        650
    );


    // --------------------------------------------------------
    // REMOVER DESTAQUE
    // --------------------------------------------------------

    timeoutDestaqueStack =
        setTimeout(
            () => {

                limparDestaqueStack();

            },
            4500
        );

}


// ============================================================
// DATA DICE
// ============================================================

function iniciarDataDice() {

    const dice =
        document.getElementById(
            "dice"
        );

    const scene =
        document.getElementById(
            "dice-scene"
        );

    const botao =
        document.getElementById(
            "dice-roll"
        );

    const resultado =
        document.getElementById(
            "dice-result"
        );


    if (
        !dice ||
        !scene
    ) {

        return;

    }


    // ========================================================
    // CADA FACE TEM UMA TECNOLOGIA
    // ========================================================

    const faces = [

        {

            numero: 1,

            tecnologia:
                "PYTHON",

            x: 0,

            y: 0

        },


        {

            numero: 2,

            tecnologia:
                "SQL",

            x: -90,

            y: 0

        },


        {

            numero: 3,

            tecnologia:
                "KAFKA",

            x: 0,

            y: -90

        },


        {

            numero: 4,

            tecnologia:
                "DOCKER",

            x: 0,

            y: 90

        },


        {

            numero: 5,

            tecnologia:
                "AIRFLOW",

            x: 90,

            y: 0

        },


        {

            numero: 6,

            tecnologia:
                "DATA",

            x: 0,

            y: 180

        }

    ];


    // ========================================================
    // ESTADO DO DADO
    // ========================================================

    let mouseX =
        0;

    let mouseY =
        0;


    let baseX =
        -18;

    let baseY =
        32;


    let visualX =
        baseX;

    let visualY =
        baseY;


    let inicioX =
        baseX;

    let inicioY =
        baseY;


    let destinoX =
        baseX;

    let destinoY =
        baseY;


    let rolando =
        false;


    let inicioRolagem =
        0;


    const duracaoRolagem =
        1350;


    let tempoFlutuacao =
        0;


    const reduzirMovimento =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    // ========================================================
    // NORMALIZAR ÂNGULO
    // ========================================================

    function normalizarAngulo(
        angulo
    ) {

        return (
            (
                angulo % 360
            ) + 360
        ) % 360;

    }


    // ========================================================
    // CALCULAR DISTÂNCIA ATÉ A FACE
    // ========================================================

    function calcularDestino(
        atual,
        desejado,
        giros
    ) {

        const atualNormalizado =
            normalizarAngulo(
                atual
            );


        const desejadoNormalizado =
            normalizarAngulo(
                desejado
            );


        let diferenca =
            desejadoNormalizado -
            atualNormalizado;


        if (diferenca < 0) {

            diferenca +=
                360;

        }


        return atual +
            (
                giros * 360
            ) +
            diferenca;

    }


    // ========================================================
    // EASING
    // ========================================================

    function easeOutQuart(
        progresso
    ) {

        return 1 -
            Math.pow(
                1 - progresso,
                4
            );

    }


    // ========================================================
    // ROLAR O DADO
    // ========================================================

    function rolarDado() {

        if (rolando) {

            return;

        }


        const sorteado =
            faces[
                Math.floor(
                    Math.random() *
                    faces.length
                )
            ];


        rolando =
            true;


        if (botao) {

            botao.disabled =
                true;


            botao.textContent =
                "Rolando...";

        }


        if (resultado) {

            resultado.textContent =
                "...";

        }


        inicioX =
            visualX;


        inicioY =
            visualY;


        // ====================================================
        // FAZ VÁRIAS VOLTAS ANTES DE PARAR
        // ====================================================

        destinoX =
            calcularDestino(
                inicioX,
                sorteado.x,
                2
            );


        destinoY =
            calcularDestino(
                inicioY,
                sorteado.y,
                3
            );


        inicioRolagem =
            performance.now();


        // ====================================================
        // FINAL DA ROLAGEM
        // ====================================================

        setTimeout(
            () => {


                baseX =
                    sorteado.x;


                baseY =
                    sorteado.y;


                visualX =
                    baseX;


                visualY =
                    baseY;


                rolando =
                    false;


                if (resultado) {

                    resultado.textContent =
                        sorteado.tecnologia;

                }


                if (botao) {

                    botao.disabled =
                        false;


                    botao.textContent =
                        "Rolar dado ↻";

                }


                destacarTecnologiaNaStack(
                    sorteado.tecnologia
                );


            },
            duracaoRolagem
        );

    }


    // ========================================================
    // MOVIMENTO COM O MOUSE
    // ========================================================

    scene.addEventListener(
        "mousemove",
        (evento) => {


            if (rolando) {

                return;

            }


            const area =
                scene.getBoundingClientRect();


            const x =
                (
                    evento.clientX -
                    area.left
                )
                / area.width;


            const y =
                (
                    evento.clientY -
                    area.top
                )
                / area.height;


            mouseX =
                (
                    x - 0.5
                ) * 14;


            mouseY =
                (
                    y - 0.5
                ) * -12;

        }
    );


    scene.addEventListener(
        "mouseleave",
        () => {

            mouseX =
                0;

            mouseY =
                0;

        }
    );


    // ========================================================
    // CLIQUE NO DADO
    // ========================================================

    scene.addEventListener(
        "click",
        rolarDado
    );


    // ========================================================
    // BOTÃO
    // ========================================================

    if (botao) {

        botao.addEventListener(
            "click",
            rolarDado
        );

    }


    // ========================================================
    // ACESSIBILIDADE
    // ========================================================

    if (reduzirMovimento) {

        dice.style.transform =
            `
                rotateX(${baseX}deg)
                rotateY(${baseY}deg)
            `;


        if (botao) {

            botao.addEventListener(
                "click",
                () => {

                    const sorteado =
                        faces[
                            Math.floor(
                                Math.random() *
                                faces.length
                            )
                        ];


                    dice.style.transform =
                        `
                            rotateX(${sorteado.x}deg)
                            rotateY(${sorteado.y}deg)
                        `;


                    resultado.textContent =
                        sorteado.tecnologia;


                    destacarTecnologiaNaStack(
                        sorteado.tecnologia
                    );

                }
            );

        }


        return;

    }


    // ========================================================
    // LOOP DE ANIMAÇÃO
    // ========================================================

    function animar(
        agora
    ) {

        tempoFlutuacao +=
            0.012;


        // ====================================================
        // DURANTE A ROLAGEM
        // ====================================================

        if (rolando) {

            const progresso =
                Math.min(
                    (
                        agora -
                        inicioRolagem
                    )
                    /
                    duracaoRolagem,
                    1
                );


            const suave =
                easeOutQuart(
                    progresso
                );


            visualX =
                inicioX +
                (
                    destinoX -
                    inicioX
                ) *
                suave;


            visualY =
                inicioY +
                (
                    destinoY -
                    inicioY
                ) *
                suave;


            dice.style.transform =
                `
                    rotateX(${visualX}deg)
                    rotateY(${visualY}deg)
                    rotateZ(${Math.sin(progresso * Math.PI) * 14}deg)
                `;

        } else {


            // =================================================
            // FLUTUAÇÃO NORMAL
            // =================================================

            const flutuarX =
                Math.sin(
                    tempoFlutuacao
                ) * 1.5;


            const flutuarY =
                Math.cos(
                    tempoFlutuacao * 0.8
                ) * 1.8;


            visualX =
                baseX +
                mouseY +
                flutuarX;


            visualY =
                baseY +
                mouseX +
                flutuarY;


            dice.style.transform =
                `
                    rotateX(${visualX}deg)
                    rotateY(${visualY}deg)
                    rotateZ(${Math.sin(tempoFlutuacao * 0.45) * 1.2}deg)
                `;

        }


        requestAnimationFrame(
            animar
        );

    }


    requestAnimationFrame(
        animar
    );

}


// ============================================================
// DADOS DOS PROJETOS
// ============================================================

const projetosDetalhes = {

    realtime: {

        categoria:
            "DATA ENGINEERING",

        titulo:
            "Real-Time Data Platform",

        descricao:
            "Plataforma criada para simular um ambiente de dados em tempo real, recebendo e processando eventos continuamente para monitoramento de veículos.",

        fluxo: [

            "EVENTS",
            "KAFKA",
            "CONSUMER",
            "CLICKHOUSE",
            "FASTAPI",
            "DASHBOARD"

        ],

        tecnologias: [

            "Python",
            "Kafka",
            "ClickHouse",
            "FastAPI",
            "Docker"

        ],

        github:
            "https://github.com/iamgusta/real-time-data-platform"

    },


    ecommerce: {

        categoria:
            "DATA ENGINEERING",

        titulo:
            "Plataforma de Dados para E-commerce",

        descricao:
            "Projeto de plataforma de dados para organizar informações de e-commerce através de pipeline ETL, orquestração e armazenamento estruturado.",

        fluxo: [

            "DATA",
            "AIRFLOW",
            "ETL",
            "POSTGRESQL",
            "DW",
            "POWER BI"

        ],

        tecnologias: [

            "Python",
            "Airflow",
            "Docker",
            "PostgreSQL",
            "Power BI"

        ],

        github:
            "https://github.com/iamgusta/Plataforma-dados-e-commerce"

    },


    vendas: {

        categoria:
            "DATA ENGINEERING",

        titulo:
            "Pipeline de Vendas",

        descricao:
            "Pipeline desenvolvido para trabalhar o fluxo completo de dados de vendas, desde a ingestão dos arquivos até a transformação, armazenamento e análise.",

        fluxo: [

            "CSV",
            "PYTHON",
            "PANDAS",
            "MYSQL",
            "AIRFLOW",
            "POWER BI"

        ],

        tecnologias: [

            "Python",
            "Pandas",
            "MySQL",
            "Airflow",
            "Power BI"

        ],

        github:
            "https://github.com/iamgusta/Pipeline-de-vendas"

    }

};


// ============================================================
// MODAIS DOS PROJETOS
// ============================================================

function iniciarModais() {

    const modal =
        document.getElementById(
            "project-modal"
        );


    if (!modal) {

        return;

    }


    const titulo =
        document.getElementById(
            "modal-title"
        );

    const categoria =
        document.getElementById(
            "modal-category"
        );

    const descricao =
        document.getElementById(
            "modal-description"
        );

    const fluxo =
        document.getElementById(
            "modal-flow"
        );

    const tags =
        document.getElementById(
            "modal-tags"
        );

    const github =
        document.getElementById(
            "modal-github"
        );


    // ========================================================
    // ABRIR MODAL
    // ========================================================

    function abrirModal(
        projeto
    ) {

        const dados =
            projetosDetalhes[
                projeto
            ];


        if (!dados) {

            return;

        }


        categoria.textContent =
            dados.categoria;


        titulo.textContent =
            dados.titulo;


        descricao.textContent =
            dados.descricao;


        fluxo.innerHTML =
            "";


        dados.fluxo.forEach(
            (
                etapa,
                indice
            ) => {


                const item =
                    document.createElement(
                        "span"
                    );


                item.textContent =
                    etapa;


                fluxo.appendChild(
                    item
                );


                if (
                    indice <
                    dados.fluxo.length - 1
                ) {

                    const seta =
                        document.createElement(
                            "strong"
                        );


                    seta.textContent =
                        "→";


                    fluxo.appendChild(
                        seta
                    );

                }

            }
        );


        tags.innerHTML =
            "";


        dados.tecnologias.forEach(
            (tecnologia) => {


                const item =
                    document.createElement(
                        "span"
                    );


                item.textContent =
                    tecnologia;


                tags.appendChild(
                    item
                );

            }
        );


        github.href =
            dados.github;


        modal.classList.add(
            "aberto"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-aberto"
        );

    }


    // ========================================================
    // FECHAR MODAL
    // ========================================================

    function fecharModal() {

        modal.classList.remove(
            "aberto"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-aberto"
        );

    }


    document
        .querySelectorAll(
            "[data-project]"
        )
        .forEach(
            (botao) => {


                botao.addEventListener(
                    "click",
                    () => {

                        abrirModal(
                            botao.dataset.project
                        );

                    }
                );

            }
        );


    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            (elemento) => {


                elemento.addEventListener(
                    "click",
                    fecharModal
                );

            }
        );


    document.addEventListener(
        "keydown",
        (evento) => {


            if (
                evento.key ===
                "Escape"
            ) {

                fecharModal();

            }

        }
    );

}


// ============================================================
// INICIAR PORTFÓLIO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        carregarNomeSalvo();


        carregarMensagens();


        iniciarAnimacoes();


        prepararStackInterativa();


        iniciarDataDice();


        iniciarModais();


        if (anoAtual) {

            anoAtual.textContent =
                new Date()
                    .getFullYear();

        }

    }
);