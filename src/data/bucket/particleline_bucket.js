// @flow
/* eslint-disable */

/*
* @Author: hydata
* @Date:   2018-05-30 17:08:01
 * @Last Modified by: liuchen
 * @Last Modified time: 2018-07-06 18:23:59
*/
import {ParticleLineLayoutArray} from '../array_types';

import {members as layoutAttributes} from './particleline_attributes';
import SegmentVector from '../segment';
import {ProgramConfigurationSet} from '../program_configuration';
import {TriangleIndexArray} from '../index_array_type';
import loadGeometry from '../load_geometry';
import EXTENT from '../extent';
import mvt from '@hymap/vector-tile';

const vectorTileFeatureTypes = mvt.VectorTileFeature.types;
import {register} from '../../util/web_worker_transfer';
import EvaluationParameters from '../../style/evaluation_parameters';

import type {
    Bucket,
    BucketParameters,
    IndexedFeature,
    PopulateParameters
} from '../bucket';
import type ParticleLineStyleLayer from '../../style/style_layer/particleline_style_layer';
import type Point from '@hymap/point-geometry';
import type {Segment} from '../segment';
import type Context from '../../gl/context';
import type IndexBuffer from '../../gl/index_buffer';
import type VertexBuffer from '../../gl/vertex_buffer';
import type {FeatureStates} from '../../source/source_state';
// NOTE ON EXTRUDE SCALE:
// scale the extrusion vector so that the normal length is this value.
// contains the "texture" normals (-1..1). this is distinct from the extrude
// normals for line joins, because the x-value remains 0 for the texture
// normal array, while the extrude normal actually moves the vertex to create
// the acute/bevelled line join.
const EXTRUDE_SCALE = 63;

/*
 * Sharp corners cause dashed lines to tilt because the distance along the line
 * is the same at both the inner and outer corners. To improve the appearance of
 * dashed lines we add extra points near sharp corners so that a smaller part
 * of the line is tilted.
 *
 * COS_HALF_SHARP_CORNER controls how sharp a corner has to be for us to add an
 * extra vertex. The default is 75 degrees.
 *
 * The newly created vertices are placed SHARP_CORNER_OFFSET pixels from the corner.
 */
const COS_HALF_SHARP_CORNER = Math.cos(75 / 2 * (Math.PI / 180));
const SHARP_CORNER_OFFSET = 15;

// The number of bits that is used to store the line distance in the buffer.
const LINE_DISTANCE_BUFFER_BITS = 15;

// We don't have enough bits for the line distance as we'd like to have, so
// use this value to scale the line distance (in tile units) down to a smaller
// value. This lets us store longer distances while sacrificing precision.
const LINE_DISTANCE_SCALE = 1 / 2;

// The maximum line distance, in tile units, that fits in the buffer.
const MAX_LINE_DISTANCE = Math.pow(2, LINE_DISTANCE_BUFFER_BITS - 1) / LINE_DISTANCE_SCALE;
//增加参数透明度、状态值
//tjc
//2018/6/11
var curOpacity = 0;
var curNum = 0;
var curStatus = 1;
var _percent = 0;

/**
 * [addLineVertex description] 增加线节点，如果point包含x、y、z字段，则绘制高度
 * @param {[type]} layoutVertexBuffer [description]
 * @param {[type]} point:             Point         [description]
 * @param {[type]} extrude:           Point         [description]
 * @param {[type]} round:             boolean       [description]
 * @param {[type]} up:                boolean       [description]
 * @param {[type]} dir:               number        [description]
 * @param {[type]} linesofar:         number        [description]
 */
function addLineVertex(layoutVertexBuffer, point: Point, extrude: Point, round: boolean, up: boolean, dir: number, linesofar: number) {
    layoutVertexBuffer.emplaceBack(
        // a_pos_normal
        point.x,
        point.y,
        round ? 1 : 0,
        up ? 1 : -1,
        // a_data
        // add 128 to store a byte in an unsigned byte
        Math.round(EXTRUDE_SCALE * extrude.x) + 128,
        Math.round(EXTRUDE_SCALE * extrude.y) + 128,
        // Encode the -1/0/1 direction value into the first two bits of .z of a_data.
        // Combine it with the lower 6 bits of `linesofar` (shifted by 2 bites to make
        // room for the direction value). The upper 8 bits of `linesofar` are placed in
        // the `w` component. `linesofar` is scaled down by `LINE_DISTANCE_SCALE` so that
        // we can store longer distances while sacrificing precision.
        //

        /*  ((dir === 0 ? 0 : (dir < 0 ? -1 : 1)) + 1) | (((linesofar * LINE_DISTANCE_SCALE) & 0x3F) << 2),
         (linesofar * LINE_DISTANCE_SCALE) >> 6);*/

        1 + (0 === dir ? 0 : dir < 0 ? -1 : 1) | (linesofar * LINE_DISTANCE_SCALE & 63) << 2,
        linesofar * LINE_DISTANCE_SCALE >> 6,
        255 & curOpacity,
        parseInt(curNum),
        parseInt(curStatus),
        parseInt(0 === point.z ? 0 : point.z - 500 < 6 ? 6 : point.z - 500 + 6),
        parseInt(_percent))

}

