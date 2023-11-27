// This code is executed PER VERTEX

precision highp float;

uniform int shadingType;
uniform vec3 color;
uniform vec3 lightPosition;
//uniform vec3 lightDirection;


// variables to be interpolated and passed to the fragment shader
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 lightDir;

void main() {
    // normal is a built in variable that contains the normal of the vertex in object space
    // normalMatrix is a built in 3x3 matrix that comes from modelViewMatrix. It's used to transform normal vectors from object space to eye space while preserving their directions even after non-uniform scaling
    // position is a built in variable that contains the position of the vertex in object space
       
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    // Light direction from the surface to the light source
    lightDir = normalize(lightPosition - vPosition);

    // Gouraud shading: calculate light per vertex and then interpolate colors. 
    if (shadingType == 1) {
        vec3 normal = normalize(normalMatrix * normal);
        float diff = max(dot(normal, lightDir), 0.0);
        vColor = diff * color; 
    }
    // light is calculated per pixel values
    else {
        // Pass the normal for shading calculation in the fragment shader
        vNormal = normalMatrix * normal;
    }
    // modelViewMatrix is a built in 4x4 matrix that contains the model matrix * view matrix
    
    // Project vertex coodinates to screen
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
