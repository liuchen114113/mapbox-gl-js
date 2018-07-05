'use strict';

curvemapgl.accessToken = getAccessToken();

function getAccessToken() {
    var accessToken = (
        process.env.CurvemapAccessToken ||
        process.env.CURVEMAP_ACCESS_TOKEN ||
        getURLParameter('access_token') ||
        localStorage.getItem('accessToken')
    );
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
}

function getURLParameter(name) {
    var regexp = new RegExp('[?&]' + name + '=([^&#]*)', 'i');
    var output = regexp.exec(window.location.href);
    return output && output[1];
}
