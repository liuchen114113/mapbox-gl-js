// @flow

import {mat3, vec3} from 'gl-matrix';

// import {
//     isPatternMissing,
//     setPatternUniforms,
//     prepare as preparePattern
// } from './pattern';
import colorParser from 'csscolorparser';
// import Texture from './texture';
// import Color from '../style-spec/util/color';
import config from '../util/config';
// import DepthMode from '../gl/depth_mode';

// import StencilMode from '../gl/stencil_mode';
import tileDrawHelper from '../gl/tile_draw_helper';

import type Painter from './painter';
import type SourceCache from '../source/source_cache';
import type HistogramStyleLayer from '../style/style_layer/histogram_style_layer';
import type HistogramBucket from '../data/bucket/histogram_bucket';
import type {OverscaledTileID} from '../source/tile_id';

export default draw;

function draw(painter: Painter, source: SourceCache, layer: HistogramStyleLayer, coords: Array<OverscaledTileID>) {
    if (layer.paint.get('histogram-opacity') === 0) {
        return;
    }

    if (layer.paint.get("histogram-dynamic")) {
        if (config.TRW && !config.TRW.stayStatic) {
            const i = Date.now() - layer._transform;
            layer._count += i / layer.paint.get("histogram-time") * 500;
            if (layer._count >= 500 * layer.paint.get("histogram-count")) {
                (layer._count = 0);
            }
            layer._transform = Date.now();
        } else {
            layer._transform = Date.now();
        }
    }

    if (painter.renderPass === 'offscreen') {
        // drawToExtrusionFramebuffer(painter, layer);
        tileDrawHelper.drawToExtrusionFramebuffer(painter, layer);
        let first = true;
        for (const coord of coords) {
            const tile = source.getTile(coord);
            const bucket: ?HistogramBucket = (tile.getBucket(layer): any);
            if (!bucket) continue;

            drawExtrusion(painter, source, layer, tile, coord, bucket, first);
            first = false;
        }
    } else if (painter.renderPass === 'translucent') {
        tileDrawHelper.drawExtrusionTexture(painter, layer);
    }
}


function drawExtrusion(painter, source, layer, tile, coord, bucket, first) {
    const context = painter.context;
    const gl = context.gl;
    if (bucket) {
        const u = layer.paint.get("histogram-dynamic");
        const f = layer.layout.get("histogram-color-render");
        let program = null;
        const prevProgram = painter.context.program.get();
        const programConfiguration = bucket.programConfigurations.get(layer.id);
        program = u ? painter.useProgram("histogramDynamic", programConfiguration) : painter.useProgram(f ? "histogramColor" : "histogram", programConfiguration);
        gl.uniform1f(program.uniforms.u_fluorescent, layer.paint.get("histogram-fluorescent"));
        (first || program.program !== prevProgram) && programConfiguration.setUniforms(context, program, layer.paint, {
            zoom: painter.transform.zoom
        });
        if (f) {
            const p = layer.paint.get("histogram-max-height");
            const _ = [];
            let x = 0;
            for (let h = layer.paint.get("histogram-colors"); x < h.length; x++) {
                const d = colorParser.parseCSSColor(h[x]);
                d[0] /= 255;
                d[1] /= 255;
                d[2] /= 255;
                _.push(d);
            }
            gl.uniform1f(program.uniforms.u_max_height, 3 * p);
            gl.uniform4fv(program.uniforms.u_color_a, _[0]);
            gl.uniform4fv(program.uniforms.u_color_b, _[1]);
            gl.uniform4fv(program.uniforms.u_color_c, _[2]);
            gl.uniform4fv(program.uniforms.u_color_d, _[3]);
            gl.uniform4fv(program.uniforms.u_color_e, _[4]);
        }
        u && gl.uniform1f(program.uniforms.u_dyn_count, layer._count);
        painter.context.gl.uniformMatrix4fv(program.uniforms.u_matrix, !1, painter.translatePosMatrix(coord.posMatrix, tile, layer.paint.get("histogram-translate"), layer.paint.get("histogram-translate-anchor")));
        gl.uniform1f(program.uniforms.u_is_max_length, layer.layout.get("histogram-max-height-render"));
        setLight(program, painter);
        program.draw(context, gl.TRIANGLES, layer.id, bucket.layoutVertexBuffer, bucket.indexBuffer, bucket.segments, programConfiguration);
    }
}

function setLight(program, painter) {
    const gl = painter.context.gl;
    const light = painter.style.light;

    const _lp = light.properties.get('position');
    const lightPos = [_lp.x, _lp.y, _lp.z];

    const lightMat = mat3.create();
    if (light.properties.get('anchor') === 'viewport') {
        mat3.fromRotation(lightMat, -painter.transform.angle);
    }
    vec3.transformMat3(lightPos, lightPos, lightMat);

    const color = light.properties.get('color');

    gl.uniform3fv(program.uniforms.u_lightpos, lightPos);
    gl.uniform1f(program.uniforms.u_lightintensity, light.properties.get('intensity'));
    gl.uniform3f(program.uniforms.u_lightcolor, color.r, color.g, color.b);
}
