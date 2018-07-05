#pragma curvemap: define highp vec4 color
#pragma curvemap: define lowp float opacity

void main() {
    #pragma curvemap: initialize highp vec4 color
    #pragma curvemap: initialize lowp float opacity

    gl_FragColor = color * opacity;

#ifdef OVERDRAW_INSPECTOR
    gl_FragColor = vec4(1.0);
#endif
}
