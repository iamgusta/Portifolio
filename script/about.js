// ============================================================
// ABOUT V3
// ============================================================


const reduzirMovimento =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;



// ============================================================
// THREE BACKGROUND
// ============================================================

function iniciarWebGL() {

    const container =
        document.getElementById(
            "webgl-bg"
        );


    if (
        !container ||
        typeof THREE ===
            "undefined" ||
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
            ? 600
            : 1350;


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
                0.1,

            transparent:
                true,

            opacity:
                0.65,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        particles
    );


    let mouseX =
        0;


    let mouseY =
        0;


    let scrollForce =
        0.03;


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


            scrollForce =
                Math.min(
                    0.2,
                    0.03 +
                    delta * 0.002
                );


            lastScroll =
                atual;

        },
        {
            passive:
                true
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
                            entry.isIntersecting &&
                            typeof gsap !==
                                "undefined"
                        ) {

                            const target =
                                new THREE.Color(
                                    entry.target
                                        .dataset
                                        .particle
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
                                        1.2
                                }
                            );

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

        particles.rotation.y +=
            mouseX *
            0.0006;


        particles.rotation.x +=
            mouseY *
            0.00025;


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
                scrollForce;


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


        scrollForce +=
            (
                0.03 -
                scrollForce
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


    let targetX =
        window.innerWidth / 2;


    let targetY =
        window.innerHeight / 2;


    let currentX =
        targetX;


    let currentY =
        targetY;


    window.addEventListener(
        "pointermove",
        (event) => {

            targetX =
                event.clientX;


            targetY =
                event.clientY;


            dot.style.left =
                `${targetX}px`;


            dot.style.top =
                `${targetY}px`;

        }
    );


    document
        .querySelectorAll(
            "a, button"
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

        currentX +=
            (
                targetX -
                currentX
            ) * 0.16;


        currentY +=
            (
                targetY -
                currentY
            ) * 0.16;


        ring.style.left =
            `${currentX}px`;


        ring.style.top =
            `${currentY}px`;


        requestAnimationFrame(
            render
        );

    }


    render();

}



// ============================================================
// FOTO
// ============================================================

function iniciarFoto() {

    const world =
        document.getElementById(
            "about-photo-world"
        );


    if (
        !world ||
        reduzirMovimento
    ) {

        return;

    }


    const layers =
        world.querySelectorAll(
            "[data-depth]"
        );


    world.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                world.getBoundingClientRect();


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


    world.addEventListener(
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
// FOCUS TECH
// ============================================================

function iniciarFocusTech() {

    const buttons =
        document.querySelectorAll(
            "[data-focus-tech]"
        );


    const result =
        document.getElementById(
            "focus-result"
        );


    if (
        !buttons.length ||
        !result
    ) {

        return;

    }


    buttons.forEach(
        (button) => {

            function selecionar() {

                buttons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                result.textContent =
                    button
                        .dataset
                        .focusTech;

            }


            button.addEventListener(
                "mouseenter",
                selecionar
            );


            button.addEventListener(
                "focus",
                selecionar
            );


            button.addEventListener(
                "click",
                selecionar
            );

        }
    );

}



// ============================================================
// FOCUS VISUAL
// ============================================================

function iniciarFocusVisual() {

    const visual =
        document.getElementById(
            "focus-visual"
        );


    if (
        !visual ||
        reduzirMovimento
    ) {

        return;

    }


    visual.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                visual.getBoundingClientRect();


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


            visual.style.transform =
                `
                    perspective(1000px)
                    rotateX(${y * -6}deg)
                    rotateY(${x * 7}deg)
                `;

        }
    );


    visual.addEventListener(
        "pointerleave",
        () => {

            visual.style.transform =
                "";

        }
    );

}



