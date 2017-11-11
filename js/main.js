create();

var camera,tower,centerlat,centerlng,points = [];
var latlngscale = 1;
var pointSize = .01;
//set heigh, low, and middle db levels and rang
var dbheigh = -60, dblow = -90, dbmed = (dbheigh + dblow) / 2, dbrange = dbheigh - dblow;

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

  loading();

  loadTower();
  //Load DAE Scene
  loadDAE({scene:"untitled.dae"});
  loadPoints();

  //add lighting
  var light = new THREE.AmbientLight( 0xf0f0f0 ); // soft white light
  scene.add( light );

  controls.target = new THREE.Vector3(0, .2, 0);
  camera.position.set(.4,.5,.4);
  controls.update();
  //createGrid({size:30, steps:.01, color: "black"}); 
  //start animation
  setTimeout(function(){
    animate();
  },100);

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
    tower.visible = false;
  });
}

function loadPoints(){
  $.getJSON('data/points.json',function(data){
    data.forEach(function(point){
      var lat = point.lat;
      var lng = point.lng;
      var height = point.height;
      var db = point.db;
      var pp = 100;
      //var p = createCube({x:(lat - centerlat)*pp,y:height / 1000,z:(lng - centerlng)*pp,sx:pointSize,sy:pointSize,sz:pointSize,material:"normal"});

      var geometry = new THREE.SphereGeometry( pointSize * .5, 10, 10 );
      //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      //var color = new THREE.Color( 0xffffff );
      //var red = Math.floor((db - (dbrange / 2)) * ( 255 / dbrange * -1));
      //var green = Math.floor((db + dbrange / 2) * ( 255 / dbrange));
      //dbp is percentage of db between high and low
      var dbp = (db + Math.abs(dblow))*(100/Math.abs(dbheigh)*2);

      //calculate green
      if( dbp > 50 ){
        var green = 255;
      }else{
        //var green = Math.floor(255 /dbheigh * db);
        //var green = Math.floor((db + dbrange / 2) * ( 255 / dbrange * 2));
        console.log(dbp);
        //5 is 1% of 255 (abouti)
        var green = Math.floor((dbp * 5) );
      }

      //calculate red
      if( dbp < 50 ){
        var red = 255;
      }else{
        //var red = Math.floor((db - dbrange / 2) * ( 255 / dbrange * 2)*-1);

        var red = Math.floor(255 - (dbp * 2));
      }


      //color.setRGB( red, green, 0 );
      var color = new THREE.Color("rgb("+red+", "+green+", 0)");
      //console.log(red + " " + green + " " + 0);
      console.log( db + " " + red + " " + green + " " + 0);
      var material = new THREE.LineBasicMaterial( {
        color: color,
        transparent: true,
        opacity: 0.5
      } )
      var p = new THREE.Mesh( geometry, material );
      scene.add( p );
      p.position.set((lat - centerlat)*pp,height / 1000,(lng - centerlng)*pp);
      p.lat = lat;
      p.lng = lng;
      p.height = height;
      p.db = db;
      p.point = true;
      points.push(p);
      //Make Clickable
      CLICKABLE.push(p);
      //tower.add(p);

      //console.log(p.position);   
    });
  });
}

//Click on point sphere
function getClicked(){
  //  CLICKED.material.emissive.setHex( 0xff0000 );
  if( CLICKED.point ){
    if( LASTCLICKED != null){ LASTCLICKED.material.opacity = .5; }
    CLICKED.material.opacity = 1;
    controlPanel.GPS = CLICKED.lat + "," + CLICKED.lng;
    controlPanel.Height = CLICKED.height + " feet";
    controlPanel.Strength = CLICKED.db + "db";
    gui.updateDisplay();
    gui.open();
  }
}


//Control Panel
var gui = new dat.GUI();
gui.close();
var controlPanel = { 
  scale: 1, 
  GPS:"0,0",
  Height: "0",
  Strength: "0"
}

gui.add(controlPanel,"scale",.2,5,.1).onChange(scalePoints);
gui.add(controlPanel,"GPS");
gui.add(controlPanel,"Height");
gui.add(controlPanel,"Strength");

function scalePoints(){
  var s = controlPanel.scale;
  points.forEach(function(p){
    p.scale.set(s,s,s);
  });
}


