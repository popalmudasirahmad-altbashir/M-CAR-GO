/* =========================================================
   BMW M5 — 3D EXPERIENCE
   MAIN JAVASCRIPT / 3D ENGINE
========================================================= */


/* =========================================================
   THREE.JS IMPORTS
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { OrbitControls } from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";


/* =========================================================
   BASIC VARIABLES
========================================================= */

let scene;
let camera;
let renderer;

let controls;
let loader;

let car = null;

let clock;

let autoRotate = false;
let showGrid = true;

let modelLoaded = false;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const canvas =
    document.getElementById("car-canvas");

const carContainer =
    document.getElementById("car-container");

const modelStatus =
    document.getElementById("model-status");

const loadingScreen =
    document.getElementById("loading-screen");

const loadingProgress =
    document.getElementById("loading-progress");

const interactionHint =
    document.getElementById("interaction-hint");


/* =========================================================
   INITIALIZATION
========================================================= */

init();


function init() {

    clock = new THREE.Clock();

    createScene();

    createCamera();

    createRenderer();

    createLights();

    createEnvironment();

    createControls();

    loadBMW();

    setupUI();

    animate();

}


/* =========================================================
   SCENE
========================================================= */

function createScene() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x030405);

}


/* =========================================================
   CAMERA
========================================================= */

function createCamera() {

    const width =
        carContainer.clientWidth;

    const height =
        carContainer.clientHeight;

    camera =
        new THREE.PerspectiveCamera(
            38,
            width / height,
            0.1,
            2000
        );

    camera.position.set(
        5.2,
        2.5,
        7.8
    );

}


/* =========================================================
   RENDERER
========================================================= */

function createRenderer() {

    renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        carContainer.clientWidth,
        carContainer.clientHeight,
        false
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.15;


    renderer.shadowMap.enabled =
        true;


    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

}


/* =========================================================
   LIGHTING
========================================================= */

function createLights() {


    /* Main white light */

    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            4.2
        );

    keyLight.position.set(
        5,
        8,
        6
    );

    keyLight.castShadow = true;

    keyLight.shadow.mapSize.width =
        2048;

    keyLight.shadow.mapSize.height =
        2048;

    scene.add(keyLight);


    /* Front light */

    const frontLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    frontLight.position.set(
        0,
        3,
        8
    );

    scene.add(frontLight);


    /* Side light */

    const sideLight =
        new THREE.DirectionalLight(
            0x6aa8ff,
            2.2
        );

    sideLight.position.set(
        -7,
        4,
        2
    );

    scene.add(sideLight);


    /* Back light */

    const backLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.7
        );

    backLight.position.set(
        3,
        4,
        -8
    );

    scene.add(backLight);


    /* Soft ambient light */

    const ambient =
        new THREE.HemisphereLight(
            0xffffff,
            0x080a0e,
            1.5
        );

    scene.add(ambient);


    /* Floor reflection light */

    const point =
        new THREE.PointLight(
            0x4d8dff,
            12,
            25
        );

    point.position.set(
        0,
        0.25,
        2
    );

    scene.add(point);

}


/* =========================================================
   ENVIRONMENT
========================================================= */

function createEnvironment() {


    /* Floor */

    const floorGeometry =
        new THREE.PlaneGeometry(
            80,
            80
        );


    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050607,
            roughness: 0.32,
            metalness: 0.72
        });


    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );


    floor.rotation.x =
        -Math.PI / 2;


    floor.position.y =
        -1.25;


    floor.receiveShadow = true;


    scene.add(floor);


    /* Grid */

    const grid =
        new THREE.GridHelper(
            70,
            70,
            0x2a2f36,
            0x111419
        );


    grid.position.y =
        -1.23;


    grid.material.transparent =
        true;


    grid.material.opacity =
        0.32;


    grid.name =
        "showroom-grid";


    scene.add(grid);


    /* Back wall glow */

    const glowGeometry =
        new THREE.CircleGeometry(
            7,
            64
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x0a1627,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    glow.position.set(
        0,
        3,
        -7
    );


    scene.add(glow);

}


/* =========================================================
   ORBIT CONTROLS
========================================================= */

function createControls() {

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.055;


    controls.enablePan =
        false;


    controls.enableZoom =
        true;


    controls.minDistance =
        3.2;


    controls.maxDistance =
        13;


    controls.minPolarAngle =
        Math.PI * 0.22;


    controls.maxPolarAngle =
        Math.PI * 0.72;


    controls.target.set(
        0,
        0.2,
        0
    );


    controls.rotateSpeed =
        0.65;


    controls.zoomSpeed =
        0.8;


    controls.enableKeys =
        false;

}


