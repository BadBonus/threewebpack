import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";

import { GUI } from "./jsm/libs/dat.gui.module.js";

import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { AfterimagePass } from "./jsm/postprocessing/AfterimagePass.js";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";

let camera, scene, renderer, composer;
let mesh, smartphone, duck;
let edge = 0;
let edgeDirection = false;

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
    0.1,
    1000
  );
  camera.position.z = 400;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbab595);
  //   scene.fog = new THREE.Fog(0x000000, 1, 1000);

  scene.add(new THREE.AmbientLight(0x555555));

  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);

  const loader = new GLTFLoader();

  let promiseModels1 = new Promise((resolve, reject) => {
    loader.load("./assets/silver_smartphone/scene.gltf", function (gltf) {
      duck = gltf.scene;
      duck.name = "duck";
      duck.position.set(-5, -30, 300);
      duck.scale.set(100, 100, 100);
      duck.visible = false;

      // scene.add(duck);
      // render();
      resolve();
    });
  });

  let promiseModels2 = new Promise((resolve, reject) => {
    loader.load("./assets/smartphone/scene.gltf", function (gltf) {
      smartphone = gltf.scene;
      smartphone.position.set(0, -10, 300);
      smartphone.scale.set(40, 40, 40);

      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          console.log(child);
          child.geometry.needsUpdate = true;
          for (
            let index = 0;
            index < child.geometry.attributes.position.count ;
            index++
          ) {
            child.geometry.attributes.position[index] = 1.0;
          }
        }
      });

      // scene.add(smartphone);

      // render();
      resolve();
    });
  });

  Promise.all([promiseModels1, promiseModels2]).then(() => {
    let x = new THREE.Vector3();
    scene.add(duck);
    scene.add(smartphone);
    smartphone.getWorldPosition(x);
    render();
    let y = scene.getObjectByName("duck");
  });

  // postprocessing

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  afterimagePass = new AfterimagePass();
  composer.addPass(afterimagePass);
  afterimagePass.uniforms["damp"].value = 0.5;

  window.addEventListener("resize", onWindowResize);

  const controls = new OrbitControls(camera, renderer.domElement);

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
  // console.log(edge);
  // if (smartphone) {
  //   // smartphone.rotation.x += 0.5;
  //   if (edgeDirection) {
  //     smartphone.rotation.y += 0.01 + edge / 100;
  //     duck.rotation.y += 0.01 + edge / 100;
  //     edge += 0.22;
  //   } else {
  //     smartphone.rotation.y += 0.01 - edge / 100;
  //     duck.rotation.y += 0.01 - edge / 100;
  //     edge -= 0.22;
  //   }

  //   if (edge >= 70) {
  //     edgeDirection = false;
  //     if (smartphone.visible && !duck.visible) {
  //       smartphone.visible = !smartphone.visible;
  //       duck.visible = !duck.visible;
  //     } else {
  //       smartphone.visible = !smartphone.visible;
  //       duck.visible = !duck.visible;
  //     }
  //   } else if (edge <= 0) {
  //     edgeDirection = true;
  //   }
  // }

  // if (params.enable) {
  //   composer.render();
  // } else {
  //   renderer.render(scene, camera);
  // }

  if (edge > 30) {
    composer.render();
  } else if (edge < 30) {
    renderer.render(scene, camera);
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
