/**
 * [isInclude 判断是否有目标文件引入]
 * @param  {[type]}  name [目标文件名]
 * @return {Boolean}      [Boolean]
 */
function isInclude(name) {
    var js = /js$/i.test(name);
    var es = document.getElementsByTagName(js ? 'script' : 'link');
    for (var i = 0; i < es.length; i++)
        if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
    return false;
}
/**
 * [loadScript 兼容异步加载js文件内部函数]
 * @param  {[type]}   url      [目标文件url]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [undefined]
 */
function loadScript(url, callback) {
    var script = document.createElemnet('script');
    script.type = "text/javascript";
    script.src = url;
    if (script.readyState) {
        script.onreadystatechange = function() {
            /*状态码complete 和 loaded*/
            if (script.readyState == "complete" || script.readyState == "loaded") {
                /*回调函数*/
                callback();
                // test();
            }
        }
    } else {
        script.onload = function() {
            /*回调函数*/
            callback();
            /* test();*/
        }
    }
    document.head.appendChild(script);
}
/**
 * [unique 数组去重]
 * @return {[type]} [返回去重后的数组]
 */
Array.prototype.unique = function() {
    /**
     * 利用对象属性名不重复的特性
     * 将数组每一位放入到对象里作为属性
     */
    var temp = {},
        arr = [],
        len = this.length;
    //循环目标数组长度
    for (var i = 0; i < len; i++) {
        /**
         * 判断当前位的值，
         * 若对象里不存在当前值
         * 将当前值作为属性名，
         * 并将随意值赋值给属性
         * 若存在当前属性，跳过
         */
        if (!temp[this[i]]) {
            temp[this[i]] = "abs";
            arr.push(this[i]);
        }
    }
    return arr;
}

//封装判断目标类型
function typeObj(target) {
    var data = typeof(target);
    var temp = {
        /*供参考的数据类型*/
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Number]": "number-object",
        "[object String]": "string-object",
        "[object Boolean]": "boolean-object",
    }
    /*判断null*/
    if (target === null) {
        return "null";
    } else if (data == 'object') {
        /**
         * 为引用值
         * 判断数组
         * 判断对象
         * 判断包装类  Object.prototype.toString
         */
        var toStr = Object.prototype.toString;
        var str = toStr.call(target);
        return temp[str];
    } else {
        /*为原始值*/
        return data;
    }
}

