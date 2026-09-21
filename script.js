/* =========================================================
   M5 3D EXPERIENCE
   CODE-BUILT 3D CAR
   ========================================================= */

import * as THREE from "https://esm.sh/three@0.160.0";

/* =========================================================
   BASIC SETUP
   ========================================================= */

const canvas = document.getElementById("car-canvas");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x030303);

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(7.8, 3.8, 9.5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;


/* =========================================================
   LOADING
   ========================================================= */

const loadingScreen =
  document.getElementById("loading-screen");

const loadingProgress =
  document.getElementById("loading-progress");

const loadingPercent =
  document.getElementById("loading-percent");

function loading(value) {
  const v = Math.max(0, Math.min(100, value));

  loadingProgress.style.width = `${v}%`;
  loadingPercent.textContent = `${Math.round(v)}%`;
}

let progress = 0;

const loadingTimer = setInterval(() => {

  progress += Math.random() * 7;

  if (progress > 100) {
    progress = 100;
  }

  loading(progress);

  if (progress >= 100) {
    clearInterval(loadingTimer);

    setTimeout(() => {
      loadingScreen.classList.add("hidden");
    }, 500);
  }

}, 70);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight = new THREE.HemisphereLight(
  0xffffff,
  0x080808,
  2.2
);

scene.add(ambientLight);


const keyLight = new THREE.DirectionalLight(
  0xffffff,
  5
);

keyLight.position.set(
  6,
  10,
  8
);

keyLight.castShadow = true;

keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;

keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;

scene.add(keyLight);


const blueLight = new THREE.PointLight(
  0x149dff,
  45,
  20
);

blueLight.position.set(
  -7,
  3,
  5
);

scene.add(blueLight);


const whiteLight = new THREE.PointLight(
  0xffffff,
  25,
  18
);

whiteLight.position.set(
  6,
  4,
  -7
);

scene.add(whiteLight);


const purpleLight = new THREE.PointLight(
  0x784dff,
  20,
  15
);

purpleLight.position.set(
  0,
  1,
  -8
);

scene.add(purpleLight);


/* =========================================================
   MATERIALS
   ========================================================= */

const blackPaint = new THREE.MeshPhysicalMaterial({
  color: 0x050505,
  metalness: 0.9,
  roughness: 0.19,
  clearcoat: 1,
  clearcoatRoughness: 0.08
});


const blackPlastic = new THREE.MeshStandardMaterial({
  color: 0x010101,
  metalness: 0.25,
  roughness: 0.28
});


const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x071018,
  metalness: 0.05,
  roughness: 0.08,
  transmission: 0.08,
  transparent: true,
  opacity: 0.78
});


const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 1,
  roughness: 0.16
});


const darkChrome = new THREE.MeshStandardMaterial({
  color: 0x252525,
  metalness: 1,
  roughness: 0.22
});


const tireMaterial = new THREE.MeshStandardMaterial({
  color: 0x020202,
  metalness: 0.05,
  roughness: 0.88
});


const brakeMaterial = new THREE.MeshStandardMaterial({
  color: 0x9d1027,
  metalness: 0.55,
  roughness: 0.25
});


const headlightMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xdff8ff,
  emissive: 0x8edcff,
  emissiveIntensity: 4,
  metalness: 0.1,
  roughness: 0.12
});


const taillightMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff102d,
  emissive: 0xff001e,
  emissiveIntensity: 3.5,
  metalness: 0.1,
  roughness: 0.2
});


/* =========================================================
   CAR GROUP
   ========================================================= */

const car = new THREE.Group();

car.position.y = 0.45;

scene.add(car);


/* =========================================================
   HELPER
   ========================================================= */

