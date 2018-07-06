// @flow

import circle from './style_layer/circle_style_layer';
import heatmap from './style_layer/heatmap_style_layer';
import hillshade from './style_layer/hillshade_style_layer';
import fill from './style_layer/fill_style_layer';
import fillExtrusion from './style_layer/fill_extrusion_style_layer';
import line from './style_layer/line_style_layer';
import symbol from './style_layer/symbol_style_layer';
import background from './style_layer/background_style_layer';
import raster from './style_layer/raster_style_layer';
import airline from './style_layer/airline_style_layer';
import particleline from './style_layer/particleline_style_layer';
import dynamicLine from './style_layer/dynamicLine_style_layer';
import histogram from './style_layer/histogram_style_layer';

const subclasses = {
    circle,
    heatmap,
    hillshade,
    fill,
    'fill-extrusion': fillExtrusion,
    line,
    symbol,
    background,
    raster,
    airline,
    particleline,
    dynamicLine,
    histogram
};

export default function createStyleLayer(layer: LayerSpecification) {
    return new subclasses[layer.type](layer);
}