// ============================================================
// MAGNETIC
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


    const intro =
        gsap.timeline();


    intro
        .from(
            ".brand",
            {
                opacity:
                    0,

                y:
                    -16
            }
        )

        .from(
            ".navigation a",
            {
                opacity:
                    0,

                y:
                    -12,

                stagger:
                    0.08
            },
            "-=0.35"
        )

        .from(
            ".about-title-line",
            {
                yPercent:
                    110,

                opacity:
                    0,

                stagger:
                    0.12,

                duration:
                    0.9,

                ease:
                    "power4.out"
            },
            "-=0.15"
        )

        .from(
            ".about-enter",
            {
                y:
                    35,

                opacity:
                    0,

                stagger:
                    0.1
            },
            "-=0.4"
        )

        .from(
            ".about-photo",
            {
                x:
                    90,

                opacity:
                    0,

                scale:
                    0.92,

                duration:
                    1.1
            },
            "-=0.8"
        );


    // HERO SCROLL

    gsap.to(
        ".about-hero__copy",
        {
            y:
                -120,

            opacity:
                0.18,

            scrollTrigger: {
                trigger:
                    ".about-hero",

                start:
                    "top top",

                end:
                    "bottom top",

                scrub:
                    1
            }
        }
    );


    gsap.to(
        ".about-photo-world",
        {
            y:
                130,

            scale:
                0.9,

            scrollTrigger: {
                trigger:
                    ".about-hero",

                start:
                    "top top",

                end:
                    "bottom top",

                scrub:
                    1
            }
        }
    );


    // STATEMENT

    gsap.from(
        ".about-statement > div span",
        {
            xPercent:
                -25,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".about-statement",

                start:
                    "top 75%"
            }
        }
    );


    gsap.from(
        ".about-statement__text",
        {
            y:
                60,

            opacity:
                0,

            scrollTrigger: {
                trigger:
                    ".about-statement__text",

                start:
                    "top 85%"
            }
        }
    );


    // TIMELINE HEADER

    gsap.from(
        ".about-timeline__header > *",
        {
            y:
                55,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".about-timeline__header",

                start:
                    "top 78%"
            }
        }
    );


    // TIMELINE PROGRESS

    gsap.to(
        "#journey-progress",
        {
            height:
                "100%",

            ease:
                "none",

            scrollTrigger: {
                trigger:
                    ".journey",

                start:
                    "top 65%",

                end:
                    "bottom 55%",

                scrub:
                    1
            }
        }
    );


    // STEPS

    document
        .querySelectorAll(
            ".journey-step"
        )
        .forEach(
            (
                step,
                index
            ) => {

                const copy =
                    step.querySelector(
                        ".journey-step__copy"
                    );


                const visual =
                    step.querySelector(
                        ".journey-step__visual"
                    );


                gsap.from(
                    copy,
                    {
                        x:
                            index % 2 === 0
                                ? -70
                                : 70,

                        opacity:
                            0,

                        scrollTrigger: {
                            trigger:
                                step,

                            start:
                                "top 72%"
                        }
                    }
                );


                gsap.from(
                    visual,
                    {
                        scale:
                            0.78,

                        opacity:
                            0,

                        rotation:
                            5,

                        scrollTrigger: {
                            trigger:
                                step,

                            start:
                                "top 68%"
                        }
                    }
                );

            }
        );


    // PRINCIPLES

    gsap.from(
        ".principles header > *",
        {
            y:
                55,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".principles",

                start:
                    "top 78%"
            }
        }
    );


    gsap.from(
        ".principle",
        {
            y:
                80,

            opacity:
                0,

            stagger:
                0.13,

            scrollTrigger: {
                trigger:
                    ".principles__grid",

                start:
                    "top 82%"
            }
        }
    );


    // FOCUS

    gsap.from(
        ".current-focus__copy > *",
        {
            x:
                -70,

            opacity:
                0,

            stagger:
                0.08,

            scrollTrigger: {
                trigger:
                    ".current-focus",

                start:
                    "top 78%"
            }
        }
    );


    gsap.from(
        ".focus-visual",
        {
            x:
                80,

            opacity:
                0,

            scale:
                0.8,

            scrollTrigger: {
                trigger:
                    ".current-focus",

                start:
                    "top 78%"
            }
        }
    );


    // FINAL

    gsap.from(
        ".about-final > *",
        {
            y:
                55,

            opacity:
                0,

            stagger:
                0.12,

            scrollTrigger: {
                trigger:
                    ".about-final",

                start:
                    "top 78%"
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

        iniciarFocusTech();

        iniciarFocusVisual();

        iniciarMagneticos();

        iniciarMotion();

        iniciarAno();

    }
);