function addBox(
  parent,
  size,
  position,
  material,
  rotation = [0, 0, 0]
) {

  const geometry =
    new THREE.BoxGeometry(
      size[0],
      size[1],
      size[2]
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.position.set(
    position[0],
    position[1],
    position[2]
  );

  mesh.rotation.set(
    rotation[0],
    rotation[1],
    rotation[2]
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  parent.add(mesh);

  return mesh;
}


function addCylinder(
  parent,
  radius,
  depth,
  position,
  material,
  rotation = [Math.PI / 2, 0, 0],
  segments = 48
) {

  const geometry =
    new THREE.CylinderGeometry(
      radius,
      radius,
      depth,
      segments
    );

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  mesh.position.set(
    position[0],
    position[1],
    position[2]
  );

  mesh.rotation.set(
    rotation[0],
    rotation[1],
    rotation[2]
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  parent.add(mesh);

  return mesh;
}


/* =========================================================
   MAIN BODY
   ========================================================= */

const bodyGeometry =
  new THREE.BoxGeometry(
    6.4,
    1.25,
    2.35,
    8,
    4,
    8
  );

const body =
  new THREE.Mesh(
    bodyGeometry,
    blackPaint
  );

body.position.set(
  0,
  1.45,
  0
);

body.scale.set(
  1,
  0.96,
  1
);

body.castShadow = true;
body.receiveShadow = true;

car.add(body);


/* =========================================================
   LOWER BODY
   ========================================================= */

addBox(
  car,
  [6.65, 0.48, 2.25],
  [0, 0.92, 0],
  blackPlastic
);


/* =========================================================
   FRONT NOSE
   ========================================================= */

addBox(
  car,
  [0.35, 1.02, 2.38],
  [3.25, 1.45, 0],
  blackPaint
);


/* =========================================================
   HOOD
   ========================================================= */

const hood =
  addBox(
    car,
    [2.25, 0.16, 2.08],
    [2.05, 2.03, 0],
    blackPaint
  );

hood.rotation.z = -0.025;


/* =========================================================
   ROOF
   ========================================================= */

const roof =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      2.9,
      0.32,
      1.95,
      6,
      3,
      6
    ),
    blackPaint
  );

roof.position.set(
  -0.35,
  2.65,
  0
);

roof.rotation.z = -0.025;

roof.castShadow = true;

car.add(roof);


/* =========================================================
   CABIN / WINDOWS
   ========================================================= */

const cabin =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      3.35,
      1.08,
      1.82,
      5,
      3,
      5
    ),
    glassMaterial
  );

cabin.position.set(
  -0.35,
  2.28,
  0
);

cabin.rotation.z = -0.04;

cabin.castShadow = true;

car.add(cabin);


/* =========================================================
   ROOF BLACK FRAME
   ========================================================= */

addBox(
  car,
  [3.5, 0.12, 1.95],
  [-0.35, 2.82, 0],
  blackPlastic
);


/* =========================================================
   SIDE WINDOW FRAMES
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [2.9, 0.08, 0.08],
    [-0.35, 2.3, side * 0.96],
    blackPlastic
  );

  addBox(
    car,
    [0.08, 0.95, 0.08],
    [-1.45, 2.35, side * 0.96],
    blackPlastic,
    [0, 0, 0.05]
  );

  addBox(
    car,
    [0.08, 0.95, 0.08],
    [0.72, 2.35, side * 0.96],
    blackPlastic,
    [0, 0, -0.05]
  );
}


/* =========================================================
   SIDE SKIRTS
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [4.75, 0.18, 0.14],
    [-0.15, 0.82, side * 1.18],
    blackPlastic
  );

}


/* =========================================================
   FRONT GRILLE
   ========================================================= */

const grilleFrame =
  addBox(
    car,
    [0.13, 0.78, 1.55],
    [3.48, 1.43, 0],
    darkChrome
  );


/* vertical grille bars */

for (let z = -0.62; z <= 0.62; z += 0.16) {

  addBox(
    car,
    [0.05, 0.70, 0.035],
    [3.56, 1.43, z],
    chromeMaterial
  );

}


/* =========================================================
   FRONT LOWER AIR INTAKE
   ========================================================= */

addBox(
  car,
  [0.10, 0.30, 1.75],
  [3.58, 0.92, 0],
  blackPlastic
);


/* =========================================================
   HEADLIGHTS
   ========================================================= */

for (const side of [-1, 1]) {

  const headlight =
    addBox(
      car,
      [0.12, 0.27, 0.58],
      [3.55, 1.78, side * 0.79],
      headlightMaterial
    );

  headlight.rotation.z =
    side * -0.12;


  /* light strip */

  addBox(
    car,
    [0.08, 0.035, 0.45],
    [3.62, 1.88, side * 0.79],
    headlightMaterial,
    [0, 0, side * -0.12]
  );

}


