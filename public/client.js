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
  camera.position.z = 10;

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
    new THREE.Float32BufferAttribute(
      [
        0.0,
        0.0,
        0.0,
        10.0,
        10.0,
        10.0,
        -10.0,
        -10.0,
        -10.0,

        20.0,
        20.0,
        20.0,
        -20.0,
        10.0,
        10.0,
        -10.0,
        -20.0,
        10.0,
      ],
      3
    )
  );

  const material = new THREE.PointsMaterial({
    color: 0xffff00,
    size: 0.2,
    transparent: true,
  });
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });

  // const points = new THREE.Points(geometry, material);

  // scene.add(points);

  let boxGeometry = new THREE.BoxGeometry(5, 5, 5, 11, 11, 11);
  let cylinderGeometry = new THREE.CylinderGeometry(2, 2, 10, 30, 30);

  let box = createPointsCloud(boxGeometry, material);
  let cylinder = createPointsCloud(cylinderGeometry, shaderMaterial);
  cylinder.position.x = 5;
  box.position.x = -5;

  const numVertices = cylinderGeometry.attributes.position.count;
  var indexes = new Float32Array(numVertices * 1); // 1 values per vertex

  for (var i = 1; i <= numVertices; i++) {
    // set alpha randomly
    indexes[i] = numVertices - [i];
  }

  cylinderGeometry.addAttribute( 'a_index', new THREE.BufferAttribute( indexes, 1 ) );

  scene.add(box);
  scene.add(cylinder);

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

/* Create point cloud */
function createPointsCloud(geometry, material) {
  /* Sprite material */
  let spriteMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.23,
    transparent: true,
  });

  let points = new THREE.Points(geometry, material ? material : spriteMaterial);

  return points;
}
