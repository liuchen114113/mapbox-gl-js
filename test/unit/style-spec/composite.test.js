import { test } from 'curvemap-gl-js-test';
import composite from '../../../src/style-spec/composite';

test('composites Curvemap vector sources', (t) => {
    const result = composite({
        "version": 7,
        "sources": {
            "curvemap-a": {
                "type": "vector",
                "url": "curvemap://a"
            },
            "curvemap-b": {
                "type": "vector",
                "url": "curvemap://b"
            }
        },
        "layers": [{
            "id": "a",
            "type": "line",
            "source": "curvemap-a"
        }, {
            "id": "b",
            "type": "line",
            "source": "curvemap-b"
        }]
    });

    t.deepEqual(result.sources, {
        "a,b": {
            "type": "vector",
            "url": "curvemap://a,b"
        }
    });

    t.equal(result.layers[0].source, "a,b");
    t.equal(result.layers[1].source, "a,b");
    t.end();
});

test('does not composite vector + raster', (t) => {
    const result = composite({
        "version": 7,
        "sources": {
            "a": {
                "type": "vector",
                "url": "curvemap://a"
            },
            "b": {
                "type": "raster",
                "url": "curvemap://b"
            }
        },
        "layers": []
    });

    t.deepEqual(Object.keys(result.sources), ["a", "b"]);
    t.end();
});

test('incorrect url match', (t) => {
    const result = composite({
        "version": 7,
        "sources": {
            "a": {
                "type": "vector",
                "url": "curvemap://a"
            },
            "b": {
                "type": "vector",
                "url": ""
            }
        },
        "layers": []
    });

    t.deepEqual(Object.keys(result.sources), ["a", "b"]);
    t.end();
});

test('composites Curvemap vector sources with conflicting source layer names', (t) => {
    t.throws(() => {
        composite({
            "version": 7,
            "sources": {
                "curvemap-a": {
                    "type": "vector",
                    "url": "curvemap://a"
                },
                "curvemap-b": {
                    "type": "vector",
                    "url": "curvemap://b"
                }
            },
            "layers": [{
                "id": "a",
                "type": "line",
                "source-layer": "sourcelayer",
                "source": "curvemap-a"
            }, {
                "id": "b",
                "type": "line",
                "source-layer": "sourcelayer",
                "source": "curvemap-b"
            }]
        });
    }, /Conflicting source layer names/, 'throws error on conflicting source layer names');

    t.end();
});
