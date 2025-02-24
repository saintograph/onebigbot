
const container = document.getElementById("solar-system");
const width = container.clientWidth;
const height = container.clientHeight;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 50, 70);
camera.lookAt(0, 0, 0);

const pointLight = new THREE.PointLight(0xffffff, 1.0, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0x404040));

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

scene.add(sun);

const planetsData = [
  { name: "Mercury", distance: 8,  size: 0.5, color: 0xaaaaaa, speed: 0.04 },
  { name: "Venus",   distance: 11, size: 0.9, color: 0xffa500, speed: 0.015 },
  { name: "Earth",   distance: 14, size: 1,   color: 0x0000ff, speed: 0.01, 
    moon: { name: "Moon", distance: 2, size: 0.27, color: 0x888888, speed: 0.05 } },
  { name: "Mars",    distance: 17, size: 0.8, color: 0xff0000, speed: 0.008 },
  { name: "Jupiter", distance: 22, size: 2.5, color: 0xffe4c4, speed: 0.005, 
    moons: [
      { name: "Io", distance: 3, size: 0.3, color: 0xffff00, speed: 0.03 },
      { name: "Europa", distance: 4, size: 0.25, color: 0xffffff, speed: 0.025 }
    ]
  },
  { name: "Saturn",  distance: 27, size: 2,   color: 0xf5deb3, speed: 0.004 },
  { name: "Uranus",  distance: 32, size: 1.7, color: 0x66ccff, speed: 0.003 },
  { name: "Neptune", distance: 37, size: 1.7, color: 0x0000ff, speed: 0.002 }
];

const planets = [];

planetsData.forEach(data => {
  const planetGeom = new THREE.SphereGeometry(data.size, 32, 32);
  const planetMat = new THREE.MeshPhongMaterial({ color: data.color });
  const planetMesh = new THREE.Mesh(planetGeom, planetMat);
  planetMesh.position.x = data.distance;

  const orbitGroup = new THREE.Object3D();
  orbitGroup.add(planetMesh);
  scene.add(orbitGroup);

  let moonOrbitGroup = null;
  let moonsOrbitData = [];

  if (data.moon) {
    const mData = data.moon;
    const moonGeom = new THREE.SphereGeometry(mData.size, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({ color: mData.color });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonMesh.position.x = mData.distance;

    // Create a group for the moon orbiting the planet
    moonOrbitGroup = new THREE.Object3D();
    moonOrbitGroup.add(moonMesh);
    planetMesh.add(moonOrbitGroup);
  }

  if (data.moons) {
    data.moons.forEach(mData => {
      const mGeom = new THREE.SphereGeometry(mData.size, 32, 32);
      const mMat = new THREE.MeshPhongMaterial({ color: mData.color });
      const moonMesh = new THREE.Mesh(mGeom, mMat);
      moonMesh.position.x = mData.distance;

      const mOrbitGroup = new THREE.Object3D();
      mOrbitGroup.add(moonMesh);
      planetMesh.add(mOrbitGroup);

      moonsOrbitData.push({ orbit: mOrbitGroup, speed: mData.speed });
    });
  }

  planets.push({
    orbit: orbitGroup,
    speed: data.speed,
    moonOrbit: moonOrbitGroup,
    moonSpeed: data.moon ? data.moon.speed : 0,
    moonsOrbits: moonsOrbitData
  });
});

function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    p.orbit.rotation.y += p.speed;
    if (p.moonOrbit) {
      p.moonOrbit.rotation.y += p.moonSpeed;
    }
    if (p.moonsOrbits) {
      p.moonsOrbits.forEach(mo => {
        mo.orbit.rotation.y += mo.speed;
      });
    }
  });

  renderer.render(scene, camera);
}
animate();
