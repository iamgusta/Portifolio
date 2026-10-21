// ============================================================
// MOTION.JS
// MOVIMENTO E EXPERIÊNCIA DINÂMICA DO PORTFÓLIO
// ============================================================



// ============================================================
// CONFIGURAÇÃO
// ============================================================

const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;



// ============================================================
// MOVIMENTO DA FOTO COM O MOUSE
// ============================================================

function iniciarFotoInterativa() {

    const stage =
        document.getElementById("hero-stage");


    const foto =
        document.getElementById("hero-photo");


    if (
        !stage ||
        !foto ||
        reduzirMovimento
    ) {

        return;

    }


    let alvoX = 0;
    let alvoY = 0;

    let atualX = 0;
    let atualY = 0;


    stage.addEventListener(
        "mousemove",
        (evento) => {

            const rect =
                stage.getBoundingClientRect();


            const x =
                (
                    evento.clientX -
                    rect.left
                )
                /
                rect.width;


            const y =
                (
                    evento.clientY -
                    rect.top
                )
                /
                rect.height;


            alvoX =
                (x - 0.5) * 10;


            alvoY =
                (y - 0.5) * -8;

        }
    );


    stage.addEventListener(
        "mouseleave",
        () => {

            alvoX = 0;

            alvoY = 0;

        }
    );


    function animar() {

        atualX +=
            (
                alvoX -
                atualX
            ) * 0.065;


        atualY +=
            (
                alvoY -
                atualY
            ) * 0.065;


        foto.style.setProperty(
            "--photo-y",
            `${atualX}deg`
        );


        foto.style.setProperty(
            "--photo-x",
            `${atualY}deg`
        );


        requestAnimationFrame(
            animar
        );

    }


    requestAnimationFrame(
        animar
    );

}



// ============================================================
// PARALLAX DAS PARTÍCULAS
// ============================================================

function iniciarParticulasHero() {

    const stage =
        document.getElementById("hero-stage");


    const particulas =
        document.querySelectorAll(
            ".hero-particle"
        );


    if (
        !stage ||
        !particulas.length ||
        reduzirMovimento
    ) {

        return;

    }


    stage.addEventListener(
        "mousemove",
        (evento) => {

            const rect =
                stage.getBoundingClientRect();


            const x =
                (
                    evento.clientX -
                    rect.left
                )
                /
                rect.width -
                0.5;


            const y =
                (
                    evento.clientY -
                    rect.top
                )
                /
                rect.height -
                0.5;


            particulas.forEach(
                (particula, indice) => {

                    const intensidade =
                        7 +
                        indice * 3;


                    particula.style.translate =
                        `
                            ${x * intensidade}px
                            ${y * intensidade}px
                        `;

                }
            );

        }
    );


    stage.addEventListener(
        "mouseleave",
        () => {

            particulas.forEach(
                (particula) => {

                    particula.style.translate =
                        "0px 0px";

                }
            );

        }
    );

}



// ============================================================
// GSAP
// ============================================================