/* =========================================================
   BMW M5 GLB LOADER
========================================================= */

function loadBMW() {

    loader =
        new GLTFLoader();


    const modelPath =
        "models/bmw-m5.glb";


    loader.load(

        modelPath,


        function (gltf) {

            car =
                gltf.scene;


            modelLoaded =
                true;


            prepareCar();


            scene.add(car);


            centerAndScaleCar();


            hideModelStatus();


            finishLoading();

        },


        function (progress) {

            if (
                progress.total > 0
            ) {

                const percent =
                    (
                        progress.loaded /
                        progress.total
                    ) * 100;


                loadingProgress.style.width =
                    percent + "%";

            }

        },


        function (error) {

            console.error(
                "BMW M5 model could not be loaded:",
                error
            );


            showModelError();

        }

    );

}


/* =========================================================
   PREPARE CAR
========================================================= */

function prepareCar() {

    car.traverse(
        function (object) {

            if (
                object.isMesh
            ) {

                object.castShadow =
                    true;

                object.receiveShadow =
                    true;


                if (
                    object.material
                ) {

                    object.material.needsUpdate =
                        true;

                }

            }

        }
    );


    /*
       Important:
       The actual body color depends on
       the GLB model material.

       We don't force every material to black,
       because that could destroy glass,
       chrome, lights, tires and interior.
    */

}


/* =========================================================
   CENTER + SCALE MODEL
========================================================= */

function centerAndScaleCar() {

    if (!car) return;


    const box =
        new THREE.Box3()
            .setFromObject(car);


    const size =
        new THREE.Vector3();


    const center =
        new THREE.Vector3();


    box.getSize(size);

    box.getCenter(center);


    /* Move model to origin */

    car.position.x -=
        center.x;

    car.position.y -=
        center.y;

    car.position.z -=
        center.z;


    /*
       Scale based on model size.

       This keeps different GLB models
       inside the showroom correctly.
    */

    const largest =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    if (
        largest > 0
    ) {

        const targetSize =
            6.4;


        const scale =
            targetSize /
            largest;


        car.scale.setScalar(
            scale
        );

    }


    /*
       Put the car slightly above
       the showroom floor.
    */

    const newBox =
        new THREE.Box3()
            .setFromObject(car);


    const minY =
        newBox.min.y;


    car.position.y +=
        -1.25 - minY;


    controls.target.set(
        0,
        0.15,
        0
    );


    controls.update();

}


/* =========================================================
   HIDE MODEL STATUS
========================================================= */

function hideModelStatus() {

    if (!modelStatus) return;

    modelStatus.style.opacity =
        "0";

    setTimeout(
        function () {

            modelStatus.style.display =
                "none";

        },
        500
    );

}


/* =========================================================
   MODEL ERROR
========================================================= */

function showModelError() {

    if (!modelStatus) return;


    modelStatus.innerHTML = `

        <div class="status-circle"
             style="
                animation:none;
                border-color:#555;
             ">
        </div>

        <span>
            BMW M5 3D MODEL
        </span>

        <small>
            Add models/bmw-m5.glb
        </small>

    `;


    loadingProgress.style.width =
        "100%";

}


/* =========================================================
   FINISH LOADING
========================================================= */

function finishLoading() {

    loadingProgress.style.width =
        "100%";


    setTimeout(
        function () {

            loadingScreen.classList.add(
                "hidden"
            );

        },
        550
    );

}


/* =========================================================
   UI SETUP
========================================================= */