/*兼容计算元素偏移量*/
Element.prototype.getStyle = function(prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(this, null)[prop];
    } else {
        /*兼容IE*/
        return this.currentStyle[prop];
    }
}
var EventUtil = {
    /**
     * [getEvent 返回对event对象的引用]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getEvent: function(event) {
        return event ? event : window.event;
    },
    /**
     * [getTarget 返回事件的目标]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    /**
     * [stopBubble 兼容取消冒泡函数]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    stopBubble: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            /*兼容IE*/
            event.cancelBubble = true;
        }
    },
    /**
     * [preventEvent 兼容阻止默认事件函数封装兼容性]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    preventEvent: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    /**
     * [addEvent 兼容绑定事件处理函数]
     * @param {[type]} elem   [ 目标对象]
     * @param {[type]} type   [ 事件类型]
     * @param {[type]} handle [ 事件处理函数]
     */
    addEvent: function(elem, type, handle) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, function() {
                //将this指向绑定对象dom元素
                handle.call(elem);
            })
        } else {
            elem['on' + type] = handle;
        }
    },
    /**
     * [removeEvent 兼容解除事件处理]
     * @param  {[type]} elem   [目标元素]
     * @param  {[type]} type   [事件类型]
     * @param  {[type]} handle [事件处理函数]
     * @return {[type]}        [undefined]
     */
    removeEvent: function(elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, function() {
                handle.call(elem);
            });
        } else {
            elem['on' + type] = null;
        }
    },
    /**
     * [getWheelDelta 兼容滚轮事件]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getWheelDelta: function(event) {
        if (event.wheelDelta) {
            return (client.engine.opera && client.engine.opera < 9.5 ?
                -event.wheelDalta : event.wheelDelta);
        } else {
            /*返回为120或-120的倍数*/
            return -event.detail * 40;
        }
    },
    /**
     * [getCharCode 兼容获取键盘事件字符编码]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getCharCode: function(event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode || event.which;
        }
    },
    /**
     * [getFromCode 将字符编码转换为对应的字符]
     * @param  {[type]} charCode [字符编码]
     * @return {[type]}          [undefined]
     */
    getFromCode: function(charCode) {
        return String.fromCharCode(charCode);
    },
    /**
     * [getButton 兼容区分鼠标按钮]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getButton: function(event) {
        if (document.implamentation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0; //主按钮
                case 4:
                    return 1; //滚轮
                case 2:
                case 6:
                    return 2; //次按钮
            }
        }
    },
    /**
     * [getClipboardText 兼容获取剪贴板中的数据]
     * @param  {[type]} event [undefined]
     * @return {[type]}       [undefined]
     */
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    /**
     * [setClipboardText 兼容向剪贴板中添加数据]
     * @param {[type]} event [undefined]
     * @param {[type]} value [undefined]
     */
    setClipboardText: function(event, value) {
        if (event.clipboardData) {
            return event.olipboardData.setData("text/plain", value);
        } else if (window.clipboardData) {
            return window.clipboardData.setData("text", value);
        }
    },
    /**
     * [getPageScroll 获取滚动条滚动距离]
     * @return {[type]} [undefined]
     */
    getPageScroll: function() {
        if (window.pageYOffset) {
            return {
                x: window.pageXOffset,
                y: window.pageYOffset
            }
        } else if (document.documentElement && document.documentElement.scrollTop) {
            /*document.documentElement：谷歌下始终为0 火狐与IE8正常解决*/
            return {
                y: document.documentElement.scrollTop,
                x: document.documentElement.scrollLeft
            }
        } else if (document.body) {
            /*谷歌下正常 火狐与IE8始终为0解决*/
            return {
                y: document.body.scrollTop,
                x: document.body.scrollLeft
            }
        }
    }
}

/**
 * [drag 鼠标拖拽]
 * @param  {[type]} elem [目标元素]
 * @return {[type]}      [undefined]
 */
var disX,
    disY;

function drag(elem) {
    /*添加鼠标按下事件*/
    EventUtil.addEvent(elem, 'mousedown', function(e) {
        var event = EventUtil.getEvent();
        disX = event.pageX - parseInt(elem.getStyle('left'));
        disY = event.pageY - parseInt(elem.getStyle('top'));
        EventUtil.addEvent(document, 'mousemove', mouseMove);
        EventUtil.addEvent(document, 'mouseup', mouseUp);
        EventUtil.stopBubble(event);
        EventUtil.preventEvent(event);
    });
    /*鼠标移动事件*/
    function mouseMove(e) {
        var event = EventUtil.getEvent();
        elem.style.left = event.pageX - disX + "px";
        elem.style.top = event.pageY - disY + "px";
        if (elem.style.left < 0 || elem.style.top < 0) {
            // disX = 0;
            // disY = 0;
        }
    }
    /*鼠标按下被放开事件*/
    function mouseUp(e) {
        var event = EventUtil.getEvent();
        EventUtil.removeEvent(document, 'mousemove', mouseMove);
        EventUtil.removeEvent(document, 'mouseup', mouseUp);
    }
}

/**
 * [rannum 生成n个随机数]
 * @param  {[type]} range [范围0~rang]
 * @param  {[type]} n   [随机数个数]
 * @return {[type]}       [以数组形式返回]
 */
function randnum(range, n) {
    var randoms = [];
    while (true) {
        var flag = false;
        var len = randoms.length;
        var random = parseInt(1 + range * Math.random());
        for (var i = 0; i < len; i++) {
            if (randoms[i] === random) {
                flag = true;
                break;
            }
        }
        if (len === n) {
            break;
        }
        if (!flag) {
            randoms.push(random);
        }
    }
    return randoms;
}
/**
 * [getTime 每秒输出当前时间]
 * @return {[type]} [返回当前时间]
 */
