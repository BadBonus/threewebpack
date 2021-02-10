import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";

import { GUI } from "./jsm/libs/dat.gui.module.js";

import { EffectComposer } from "./jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./jsm/postprocessing/RenderPass.js";
import { AfterimagePass } from "./jsm/postprocessing/AfterimagePass.js";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";

let camera, scene, renderer, composer;
let edge = 0;
let edgeDirection = false;

let afterimagePass;

const params = {
  enable: true,
};

let uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
  u_mouse: { type: "v2", value: new THREE.Vector2() },
};

init();
// createGUI();
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
  scene.background = new THREE.Color(0x000000);
  //   scene.fog = new THREE.Fog(0x000000, 1, 1000);

  scene.add(new THREE.AmbientLight(0x555555));

  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);

  window.addEventListener("resize", onWindowResize);
  document.onmousemove = function (e) {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };

  const vertices = [];

  for (let i = 0; i < 100000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);

    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const material = new THREE.PointsMaterial({ color: 0xffffff });
  // const shaderMaterial = new THREE.ShaderMaterial({
  //   uniforms: uniforms,
  //   vertexShader: document.getElementById("vertexShader").textContent,
  //   fragmentShader: document.getElementById("fragmentShader").textContent,
  // });

  const points = new THREE.Points(geometry, material);

  scene.add(points);

  const controls = new OrbitControls(camera, renderer.domElement);

  if (typeof TESTING !== "undefined") {
    for (let i = 0; i < 45; i++) {
      render();
    }
  }
}

function createGUI() {
  // const gui = new GUI({ name: "Damp setting" });
  // gui.add(afterimagePass.uniforms["damp"], "value", 0, 1).step(0.001);
  // gui.add(params, "enable");
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}
