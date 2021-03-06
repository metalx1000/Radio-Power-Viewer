var camera, renderer, scene;
var group = [];

//resize canvas on window resize
window.addEventListener( 'resize', onWindowResize, false );

function sceneSetup(){
  //setup scene
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xFFFFFF );
}

function onWindowResize( event ) {
  SCREEN_HEIGHT = window.innerHeight;
  SCREEN_WIDTH  = window.innerWidth;
  renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
  //composer.reset();
}

function createCube(d){
  if(typeof d === "undefined"){d = {};}
  //possition
  if(typeof d.x === "undefined"){d.x = 0;}
  if(typeof d.y === "undefined"){d.y = 0;}
  if(typeof d.z === "undefined"){d.z = 0;}

  //size
  if(typeof d.sx === "undefined"){d.sx = 1;}
  if(typeof d.sy === "undefined"){d.sy = 1;}
  if(typeof d.sz === "undefined"){d.sz = 1;}

  //color
  if(typeof d.material === "undefined"){d.material = "normal";}
  if(typeof d.color === "undefined"){d.color = ( Math.random() * 0xffffff );}

  var material = materials(d.material, d.color);
  var cube = new THREE.Mesh(new THREE.CubeGeometry(d.sx,d.sy,d.sz), material);
  cube.position.x = d.x;
  cube.position.y = d.y;
  cube.position.z = d.z;
  //cube.rotation.x = 10;
  //cube.rotation.z = .5;
  scene.add(cube);
  return cube;
}


function createCylinder(d){
  if(typeof d === "undefined"){d = {};}

  if(typeof d.radtop === "undefined"){d.radtop = .2;}
  if(typeof d.radbottom === "undefined"){d.radbottom = .2;}
  if(typeof d.height === "undefined"){d.height = 1;}
  if(typeof d.segments === "undefined"){d.segments = 32;}
  if(typeof d.openend === "undefined"){d.openend = false;}

  //colors and materials
  if(typeof d.material === "undefined"){d.material = "normal";}
  if(typeof d.color === "undefined"){d.color = ( Math.random() * 0xffffff );}

  var geometry = new THREE.CylinderGeometry( d.radtop, d.radbottom, d.height, d.segments );
  var material = materials(d.material, d.color);
  var c = new THREE.Mesh( geometry, material );
  scene.add(c);
  return c;
}

function materials(m,c){
  if(m == "normal"){
    var material = new THREE.MeshNormalMaterial();
  }else if(m == "basic"){
    var material = new THREE.MeshBasicMaterial( {color: c} );
  }else if(m == "line"){
    var material = new THREE.LineBasicMaterial({color: c});
  }else{
    var material = new THREE.MeshNormalMaterial();
  }

  return material;
}

function createCamera(d){
  //possition
  if(typeof d.x === "undefined"){d.x = 2;}
  if(typeof d.y === "undefined"){d.y = 2;}
  if(typeof d.z === "undefined"){d.z = 3;}
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  //camera.rotation.x = d.x;
  camera.position.set( d.x, d.y, d.z );
  //camera.lookAt(scene.position);
  return camera;
}


function controlsFly(){
  clock = new THREE.Clock();
  controls = new THREE.FlyControls( camera );
  controls.movementSpeed = 1000;
  //controls.domElement = container;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = false;
  controls.dragToLook = false;
}

var loadTEXT;
function loading(d){
  $("#info").html("<br><br><h1>LOADING...</h1>");
/*
  if(typeof d === "undefined"){d = {};}
  if(typeof d.scene === "undefined"){d.scene = "loadtext.dae";}
  var dae = "models/dae/" + d.scene;
  console.log("loading "+dae);
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load( dae, function ( collada ) {
    dae = collada.scene;
    loadTEXT = dae;
    scene.add(dae);
    dae.position.y = .1;
  });
*/
}

