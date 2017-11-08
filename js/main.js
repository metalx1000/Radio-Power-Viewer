create();
var camera,tower,centerlat,centerlng,points = [];
var latlngscale = 1;
var pointSize = .01;

function create(){
  sceneSetup();

  renderer.setClearColor( 0xffffff );
  //add camera
  camera = createCamera({x:3});

  //add camera controls
  controlsOrbit({limit:true});

  //add flycontrols
  //controlsFly();

  //get all mesh objects and make them clickable;
  setTimeout(function(){
    CLICKABLE = meshList();
  },1000);

  loadTower();
  //Load DAE Scene
  //loadDAE({scene:"talon.dae"});

  //start animation
  setTimeout(function(){
    loadPoints();
    animate();
    //tower.position.set(0,0,0);
    camera.lookAt(tower.position)
  },500);

}

function getClicked(obj){
  return obj;
}

function animate(){
  //Uncomment for flycontrols
  //var delta = clock.getDelta();
  //controls.update( delta );
  //sceneDAE.children[2].rotation.z+=.01;
  //cameraRotate(tower);
  renderer.render(scene, camera);
  requestAnimationFrame(function(){
    animate();
  });
}

function loadTower(){
  $.get('data/center.dat',function(data){
    var lat = data.split(',')[0];
    var lng = data.split(',')[1];
    centerlat = lat;
    centerlng = lng;
    var height = 300 / 100 / 8;
    var y = height / 2;
    tower = createCube({x:0,y:y, z:0,sx:pointSize,sy:height,sz:pointSize,material:"normal"});
    tower.lat = lat;
    tower.lng = lng;
  });
}

function loadPoints(){
  $.getJSON('data/points.json',function(data){
    data.forEach(function(point){
      var lat = point.lat;
      var lng = point.lng;
      var height = point.height;
      var pp = 100;
      //var p = createCube({x:(lat - centerlat)*pp,y:height / 1000,z:(lng - centerlng)*pp,sx:pointSize,sy:pointSize,sz:pointSize,material:"normal"});
      console.log(height);
      var geometry = new THREE.SphereGeometry( pointSize * .5, 32, 32 );
      //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      var material = new THREE.LineBasicMaterial( {
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
      } )
      var p = new THREE.Mesh( geometry, material );
      scene.add( p );
      p.position.set((lat - centerlat)*pp,height / 1000,(lng - centerlng)*pp);
      p.lat = lat;
      p.lng = lng;
      points.push(p);
      //tower.add(p);

      //console.log(p.position);   
    });
  });
}
