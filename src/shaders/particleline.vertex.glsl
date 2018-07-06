        // the distance over which the line edge fades out.
        // Retina devices need a smaller distance to avoid aliasing.
        #define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0
        // floor(127 / 2) == 63.0
        // the maximum allowed miter limit is 2.0 at the moment. the extrude normal is
        // stored in a byte (-128..127). we scale regular normals up to length 63, but
        // there are also \"special\" normals that have a bigger length (of up to 126 in
        // this case).
        // #define scale 63.0
        #define scale 0.015873016
        attribute vec2 a_pos;
        attribute vec4 a_data;
        attribute vec3 a_extra_m;
        uniform mat4 u_matrix;
        uniform mediump float u_ratio;
        uniform mediump float u_width;
        uniform vec2 u_gl_units_to_pixels;
        uniform vec4 u_speed_mat;
        varying vec2 v_normal;
        varying vec2 v_width2;
        varying float v_gamma_scale;
        varying float v_opacity;
        varying float v_discard;
        #pragma hymap: define lowp vec4 color
        #pragma hymap: define lowp float blur
        #pragma hymap: define lowp float opacity
        #pragma hymap: define mediump float gapwidth
        #pragma hymap: define lowp float offset
        void main() {
            #pragma hymap: initialize lowp vec4 color
            #pragma hymap: initialize lowp float blur
            #pragma hymap: initialize lowp float opacity
            #pragma hymap: initialize mediump float gapwidth
            #pragma hymap: initialize lowp float offset
            //处理我的附加库
            vec3 f_extra_m = vec3(a_extra_m[0] * 3.0 / 255.0,a_extra_m[1], a_extra_m[2]);
            float status = f_extra_m[2];
            float link_seq = f_extra_m[1];
            v_opacity = f_extra_m[0];
            float speed1 = u_speed_mat[0];
            float speed2 = u_speed_mat[1];
            float speed3 = u_speed_mat[2];
            float speed4 = u_speed_mat[3];
            if(status ==1.0){
            if(link_seq!=speed1){
                  v_discard = -100.0;
                   }else{
                      v_discard = 100.0;
                      }
                      }else if(status == 2.0)
                      {
                        if(link_seq!=speed2){
                          v_discard = -100.0;
                        }else{
                        v_discard = 100.0;
                        }
                      }else if(status == 3.0){
                         if(link_seq!=speed3){ 
                              v_discard = -100.0;
                            }else{
                              v_discard = 100.0;
                            } 
                            }else if(status == 4.0){
                            if(link_seq!=speed4){
                               v_discard = -100.0;
                            }else{
                               v_discard = 100.0;
                            }
                            }
                            vec2 a_extrude = a_data.xy - 128.0;
                            float a_direction = mod(a_data.z, 4.0) - 1.0;
                            // We store the texture normals in the most insignificant bit
                            // transform y so that 0 => -1 and 1 => 1
                            // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap
                            // y is 1 if the normal points up, and -1 if it points down
                             mediump vec2 normal = mod(a_pos, 2.0);
                             normal.y = sign(normal.y - 0.5);
                             v_normal = normal;
                             // these transformations used to be applied in the JS and native code bases.
                             // moved them into the shader for clarity and simplicity.
                             gapwidth = gapwidth / 2.0;
                             float width = u_width / 2.0;
                             offset = -1.0 * offset;
                             float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);
                             float outset = gapwidth + width * (gapwidth > 0.0 ? 2.0 : 1.0) + ANTIALIASING;
                             // Scale the extrusion vector down to a normal and then up by the line width
                             // of this vertex.
                             mediump vec2 dist = outset * a_extrude * scale;
                             // Calculate the offset when drawing a line that is to the side of the actual line.
                             // We do this by creating a vector that points towards the extrude, but rotate
                             // it when we're drawing round end points (a_direction = -1 or 1) since their
                             // extrude vector points in another direction.
                             mediump float u = 0.5 * a_direction;
                             mediump float t = 1.0 - abs(u);
                             mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);
                             // Remove the texture normal bit to get the position
                             vec2 pos = floor(a_pos * 0.5);
                             vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);
                             gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;
                             // calculate how much the perspective view squishes or stretches the extrude
                             float extrude_length_without_perspective = length(dist);
                             float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);
                             v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;
                             v_width2 = vec2(outset, inset);
                        }
                                 
