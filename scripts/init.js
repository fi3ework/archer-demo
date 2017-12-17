'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var init = function init() {
    var $introImg = $('.site-intro-img:first'),
        introPlaceholder = $('.site-intro-placeholder:first'),
        bgCSS = $introImg.css('background-image'),
        bgRegResult = bgCSS.match(/url\("*([^"]*)"*\)/);

    if (bgRegResult.length < 2) {
        console.log(bgRegResult);
        return;
    }

    var bgURL = bgRegResult[1],
        img = new Image();
    img.onload = function () {
        introPlaceholder.remove();
        console.info('PLACEHOLDER REMOVED');
    };
    img.src = bgURL;
};

document.addEventListener('DOMContentLoaded', function () {
    $('.container').removeClass('container-unloaded');
    $('.footer').removeClass('footer-unloaded');
    $('.loading').remove();
}, false);

exports.init = init;