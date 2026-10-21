// ============================================================
// PORTFÓLIO V3
// DATA JOURNEY
// ============================================================


const reduzirMovimento =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;



// ============================================================
// FUNDO THREE.JS
// ============================================================

function iniciarWebGL() {

    const container =
        document.getElementById(
            "webgl-bg"
        );


    if (
        !container ||
        typeof THREE === "undefined" ||
        reduzirMovimento
    ) {

        return;

    }


    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(
            60,
            window.innerWidth /
            window.innerHeight,
            0.1,
            300
        );


    camera.position.z =
        30;


    const renderer =
        new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    container.appendChild(
        renderer.domElement
    );


    const quantidade =
        window.innerWidth < 700
            ? 650
            : 1500;


    const positions =
        new Float32Array(
            quantidade * 3
        );


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        positions[
            i * 3
        ] =
            (
                Math.random() -
                0.5
            ) * 95;


        positions[
            i * 3 + 1
        ] =
            (
                Math.random() -
                0.5
            ) * 60;


        positions[
            i * 3 + 2
        ] =
            Math.random() *
            -120;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color:
                new THREE.Color(
                    "#4f8cff"
                ),

            size:
                window.innerWidth < 700
                    ? 0.12
                    : 0.1,

            transparent: true,

            opacity: 0.68,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        particles
    );


    let mouseX = 0;
    let mouseY = 0;

    let currentMouseX = 0;
    let currentMouseY = 0;

    let scrollSpeed =
        0.035;

    let lastScroll =
        window.scrollY;


    window.addEventListener(
        "pointermove",
        (event) => {

            mouseX =
                (
                    event.clientX /
                    window.innerWidth -
                    0.5
                );


            mouseY =
                (
                    event.clientY /
                    window.innerHeight -
                    0.5
                );

        }
    );


    window.addEventListener(
        "scroll",
        () => {

            const atual =
                window.scrollY;


            const delta =
                Math.abs(
                    atual -
                    lastScroll
                );


            scrollSpeed =
                Math.min(
                    0.22,
                    0.035 +
                    delta * 0.003
                );


            lastScroll =
                atual;

        },
        {
            passive: true
        }
    );


    const sections =
        document.querySelectorAll(
            "[data-particle]"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            const color =
                                entry.target
                                    .dataset
                                    .particle;


                            if (
                                typeof gsap !==
                                "undefined"
                            ) {

                                const target =
                                    new THREE.Color(
                                        color
                                    );


                                gsap.to(
                                    material.color,
                                    {
                                        r:
                                            target.r,

                                        g:
                                            target.g,

                                        b:
                                            target.b,

                                        duration:
                                            1.4
                                    }
                                );

                            }

                        }

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -35% 0px"
            }
        );


    sections.forEach(
        (section) => {

            observer.observe(
                section
            );

        }
    );


    function render() {

        currentMouseX +=
            (
                mouseX -
                currentMouseX
            ) * 0.025;


        currentMouseY +=
            (
                mouseY -
                currentMouseY
            ) * 0.025;


        particles.rotation.y +=
            currentMouseX *
            0.0007;


        particles.rotation.x +=
            currentMouseY *
            0.0003;


        const array =
            geometry
                .attributes
                .position
                .array;


        for (
            let i = 0;
            i < quantidade;
            i++
        ) {

            const index =
                i * 3 + 2;


            array[index] +=
                scrollSpeed;


            if (
                array[index] >
                20
            ) {

                array[index] =
                    -120;

            }

        }


        geometry
            .attributes
            .position
            .needsUpdate =
            true;


        scrollSpeed +=
            (
                0.035 -
                scrollSpeed
            ) * 0.03;


        renderer.render(
            scene,
            camera
        );


        requestAnimationFrame(
            render
        );

    }


    render();


    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        }
    );

}



// ============================================================
// CURSOR
// ============================================================

