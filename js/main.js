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
  //loadPoints();

  //add lighting
  var light = new THREE.AmbientLight( 0xf0f0f0 ); // soft white light
  scene.add( light );

  controls.target = new THREE.Vector3(0, .2, 0);
  camera.position.set(.4,.5,.4);
  controls.update();
  //createGrid({size:30, steps:.01, color: "black"}); 

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
    //updateCompass();
  });
}

function loadTower(){
  $.get('data/center.dat',function(data){
    var lat = data.split(',')[0];
    var lng = data.split(',')[1];
    var Tower_Height = data.split(',')[2];
    centerlat = lat;
    centerlng = lng;
    var height = 300 / 100 / 8;
    var y = height / 2;
    tower = createCube({x:0,y:y, z:0,sx:pointSize,sy:height,sz:pointSize,material:"normal"});
    tower.lat = lat;
    tower.lng = lng;
    tower.height = Tower_Height;
    tower.visible = false;
    controlPanel.TowerGPS = lat + "," + lng;
    controlPanel.Tower_Height = Tower_Height + " feet";
    gui.updateDisplay();
  }).done(loadPoints);
}

//returns colored material for objects based on db level.
function objColor(obj){
  //dbp is percentage of db between high and low
  var dbp = (obj.db + Math.abs(dblow))*(100/Math.abs(dbheigh)*2);

  //calculate green
  if( dbp > 50 ){
    var green = 255;
  }else{
    //5 is 1% of 255 (about)
    var green = Math.floor((dbp * 5) );
    if(green < 0){green = 0}
  }

  if(green != 1){console.log(green)};

  //calculate red
  if( dbp < 50 ){
    var red = 255;
  }else{
    var red = Math.floor(255 - (dbp * 2));
    if(red < 0){red = 0}
  }


  //color.setRGB( red, green, 0 );
  //console.log(red + " " + green + " " + 0);
  //console.log( db + " " + red + " " + green + " " + 0);
  var color = new THREE.Color("rgb("+red+", "+green+", 0)");

  //console.log(color);
  var material = new THREE.LineBasicMaterial( {
    color: color,
    transparent: true,
    opacity: 0.5
  } )
  return material;
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
      var material = objColor(point);
      var p = new THREE.Mesh( geometry, material );
      scene.add( p );
      p.position.set((lat - centerlat)*pp,height / 1000,(lng - centerlng)*pp);
      p.lat = lat;
      p.lng = lng;
      p.height = height;
      p.db = db;
      p.point = true;

      //add to points group
      points.push(p);

      //Make Clickable
      CLICKABLE.push(p);
    });
  }).done(loadCompass);
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
    var dis = getDis(tower.lat,tower.lng,CLICKED.lat,CLICKED.lng, "F");
    dis = Math.floor(dis);
    controlPanel.Distance = dis + " Feet from Tower";
    gui.updateDisplay();
    pointInfo.open();
    gui.open();
  }
}

//point steps
//Shows every 'x' points
function pointSteps(){
  var x = controlPanel.Point_Steps;
  points.forEach(function(p){
    p.visible = false;
  });

  for(var i=0;i < points.length;i+=x){
    if(points[i].visible !== undefined){
      points[i].visible = true;
    }
  }
}

//Control Panel
var gui = new dat.GUI();
gui.close();
var controlPanel = { 
  Scale: 1, 
  GPS:"0,0",
  Height: "0",
  Strength: "0",
  Distance: "0",

  Point_Steps: 1,
  TowerGPS: "0",
  Tower_Height: "0"
}

var controls = gui.addFolder('Controls');
controls.add(controlPanel,"Scale",.2,5,.1).onChange(scalePoints);
controls.add(controlPanel,"Point_Steps",1,10,1).onChange(pointSteps);

var towerInfo = gui.addFolder('Tower Information');
towerInfo.add(controlPanel,"TowerGPS");
towerInfo.add(controlPanel,"Tower_Height");

var pointInfo = gui.addFolder('Point Information');
pointInfo.add(controlPanel,"GPS");
pointInfo.add(controlPanel,"Height");
pointInfo.add(controlPanel,"Distance");
pointInfo.add(controlPanel,"Strength");

function scalePoints(){
  var s = controlPanel.Scale;
  points.forEach(function(p){
    p.scale.set(s,s,s);
  });
}

//get distance between two GPS points
function getDis(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  if (unit=="F") { dist = dist * 5280 }      
  return dist
}


//directional objects
var compass;
function loadCompass(){
  dae = "models/dae/compass.dae";
  console.log("loading "+dae);
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load( dae, function ( collada ) {
    dae = collada.scene;
    compass = dae.children[0].children[0];
    console.log("compass loaded...");
    scene.add(dae);
    var material = new THREE.MeshNormalMaterial();
    compass.material = material;
    compass.position.set(-.5,0,.1);
    compass.rotation.y = (-90 * Math.PI)/180; //rotate compass -90degrees
    //compass.scale.set(.1,.1,.1);
    meshList();
    //loaded();
    animate();
  });
}

function loadArrow(){
  dae = "models/dae/arrow.dae";
  console.log("loading "+dae);
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load( dae, function ( collada ) {
    dae = collada.scene;
    compass = dae.children[0].children[0];
    console.log("model loaded...");
    scene.add(dae);
    var material = new THREE.MeshNormalMaterial();
    compass.material = material;
    //compass.scale.set(.1,.1,.1);
    meshList();
    //loaded();
    animate();
  });

}

function updateCompass(){
  var zCamVec = new THREE.Vector3(-.1,-.1,0);
  var position = camera.localToWorld(zCamVec);

  compass.position.set(position.x, position.y, position.z);
  compass.lookAt(tower.position);
  //compass.translateZ(.1);
  return 0;
}
