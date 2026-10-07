// ============================================================
// ANIMAÇÕES DAS SEÇÕES
// ============================================================

function iniciarAnimacoes() {
    const itens = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        itens.forEach((item) => {
            item.classList.add("visivel");
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");
                    observer.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    itens.forEach((item) => {
        observer.observe(item);
    });
}

// ============================================================
// PROFISSÕES DISPONÍVEIS
// ============================================================

const carreiras = [
    {
        letra: "A",
        nome: "Engenheiro de Dados"
    },
    {
        letra: "B",
        nome: "Analista de Business Intelligence"
    },
    {
        letra: "C",
        nome: "Engenheiro de Inteligência Artificial"
    },
    {
        letra: "D",
        nome: "Especialista em Governança de Dados"
    }
];

// ============================================================
// DESTACAR PROFISSÃO
// ============================================================

let timeoutCarreira;

function destacarCarreira(letra) {
    const stack = document.getElementById("stack");
    const cards = document.querySelectorAll(".stack-card");

    if (!stack || !cards.length) {
        return;
    }

    clearTimeout(timeoutCarreira);

    cards.forEach((card) => {
        card.classList.remove("stack-card--ativo");
    });

    const selecionado = document.querySelector(
        `.stack-card[data-career="${letra}"]`
    );

    if (selecionado) {
        selecionado.classList.add("stack-card--ativo");
    }

    setTimeout(() => {
        stack.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 550);

    timeoutCarreira = setTimeout(() => {
        if (selecionado) {
            selecionado.classList.remove("stack-card--ativo");
        }
    }, 6000);
}

// ============================================================
// DATA DICE
// ============================================================

function iniciarDataDice() {
    const dice = document.getElementById("dice");
    const scene = document.getElementById("dice-scene");
    const botao = document.getElementById("dice-roll");
    const resultado = document.getElementById("dice-result");

    if (!dice || !scene) {
        return;
    }

    const faces = [
        { x: 0, y: 0 },
        { x: -90, y: 0 },
        { x: 0, y: -90 },
        { x: 0, y: 90 },
        { x: 90, y: 0 },
        { x: 0, y: 180 }
    ];

    let mouseX = 0;
    let mouseY = 0;
    let baseX = -18;
    let baseY = 32;
    let visualX = baseX;
    let visualY = baseY;
    let inicioX = baseX;
    let inicioY = baseY;
    let destinoX = baseX;
    let destinoY = baseY;
    let rolando = false;
    let inicioRolagem = 0;
    const duracaoRolagem = 1350;
    let tempoFlutuacao = 0;

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function normalizarAngulo(angulo) {
        return ((angulo % 360) + 360) % 360;
    }

    function calcularDestino(atual, desejado, giros) {
        const atualNormalizado = normalizarAngulo(atual);
        const desejadoNormalizado = normalizarAngulo(desejado);

        let diferenca = desejadoNormalizado - atualNormalizado;

        if (diferenca < 0) {
            diferenca += 360;
        }

        return atual + giros * 360 + diferenca;
    }

    function easeOutQuart(progresso) {
        return 1 - Math.pow(1 - progresso, 4);
    }

    function rolarDado() {
        if (rolando) {
            return;
        }

        const faceVisual =
            faces[Math.floor(Math.random() * faces.length)];

        const carreira =
            carreiras[Math.floor(Math.random() * carreiras.length)];

        rolando = true;

        if (botao) {
            botao.disabled = true;
            botao.textContent = "Rolando...";
        }

        if (resultado) {
            resultado.textContent = "...";
        }

        inicioX = visualX;
        inicioY = visualY;

        destinoX = calcularDestino(inicioX, faceVisual.x, 2);
        destinoY = calcularDestino(inicioY, faceVisual.y, 3);

        inicioRolagem = performance.now();

        setTimeout(() => {
            baseX = faceVisual.x;
            baseY = faceVisual.y;
            visualX = baseX;
            visualY = baseY;
            rolando = false;

            if (resultado) {
                resultado.textContent = `${carreira.letra} — ${carreira.nome}`;
            }

            if (botao) {
                botao.disabled = false;
                botao.textContent = "Rolar dado ↻";
            }

            destacarCarreira(carreira.letra);
        }, duracaoRolagem);
    }

    scene.addEventListener("mousemove", (evento) => {
        if (rolando) {
            return;
        }

        const area = scene.getBoundingClientRect();

        const x = (evento.clientX - area.left) / area.width;
        const y = (evento.clientY - area.top) / area.height;

        mouseX = (x - 0.5) * 14;
        mouseY = (y - 0.5) * -12;
    });

    scene.addEventListener("mouseleave", () => {
        mouseX = 0;
        mouseY = 0;
    });

    scene.addEventListener("click", rolarDado);

    if (botao) {
        botao.addEventListener("click", rolarDado);
    }

    if (reduzirMovimento) {
        dice.style.transform = `rotateX(${baseX}deg) rotateY(${baseY}deg)`;
        return;
    }

    function animar(agora) {
        tempoFlutuacao += 0.012;

        if (rolando) {
            const progresso = Math.min(
                (agora - inicioRolagem) / duracaoRolagem,
                1
            );

            const suave = easeOutQuart(progresso);

            visualX = inicioX + (destinoX - inicioX) * suave;
            visualY = inicioY + (destinoY - inicioY) * suave;

            dice.style.transform = `
                rotateX(${visualX}deg)
                rotateY(${visualY}deg)
                rotateZ(${Math.sin(progresso * Math.PI) * 14}deg)
            `;
        } else {
            const flutuarX = Math.sin(tempoFlutuacao) * 1.5;
            const flutuarY = Math.cos(tempoFlutuacao * 0.8) * 1.8;

            visualX = baseX + mouseY + flutuarX;
            visualY = baseY + mouseX + flutuarY;

            dice.style.transform = `
                rotateX(${visualX}deg)
                rotateY(${visualY}deg)
                rotateZ(${Math.sin(tempoFlutuacao * 0.45) * 1.2}deg)
            `;
        }

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
}

// ============================================================
// DADOS DOS PROJETOS
// ============================================================

const projetosDetalhes = {
    realtime: {
        categoria: "DATA ENGINEERING",
        titulo: "Real-Time Data Platform",
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
        github: "https://github.com/iamgusta/real-time-data-platform"
    },

    ecommerce: {
        categoria: "DATA ENGINEERING",
        titulo: "Plataforma de Dados para E-commerce",
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
        github: "https://github.com/iamgusta/Plataforma-dados-e-commerce"
    },

    vendas: {
        categoria: "DATA ENGINEERING",
        titulo: "Pipeline de Vendas",
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
        github: "https://github.com/iamgusta/Pipeline-de-vendas"
    }
};

// ============================================================
// MODAIS DOS PROJETOS
// ============================================================

function iniciarModais() {
    const modal = document.getElementById("project-modal");

    if (!modal) {
        return;
    }

    const titulo = document.getElementById("modal-title");
    const categoria = document.getElementById("modal-category");
    const descricao = document.getElementById("modal-description");
    const fluxo = document.getElementById("modal-flow");
    const tags = document.getElementById("modal-tags");
    const github = document.getElementById("modal-github");

    function abrirModal(projeto) {
        const dados = projetosDetalhes[projeto];

        if (!dados) {
            return;
        }

        categoria.textContent = dados.categoria;
        titulo.textContent = dados.titulo;
        descricao.textContent = dados.descricao;

        fluxo.innerHTML = "";

        dados.fluxo.forEach((etapa, indice) => {
            const item = document.createElement("span");
            item.textContent = etapa;
            fluxo.appendChild(item);

            if (indice < dados.fluxo.length - 1) {
                const seta = document.createElement("strong");
                seta.textContent = "→";
                fluxo.appendChild(seta);
            }
        });

        tags.innerHTML = "";

        dados.tecnologias.forEach((tecnologia) => {
            const item = document.createElement("span");
            item.textContent = tecnologia;
            tags.appendChild(item);
        });

        github.href = dados.github;

        modal.classList.add("aberto");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-aberto");
    }

    function fecharModal() {
        modal.classList.remove("aberto");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-aberto");
    }

    document.querySelectorAll("[data-project]").forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirModal(botao.dataset.project);
        });
    });

    modal.querySelectorAll("[data-close-modal]").forEach((elemento) => {
        elemento.addEventListener("click", fecharModal);
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharModal();
        }
    });
}

