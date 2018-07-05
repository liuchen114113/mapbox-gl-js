import { test } from 'curvemap-gl-js-test';
import curvemapgl from '../../src';

test('curvemapgl', (t) => {
    t.test('version', (t) => {
        t.ok(curvemapgl.version);
        t.end();
    });

    t.test('workerCount', (t) => {
        t.ok(typeof curvemapgl.workerCount === 'number');
        t.end();
    });
    t.end();
});
