// @flow

// We use brfs, a browserify transform, to inline shader sources during bundling. As a result:
// - readFileSync calls must be written out long-form
// - this module must use CommonJS rather than ES2015 syntax
/* eslint-disable prefer-template, no-path-concat, import/unambiguous, import/no-commonjs */

const fs = require('fs');

const shaders: {[string]: {fragmentSource: string, vertexSource: string}} = {
    prelude: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/_prelude.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/_prelude.vertex.glsl', 'utf8')
    },
    background: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/background.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/background.vertex.glsl', 'utf8')
    },
    backgroundPattern: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/background_pattern.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/background_pattern.vertex.glsl', 'utf8')
    },
    circle: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/circle.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/circle.vertex.glsl', 'utf8')
    },
    clippingMask: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/clipping_mask.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/clipping_mask.vertex.glsl', 'utf8')
    },
    heatmap: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/heatmap.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/heatmap.vertex.glsl', 'utf8')
    },
    heatmapTexture: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/heatmap_texture.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/heatmap_texture.vertex.glsl', 'utf8')
    },
    collisionBox: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/collision_box.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/collision_box.vertex.glsl', 'utf8')
    },
    collisionCircle: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/collision_circle.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/collision_circle.vertex.glsl', 'utf8')
    },
    debug: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/debug.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/debug.vertex.glsl', 'utf8')
    },
    fill: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill.vertex.glsl', 'utf8')
    },
    fillOutline: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill_outline.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill_outline.vertex.glsl', 'utf8')
    },
    fillOutlinePattern: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill_outline_pattern.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill_outline_pattern.vertex.glsl', 'utf8')
    },
    fillPattern: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill_pattern.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill_pattern.vertex.glsl', 'utf8')
    },
    fillExtrusion: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill_extrusion.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill_extrusion.vertex.glsl', 'utf8')
    },
    fillExtrusionPattern: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/fill_extrusion_pattern.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/fill_extrusion_pattern.vertex.glsl', 'utf8')
    },
    extrusionTexture: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/extrusion_texture.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/extrusion_texture.vertex.glsl', 'utf8')
    },
    hillshadePrepare: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/hillshade_prepare.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/hillshade_prepare.vertex.glsl', 'utf8')
    },
    hillshade: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/hillshade.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/hillshade.vertex.glsl', 'utf8')
    },
    line: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/line.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/line.vertex.glsl', 'utf8')
    },
    lineGradient: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/line_gradient.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/line_gradient.vertex.glsl', 'utf8')
    },
    linePattern: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/line_pattern.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/line_pattern.vertex.glsl', 'utf8')
    },
    lineSDF: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/line_sdf.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/line_sdf.vertex.glsl', 'utf8')
    },
    raster: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/raster.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/raster.vertex.glsl', 'utf8')
    },
    symbolIcon: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/symbol_icon.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/symbol_icon.vertex.glsl', 'utf8')
    },
    symbolSDF: {
        fragmentSource: fs.readFileSync(__dirname + '/../shaders/symbol_sdf.fragment.glsl', 'utf8'),
        vertexSource: fs.readFileSync(__dirname + '/../shaders/symbol_sdf.vertex.glsl', 'utf8')
    },
    airline: {
        fragmentSource: "#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n\r\nvarying vec2 v_width2;\r\nvarying vec2 v_normal;\r\nvarying float v_gamma_scale;\r\n\r\nvarying float _is_discard;\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n    if(_is_discard<0.0) discard;\r\n    // Calculate the distance of the pixel from the line in pixels.\r\n    float dist = length(v_normal) * v_width2.s;\r\n\r\n    // Calculate the antialiasing fade factor. This is either when fading in\r\n    // the line in case of an offset line (v_width2.t) or when fading out\r\n    // (v_width2.s)\r\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\r\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\r\n\r\n    gl_FragColor = color * (alpha * opacity);\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "\r\n\r\n// the distance over which the line edge fades out.\r\n// Retina devices need a smaller distance to avoid aliasing.\r\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\r\n\r\n// floor(127 / 2) == 63.0\r\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\r\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\r\n// there are also \"special\" normals that have a bigger length (of up to 126 in\r\n// this case).\r\n// #define scale 63.0\r\n#define scale 0.015873016\r\n\r\nattribute vec4 a_pos_normal;\r\nattribute vec4 a_data;\r\nattribute float a_height;\r\nattribute vec2 a_seq;  //hack me\r\n\r\nuniform mat4 u_matrix;\r\nuniform mediump float u_ratio;\r\nuniform vec2 u_gl_units_to_pixels;\r\n\r\n//hack me\r\nuniform float u_start;\r\nuniform float u_segments;\r\nuniform float u_discard;\r\n\r\nvarying vec2 v_normal;\r\nvarying vec2 v_width2;\r\nvarying float v_gamma_scale;\r\n\r\nvarying float _is_discard;\r\n\r\n#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n#pragma curvemap: define mediump float gapwidth\r\n#pragma curvemap: define lowp float offset\r\n#pragma curvemap: define mediump float width\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n    #pragma curvemap: initialize mediump float gapwidth\r\n    #pragma curvemap: initialize lowp float offset\r\n    #pragma curvemap: initialize mediump float width\r\n\r\n    float count = mod(u_start,a_seq[1]);\r\n\r\n    _is_discard = 100.0;\r\n     //hack me\r\n    if(u_discard == 1.0){\r\n        if((count+u_segments)<=a_seq[1] && (a_seq[0]<(count) || a_seq[0]>(count+u_segments))){\r\n             _is_discard = -100.0;\r\n        }else if((count+u_segments)>a_seq[1] && (a_seq[0]> (count+u_segments-a_seq[1]) && a_seq[0]<count)){\r\n             _is_discard = -100.0;\r\n        }\r\n    }\r\n\r\n    vec2 a_extrude = a_data.xy - 128.0;\r\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\r\n\r\n    vec2 pos = a_pos_normal.xy;\r\n\r\n    // x is 1 if it's a round cap, 0 otherwise\r\n    // y is 1 if the normal points up, and -1 if it points down\r\n    mediump vec2 normal = a_pos_normal.zw;\r\n    v_normal = normal;\r\n\r\n    // these transformations used to be applied in the JS and native code bases.\r\n    // moved them into the shader for clarity and simplicity.\r\n    gapwidth = gapwidth / 2.0;\r\n    float halfwidth = width / 2.0;\r\n    offset = -1.0 * offset;\r\n\r\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\r\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + ANTIALIASING;\r\n\r\n    // Scale the extrusion vector down to a normal and then up by the line width\r\n    // of this vertex.\r\n    mediump vec2 dist = outset * a_extrude * scale;\r\n\r\n    // Calculate the offset when drawing a line that is to the side of the actual line.\r\n    // We do this by creating a vector that points towards the extrude, but rotate\r\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\r\n    // extrude vector points in another direction.\r\n    mediump float u = 0.5 * a_direction;\r\n    mediump float t = 1.0 - abs(u);\r\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\r\n\r\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\r\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, a_height * 10.0, 1.0) + projected_extrude;\r\n\r\n    // calculate how much the perspective view squishes or stretches the extrude\r\n    float extrude_length_without_perspective = length(dist);\r\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\r\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\r\n\r\n    v_width2 = vec2(outset, inset);\r\n}\r\n"
    },
    dynamicLine: {
        fragmentSource: "#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n\r\nuniform float u_count;\r\nuniform float u_segments;\r\n\r\nvarying vec2 v_width2;\r\nvarying vec2 v_normal;\r\nvarying float v_gamma_scale;\r\n\r\nvarying float v_seq;\r\nvarying vec2 v_info;\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n\r\n    float total_count = v_info[0];\r\n    float offset_count = v_info[1];\r\n    // ä¸çŸ¥é“ä¸ºä»€ä¹ˆä¸€å®šè¦æŠŠv_seqå‡2æ‰èƒ½åŒ¹é…ä¸Š,ä¸ç†è§£\r\n    float actualSeq = v_seq - 2.0;\r\n    float actualCount = u_count + offset_count;\r\n    float quotient = floor(actualCount / (total_count + u_segments));\r\n    float mod1 = mod(quotient, 2.0);\r\n    float count = mod(actualCount, total_count + u_segments);\r\n    if(mod1 != 0.0){\r\n        count = total_count + u_segments - count;\r\n    }\r\n\r\n    float start = count - u_segments;\r\n    float end = count;\r\n\r\n    if(actualSeq<start || actualSeq>end){\r\n         discard;\r\n     }\r\n\r\n     mediump float drive_opacity = (actualSeq - start) / u_segments;\r\n     if(mod1 != 0.0){\r\n         drive_opacity = 1.0 - drive_opacity;\r\n     }\r\n\r\n    // Calculate the distance of the pixel from the line in pixels.\r\n    float dist = length(v_normal) * v_width2.s;\r\n\r\n    // Calculate the antialiasing fade factor. This is either when fading in\r\n    // the line in case of an offset line (v_width2.t) or when fading out\r\n    // (v_width2.s)\r\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\r\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\r\n\r\n    vec4 tmpColor = vec4(color.xyz, 0.25);\r\n    gl_FragColor = tmpColor * (alpha * opacity) * drive_opacity;\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "\r\n\r\n// the distance over which the line edge fades out.\r\n// Retina devices need a smaller distance to avoid aliasing.\r\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\r\n\r\n// floor(127 / 2) == 63.0\r\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\r\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\r\n// there are also \"special\" normals that have a bigger length (of up to 126 in\r\n// this case).\r\n// #define scale 63.0\r\n#define scale 0.015873016\r\n\r\nattribute vec4 a_pos_normal;\r\nattribute vec4 a_data;\r\nattribute float a_seq;\r\nattribute vec2 a_info;\r\n\r\nuniform mat4 u_matrix;\r\nuniform mediump float u_ratio;\r\nuniform vec2 u_gl_units_to_pixels;\r\n\r\nvarying vec2 v_normal;\r\nvarying vec2 v_width2;\r\nvarying float v_gamma_scale;\r\n\r\nvarying float v_seq;\r\nvarying vec2 v_info;\r\n\r\n#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n#pragma curvemap: define mediump float gapwidth\r\n#pragma curvemap: define lowp float offset\r\n#pragma curvemap: define mediump float width\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n    #pragma curvemap: initialize mediump float gapwidth\r\n    #pragma curvemap: initialize lowp float offset\r\n    #pragma curvemap: initialize mediump float width\r\n\r\n    v_seq = a_seq;\r\n    v_info = a_info;\r\n\r\n    vec2 a_extrude = a_data.xy - 128.0;\r\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\r\n\r\n    vec2 pos = a_pos_normal.xy;\r\n\r\n    // x is 1 if it's a round cap, 0 otherwise\r\n    // y is 1 if the normal points up, and -1 if it points down\r\n    mediump vec2 normal = a_pos_normal.zw;\r\n    v_normal = normal;\r\n\r\n    // these transformations used to be applied in the JS and native code bases.\r\n    // moved them into the shader for clarity and simplicity.\r\n    gapwidth = gapwidth / 2.0;\r\n    float halfwidth = width / 2.0;\r\n    offset = -1.0 * offset;\r\n\r\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\r\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + (halfwidth == 0.0 ? 0.0 : ANTIALIASING);\r\n\r\n    // Scale the extrusion vector down to a normal and then up by the line width\r\n    // of this vertex.\r\n    mediump vec2 dist = outset * a_extrude * scale;\r\n\r\n    // Calculate the offset when drawing a line that is to the side of the actual line.\r\n    // We do this by creating a vector that points towards the extrude, but rotate\r\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\r\n    // extrude vector points in another direction.\r\n    mediump float u = 0.5 * a_direction;\r\n    mediump float t = 1.0 - abs(u);\r\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\r\n\r\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\r\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\r\n\r\n    // calculate how much the perspective view squishes or stretches the extrude\r\n    float extrude_length_without_perspective = length(dist);\r\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\r\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\r\n\r\n    v_width2 = vec2(outset, inset);\r\n}\r\n"
    },
    particleline: {
        fragmentSource: "#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n\r\nvarying vec2 v_width2;\r\nvarying vec2 v_normal;\r\nvarying float v_gamma_scale;\r\nvarying float v_opacity;\r\nvarying float v_discard;\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n\r\n    if(v_discard<0.0){\r\n        discard;\r\n    }\r\n\r\n    float opacity_m = v_opacity;\r\n    // Calculate the distance of the pixel from the line in pixels.\r\n    float dist = length(v_normal) * v_width2.s;\r\n\r\n    // Calculate the antialiasing fade factor. This is either when fading in\r\n    // the line in case of an offset line (v_width2.t) or when fading out\r\n    // (v_width2.s)\r\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\r\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\r\n\r\n    gl_FragColor = color * (alpha * opacity) * opacity_m;\r\n\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "\r\n\r\n// the distance over which the line edge fades out.\r\n// Retina devices need a smaller distance to avoid aliasing.\r\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\r\n\r\n// floor(127 / 2) == 63.0\r\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\r\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\r\n// there are also \"special\" normals that have a bigger length (of up to 126 in\r\n// this case).\r\n// #define scale 63.0\r\n#define scale 0.015873016\r\n\r\nattribute vec4 a_pos_normal;\r\nattribute vec4 a_data;\r\nattribute vec3 a_extra_m;\r\n\r\nuniform mat4 u_matrix;\r\nuniform mediump float u_ratio;\r\nuniform vec2 u_gl_units_to_pixels;\r\nuniform vec4 u_speed_mat;\r\n\r\nvarying vec2 v_normal;\r\nvarying vec2 v_width2;\r\nvarying float v_gamma_scale;\r\nvarying float v_opacity;\r\nvarying float v_discard;\r\n\r\n#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n#pragma curvemap: define mediump float gapwidth\r\n#pragma curvemap: define lowp float offset\r\n#pragma curvemap: define mediump float width\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n    #pragma curvemap: initialize mediump float gapwidth\r\n    #pragma curvemap: initialize lowp float offset\r\n    #pragma curvemap: initialize mediump float width\r\n\r\n    //å¤„ç†æˆ‘çš„é™„åŠ åº“\r\n        vec3 f_extra_m = vec3(a_extra_m[0] * 3.0 / 255.0,a_extra_m[1], a_extra_m[2]);\r\n        float status = f_extra_m[2];\r\n        float link_seq = f_extra_m[1];\r\n        v_opacity = f_extra_m[0];\r\n\r\n        float speed1 = u_speed_mat[0];\r\n        float speed2 = u_speed_mat[1];\r\n        float speed3 = u_speed_mat[2];\r\n        float speed4 = u_speed_mat[3];\r\n\r\n        if(status ==1.0){\r\n            if(link_seq!=speed1){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status == 2.0){\r\n            if(link_seq!=speed2){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status == 3.0){\r\n            if(link_seq!=speed3){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status == 4.0){\r\n            if(link_seq!=speed4){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }\r\n\r\n    vec2 a_extrude = a_data.xy - 128.0;\r\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\r\n\r\n    vec2 pos = a_pos_normal.xy;\r\n\r\n    // x is 1 if it's a round cap, 0 otherwise\r\n    // y is 1 if the normal points up, and -1 if it points down\r\n    mediump vec2 normal = a_pos_normal.zw;\r\n    v_normal = normal;\r\n\r\n    // these transformations used to be applied in the JS and native code bases.\r\n    // moved them into the shader for clarity and simplicity.\r\n    gapwidth = gapwidth / 2.0;\r\n    float halfwidth = width / 2.0;\r\n    offset = -1.0 * offset;\r\n\r\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\r\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + ANTIALIASING;\r\n\r\n    // Scale the extrusion vector down to a normal and then up by the line width\r\n    // of this vertex.\r\n    mediump vec2 dist = outset * a_extrude * scale;\r\n\r\n    // Calculate the offset when drawing a line that is to the side of the actual line.\r\n    // We do this by creating a vector that points towards the extrude, but rotate\r\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\r\n    // extrude vector points in another direction.\r\n    mediump float u = 0.5 * a_direction;\r\n    mediump float t = 1.0 - abs(u);\r\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\r\n\r\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\r\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, 0.0, 1.0) + projected_extrude;\r\n\r\n    // calculate how much the perspective view squishes or stretches the extrude\r\n    float extrude_length_without_perspective = length(dist);\r\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\r\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\r\n\r\n    v_width2 = vec2(outset, inset);\r\n}\r\n"
    },
    particleline3d: {
        fragmentSource: "#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n\r\nuniform mediump float u_interpolate;\r\n\r\nvarying vec2 v_width2;\r\nvarying vec2 v_normal;\r\nvarying float v_gamma_scale;\r\nvarying float v_opacity;\r\nvarying float v_discard;\r\nvarying vec3 v_color;\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n\r\n    if(v_discard<0.0){\r\n        discard;\r\n    }\r\n\r\n    float opacity_m = v_opacity;\r\n    // Calculate the distance of the pixel from the line in pixels.\r\n    float dist = length(v_normal) * v_width2.s;\r\n\r\n    // Calculate the antialiasing fade factor. This is either when fading in\r\n    // the line in case of an offset line (v_width2.t) or when fading out\r\n    // (v_width2.s)\r\n    float blur2 = (blur + 1.0 / DEVICE_PIXEL_RATIO) * v_gamma_scale;\r\n    float alpha = clamp(min(dist - (v_width2.t - blur2), v_width2.s - dist) / blur2, 0.0, 1.0);\r\n\r\n    if(u_interpolate == 1.0){\r\n        gl_FragColor = vec4(v_color,1.0) * (alpha * opacity) * opacity_m ;\r\n    }else{\r\n        gl_FragColor = color * (alpha * opacity) * opacity_m ;\r\n    }\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "\r\n\r\n// the distance over which the line edge fades out.\r\n// Retina devices need a smaller distance to avoid aliasing.\r\n#define ANTIALIASING 1.0 / DEVICE_PIXEL_RATIO / 2.0\r\n\r\n// floor(127 / 2) == 63.0\r\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\r\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\r\n// there are also \"special\" normals that have a bigger length (of up to 126 in\r\n// this case).\r\n// #define scale 63.0\r\n#define scale 0.015873016\r\n\r\nattribute vec4 a_pos_normal;\r\nattribute vec4 a_data;\r\nattribute vec3 a_extra_m;\r\nattribute vec2 a_i_p_e;\r\n\r\nuniform mat4 u_matrix;\r\nuniform mediump float u_ratio;\r\nuniform vec2 u_gl_units_to_pixels;\r\nuniform vec4 u_speed_mat;\r\nuniform mediump float u_interpolate;\r\nuniform mat4 u_interp_colors;\r\nuniform float u_height_offset;\r\n\r\nvarying vec2 v_normal;\r\nvarying vec2 v_width2;\r\nvarying float v_gamma_scale;\r\nvarying float v_opacity;\r\nvarying float v_discard;\r\nvarying vec3 v_color;\r\n\r\nvec3 my_colors[3];\r\n\r\n#pragma curvemap: define highp vec4 color\r\n#pragma curvemap: define lowp float blur\r\n#pragma curvemap: define lowp float opacity\r\n#pragma curvemap: define mediump float gapwidth\r\n#pragma curvemap: define lowp float offset\r\n#pragma curvemap: define mediump float width\r\n#pragma curvemap: define lowp float instatus\r\n#pragma curvemap: define lowp float status\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize highp vec4 color\r\n    #pragma curvemap: initialize lowp float blur\r\n    #pragma curvemap: initialize lowp float opacity\r\n    #pragma curvemap: initialize mediump float gapwidth\r\n    #pragma curvemap: initialize lowp float offset\r\n    #pragma curvemap: initialize mediump float width\r\n    #pragma curvemap: initialize lowp float instatus\r\n    #pragma curvemap: initialize lowp float status\r\n\r\n my_colors[0] = vec3(63,180,193);\r\n my_colors[1] = vec3(210,239,37);\r\n my_colors[2] = vec3(250,119,46);\r\n    if(u_interpolate == 1.0){\r\n\r\n        vec3 inColor;\r\n        vec3 myColor;\r\n        if(instatus == 1.0){\r\n            inColor = my_colors[0];\r\n        }else if(instatus == 2.0){\r\n            inColor = my_colors[1];\r\n        }else if(instatus == 3.0){\r\n            inColor = my_colors[2];\r\n        }else{\r\n            inColor = my_colors[2];\r\n        }\r\n\r\n        if(status == 1.0){\r\n            myColor  = my_colors[0];\r\n        }else if(status == 2.0){\r\n            myColor = my_colors[1];\r\n        }else if(status == 3.0){\r\n            myColor = my_colors[2];\r\n        }else{\r\n            myColor = my_colors[2];\r\n        }\r\n\r\n        v_color = get_interp_color(inColor, myColor, a_i_p_e[1]/100.0);\r\n    }\r\n\r\n    //处理我的附加库\r\n        vec3 f_extra_m = vec3(a_extra_m[0] * 3.0 / 255.0,a_extra_m[1], a_extra_m[2]);\r\n        float status1 = f_extra_m[2];\r\n        float link_seq = f_extra_m[1];\r\n        v_opacity = f_extra_m[0];\r\n\r\n        float speed1 = u_speed_mat[0];\r\n        float speed2 = u_speed_mat[1];\r\n        float speed3 = u_speed_mat[2];\r\n        float speed4 = u_speed_mat[3];\r\n\r\n        if(status1 ==1.0){\r\n            if(link_seq!=speed1){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status1 == 2.0){\r\n            if(link_seq!=speed2){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status1 == 3.0){\r\n            if(link_seq!=speed3){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }else if(status1 == 4.0){\r\n            if(link_seq!=speed4){\r\n                 v_discard = -100.0;\r\n            }else{\r\n                v_discard = 100.0;\r\n            }\r\n        }\r\n\r\n    vec2 a_extrude = a_data.xy - 128.0;\r\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\r\n\r\n    vec2 pos = a_pos_normal.xy;\r\n\r\n    // x is 1 if it's a round cap, 0 otherwise\r\n    // y is 1 if the normal points up, and -1 if it points down\r\n    mediump vec2 normal = a_pos_normal.zw;\r\n    v_normal = normal;\r\n\r\n    // these transformations used to be applied in the JS and native code bases.\r\n    // moved them into the shader for clarity and simplicity.\r\n    gapwidth = gapwidth / 2.0;\r\n    float halfwidth = width / 2.0;\r\n    offset = -1.0 * offset;\r\n\r\n    float inset = gapwidth + (gapwidth > 0.0 ? ANTIALIASING : 0.0);\r\n    float outset = gapwidth + halfwidth * (gapwidth > 0.0 ? 2.0 : 1.0) + ANTIALIASING;\r\n\r\n    // Scale the extrusion vector down to a normal and then up by the line width\r\n    // of this vertex.\r\n    mediump vec2 dist = outset * a_extrude * scale;\r\n\r\n    // Calculate the offset when drawing a line that is to the side of the actual line.\r\n    // We do this by creating a vector that points towards the extrude, but rotate\r\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\r\n    // extrude vector points in another direction.\r\n    mediump float u = 0.5 * a_direction;\r\n    mediump float t = 1.0 - abs(u);\r\n    mediump vec2 offset2 = offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\r\n\r\n    vec4 projected_extrude = u_matrix * vec4(dist / u_ratio, 0.0, 0.0);\r\n    gl_Position = u_matrix * vec4(pos + offset2 / u_ratio, a_i_p_e[0] / 10.0 + u_height_offset / 10.0, 1.0) + projected_extrude;\r\n\r\n    // calculate how much the perspective view squishes or stretches the extrude\r\n    float extrude_length_without_perspective = length(dist);\r\n    float extrude_length_with_perspective = length(projected_extrude.xy / gl_Position.w * u_gl_units_to_pixels);\r\n    v_gamma_scale = extrude_length_without_perspective / extrude_length_with_perspective;\r\n\r\n    v_width2 = vec2(outset, inset);\r\n}\r\n"
    },
    histogram: {
        fragmentSource: "varying vec4 v_color;\r\n#pragma curvemap: define lowp float base\r\n#pragma curvemap: define lowp float height\r\n#pragma curvemap: define highp vec4 color\r\nvarying float v_opacity;\r\nvoid main() {\r\n    #pragma curvemap: initialize lowp float base\r\n    #pragma curvemap: initialize lowp float height\r\n    #pragma curvemap: initialize highp vec4 color\r\n\r\n    gl_FragColor = v_color * v_opacity;\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "uniform mat4 u_matrix;\r\nuniform vec3 u_lightcolor;\r\nuniform lowp vec3 u_lightpos;\r\nuniform lowp float u_lightintensity;\r\nuniform float u_is_max_length;  // è§£å†³ç‰¹å¤§é«˜åº¦çš„æŸ±çŠ¶å›¾æ˜¾ç¤ºé—®é¢˜\r\nuniform float u_fluorescent;\r\n\r\nattribute vec2 a_pos;\r\nattribute vec4 a_normal_ed;\r\n\r\nvarying vec4 v_color;\r\n\r\n#pragma curvemap: define lowp float base\r\n#pragma curvemap: define lowp float height\r\n\r\n#pragma curvemap: define highp vec4 color\r\n\r\nvarying float v_opacity;\r\n\r\nvoid main() {\r\n    #pragma curvemap: initialize lowp float base\r\n    #pragma curvemap: initialize lowp float height\r\n    #pragma curvemap: initialize highp vec4 color\r\n\r\n    vec3 normal = a_normal_ed.xyz;\r\n\r\n    base = max(0.0, base);\r\n    height = max(0.0, height);\r\n\r\n    float t = mod(normal.x, 2.0);\r\n\r\n    gl_Position = u_matrix * vec4(a_pos, t > 0.0 ? ( u_is_max_length == 1.0 ? height * 100.0 : height ) : base * 100.0, 1);\r\n    if(t > 0.0){\r\n        v_opacity = 1.2;\r\n    }else{\r\n        v_opacity = 0.1;\r\n    }\r\n\r\n    // Relative luminance (how dark/bright is the surface color?)\r\n    float colorvalue = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;\r\n\r\n    v_color = vec4(0.0, 0.0, 0.0, 1.0);\r\n\r\n    // Add slight ambient lighting so no extrusions are totally black\r\n    vec4 ambientlight = vec4(0.03, 0.03, 0.03, 1.0);\r\n    color += ambientlight;\r\n\r\n    // Calculate cos(theta), where theta is the angle between surface normal and diffuse light ray\r\n    float directional = clamp(dot(normal / 16384.0, u_lightpos), 0.0, 1.0);\r\n\r\n    // Adjust directional so that\r\n    // the range of values for highlight/shading is narrower\r\n    // with lower light intensity\r\n    // and with lighter/brighter surface colors\r\n    directional = mix((1.0 - u_lightintensity), max((1.0 - colorvalue + u_lightintensity), 1.0), directional);\r\n\r\n    // Add gradient along z axis of side surfaces\r\n    if (normal.y != 0.0) {\r\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\r\n    }\r\n\r\n    // Assign final color based on surface + ambient light color, diffuse light directional, and light color\r\n    // with lower bounds adjusted to hue of light\r\n    // so that shading is tinted with the complementary (opposite) color to the light color\r\n    v_color.r += clamp(color.r * directional * u_lightcolor.r, mix(0.0, 0.3, 1.0 - u_lightcolor.r), 1.0);\r\n    v_color.g += clamp(color.g * directional * u_lightcolor.g, mix(0.0, 0.3, 1.0 - u_lightcolor.g), 1.0);\r\n    v_color.b += clamp(color.b * directional * u_lightcolor.b, mix(0.0, 0.3, 1.0 - u_lightcolor.b), 1.0);\r\n\r\n}\r\n"
    },
    histogramColor: {
        fragmentSource: "uniform vec4 u_color_a;\r\nuniform vec4 u_color_b;\r\nuniform vec4 u_color_c;\r\nuniform vec4 u_color_d;\r\nuniform vec4 u_color_e;\r\nuniform float u_max_height;\r\n#pragma curvemap: define lowp float base\r\n#pragma curvemap: define lowp float height\r\n#pragma curvemap: define highp vec4 color\r\nvarying float v_opacity;\r\nvarying float v_height;\r\nvarying float v_directional;\r\nvoid main() {\r\n    #pragma curvemap: initialize lowp float base\r\n    #pragma curvemap: initialize lowp float height\r\n    #pragma curvemap: initialize highp vec4 color\r\n\r\n    if (v_height < 0.25 * u_max_height) {\r\n        vec4 tmp = u_color_b - u_color_a;\r\n        vec4 real = tmp * ((v_height) / 0.25 / u_max_height) + u_color_a;\r\n        gl_FragColor = vec4(real.rgb * v_directional, 1.0);\r\n    } else if (v_height < 0.5 * u_max_height) {\r\n        vec4 tmp = u_color_c - u_color_b;\r\n        vec4 real = tmp * ((v_height - 0.25 * u_max_height) / 0.25 / u_max_height) + u_color_b;\r\n        gl_FragColor = vec4(real.rgb * v_directional, 1.0);\r\n    } else if (v_height < 0.75 * u_max_height) {\r\n        vec4 tmp = u_color_d - u_color_c;\r\n        vec4 real = tmp * ((v_height - 0.5 * u_max_height) / 0.25 / u_max_height) + u_color_c;\r\n        gl_FragColor = vec4(real.rgb * v_directional, 1.0);\r\n    } else if (v_height < 0.8 * u_max_height){\r\n        vec4 tmp = u_color_e - u_color_d;\r\n        vec4 real = tmp * ((v_height - 0.75 * u_max_height) / 0.25 / u_max_height) + u_color_d;\r\n        gl_FragColor = vec4(real.rgb * v_directional, 1.0);\r\n    } else{\r\n        gl_FragColor = vec4(u_color_e.rgb * v_directional, 1.0);\r\n    }\r\n\r\n#ifdef OVERDRAW_INSPECTOR\r\n    gl_FragColor = vec4(1.0);\r\n#endif\r\n}\r\n",
        vertexSource: "uniform mat4 u_matrix;\r\nuniform vec3 u_lightcolor;\r\nuniform lowp vec3 u_lightpos;\r\nuniform lowp float u_lightintensity;\r\nuniform float u_is_max_length;  // è§£å†³ç‰¹å¤§é«˜åº¦çš„æŸ±çŠ¶å›¾æ˜¾ç¤ºé—®é¢˜\r\n\r\nuniform float u_fluorescent;\r\n\r\nattribute vec2 a_pos;\r\nattribute vec4 a_normal_ed;\r\n\r\nvarying vec4 v_color;\r\n\r\n#pragma curvemap: define lowp float base\r\n#pragma curvemap: define lowp float height\r\n\r\n#pragma curvemap: define highp vec4 color\r\n\r\nvarying float v_opacity;\r\nvarying float v_height;\r\nvarying float v_directional;\r\nvoid main() {\r\n    #pragma curvemap: initialize lowp float base\r\n    #pragma curvemap: initialize lowp float height\r\n    #pragma curvemap: initialize highp vec4 color\r\n\r\n    vec3 normal = a_normal_ed.xyz;\r\n\r\n    base = max(0.0, base);\r\n    height = max(0.0, height);\r\n\r\n    float t = mod(normal.x, 2.0);\r\n\r\n    gl_Position = u_matrix * vec4(a_pos, t > 0.0 ? ( u_is_max_length == 1.0 ? height * 100.0 : height ) : base * 100.0, 1);\r\n    if(t > 0.0){\r\n        v_opacity = 1.2;\r\n        v_height = height*3.0;\r\n    }else{\r\n        v_opacity = 0.1;\r\n        v_height = 0.0;\r\n    }\r\n\r\n    // Relative luminance (how dark/bright is the surface color?)\r\n    float colorvalue = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;\r\n\r\n    v_color = vec4(0.0, 0.0, 0.0, 1.0);\r\n\r\n    // Add slight ambient lighting so no extrusions are totally black\r\n    vec4 ambientlight = vec4(0.03, 0.03, 0.03, 1.0);\r\n    color += ambientlight;\r\n\r\n    // Calculate cos(theta), where theta is the angle between surface normal and diffuse light ray\r\n    float directional = clamp(dot(normal / 16384.0, u_lightpos), 0.0, 1.0);\r\n\r\n    // Adjust directional so that\r\n    // the range of values for highlight/shading is narrower\r\n    // with lower light intensity\r\n    // and with lighter/brighter surface colors\r\n    directional = mix((1.0 - u_lightintensity), max((1.0 - colorvalue + u_lightintensity), 1.0), directional);\r\n\r\n    // Add gradient along z axis of side surfaces\r\n    if (normal.y != 0.0) {\r\n        directional *= clamp((t + base) * pow(height / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\r\n    }\r\n\r\n    // Assign final color based on surface + ambient light color, diffuse light directional, and light color\r\n    // with lower bounds adjusted to hue of light\r\n    // so that shading is tinted with the complementary (opposite) color to the light color\r\n    v_color.r += clamp(color.r * directional * u_lightcolor.r, mix(0.0, 0.3, 1.0 - u_lightcolor.r), 1.0);\r\n    v_color.g += clamp(color.g * directional * u_lightcolor.g, mix(0.0, 0.3, 1.0 - u_lightcolor.g), 1.0);\r\n    v_color.b += clamp(color.b * directional * u_lightcolor.b, mix(0.0, 0.3, 1.0 - u_lightcolor.b), 1.0);\r\n\r\n    if(u_fluorescent <= 0.0){\r\n        v_directional = directional;\r\n    }else{\r\n        v_directional = 1.0;\r\n    }\r\n\r\n\r\n}\r\n"
    }
};

