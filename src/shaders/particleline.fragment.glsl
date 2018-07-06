#pragma hymap: define lowp vec4 color
#pragma hymap: define lowp float blur
#pragma hymap: define lowp float opacity
varying vec2 v_width2;
varying vec2 v_normal;
varying float v_gamma_scale;
varying float v_discard;
varying float v_opacity;
void main() {
   #pragma hymap: initialize lowp vec4 color
       #pragma hymap: initialize lowp float blur
           #pragma hymap: initialize lowp float opacity

               if(v_discard<0.0){
                       discard;
                           }
                      float opacity_m = v_opacity;
                      // Calculate the distance of the pixel from the line in pixels.
                      float dist = length(v_normal) * v_width2.s;

                      // Calculate the antialiasing fade factor. This is either when fading in
                      // the line in case of an offset line (v_width2.t) or when fading out
                      // (v_width2.s)
                      float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) *v_gamma_scale;
                      float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) /blur2,0.0, 1.0);
                      gl_FragColor = color * (alpha * opacity) * opacity_m;

                      #ifdef OVERDRAW_INSPECTOR
                      gl_FragColor = vec4(1.0);
                      #endif
                 }
