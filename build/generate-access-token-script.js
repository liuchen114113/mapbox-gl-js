/* eslint-disable */
'use strict';
const fs = require('fs');
const path = require('path');
const script = fs.readFileSync(path.join(__dirname, '../debug/access_token.js'), 'utf-8')
    .replace('process.env.CurvemapAccessToken',
        JSON.stringify(process.env.CurvemapAccessToken))
    .replace('process.env.CURVEMAP_ACCESS_TOKEN',
        JSON.stringify(process.env.CURVEMAP_ACCESS_TOKEN));

fs.writeFileSync(path.join(__dirname, '../debug/access_token_generated.js'), script);
