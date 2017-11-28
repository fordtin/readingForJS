
var GLOBAL = {};
// 定义命名空间函数
GLOBAL.namespace = function(str) {
	var arr = str.split("."),
		o = GLOBAL;
	for(i = (arr[0] === "GLOBAL") ? 1 : 0; i < arr.length; i++) {
		o[arr[i]] = o[arr[i]] || {};
		o = o[arr[i]];
	}
};

// DOM相关（用来操作DOM、包括获取DOM节点和设置DOM属性）————————Dom命名空间
	GLOBAL.namespace("Dom");
	// 获取下一节点
	GLOBAL.Dom.getNextNode = function(node) {
		node = GLOBAL.Dom.get(node);
		var nextNode = node.nextSibling;
		if(!nextNode) return null;
		if(!document.all) {
			while(true) {
				if(nextNode.nodeType == 1) {
					break;
				}
				else {
					if(nextNode.nextSibling) {
						nextNode = nextNode.nextSibling;
					}
					else {
						break;
					}
				}
			}
		}
		return nextNode;
	};
	// 获取样式
	GLOBAL.Dom.getStyle = function(node, attr) {
		node = GLOBAL.Dom.get(node);
		return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(node, false)[attr];
	};
	// 设置透明度
	GLOBAL.Dom.setOpacity = function(node, level) {
		node = GLOBAL.Dom.get(node);
		if(document.all) {
			node.style.filter = 'alpha(opacity=' + level + ')';
		}
		else {
			node.style.opacity = level / 100;
		}
	};
	// 通过ID获取元素节点 node为DOM节点id或DOM节点本身
	GLOBAL.Dom.get = function(node) {
		node = typeof node === 'string' ? document.getElementById(node) : node;
		return node;
	};
	// 获取class 第一个参数必须的（class名）、第二个参数父容器，缺省为body节点、第三个参数为DOM节点标签名
	GLOBAL.Dom.getElementsByClassName = function(str, root, tag) {
		if(root) {
			root = get(root);
		}
		else {
			root = document.body;
		}
		tag = tag || '*';
		var eles = root.getElementsByTagName(tag), // 获取父容器下所有标签
			arr = [];
		for(var i = 0, n = eles.length; i < n; i++) {
			for(var j = 0, k = eles[i].className.split(' '), l = k.length; j < l; j++) {
				if(k[j] == str) {
					arr.push(eles[i]);
					break;
				}
			}
		}
		return arr;
	};

	// 添加class
	GLOBAL.Dom.addClass = function(node, str) {
		if(!new RegExp("(^|\\s+)"+str).test(node.className)) {
			node.className = node.className + ' ' + str;
		}
	};
	// 移除class
	GLOBAL.Dom.removeClass = function(node, str) {
		node.className = node.className.replace(new RegExp("(^|\\s+)" + str), '');
	};
	// 设置节点的文本
	GLOBAL.Dom.setInnerText = function(node, str) {
		node = GLOBAL.Dom.get(node);
		if(typeof node.textContent === 'string') { // textContent: 不支持低版本 IE; 兼容 Chrome / Firefox / Safari / Opera / IE9
			node.textContent = str;
		}
		else { // innerText: 不支持Firefox; 兼容其他浏览器
			node.innerText = str;
		}
	};
	// 获取节点的文本
	GLOBAL.Dom.getInnerText = function(node) {
		node = GLOBAL.Dom.get(node);
		return (typeof node.textContent === 'string') ? node.textContent : node.innerText;
	};


	// GLOBAL.Dom.hasClass = function (name,type) {
 //        var r = [];
 //        var re = new RegExp("(^\\s)" + name + "(\\s$)");
 //        var e = document.getElementsByTagName(type  "*");
 //        for (var j = 0; j < e.length; j++) {
 //            if (re.test(e[j])) {
 //                r.push(e[j]);
 //            }
 //        }
 //        return r;
 //    }	