function getTime() {
    var time = document.getElementById("time");
    var date = new Date(),
        hours = date.getHours(),
        min = date.getMinutes(),
        second = date.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    time.innerHTML = hours.toLocaleString() + " : " + min.toLocaleString() + " : " + second.toLocaleString();
    window.setTimeout("getTime()", 1000);
}

/**
 * [insertAfter 实现将节点插入到目标节点之后]
 * @param  {[type]} newElem [要插入的新节点]
 * @return {[type]}         [undefined]
 */
Element.prototype.insertAfter = function(newElem) {
    var beforeNode = this.nextElementSibling,
        parent = this.parentNode;
    /*如果目标标签是最后一个*/
    if (beforeNode == null) {
        parent.appendChild(targetNode);
    } else {
        /*否则在下一个节点之前插入*/
        parent.insertBefore(newElem, beforeNode);
    }
}

/**
 * [selectText 兼容选择文本框部分文本]
 * @param  {[type]} textbox    [目标文本框]
 * @param  {[type]} startIndex [选取开始的位置索引]
 * @param  {[type]} stopIndex  [选取结束的位置下一个的索引]
 * @return {[type]}            [undefined]
 */
function selectText(textbox, startIndex, stopIndex) {
    if (textbox.setSelectionRange) {
        textbox.setSelectionRange(startIndex, stopIndex);
    } else if (textbox.createTextRange) {
        /*创建范围*/
        var range = textbox.createTextRange();
        /*将范围折叠到开始位置*/
        range.collapse(true);
        /*将起点和终点移动到相同位置*/
        range.moveStart("character", startIndex);
        /*设置选择的字符数*/
        range.moveEnd("character", stopIndex - startIndex);
        /*选择字符*/
        range.select();
    }
    /*若要看到被选择的文本，必须文本框获取焦点*/
    textbox.focus();
}

/**
 * [getSelOptions 取得选择框所有选中项
 * 需添加点击事件查看]
 * @param  {[type]} selectbox [目标选择框]
 * @return {[type]}           [返回被选中的元素]
 */
function getSelOptions(selectbox) {
    var result = new Array(),
        option = null;
    var len = selectbox.options.length;
    for (var i = 0; i < len; i++) {
        option = selectbox.options[i];
        if (option.selected) {
            result.push(option);
        }
    }
    return result;
}

/**
 * [serialize 表单序列化]
 * @param  {[type]} form [目标表单]
 * @return {[type]}      [返回 & 格式化的字符串]
 */
