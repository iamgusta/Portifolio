// ============================================================
// ABOUT.JS
// Interações da página Sobre
// ============================================================



// ============================================================
// ANIMAÇÃO DAS SEÇÕES AO ENTRAR NA TELA
// ============================================================

function iniciarRevealAbout() {

    const elementos =
        document.querySelectorAll(
            ".reveal-about"
        );


    if (
        !elementos.length
    ) {

        return;

    }


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elementos.forEach(
            (elemento) => {

                elemento.classList.add(
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
                threshold:
                    0.10
            }

        );


    elementos.forEach(
        (elemento) => {

            observer.observe(
                elemento
            );

        }
    );

}



// ============================================================
// CUBO DE DADOS DO HERO
// ============================================================

function iniciarDataBlock() {

    const area =
        document.getElementById(
            "data-block"
        );


    const cube =
        document.getElementById(
            "data-block-cube"
        );


    if (
        !area ||
        !cube
    ) {

        return;

    }


    const reduzirMovimento =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reduzirMovimento
    ) {

        return;

    }


    let alvoX =
        0;


    let alvoY =
        0;


    let atualX =
        0;


    let atualY =
        0;


    let tempo =
        0;



    // ========================================================
    // MOUSE
    // ========================================================

    area.addEventListener(
        "mousemove",
        (evento) => {

            const rect =
                area.getBoundingClientRect();


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
                (
                    x - 0.5
                ) * 24;


            alvoY =
                (
                    y - 0.5
                ) * -18;

        }
    );



    area.addEventListener(
        "mouseleave",
        () => {

            alvoX =
                0;


            alvoY =
                0;

        }
    );



    // ========================================================
    // CLIQUE
    // Faz o cubo dar um pequeno impacto
    // ========================================================

    area.addEventListener(
        "click",
        () => {

            area.classList.remove(
                "data-block--impacto"
            );


            void area.offsetWidth;


            area.classList.add(
                "data-block--impacto"
            );


            setTimeout(
                () => {

                    area.classList.remove(
                        "data-block--impacto"
                    );

                },

                550
            );

        }
    );



    // ========================================================
    // LOOP
    // ========================================================

    function animar() {

        tempo +=
            0.015;


        atualX +=
            (
                alvoX -
                atualX
            ) * 0.07;


        atualY +=
            (
                alvoY -
                atualY
            ) * 0.07;


        const flutuacaoX =
            Math.sin(
                tempo
            ) * 1.4;


        const flutuacaoY =
            Math.cos(
                tempo * 0.8
            ) * 1.7;


        area.style.setProperty(
            "--mouse-x",
            `${atualX + flutuacaoX}deg`
        );


        area.style.setProperty(
            "--mouse-y",
            `${atualY + flutuacaoY}deg`
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
// CARDS COM EFEITO 3D
// ============================================================

function iniciarCards3D() {

    const cards =
        document.querySelectorAll(
            ".interaction-card"
        );


    const reduzirMovimento =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reduzirMovimento
    ) {

        return;

    }


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


                    card.style.setProperty(
                        "--rotate-x",
                        `${rotateX}deg`
                    );


                    card.style.setProperty(
                        "--rotate-y",
                        `${rotateY}deg`
                    );

                }
            );



            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.setProperty(
                        "--rotate-x",
                        "0deg"
                    );


                    card.style.setProperty(
                        "--rotate-y",
                        "0deg"
                    );

                }
            );


        }
    );

}



// ============================================================
// CUBO DATA CORE
// ============================================================

