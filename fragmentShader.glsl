// This code is executed at pixel level 

//uniforms: variables that are the same for all vertices and fragments
uniform vec3 ambientColor;
uniform float ambientIntensity;
//uniform vec3 lightDirection;
uniform vec3 color;
uniform int shadingType; // 0: Flat, 1: Diffuse, 2: Gouraud, 3: Phong, 4: Cel

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 lightDir;


void main() {
    vec3 ambient =  ambientIntensity * ambientColor;
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float diff = max(dot(normal, lightDir), 0.0);
    
    vec3 finalColor;

    // Flat shading: uses the face normal for all pixels in the polygon
    if (shadingType == 0) {
        vec3 fdx = dFdx(vPosition);
        vec3 fdy = dFdy(vPosition);
        vec3 faceNormal = normalize(cross(fdx, fdy));
        float diff = max(dot(faceNormal, lightDir), 0.0);
        vec3 diffuseColor = diff * color;
        finalColor = diffuseColor + ambient;
    }
    // Gouraud shading:  Color calculated per vertex, then interpolated across polygon
    else if (shadingType == 1) {
        finalColor = vColor; 
        finalColor += ambient;
    }
    // Phong shading
    else if (shadingType == 2) {
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
        finalColor = color * (diff + spec);
        finalColor += ambient;
    }
    // Cel shading
    else if (shadingType == 3) {
        if (diff > 0.95) diff = 1.0;
        else if (diff > 0.7) diff = 0.8;
        else if (diff > 0.5) diff = 0.6;
        else if (diff > 0.3) diff = 0.4;
        else if (diff > 0.1) diff = 0.2;
        else diff = 0.0;
        finalColor = color * diff;
        finalColor += ambient;
    }
    // Default to diffuse if no valid type is selected
    else {
        finalColor = color * diff;
        finalColor += ambient;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