function serialize(form) {
    /*用于保存将要创建的字符串的各个部分的数组*/
    var parts = [],
        field = null,
        i,
        len = form.elements.length,
        j,
        option,
        optLen,
        optValue;
    /*迭代每一个表单字段*/
    for (i = 0; i < len; i++) {
        /*将表单字段保存在field*/
        field = form.elements[i];
        /*通过字段引用检测type属性*/
        switch (field.type) {
            /*序列化select元素*/
            case "select-one":
            case "select-multple":
                if (field.name.length) {
                    optLen = field.options.length;
                    for (j = 0; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.attributes("value").specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case undefined:
                /*字段集合*/
            case "file":
                /*文件输入*/
            case "submit":
                /*提交按钮*/
            case "reset":
                /*自定义按钮*/
            case "button":
                break;
            case "radio":
                /*单选按钮*/
            case "checkbox":
                /*复选框*/
                if (!field.checked) {
                    break;
                }
            default:
                /*不包含没有名字的表单字段*/
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
        }
    }
    /*用 & 来格式化整个字符串*/
    return parts.join("&");
}

/**
 * [shallowClone 对象浅度克隆]
 * var b = { };
 * var c = b.shallowClone();
 * @return {[type]} [返回对象]
 */
Object.prototype.shallowClone = function() {
    var target = {};
    for (var prop in this) {
        if (this.hasOwnProperty) {
            target[prop] = this[prop];
        }
    }
    return target;
}

/**
 * [deepClone 深度克隆]
 * @param  {[type]} origin [源对象]
 * @param  {[type]} target [目标对象]
 * @return {[type]}        [返回目标对象]
 */
function deepClone(origin, target) {
    /**
     * 初始化
     * 通过toString方法判断是数组还是对象
     * 建立判断对象
     */
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = "[object Array]";
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            /*判断是不是引用值,并且绝对不等于 null*/
            if (origin[prop] !== "null" && typeof(origin[prop]) == 'object') {
                /*将原对象用call读取this指向*/
                orgStr = toStr.call(origin[prop]);
                /*判断是不是数组*/
                if (orgStr == arrStr) {
                    /*在新对象空间建立相应的数组*/
                    target[prop] = [];
                } else {
                    /*否则建立相应的对象*/
                    target[prop] = {};
                }
                /*通过递归，实现每一层深度拷贝*/
                deepClone(origin[prop], target[prop]);
            } else {
                /*若是原始值，直接拷贝*/
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}

/**
 * [isArray 判断是不是数组]
 * @return {Boolean} [返回布尔值]
 */
Object.prototype.isArray = function() {
    /*调用数组的isArray方法*/
    var af = Array.isArray(this);
    /**
     *  Object.prototype.toString方法会取得对象的一个内部属性［［Class］］
     *  然后依据这个属性，
     *  返回一个类似于［object Array］的字符串作为结果，
     *  call用来改变toString的this指向为待检测的对象
     * @type {[type]}
     */
    var objcall = (Object.prototype.toString.call(this) === "[object Array]");
    /*判断是否存在数组方法*/
    var tech = (typeof this.push == "function");
    /*判断对象是否是Array的实例*/
    var inarr = (this instanceof Array);
    /*查看创建此对象的引用是不是数组*/
    var cstruct = (this.constructor === Array);
    if (af && objcall && tech && inarr && cstruct) {
        return true;
    } else {
        return false;
    }
}

/**
 * [retSibling  返回元素e的第n个兄弟元素节点
 * n > 0，返回后面的兄弟元素节点，
 * n < 0，返回前面的
 * n = 0,返回自己]
 * @param  {[type]} e [目标节点]
 * @param  {[type]} n [第n个兄弟]
 * @return {[type]}   [返回目标兄弟节点]
 */
function retSibling(e, n) {
    while (e && n) {
        /*若e有意义进入循环*/
        if (n > 0) {
            if (0 && e.nextElementSibling) {
                e = e.nextElementSibling;
            } else {
                /*兼容IE*/
                for (e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling);
            }
            n--;
        } else {
            if (e.previousElementSibling) {
                e = e.previousElementSibling;
            } else {
                /*兼容IE*/
                for (e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling);
            }
            n++;
        }
    }
    return e;
}

/**
 * [getLayerPro 返回元素e的第n层祖先节点]
 * @param  {[type]} n [目标层]
 * @return {[type]}   [返回目标祖先节点]
 */
Element.prototype.getLayerPro = function(n) {
    var e = this;
    while (e && n) {
        e = e.parentElement;
        n--;
    }
    return e;
}
/**
 * [getParentTag 返回当前元素所有祖先节点标签名]
 * @return {[type]} [以数组形式返回]
 */
Element.prototype.getParentTag = function() {
    var nodes = this.parentNode,
        tagname = [];
    while (nodes.tagName) {
        tagname.push(nodes.tagName);
        nodes = nodes.parentNode;
    }
    return tagname;
}

/*返回浏览器尺寸*/
function getViewSize() {
    if (window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            /*怪异模式*/
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            /*标准模式*/
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}
/**
 * [caseCount 统计字符串中字母的个数]
 * @return {[type]} [返回统计个数的对象]
 */
String.prototype.caseCount = function() {
    var temp = {},
        len = this.length;
    for (var i = 0; i < len; i++) {
        var v = this.charAt(i);
        /**
         * 利用对象属性名不重复的特性
         * 将数组每一位放入到对象里作为属性
         */
        if (!temp[v]) {
            temp[v] = null;
        }
        temp[v] += 1;
    }
    return temp;
}
/**
 * [argToArr 将arguments转换为真正数组]
 * @return {[type]} [返回转换的数组]
 */
function argToArr() {
    //方法1
    var args1 = Array.prototype.slice.call(arguments);
    //方法2
    var args2 = [].slice.call(arguments, 0);
    //方法3 ES2015
    const args3 = Array.from(arguments);
    //方法4 高性能
    var args4 = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    console.log(arguments);
    return (args4 || args1 || args2 || args3);
}
/**
 * [shuffle1 打乱数组顺序方法1]
 * @return {[type]} [返回打乱后的数组]
 */
Array.prototype.shuffle1 = function() {
    var j,
        x;
    for (var i = 0; i < this.length; i++) {
        j = parseInt(Math.random() * i);
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }
    return this;
};
/**
 * [shuffle2 打乱数组顺序方法2]
 * @return {[type]} [返回打乱后的数组]
 */
Array.prototype.shuffle2 = function() {
    this.sort(function() {
        return (Math.random() - 0.5);
    });
    return this;
};
/**
 * [concatArr 按特定顺序合并数组]
 * @param  {[type]} a    [数组a]
 * @param  {[type]} b    [数组b]
 * @param  {[type]} flag [true为升序，false为降序]
 * @return {[type]}      [返回合并后的数组]
 */
function concatArr(a, b, flag) {
    var c = a.concat(b);
    flag = flag;
    var comp = function(a, b) {
        if (flag) {
            /*升序*/
            return a - b;
        } else {
            /*降序 */
            return b - a;
        }
    }
    /*去重 c.unique();*/
    return c.sort(comp);
}
/**
 * [coverCase 首字母大小写转换]
 * @param  {[type]} flag [true为转换为大写，false转换为小写]
 * @return {[type]}      [返回转换后的字符串]
 */
String.prototype.coverCase = function(flag) {
    if (flag) {
        return this.substring(0, 1).toUpperCase() + this.substring(1);
    } else {
        return this.substring(0, 1).toLowerCase() + this.substring(1);
    }
}
/**
 * [getUserData 返回用户自定义属性--兼容，需调用coverCase()]
 * @param  {[type]} elem [目标元素]
 * @param  {[type]} data [自定义属性]
 * @return {[type]}      [返回自定义属性值]
 */
function getUserData(elem, data) {
    if (elem.dataset) {
        var arrCase = data.split("-"),
            len = arrCase.length,
            str = "";
        /*若自定义属性名被连字符分隔的长度大于2*/
        if (len > 2) {
            /*返回data- 后面驼峰式写法*/
            str += arrCase[1];
            for (var i = 2; i < len; i++) {
                str += getUserData(arrCase[i], true);
            }
        } else {
            /*否则返回data- 的第一个小写*/
            str += arrCase[1];
        }
        return elem.dataset[str];
    } else {
        return elem.getAttribute(data);
    }
}

/**
 * [getSubstr 将一个字符串按照长度分成几个字符串]
 * @param  {[type]} len [需要切割的长度]
 * @return {[type]}     [以数组形式返回切割后的所有字符串]
 */
String.prototype.getSubstr = function(len) {
    var strArr = [],
        str = this;
    if (len > 0) {
        while (str) {
            strArr.push(str.substring(0, len));
            str = str.slice(len, str.length);
        }
    } else {
        strArr.push(this.toString());
    }
    return strArr;
}

/**
 * [inherit 继承实现--圣杯模式]
 * @param  {[type]} Target [子类]
 * @param  {[type]} Origin [父类]
 * @return {[type]}        [undefined]
 */
function inherit(Target, Origin) {
    function F() {}; /*临时构造函数*/
    F.prototype = Origin.prototype;
    /*此处顺序不能改变*/
    Target.prototype = F.prototype;
    Target.prototype = new F();
    /*目标构造函数原型属性constructor指向 目标构造函数*/
    Target.prototype.constructor = Target;
}
/**
 * [isPrime 判断是否为质数]
 * @return {Boolean} [undefined]
 */
Number.prototype.isPrime = function() {
    var n = this;
    if (n <= 3) {
        /*优化：判断是不是2，或者是不是小于1*/
        return n > 1;
    }
    if (n % 2 == 0 || n % 3 == 0) {
        /*排除被2和3整除的数*/
        return false;
    }
    for (var i = 5; i * i <= n; i += 6) {
        /**
         * 循环到目标数的开方即可
         * 排除被5整除的数
         * 若不能直接跳到当前除数之后的第5位数
         * 节约查找事件
         */
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}
/*获取元素的宽高*/
function getElHeight(elem) {
    if (elem != undefined) {
        return {
            height: elem.clientHeight || elem.offsetHeight,
            width: elem.clientWidth || elem.offsetWidth
        }
    } else
        return 0;
}
/**
 * [modifyPdEl 修改伪元素样式]
 * @param  {[type]} pdel     [description]
 * @param  {[type]} newStyle [description]
 * @return {[type]}          [description]
 */
function modifyPdEl(pdel, newStyle) {
    if (document.styleSheets[0].addRule) {
        // 支持IE
        document.styleSheets[0].addRule(pdel, newStyle);
    } else {
        // 支持非IE的现代浏览器
        var s = pdel + "{" + newStyle + "}";
        document.styleSheets[0].insertRule(s, 0);
    }
}
/**
 * [cirMotion 将元素子节点按圆周排列]
 * @param  {[type]} e [目标元素]
 * @param  {[type]} x   [相对于第一个有定位祖先节点的原点x坐标]
 * @param  {[type]} y   [相对于第一个有定位祖先节点的原点y坐标]
 * @param  {[type]} r   [第一个有定位祖先节点的半径]
 * @return {[type]}     [description]
 */
function cirMotion(e, x, y, r) {
    var child = e.children,
        childCount = e.childElementCount;
    for (var i = 0; i < childCount; i++) {
        /**
         * [将子节点按以(x,y)为原点，r为半径的圆周排列，
         * 然后减去子元素的1/2宽和高,紧密程度调整sin，cos函数,
         * 若对应的半径 r 减小则为椭圆 ]
         * @param  {[type]} j [立即执行函数参数]
         * @return {[type]}   [description]
         */
        (function(j) {
            child[j].style.left = (x - Math.cos(j) * r - child[j].offsetWidth / 2) + 'px';
            child[j].style.top = (y - Math.sin(j) * r - child[j].offsetHeight / 2) + 'px';

        })(i);
    }
}
/**
 * [createRectGradient canvas全填充图形渐变]
 * @param  {[type]} ctx [2D上下文对象]
 * @param  {[type]} x   [图形、渐变起点坐标]
 * @param  {[type]} y   [图形、渐变起点坐标]
 * @param  {[type]} w   [图形宽度]
 * @param  {[type]} h   [图形高度]
 * @return {[type]}     [CanvasGradient对象]
 */
function createRectGradient(ctx, x, y, w, h) {
    return ctx.createLinearGradient(x, y, x + w, y + h);
}
/**
 * [log 兼容浏览器向控制台写入消息]
 * @param  {[type]} message [消息记录]
 * @return {[type]}         [undefined]
 */
function log(message) {
    if (typeof console == "object") {
        console.log(message);
    } else if (typeof opera == "object") {
        opera.postError(message);
    } else if (typeof java == "object" && typeof java.lang == "object") {
        java.lang.System.out.println(message);
    }
}
/**
 * [transform 跨浏览器使用XSLT]
 * @param  {[type]} context [要执行转换的上下文节点]
 * @param  {[type]} xslt    [XSLT文档对象]
 * @return {[type]}         [description]
 */
function transform(context, xslt) {
    //检测是否存在XSLTProcessor类型
    if (typeof XSLTProcessor != "undefined") {
        //存在XSLTProcessor，使用该类型进行转换
        var processor = new XSLTProcessor();
        processor.importStylesheet(xslt);
        var result = processor.transformToDocument(context);
        //返回结果序列化
        return (new XMLSerializer()).serializeToString(result);
    } else if (typeof context.transformNode != "undefined") {
        //上下文节点有transformNode()，调用该方法返回
        return context.transformNode(xslt);
    } else {
        throw new Error("No XSLT processor available");
    }
}
/**
 * [createXHR 兼容创建XHR对象]
 * @return {[type]} [description]
 */
function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(version[i]);
                    arguments.callee.activeXString = versions[i];
                } catch (ex) {
                    //跳过
                }
            }
        }
        return new ActiveXObeject(arguments.callee.activeXString);
    } else {
        throw new Error("NO XHR object available");
    }
}