function iniciarCursor() {

    const ring =
        document.getElementById(
            "cursor-ring"
        );


    const dot =
        document.getElementById(
            "cursor-dot"
        );


    if (
        !ring ||
        !dot ||
        reduzirMovimento ||
        window.matchMedia(
            "(hover: none)"
        ).matches
    ) {

        return;

    }


    document.body.classList.add(
        "cursor-active"
    );


    let alvoX =
        window.innerWidth / 2;

    let alvoY =
        window.innerHeight / 2;


    let ringX =
        alvoX;

    let ringY =
        alvoY;


    window.addEventListener(
        "pointermove",
        (event) => {

            alvoX =
                event.clientX;


            alvoY =
                event.clientY;


            dot.style.left =
                `${alvoX}px`;


            dot.style.top =
                `${alvoY}px`;

        }
    );


    document
        .querySelectorAll(
            "a, button, .tech-node, .dice-scene"
        )
        .forEach(
            (element) => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        document.body
                            .classList
                            .add(
                                "cursor-hover"
                            );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        document.body
                            .classList
                            .remove(
                                "cursor-hover"
                            );

                    }
                );

            }
        );


    function render() {

        ringX +=
            (
                alvoX -
                ringX
            ) * 0.16;


        ringY +=
            (
                alvoY -
                ringY
            ) * 0.16;


        ring.style.left =
            `${ringX}px`;


        ring.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            render
        );

    }


    render();

}



// ============================================================
// FOTO COM PROFUNDIDADE
// ============================================================

function iniciarFoto() {

    const area =
        document.getElementById(
            "hero-portrait"
        );


    if (
        !area ||
        reduzirMovimento
    ) {

        return;

    }


    const layers =
        area.querySelectorAll(
            "[data-depth]"
        );


    area.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                area.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                rect.width -
                0.5;


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                rect.height -
                0.5;


            layers.forEach(
                (layer) => {

                    const depth =
                        Number(
                            layer.dataset.depth
                        ) || 1;


                    layer.style.translate =
                        `
                            ${x * 18 * depth}px
                            ${y * 14 * depth}px
                        `;

                }
            );

        }
    );


    area.addEventListener(
        "pointerleave",
        () => {

            layers.forEach(
                (layer) => {

                    layer.style.translate =
                        "0px 0px";

                }
            );

        }
    );

}



// ============================================================
// TECH UNIVERSE
// ============================================================

const techInfo = {

    "DATA ENGINEERING":
        "Conectando ingestão, processamento, armazenamento e entrega de dados.",

    "PYTHON":
        "Automação, ETL, processamento de dados e desenvolvimento de pipelines.",

    "SQL":
        "Consulta, transformação, modelagem e análise de dados relacionais.",

    "AIRFLOW":
        "Orquestração e automação de pipelines de dados.",

    "KAFKA":
        "Streaming de eventos e processamento de dados em tempo real.",

    "POSTGRESQL":
        "Armazenamento relacional, modelagem e consultas SQL.",

    "DOCKER":
        "Ambientes reproduzíveis e isolamento de serviços.",

    "POWER BI":
        "Visualização, indicadores e análise de dados.",

    "FASTAPI":
        "APIs para disponibilização e integração de dados.",

    "ETL":
        "Extração, transformação e carga de dados.",

    "MYSQL":
        "Banco de dados relacional e desenvolvimento SQL."

};



