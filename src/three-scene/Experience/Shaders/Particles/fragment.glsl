varying vec3 vColor;
void main() {

//    float distanceToCenter = length(gl_PointCoord - 0.5);
//    if(distanceToCenter > 0.5)
//        discard;

    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.05 / distanceToCenter - 0.95;

    gl_FragColor = vec4(vColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
