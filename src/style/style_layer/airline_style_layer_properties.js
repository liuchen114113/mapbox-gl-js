/*
 * @Description:  airline拓展
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-13 18:58:57 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-15 11:11:36
 */
// @flow
/* eslint-disable */


import styleSpec from '../../style-spec/reference/latest';

import {
    Properties,
    DataConstantProperty,
    DataDrivenProperty,
    CrossFadedProperty,
    ColorRampProperty,
    HeatmapColorProperty
} from '../properties';

import type Color from '../../style-spec/util/color';

export type LayoutProps = {
    "airline-cap": DataConstantProperty<"butt" | "round" | "square">,
    "airline-join": DataDrivenProperty<"bevel" | "round" | "miter">,
    "airline-miter-limit": DataConstantProperty<number>,
    "airline-round-limit": DataConstantProperty<number>
};

const layout: Properties<LayoutProps> = new Properties({
    "airline-cap": new DataConstantProperty(styleSpec["layout_airline"]["airline-cap"]),
    "airline-join": new DataDrivenProperty(styleSpec["layout_airline"]["airline-join"]),
    "airline-miter-limit": new DataConstantProperty(styleSpec["layout_airline"]["airline-miter-limit"]),
    "airline-round-limit": new DataConstantProperty(styleSpec["layout_airline"]["airline-round-limit"]),
});

export type PaintProps = {
    "airline-opacity": DataDrivenProperty<number>,
    "airline-color": DataDrivenProperty<Color>,
    "airline-translate": DataConstantProperty<[number, number]>,
    "airline-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "airline-width": DataDrivenProperty<number>,
    "airline-gap-width": DataDrivenProperty<number>,
    "airline-offset": DataDrivenProperty<number>,
    "airline-blur": DataDrivenProperty<number>,
    "airline-dasharray": CrossFadedProperty<Array<number>>,
    "airline-pattern": CrossFadedProperty<string>,
    "airline-seg-count": DataDrivenProperty<number>,
    "airline-seg-group": DataDrivenProperty<number>,
    "airline-speed-factor": DataDrivenProperty<number>,
    "airline-type": CrossFadedProperty<string>
};

const paint: Properties<PaintProps> = new Properties({
    "airline-opacity": new DataDrivenProperty(styleSpec["paint_airline"]["airline-opacity"]),
    "airline-color": new DataDrivenProperty(styleSpec["paint_airline"]["airline-color"]),
    "airline-translate": new DataConstantProperty(styleSpec["paint_airline"]["airline-translate"]),
    "airline-translate-anchor": new DataConstantProperty(styleSpec["paint_airline"]["airline-translate-anchor"]),
    "airline-width": new DataDrivenProperty(styleSpec["paint_airline"]["airline-width"]),
    "airline-gap-width": new DataDrivenProperty(styleSpec["paint_airline"]["airline-gap-width"]),
    "airline-offset": new DataDrivenProperty(styleSpec["paint_airline"]["airline-offset"]),
    "airline-blur": new DataDrivenProperty(styleSpec["paint_airline"]["airline-blur"]),
    "airline-dasharray": new CrossFadedProperty(styleSpec["paint_airline"]["airline-dasharray"]),
    "airline-pattern": new CrossFadedProperty(styleSpec["paint_airline"]["airline-pattern"]),
    "airline-seg-count": new DataConstantProperty(styleSpec["paint_airline"]["airline-seg-count"]),
    "airline-seg-group": new DataConstantProperty(styleSpec["paint_airline"]["airline-seg-group"]),
    "airline-speed": new DataConstantProperty(styleSpec["paint_airline"]["airline-speed"]),
    "airline-speed-factor": new DataConstantProperty(styleSpec["paint_airline"]["airline-speed-factor"]),
    "airline-type": new DataConstantProperty(styleSpec["paint_airline"]["airline-type"])
});

export default { paint, layout };
