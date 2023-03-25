import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set up scene, camera, and renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // could use false as third param to give half resolution
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45, // Field of view value in degrees
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
controls.update();

const sunGeometry = new THREE.SphereGeometry(16, 40, 40);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffe0,
  wireframe: true,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sun.position.set(0, 0, 0);
sun.castShadow = true;
// const sunId = sun.id;

// Make Mercury
const mercury = createPlanet(3.2, 0xff4fe0, 28);
// Make Venus
const venus = createPlanet(5.8, 0x5f32ff, 44);
// Make Earth
const earth = createPlanet(6, 0x0000ff, 62);
// Make Mars
const mars = createPlanet(4, 0xff0000, 78);
// Make Jupiter
const jupiter = createPlanet(12, 0x00ffff, 100);
// Make Saturn and rings
const saturn = createPlanet(10, 0x004f89, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: 0x004f89,
});
// Make Uranus
const uranus = createPlanet(7, 0x004f89, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: 0x0f4f89,
});
// Make Neptune
const neptune = createPlanet(7, 0x000fff, 200);
// Make Pluto
const pluto = createPlanet(2.8, 0xffffff, 216);

// add lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// point light
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);

// change background color
// renderer.setClearColor(0xffea00);
// set texture as background
// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars); // only the background
// scene.background = cubeTextureLoader.load([stars, stars, stars, stars, stars, stars]);

// window.addEventListener("mousemove", function (e) {
//   mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
//   mousePosition.y = (e.clientY / this.window.innerHeight) * 2 + 1;
// });

function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.004);

  // Rotate planets themselves
  mercury.planet.rotateY(0.004);
  venus.planet.rotateY(0.002);
  earth.planet.rotateY(0.02);
  mars.planet.rotateY(0.018);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.038);
  uranus.planet.rotateY(0.03);
  neptune.planet.rotateY(0.032);
  pluto.planet.rotateY(0.008);

  // Rotate planets around parent or "Sun"
  mercury.planetParent.rotateY(0.04);
  venus.planetParent.rotateY(0.015);
  earth.planetParent.rotateY(0.01);
  mars.planetParent.rotateY(0.008);
  jupiter.planetParent.rotateY(0.002);
  saturn.planetParent.rotateY(0.0009);
  uranus.planetParent.rotateY(0.0004);
  neptune.planetParent.rotateY(0.0001);
  pluto.planetParent.rotateY(0.00007);

  renderer.render(scene, camera);
}

function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 40, 40);
  const material = new THREE.MeshStandardMaterial({
    color: texture,
    wireframe: true,
  });
  const planet = new THREE.Mesh(geo, material);
  const planetParent = new THREE.Object3D();
  planetParent.add(planet);
  if (ring) {
    const ringGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: texture,
      wireframe: true,
    });
    const planetRing = new THREE.Mesh(ringGeometry, ringMaterial);
    planetParent.add(planetRing);
    planetRing.position.x = position;
    planetRing.rotation.x = -0.5 * Math.PI;
    planetRing.castShadow = true;
  }
  scene.add(planetParent);
  planet.position.x = position;
  return { planet, planetParent };
}

animate();
