// ============================================================
// GUSTAVO LAB
// SISTEMA DE VISITANTES E MENSAGENS
// ============================================================


// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const nomeVisitante =
    document.getElementById("nome-visitante");

const mensagemPositiva =
    document.getElementById("mensagem-positiva");

const btnEnviarMensagem =
    document.getElementById("btn-enviar-mensagem");

const mensagemStatus =
    document.getElementById("mensagem-status");

const listaMensagens =
    document.getElementById("lista-mensagens");


// ============================================================
// LOCAL STORAGE
// ============================================================

const CHAVE_NOME =
    "gustavoLab_nomeVisitante";


// ============================================================
// PEGAR NOME SALVO
// ============================================================

function obterNomeSalvo() {

    try {

        return localStorage.getItem(CHAVE_NOME);

    } catch (erro) {

        console.warn(
            "Não foi possível acessar o localStorage:",
            erro
        );

        return null;
    }
}


// ============================================================
// SALVAR NOME
// ============================================================

function salvarNome(nome) {

    try {

        localStorage.setItem(
            CHAVE_NOME,
            nome
        );

    } catch (erro) {

        console.warn(
            "Não foi possível salvar o nome:",
            erro
        );
    }
}


// ============================================================
// COLOCAR NOME SALVO NO INPUT
// ============================================================

function carregarNomeSalvo() {

    const nomeSalvo =
        obterNomeSalvo();

    if (nomeSalvo && nomeVisitante) {

        nomeVisitante.value =
            nomeSalvo;
    }
}


// ============================================================
// ENVIAR MENSAGEM PARA A API
// ============================================================

async function enviarMensagem(nome, mensagem) {

    const resposta =
        await fetch(
            `${API_URL}/mensagens`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    nome: nome,
                    mensagem: mensagem
                })
            }
        );


    const dados =
        await resposta.json();


    if (!resposta.ok) {

        throw new Error(
            dados.detail ||
            "Não foi possível enviar a mensagem."
        );
    }


    return dados;
}


// ============================================================
// BOTÃO ENVIAR
// ============================================================

if (btnEnviarMensagem) {

    btnEnviarMensagem.addEventListener(
        "click",
        async () => {

            const nome =
                nomeVisitante.value.trim();

            const mensagem =
                mensagemPositiva.value.trim();


            // ------------------------------------------------
            // VALIDAR NOME
            // ------------------------------------------------

            if (!nome) {

                mensagemStatus.textContent =
                    "❌ Digite seu nome.";

                return;
            }


            if (nome.length < 2) {

                mensagemStatus.textContent =
                    "❌ Digite um nome válido.";

                return;
            }


            if (nome.length > 100) {

                mensagemStatus.textContent =
                    "❌ O nome é muito grande.";

                return;
            }


            // ------------------------------------------------
            // VALIDAR MENSAGEM
            // ------------------------------------------------

            if (mensagem.length > 500) {

                mensagemStatus.textContent =
                    "❌ A mensagem pode ter no máximo 500 caracteres.";

                return;
            }


            // ------------------------------------------------
            // SALVAR NOME NO NAVEGADOR
            // ------------------------------------------------

            salvarNome(nome);


            // ------------------------------------------------
            // ALTERAR BOTÃO
            // ------------------------------------------------

            btnEnviarMensagem.disabled =
                true;


            mensagemStatus.textContent =
                "🔄 Enviando...";


            try {

                const dados =
                    await enviarMensagem(
                        nome,
                        mensagem
                    );


                console.log(
                    "Resposta da API:",
                    dados
                );


                mensagemStatus.textContent =
                    "✅ Sua mensagem foi registrada!";


                // Limpar somente a mensagem

                mensagemPositiva.value =
                    "";


                // Atualizar lista

                await carregarMensagens();

            }


            catch (erro) {

                console.error(
                    "Erro:",
                    erro
                );


                mensagemStatus.textContent =
                    "❌ Não foi possível enviar. Verifique se a API está funcionando.";
            }


            finally {

                btnEnviarMensagem.disabled =
                    false;
            }

        }
    );
}


// ============================================================
// PERMITIR ENTER NO NOME
// ============================================================

if (nomeVisitante) {

    nomeVisitante.addEventListener(
        "keypress",
        (evento) => {

            if (evento.key === "Enter") {

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
        `
            <p class="carregando">
                🔄 Carregando mensagens...
            </p>
        `;


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


        /*
         * A API retorna:
         *
         * {
         *   sucesso: true,
         *   quantidade: 2,
         *   mensagens: [...]
         * }
         *
         * Então pegamos somente "mensagens".
         */

        const mensagens =
            Array.isArray(dados)
                ? dados
                : dados.mensagens || [];


        listaMensagens.innerHTML =
            "";


        // ----------------------------------------------------
        // NENHUMA MENSAGEM
        // ----------------------------------------------------

        if (mensagens.length === 0) {

            listaMensagens.innerHTML =
                `
                    <div class="sem-mensagens">

                        <h3>
                            👋 Seja o primeiro!
                        </h3>

                        <p>
                            Ainda não há mensagens.
                            Deixe a sua!
                        </p>

                    </div>
                `;

            return;
        }


        // ----------------------------------------------------
        // MOSTRAR MENSAGENS
        // ----------------------------------------------------

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
                        : "👋 Passou por aqui!";


                const data =
                    formatarData(
                        item.data_mensagem
                    );


                card.innerHTML =
                    `
                        <div class="mensagem-card__nome">

                            👤 ${nome}

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

    }


    catch (erro) {

        console.error(
            "Erro ao carregar mensagens:",
            erro
        );


        listaMensagens.innerHTML =
            `
                <div class="erro-mensagens">

                    <h3>
                        ❌ Erro ao carregar mensagens
                    </h3>

                    <p>
                        Verifique se a API Python
                        está funcionando.
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

    }

    catch (erro) {

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
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarNomeSalvo();

        carregarMensagens();

    }
);