/**
 * [submitData Ajax表单数据序列化]
 * @param  {[type]} url    [目标处理文件]
 * @param  {[type]} formID [当前表单ID]
 * @return {[type]}        [description]
 */
function submitData(url, formID) {
    var xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                console.log(xhr.responseText);
            } else {
                console.log("request was unsuccessful : " + xhr.status);
            }
        }
    };
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencodeed");
    var form = document.getElementById(formID);
    xhr.send(serialize(form));
}
/**
 * [createStreamClient 使用XHR对象实现HTTP流]
 * @param  {[type]} url      [要连接的URL]
 * @param  {[type]} progress [在接收到数据时调用的函数]
 * @param  {[type]} finished [关闭连接时调用的函数]
 * @return {[type]}          [xhr Object]
 */
function createStreamClient(url, progress, finished) {
    var xhr = new XMLHttpRequest(),
        received = 0;
    xhr.open("get", url, true);
    xhr.onreadystatechange = function() {
        var result;
        if (xhr.readyState == 3) {
            //只取得最新数据并调整计数器
            result = xhr.responseText.substring(received);
            receive += result.length;
            //调用progress回调函数
            progress(result);
        } else if (xhr.readyState == 4) {
            finished(xhr.responseText);
        }
    };
    xhr.send(null);
    return xhr;
}
/**
 * [CookieUtil JS Cookie操作对象]
 * @type {Object}
 */
