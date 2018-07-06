// @flow
/*
 * @Author: hydata
 * @Date:   2018-06-04 17:18:36
 * @Last Modified by:   hydata
 * @Last Modified time: 2018-06-20 09:24:01
 */


// import browser from '../util/browser';
import pixelsToTileUnits from '../source/pixels_to_tile_units';
import DepthMode from '../gl/depth_mode';
import type Painter from './painter';
import type SourceCache from '../source/source_cache';
import type ParticleLineStyleLayer from '../style/style_layer/particleline_style_layer';
// import type ParticleLineBucket from '../data/bucket/particleline_bucket';
import tileDrawHelper from '../gl/tile_draw_helper';
import type {
    OverscaledTileID
} from '../source/tile_id';


const curEleObj = {
    speedExt1: 2,
    speedExt2: 4,
    speedExt3: 5,
    speedExt4: 6,
    getCalculatedSpeed: function (e, r) {
        return parseInt(r[`speed${e}`] / e / this[`speedExt${e}`]);
    }
};

export default function drawParticleLine(painter: Painter, sourceCache: SourceCache, layer: ParticleLineStyleLayer, coords: Array<OverscaledTileID>) {
    const o = layer.paint.get("render-3d");
    if (painter.renderPass === "translucent" || o) {
        if (layer.paint.get("particleline-opacity").constantOr(1) !== 0) {
            const s = painter.context;
            s.setDepthMode(painter.depthModeForSublayer(0, DepthMode.ReadOnly));
            s.setColorMode(painter.colorModeForRenderPass());
            let a;
            let n = true;
            if (o)
                if (painter.renderPass === "offscreen") {
                    const p = layer.paint.get("particleline-speed-factor");
                    if (!layer.hasOwnProperty(`speed${p}`)) {
                        layer[`speed${p}`] = 0;
                        layer[`speed${p}`] += 2;
                        layer[`speed${p}`] %= p === 1 ? 20 : p === 2 ? 80 : p === 3 ? 150 : 240;
                        tileDrawHelper.drawToExtrusionFramebuffer(painter, layer);
                    }
                    for (let l = 0, d = coords; l < d.length; l += 1) {
                        const u = d[l];
                        const f = sourceCache.getTile(u);
                        const g = f.getBucket(layer);
                        if (g) {
                            const c = g.programConfigurations.get(layer.id);
                            const m = painter.context.program.get();
                            const x = painter.useProgram("particleline3d", c);
                            const v = n || x.program !== m;
                            const _ = a !== f.tileID.overscaledZ;
                            if (v) {
                                c.setUniforms(painter.context, x, layer.paint, {
                                    zoom: painter.transform.zoom
                                });
                                drawLineTile(x, painter, f, g, layer, u, c, v, _);
                                a = f.tileID.overscaledZ;
                                n = false;
                            }
                        }
                    }
                } else painter.renderPass === "translucent" && tileDrawHelper.drawExtrusionTexture(painter, layer);
            else {
                const h = layer.paint.get("particleline-speed-factor");
                layer.hasOwnProperty(`speed${h}`) || (layer[`speed${h}`] = 0), layer[`speed${h}`] += 1, layer[`speed${h}`] %= h === 1 ? 20 : h === 2 ? 80 : h === 3 ? 150 : 240;
                for (let w = 0, T = coords; w < T.length; w += 1) {
                    const E = T[w];
                    const M = sourceCache.getTile(E);
                    const D = M.getBucket(layer);
                    if (D) {
                        const b = D.programConfigurations.get(layer.id);
                        const C = painter.context.program.get();
                        const O = painter.useProgram("particleline", b);
                        const P = n || O.program !== C;
                        const S = a !== M.tileID.overscaledZ;
                        if (P) {
                            b.setUniforms(painter.context, O, layer.paint, {
                                zoom: painter.transform.zoom
                            });
                        }
                        drawLineTile(O, painter, M, D, layer, E, b, P, S);
                        a = M.tileID.overscaledZ;
                        n = !1;
                    }
                }
            }
        }
    }
}

function drawLineTile(program, painter, tile, bucket, layer, coord, programConfiguration, programChanged, tileRatioChanged) {
    const context = painter.context;
    const gl = context.gl;
    if (programChanged || tileRatioChanged) {
        gl.uniform2f(program.uniforms.u_gl_units_to_pixels, 1 / painter.transform.pixelsToGLUnits[0], 1 / painter.transform.pixelsToGLUnits[1]);
    }
    gl.uniform1f(program.uniforms.u_interpolate, layer.paint.get("particleline-interpolate"));
    gl.uniform1f(program.uniforms.u_height_offset, layer.paint.get("particleline-height-offset"));
    context.setStencilMode(painter.stencilModeForClipping(coord));
    gl.uniform4f(program.uniforms.u_speed_mat,
        curEleObj.getCalculatedSpeed(1, layer),
        curEleObj.getCalculatedSpeed(2, layer),
        curEleObj.getCalculatedSpeed(3, layer),
        curEleObj.getCalculatedSpeed(4, layer));
    const posMatrix = painter.translatePosMatrix(coord.posMatrix, tile, layer.paint.get("particleline-translate"), layer.paint.get("particleline-translate-anchor"));
    gl.uniformMatrix4fv(program.uniforms.u_matrix, false, posMatrix);
    gl.uniform1f(program.uniforms.u_ratio, 1 / pixelsToTileUnits(tile, 1, painter.transform.zoom));


    program.draw(
        context,
        gl.TRIANGLES,
        layer.id,
        bucket.layoutVertexBuffer,
        bucket.indexBuffer,
        bucket.segments,
        programConfiguration);
}