/**
 * @private
 */
class ParticleLineBucket implements Bucket {
    distance: number;
    e1: number;
    e2: number;
    e3: number;

    index: number;
    zoom: number;
    overscaling: number;
    layers: Array<ParticleLineStyleLayer>;
    layerIds: Array<string>;
    stateDependentLayers: Array<any>;

    layoutVertexArray: ParticleLineLayoutArray;//自定义布局
    layoutVertexBuffer: VertexBuffer;

    indexArray: TriangleIndexArray;
    indexBuffer: IndexBuffer;

    programConfigurations: ProgramConfigurationSet<ParticleLineStyleLayer>;
    segments: SegmentVector;
    uploaded: boolean;

    constructor(options: BucketParameters<ParticleLineStyleLayer>) {
        this.zoom = options.zoom;
        this.overscaling = options.overscaling;
        this.layers = options.layers;
        this.layerIds = this.layers.map(layer => layer.id);
        this.index = options.index;

        this.layoutVertexArray = new ParticleLineLayoutArray();
        this.indexArray = new TriangleIndexArray();
        this.programConfigurations = new ProgramConfigurationSet(layoutAttributes, options.layers, options.zoom);
        this.segments = new SegmentVector();
    }

    populate(features: Array<IndexedFeature>, options: PopulateParameters) {

        for (const {feature, index, sourceLayerIndex} of features) {

            if (this.layers[0]._featureFilter(new EvaluationParameters(this.zoom), feature)) {
                const geometry = loadGeometry(feature);
                this.addFeature(feature, geometry, index);
                options.featureIndex.insert(feature, geometry, index, sourceLayerIndex, this.index);
            }
        }
    }

    update(states: FeatureStates, vtLayer: VectorTileLayer) {
        if (!this.stateDependentLayers.length) return;
        this.programConfigurations.updatePaintArrays(states, vtLayer, this.stateDependentLayers);
    }

    isEmpty() {
        return this.layoutVertexArray.length === 0;
    }

    uploadPending(): boolean {
        return !this.uploaded || this.programConfigurations.needsUpload;
    }
    
    upload(context: Context) {
        if (!this.uploaded) {
            this.layoutVertexBuffer = context.createVertexBuffer(this.layoutVertexArray, layoutAttributes);
            this.indexBuffer = context.createIndexBuffer(this.indexArray);
        }
        this.programConfigurations.upload(context);
        this.uploaded = true;
    }

    destroy() {
        if (!this.layoutVertexBuffer) return;
        this.layoutVertexBuffer.destroy();
        this.indexBuffer.destroy();
        this.programConfigurations.destroy();
        this.segments.destroy();
    }

    addFeature(feature: VectorTileFeature, geometry: Array<Array<Point>>, index: number) {
        const layout = this.layers[0].layout;
        const join = layout.get('particleline-join').evaluate(feature, {});
        const cap = layout.get('particleline-cap');
        const miterLimit = layout.get('particleline-miter-limit');
        const roundLimit = layout.get('particleline-round-limit');
        //tjc

        curNum = feature.properties.link_seq ? feature.properties.link_seq : curNum, curNum %= 10, curStatus = feature.properties.status || 1,
            _percent = 100 * feature.properties.link_seq / feature.properties.total || 1;
        for (const line of geometry) {
            this.addLine(line, feature, join, cap, miterLimit, roundLimit, index);
        }
    }

