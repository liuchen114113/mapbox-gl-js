/*
* @Author: hydata
* @Date:   2018-05-30 17:57:59
* @Last Modified by:   hydata
* @Last Modified time: 2018-06-12 19:00:39
*/
//@flow
/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';

import  {
    Properties,
    DataConstantProperty,
    DataDrivenProperty,
    CrossFadedProperty
}  from '../properties';

import type Color from '../../style-spec/util/color';

export  type LayoutProps = {|
    "particleline-cap": DataConstantProperty<"butt" | "round" | "square">,
    "particleline-join": DataDrivenProperty<"bevel" | "round" | "miter">,
    "particleline-miter-limit": DataConstantProperty<number>,
    "particleline-round-limit": DataConstantProperty<number>,
|};

const layout: Properties<LayoutProps> = new Properties({
    "particleline-cap": new DataConstantProperty(styleSpec["layout_particleline"]["particleline-cap"]),
    "particleline-join": new DataDrivenProperty(styleSpec["layout_particleline"]["particleline-join"]),
    "particleline-miter-limit": new DataConstantProperty(styleSpec["layout_particleline"]["particleline-miter-limit"]),
    "particleline-round-limit": new DataConstantProperty(styleSpec["layout_particleline"]["particleline-round-limit"]),
});

export type PaintProps = {|
    "particleline-opacity": DataDrivenProperty<number>,
    "particleline-color": DataDrivenProperty<Color>,
    "particleline-translate": DataConstantProperty<[number, number]>,
    "particleline-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "particleline-width": DataDrivenProperty<number>,
    "particleline-gap-width": DataDrivenProperty<number>,
    "particleline-offset": DataDrivenProperty<number>,
    "particleline-blur": DataDrivenProperty<number>,
    "particleline-dasharray": CrossFadedProperty<Array<number>>,
    "particleline-pattern": CrossFadedProperty<string>,
    "particleline-speed-factor": DataDrivenProperty<number>,//增加speed-factor  数值类型
    "particleline-status": DataDrivenProperty<number>,
    "particleline-instatus": DataDrivenProperty<number>,
    "particleline-height-offset": DataDrivenProperty<number>,
    "particleline-interpolate": DataDrivenProperty<number>,
    "render-3d": DataDrivenProperty<boolean>,
|};

const paint: Properties<PaintProps> = new Properties({
    "particleline-opacity": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-opacity"]),
    "particleline-color": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-color"]),
    "particleline-translate": new DataConstantProperty(styleSpec["paint_particleline"]["particleline-translate"]),
    "particleline-translate-anchor": new DataConstantProperty(styleSpec["paint_particleline"]["particleline-translate-anchor"]),
    "particleline-width": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-width"]),
    "particleline-gap-width": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-gap-width"]),
    "particleline-offset": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-offset"]),
    "particleline-blur": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-blur"]),
    "particleline-dasharray": new CrossFadedProperty(styleSpec["paint_particleline"]["particleline-dasharray"]),
    "particleline-pattern": new CrossFadedProperty(styleSpec["paint_particleline"]["particleline-pattern"]),
    "render-3d": new DataConstantProperty(styleSpec["paint_particleline"]["render-3d"]),
    "particleline-interpolate": new DataConstantProperty(styleSpec["paint_particleline"]["particleline-interpolate"]),
    "particleline-status": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-status"]),
    "particleline-instatus": new DataDrivenProperty(styleSpec["paint_particleline"]["particleline-instatus"]),
    "particleline-height-offset": new DataConstantProperty(styleSpec["paint_particleline"]["particleline-height-offset"]),
    "particleline-speed-factor": new DataConstantProperty(styleSpec["paint_particleline"]["particleline-speed-factor"]),//增加speed-factor  数值类型
});

export default { paint, layout };