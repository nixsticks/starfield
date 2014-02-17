var width = window.innerWidth,
    height = window.innerHeight;

var viewAngle = 45,
    aspect = width / height,
    near = 0.1,
    far = 10000;

var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
  viewAngle,
  aspect,
  near,
  far
);

var scene = new THREE.Scene();

scene.add(camera);

camera.position.z = 1000;

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

var stars = new THREE.Geometry(),
    starMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 20,
      map: THREE.ImageUtils.loadTexture(
        "particle.png"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

var controls = new THREE.OrbitControls( camera, renderer.domElement );

$(document).ready(function()  {
  jQuery.get('stars.json', function(data) {
    var starData = data;

    for (var i = 1; i < starData.length; i++) {
      var star = starData[i],
          pX = star.x,
          pY = star.y,
          pZ = star.z,
          newStar = new THREE.Vector3(pX, pY, pZ);

      stars.vertices.push(newStar);
    }

    var starSystem = new THREE.ParticleSystem(stars, starMaterial);
    starSystem.sortParticles = true;

    scene.add(starSystem);
    animate();
  });
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}