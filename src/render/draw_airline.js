/*
 * @Description:  绘制航线
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-19 10:37:22
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-19 10:37:49
 */
// @flow

// import browser from '../util/browser';

import pixelsToTileUnits from '../source/pixels_to_tile_units';
// import DepthMode from '../gl/depth_mode';
// import Texture from './texture';
import tileDrawHelper from '../gl/tile_draw_helper';

import type Painter from './painter';
import type SourceCache from '../source/source_cache';
import type AirLineStyleLayer from '../style/style_layer/airline_style_layer';
import type LineBucket from '../data/bucket/line_bucket';
import type {OverscaledTileID} from '../source/tile_id';

let segmentGroup = 20;
let discardLine = 0;
export default function drawLine(painter: Painter, sourceCache: SourceCache, layer: AirLineStyleLayer, coords: Array<OverscaledTileID>) {
    if (layer.paint.get("airline-opacity") !== 0) {
        if (painter.renderPass === 'offscreen') {
            tileDrawHelper.drawToExtrusionFramebuffer(painter, layer);
            segmentGroup = layer.paint.get("airline-seg-group") || 20;
            discardLine = layer.paint.get("airline-type") === "none" ? 0 : 1;
            if (layer.paint.get("airline-type") === "real-time") {
                if (!this.count) {
                    this.start = (new Date()).getTime();
                    this.count = 1;
                }
                this.end = (new Date()).getTime();
                if (this.end - this.start >= 1000 / layer.paint.get("airline-speed")) {
                    this.count += 1;
                    this.start = this.end;
                }
            }
            let prevTileZoom;
            let firstTile = true;

            for (const coord of coords) {
                const tile = sourceCache.getTile(coord);
                const bucket: ?LineBucket = (tile.getBucket(layer): any);
                if (!bucket) continue;

                const programConfiguration = bucket.programConfigurations.get(layer.id);
                const prevProgram = painter.context.program.get();
                const program = painter.useProgram("airline", programConfiguration);
                const programChanged = firstTile || program.program !== prevProgram;
                const tileRatioChanged = prevTileZoom !== tile.tileID.overscaledZ;

                if (programChanged) {
                    programConfiguration.setUniforms(painter.context, program, layer.paint, {zoom: painter.transform.zoom});
                }
                drawLineTile(program, painter, tile, bucket, layer, coord, programConfiguration, programChanged, tileRatioChanged, this.count);
                prevTileZoom = tile.tileID.overscaledZ;
                firstTile = false;
            }
        } else {
            if (painter.renderPass === "translucent") {
                tileDrawHelper.drawExtrusionTexture(painter, layer);
            }
        }
    }
}

function drawLineTile(program, painter, tile, bucket, layer, coord, programConfiguration, programChanged, tileRatioChanged, count) {
    const context = painter.context;
    const gl = context.gl;
    if (programChanged || tileRatioChanged) {
        gl.uniform2f(program.uniforms.u_gl_units_to_pixels, 1 / painter.transform.pixelsToGLUnits[0], 1 / painter.transform.pixelsToGLUnits[1]);
    }
    gl.uniform1f(program.uniforms.u_start, count - segmentGroup);
    gl.uniform1f(program.uniforms.u_segments, segmentGroup);
    gl.uniform1f(program.uniforms.u_discard, discardLine);
    context.setStencilMode(painter.stencilModeForClipping(coord));
    const p = painter.translatePosMatrix(coord.posMatrix, tile, layer.paint.get("airline-translate"), layer.paint.get("airline-translate-anchor"));
    gl.uniformMatrix4fv(program.uniforms.u_matrix, false, p);
    gl.uniform1f(program.uniforms.u_ratio, 1 / pixelsToTileUnits(tile, 1, painter.transform.zoom));
    program.draw(context, gl.TRIANGLES, layer.id, bucket.layoutVertexBuffer, bucket.indexBuffer, bucket.segments, programConfiguration);
}
