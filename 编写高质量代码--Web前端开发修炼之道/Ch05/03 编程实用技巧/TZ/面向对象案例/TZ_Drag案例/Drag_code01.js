function Drag(id) {
	this.oBox=document.getElementById(id);
	this.disX = 0;
	this.disY = 0;
	var _this = this;
	this.oBox.onmousedown = function() {
		_this.fnDown();
	};
}
Drag.prototype = {
	//鼠标按下事件
	fnDown: function(ev){
		var oEvent = ev||event;
		this.disX = oEvent.clientX - this.oBox.offsetLeft;
		this.disY = oEvent.clientY - this.oBox.offsetTop;
		var _this = this;
		document.onmousemove = function() {
			_this.fnMove();
		};
		document.onmouseup = function() {
			_this.fnUp();
		};
	},
	//鼠标移动事件
	fnMove: function(ev){
		var oEvent=ev||event;

		this.oBox.style.left = oEvent.clientX - this.disX + 'px';
		this.oBox.style.top = oEvent.clientY - this.disY + 'px';
	},
	//鼠标抬起事件
	fnUp: function(){
		document.onmousemove = null;
		document.onmouseup = null;
	}
};