/* =========================================================
   FRONT BUMPER CORNERS
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [0.38, 0.32, 0.35],
    [3.28, 1.03, side * 0.98],
    blackPlastic
  );

}


/* =========================================================
   REAR BODY
   ========================================================= */

addBox(
  car,
  [0.35, 1.0, 2.3],
  [-3.25, 1.45, 0],
  blackPaint
);


/* =========================================================
   REAR LIGHTS
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [0.10, 0.25, 0.62],
    [-3.48, 1.73, side * 0.78],
    taillightMaterial
  );

}


/* =========================================================
   REAR BUMPER
   ========================================================= */

addBox(
  car,
  [0.18, 0.40, 2.25],
  [-3.48, 0.92, 0],
  blackPlastic
);


/* =========================================================
   EXHAUSTS
   ========================================================= */

for (const side of [-1, 1]) {

  for (const offset of [-0.18, 0.18]) {

    addCylinder(
      car,
      0.14,
      0.16,
      [-3.57, 0.76, side * (0.62 + offset)],
      chromeMaterial,
      [0, Math.PI / 2, 0],
      32
    );

  }

}


/* =========================================================
   MIRRORS
   ========================================================= */

for (const side of [-1, 1]) {

  const mirror =
    addBox(
      car,
      [0.42, 0.18, 0.27],
      [0.82, 2.12, side * 1.16],
      blackPaint
    );

  mirror.rotation.y =
    side * 0.15;

}


/* =========================================================
   WHEELS
   ========================================================= */

const wheels = [];

function createWheel(x, z) {

  const wheelGroup =
    new THREE.Group();

  wheelGroup.position.set(
    x,
    0.82,
    z
  );

  car.add(wheelGroup);


  /* tire */

  const tire =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.76,
        0.76,
        0.36,
        48
      ),
      tireMaterial
    );

  tire.rotation.x =
    Math.PI / 2;

  tire.castShadow = true;
  tire.receiveShadow = true;

  wheelGroup.add(tire);


  /* rim */

  const rim =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.53,
        0.53,
        0.38,
        32
      ),
      darkChrome
    );

  rim.rotation.x =
    Math.PI / 2;

  wheelGroup.add(rim);


  /* center */

  const center =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.12,
        0.12,
        0.42,
        24
      ),
      chromeMaterial
    );

  center.rotation.x =
    Math.PI / 2;

  wheelGroup.add(center);


  /* brake disc */

  const brake =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.43,
        0.43,
        0.04,
        32
      ),
      brakeMaterial
    );

  brake.rotation.x =
    Math.PI / 2;

  brake.position.y = 0.02;

  wheelGroup.add(brake);


  /* rim spokes */

  for (let i = 0; i < 10; i++) {

    const angle =
      (Math.PI * 2 * i) / 10;

    const spoke =
      addBox(
        wheelGroup,
        [0.43, 0.035, 0.035],
        [
          Math.cos(angle) * 0.25,
          0.03,
          Math.sin(angle) * 0.25
        ],
        chromeMaterial
      );

    spoke.rotation.y =
      angle;

  }


  wheels.push(wheelGroup);
}


/* front wheels */

createWheel(2.15, 1.17);
createWheel(2.15, -1.17);


/* rear wheels */

createWheel(-2.15, 1.17);
createWheel(-2.15, -1.17);


/* =========================================================
   WHEEL ARCHES
   ========================================================= */

for (const x of [-2.15, 2.15]) {

  for (const side of [-1, 1]) {

    const arch =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          0.82,
          0.11,
          12,
          32,
          Math.PI
        ),
        blackPlastic
      );

    arch.position.set(
      x,
      0.84,
      side * 1.19
    );

    arch.rotation.y =
      Math.PI / 2;

    arch.rotation.z =
      Math.PI;

    car.add(arch);

  }

}


/* =========================================================
   REAR SPOILER
   ========================================================= */

addBox(
  car,
  [0.38, 0.12, 1.75],
  [-2.72, 2.08, 0],
  blackPlastic
);

addBox(
  car,
  [0.18, 0.26, 0.10],
  [-2.65, 1.95, 0.70],
  blackPlastic
);

