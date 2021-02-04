// import * as THREE from "../build/three.module.js";

// import { OrbitControls } from "./jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "./jsm/loaders/RGBELoader.js";
// import { RoughnessMipmapper } from "./jsm/utils/RoughnessMipmapper.js";

// import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
// import { AfterimagePass } from "./jsm/postprocessing/AfterimagePass.js";

// // let camera, scene, renderer;

// let composer;
// let mesh;

// // init();
// // render();

// // function init() {
// //   const container = document.createElement("div");
// //   document.body.appendChild(container);

// //   const camera = new THREE.PerspectiveCamera(
// //     75,
// //     window.innerWidth / window.innerHeight,
// //     0.1,
// //     1000
// //   );

// //   scene = new THREE.Scene();

// //   //   const loader = new GLTFLoader();
// //   //   loader.load("./assets/duck/duck.gltf", function (gltf) {
// //   //     const geometry = new THREE.BoxGeometry();
// //   //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// //   //     const cube = new THREE.Mesh(geometry, material);
// //   //     scene.add(cube);

// //   //     const mesh = new THREE.mesh(geometry, material);

// //   //     scene.add(gltf.scene);
// //   //     scene.add(mesh);

// //   //     render();
// //   //   });

// //   const geometry = new THREE.BoxGeometry();
// //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// //   const cube = new THREE.Mesh(geometry, material);
// //   scene.add(cube);

// //   camera.position.z = 5;

// //   renderer = new THREE.WebGLRenderer({ antialias: true });
// //   renderer.setPixelRatio(window.devicePixelRatio);
// //   renderer.setSize(window.innerWidth, window.innerHeight);
// //   renderer.toneMapping = THREE.ACESFilmicToneMapping;
// //   renderer.toneMappingExposure = 1;
// //   renderer.outputEncoding = THREE.sRGBEncoding;
// //   container.appendChild(renderer.domElement);

// //   const pmremGenerator = new THREE.PMREMGenerator(renderer);
// //   pmremGenerator.compileEquirectangularShader();

// //   const controls = new OrbitControls(camera, renderer.domElement);
// //   controls.addEventListener("change", render); // use if there is no animation loop

// //   controls.target.set(0, 0, -0.2);
// //   controls.update();

// //   window.addEventListener("resize", onWindowResize);
// // }

// // function onWindowResize() {
// //   camera.aspect = window.innerWidth / window.innerHeight;
// //   camera.updateProjectionMatrix();

// //   renderer.setSize(window.innerWidth, window.innerHeight);

// //   render();
// // }

// // //

// // function render() {
// //   renderer.render(scene, camera);
// // }

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// scene.add(new THREE.AmbientLight(0x555555));

// const light = new THREE.SpotLight(0xffffff, 1.5);
// light.position.set(0, 500, 2000);
// scene.add(light);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// camera.position.z = 5;
// let duck;

// const loader = new GLTFLoader();
// loader.load("./assets/duck/duck.gltf", function (gltf) {
//   duck = gltf.scene;
//   scene.add(duck);

//   // postprocessing

//   composer = new EffectComposer(renderer);
//   composer.addPass(new RenderPass(scene, camera));

//   afterimagePass = new AfterimagePass();
//   composer.addPass(afterimagePass);

//   window.addEventListener("resize", onWindowResize);

//   if (typeof TESTING !== "undefined") {
//     for (let i = 0; i < 45; i++) {
//       render();
//     }
//   }

//   render();
// });

// const animate = function () {
//   requestAnimationFrame(animate);

//   duck.rotation.x += 0.01;

//   renderer.render(scene, camera);
// };

// animate();

import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";

import { GUI } from "./jsm/libs/dat.gui.module.js";

import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { AfterimagePass } from "./jsm/postprocessing/AfterimagePass.js";

let camera, scene, renderer, composer;
let mesh, duck;

let afterimagePass;

const params = {
  enable: true,
};

init();
createGUI();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    .1,
    1000
  );
  camera.position.z = 400;

  scene = new THREE.Scene();
//   scene.fog = new THREE.Fog(0x000000, 1, 1000);

  scene.add(new THREE.AmbientLight(0x555555));

  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load("./assets/duck/duck.gltf", function (gltf) {
    duck = gltf.scene;
    duck.position.set(0, -10, 300);
    duck.scale.set(40, 40, 40);

    scene.add(duck);

    // const geometry = new THREE.BoxGeometry(150, 150, 150, 2, 2, 2);
    // const material = new THREE.MeshNormalMaterial();
    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    render();
  });

  // postprocessing

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  afterimagePass = new AfterimagePass();
  composer.addPass(afterimagePass);

  window.addEventListener("resize", onWindowResize);

  if (typeof TESTING !== "undefined") {
    for (let i = 0; i < 45; i++) {
      render();
    }
  }
}

function createGUI() {
  const gui = new GUI({ name: "Damp setting" });
  gui.add(afterimagePass.uniforms["damp"], "value", 0, 1).step(0.001);
  gui.add(params, "enable");
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  if (duck) {
    duck.rotation.x += 0.5;
    duck.rotation.y += 0.01;
  }

  if (params.enable) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
