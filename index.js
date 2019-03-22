(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);        

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




window.addEventListener('resize',()=>{
    let width = window.innerWidth;
    let height  = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}); 

// controls = THREE.OrbitControls(camera, renderer.domElement);


//let mtlLoader = new THREE.MTLLoader();

// instantiate a loader
var textureLoader = new THREE.TextureLoader();
let carMaterial = null;
let diffuseTexture = null;
let specularTexture = null;
var carObject = null;


// load a resource
textureLoader.load(
	// resource URL
	'models/AM-01_diffuse.jpg',

	// onLoad callback
	 ( texture ) => {
        this.diffuseTexture = texture;
         // load a resource
        textureLoader.load(
	        // resource URL
	        'models/AM-01_Normal.jpg',

            // onLoad callback
            ( texture ) => {
                this.normalMapTexture = texture;                
                
                
                
                 // load a resource
                textureLoader.load(
                    // resource URL
                    'models/AM-01_specular.jpg',

                    // onLoad callback
                    ( texture ) => {
                        this.specularTexture = texture;

                        // in this example we create the material when the texture is loaded
                        this.carMaterial = new THREE.MeshStandardMaterial( {
                            map: this.diffuseTexture,
                            normalMap: this.normalMapTexture,
                            metalnessMap: this.specularTexture,
                            metalness: 1.0
                        } );
                        
                        let loader = new THREE.OBJLoader();

                        //loader.setMaterials(carMaterial);
                        loader.load(
                            'models/AM-01.obj',
                            (object) => {
                                this.carObject = object;
                                object.scale.x = 0.005;
                                object.scale.y = 0.005;
                                object.scale.z = 0.005;
                                //object.material = carMaterial;

                                object.traverse( function ( child ) {

                                    if ( child instanceof THREE.Mesh ) {
                            
                                        child.material = this.carMaterial;
                            
                                    }
                            
                                } );
                            
                                scene.add(object);
                            }
                        );
                    },// onProgress callback currently not supported
                    undefined,
        
                    // onError callback
                    function ( err ) {
                        console.error( 'An error happened.' );
                    }
                );
            },// onProgress callback currently not supported
            undefined,

            // onError callback
            function ( err ) {
                console.error( 'An error happened.' );
            }
        );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function ( err ) {
		console.error( 'An error happened.' );
	}
);



// create the shape
var geometry = new THREE.BoxGeometry(1,1,1);

let cubeMaterials = [
    new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('img/1.png'), side: THREE.DoubleSide}),
    new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('img/2.png'), side: THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('img/3.png'), side: THREE.DoubleSide}),
    new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('img/4.png'), side: THREE.DoubleSide}),
    new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('img/5.png'), side: THREE.DoubleSide}),
    new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('img/6.png'), side: THREE.DoubleSide}),
];

// ambient light
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.7);
scene.add(ambientLight);


// create a material, color or image texture
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var cube = new THREE.Mesh(geometry, cubeMaterials);
cube.position.y = 2;
scene.add(cube);

var geometryPlane = new THREE.PlaneGeometry( 5000, 5000, 32 );
var materialPlane = new THREE.MeshBasicMaterial( {color: 0x00AA00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometryPlane, materialPlane );
plane.rotation.x = Math.PI / 2;
scene.add( plane );

var light1 = new THREE.PointLight(0xFF0040, 10, 50);
scene.add(light1);
var light2 = new THREE.PointLight(0x0040FF, 10, 50);
scene.add(light2);
var light3 = new THREE.PointLight(0x18FF18, 10, 50);
scene.add(light3);

camera.position.y = 10;
camera.position.x = 15;
camera.position.z = 15;
camera.lookAt( cube.position );
//camera.target.position.copy( cube );


let carKeyControls = () => {    
    if(carObject){
        document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
            carObject.rotation.y += 0.1;
            break;
            case 38:
            carObject.translateZ( -0.5 );
            break;
            case 39:
            carObject.rotation.y -= 0.1;
            break;
            case 40:
            carObject.translateZ( 0.5 );
            break;
        }
        };
    }
  }

// game logic 
let update = () => {
    carKeyControls();
    if(carObject){ 
        //camera.lookAt( carObject.position );
        camera.position.x = carObject.position.x + 15;
        camera.position.z = carObject.position.z + 15;
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.005;
    var time = Date.now() * 0.0005;

    light1.position.x = Math.sin(time*0.7) * 30;
    light1.position.y = Math.cos(time*0.5) * 40;
    light1.position.z = Math.cos(time*0.3) * 30;

    light2.position.x = Math.cos(time*0.3) * 30;
    light2.position.y = Math.sin(time*0.5) * 40;
    light2.position.z = Math.sin(time*0.7) * 30;

    light3.position.x = Math.sin(time*0.7) * 30;
    light3.position.y = Math.cos(time*0.3) * 40;
    light3.position.z = Math.sin(time*0.5) * 30;
}



// draw scene
let render = () => {
    renderer.render(scene, camera);
};

// run game loop (update, render, repeat)
let GameLoop = () =>{
    requestAnimationFrame(GameLoop);

    update();
    render();
};

GameLoop();