function loaded(){
  //loadTEXT.visible = false;
  $("#info").html("");
  $("#loader").hide();
}

var sceneDAE;
function loadDAE(d){
  if(typeof d === "undefined"){d = {};}
  if(typeof d.scene === "undefined"){d.scene = "scene.dae";}
  dae = "models/dae/" + d.scene;
  console.log("loading "+dae);
  var loader = new THREE.ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load( dae, function ( collada ) {
    dae = collada.scene;
    sceneDAE = dae;
    console.log("model loaded...");
    scene.add(dae);
    meshList();
    loaded();
  });

}

function controlsOrbit(d){
  if(typeof d === "undefined"){d = {};}
  if(typeof d.limit === "undefined"){d.limit = false;}
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  if(d.limit == true ){
    //console.log(controls.maxPolarAngle);
    controls.maxPolarAngle = Math.PI/2 - .1; 
  }
}

function createGrid(d){
  if(typeof d === "undefined"){d = {};}
  if(typeof d.size === "undefined"){d.size = 30;}
  if(typeof d.step === "undefined"){d.step = .2;}
  //colors and materials
  if(typeof d.material === "undefined"){d.material = "line";}
  if(typeof d.color === "undefined"){d.color = "green";}

  var geometry = new THREE.Geometry();
  var material = materials(d.material, d.color);

  for ( var i = - d.size; i <= d.size; i += d.step){
    geometry.vertices.push(new THREE.Vector3( - d.size, - 0.04, i ));
    geometry.vertices.push(new THREE.Vector3( d.size, - 0.04, i ));

    geometry.vertices.push(new THREE.Vector3( i, - 0.04, - d.size ));
    geometry.vertices.push(new THREE.Vector3( i, - 0.04, d.size ));

  }

  var grid = new THREE.Line( geometry, material, THREE.LineSegments);
  scene.add(grid);
  return grid;
}


//click objects
var CLICKED, CLICKABLE = [], CLICKGROUP = [], LASTCLICKED, CLICKEDTIME = new Date().getTime();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );

function onDocumentTouchStart( event ) {
  //event.preventDefault();
  //console.log("click");
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseDown( event );
}

var getClicked;
function onDocumentMouseDown( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( CLICKABLE );
  if ( intersects.length > 0 ) {
    LASTCLICKED = CLICKED;
    CLICKEDTIME = new Date().getTime();
    CLICKED = intersects[0].object;
    getClicked();
    add_remove(CLICKGROUP,CLICKED);
  }
}

//ARRAY FUNCTIONS
//sort arrays
function sort_array(arr) {
  return arr.sort().filter(function(el,i,a) {
    return (i==a.indexOf(el));
  });
}

function removeByValue(array, value){
  return array.filter(function(elem, _index){
    return value != elem ? true : false;
  });
}

function containsObject(obj, array) {
  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i] === obj) {
      return true;
    }
  }

  return false;
}

//add or remove from group if obj is in group or not
function add_remove(arr,obj){
  //add or remove from group
  if(containsObject(obj, arr)){
    CLICKGROUP = removeByValue(arr, obj);
  }else{
    arr.push(obj);
    arr = sort_array(arr);
  }

}

//list all mesh
var MESH = [];
function meshList(){
  MESH = [];
  scene.traverse( function( node ) {
    if ( node instanceof THREE.Mesh ) {
      // insert your code here, for example:
      MESH.push(node);
    }
  } );
  return MESH;
}

//Rotating Camera
function cameraRotate(d){
  if(typeof d === "undefined"){d = {};}
  if(typeof d.lookAt === "undefined"){d.lookAt = scene.position;}
  if(typeof d.direction === "undefined"){d.direction = 1;}

  var timer = Date.now() * 0.001;

  camera.position.x = (Math.cos( timer ) * 10) * d.direction;
  camera.position.z = Math.sin( timer ) * 10;

  camera.lookAt( d.lookAt );
}

