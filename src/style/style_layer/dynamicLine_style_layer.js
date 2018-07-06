// @flow

import Point from '@hymap/point-geometry';

import StyleLayer from '../style_layer';
import LineBucket from '../../data/bucket/dynamic_line_bucket';
import { RGBAImage } from '../../util/image';
import { multiPolygonIntersectsBufferedMultiLine } from '../../util/intersection_tests';
import { getMaximumPaintValue, translateDistance, translate } from '../query_utils';
import properties from './dynamicLine_style_layer_properties';
import { extend } from '../../util/util';
import EvaluationParameters from '../evaluation_parameters';
// import renderColorRamp from '../../util/color_ramp';
import { Transitionable, Transitioning, Layout, PossiblyEvaluated, DataDrivenProperty } from '../properties';

import type { FeatureState } from '../../style-spec/expression';
import type {Bucket, BucketParameters} from '../../data/bucket';
import type {LayoutProps, PaintProps} from './dynamicLine_style_layer_properties';
import type Transform from '../../geo/transform';
import type Texture from '../../render/texture';

class LineFloorwidthProperty extends DataDrivenProperty<number> {
    useIntegerZoom: true;

    possiblyEvaluate(value, parameters) {
        parameters = new EvaluationParameters(Math.floor(parameters.zoom), {
            now: parameters.now,
            fadeDuration: parameters.fadeDuration,
            zoomHistory: parameters.zoomHistory,
            transition: parameters.transition
        });
        return super.possiblyEvaluate(value, parameters);
    }

    evaluate(value, globals, feature, featureState) {
        globals = extend({}, globals, {zoom: Math.floor(globals.zoom)});
        return super.evaluate(value, globals, feature, featureState);
    }
}

const lineFloorwidthProperty = new LineFloorwidthProperty(properties.paint.properties['dynamicLine-width'].specification);
lineFloorwidthProperty.useIntegerZoom = true;

class DynamicLineStyleLayer extends StyleLayer {
    _unevaluatedLayout: Layout<LayoutProps>;
    layout: PossiblyEvaluated<LayoutProps>;

    gradient: ?RGBAImage;
    gradientTexture: ?Texture;

    _transitionablePaint: Transitionable<PaintProps>;
    _transitioningPaint: Transitioning<PaintProps>;
    paint: PossiblyEvaluated<PaintProps>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    // setPaintProperty(name: string, value: mixed, options: {validate: boolean}) {
    //     super.setPaintProperty(name, value, options);
    //     if (name === 'line-gradient') {
    //         this._updateGradient();
    //     }
    // }

    // _updateGradient() {
    //     const expression = this._transitionablePaint._values['line-gradient'].value.expression;
    //     this.gradient = renderColorRamp(expression, 'lineProgress');
    //     this.gradientTexture = null;
    // }

    recalculate(parameters: EvaluationParameters) {
        super.recalculate(parameters);

        (this.paint._values: any)['dynamicLine-floorwidth'] =
            lineFloorwidthProperty.possiblyEvaluate(this._transitioningPaint._values['dynamicLine-width'].value, parameters);
    }

    createBucket(parameters: BucketParameters<*>) {
        return new LineBucket(parameters);
    }

    queryRadius(bucket: Bucket): number {
        const lineBucket: LineBucket = (bucket: any);
        const width = getLineWidth(
            getMaximumPaintValue('dynamicLine-width', this, lineBucket),
            getMaximumPaintValue('dynamicLine-gap-width', this, lineBucket));
        const offset = getMaximumPaintValue('dynamicLine-offset', this, lineBucket);
        return width / 2 + Math.abs(offset) + translateDistance(this.paint.get('dynamicLine-translate'));
    }

    queryIntersectsFeature(queryGeometry: Array<Array<Point>>,
                           feature: VectorTileFeature,
                           featureState: FeatureState,
                           geometry: Array<Array<Point>>,
                           zoom: number,
                           transform: Transform,
                           pixelsToTileUnits: number): boolean {
        const translatedPolygon = translate(queryGeometry,
            this.paint.get('dynamicLine-translate'),
            this.paint.get('dynamicLine-translate-anchor'),
            transform.angle, pixelsToTileUnits);
        const halfWidth = pixelsToTileUnits / 2 * getLineWidth(
            this.paint.get('dynamicLine-width').evaluate(feature, featureState),
            this.paint.get('dynamicLine-gap-width').evaluate(feature, featureState));
        const lineOffset = this.paint.get('dynamicLine-offset').evaluate(feature, featureState);
        if (lineOffset) {
            geometry = offsetLine(geometry, lineOffset * pixelsToTileUnits);
        }
        return multiPolygonIntersectsBufferedMultiLine(translatedPolygon, geometry, halfWidth);
    }
}

export default DynamicLineStyleLayer;

function getLineWidth(lineWidth, lineGapWidth) {
    if (lineGapWidth > 0) {
        return lineGapWidth + 2 * lineWidth;
    } else {
        return lineWidth;
    }
}

function offsetLine(rings, offset) {
    const newRings = [];
    const zero = new Point(0, 0);
    for (let k = 0; k < rings.length; k++) {
        const ring = rings[k];
        const newRing = [];
        for (let i = 0; i < ring.length; i++) {
            const a = ring[i - 1];
            const b = ring[i];
            const c = ring[i + 1];
            const aToB = i === 0 ? zero : b.sub(a)._unit()._perp();
            const bToC = i === ring.length - 1 ? zero : c.sub(b)._unit()._perp();
            const extrude = aToB._add(bToC)._unit();

            const cosHalfAngle = extrude.x * bToC.x + extrude.y * bToC.y;
            extrude._mult(1 / cosHalfAngle);

            newRing.push(extrude._mult(offset)._add(b));
        }
        newRings.push(newRing);
    }
    return newRings;
}
