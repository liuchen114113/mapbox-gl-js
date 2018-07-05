attribute vec2 a_pos;

uniform mat4 u_matrix;

#pragma curvemap: define highp vec4 color
#pragma curvemap: define lowp float opacity

void main() {
    #pragma curvemap: initialize highp vec4 color
    #pragma curvemap: initialize lowp float opacity

    gl_Position = u_matrix * vec4(a_pos, 0, 1);
}