addBox(
  car,
  [0.18, 0.26, 0.10],
  [-2.65, 1.95, -0.70],
  blackPlastic
);


/* =========================================================
   HOOD LINES
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [1.55, 0.025, 0.025],
    [2.05, 2.12, side * 0.65],
    chromeMaterial
  );

}


/* =========================================================
   SIDE CHARACTER LINES
   ========================================================= */

for (const side of [-1, 1]) {

  addBox(
    car,
    [3.9, 0.035, 0.035],
    [-0.25, 1.73, side * 1.19],
    chromeMaterial
  );

}


/* =========================================================
   FLOOR
   ========================================================= */

const floor =
  new THREE.Mesh(
    new THREE.CircleGeometry(
      14,
      96
    ),
    new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.35,
      roughness: 0.72
    })
  );

floor.rotation.x =
  -Math.PI / 2;

floor.position.y =
  -0.02;

floor.receiveShadow = true;

scene.add(floor);


/* =========================================================
   FLOOR RING
   ========================================================= */

const ring =
  new THREE.Mesh(
    new THREE.RingGeometry(
      5.5,
      5.54,
      128
    ),
    new THREE.MeshBasicMaterial({
      color: 0x159eff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    })
  );

ring.rotation.x =
  -Math.PI / 2;

ring.position.y =
  0.01;

scene.add(ring);


/* =========================================================
   GRID
   ========================================================= */

const grid =
  new THREE.GridHelper(
    28,
    28,
    0x173b50,
    0x0b1720
  );

grid.position.y =
  0.015;

scene.add(grid);


/* =========================================================
   CAMERA TARGET
   ========================================================= */

const target =
  new THREE.Vector3(
    0,
    1.15,
    0
  );


/* =========================================================
   MOUSE / TOUCH ROTATION
   ========================================================= */

let isDragging = false;

let previousX = 0;
let previousY = 0;

let targetRotationY = 0;
let targetRotationX = 0;

let currentRotationY = 0;
let currentRotationX = 0;

let autoRotate = false;


canvas.addEventListener(
  "pointerdown",
  (event) => {

    isDragging = true;

    previousX = event.clientX;
    previousY = event.clientY;

    canvas.setPointerCapture(
      event.pointerId
    );

  }
);


canvas.addEventListener(
  "pointermove",
  (event) => {

    if (!isDragging) return;

    const dx =
      event.clientX - previousX;

    const dy =
      event.clientY - previousY;

    targetRotationY +=
      dx * 0.009;

    targetRotationX +=
      dy * 0.004;

    targetRotationX =
      Math.max(
        -0.32,
        Math.min(
          0.32,
          targetRotationX
        )
      );

    previousX = event.clientX;
    previousY = event.clientY;

  }
);


function stopDragging() {
  isDragging = false;
}

canvas.addEventListener(
  "pointerup",
  stopDragging
);

canvas.addEventListener(
  "pointercancel",
  stopDragging
);

canvas.addEventListener(
  "pointerleave",
  stopDragging
);


/* =========================================================
   ZOOM
   ========================================================= */

let cameraDistance = 12;

function updateCamera() {

  const direction =
    new THREE.Vector3(
      Math.sin(targetRotationY),
      0.22 + targetRotationX,
      Math.cos(targetRotationY)
    ).normalize();

  camera.position.copy(
    direction.multiplyScalar(cameraDistance)
  );

  camera.position.y += 1.0;

  camera.lookAt(target);
}


/* =========================================================
   BUTTONS
   ========================================================= */

const rotateLeft =
  document.getElementById(
    "rotate-left"
  );

const rotateRight =
  document.getElementById(
    "rotate-right"
  );

const resetView =
  document.getElementById(
    "reset-view"
  );

const zoomIn =
  document.getElementById(
    "zoom-in"
  );

const zoomOut =
  document.getElementById(
    "zoom-out"
  );


rotateLeft.addEventListener(
  "click",
  () => {

    targetRotationY -=
      Math.PI / 5;

  }
);


rotateRight.addEventListener(
  "click",
  () => {

    targetRotationY +=
      Math.PI / 5;

  }
);


resetView.addEventListener(
  "click",
  () => {

    targetRotationY = 0;
    targetRotationX = 0;

    cameraDistance = 12;

  }
);