function iniciarUniverso() {

    const space =
        document.getElementById(
            "tech-space"
        );


    const nodes =
        document.querySelectorAll(
            ".tech-node, .tech-core"
        );


    const name =
        document.getElementById(
            "tech-output-name"
        );


    const description =
        document.getElementById(
            "tech-output-description"
        );


    if (
        !space ||
        !nodes.length
    ) {

        return;

    }


    function selecionar(
        node
    ) {

        nodes.forEach(
            (item) => {

                item.classList.remove(
                    "active"
                );

            }
        );


        node.classList.add(
            "active"
        );


        const tech =
            node.dataset.tech;


        if (
            name
        ) {

            name.textContent =
                tech;

        }


        if (
            description
        ) {

            description.textContent =
                techInfo[tech] ||
                "";

        }

    }


    nodes.forEach(
        (node) => {

            node.addEventListener(
                "mouseenter",
                () => {

                    selecionar(
                        node
                    );

                }
            );


            node.addEventListener(
                "focus",
                () => {

                    selecionar(
                        node
                    );

                }
            );


            node.addEventListener(
                "click",
                () => {

                    selecionar(
                        node
                    );

                }
            );

        }
    );


    if (
        reduzirMovimento
    ) {

        return;

    }


    const floatingNodes =
        space.querySelectorAll(
            ".tech-node"
        );


    space.addEventListener(
        "pointermove",
        (event) => {

            floatingNodes.forEach(
                (node) => {

                    const rect =
                        node.getBoundingClientRect();


                    const centerX =
                        rect.left +
                        rect.width / 2;


                    const centerY =
                        rect.top +
                        rect.height / 2;


                    const dx =
                        centerX -
                        event.clientX;


                    const dy =
                        centerY -
                        event.clientY;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    const limite =
                        150;


                    if (
                        distance <
                        limite
                    ) {

                        const force =
                            (
                                limite -
                                distance
                            )
                            /
                            limite;


                        const angle =
                            Math.atan2(
                                dy,
                                dx
                            );


                        const offsetX =
                            Math.cos(
                                angle
                            ) *
                            force *
                            28;


                        const offsetY =
                            Math.sin(
                                angle
                            ) *
                            force *
                            28;


                        node.style.transform =
                            `
                                translate(
                                    ${offsetX}px,
                                    ${offsetY}px
                                )
                            `;

                    } else {

                        node.style.transform =
                            "";

                    }

                }
            );

        }
    );


    space.addEventListener(
        "pointerleave",
        () => {

            floatingNodes.forEach(
                (node) => {

                    node.style.transform =
                        "";

                }
            );

        }
    );

}



// ============================================================
// DADO 3D
// ============================================================

const carreiras = [

    {
        letra:
            "A",

        nome:
            "Engenheiro de Dados"
    },

    {
        letra:
            "B",

        nome:
            "Analista de BI"
    },

    {
        letra:
            "C",

        nome:
            "Engenheiro de IA"
    },

    {
        letra:
            "D",

        nome:
            "Governança de Dados"
    }

];



function iniciarDado() {

    const dice =
        document.getElementById(
            "dice"
        );


    const world =
        document.getElementById(
            "dice-world"
        );


    const button =
        document.getElementById(
            "dice-roll"
        );


    const result =
        document.getElementById(
            "career-result"
        );


    const options =
        document.querySelectorAll(
            ".career-option"
        );


    if (
        !dice ||
        !world ||
        !button ||
        !result
    ) {

        return;

    }


    const state = {
        rx: -20,
        ry: 30
    };


    let dragging =
        false;


    let startX =
        0;


    let startY =
        0;


    let initialX =
        state.rx;


    let initialY =
        state.ry;


    function render() {

        dice.style.transform =
            `
                rotateX(${state.rx}deg)
                rotateY(${state.ry}deg)
            `;

    }


    render();


    world.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.target
                    .closest(
                        "#dice-roll"
                    )
            ) {

                return;

            }


            dragging =
                true;


            startX =
                event.clientX;


            startY =
                event.clientY;


            initialX =
                state.rx;


            initialY =
                state.ry;


            world.setPointerCapture?.(
                event.pointerId
            );

        }
    );


    world.addEventListener(
        "pointermove",
        (event) => {

            if (
                !dragging
            ) {

                return;

            }


            state.ry =
                initialY +
                (
                    event.clientX -
                    startX
                ) * 0.6;


            state.rx =
                initialX -
                (
                    event.clientY -
                    startY
                ) * 0.6;


            render();

        }
    );


    window.addEventListener(
        "pointerup",
        () => {

            dragging =
                false;

        }
    );


    function rolar() {

        const carreira =
            carreiras[
                Math.floor(
                    Math.random() *
                    carreiras.length
                )
            ];


        options.forEach(
            (option) => {

                option.classList.remove(
                    "active"
                );

            }
        );


        result
            .querySelector(
                "strong"
            )
            .textContent =
            "...";


        button.disabled =
            true;


        button.textContent =
            "Rolando...";


        const targetX =
            state.rx +
            720 +
            Math.random() *
            360;


        const targetY =
            state.ry +
            1080 +
            Math.random() *
            360;


        if (
            typeof gsap !==
            "undefined"
        ) {

            gsap.to(
                state,
                {
                    rx:
                        targetX,

                    ry:
                        targetY,

                    duration:
                        1.35,

                    ease:
                        "power4.out",

                    onUpdate:
                        render,

                    onComplete:
                        () => {

                            finalizar(
                                carreira
                            );

                        }
                }
            );

        } else {

            state.rx =
                targetX;


            state.ry =
                targetY;


            render();


            setTimeout(
                () => {

                    finalizar(
                        carreira
                    );

                },
                1400
            );

        }

    }


    function finalizar(
        carreira
    ) {

        result
            .querySelector(
                "strong"
            )
            .textContent =
            `${carreira.letra} — ${carreira.nome}`;


        const selected =
            document.querySelector(
                `.career-option[data-career="${carreira.letra}"]`
            );


        if (
            selected
        ) {

            selected.classList.add(
                "active"
            );

        }


        document
            .querySelector(
                ".career-options"
            )
            ?.classList.add(
                "has-selection"
            );


        button.disabled =
            false;


        button.textContent =
            "Rolar novamente";

    }


    button.addEventListener(
        "click",
        rolar
    );


    dice.addEventListener(
        "dblclick",
        rolar
    );


    dice.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Enter" ||
                event.key ===
                " "
            ) {

                event.preventDefault();

                rolar();

            }

        }
    );

}



