create();

var camera,tower,centerlat,centerlng,points = [];
var latlngscale = 1;
var pointSize = .01;
//set heigh, low, and middle db levels and rang
var dbheigh = 20, dblow = -20, dbmed = (dbheigh + dblow) / 2, dbrange = dbheigh - dblow;

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
  loadDAE({scene:"untitled.dae"});
  loadPoints();

  //add lighting
  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  //start animation
  setTimeout(function(){
    animate();
    //tower.position.set(0,0,0);
    //camera.lookAt(tower.position)
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

      //calculate green
      if( db > dbmed ){
        var green = 255;
      }else{
        //var green = Math.floor(255 /dbheigh * db);
        var green = Math.floor((db + dbrange / 2) * ( 255 / dbrange * 2));
      }

      //calculate red
      if( db < dbmed ){
        var red = 255;
      }else{
        var red = Math.floor((db - dbrange / 2) * ( 255 / dbrange * 2)*-1);
      }


      //color.setRGB( red, green, 0 );
      var color = new THREE.Color("rgb("+red+", "+green+", 0)");
      //console.log(red + " " + green + " " + 0);
      //console.log( db + " " + red + " " + green + " " + 0);
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
  $("#info").html("GPS: " + CLICKED.lat + "," + CLICKED.lng + "<br>");
  $("#info").append("Height: " + CLICKED.height + "'<br>");
  $("#info").append("Signal Strength: " + CLICKED.db + "db");
}


//Control Panel
var gui = new dat.GUI();
var controlPanel = { scale: 1 }
gui.add(controlPanel,"scale",.2,5,.1).onChange(scalePoints);

function scalePoints(){
  var s = controlPanel.scale;
  points.forEach(function(p){
    p.scale.set(s,s,s);
  });
}


