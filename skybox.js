var width = window.innerWidth,
    height = window.innerHeight,
    startTime = Date.now(),
    container,
    camera,
    scene,
    renderer,
    skyboxMesh;

THREE.ImageUtils.crossOrigin = "";

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
  scene = new THREE.Scene();

  var prefix = "images/";
  var urls = [prefix + "px.jpg", prefix + "nx.jpg", prefix + "py.jpg", prefix + "ny.jpg", prefix + "pz.jpg", prefix + "nz.jpg"];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls);

  var shader = THREE.ShaderLib["cube"];
  // var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  shader.uniforms['tCube'].value = textureCube;

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    side: THREE.BackSide
  });

  skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true), material );
  scene.add(skyboxMesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

function render() {
  var timer = - new Date().getTime() * 0.0002;
  camera.position.x = 1000 * Math.cos(timer);
  camera.position.z = 1000 * Math.sin(timer);

  renderer.render(scene, camera);
}