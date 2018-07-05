
const accessToken = (
    process.env.CurvemapAccessToken ||
    process.env.CURVEMAP_ACCESS_TOKEN ||
    getURLParameter('access_token') ||
    localStorage.getItem('accessToken')
);

localStorage.setItem('accessToken', accessToken);

export default accessToken;

function getURLParameter(name) {
    const regexp = new RegExp(`[?&]${name}=([^&#]*)`, 'i');
    const output = regexp.exec(window.location.href);
    return output && output[1];
}