function iniciarGSAP() {

    if (
        reduzirMovimento ||
        typeof window.gsap === "undefined" ||
        typeof window.ScrollTrigger === "undefined"
    ) {

        return;

    }


    const gsap =
        window.gsap;


    const ScrollTrigger =
        window.ScrollTrigger;


    gsap.registerPlugin(
        ScrollTrigger
    );



    // ========================================================
    // ENTRADA DA HOME
    // ========================================================

    const entrada =
        gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });


    entrada.from(
        ".marca",
        {
            y: -15,
            opacity: 0,
            duration: 0.7
        }
    );


    entrada.from(
        ".cabecalho__link",
        {
            y: -12,
            opacity: 0,
            duration: 0.55,
            stagger: 0.07
        },
        "-=0.45"
    );


    entrada.from(
        ".hero-motion-item",
        {
            y: 55,
            opacity: 0,
            duration: 1,
            stagger: 0.12
        },
        "-=0.2"
    );


    entrada.from(
        ".hero-photo",
        {
            x: 95,
            y: 25,
            opacity: 0,
            rotation: 4,
            scale: 0.92,
            duration: 1.3
        },
        "-=0.85"
    );


    entrada.from(
        ".hero-orbit",
        {
            opacity: 0,
            scale: 0.65,
            duration: 1.3,
            stagger: 0.1
        },
        "-=1.1"
    );


    entrada.from(
        ".dice-area--hero",
        {
            x: 70,
            y: 80,
            opacity: 0,
            rotation: 8,
            scale: 0.82,
            duration: 1
        },
        "-=0.8"
    );


    entrada.from(
        ".hero-particle",
        {
            opacity: 0,
            scale: 0,
            duration: 0.7,
            stagger: 0.08
        },
        "-=0.65"
    );



    // ========================================================
    // HOME SE MOVIMENTA CONFORME O SCROLL
    // ========================================================

    gsap.to(
        ".hero__conteudo",
        {

            y: -85,

            opacity: 0.28,

            scale: 0.97,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: 1.2

            }

        }
    );


    gsap.to(
        ".hero-photo",
        {

            y: -130,

            rotation: -4,

            scale: 0.91,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: 1.3

            }

        }
    );


    gsap.to(
        ".dice-area--hero",
        {

            y: 125,

            x: 35,

            rotation: 8,

            scale: 0.88,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: 1.1

            }

        }
    );


    gsap.to(
        ".hero-stage__word",
        {

            x: -100,

            opacity: 0.35,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: true

            }

        }
    );


    gsap.to(
        ".hero-orbit--1",
        {

            scale: 1.25,

            opacity: 0,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: true

            }

        }
    );


    gsap.to(
        ".hero-orbit--2",
        {

            scale: 0.75,

            opacity: 0,

            ease: "none",

            scrollTrigger: {

                trigger: "#inicio",

                start: "top top",

                end: "bottom top",

                scrub: true

            }

        }
    );



    // ========================================================
    // CABEÇALHOS DAS SEÇÕES
    // ========================================================

    document
        .querySelectorAll(
            ".secao__cabecalho"
        )
        .forEach(
            (cabecalho) => {

                const esquerda =
                    cabecalho.children[0];


                const direita =
                    cabecalho.children[1];


                if (esquerda) {

                    gsap.from(
                        esquerda,
                        {

                            x: -70,

                            opacity: 0,

                            duration: 1,

                            ease: "power3.out",

                            scrollTrigger: {

                                trigger: cabecalho,

                                start: "top 82%"

                            }

                        }
                    );

                }


                if (direita) {

                    gsap.from(
                        direita,
                        {

                            x: 70,

                            opacity: 0,

                            duration: 1,

                            ease: "power3.out",

                            scrollTrigger: {

                                trigger: cabecalho,

                                start: "top 82%"

                            }

                        }
                    );

                }

            }
        );



    // ========================================================
    // PROJETOS
    // ========================================================

    const projetos =
        gsap.utils.toArray(
            ".projeto"
        );


    projetos.forEach(
        (projeto, indice) => {

            const esquerda =
                indice % 2 === 0;


            gsap.from(
                projeto,
                {

                    x:
                        esquerda
                            ? -110
                            : 110,

                    y: 70,

                    rotation:
                        esquerda
                            ? -2.5
                            : 2.5,

                    scale: 0.94,

                    opacity: 0,

                    duration: 1.15,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger: projeto,

                        start: "top 87%",

                        end: "top 55%",

                        toggleActions:
                            "play none none reverse"

                    }

                }
            );


            const arquitetura =
                projeto.querySelector(
                    ".arquitetura"
                );


            if (arquitetura) {

                gsap.from(
                    arquitetura,
                    {

                        y: 25,

                        opacity: 0,

                        duration: 0.8,

                        delay: 0.12,

                        scrollTrigger: {

                            trigger: projeto,

                            start: "top 78%"

                        }

                    }
                );

            }

        }
    );



    // ========================================================
    // STACK
    // ========================================================

    const stackCards =
        gsap.utils.toArray(
            ".stack-card"
        );


    gsap.from(
        stackCards,
        {

            y: 90,

            opacity: 0,

            rotationX: 14,

            transformOrigin:
                "center bottom",

            stagger: 0.12,

            duration: 1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: ".stack-grid",

                start: "top 82%"

            }

        }
    );



    // ========================================================
    // SOBRE
    // ========================================================

    gsap.from(
        ".sobre__visual",
        {

            x: -100,

            rotation: -3,

            opacity: 0,

            duration: 1.1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: "#sobre",

                start: "top 78%"

            }

        }
    );


    gsap.from(
        ".sobre__conteudo",
        {

            x: 90,

            opacity: 0,

            duration: 1.1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: "#sobre",

                start: "top 78%"

            }

        }
    );


    gsap.to(
        ".sobre-data",
        {

            y: -45,

            ease: "none",

            scrollTrigger: {

                trigger: "#sobre",

                start: "top bottom",

                end: "bottom top",

                scrub: 1

            }

        }
    );



    // ========================================================
    // CONTATO
    // ========================================================

    gsap.from(
        ".contato-novo__visual",
        {

            x: -90,

            y: 40,

            opacity: 0,

            duration: 1.1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: "#contato",

                start: "top 80%"

            }

        }
    );


    gsap.from(
        ".contato-novo__conteudo",
        {

            x: 100,

            opacity: 0,

            duration: 1.1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: "#contato",

                start: "top 80%"

            }

        }
    );


    gsap.from(
        ".contato-card",
        {

            x: 55,

            opacity: 0,

            stagger: 0.12,

            duration: 0.75,

            ease: "power2.out",

            scrollTrigger: {

                trigger: ".contato-opcoes",

                start: "top 85%"

            }

        }
    );



    // ========================================================
    // RODAPÉ
    // ========================================================

    gsap.from(
        ".rodape",
        {

            y: 30,

            opacity: 0,

            duration: 0.8,

            scrollTrigger: {

                trigger: ".rodape",

                start: "top 94%"

            }

        }
    );


    ScrollTrigger.refresh();

}



