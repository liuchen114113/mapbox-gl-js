/*
 * @Description:   绘制动态线
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-19 14:19:01
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-06 14:01:50
 */

// @flow

import browser from '../util/browser';
import config from '../util/config';

import pixelsToTileUnits from '../source/pixels_to_tile_units';
import DepthMode from '../gl/depth_mode';
// import Texture from './texture';
// import tileDrawHelper from '../gl/tile_draw_helper';

import type Painter from './painter';
import type SourceCache from '../source/source_cache';
import type DynamicLineStyleLayer from '../style/style_layer/dynamicLine_style_layer';
// import type LineBucket from '../data/bucket/line_bucket';
import type {OverscaledTileID} from '../source/tile_id';

let segmentGroup = 20;
// let discardLine = 0;
export default function drawLine(painter: Painter, sourceCache: SourceCache, layer: DynamicLineStyleLayer, coords: Array<OverscaledTileID>) {
    const width = layer.paint.get('dynamicLine-width');
    if (layer.paint.get("dynamicLine-opacity").constantOr(1) !== 0 && width.constantOr(1) !== 0) {
        if (painter.renderPass === 'translucent') {
            const n = painter.context;
            n.setDepthMode(painter.depthModeForSublayer(0, DepthMode.ReadOnly));
            n.setColorMode(painter.colorModeForRenderPass());

            segmentGroup = layer.paint.get("dynamicLine-seg-group") || 20;
            layer.histEnd = (new Date()).getTime();
            if (!layer.first) {
                layer.first = true;
                layer.histStart = 0;
                layer.histCount = 0;
            }
            if (layer.histEnd - layer.histStart >= 1000 / layer.paint.get("dynamicLine-speed")) {
                layer.histCount++;
                if (config.TRW) {
                    config.TRW.setProgress(this.histCount);
                }
                layer.histStart = layer.histEnd;
            }
            let prevTileZoom;
            let firstTile = true;

            for (const coord of coords) {
                const tile = sourceCache.getTile(coord);
                const bucket = tile.getBucket(layer);
                if (!bucket) continue;

                const programConfiguration = bucket.programConfigurations.get(layer.id);
                const prevProgram = painter.context.program.get();
                const program = painter.useProgram("dynamicLine", programConfiguration);
                const programChanged = firstTile || program.program !== prevProgram;
                const tileRatioChanged = prevTileZoom !== tile.tileID.overscaledZ;

                if (programChanged) {
                    programConfiguration.setUniforms(painter.context, program, layer.paint, {zoom: painter.transform.zoom});
                }
                drawLineTile(program, painter, tile, bucket, layer, coord, programConfiguration, programChanged, tileRatioChanged, layer.histCount);
                prevTileZoom = tile.tileID.overscaledZ;
                firstTile = false;
            }
        }
    }
}

function drawLineTile(program, painter, tile, bucket, layer, coord, programConfiguration, programChanged, tileRatioChanged, f) {
    const context = painter.context;
    const gl = context.gl;
    const dasharray = layer.paint.get('dynamicLine-dasharray');
    const image = layer.paint.get('dynamicLine-pattern');

    let posA, posB, imagePosA, imagePosB;

    if (programChanged || tileRatioChanged) {
        const tileRatio = 1 / pixelsToTileUnits(tile, 1, painter.transform.tileZoom);

        if (dasharray) {
            posA = painter.lineAtlas.getDash(dasharray.from, layer.layout.get('dynamicLine-cap') === 'round');
            posB = painter.lineAtlas.getDash(dasharray.to, layer.layout.get('dynamicLine-cap') === 'round');

            const widthA = posA.width * dasharray.fromScale;
            const widthB = posB.width * dasharray.toScale;

            gl.uniform2f(program.uniforms.u_patternscale_a, tileRatio / widthA, -posA.height / 2);
            gl.uniform2f(program.uniforms.u_patternscale_b, tileRatio / widthB, -posB.height / 2);
            gl.uniform1f(program.uniforms.u_sdfgamma, painter.lineAtlas.width / (Math.min(widthA, widthB) * 256 * browser.devicePixelRatio) / 2);

        } else if (image) {
            imagePosA = painter.imageManager.getPattern(image.from);
            imagePosB = painter.imageManager.getPattern(image.to);
            if (!imagePosA || !imagePosB) return;

            gl.uniform2f(program.uniforms.u_pattern_size_a, imagePosA.displaySize[0] * image.fromScale / tileRatio, imagePosA.displaySize[1]);
            gl.uniform2f(program.uniforms.u_pattern_size_b, imagePosB.displaySize[0] * image.toScale / tileRatio, imagePosB.displaySize[1]);

            const {width, height} = painter.imageManager.getPixelSize();
            gl.uniform2fv(program.uniforms.u_texsize, [width, height]);
        }

        gl.uniform2f(program.uniforms.u_gl_units_to_pixels, 1 / painter.transform.pixelsToGLUnits[0], 1 / painter.transform.pixelsToGLUnits[1]);
    }

    if (programChanged) {

        if (dasharray) {
            gl.uniform1i(program.uniforms.u_image, 0);
            context.activeTexture.set(gl.TEXTURE0);
            painter.lineAtlas.bind(context);

            gl.uniform1f(program.uniforms.u_tex_y_a, (posA: any).y);
            gl.uniform1f(program.uniforms.u_tex_y_b, (posB: any).y);
            gl.uniform1f(program.uniforms.u_mix, dasharray.t);

        } else if (image) {
            gl.uniform1i(program.uniforms.u_image, 0);
            context.activeTexture.set(gl.TEXTURE0);
            painter.imageManager.bind(context);

            gl.uniform2fv(program.uniforms.u_pattern_tl_a, (imagePosA: any).tl);
            gl.uniform2fv(program.uniforms.u_pattern_br_a, (imagePosA: any).br);
            gl.uniform2fv(program.uniforms.u_pattern_tl_b, (imagePosB: any).tl);
            gl.uniform2fv(program.uniforms.u_pattern_br_b, (imagePosB: any).br);
            gl.uniform1f(program.uniforms.u_fade, image.t);
        }
    }

    context.setStencilMode(painter.stencilModeForClipping(coord));

    const posMatrix = painter.translatePosMatrix(coord.posMatrix, tile, layer.paint.get('dynamicLine-translate'), layer.paint.get('dynamicLine-translate-anchor'));
    gl.uniformMatrix4fv(program.uniforms.u_matrix, false, posMatrix);

    gl.uniform1f(program.uniforms.u_ratio, 1 / pixelsToTileUnits(tile, 1, painter.transform.zoom));

    gl.uniform1f(program.uniforms.u_count, f);
    gl.uniform1f(program.uniforms.u_segments, segmentGroup);

    program.draw(
        context,
        gl.TRIANGLES,
        layer.id,
        bucket.layoutVertexBuffer,
        bucket.indexBuffer,
        bucket.segments,
        programConfiguration);
}
