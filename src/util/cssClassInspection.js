// @flow
function hasClass(elements, cName) {

    // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    return !!elements.className.match(new RegExp(`(\\s|^)${cName}(\\s|$)`));

}

function addClass(elements, cName) {

    if (!hasClass(elements, cName)) {
        elements.className.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        elements.className += ` ${cName}`;

    }

}

function removeClass(elements, cName) {

    if (hasClass(elements, cName)) {

        elements.className = elements.className.replace(new RegExp(`(\\s|^)${cName}(\\s|$)`), ' '); // replace方法是替换

    }

}

export {
    hasClass,
    addClass,
    removeClass
};