// Expand #pragmas to #ifdefs.

const re = /#pragma curvemap: ([\w]+) ([\w]+) ([\w]+) ([\w]+)/g;

for (const programName in shaders) {
    const program = shaders[programName];
    const fragmentPragmas: {[string]: boolean} = {};

    program.fragmentSource = program.fragmentSource.replace(re, (match: string, operation: string, precision: string, type: string, name: string) => {
        fragmentPragmas[name] = true;
        if (operation === 'define') {
            return `
#ifndef HAS_UNIFORM_u_${name}
varying ${precision} ${type} ${name};
#else
uniform ${precision} ${type} u_${name};
#endif
`;
        } else /* if (operation === 'initialize') */ {
            return `
#ifdef HAS_UNIFORM_u_${name}
    ${precision} ${type} ${name} = u_${name};
#endif
`;
        }
    });

    program.vertexSource = program.vertexSource.replace(re, (match: string, operation: string, precision: string, type: string, name: string) => {
        const attrType = type === 'float' ? 'vec2' : 'vec4';
        if (fragmentPragmas[name]) {
            if (operation === 'define') {
                return `
#ifndef HAS_UNIFORM_u_${name}
uniform lowp float a_${name}_t;
attribute ${precision} ${attrType} a_${name};
varying ${precision} ${type} ${name};
#else
uniform ${precision} ${type} u_${name};
#endif
`;
            } else /* if (operation === 'initialize') */ {
                return `
#ifndef HAS_UNIFORM_u_${name}
    ${name} = unpack_mix_${attrType}(a_${name}, a_${name}_t);
#else
    ${precision} ${type} ${name} = u_${name};
#endif
`;
            }
        } else {
            if (operation === 'define') {
                return `
#ifndef HAS_UNIFORM_u_${name}
uniform lowp float a_${name}_t;
attribute ${precision} ${attrType} a_${name};
#else
uniform ${precision} ${type} u_${name};
#endif
`;
            } else /* if (operation === 'initialize') */ {
                return `
#ifndef HAS_UNIFORM_u_${name}
    ${precision} ${type} ${name} = unpack_mix_${attrType}(a_${name}, a_${name}_t);
#else
    ${precision} ${type} ${name} = u_${name};
#endif
`;
            }
        }
    });
}

module.exports = shaders;
