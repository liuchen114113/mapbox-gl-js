varying vec4 v_color;
#pragma curvemap: define lowp float base
#pragma curvemap: define lowp float height
#pragma curvemap: define highp vec4 color

void main() {
    #pragma curvemap: initialize lowp float base
    #pragma curvemap: initialize lowp float height
    #pragma curvemap: initialize highp vec4 color

    gl_FragColor = v_color;

#ifdef OVERDRAW_INSPECTOR
    gl_FragColor = vec4(1.0);
#endif
}
