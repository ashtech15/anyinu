uniform vec2 uResolution;
uniform float uSize;
uniform float uTime;
uniform vec2 uCursor;
uniform vec3 uCursorDirection;
uniform sampler2D uDisplacementTexture;
uniform vec2 uResolutionDisplacement;
uniform sampler2D uParticlesTexture;
uniform sampler2D uSolarSystemTexture;
uniform float uScroll;
uniform float uTotalSections;
uniform float uNormalizePoints[20];

varying vec2 vUv;
varying vec3 vColor;

attribute vec3 color;
attribute float a_size;
attribute vec2 aParticlesUv;
attribute vec2 aSolarSystemUv;

#include ../Includes/simplexNoise4d.glsl
#include ../Includes/simplexNoise3d.glsl

#ifdef USE_POINTS_UV

varying vec2 vUv;
uniform mat3 uvTransform;

#endif

#include <common>
#include <color_pars_vertex>
#include <morphtarget_pars_vertex>

float inOutProgress(vec3 position, vec3 target, float scrollProgress) {
    // Mixed position
    float noiseOrigin = simplexNoise3d(position * 0.2);
    float noiseTarget = simplexNoise3d(target * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, scrollProgress);
    noise = smoothstep(-1.0, 1.0, noise);

    float duration = 0.3;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, scrollProgress);

    return progress;
}

float remap(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
    return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
}

vec2 rotate2d(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

void main() {

    #ifdef USE_POINTS_UV

    vUv = (uvTransform * vec3(uv, 1)).xy;

    #endif

    #include <color_vertex>
    #include <morphcolor_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <project_vertex>



    vUv = uv;

    vec4 particleSim = texture(uParticlesTexture, aParticlesUv);
    vec4 particleSolarSystem = texture(uSolarSystemTexture, aParticlesUv);
    particleSolarSystem.x += 1.0;
    particleSolarSystem.xz = rotate2d(particleSolarSystem.xz, PI * uScroll);

    float time = uTime * 0.2;
    float range = 1.0 / uTotalSections;
    float cursorPointerActivation = 0.0;


    /** section points **/
    float section_2 = uNormalizePoints[1] / 2.0;
    float section_3 = uNormalizePoints[2];
    float section_4 = uNormalizePoints[3];
    float section_5 = uNormalizePoints[4];
    float section_6 = uNormalizePoints[5];
    float section_7 = uNormalizePoints[6];
    float section_8 = uNormalizePoints[7];
    float section_9 = uNormalizePoints[8];

    //float scrollProgress = clamp(uScroll * uTotalSections, 0.0, 1.0); // 0 -> 1 sections
    float scrollProgress = clamp(remap(uScroll, 0.0, section_2, 0.0, 1.0), 0.0, 1.0);// 0 -> 1 sections
    float pointSizeOnScroll = mix(1.0, 3.0, scrollProgress);// 0 -> 1 sections

    // Transform start position
    transformed.xyz *= 4.0;
    transformed.y += 0.9;
    transformed.x += 0.2;

    if ( uScroll < section_2 ) { // 0 -> 1 sections
        float inOutProgress = inOutProgress(transformed.xyz, particleSim.xyz, scrollProgress);// Mixed transform
        vec3 mixedPosition = mix(transformed, particleSim.xyz, inOutProgress);

        transformed.xyz = mixedPosition;
    } else if ( uScroll < section_5 ) {
        float inOutProgress = inOutProgress(transformed.xyz, particleSim.xyz, scrollProgress);// Mixed transform
        vec3 mixedPosition = mix(transformed, particleSim.xyz, inOutProgress);

        transformed.xyz = mixedPosition;

    } else if ( uScroll < section_6 ) {
        scrollProgress = clamp(remap(uScroll, section_5, section_6, 0.0, 1.0), 0.0, 1.0);
        pointSizeOnScroll = mix(3.0, 3.0, scrollProgress);
        cursorPointerActivation = scrollProgress;
        float inOutProgress = inOutProgress(particleSim.xyz, particleSolarSystem.xyz, scrollProgress);// Mixed transform
        vec3 mixedPosition = mix(particleSim.xyz, particleSolarSystem.xyz, inOutProgress);

        transformed.xyz = mixedPosition;
    } else if ( uScroll < section_7 || uScroll < 100.0) {
        scrollProgress = clamp(remap(uScroll, section_6, section_7, 0.0, 1.0), 0.0, 1.0);
        pointSizeOnScroll = mix(3.0, 3.0, scrollProgress);
        cursorPointerActivation = 1.0 - scrollProgress;
        float inOutProgress = inOutProgress(particleSolarSystem.xyz, particleSim.xyz, scrollProgress);// Mixed transform
        vec3 mixedPosition = mix(particleSolarSystem.xyz, particleSim.xyz, inOutProgress);

        transformed.xyz = mixedPosition;
    }

    // Rotate on Scroll
    transformed.xz = rotate2d(transformed.xz, PI2 * uScroll);


    // Final position
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vec4(transformed.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


//    // *** Cursor Displacement ***
//    // transformed to screen space x, y in range [0, 1] and z in range [0, 1]
//    vec2 displacementUV = (projectedPosition.xy / projectedPosition.w) * 0.5 + 0.5;
//    float displacementIntensity = texture(uDisplacementTexture, displacementUV).r;
//    displacementIntensity = clamp(displacementIntensity, 0.2, 1.0);
//    if (displacementIntensity <= 0.2) {
//        displacementIntensity = 0.0;
//    }
//    projectedPosition.xyz += displacementIntensity * (normal / 2.0) * cursorPointerActivation;
//    // *** Cursor Displacement END ***

    gl_Position = projectedPosition;

    // Point size
    float sizeIn = smoothstep(0.0, 0.1, particleSim.a);
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particleSim.a);
    float size = min(sizeIn, sizeOut);

    gl_PointSize = size * a_size * uSize * uResolution.y * pointSizeOnScroll;
    gl_PointSize *= (1.0 / - viewPosition.z);


    #include <worldpos_vertex>

    vColor = color;
}