// ============================================================
// TILT DOS PROJETOS
// ============================================================

function iniciarTiltProjetos() {

    if (reduzirMovimento) {

        return;

    }


    const projetos =
        document.querySelectorAll(
            ".projeto"
        );


    projetos.forEach(
        (projeto) => {


            projeto.addEventListener(
                "mousemove",
                (evento) => {

                    const rect =
                        projeto.getBoundingClientRect();


                    const x =
                        (
                            evento.clientX -
                            rect.left
                        )
                        /
                        rect.width;


                    const y =
                        (
                            evento.clientY -
                            rect.top
                        )
                        /
                        rect.height;


                    const rotateY =
                        (
                            x - 0.5
                        ) * 2.7;


                    const rotateX =
                        (
                            y - 0.5
                        ) * -2.7;


                    projeto.style.transform =
                        `
                            perspective(1100px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            translateY(-5px)
                        `;

                }
            );


            projeto.addEventListener(
                "mouseleave",
                () => {

                    projeto.style.transform =
                        "";

                }
            );

        }
    );

}



// ============================================================
// MOVIMENTO SUAVE NOS CARDS DA STACK
// ============================================================

function iniciarTiltStack() {

    if (reduzirMovimento) {

        return;

    }


    const cards =
        document.querySelectorAll(
            ".stack-card"
        );


    cards.forEach(
        (card) => {


            card.addEventListener(
                "mousemove",
                (evento) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (
                            evento.clientX -
                            rect.left
                        )
                        /
                        rect.width;


                    const y =
                        (
                            evento.clientY -
                            rect.top
                        )
                        /
                        rect.height;


                    const rotateY =
                        (
                            x - 0.5
                        ) * 4;


                    const rotateX =
                        (
                            y - 0.5
                        ) * -4;


                    card.style.transform =
                        `
                            perspective(900px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            translateY(-5px)
                        `;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    if (
                        !card.classList.contains(
                            "stack-card--ativo"
                        )
                    ) {

                        card.style.transform =
                            "";

                    }

                }
            );

        }
    );

}



// ============================================================
// MOVIMENTO DOS BOTÕES
// ============================================================

function iniciarBotoesMagneticos() {

    if (reduzirMovimento) {

        return;

    }


    const botoes =
        document.querySelectorAll(
            ".hero__acoes .botao"
        );


    botoes.forEach(
        (botao) => {


            botao.addEventListener(
                "mousemove",
                (evento) => {

                    const rect =
                        botao.getBoundingClientRect();


                    const x =
                        evento.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        evento.clientY -
                        rect.top -
                        rect.height / 2;


                    botao.style.transform =
                        `
                            translate(
                                ${x * 0.08}px,
                                ${y * 0.10}px
                            )
                        `;

                }
            );


            botao.addEventListener(
                "mouseleave",
                () => {

                    botao.style.transform =
                        "";

                }
            );

        }
    );

}



// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarFotoInterativa();

        iniciarParticulasHero();

        iniciarGSAP();

        iniciarTiltProjetos();

        iniciarTiltStack();

        iniciarBotoesMagneticos();

    }
);