function setupUI() {


    /* Menu */

    const menuButton =
        document.getElementById(
            "menu-button"
        );


    const closeMenu =
        document.getElementById(
            "close-menu"
        );


    const sideMenu =
        document.getElementById(
            "side-menu"
        );


    const menuBackdrop =
        document.getElementById(
            "menu-backdrop"
        );


    menuButton.addEventListener(
        "click",
        function () {

            sideMenu.classList.add(
                "open"
            );

            menuBackdrop.classList.add(
                "open"
            );

        }
    );


    function closeSideMenu() {

        sideMenu.classList.remove(
            "open"
        );

        menuBackdrop.classList.remove(
            "open"
        );

    }


    closeMenu.addEventListener(
        "click",
        closeSideMenu
    );


    menuBackdrop.addEventListener(
        "click",
        closeSideMenu
    );


    /* Settings */

    const settingsButton =
        document.getElementById(
            "settings-button"
        );


    const settingsPanel =
        document.getElementById(
            "settings-panel"
        );


    const closeSettings =
        document.getElementById(
            "close-settings"
        );


    settingsButton.addEventListener(
        "click",
        function () {

            settingsPanel.classList.toggle(
                "open"
            );

        }
    );


    closeSettings.addEventListener(
        "click",
        function () {

            settingsPanel.classList.remove(
                "open"
            );

        }
    );


    /* Auto rotate */

    const autoToggle =
        document.getElementById(
            "auto-rotate-toggle"
        );


    autoToggle.addEventListener(
        "click",
        function () {

            autoRotate =
                !autoRotate;


            autoToggle.classList.toggle(
                "active",
                autoRotate
            );

        }
    );


    /* Grid */

    const gridToggle =
        document.getElementById(
            "grid-toggle"
        );


    gridToggle.addEventListener(
        "click",
        function () {

            showGrid =
                !showGrid;


            gridToggle.classList.toggle(
                "active",
                showGrid
            );


            const grid =
                scene.getObjectByName(
                    "showroom-grid"
                );


            if (grid) {

                grid.visible =
                    showGrid;

            }

        }
    );


    /* Dark mode */

    const darkToggle =
        document.getElementById(
            "dark-toggle"
        );


    darkToggle.addEventListener(
        "click",
        function () {

            darkToggle.classList.toggle(
                "active"
            );

        }
    );


    /* Rotation buttons */

    document
        .getElementById("rotate-left")
        .addEventListener(
            "click",
            function () {

                rotateCar(
                    -0.35
                );

            }
        );


    document
        .getElementById("rotate-right")
        .addEventListener(
            "click",
            function () {

                rotateCar(
                    0.35
                );

            }
        );


    /* Reset */

    document
        .getElementById("reset-camera")
        .addEventListener(
            "click",
            resetCamera
        );


    /* Zoom */

    document
        .getElementById("zoom-in")
        .addEventListener(
            "click",
            function () {

                zoomCamera(
                    -0.7
                );

            }
        );


    document
        .getElementById("zoom-out")
        .addEventListener(
            "click",
            function () {

                zoomCamera(
                    0.7
                );

            }
        );


    /* Hide interaction hint */

    let hintHidden =
        false;


    carContainer.addEventListener(
        "pointerdown",
        function () {

            if (hintHidden)
                return;


            hintHidden =
                true;


            interactionHint.classList.add(
                "hidden"
            );

        }
    );


    /* Menu navigation */

    document
        .querySelectorAll(
            ".menu-links button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        closeSideMenu();

                    }
                );

            }
        );


    /* Resize */

    window.addEventListener(
        "resize",
        resizeRenderer
    );

}


/* =========================================================
   ROTATE CAR
========================================================= */

function rotateCar(amount) {

    if (!car) return;


    car.rotation.y +=
        amount;

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    camera.position.set(
        5.2,
        2.5,
        7.8
    );


    controls.target.set(
        0,
        0.15,
        0
    );


    controls.update();


    if (car) {

        car.rotation.set(
            0,
            0,
            0
        );

    }

}


/* =========================================================
   ZOOM
========================================================= */

function zoomCamera(amount) {

    const direction =
        new THREE.Vector3();


    camera.getWorldDirection(
        direction
    );


    camera.position.addScaledVector(
        direction,
        -amount
    );


    const distance =
        camera.position.distanceTo(
            controls.target
        );


    if (
        distance < controls.minDistance
    ) {

        camera.position.setLength(
            controls.minDistance
        );

    }


    if (
        distance > controls.maxDistance
    ) {

        camera.position.setLength(
            controls.maxDistance
        );

    }

}


/* =========================================================
   AUTO ROTATION
========================================================= */

function updateAutoRotation() {

    if (
        !autoRotate ||
        !car
    ) return;


    car.rotation.y +=
        0.004;

}


/* =========================================================
   RESIZE
========================================================= */

function resizeRenderer() {

    if (!camera || !renderer)
        return;


    const width =
        carContainer.clientWidth;


    const height =
        carContainer.clientHeight;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    updateAutoRotation();


    controls.update(
        delta
    );


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   MOBILE SAFETY
========================================================= */

window.addEventListener(
    "orientationchange",
    function () {

        setTimeout(
            resizeRenderer,
            250
        );

    }
);


/* =========================================================
   INITIAL RESIZE
========================================================= */

setTimeout(
    resizeRenderer,
    100
);
