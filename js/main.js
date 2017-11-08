create();
var tower,centerlat,centerlng,points = [];
var latlngscale = 1;

function create(){
  sceneSetup();

  renderer.setClearColor( 0xffffff );
  //add camera
  camera = createCamera({x:1});

  //add camera controls
  controlsOrbit({limit:false});

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
    var size = .01;
    tower = createCube({x:0,y:0, z:0,sx:size,sy:1,sz:size,material:"normal"});
    tower.lat = lat;
    tower.lng = lng;
  });
}

function loadPoints(){
  $.getJSON('data/points.json',function(data){
    data.forEach(function(point){
      var lat = point.lat;
      var lng = point.lng;
      var hight = point.hight;
      var size = .01;
      var pp = 100;
      var p = createCube({x:(lat - centerlat)*pp,y:hight / 1000,z:(lng - centerlng)*pp,sx:size,sy:size,sz:size,material:"normal"});
      p.lat = lat;
      p.lng = lng;
      points.push(p);
      tower.add(p);
      console.log(p.position);   
    });
  });
}