    addLine(e, t, r, i, a, s, index) {
        for (var n = this, u = "Polygon" === vectorTileFeatureTypes[t.type], o = e.length; o >= 2 && e[o - 1].equals(e[o - 2]);) o--;
        for (var d = 0; d < o - 1 && e[d].equals(e[d + 1]);) d++;
        if (!(o < (u ? 3 : 2))) {
            "bevel" === r && (a = 1.05);
            var c = SHARP_CORNER_OFFSET * (EXTENT / (512 * this.overscaling)),
                l = e[d],
                h = this.segments.prepareSegment(10 * o, this.layoutVertexArray, this.indexArray);
            this.distance = 0;
            var p, y, f, x = i,
                _ = u ? "butt" : i,
                m = !0,
                g = void 0,
                v = void 0,
                A = void 0,
                C = void 0;
            this.e1 = this.e2 = this.e3 = -1, u && (p = e[o - 2], C = l.sub(p)._unit()._perp());
            for (var L = d; L < o; L++)
                if (curOpacity = Math.round(255 / o * L), !(v = u && L === o - 1 ? e[d + 1] : e[L + 1]) || !e[L].equals(v)) {
                    C && (A = C), p && (g = p), p = e[L], C = v ? v.sub(p)._unit()._perp() : A, A = A || C;
                    var S = A.add(C);
                    0 === S.x && 0 === S.y || S._unit();
                    var E = S.x * C.x + S.y * C.y,
                        V = 0 !== E ? 1 / E : 1 / 0,
                        I = E < COS_HALF_SHARP_CORNER && g && v;
                    if (I && L > d) {
                        var B = p.dist(g);
                        if (B > 2 * c) {
                            var N = p.sub(p.sub(g)._mult(c / B)._round());
                            n.distance += N.dist(g), n.addCurrentVertex(N, n.distance, A.mult(1), 0, 0, !1, h), g = N
                        }
                    }
                    var T = g && v,
                        k = T ? r : v ? x : _;
                    if (T && "round" === k && (V < s ? k = "miter" : V <= 2 && (k = "fakeround")), "miter" === k && V > a && (k = "bevel"), "bevel" === k && (V > 2 && (k = "flipbevel"), V < a && (k = "miter")), g && (n.distance += p.dist(g)), "miter" === k) S._mult(V), n.addCurrentVertex(p, n.distance, S, 0, 0, !1, h);
                    else if ("flipbevel" === k) {
                        if (V > 100) S = C.clone().mult(-1);
                        else {
                            var b = A.x * C.y - A.y * C.x > 0 ? -1 : 1,
                                q = V * A.add(C).mag() / A.sub(C).mag();
                            S._perp()._mult(q * b)
                        }
                        n.addCurrentVertex(p, n.distance, S, 0, 0, !1, h), n.addCurrentVertex(p, n.distance, S.mult(-1), 0, 0, !1, h)
                    } else if ("bevel" === k || "fakeround" === k) {
                        var R = A.x * C.y - A.y * C.x > 0,
                            F = -Math.sqrt(V * V - 1);
                        if (R ? (f = 0, y = F) : (y = 0, f = F), m || n.addCurrentVertex(p, n.distance, A, y, f, !1, h), "fakeround" === k) {
                            for (var P = Math.floor(8 * (.5 - (E - .5))), D = void 0, O = 0; O < P; O++) D = C.mult((O + 1) / (P + 1))._add(A)._unit(), n.addPieSliceVertex(p, n.distance, D, R, h);
                            n.addPieSliceVertex(p, n.distance, S, R, h);
                            for (var M = P - 1; M >= 0; M--) D = A.mult((M + 1) / (P + 1))._add(C)._unit(), n.addPieSliceVertex(p, n.distance, D, R, h)
                        }
                        v && n.addCurrentVertex(p, n.distance, C, -y, -f, !1, h)
                    } else "butt" === k ? (m || n.addCurrentVertex(p, n.distance, A, 0, 0, !1, h), v && n.addCurrentVertex(p, n.distance, C, 0, 0, !1, h)) : "square" === k ? (m || (n.addCurrentVertex(p, n.distance, A, 1, 1, !1, h), n.e1 = n.e2 = -1), v && n.addCurrentVertex(p, n.distance, C, -1, -1, !1, h)) : "round" === k && (m || (n.addCurrentVertex(p, n.distance, A, 0, 0, !1, h), n.addCurrentVertex(p, n.distance, A, 1, 1, !0, h), n.e1 = n.e2 = -1), v && (n.addCurrentVertex(p, n.distance, C, -1, -1, !0, h), n.addCurrentVertex(p, n.distance, C, 0, 0, !1, h)));
                    if (I && L < o - 1) {
                        var z = p.dist(v);
                        if (z > 2 * c) {
                            var $ = p.add(v.sub(p)._mult(c / z)._round());
                            n.distance += $.dist(p), n.addCurrentVertex($, n.distance, C.mult(1), 0, 0, !1, h), p = $
                        }
                    }
                    m = !1
                }
            this.programConfigurations.populatePaintArrays(this.layoutVertexArray.length, t, index)
        }
    }


