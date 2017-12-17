/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _init = __webpack_require__(1);

	var _scroll = __webpack_require__(2);

	var _mobile = __webpack_require__(4);

	var _sidebar = __webpack_require__(5);

	var _tag = __webpack_require__(6);

	console.info('hexo-theme-archer: v20171217');
	(0, _init.init)();
	(0, _scroll.scroll)();
	(0, _sidebar.sidebarInit)();
	(0, _tag.initTag)();
	(0, _mobile.initMobile)();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.scroll = undefined;

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var scroll = function scroll() {
	    var $banner = $('.banner:first'),
	        $postBanner = $banner.find('.post-title a'),
	        $bgEle = $('.site-intro:first'),
	        $homeLink = $('.home-link:first'),
	        $backTop = $('.back-top:first'),
	        $sidebarMenu = $('.header-sidebar-menu:first'),
	        bgTitleHeight = $bgEle.offset().top + $bgEle.outerHeight(),
	        $tocWrapper = $('.toc-wrapper:first'),
	        $tocCatalog = $tocWrapper.find('.toc-catalog'),
	        $progressBar = $('.read-progress');

	    // toc的收缩
	    $tocCatalog.on('click', function () {
	        $tocWrapper.toggleClass('toc-hide-children');
	    });

	    // 滚动式切换文章标题和站点标题    
	    var previousHeight = 0,
	        continueScroll = 0;

	    function isScrollingUpOrDown(currTop) {
	        continueScroll += currTop - previousHeight;
	        if (continueScroll > 30) {
	            // 向下滑动
	            continueScroll = 0;
	            return 1;
	        } else if (continueScroll < -800) {
	            //向上滑动
	            continueScroll = 0;
	            return -1;
	        } else {
	            return 0;
	        }
	    }

	    // 是否在向上或向下滚动
	    var crossingState = -1;
	    var isHigherThanIntro = true;
	    function isCrossingIntro(currTop) {
	        // 向下滑动超过intro
	        if (currTop > bgTitleHeight) {
	            if (crossingState !== 1) {
	                crossingState = 1;
	                isHigherThanIntro = false;
	                return 1;
	            }
	        } else {
	            // 向上滑动超过intro
	            if (crossingState !== -1) {
	                crossingState = -1;
	                isHigherThanIntro = true;
	                return -1;
	            }
	        }
	        return 0;
	    }

	    // 判断是否为post-page
	    var isPostPage = false;
	    var articleHeight = void 0,
	        articleTop = void 0;
	    if ($('.post-body').length) {
	        isPostPage = true;
	        articleTop = bgTitleHeight;
	        articleHeight = $('.article-entry').outerHeight();
	        // 进度条君的初始化
	        // $('.container')[0].addEventListener('transitionend', getTop);
	    }

	    function updateProgress(scrollTop, beginY, contentHeight) {
	        var windowHeight = $(window).height();
	        var readPercent = void 0;
	        if (scrollTop < bgTitleHeight) {
	            readPercent = 0;
	        } else {
	            readPercent = (scrollTop - beginY) / (contentHeight - windowHeight) * 100;
	        }

	        readPercent = readPercent >= 0 ? readPercent : 100;
	        // readPercent = Number.isNaN(readPercent) ? 0 : readPercent;
	        $progressBar.css('width', readPercent + '%');
	    }

	    // rAF操作
	    var tickingScroll = false;
	    function updateScroll(scrollTop) {
	        var crossingState = isCrossingIntro(scrollTop);
	        // intro边界切换
	        if (crossingState == 1) {
	            $tocWrapper.addClass('toc-fixed');
	            $homeLink.addClass('home-link-hide');
	            $backTop.addClass('back-top-show');
	            $sidebarMenu.addClass('header-sidebar-menu-black');
	        } else if (crossingState == -1) {
	            $tocWrapper.removeClass('toc-fixed');
	            $homeLink.removeClass('home-link-hide');
	            $banner.removeClass('banner-show');
	            $backTop.removeClass('back-top-show');
	            $sidebarMenu.removeClass('header-sidebar-menu-black');
	        }
	        // 如果不是post - page 以下忽略
	        if (isPostPage) {
	            // 上下滑动一定距离显示/隐藏header
	            var upDownState = isScrollingUpOrDown(scrollTop);
	            if (upDownState == 1) {
	                $banner.removeClass('banner-show');
	            } else if (upDownState == -1 && !isHigherThanIntro) {
	                $banner.addClass('banner-show');
	            }
	            // 进度条君的长度
	            updateProgress(scrollTop, articleTop, articleHeight);
	        }
	        previousHeight = scrollTop;
	        tickingScroll = false;
	    }

	    // scroll回调
	    function onScroll() {
	        var scrollTop = $(document).scrollTop();
	        var bindedUpdate = updateScroll.bind(null, scrollTop);
	        _util2.default.rafTick(tickingScroll, bindedUpdate);
	    }

	    $(document).on('scroll', onScroll);

	    // 返回顶部
	    [$postBanner, $backTop].forEach(function (ele) {
	        ele.on('click', _util2.default.backTop);
	    });
	};

	exports.scroll = scroll;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var archerUtil = {
	    // 回到顶部
	    backTop: function backTop(event) {
	        event.preventDefault();
	        var topTimer = setInterval(function () {
	            var currTop = $(document).scrollTop();
	            window.scrollTo(0, Math.max(Math.floor(currTop * 0.8)));
	            if (currTop === 0) {
	                clearInterval(topTimer);
	            }
	        }, 20);
	    },

	    // 获取元素在页面上相对左上角的位置
	    getAbsPosition: function getAbsPosition(e) {
	        var x = e.offsetLeft,
	            y = e.offsetTop;
	        while (e = e.offsetParent) {
	            x += e.offsetLeft;
	            y += e.offsetTop;
	        }
	        return {
	            'x': x,
	            'y': y
	        };
	    },

	    // 格式化日期
	    dateFormater: function dateFormater(date, fmt) {
	        var o = {
	            'M+': date.getMonth() + 1, //月份 
	            'd+': date.getDate(), //日 
	            'h+': date.getHours(), //小时 
	            'm+': date.getMinutes(), //分 
	            's+': date.getSeconds(), //秒 
	            'q+': Math.floor((date.getMonth() + 3) / 3), //季度 
	            'S': date.getMilliseconds() //毫秒 
	        };
	        if (/(y+)/.test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	        }
	        for (var k in o) {
	            if (new RegExp('(' + k + ')').test(fmt)) {
	                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
	            }
	        }
	        return fmt;
	    },

	    // rAF的ticking
	    rafTick: function rafTick(ticking, updateFunc) {
	        if (!ticking) {
	            requestAnimationFrame(updateFunc);
	        }
	        ticking = true;
	    }
	};

	exports.default = archerUtil;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var initMobile = function initMobile() {
	    if (window.matchMedia) {
	        var mql = window.matchMedia('(max-width: 900px)');
	        mql.addListener(mediaChangeHandler);
	        mediaChangeHandler(mql);
	    } else {
	        window.addListener('resize', function () {
	            var innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	            mediaChangeHandler(innerWidth > 900 ? {
	                matches: false
	            } : {
	                matches: true
	            });
	        }, false);
	    }

	    function mediaChangeHandler(mql) {
	        if (mql.matches) {
	            console.log('mobile');
	            // TODO: why
	            document.body.addEventListener('touchstart', function () {});
	        } else {
	            console.log('desktop');
	        }
	    }
	};

	exports.initMobile = initMobile;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var sidebarInit = function sidebarInit() {
	    var $sidebar = $('.sidebar:first'),
	        $wrapper = $('.wrapper:first'),
	        $headerMenu = $('.header-sidebar-menu:first'),
	        $sidebarContent = $sidebar.find('.sidebar-content:first'),
	        $archiveLink = $sidebar.find('.sidebar-archive-link:first'),
	        $tagsLink = $sidebar.find('.sidebar-tags-link:first'),
	        $tocWrapper = $('.toc-wrapper:first'),
	        $header = $('.header:first'),
	        $sidebarHeader = $sidebar.find('.sidebar-header:first');

	    // 点击headerMenu出现sidebar
	    $headerMenu.on('click', function (eve) {
	        showSidebar(eve);
	    });

	    function showSidebar(eve) {
	        $sidebar.addClass('sidebar-show');
	        $wrapper.addClass('wrapper-slide');
	        $header.addClass('header-slide');
	        $tocWrapper.addClass('toc-slide');
	        eve.stopPropagation();
	    }

	    // 阻止在sidebar中单击收回sidebar
	    $sidebar.on('click', function (eve) {
	        eve.stopPropagation();
	    });

	    // 单击body收回sidebar
	    $wrapper.on('click', function (eve) {
	        if ($sidebar.hasClass('sidebar-show')) {
	            eve.preventDefault();
	            $sidebar.removeClass('sidebar-show');
	            $header.removeClass('header-slide');
	            $wrapper.removeClass('wrapper-slide');
	            $tocWrapper.removeClass('toc-slide');
	        }
	    });

	    // 切换tags和archive
	    $archiveLink.on('click', function () {
	        $sidebarContent.addClass('sidebar-content-show-archive').removeClass('sidebar-content-show-tags sidebar-show-immediately');
	        $sidebarHeader.addClass('sidebar-header-show-archive').removeClass('sidebar-header-show-tags sidebar-show-immediately');
	    });
	    $tagsLink.on('click', function () {
	        $sidebarContent.addClass('sidebar-content-show-tags').removeClass('sidebar-content-show-archive sidebar-show-immediately');
	        $sidebarHeader.addClass('sidebar-header-show-tags').removeClass('sidebar-header-show-archive sidebar-show-immediately');
	    });

	    // 阻止sidebarContent在滚动到顶部或底部时继续滚动
	    $sidebar.on('mousewheel', function (eve) {
	        var target = eve.target,
	            $sidebarTagList = $sidebar.find('.sidebar-tag-list:first'),
	            $sidebararchive = $sidebar.find('.sidebar-archive:first');

	        if ($.contains($sidebarTagList[0], target) || $sidebarTagList === target) {
	            stopSidebarEdgeScroll.call($sidebarTagList[0], eve);
	        } else if ($.contains($sidebararchive[0], target) || $sidebararchive === target) {
	            stopSidebarEdgeScroll.call($sidebararchive[0], eve);
	        } else {
	            eve.preventDefault();
	        }
	    });

	    // 阻止滚轮在sidebar滚动越界
	    function stopSidebarEdgeScroll(eve) {
	        if (this.scrollHeight == this.clientHeight) {
	            window.event.preventDefault();
	        } else if (this.scrollTop <= 0) {
	            if (eve.originalEvent.wheelDelta > 0) {
	                window.event.preventDefault();
	            }
	        } else if (this.scrollTop >= this.scrollHeight - this.clientHeight) {
	            if (eve.originalEvent.wheelDelta < 0) {
	                window.event.preventDefault();
	            }
	        }
	    }

	    // 点击meta的tag弹出slider
	    function popSidebar() {
	        var popFromArchive = false;
	        // 弹出sidebar
	        // let event = document.createEvent('MouseEvents');
	        // event.initMouseEvent('click', false, true);
	        var event = new MouseEvent('click', {
	            bubbles: true,
	            cancelable: true
	        });
	        if ($sidebarHeader.hasClass('sidebar-header-show-archive') && !$sidebar.hasClass('sidebar-show')) {
	            popFromArchive = true;
	        } else {
	            popFromArchive = false;
	        }
	        // 直接滑动到tags
	        $headerMenu[0].dispatchEvent(event);
	        $tagsLink[0].dispatchEvent(event);
	        if (popFromArchive) {
	            $sidebarHeader.addClass('sidebar-show-immediately');
	            $sidebarContent.addClass('sidebar-show-immediately');
	        }
	    }

	    // 点击tag时弹出sidebar
	    function clickTag(tagName) {
	        var sidebarTagsName = $('.sidebar-tags-name:first')[0];
	        var event = new MouseEvent('click', {
	            bubbles: true,
	            cancelable: true
	        });
	        $headerMenu[0].dispatchEvent(event);
	        sidebarTagsName.currTagName = tagName;
	        sidebarTagsName.dispatchEvent(event);
	    }

	    var $postTags = $('.post-tag');
	    $postTags.on('click', function (eve) {
	        popSidebar();
	        var tagName = eve.target.dataset.href;
	        clickTag(tagName);
	        eve.stopPropagation();
	    });
	};

	exports.sidebarInit = sidebarInit;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.initTag = undefined;

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var initTag = function initTag() {
	    var contentJSON = void 0,
	        tagMap = new Map();
	    initTagInfo();

	    // 获取所有文章信息的json
	    function initTagInfo() {
	        // jsInfo is from js-info.ejs
	        var tagURL = jsInfo.root + 'content.json?t=' + +new Date();
	        var xhr = new XMLHttpRequest();
	        xhr.responseType = '';
	        xhr.open('get', tagURL, true);
	        var $tagLoadFail = $('.tag-load-fail:first');
	        xhr.onload = function () {
	            if (this.status == 200 || this.status == 304) {
	                $tagLoadFail.remove();
	                contentJSON = JSON.parse(this.responseText);
	                initTagMap(contentJSON);
	            } else {
	                showTagLoadFail($tagLoadFail);
	                $('.sidebar-tags-name:first').remove();
	            }
	        };
	        xhr.send();
	    }

	    // 显示加载失败
	    function showTagLoadFail($tagLoadFail) {
	        $tagLoadFail[0].style.display = 'block';
	    }

	    // 建立map
	    function initTagMap(contentJSON) {
	        var _this = this;

	        var _loop = function _loop(postIndex) {
	            var currPostTags = contentJSON[postIndex].tags;
	            if (currPostTags.length) {
	                currPostTags.forEach(function (tag) {
	                    if (tagMap.has(tag.name)) {
	                        var addedIndex = tagMap.get(tag.name) + ',' + postIndex.toString();
	                        tagMap.set(tag.name, addedIndex);
	                    } else {
	                        tagMap.set(tag.name, postIndex.toString());
	                    }
	                }, _this);
	            }
	        };

	        for (var postIndex = 0; postIndex < contentJSON.length; postIndex++) {
	            _loop(postIndex);
	        }
	    }

	    // 将对应的postInfo生成dom
	    function createTagDom(postInfo) {
	        var $tagItem = $('<li class="tag-post-item"><span class="tag-post-date">' + _util2.default.dateFormater(new Date(Date.parse(postInfo.date)), 'yyyy/MM/dd') + '</span></li>');
	        var $aItem = $('<a class="tag-post-title" href="' + jsInfo.root + postInfo.path + '">' + postInfo.title + '</a>');
	        $tagItem.append($aItem);
	        return $tagItem;
	    }

	    $('.sidebar-tags-name:first').on('click', function (event) {
	        event.preventDefault();
	        var realTarget = event.target;
	        // 点击大框可显示对应tag的文章
	        if (this.compareDocumentPosition(realTarget) & 16) {
	            // 确定tagName
	            if (realTarget.tagName === 'SPAN') {
	                this.currTagName = realTarget.firstChild.innerHTML;
	            } else {
	                this.currTagName = realTarget.innerHTML;
	            }
	        }

	        // 判断是否存在对应tag
	        var indexs = tagMap.get(this.currTagName);
	        if (!indexs) {
	            return;
	        }

	        // 设置当前选中的tag的样式
	        $(this).find('.sidebar-tag-name-focus').removeClass('sidebar-tag-name-focus');
	        var children = this.children;
	        for (var i = 0; i < children.length; i++) {
	            if (this.currTagName === children[i].firstChild.innerHTML) {
	                children[i].classList.add('sidebar-tag-name-focus');
	            }
	        }

	        // 显示tag对应的文章列表
	        var indexsArr = indexs.split(',');
	        var frag = document.createDocumentFragment(),
	            postList = $('.sidebar-tag-list')[0];
	        postList.innerHTML = '';
	        indexsArr.forEach(function (item) {
	            frag.appendChild(createTagDom(contentJSON[item])[0]);
	        });
	        postList.appendChild(frag);
	    });
	};

	exports.initTag = initTag;

/***/ })
/******/ ]);