var CookieUtil = {
    /**
     * [getJSCookie 根据cookie的名字获取相应的值]
     * @param  {[type]} name [cookie name]
     * @return {[type]}      [description]
     */
    getJSCookie: function(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        //查找cookie名上加等号的位置
        if (cookieStart > -1) {
            //存在等号，继续查找第一个分号的位置
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            //没找到分号，表示该cookie是字符串中最后一个
            //余下的字符串都是cookie的值
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            //使用decodeURIComponent()进行解码
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        //返回cookie，不存在则返回null
        return cookieValue;
    },
    /**
     * [setJSCookie 页面上设置一个cookie]
     * @param {[type]} name    [cookie name]
     * @param {[type]} value   [cookie value]
     * @param {[type]} expires [cookie 有效期限 Date]
     * @param {[type]} path    [可选URL]
     * @param {[type]} domain  [可选域]
     * @param {[type]} secure  [可选安全标志secure布尔值]
     */
    setJSCookie: function(name, value, expires, path, domain, secure) {
        //对cookie name和cookie value进行URL编码
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            //expires参数格式化Date对象
            cookieText += ": expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += ";path=" + path;
        }
        if (domain) {
            cookieText += ";domain=" + domain;
        }
        if (secure) {
            cookieText += ";secure";
        }
        document.cookie = cookieText;
    },
    /**
     * [unset 通过覆盖的方式完成cookie删除效果]
     * @param  {[type]} name   [使用相同的name]
     * @param  {[type]} path   [使用相同的URL]
     * @param  {[type]} domain [使用相同的域]
     * @param  {[type]} secure [使用相同的安全标志]
     * @return {[type]}        [description]
     */
    unset: function(name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
/**
 * [getIndex 索引为负数时将从数组尾部算起]
 * @param  {[type]} i    [现索引值]
 * @param  {[type]} len  [数组长度]
 * @param  {[type]} loop [目标索引]
 * @return {[type]}      [description]
 */
function getIndex(i, len, loop) {
    return (i - loop) < 0 ? (i - loop + len):(i - loop);
}