// ============================================================
// CONTATO
// ============================================================

function iniciarContatoOrbit() {

    const orbit =
        document.getElementById(
            "contact-orbit"
        );


    if (
        !orbit ||
        reduzirMovimento
    ) {

        return;

    }


    orbit.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                orbit.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                )
                /
                rect.width -
                0.5;


            const y =
                (
                    event.clientY -
                    rect.top
                )
                /
                rect.height -
                0.5;


            orbit.style.transform =
                `
                    rotateX(${y * -5}deg)
                    rotateY(${x * 6}deg)
                `;

        }
    );


    orbit.addEventListener(
        "pointerleave",
        () => {

            orbit.style.transform =
                "";

        }
    );

}



// ============================================================
// BOTÕES MAGNÉTICOS
// ============================================================

function iniciarMagneticos() {

    if (
        reduzirMovimento ||
        window.matchMedia(
            "(hover: none)"
        ).matches
    ) {

        return;

    }


    document
        .querySelectorAll(
            ".magnetic"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            button.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left -
                            rect.width / 2;


                        const y =
                            event.clientY -
                            rect.top -
                            rect.height / 2;


                        button.style.transform =
                            `
                                translate(
                                    ${x * 0.08}px,
                                    ${y * 0.12}px
                                )
                            `;

                    }
                );


                button.addEventListener(
                    "pointerleave",
                    () => {

                        button.style.transform =
                            "";

                    }
                );

            }
        );

}



// ============================================================
// E-MAIL
// ============================================================

function iniciarEmail() {

    const button =
        document.getElementById(
            "copy-email"
        );


    const feedback =
        document.getElementById(
            "copy-feedback"
        );


    const email =
        "gustavolopesti@outlook.com";


    if (
        !button
    ) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            try {

                await navigator
                    .clipboard
                    .writeText(
                        email
                    );


                if (
                    feedback
                ) {

                    feedback.textContent =
                        "COPIADO ✓";

                }

            } catch (
                error
            ) {

                if (
                    feedback
                ) {

                    feedback.textContent =
                        email;

                }

            }


            setTimeout(
                () => {

                    if (
                        feedback
                    ) {

                        feedback.textContent =
                            "";

                    }

                },
                2200
            );

        }
    );

}



// ============================================================
// MENU ATIVO
// ============================================================

