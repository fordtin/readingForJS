
var GLOBAL = {};
GLOBAL.namespace = function(str) {
	var arr = str.split("."),
		o = GLOBAL;
	for(i = (arr[0] == "GLOBAL") ? 1 : 0; i < arr.length; i++) {
		o[arr[i]] = o[arr[i]] || {};
		o = o[arr[i]];
	}
};

// DOM相关
	GLOBAL.namespace("Dom");
	GLOBAL.Dom.getNextNode = function(node) {
		node = typeof node == "string" ? document.getElementById(node) : node;
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
	GLOBAL.Dom.setOpacity = function(node, level) {
		node = typeof node == 'string' ? document.getElementById(node) : node;
		if(document.all) {
			node.style.filter = 'alpha(opacity=' + level + ')';
		}
		else {
			node.style.opacity = level / 100;
		}
	};
	GLOBAL.Dom.get = function(node) {
		node = typeof node == 'string' ? document.getElementById(node) : node;
		return node;
	};
	GLOBAL.Dom.getElementsByClassName = function(str, root, tag) {
		if(root) {
			root = typeof root == 'string' ? document.getElementById(root) : root;
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
// Event相关
	GLOBAL.namespace('Event');
	GLOBAL.Event.getEventTarget = function(e) {
		e = window.event || e;
		return e.srcElement || e.target;
	};
	GLOBAL.Event.stopPropagation = function(e) {
		e = window.event || e;
		if(document.all) {
			e.cancelBubble = true;
		}
		else {
			e.stopPropagation();
		}
	};
	GLOBAL.Event.on = function(node, eventType, handler) {
		node = typeof node == 'string' ? document.getElementById(node) : node;
		if(document.all) {
			node.attachEvent('on' + eventType, handler);
		}
		else {
			node.addEventListener(eventType, handler, false);
		}
	};
// Lang相关
	GLOBAL.namespace('Lang');
	GLOBAL.Lang.trim = function(ostr) {
		return ostr.replace(/^\s+|\s+$/g, '');
	};
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