zoomIn.addEventListener(
  "click",
  () => {

    cameraDistance -= 0.8;

    cameraDistance =
      Math.max(
        7.5,
        cameraDistance
      );

  }
);


zoomOut.addEventListener(
  "click",
  () => {

    cameraDistance += 0.8;

    cameraDistance =
      Math.min(
        19,
        cameraDistance
      );

  }
);


/* =========================================================
   AUTO ROTATE
   ========================================================= */

const autoRotateToggle =
  document.getElementById(
    "auto-rotate-toggle"
  );

autoRotateToggle.addEventListener(
  "change",
  () => {

    autoRotate =
      autoRotateToggle.checked;

  }
);


/* =========================================================
   GRID TOGGLE
   ========================================================= */

const gridToggle =
  document.getElementById(
    "grid-toggle"
  );

gridToggle.addEventListener(
  "change",
  () => {

    grid.visible =
      gridToggle.checked;

  }
);


/* =========================================================
   DARK MODE
   ========================================================= */

const darkToggle =
  document.getElementById(
    "dark-toggle"
  );

darkToggle.addEventListener(
  "change",
  () => {

    document.body.classList.toggle(
      "light-mode",
      !darkToggle.checked
    );

    scene.background =
      darkToggle.checked
        ? new THREE.Color(0x030303)
        : new THREE.Color(0xdfe5ea);

  }
);


/* =========================================================
   MENU
   ========================================================= */

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


function openMenu() {

  sideMenu.classList.add("open");

  menuBackdrop.classList.add("open");

}


function closeMenuPanel() {

  sideMenu.classList.remove("open");

  menuBackdrop.classList.remove("open");

}


menuButton.addEventListener(
  "click",
  openMenu
);

closeMenu.addEventListener(
  "click",
  closeMenuPanel
);

menuBackdrop.addEventListener(
  "click",
  closeMenuPanel
);


/* =========================================================
   SETTINGS
   ========================================================= */

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
  () => {

    settingsPanel.classList.add(
      "open"
    );

  }
);


closeSettings.addEventListener(
  "click",
  () => {

    settingsPanel.classList.remove(
      "open"
    );

  }
);


/* =========================================================
   MENU ITEM INTERACTION
   ========================================================= */

document
  .querySelectorAll(".menu-item")
  .forEach((item) => {

    item.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".menu-item"
          )
          .forEach((button) => {

            button.classList.remove(
              "active"
            );

          });

        item.classList.add("active");

        closeMenuPanel();

      }
    );

  });


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

window.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "ArrowLeft") {
      targetRotationY -= 0.12;
    }

    if (event.key === "ArrowRight") {
      targetRotationY += 0.12;
    }

    if (event.key === "+" || event.key === "=") {
      cameraDistance =
        Math.max(
          7.5,
          cameraDistance - 0.5
        );
    }

    if (event.key === "-") {
      cameraDistance =
        Math.min(
          19,
          cameraDistance + 0.5
        );
    }

  }
);


/* =========================================================
   ANIMATION
   ========================================================= */

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

  const delta =
    clock.getDelta();


  /* auto rotation */

  if (autoRotate && !isDragging) {

    targetRotationY +=
      delta * 0.32;

  }


  /* smooth car rotation */

  currentRotationY +=
    (
      targetRotationY -
      currentRotationY
    ) * 0.08;

  currentRotationX +=
    (
      targetRotationX -
      currentRotationX
    ) * 0.08;


  car.rotation.y =
    currentRotationY;

  car.rotation.x =
    currentRotationX;


  /* slight showroom light movement */

  blueLight.position.x =
    Math.sin(
      performance.now() * 0.00025
    ) * 7;


  purpleLight.position.x =
    Math.cos(
      performance.now() * 0.00018
    ) * 7;


  updateCamera();

  renderer.render(
    scene,
    camera
  );
}


/* =========================================================
   RESIZE
   ========================================================= */

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

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);


/* =========================================================
   INITIAL CAMERA
   ========================================================= */

updateCamera();

animate();


/* =========================================================
   READY STATUS
   ========================================================= */

const statusText =
  document.getElementById(
    "status-text"
  );

setTimeout(() => {

  statusText.textContent =
    "3D ENGINE READY";

}, 900);