function iniciarMenu() {

    const links =
        document.querySelectorAll(
            '.navigation a[href^="#"]'
        );


    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    if (
        !links.length ||
        !sections.length
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        links.forEach(
                            (link) => {

                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(
        (section) => {

            observer.observe(
                section
            );

        }
    );

}



// ============================================================
// GSAP
// ============================================================

function iniciarMotion() {

    if (
        reduzirMovimento ||
        typeof gsap ===
            "undefined" ||
        typeof ScrollTrigger ===
            "undefined"
    ) {

        return;

    }


    gsap.registerPlugin(
        ScrollTrigger
    );


    // ========================================================
    // HERO ENTRADA
    // ========================================================

    const intro =
        gsap.timeline();


    intro
        .from(
            ".brand",
            {
                opacity: 0,
                y: -16,
                duration: 0.7
            }
        )

        .from(
            ".navigation a",
            {
                opacity: 0,
                y: -12,
                stagger: 0.08,
                duration: 0.55
            },
            "-=0.4"
        )

        .from(
            ".hero-title-line",
            {
                yPercent: 110,
                opacity: 0,
                stagger: 0.1,
                duration: 0.9,
                ease: "power4.out"
            },
            "-=0.15"
        )

        .from(
            ".hero-enter",
            {
                y: 35,
                opacity: 0,
                stagger: 0.09,
                duration: 0.7
            },
            "-=0.45"
        )

        .from(
            ".hero-portrait__photo",
            {
                x: 90,
                opacity: 0,
                scale: 0.92,
                duration: 1.2,
                ease: "power3.out"
            },
            "-=0.85"
        )

        .from(
            ".hero-floating",
            {
                opacity: 0,
                scale: 0.7,
                stagger: 0.12
            },
            "-=0.5"
        );


    // ========================================================
    // HERO SCROLL
    // ========================================================

    gsap.to(
        ".hero__left",
        {
            y: -130,
            opacity: 0.16,

            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        }
    );


    gsap.to(
        ".hero-portrait",
        {
            y: 120,
            scale: 0.9,

            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        }
    );


    gsap.to(
        ".hero__ghost-word",
        {
            x: -160,

            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        }
    );


    // ========================================================
    // MANIFESTO
    // ========================================================

    gsap.from(
        ".manifesto__line > *",
        {
            opacity: 0,
            x: 60,
            stagger: 0.08,

            scrollTrigger: {
                trigger: ".manifesto__line",
                start: "top 78%"
            }
        }
    );


    gsap.from(
        ".manifesto__statement h2",
        {
            xPercent: -18,
            opacity: 0,
            stagger: 0.12,

            scrollTrigger: {
                trigger: ".manifesto__statement",
                start: "top 78%"
            }
        }
    );


    // ========================================================
    // PROJECT CHAPTERS
    // ========================================================

    document
        .querySelectorAll(
            ".project-chapter"
        )
        .forEach(
            (chapter) => {

                const sticky =
                    chapter.querySelector(
                        ".project-chapter__sticky"
                    );


                const copy =
                    chapter.querySelector(
                        ".project-copy"
                    );


                const art =
                    chapter.querySelector(
                        ".project-art"
                    );


                const index =
                    chapter.querySelector(
                        ".project-index"
                    );


                gsap.fromTo(
                    sticky,
                    {
                        opacity:
                            0.25,

                        scale:
                            0.92
                    },
                    {
                        opacity:
                            1,

                        scale:
                            1,

                        scrollTrigger: {
                            trigger:
                                chapter,

                            start:
                                "top 80%",

                            end:
                                "top 25%",

                            scrub:
                                1
                        }
                    }
                );


                gsap.fromTo(
                    copy,
                    {
                        x:
                            -90,

                        opacity:
                            0
                    },
                    {
                        x:
                            0,

                        opacity:
                            1,

                        scrollTrigger: {
                            trigger:
                                chapter,

                            start:
                                "top 75%",

                            end:
                                "top 25%",

                            scrub:
                                1
                        }
                    }
                );


                gsap.fromTo(
                    art,
                    {
                        x:
                            100,

                        scale:
                            0.78,

                        opacity:
                            0
                    },
                    {
                        x:
                            0,

                        scale:
                            1,

                        opacity:
                            1,

                        scrollTrigger: {
                            trigger:
                                chapter,

                            start:
                                "top 75%",

                            end:
                                "top 25%",

                            scrub:
                                1
                        }
                    }
                );


                gsap.to(
                    index,
                    {
                        y:
                            140,

                        scrollTrigger: {
                            trigger:
                                chapter,

                            start:
                                "top bottom",

                            end:
                                "bottom top",

                            scrub:
                                true
                        }
                    }
                );


                gsap.to(
                    sticky,
                    {
                        opacity:
                            0.18,

                        scale:
                            0.95,

                        scrollTrigger: {
                            trigger:
                                chapter,

                            start:
                                "bottom 65%",

                            end:
                                "bottom top",

                            scrub:
                                1
                        }
                    }
                );

            }
        );


    // ========================================================
    // SALES BARS
    // ========================================================

    gsap.from(
        ".project-art--sales span",
        {
            scaleY:
                0,

            stagger:
                0.08,

            scrollTrigger: {
                trigger:
                    ".project-art--sales",

                start:
                    "top 75%"
            }
        }
    );


    // ========================================================
    // UNIVERSE
    // ========================================================

    gsap.from(
        ".data-universe__copy > *",
        {
            y:
                45,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".data-universe",

                start:
                    "top 75%"
            }
        }
    );


    gsap.from(
        ".tech-node",
        {
            scale:
                0,

            opacity:
                0,

            stagger:
                0.06,

            ease:
                "back.out(1.7)",

            scrollTrigger: {
                trigger:
                    ".tech-space",

                start:
                    "top 75%"
            }
        }
    );


    // ========================================================
    // CAREER
    // ========================================================

    gsap.from(
        ".career__header > *",
        {
            y:
                55,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".career__header",

                start:
                    "top 78%"
            }
        }
    );


    gsap.from(
        ".dice-world",
        {
            x:
                -80,

            opacity:
                0,

            scrollTrigger: {
                trigger:
                    ".career__content",

                start:
                    "top 76%"
            }
        }
    );


    gsap.from(
        ".career-option",
        {
            x:
                80,

            opacity:
                0,

            stagger:
                0.1,

            scrollTrigger: {
                trigger:
                    ".career-options",

                start:
                    "top 78%"
            }
        }
    );


    // ========================================================
    // ABOUT
    // ========================================================

    gsap.from(
        ".about-preview__big span",
        {
            xPercent:
                -25,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".about-preview__big",

                start:
                    "top 75%"
            }
        }
    );


    gsap.to(
        ".about-preview__big",
        {
            x:
                -100,

            scrollTrigger: {
                trigger:
                    ".about-preview",

                start:
                    "top bottom",

                end:
                    "bottom top",

                scrub:
                    1
            }
        }
    );


    gsap.from(
        ".about-preview__content",
        {
            y:
                70,

            opacity:
                0,

            scrollTrigger: {
                trigger:
                    ".about-preview__content",

                start:
                    "top 80%"
            }
        }
    );


    // ========================================================
    // CONTACT
    // ========================================================

    gsap.from(
        ".contact__copy > *",
        {
            y:
                60,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".contact__copy",

                start:
                    "top 80%"
            }
        }
    );


    gsap.from(
        ".contact-orbit",
        {
            scale:
                0.65,

            opacity:
                0,

            rotation:
                -10,

            duration:
                1.2,

            scrollTrigger: {
                trigger:
                    ".contact-orbit",

                start:
                    "top 80%"
            }
        }
    );


    gsap.to(
        ".contact__giant",
        {
            xPercent:
                -18,

            scrollTrigger: {
                trigger:
                    ".contact",

                start:
                    "top bottom",

                end:
                    "bottom top",

                scrub:
                    true
            }
        }
    );


    ScrollTrigger.refresh();

}



// ============================================================
// ANO
// ============================================================

function iniciarAno() {

    const year =
        document.getElementById(
            "current-year"
        );


    if (
        year
    ) {

        year.textContent =
            new Date()
                .getFullYear();

    }

}



// ============================================================
// INIT
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarWebGL();

        iniciarCursor();

        iniciarFoto();

        iniciarUniverso();

        iniciarDado();

        iniciarContatoOrbit();

        iniciarMagneticos();

        iniciarEmail();

        iniciarMenu();

        iniciarMotion();

        iniciarAno();

    }
);