function iniciarDataCore() {

    const scene =
        document.getElementById(
            "core-scene"
        );


    const cube =
        document.getElementById(
            "outer-cube"
        );


    if (
        !scene ||
        !cube
    ) {

        return;

    }


    const reduzirMovimento =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    let alvoX =
        -20;


    let alvoY =
        35;


    let atualX =
        alvoX;


    let atualY =
        alvoY;


    let mouseAtivo =
        false;


    let tempo =
        0;



    // ========================================================
    // MOUSE
    // ========================================================

    scene.addEventListener(
        "mousemove",
        (evento) => {

            if (
                reduzirMovimento
            ) {

                return;

            }


            const rect =
                scene.getBoundingClientRect();


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


            alvoY =
                35 +
                (
                    x - 0.5
                ) * 38;


            alvoX =
                -20 +
                (
                    y - 0.5
                ) * -28;


            mouseAtivo =
                true;

        }
    );



    scene.addEventListener(
        "mouseleave",
        () => {

            alvoX =
                -20;


            alvoY =
                35;


            mouseAtivo =
                false;

        }
    );



    // ========================================================
    // CLIQUE
    // ========================================================

    scene.addEventListener(
        "click",
        () => {

            cube.animate(

                [

                    {
                        transform:
                            `rotateX(${atualX}deg) rotateY(${atualY}deg) scale(1)`
                    },

                    {
                        transform:
                            `rotateX(${atualX + 15}deg) rotateY(${atualY + 40}deg) scale(1.06)`
                    },

                    {
                        transform:
                            `rotateX(${atualX}deg) rotateY(${atualY}deg) scale(1)`
                    }

                ],

                {
                    duration:
                        700,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"
                }

            );

        }
    );



    // ========================================================
    // LOOP
    // ========================================================

    function animar() {

        if (
            reduzirMovimento
        ) {

            cube.style.transform =
                "rotateX(-20deg) rotateY(35deg)";


            return;

        }


        tempo +=
            0.006;


        if (
            !mouseAtivo
        ) {

            alvoY =
                35 +
                Math.sin(
                    tempo
                ) * 9;


            alvoX =
                -20 +
                Math.cos(
                    tempo * 0.8
                ) * 5;

        }


        atualX +=
            (
                alvoX -
                atualX
            ) * 0.055;


        atualY +=
            (
                alvoY -
                atualY
            ) * 0.055;


        cube.style.transform =
            `
                rotateX(${atualX}deg)
                rotateY(${atualY}deg)
            `;


        requestAnimationFrame(
            animar
        );

    }


    requestAnimationFrame(
        animar
    );

}



// ============================================================
// STACK DO FOCO ATUAL
// ============================================================

function iniciarStackAtual() {

    const tecnologias =
        document.querySelectorAll(
            ".foco-atual__stack [data-tech]"
        );


    const resultado =
        document.getElementById(
            "core-result"
        );


    if (
        !tecnologias.length
    ) {

        return;

    }


    tecnologias.forEach(
        (item) => {


            item.addEventListener(
                "mouseenter",
                () => {

                    tecnologias.forEach(
                        (tecnologia) => {

                            tecnologia.classList.remove(
                                "ativo"
                            );

                        }
                    );


                    item.classList.add(
                        "ativo"
                    );


                    if (
                        resultado
                    ) {

                        resultado.textContent =
                            item.dataset.tech;

                    }

                }
            );



            item.addEventListener(
                "mouseleave",
                () => {

                    item.classList.remove(
                        "ativo"
                    );


                    if (
                        resultado
                    ) {

                        resultado.textContent =
                            "DATA ENGINEERING";

                    }

                }
            );



            item.addEventListener(
                "click",
                () => {

                    tecnologias.forEach(
                        (tecnologia) => {

                            tecnologia.classList.remove(
                                "ativo"
                            );

                        }
                    );


                    item.classList.add(
                        "ativo"
                    );


                    if (
                        resultado
                    ) {

                        resultado.textContent =
                            item.dataset.tech;

                    }

                }
            );


        }
    );

}



// ============================================================
// INTERAÇÃO NOS BOTÕES
// ============================================================

function iniciarBotoesAbout() {

    const botoes =
        document.querySelectorAll(
            "a, button"
        );


    botoes.forEach(
        (botao) => {


            botao.addEventListener(
                "pointerdown",
                () => {

                    botao.animate(

                        [

                            {
                                transform:
                                    "scale(1)"
                            },

                            {
                                transform:
                                    "scale(0.97)"
                            },

                            {
                                transform:
                                    "scale(1)"
                            }

                        ],

                        {

                            duration:
                                220,

                            easing:
                                "ease-out"

                        }

                    );

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

        iniciarRevealAbout();

        iniciarDataBlock();

        iniciarCards3D();

        iniciarDataCore();

        iniciarStackAtual();

        iniciarBotoesAbout();

    }
);