// ============================================================
// MENU ATIVO
// ============================================================

function iniciarMenuAtivo() {
    const links = document.querySelectorAll(".cabecalho__link[href^='#']");
    const secoes = document.querySelectorAll("main section[id]");

    if (!links.length || !secoes.length || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) {
                    return;
                }

                links.forEach((link) => {
                    const ativo =
                        link.getAttribute("href") === `#${entrada.target.id}`;

                    link.classList.toggle("cabecalho__link--ativo", ativo);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    secoes.forEach((secao) => {
        observer.observe(secao);
    });
}

// ============================================================
// CONTATO
// ============================================================

function iniciarContato() {
    const botao = document.getElementById("copiar-email");
    const feedback = document.getElementById("contato-feedback");

    if (!botao) {
        return;
    }

    const email = "gustavolopesti@outlook.com";

    botao.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);

            botao.textContent = "E-mail copiado ✓";

            if (feedback) {
                feedback.textContent = "Pronto para colar.";
                feedback.classList.add("visivel");
            }

            setTimeout(() => {
                botao.textContent = "Copiar e-mail";

                if (feedback) {
                    feedback.classList.remove("visivel");
                }
            }, 2600);
        } catch (erro) {
            if (feedback) {
                feedback.textContent = email;
                feedback.classList.add("visivel");
            }
        }
    });
}

