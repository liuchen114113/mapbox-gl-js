/*
 * @Description:  airline拓展
 * @Author: liuchen@hiynn.com 
 * @Date: 2018-06-13 18:58:57 
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-06-22 11:12:29
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
    
    "histogram-color-render": DataConstantProperty<string>,
    "histogram-max-height-render": DataConstantProperty<string>
};

const layout: Properties<LayoutProps> = new Properties({
    "histogram-color-render": new DataConstantProperty(styleSpec.layout_histogram["histogram-color-render"]),
    "histogram-max-height-render": new DataConstantProperty(styleSpec.layout_histogram["histogram-max-height-render"])
});

export type PaintProps = {
    "histogram-opacity": DataConstantProperty<number>,
    "histogram-color": DataDrivenProperty<Color>,
    "histogram-translate": DataConstantProperty<[number, number]>,
    "histogram-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "histogram-pattern": CrossFadedProperty<string>,
    "histogram-height": DataDrivenProperty<number>,
    "histogram-base": DataDrivenProperty<number>,
    "histogram-dynamic": DataConstantProperty<number>,
    "histogram-heightArr1": DataDrivenProperty<Array<number>>,
    "histogram-heightArr2": DataDrivenProperty<Array<number>>,
    "histogram-heightArr3": DataDrivenProperty<Array<number>>,
    "histogram-time": DataConstantProperty<number>,
    "histogram-count": DataConstantProperty<number>,
    "histogram-colors": DataConstantProperty<Color>,
    "histogram-max-height": DataConstantProperty<number>,
    "histogram-fluorescent": DataConstantProperty<number>,
};

const paint: Properties<PaintProps> = new Properties({
    "histogram-opacity": new DataConstantProperty(styleSpec.paint_histogram["histogram-opacity"]),
    "histogram-color": new DataDrivenProperty(styleSpec.paint_histogram["histogram-color"]),
    "histogram-translate": new DataConstantProperty(styleSpec.paint_histogram["histogram-translate"]),
    "histogram-translate-anchor": new DataConstantProperty(styleSpec.paint_histogram["histogram-translate-anchor"]),
    "histogram-pattern": new CrossFadedProperty(styleSpec.paint_histogram["histogram-pattern"]),
    "histogram-height": new DataDrivenProperty(styleSpec.paint_histogram["histogram-height"]),
    "histogram-base": new DataDrivenProperty(styleSpec.paint_histogram["histogram-base"]),
    "histogram-dynamic": new DataConstantProperty(styleSpec.paint_histogram["histogram-dynamic"]),
    "histogram-heightArr1": new DataDrivenProperty(styleSpec.paint_histogram["histogram-heightArr1"]),
    "histogram-heightArr2": new DataDrivenProperty(styleSpec.paint_histogram["histogram-heightArr2"]),
    "histogram-heightArr3": new DataDrivenProperty(styleSpec.paint_histogram["histogram-heightArr3"]),
    "histogram-time": new DataConstantProperty(styleSpec.paint_histogram["histogram-time"]),
    "histogram-count": new DataConstantProperty(styleSpec.paint_histogram["histogram-count"]),
    "histogram-colors": new DataConstantProperty(styleSpec.paint_histogram["histogram-colors"]),
    "histogram-max-height": new DataConstantProperty(styleSpec.paint_histogram["histogram-max-height"]),
    "histogram-fluorescent": new DataConstantProperty(styleSpec.paint_histogram["histogram-fluorescent"])
});

export default { paint, layout };
