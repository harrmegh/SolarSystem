import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set up scene, camera, and renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // could use false as third param to give half resolution
renderer.shadowMap.enabled = true;
renderer.setClearColor(0x000010);
document.body.appendChild(renderer.domElement);

// Set up raycaster
const raycaster = new THREE.Raycaster();

// Interaction Controls
const pointer = new THREE.Vector2();
var target;

// Consider additional cameras for each planet?
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, // Field of view value in degrees
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  300000 // far clipping plane
);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(1000, 30, 30);
controls.update();

// Make Sun
const sunSize = 200;
const sunGeometry = new THREE.SphereGeometry(sunSize, 40, 40);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffe0,
  roughness: 0.4,
  metalness: 0.5,
  emissive: 0xffffe0,
  emissiveIntensity: 1,
  wireframe: true,
  transparent: true,
  side: THREE.DoubleSide,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
sun.position.set(0, 0, 0);
sun.castShadow = true;
const sunId = sun.id;
const sunLight = new THREE.PointLight(0xffffff, 9, 3000);
sun.add(sunLight);

// Sun Controls
// var planetControls = [
//   { planet: sun, target: true },
//   { planet: earth.planet, target: false },
// ];

// Make Mercury
const mercury = createPlanet(sunSize * 0.003504, 0xff4fe0, 206);
// Make Venus
const venus = createPlanet(sunSize * 0.008691, 0x5f32ff, 212);
// Make Earth
const earth = createPlanet(sunSize * 0.009149, 0x0000ff, 218, undefined, {
  size: 0.25 * (sunSize * 0.009149),
  texture: 0xffff00,
  position: (sunSize * 0.009149) / 2 + 2,
});
const earthId = earth.planet.id;
// Make Mars
const mars = createPlanet(sunSize * 0.004868, 0xff0000, 225);
// Make Jupiter
const jupiter = createPlanet(sunSize * 0.100398, 0x00ffff, 287);
// Make Saturn and rings
const saturn = createPlanet(sunSize * 0.083626, 0x004f89, 360, {
  innerRadius: sunSize * 0.083626,
  outerRadius: sunSize * 0.083626 + 15,
  texture: 0x004f89,
});
// Make Uranus
const uranus = createPlanet(sunSize * 0.036422, 0x004f89, 520, {
  innerRadius: sunSize * 0.036422,
  outerRadius: sunSize * 0.036422 + 5,
  texture: 0x0f4f89,
});
// Make Neptune
const neptune = createPlanet(sunSize * 0.035359, 0x000fff, 700);
// Make Pluto
const pluto = createPlanet(sunSize * 0.0016185, 0xffffff, 800);

// add lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// point light
// const pointLight = new THREE.PointLight(0xffffff, 2, 300);
// scene.add(pointLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(10, 0, 0);

// Mouse controls
// document.addEventListener("mousemove", onPointerMove);
window.addEventListener("resize", onWindowResize);

// Clicking the side navbar
document.body.addEventListener("click", function (event) {
  if (!validId(event.target.id)) return;
  target = targetPlanet(event.target.id);
});

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

  // TODO: Function to determine if these should rotate
  // Rotate planets around parent or "Sun"
  if (!target || target === sun) {
    mercury.planetParent.rotateY(0.04);
    venus.planetParent.rotateY(0.015);
    earth.planetParent.rotateY(0.01);
    mars.planetParent.rotateY(0.008);
    jupiter.planetParent.rotateY(0.002);
    saturn.planetParent.rotateY(0.0009);
    uranus.planetParent.rotateY(0.0004);
    neptune.planetParent.rotateY(0.0001);
    pluto.planetParent.rotateY(0.00007);
  }

  raycaster.setFromCamera(pointer, camera);

  // const intersects = raycaster.intersectObjects(scene.children, false);
  if (target) {
    target === sun
      ? (controls.target = sun.position.clone())
      : (controls.target = target.planet.position.clone());
  }

  // controls.target =
  //   earth.planet.position.clone());
  controls.update();

  renderer.render(scene, camera);
}

function createPlanet(size, texture, position, ring, moon) {
  const geo = new THREE.SphereGeometry(size, 40, 40);
  const material = new THREE.MeshStandardMaterial({
    color: texture,
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const planet = new THREE.Mesh(geo, material);
  const planetParent = new THREE.Object3D();
  planetParent.add(planet);
  if (ring !== undefined) {
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
  if (moon !== undefined) {
    const moonGeometry = new THREE.SphereGeometry(moon.size, 40, 40);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: moon.texture,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const newMoon = new THREE.Mesh(moonGeometry, moonMaterial);
    planet.add(newMoon);
    newMoon.position.x = moon.position;
    newMoon.rotation.x = 8 * Math.PI;
    newMoon.receiveLight = true;
    newMoon.receiveShadow = true;
    newMoon.castShadow = true;
  }

  scene.add(planetParent);
  planet.position.x = position;
  planet.receiveLight = true;
  planet.receiveShadow = true;
  planet.castShadow = true;
  return { planet, planetParent };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function onPointerMove(event) {
//   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

function targetPlanet(planet) {
  switch (planet) {
    case "sun":
      return sun;
    case "mercury":
      return mercury;
    case "venus":
      return venus;
    case "earth":
      return earth;
    case "mars":
      return mars;
    case "jupiter":
      return jupiter;
    case "saturn":
      return saturn;
    case "uranus":
      return uranus;
    case "neptune":
      return neptune;
    case "pluto":
      return pluto;
  }
}

function validId(id) {
  if (
    id !== "sun" &&
    id !== "mercury" &&
    id !== "venus" &&
    id !== "earth" &&
    id !== "mars" &&
    id !== "jupiter" &&
    id !== "saturn" &&
    id !== "uranus" &&
    id !== "neptune" &&
    id !== "pluto"
  )
    return false;
  return true;
}
animate();
