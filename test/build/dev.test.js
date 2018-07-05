import {test} from 'curvemap-gl-js-test';
import fs from 'fs';

test('dev build contains asserts', (t) => {
    t.assert(fs.readFileSync('dist/curvemap-gl-dev.js', 'utf8').indexOf('canary assert') !== -1);
    t.end();
});