// ============================================================
// INTERAÇÕES DAS ARTES DE DADOS
// ============================================================

function iniciarVisuaisDados() {
    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduzirMovimento) {
        return;
    }

    const sobre = document.getElementById("sobre-data");
    const contato = document.getElementById("contato-data");

    function aplicarParallax(elemento, tipo) {
        if (!elemento) {
            return;
        }

        elemento.addEventListener("mousemove", (evento) => {
            const rect = elemento.getBoundingClientRect();

            const eixoX = (evento.clientX - rect.left) / rect.width - 0.5;
            const eixoY = (evento.clientY - rect.top) / rect.height - 0.5;

            if (tipo === "sobre") {
                elemento.style.setProperty("--move-x", `${eixoX * 20}px`);
                elemento.style.setProperty("--move-y", `${eixoY * 20}px`);
            }

            if (tipo === "contato") {
                elemento.style.setProperty("--move-x", `${eixoX * 24}px`);
                elemento.style.setProperty("--move-y", `${eixoY * 24}px`);
                elemento.style.setProperty("--cube-x", `${eixoY * -14}deg`);
                elemento.style.setProperty("--cube-y", `${eixoX * 18}deg`);
            }
        });

        elemento.addEventListener("mouseleave", () => {
            elemento.style.setProperty("--move-x", "0px");
            elemento.style.setProperty("--move-y", "0px");

            if (tipo === "contato") {
                elemento.style.setProperty("--cube-x", "0deg");
                elemento.style.setProperty("--cube-y", "0deg");
            }
        });
    }

    aplicarParallax(sobre, "sobre");
    aplicarParallax(contato, "contato");
}

// ============================================================
// INICIAR PORTFÓLIO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    iniciarAnimacoes();
    iniciarDataDice();
    iniciarModais();
    iniciarMenuAtivo();
    iniciarContato();
    iniciarVisuaisDados();

    const anoAtual = document.getElementById("ano-atual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }
});