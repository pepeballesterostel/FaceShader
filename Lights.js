/*

    This file loads an obj file and renders the mesh with different light types and parameters.
    Change the file name to this scripts name in html to compile this functionality. 
    Run server with npm run dev command
    Open the web console for js with Ctrl + Shift + I

*/
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'; // add mouse control to camera 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Load gltf model
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Load obj model
import * as dat from 'dat.gui'; // add gui
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// Set up scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const orbit = new OrbitControls( camera, renderer.domElement );

// Load Model GLTFLoader
// const gltfUrl = new URL('static/scene.gltf', import.meta.url);
// const gltfloader = new GLTFLoader(); 

// gltfloader.load( gltfUrl.href, function ( gltf ) { 
//     const model = gltf.scene;
//     scene.add( model ); 
//     model.position.set(0,0,0);
//     }, undefined, function ( error ) { 
//         console.error( error ); 
//     } );

// Load Model MTLLoader
// const mtlLoader = new MTLLoader();
// mtlLoader.load('static/max_model/Maxobj.mtl', function(materials) {
//     materials.preload();
//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.load('static/max_model/Maxobj.obj', function(obj) {
//         scene.add(obj);
//     });
// });


// Load Model OBJLoader
const objloader = new OBJLoader();
objloader.load('static/210544.obj', function (obj) {
  scene.add(obj);
  }, 
  function ( xhr ) {

  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

},
  function ( error ) { 
      console.error( error ); 
  });


// GUI
const gui = new dat.GUI();
// Light
const ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
scene.add(ambient);
const directional = new THREE.DirectionalLight();
directional.position.set(-5, 5, 5);
scene.add(directional);
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
pointLight.position.set(-1, 1, 1);
const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(0, 1, 0);


// Light Controller
const lightController = {
    ambientIntensity: 0.13,
    directionalIntensity: 0.5,

    directionalX: -5,
    directionalY: 5,
    directionalZ: 5,
    pointX: -1,
    pointY: 1,
    pointZ: 1,
    spotX: -1,
    spotY: 1,
    spotZ: 0,

    addAmbient: true,
    addDirectional: true,
    addPoint: false,
    addSpot: false
  };
  
// Link Controller to GUI
gui.add(lightController, 'ambientIntensity', 0, 1).name('Ambient Intensity').onChange((value) => {
ambient.intensity = value;
});

gui.add(lightController, 'directionalIntensity', 0, 1).name('Directional Intensity').onChange((value) => {
directional.intensity = value;
});
gui.add(lightController, 'directionalX', -10, 10).onChange((value) => {
directional.position.x = value;
});

gui.add(lightController, 'directionalY', -10, 10).onChange((value) => {
directional.position.y = value;
});

gui.add(lightController, 'directionalZ', -10, 10).onChange((value) => {
directional.position.z = value;
});
gui.add(lightController, 'addAmbient').name('Ambient Light').onChange((value) => {
value ? scene.add(ambient) : scene.remove(ambient);
});

gui.add(lightController, 'addDirectional').name('Directional Light').onChange((value) => {
value ? scene.add(directional) : scene.remove(directional);
});

gui.add(lightController, 'addPoint').name('Point Light').onChange((value) => {
value ? scene.add(pointLight) : scene.remove(pointLight);
});

gui.add(lightController, 'addSpot').name('Spot Light').onChange((value) => {
value ? scene.add(spotLight) : scene.remove(spotLight);
});

// Point Light Position
const pointFolder = gui.addFolder('Point Light Position');
pointFolder.add(lightController, 'pointX', -2, 2).name('X').onChange((value) => {
  pointLight.position.x = value;
});
pointFolder.add(lightController, 'pointY', -2, 2).name('Y').onChange((value) => {
  pointLight.position.y = value;
});
pointFolder.add(lightController, 'pointZ', -2, 2).name('Z').onChange((value) => {
  pointLight.position.z = value;
});
// Spot Light Position
const spotFolder = gui.addFolder('Spot Light Position');
spotFolder.add(lightController, 'spotX', -2, 2).name('X').onChange((value) => {
  spotLight.position.x = value;
});
spotFolder.add(lightController, 'spotY', -2, 2).name('Y').onChange((value) => {
  spotLight.position.y = value;
});
spotFolder.add(lightController, 'spotZ', -2, 2).name('Z').onChange((value) => {
  spotLight.position.z = value;
});

camera.position.set(0,0,5) // how close to the object. The bigger the value the further away
orbit.update();

function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

// Render only if WebGL is available and supported
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}