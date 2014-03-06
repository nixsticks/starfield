var height = window.innerHeight,
    width = window.innerWidth;

var orbit = [],
    planets = [];

var renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);

camera.position.z = 1000;

var scene = new THREE.Scene();

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var orbitSpeed = [1, 0.001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006, 0.0007, 0.0008];
var orbitRing = [1, 40, 80, 120, 160, 220, 270, 320, 370]
var planetRadius = [20, 10, 13, 15, 14, 25, 19, 17, 17];

var prefix = "images/planets/";
var textures = ["sunmap.jpg", "mercurymap.jpg", "venusmap.jpg", "earthmap.jpg", "marsmap.jpg", "jupitermap.jpg", "saturnmap.jpg", "uranusmap.jpg", "neptunemap.jpg"];

for (var i = 0; i < 9; i++) {
  var orbit = new THREE.TorusGeometry(orbitRing[i], .1, 50, 50)
  var orbitMaterial = new THREE.MeshNormalMaterial({wireframe: true});
  orbit[i] = new THREE.Mesh(orbit, orbitMaterial);
  scene.add(orbit[i]);

  var planet = new THREE.SphereGeometry(planetRadius[i], 20, 20);
  var planetMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(prefix + textures[i])});
  planets[i] = new THREE.Mesh(planet, planetMaterial);
  scene.add(planets[i]);

  planets[i].position.set(orbitRing[i], 0, 0);
}

var skysphere  = new THREE.SphereGeometry(1000, 100, 100);
var skyMaterial = new THREE.MeshBasicMaterial();
skyMaterial.map = THREE.ImageUtils.loadTexture('images/planets/starfield.png');
skyMaterial.side = THREE.BackSide;
var skyMesh  = new THREE.Mesh(skysphere, skyMaterial);
scene.add(skyMesh);

draw();

function draw() {
  for (var i = 1; i < 9; i++) {
    planets[i].rotation.y = Date.now() * 0.0006;
    planets[i].position.x = Math.sin(Date.now() * orbitSpeed[i]) * orbitRing[i];
    planets[i].position.y = Math.cos(Date.now() * orbitSpeed[i]) * orbitRing[i];
  }

  // camera.position.set(planets[3].position.x + 50, planets[3].position.y+100, planets[3].position.z+100);
  // camera.lookAt(planets[3].position);

  renderer.render(scene, camera);
  requestAnimationFrame(draw);
  controls.update();
}