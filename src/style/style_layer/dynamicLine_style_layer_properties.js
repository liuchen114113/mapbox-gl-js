/*
 * @Description:  动态线拓展
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-19 15:38:32 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-19 15:44:12
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
    "dynamicLine-cap": DataConstantProperty<"butt" | "round" | "square">,
    "dynamicLine-join": DataDrivenProperty<"bevel" | "round" | "miter">,
    "dynamicLine-miter-limit": DataConstantProperty<number>,
    "dynamicLine-round-limit": DataConstantProperty<number>,
    "dynamicLine-display-mode": CrossFadedProperty<string>
};

const layout: Properties<LayoutProps> = new Properties({
    "dynamicLine-cap": new DataConstantProperty(styleSpec["layout_dynamicLine"]["dynamicLine-cap"]),
    "dynamicLine-join": new DataDrivenProperty(styleSpec["layout_dynamicLine"]["dynamicLine-join"]),
    "dynamicLine-miter-limit": new DataConstantProperty(styleSpec["layout_dynamicLine"]["dynamicLine-miter-limit"]),
    "dynamicLine-round-limit": new DataConstantProperty(styleSpec["layout_dynamicLine"]["dynamicLine-round-limit"]),
    "dynamicLine-display-mode": new DataConstantProperty(styleSpec["layout_dynamicLine"]["dynamicLine-display-mode"])
});

export type PaintProps = {
    "dynamicLine-opacity": DataDrivenProperty<number>,
    "dynamicLine-color": DataDrivenProperty<Color>,
    "dynamicLine-translate": DataConstantProperty<[number, number]>,
    "dynamicLine-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "dynamicLine-width": DataDrivenProperty<number>,
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
    "dynamicLine-opacity": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-opacity"]),
    "dynamicLine-color": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-color"]),
    "dynamicLine-translate": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-translate"]),
    "dynamicLine-translate-anchor": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-translate-anchor"]),
    "dynamicLine-width": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-width"]),
    "dynamicLine-gap-width": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-gap-width"]),
    "dynamicLine-offset": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-offset"]),
    "dynamicLine-blur": new DataDrivenProperty(styleSpec.paint_dynamicLine["dynamicLine-blur"]),
    "dynamicLine-seg-count": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-seg-count"]),
    "dynamicLine-seg-group": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-seg-group"]),
    "dynamicLine-speed": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-speed"]),
    "dynamicLine-speed-factor": new DataConstantProperty(styleSpec.paint_dynamicLine["dynamicLine-speed-factor"])
});

export default { paint, layout };
