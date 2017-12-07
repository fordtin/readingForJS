

// 可以将这个Tab构造函数想象成一个Tab类
// @param {Object} id：选项卡id以参数的形式传入
function Tab(id) {
	var tabBox = document.getElementById(id);
	//将之前的全局变量变为对象的属性
	this.tabBtn = tabBox.getElementsByTagName('input');
	this.tabDiv = tabBox.getElementsByTagName('div');

	for(var i=0;i < this.tabBtn.length;i++){
		this.tabBtn[i].index = i;
		 //将this保存成一个变量，就可以在下面代码中调用对象的方法了
		var _this = this;
		this.tabBtn[i].onclick = function(){
			//注意参数this代表的是this.tabBtn[i]，即input按钮
			_this.clickBtn(this);
		}
	}
}
//将之前的全局函数添加到构造函数的原型里，作为对象的一个方法
Tab.prototype.clickBtn = function(btn) {
	// alert(this); // [object Object]
	for(var j = 0; j < this.tabBtn.length; j++){
	    this.tabBtn[j].className='';
	    this.tabDiv[j].style.display='none';
	}
	 btn.className='active';
	 this.tabDiv[btn.index].style.display='block';
}