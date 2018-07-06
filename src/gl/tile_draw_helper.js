/*
 * @Description:  airline拓展
 * @Author: liuchen@hiynn.com
 * @Date: 2018-06-13 14:50:09
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-02 17:08:33
 */
// @flow

import {mat4} from 'gl-matrix';
import Texture from '../render/texture';
import Color from '../style-spec/util/color';
import DepthMode from '../gl/depth_mode';
import StencilMode from '../gl/stencil_mode';

function drawToExtrusionFramebuffer(painter, layer) {
    const context = painter.context;
    const gl = context.gl;

    let renderTarget = layer.viewportFrame;

    if (painter.depthRboNeedsClear) {
        painter.setupOffscreenDepthRenderbuffer();
    }

    if (!renderTarget) {
        const texture = new Texture(context, {width: painter.width, height: painter.height, data: null}, gl.RGBA);
        texture.bind(gl.LINEAR, gl.CLAMP_TO_EDGE);

        renderTarget = layer.viewportFrame = context.createFramebuffer(painter.width, painter.height);
        renderTarget.colorAttachment.set(texture.texture);
    }

    context.bindFramebuffer.set(renderTarget.framebuffer);
    renderTarget.depthAttachment.set(painter.depthRbo);

    if (painter.depthRboNeedsClear) {
        context.clear({depth: 1});
        painter.depthRboNeedsClear = false;
    }

    context.clear({color: Color.transparent});

    context.setStencilMode(StencilMode.disabled);
    context.setDepthMode(new DepthMode(gl.LEQUAL, DepthMode.ReadWrite, [0, 1]));
    context.setColorMode(painter.colorModeForRenderPass());
}

function drawExtrusionTexture(painter, layer) {
    const renderedTexture = layer.viewportFrame;
    if (!renderedTexture) return;

    const context = painter.context;
    const gl = context.gl;
    const program = painter.useProgram('extrusionTexture');

    context.setStencilMode(StencilMode.disabled);
    context.setDepthMode(DepthMode.disabled);
    context.setColorMode(painter.colorModeForRenderPass());

    context.activeTexture.set(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderedTexture.colorAttachment.get());
    if (typeof layer.paint.get(`${layer.type}-opacity`) === "object") {
        gl.uniform1f(program.uniforms.u_opacity, layer.paint.get(`${layer.type}-opacity`).value.value);
    } else {
        gl.uniform1f(program.uniforms.u_opacity, layer.paint.get(`${layer.type}-opacity`));
    }


    gl.uniform1i(program.uniforms.u_image, 0);

    const matrix = mat4.create();
    mat4.ortho(matrix, 0, painter.width, painter.height, 0, 0, 1);
    gl.uniformMatrix4fv(program.uniforms.u_matrix, false, matrix);

    gl.uniform2f(program.uniforms.u_world, gl.drawingBufferWidth, gl.drawingBufferHeight);

    painter.viewportVAO.bind(context, program, painter.viewportBuffer, []);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function destroy(e) {
    if (e && e.viewportFrame) {
        e.viewportFrame.destroy();
        e.viewportFrame = null;
    }
}

function setExtrusionOpacity() {
}

const tileDrawHelper = {
    drawToExtrusionFramebuffer,
    drawExtrusionTexture,
    setExtrusionOpacity,
    destroy
};
export default tileDrawHelper;
