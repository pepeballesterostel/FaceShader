/*

    This file loads an obj file and renders the mesh using shaders in GLSL.
    Change the file name to this scripts name in html to compile this functionality. 
    Open the web console for js with Ctrl + Shift + I
    Run server with npm run dev command

    To do: 
    - Fix the reset position button and place it right behind the image of the painting
    - Flat and Gouraud still looks the same

    Author: Pepe Ballesteros
*/

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'; // add mouse control to camera 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Load obj model
import * as dat from 'dat.gui'; // add gui
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// Set up scene
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.zIndex = '1'; // Make sure this is below the z-index of the image of the painting
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const orbit = new OrbitControls( camera, renderer.domElement );

// Function to load shader file
function loadShader(url) {
  return fetch(url).then(response => response.text());
}

let initialPosition, initialRotation, initialScale;
let shaderMaterial;

Promise.all([
  loadShader('vertexShader.glsl'),
  loadShader('fragmentShader.glsl')
]).then(([vertexShaderCode, fragmentShaderCode]) => {
   shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode,
      uniforms: {

        ambientColor: { value: new THREE.Color(0x404040) },
        ambientIntensity: { value: 0.5 },
        lightPosition: { value: new THREE.Vector3(-10, 10, 10) },
        //lightDirection: { value: new THREE.Vector3(-1, 1, 1) },
        color: { value: new THREE.Color(0xffffff) }, // color of light
        shadingType: { value: 0 } // Default to diffuse shading

    }
  });
  // Load Model OBJLoader
  const objloader = new OBJLoader();
  objloader.load('static/210544.obj', function (obj) {
    obj.name = 'faceMesh'; 
    scene.add(obj);
    initialPosition = obj.position.clone();
    initialRotation = obj.rotation.clone();
    initialScale = obj.scale.clone();
    obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = shaderMaterial;
        }
    });
    
    }, 
    function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
    function ( error ) { 
        console.error( error ); 
    });
});

// GUI
const gui = new dat.GUI({ autoPlace: false });
const customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
const settings = {
  shadingType: 'Flat', // Default shading type
  ambientIntensity: 0.5,
  directionalX: -5,
  directionalY: 5,
  directionalZ: 5,
};
gui.add(settings, 'shadingType', ['Flat', 'Gouraud', 'Phong', 'Cel']).onChange(value => {
  // Map the string to the corresponding integer value
  const typeMapping = {
      'Flat': 0,
      'Gouraud': 1,
      'Phong': 2,
      'Cel': 3
  };
    // Update the uniform in the shader material
    shaderMaterial.uniforms.shadingType.value = typeMapping[value];
    console.log("Shader type changed to:", value);
});

gui.add(settings, 'ambientIntensity', 0, 10).name('Ambient Intensity').onChange((value) => {
  shaderMaterial.uniforms.ambientIntensity.value = value;
  });

const pointFolder = gui.addFolder('Light Position');
pointFolder.add(settings, 'directionalX', -10, 10).onChange((value) => {
  shaderMaterial.uniforms.lightPosition.value.x = value;
});

pointFolder.add(settings, 'directionalY', -10, 10).onChange((value) => {
  shaderMaterial.uniforms.lightPosition.value.y = value;
});

pointFolder.add(settings, 'directionalZ', -10, 10).onChange((value) => {
  shaderMaterial.uniforms.lightPosition.value.z = value;
});

camera.position.set(0,0,5) // how close to the object. The bigger the value the further away
orbit.update();

// Function to reset the OBJ model position
function resetObjPosition() {
  const obj = scene.getObjectByName('faceMesh'); 
  if (obj) {
      console.log('Resetting position to:', initialPosition);
      console.log('Resetting rotation to:', initialRotation);
      console.log('Resetting scale to:', initialScale);
      obj.position.copy(initialPosition);
      obj.rotation.copy(initialRotation);
      obj.scale.copy(initialScale);
      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.position.set(0, 0, 0);
            child.rotation.set(0, 0, 0);
            child.scale.set(1, 1, 1);
        }
    });
    animate();
  } else {
    console.error('Object "faceMesh" not found in the scene.');
  }
}
// Add the event listener button
document.getElementById('resetMeshButton').addEventListener('click', resetObjPosition);

// Window event listener
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

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