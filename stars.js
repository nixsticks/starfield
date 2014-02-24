var width = window.innerWidth,
    height = window.innerHeight;

var viewAngle = 45,
    aspect = width / height,
    near = 0.1,
    far = 10000;

var mouse = { x: 0, y: 0 }, starSystem, INTERSECTED, target, zoom = false;

var projector = new THREE.Projector(),
    ray = new THREE.Raycaster(),
    renderer = new THREE.WebGLRenderer(),
    camera = new THREE.PerspectiveCamera(
      viewAngle,
      aspect,
      near,
      far
    ),
    scene = new THREE.Scene();

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

stars.dynamic = true;

var controls = new THREE.OrbitControls( camera, renderer.domElement );

function onDocumentMouseMove(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseDown(event) {
  if (INTERSECTED) {
    target = INTERSECTED;
    zoom = true;
  } else {
    zoom = false;
  }
}

$(document).ready(function()  {
  jQuery.get('stars.json', function(data) {
    var starData = data;

    for (var i = 0; i < starData.length; i++) {
      var star = starData[i],
          pX = star.x,
          pY = star.y,
          pZ = star.z,
          newStar = new THREE.Vector3(pX, pY, pZ);

      stars.vertices.push(newStar);

      if (star.propername) {
        var sprite = makeTextSprite(star.propername, { fontsize: 32, backgroundColor: {r:255, g:100, b:100, a:1} } );
        sprite.position = stars.vertices[i].clone().multiplyScalar(1.1);
        scene.add( sprite );
      }
    }

    starSystem = new THREE.ParticleSystem(stars, starMaterial);
    starSystem.sortParticles = true;

    scene.add(starSystem);
    animate();

    document.addEventListener("mousemove", onDocumentMouseMove)
    document.addEventListener("mousedown", onDocumentMouseDown)
  });
});

// function mousemove(event) {
//   event.preventDefault();

//   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function render() {
  if (target) {
    camera.lookAt( target.position );
  } else {
    camera.lookAt(new THREE.Vector3(0,0,0));
  }


   if(zoom && camera.fov>10){
      camera.fov-=1;
      camera.updateProjectionMatrix();
    }else if(!zoom && camera.fov<70){
      camera.fov+=1;
      camera.updateProjectionMatrix();
    }


  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  projector.unprojectVector(vector, camera);

  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects([starSystem]);
  if ( intersects.length > 0 ) {
    INTERSECTED = intersects[0].object
  } else {
    INTERSECTED = null;
  }


  renderer.render(scene, camera);
}

function makeTextSprite( message, parameters ) {
  if ( parameters === undefined ) parameters = {};
  
  var fontface = parameters.hasOwnProperty("fontface") ? 
    parameters["fontface"] : "Arial";
  
  var fontsize = parameters.hasOwnProperty("fontsize") ? 
    parameters["fontsize"] : 18;
  
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
    parameters["borderThickness"] : 4;
  
  var borderColor = parameters.hasOwnProperty("borderColor") ?
    parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
  
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
    parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

  //var spriteAlignment = parameters.hasOwnProperty("alignment") ?
  //  parameters["alignment"] : THREE.SpriteAlignment.topLeft;

  // var spriteAlignment = THREE.SpriteAlignment.topLeft;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
    
  // get size data (height depends only on font size)
  var metrics = context.measureText( message );
  var textWidth = metrics.width;
  
  // // background color
  // context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
  //                 + backgroundColor.b + "," + backgroundColor.a + ")";
  // // border color
  // context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
  //                 + borderColor.b + "," + borderColor.a + ")";

  // context.lineWidth = borderThickness;
  // roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  // // 1.4 is extra height factor for text below baseline: g,j,p,q.
  
  // text color
  context.fillStyle = "red";

  context.fillText( message, borderThickness, fontsize + borderThickness);
  
  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( 
    { map: texture, useScreenCoordinates: false } );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(100,50,1.0);
  return sprite;  
}