// Event相关（用来操作事件，包括访问event对象的属性和设置事件监听）————————Event命名空间
	GLOBAL.namespace('Event');
	// 获取event对象
	GLOBAL.Event.getEvent = function(e) {
		return e ? e : window.event;
	};
	// 获取目标元素
	GLOBAL.Event.getEventTarget = function(e) {
		return e.srcElement || e.target;
	};
	// 阻止冒泡
	GLOBAL.Event.stopPropagation = function(e) {
		if(e.stopPropagation) {
			e.stopPropagation();
		}
		else {
			e.cancelBubble = true;
		}
	};
	// 添加事件（或者说监听事件）
	GLOBAL.Event.addHandler = function(node, eventType, handler, scope) {
		node = GLOBAL.Dom.get(node);
		scope = scope || node;
		if(node.addEventListener) {
			node.addEventListener(eventType, function() {handler.apply(scope, arguments)}, false);
		}
		else if(node.attachEvent) {
			node.attachEvent('on' + eventType, function() {handler.apply(scope, arguments)});
		}
		else {
			node['on' + eventType] = handler;
		}
	};
	// 移除事件
	GLOBAL.Event.removeHandler = function(node, eventType, handler, scope) {
		node = GLOBAL.Dom.get(node);
		scope = scope || node;
		if(node.removeEventListener) {
			node.removeEventListener(eventType, function(){handler.apply(scope, arguments)}, false);
		}
		else if(node.attachEvent) {
			node.attachEvent('on' + eventType, function(){handler.apply(scope, arguments)});
		}
		else {
			node['on' + eventType] = null;
		}
	};
	// 取消事件默认行为
	GLOBAL.Event.preventDefault = function(e) {
		if(e.preventDefault) {
			e.preventDefault();
		}
		else {
			e.returnValue = false;
		}
	};
// Lang相关（用来模拟其它语言提供原生JavaScript不提供的函数，如trim/extend/isNumber）————————Lang命名空间
	GLOBAL.namespace('Lang');
	// 去除字符串首尾空格
	GLOBAL.Lang.trim = function(ostr) {
		return ostr.replace(/^\s+|\s+$/g, '');
	};
	// 判断 obj 是否是 DOM 节点
	GLOBAL.Lang.isElement = function(obj) {
		return !!(obj && obj.nodeType === 1);
	};

	// 判断 obj 是否是数字
	GLOBAL.Lang.isNumber = function(obj) {
		return Object.prototype.toString.call(obj) === '[Object Number]';
	};

	// 判断 obj 是否是字符串
	GLOBAL.Lang.isString = function(obj) {
		return Object.prototype.toString.call(obj) === '[Object String]';
	};
	// 判断 obj 是否是对象  看underscore源码可以知道，函数也被视为对象， undefined ， null ， NaN 等则不被认为是对象
	GLOBAL.Lang.isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	// 判断 obj 是否是一个非数字
	GLOBAL.Lang.isNaN = function(obj) {
		return isNumber(obj) && isNaN(obj);
	};

	// 判断 obj 是否是布尔类型
	GLOBAL.Lang.isBoolean = function(obj) {
		return obj === true || obj === fasle || Object.prototype.toString.call(obj) === '[Object Boolean]';
	};
	// 判断 obj 是否是函数
	GLOBAL.Lang.isFunction = function(obj) {
		return Object.prototype.toString.call(obj) === '[Object Function]';
	};

	// 判断 obj 是否是 null
	GLOBAL.Lang.isNull = function(obj) {
		return obj === null;
	};	

	// 判断 obj 是否是 undefined
	GLOBAL.Lang.isUndefined = function(obj) {
		return obj === void 0;
	};	
	// 判断 obj 是否是数组
	GLOBAL.Lang.isArray = function(obj) {
		return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[Object Array]';
	};

	// 支持面向对象（模仿）————继承
	GLOBAL.Lang.extend = function(subClass, superClass) {
		var F = function() {};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superClass = superClass.prototype;
		if(superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	};
// Cookie相关
	GLOBAL.namespace("Cookie");
	GLOBAL.Cookie = {
		// 读取
		read: function(name) {
			var cookieStr = ";" + document.cookie + ";";
			var index = cookieStr.indexOf("; " + name + "=");
			if(index != -1) {
				var s = cookieStr.substring(index + name.length + 3, cookieStr.length);
				return unescape(s.substring(0, s.indexOf("; ")));
			}
			else {
				return null;
			}
		},
		// 设置
		set: function(name, value, expires) {
			var expDays = expires * 24 * 60 * 60 * 1000;
			var expDate = new Date();
			expDate.setTime(expDate.getTime() + expDays);
			var expString = expires ? "; expires=" + expDate.toGMTString() : "";
			var pathString = ";path=/";
			document.cookie = name + "=" + escape(value) + expString + pathString;
		},
		// 删除
		del: function(name) {
			var exp = new Date(new Date().getTime() - 1);
			var s = this.read(name);
			if(s != null) {
				document.cookie = name + "=" + s + "; expires=" + exp.toGMTString() + "; path=/";
			}
		}
	};
// Ajax相关
// Drag相关（拖拽）
// Resize相关（拖拉）
// Animation相关
// Tab切换（标签切换）
// Tree目录（树型目录）
// Msg相关(模拟弹窗)
// ColorPicker相关（拾色器
// Calendar相关（日历
// RichTextEditor相关（富文本编辑器）

/*
	// 按需加载
	common_cookie.js
	common_draj.js
	common_tab.js
*/







