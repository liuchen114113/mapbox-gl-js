'use strict';

const st = require('st');
const http = require('http');
const path = require('path');
const colors = require('chalk');
const fs = require('fs');

module.exports = function () {
    const integrationMount = st({path: path.join(__dirname, '..')});
    const curvemapGLStylesMount = st({path: path.dirname(require.resolve('curvemap-gl-styles')), url: 'curvemap-gl-styles'});
    const curvemapMVTFixturesMount = st({path: path.dirname(require.resolve('@curvemap/mvt-fixtures')), url: 'mvt-fixtures'});
    const server = http.createServer((req, res) => {
        return curvemapMVTFixturesMount(req, res, () => {
            return curvemapGLStylesMount(req, res, () => {
                return integrationMount(req, res);
            });
        });
    });

    function localizeURL(url) {
        return url.replace(/^local:\/\//, 'http://localhost:2900/');
    }

    function localizeCurvemapSpriteURL(url) {
        return url.replace(/^curvemap:\/\//, 'http://localhost:2900/');
    }

    function localizeCurvemapFontsURL(url) {
        return url.replace(/^curvemap:\/\/fonts/, 'http://localhost:2900/glyphs');
    }

    function localizeCurvemapTilesURL(url) {
        return url.replace(/^curvemap:\/\//, 'http://localhost:2900/tiles/');
    }

    function localizeCurvemapTilesetURL(url) {
        return url.replace(/^curvemap:\/\//, 'http://localhost:2900/tilesets/');
    }

    function localizeSourceURLs(source) {
        for (const tile in source.tiles) {
            source.tiles[tile] = localizeCurvemapTilesURL(source.tiles[tile]);
            source.tiles[tile] = localizeURL(source.tiles[tile]);
        }

        if (source.urls) {
            source.urls = source.urls.map(localizeCurvemapTilesetURL);
            source.urls = source.urls.map(localizeURL);
        }

        if (source.url) {
            source.url = localizeCurvemapTilesetURL(source.url);
            source.url = localizeURL(source.url);
        }

        if (source.data && typeof source.data == 'string') {
            source.data = localizeURL(source.data);
        }
    }

    function localizeStyleURLs (style) {
        for (const source in style.sources) {
            localizeSourceURLs(style.sources[source]);
        }

        if (style.sprite) {
            style.sprite = localizeCurvemapSpriteURL(style.sprite);
            style.sprite = localizeURL(style.sprite);
        }

        if (style.glyphs) {
            style.glyphs = localizeCurvemapFontsURL(style.glyphs);
            style.glyphs = localizeURL(style.glyphs);
        }
    }

    return {
        listen: function (callback) {
            server.listen(2900, callback);
        },

        close: function (callback) {
            server.close(callback);
        },

        localizeURLs: function (style) {
            localizeStyleURLs(style);
            if (style.metadata && style.metadata.test && style.metadata.test.operations) {
                style.metadata.test.operations.forEach((op) => {
                    if (op[0] === 'addSource') {
                        localizeSourceURLs(op[2]);
                    } else if (op[0] === 'setStyle') {
                        if (typeof op[1] === 'object') {
                            localizeStyleURLs(op[1]);
                            return;
                        }

                        let styleJSON;
                        try {
                            const relativePath = op[1].replace(/^local:\/\//, '');
                            if (relativePath.startsWith('curvemap-gl-styles')) {
                                styleJSON = fs.readFileSync(path.join(path.dirname(require.resolve('curvemap-gl-styles')), '..', relativePath));
                            } else {
                                styleJSON = fs.readFileSync(path.join(__dirname, '..', relativePath));
                            }
                        } catch (error) {
                            console.log(colors.blue(`* ${error}`));
                            return;
                        }

                        try {
                            styleJSON = JSON.parse(styleJSON);
                        } catch (error) {
                            console.log(colors.blue(`* Error while parsing ${op[1]}: ${error}`));
                            return;
                        }

                        localizeStyleURLs(styleJSON);

                        op[1] = styleJSON;
                        op[2] = { diff: false };
                    }
                });
            }
        }
    };
};