    /**
     * Add two vertices to the buffers.
     *
     * @param {Object} currentVertex the line vertex to add buffer vertices for
     * @param {number} distance the distance from the beginning of the line to the vertex
     * @param {number} endLeft extrude to shift the left vertex along the line
     * @param {number} endRight extrude to shift the left vertex along the line
     * @param {boolean} round whether this is a round cap
     * @private
     */
    addCurrentVertex(currentVertex: Point,
                     distance: number,
                     normal: Point,
                     endLeft: number,
                     endRight: number,
                     round: boolean,
                     segment: Segment,
                     distancesForScaling: ?Object) {
        let extrude;
        const layoutVertexArray = this.layoutVertexArray;
        const indexArray = this.indexArray;
        if (distancesForScaling) {
            // For gradient lines, scale distance from tile units to [0, 2^15)
            distance = scaleDistance(distance, distancesForScaling);
        }

        extrude = normal.clone();
        if (endLeft) extrude._sub(normal.perp()._mult(endLeft));
        addLineVertex(layoutVertexArray, currentVertex, extrude, round, false, endLeft, distance);
        this.e3 = segment.vertexLength++;
        if (this.e1 >= 0 && this.e2 >= 0) {
            indexArray.emplaceBack(this.e1, this.e2, this.e3);
            segment.primitiveLength++;
        }
        this.e1 = this.e2;
        this.e2 = this.e3;

        extrude = normal.mult(-1);
        if (endRight) extrude._sub(normal.perp()._mult(endRight));
        addLineVertex(layoutVertexArray, currentVertex, extrude, round, true, -endRight, distance);
        this.e3 = segment.vertexLength++;
        if (this.e1 >= 0 && this.e2 >= 0) {
            indexArray.emplaceBack(this.e1, this.e2, this.e3);
            segment.primitiveLength++;
        }
        this.e1 = this.e2;
        this.e2 = this.e3;

        // There is a maximum "distance along the line" that we can store in the buffers.
        // When we get close to the distance, reset it to zero and add the vertex again with
        // a distance of zero. The max distance is determined by the number of bits we allocate
        // to `linesofar`.
        if (distance > MAX_LINE_DISTANCE / 2 && !distancesForScaling) {
            this.distance = 0;
            this.addCurrentVertex(currentVertex, this.distance, normal, endLeft, endRight, round, segment);
        }
    }

    /**
     * Add a single new vertex and a triangle using two previous vertices.
     * This adds a pie slice triangle near a join to simulate round joins
     *
     * @param currentVertex the line vertex to add buffer vertices for
     * @param distance the distance from the beginning of the line to the vertex
     * @param extrude the offset of the new vertex from the currentVertex
     * @param lineTurnsLeft whether the line is turning left or right at this angle
     * @private
     */
    addPieSliceVertex(currentVertex: Point,
                      distance: number,
                      extrude: Point,
                      lineTurnsLeft: boolean,
                      segment: Segment,
                      distancesForScaling: ?Object) {
        extrude = extrude.mult(lineTurnsLeft ? -1 : 1);
        const layoutVertexArray = this.layoutVertexArray;
        const indexArray = this.indexArray;

        if (distancesForScaling) distance = scaleDistance(distance, distancesForScaling);

        addLineVertex(layoutVertexArray, currentVertex, extrude, false, lineTurnsLeft, 0, distance);
        this.e3 = segment.vertexLength++;
        if (this.e1 >= 0 && this.e2 >= 0) {
            indexArray.emplaceBack(this.e1, this.e2, this.e3);
            segment.primitiveLength++;
        }

        if (lineTurnsLeft) {
            this.e2 = this.e3;
        } else {
            this.e1 = this.e3;
        }
    }
}

/**
 * Knowing the ratio of the full linestring covered by this tiled feature, as well
 * as the total distance (in tile units) of this tiled feature, and the distance
 * (in tile units) of the current vertex, we can determine the relative distance
 * of this vertex along the full linestring feature and scale it to [0, 2^15)
 *
 * @param {number} tileDistance the distance from the beginning of the tiled line to this vertex
 * @param {Object} stats
 * @param {number} stats.start the ratio (0-1) along a full original linestring feature of the start of this tiled line feature
 * @param {number} stats.end the ratio (0-1) along a full original linestring feature of the end of this tiled line feature
 * @param {number} stats.tileTotal the total distance, in tile units, of this tiled line feature
 *
 * @private
 */
function scaleDistance(tileDistance: number, stats: Object) {
    return ((tileDistance / stats.tileTotal) * (stats.end - stats.start) + stats.start) * (MAX_LINE_DISTANCE - 1);
}

/**
 * Calculate the total distance, in tile units, of this tiled line feature
 *
 * @param {Array<Point>} vertices the full geometry of this tiled line feature
 * @param {number} first the index in the vertices array representing the first vertex we should consider
 * @param {number} len the count of vertices we should consider from `first`
 *
 * @private
 */
// function calculateFullDistance(vertices: Array<Point>, first: number, len: number) {
//     let currentVertex, nextVertex;
//     let total = 0;
//     for (let i = first; i < len - 1; i++) {
//         currentVertex = vertices[i];
//         nextVertex = vertices[i + 1];
//         total += currentVertex.dist(nextVertex);
//     }
//     return total;
// }

register('ParticleLineBucket', ParticleLineBucket, {omit: ['layers']});

export default ParticleLineBucket;
