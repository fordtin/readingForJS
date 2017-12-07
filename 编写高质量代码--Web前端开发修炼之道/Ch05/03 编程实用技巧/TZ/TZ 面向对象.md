
[TOC]

# <a href="javascript:void(0);" id="top">面向对象</a>

**面向对象的选项卡：把面向过程的程序一步步改成面向对象的形式，使其能够更加的通用(但是通用的东西，一般会比较臃肿)**
## 一、面向对象的选项卡
一个简单的选项卡，也是我们常见的面向过程的创建形式
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix1 简单的选项卡.html">简单的选项卡</a>
```
 #tabBox input {
     background: #F6F3F3;
     border: 1px solid #FF0000;
 }
 #tabBox .active {
     background: #E9D4D4;
 }
 #tabBox div {
     width:300px; 
     height:250px; 
     display:none;
     padding: 10px;
     background: #E9D4D4;
     border: 1px solid #FF0000;
 }

<div id="tabBox">
	<input type="button" value="游戏" class="active" />
	<input type="button" value="旅行" />
	<input type="button" value="音乐" />
	<div style="display:block;">GTA5、孤岛惊魂</div>
	<div>澳大利亚、西藏</div>
	<div>暗里着迷、一生有你</div>
</div>



window.onload=function(){
 var tabBox = document.getElementById('tabBox');
 var tabBtn = tabBox.getElementsByTagName('input');
 var tabDiv = tabBox.getElementsByTagName('div');
 
 for(var i=0;i<tabBtn.length;i++){
     tabBtn[i].index = i;
     tabBtn[i].onclick = function (){
         for(var j=0;j<tabBtn.length;j++){
             tabBtn[j].className='';
             tabDiv[j].style.display='none';
         }
         this.className='active';
         tabDiv[this.index].style.display='block';
     };
 }
};
```
下面来一步步改成面向对象的形式
### 1.1 将嵌套的函数拿到window.onload外面，不能有函数嵌套，可以有全局变量
如下：所有的改写最终效果都不变
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix2 改成面向对象.html">将嵌套的函数拿到window.onload外面，不能有函数嵌套，可以有全局变量</a>
```

//将在嵌套函数里的变量提取到全局中
var tabBtn = null;
var tabDiv = null;
window.onload=function(){
 var tabBox = document.getElementById('tabBox');
     tabBtn = tabBox.getElementsByTagName('input');
     tabDiv = tabBox.getElementsByTagName('div');
 
 for(var i=0;i<tabBtn.length;i++){
     tabBtn[i].index = i;
     //此处调用函数即可
     tabBtn[i].onclick = clickBtn;
 }
};
//将嵌套函数提取到全局中
function clickBtn(){
     for(var j=0;j<tabBtn.length;j++){
         tabBtn[j].className='';
         tabDiv[j].style.display='none';
     }
     this.className='active';
     tabDiv[this.index].style.display='block';
 };
```
### 1.2 将全局的变量变为对象的属性，全局的函数变为对象的方法；将window.onload里的代码提取到一个构造函数里面，在window.onload里创建对象即可
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix3 全局的变量变为对象的属性，全局的函数变为对象的方法.html">将全局的变量变为对象的属性，全局的函数变为对象的方法</a>
(下面的代码执行起来是有问题的)
注意：在构造函数Tab里的this跟之前this所代表的是不同的(此处是通过new来创建对象的)；在上面的示例中，this指的是调用者；在构造函数里，this指向的是var tab = new Tab() ，即tab这个对象，注意是对象。
分析：我们在Tab的原型上添加clickBtn方法后，clickBtn方法里的this本应该是指向var tab = new Tab()的，但是将clickBtn添加给了this.tabBtn[i]，即input按钮，clickBtn的所属由Tab对象变成了input按钮

clickBtn的所属变成input按钮后，那么clickBtn里的this指向按钮，那再来看clickBtn里的代码，this.tabBtn、this.tabDiv，input按钮里有这两个属性吗？没有，所以会出错！

```
window.onload = function(){
    var tab = new Tab('tabBox');
};
// 将之前window.onload里的代码提到一个构造函数里.
// 可以将这个Tab构造函数想象成一个Tab类,@param {Object} id：选项卡id以参数的形式传入
function Tab(id) {
    var tabBox = document.getElementById(id);
    //将之前的全局变量变为对象的属性
    this.tabBtn = tabBox.getElementsByTagName('input');
    this.tabDiv = tabBox.getElementsByTagName('div');

    for(var i=0;i < this.tabBtn.length;i++){
        this.tabBtn[i].index = i;
         //此处调用函数即可
        this.tabBtn[i].onclick = this.clickBtn;
    }
}
//将之前的全局函数添加到构造函数的原型里，作为对象的一个方法
Tab.prototype.clickBtn = function() {
    alert(this); // [object HTMLInputElement]
    for(var j = 0; j < this.tabBtn.length; j++){
        this.tabBtn[j].className='';
        this.tabDiv[j].style.display='none';
    }
     this.className='active';
     this.tabDiv[this.index].style.display='block';
 };

```
将clickBtn赋给input按钮后，方法内的this也指向了input按钮
### 1.3  将clickBtn的调用放在一个函数里，这样就不会改变clickBtn的所属了
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix4 clickBtn的调用放在一个函数里.html">将clickBtn的调用放在一个函数里</a>
注意在function里需要用到外部保存的变量_this
此时弹出的是一个Object，说明clickBtn的所属关系没变，还是Tab对象
但是还有另一个问题，此时clickBtn里的this指向对象
this.className、this.index，此处的this指的是tab对象，那么对象中有这两个属性吗？没有，还会出错！
```
window.onload = function(){
    var tab = new Tab('tabBox');
};
// 将之前window.onload里的代码提到一个构造函数里.
// 可以将这个Tab构造函数想象成一个Tab类,@param {Object} id：选项卡id以参数的形式传入
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
            _this.clickBtn();
        }
    }
}
//将之前的全局函数添加到构造函数的原型里，作为对象的一个方法
Tab.prototype.clickBtn = function() {
    alert(this); // [object Object]
    for(var j = 0; j < this.tabBtn.length; j++){
        this.tabBtn[j].className='';
        this.tabDiv[j].style.display='none';
    }
     this.className='active';
     this.tabDiv[this.index].style.display='block';
}

```
### 1.4 以参数的形式将点击的按钮传入clickBtn中
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix5 以参数的形式将点击的按钮传入clickBtn中.html">以参数的形式将点击的按钮传入clickBtn中</a>
```
window.onload = function(){
    var tab = new Tab('tabBox');
};

// Tab.js
// 将之前window.onload里的代码提到一个构造函数里.
// 可以将这个Tab构造函数想象成一个Tab类,@param {Object} id：选项卡id以参数的形式传入
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

```
### 1.5 两个Tab
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/T.1 Tab_appendix6 两个Tab.html">两个Tab</a>
```
 .tab input {
     background: #F6F3F3;
     border: 1px solid #FF0000;
 }
 .tab .active {
     background: #E9D4D4;
 }
 .tab div {
     width:300px; 
     height:250px; 
     display:none;
     padding: 10px;
     background: #E9D4D4;
     border: 1px solid #FF0000;
 }

<div class = 'tab' id="tabBox">
    <input type="button" value="游戏" class="active" />
    <input type="button" value="旅行" />
    <input type="button" value="音乐" />
    <div style="display:block;">GTA5、孤岛惊魂</div>
    <div>澳大利亚、西藏</div>
    <div>暗里着迷、一生有你</div>
</div>
<br />
<div class="tab" id="tabBox2">
    <input type="button" value="技术" class="active" />
    <input type="button" value="工具" />
    <input type="button" value="网站" />
    <div style="display:block;">Java、Spring</div>
    <div>Eclipse、HBuilder</div>
    <div>博客园、CSD</div>
</div>

window.onload = function(){
    var tab = new Tab('tabBox');
    var tab2 = new Tab('tabBox2');
};
Tab.js
```

面向过程：简洁、美观、容易维护；

面向对象：容易出错、混乱、难以维护；面向对象相对面向过程来说，写代码的时候麻烦些，但是用起来很方便，面向过程则相反。

## 二、简单总结一下JS面向对象中的this
<a href="#top" style="font-size: 30px; font-weight: 700; color: #ff0000;">返回顶部</a>
重点：JS面向对象中的this
js中面向对象大部分时候出问题就是出在this的处理上，需要注意
this一般会在两种情况下出问题，一是使用定时器、二是事件

### 2.1 setTimeout中的this
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this_code01 setTimeout中的this.html">setTimeout中的this</a>
this.name，此处的this指向谁？指向window，因为setInterval是属于window的
```
function Person(name) {
    this.name = name;
    //定时器
    setTimeout(this.showName, 3000);
}
Person.prototype.showName = function() {
    alert(this); // [object Window]
    alert('姓名：' + this.name); // 姓名：
};
var p1 = new Person('李明');
```
<img src="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this01.png" alt="" />
<img src="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this02.png" alt="" />
解决办法：上面选项卡例子中已列出，即用一个function将要执行的代码包裹起来，使其所属关系不会发生变化
注意function里调用方法时使用的是外部变量'_this'。
### 2.2 保存this指针
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this_code02 保存this指针.html">保存this指针</a>
```
function Person(name) {
    this.name = name;
    //定时器
    var _this = this;
    setTimeout(function() {
        _this.showName();
    }, 3000);
}
Person.prototype.showName = function() {
    alert(this); // [object Object]
    alert('姓名：' + this.name);  // 姓名：李明
};
var p1 = new Person('李明');

```
<img src="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this03.png" alt="" />
<img src="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/this04.png" alt="" />
## 三、拖拽
### 3.1 原始的面向过程代码  
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/D.1 Drag_code01 原始的面向过程代码 .html">面向过程代码</a>
```
#box {
    width: 100px; 
    height: 100px; 
    background: blue; 
    position: absolute;
}
<div id="box"></div>

// 原始的面向过程代码    
    var oBox=null;
    var disX=0;
    var disY=0;

    window.onload=function(){
        oBox=document.getElementById('box');
        oBox.onmousedown=fnDown;
    };
    //鼠标按下事件
    function fnDown(ev){
        var oEvent = ev||event;
        disX = oEvent.clientX - oBox.offsetLeft;
        disY = oEvent.clientY - oBox.offsetTop;

        document.onmousemove = fnMove;
        document.onmouseup = fnUp;
    }
    //鼠标移动事件
    function fnMove(ev){
        var oEvent=ev||event;

        oBox.style.left = oEvent.clientX - disX + 'px';
        oBox.style.top = oEvent.clientY - disY + 'px';
    }
    //鼠标抬起事件
    function fnUp(){
        document.onmousemove = null;
        document.onmouseup = null;
    }
```
### 3.2 面向对象的代码
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/D.1 Drag_code02 面向对象的代码.html">面向对象的代码</a>
```
window.onload=function(){
    new Drag('box');
};

// 面向对象的代码 
    // Drag.js
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
```
### 3.3 复用————拖拽
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/D.1 Drag_code03 复用(拖拽).html">复用————拖拽</a>
```
.box {
    width: 100px; 
    height: 100px; 
    position: absolute; 
}
#box {
    background-color: #ff0000;
    left: 200px;
}
#box2 {
    background-color: #00ff00;  
}

<div class="box" id="box"></div>
<div class="box" id="box2"></div>


window.onload=function(){
    new Drag('box');
    new Drag('box2');
};
Drag.js
```
### 3.4 面向对象拖拽
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_05 面向对象(拖拽).html">面向对象(拖拽)</a>
可以看到红色和绿色的都出边界了，但不想去修改代码，该怎么做？
可以写一个子类来做一些更加具体的操作，又保留了父类的功能，就是继承。
```
// 面向对象的代码 
// Drag.js
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


/**
* DragLimit
* 限制边界的拖拽，继承自Drag
*/


function DragLimit(id) {
    Drag.call(this, id);
}
for(var p in Drag.prototype) {
    DragLimit.prototype[p] = Drag.prototype[p];
}
DragLimit.prototype.fnMove = function(ev) {
    var oEvent = ev || event;

    var left = oEvent.clientX - this.disX;
    var top = oEvent.clientY - this.disY;

    if(left < 0) {
        left = 0;
    } else if(left > document.documentElement.clientWidth - this.oBox.offsetWidth) {
        left = document.documentElement.clientWidth - this.oBox.offsetWidth;
    }
    if(top <= 0) {
        top = 0;
    }
    else if(top > document.documentElement.clientHeight - this.oBox.offsetHeight) {
        top = document.documentElement.clientHeight - this.oBox.offsetHeight;
    }

    this.oBox.style.left = left + 'px';
    this.oBox.style.top = top + 'px';
}

```

## 四、面向对象————高级篇
<a href="#top" style="font-size: 30px; font-weight: 700; color: #ff0000;">返回顶部</a>
### 4.1 json方式的面向对象
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_01 json方式的面向对象.html">json方式的面向对象</a>
js中出现的东西都能够放到json中
关于json数据格式：<a id="cb_post_title_url" href="http://www.cnblogs.com/SkySoot/archive/2012/04/17/2453010.html">JSON 数据格式</a>

json创建的简单对象：相比基础篇中的构造函数、原型等的创建方式，json方式简单方便；但是缺点很明显，如果想创建多个对象，那么会产生大量重复代码，不可取

JSON方式适用于只创建一个对象的情况，代码简介又优雅
```
var person = {
        name: "leo",
        age: 25,
        showName: function(){
        alert(this); //[Object Object]
        alert("姓名："+this.name); // 姓名：leo
    },
        showAge: function(){
        alert("年龄："+this.age); // 25
    }
};
person.showName();
person.showAge();
```

JSON在JS面向对象的应用中，主要的一个作用就是命名空间

如果有大量常用的js函数，利用json，我们可以将同一类函数放在一个“类”里，类似于java那样，这样我们就能很好的管理和查找使用这些js函数
<a href="https://github.com/fordtin/readingForJS/blob/master/%E7%BC%96%E5%86%99%E9%AB%98%E8%B4%A8%E9%87%8F%E4%BB%A3%E7%A0%81--Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BF%AE%E7%82%BC%E4%B9%8B%E9%81%93/base/js/base.js">命名空间示例</a>

<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_02 json用作命名空间.html">json用作命名空间</a>
```
//仿java.lang包
var lang = {};

lang.Math = {
  // 求绝对值
  abs: function(a){
     return a > 0 ? a : -a;
  },
  // 求最大值
  max: function(a, b){
     return a > b ? a : b;
  },
  PI: 3.1415926
};

lang.String = {
  // 求字符串长度
  length: function(str){
     return str.length;
  },
  // 将字符串转为小写
  toLowerCase: function(str){
     return str.toLowerCase();
  },
  // 将字符串转为大写
  toUpperCase: function(str){
     return str.toUpperCase();
  }
}

//调用
alert(lang.Math.abs(-22)); //22
alert(lang.Math.PI);
alert(lang.String.toUpperCase('happy')); // HAPPY
```

### 4.2 面向对象的继承
#### 4.2.1 JavaScript中的继承(Student ```<extends>``` Person)
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_03 面向对象的继承.html">面向对象的继承</a>
```
/**            
* Person 父类 人
* @param {Object} name
* @param {Object} sex
*/
function Person(name, sex){
    this.name = name;
    this.sex = sex;
}
Person.prototype.showName = function(){
    alert("姓名："+this.name); 
}
Person.prototype.showSex = function(){
    alert("性别："+this.sex); 
}
/*-----------------------------------------------------*/
/**
* Student   学生 继承 人
* @param {Object} name
* @param {Object} sex
* @param {Object} major 学生特有属性：专业
*/
function Student(name, sex, major){
    //调用父类的构造函数（通过call来调用父类的构造方法继承父类的属性）
    Person.call(this, name, sex);

    //添加自己的属性
    this.major = major;
}
//继承父类原型中的方法（通过原型来继承父类的方法___这种方式将影响父类(继承是不能影响父类的)）
Student.prototype = Person.prototype;
//添加自己特有的方法
Student.prototype.showMajor = function(){
    alert("专业："+this.major);
}

var student = new Student("leo", "男", "计算机");
student.showName(); // 姓名：leo
student.showSex(); // 性别：男
student.showMajor(); // 专业：计算机

alert(Person.prototype.showMajor); // function(){ alert("专业："+this.major); }
```
注意：
1.先调用父类构造函数，再添加自己的属性；先继承父类的方法，再添加自己的方法。
2.在子构造函数中调用Person.call()时，那么构造函数Person里的两行代码this.name=name, this.sex=sex中this就是代表student了，所以这两行代码相当于是在为student添加name和sex属性

解释为什么通过Student.prototype = Person.prototype来继承父类的方法会影响父类?
arr1和arr2弹出来的一样？
arr1和arr2都是指向这个数组对象的一个引用，所以改变arr2时，arr1也变了
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_06 数组对象的一个引用.html">数组对象的一个引用</a>
```
var arr1 = [1, 2, 3, 4, 5];
var arr2 = arr1;
arr2.push(6);

alert(arr1); //弹出1,2,3,4,5,6
alert(arr2); //弹出1,2,3,4,5,6
alert(typeof arr1); //object
alert(typeof arr2); //object
```

<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_04 面向对象的继承2.html">面向对象的继承</a>
```
/**            
* Person 父类 人
* @param {Object} name
* @param {Object} sex
*/
function Person(name, sex){
    this.name = name;
    this.sex = sex;
}
Person.prototype.showName = function(){
    alert("姓名："+this.name); 
}
Person.prototype.showSex = function(){
    alert("性别："+this.sex); 
}
/*-----------------------------------------------------*/
/**
* Student   学生 继承 人
* @param {Object} name
* @param {Object} sex
* @param {Object} major 学生特有属性：专业
*/
function Student(name, sex, major){
    //调用父类的构造函数（通过call来调用父类的构造方法继承父类的属性）
    Person.call(this, name, sex);

    //添加自己的属性
    this.major = major;
}
//继承父类原型中的方法（通过原型来继承父类的方法___这种方式将影响父类(继承是不能影响父类的)）
for(var p in Person.prototype) {
    Student.prototype[p] = Person.prototype[p];
}\
//添加自己特有的方法
Student.prototype.showMajor = function(){
    alert("专业："+this.major);
}

var student = new Student("leo", "男", "计算机");
student.showName(); // 姓名：leo
student.showSex(); // 性别：男
student.showMajor(); // 专业：计算机

alert(Person.prototype.showMajor); // undefined
```
### 4.3 JavaScript中的对象
JavaScript中的对象分为本地对象、内置对象、宿主对象

## 五、面向对象基础
<a href="#top" style="font-size: 30px; font-weight: 700; color: #ff0000;">返回顶部</a>
学好JavaScript的面向对象，能很大程度上提高代码的重用率
如何有效地创建对象，也可以看到常见的创建对象的方式
### 5.1 面向对象
1. 对象：对象是一个整体，对外提供一些操作
2. 面向对象：使用对象时，只关注对象提供的功能，不关注其内部细节。比如电脑——有鼠标、键盘，我们只需要知道怎么使用鼠标，敲打键盘即可，不必知道为何点击鼠标可以选中、敲打键盘是如何输入文字以及屏幕是如何显示文字的。
总之我们没必要知道其具体工作细节，只需知道如何使用其提供的功能即可，这就是面向对象。

3. JavaScript的对象组成：方法和属性
JavaScript中，有函数、方法、事件处理函数、构造函数，其实这四个都是函数，只是作用不同
函数是独立的存在，方法属于一个对象，事件处理函数用来处理一个事件，构造函数用来构造对象


4. JavaScript中的this以及全局对象window

```
// 定义一个全局函数
funtion show() {
    alert(this);
}

//调用show()
show(); // 弹出“window”,
```
show()函数为一个全局函数，调用show()，alert(this)弹出来的是window对象，说明全局函数属于window

上面定义的show()等于为window添加一个方法，**全局的函数和变量都是属于window**的，上面的定义等价于下面

```
// 为window定义一个show方法
window.show = function() {
    alert(this);
}
//调用show()
window.show(); 
```

我们也可以根据自己的需求为其它的对象添加方法，比如显示数组

但是我们不能在系统对象中随意附加方法和属性，否则可能会覆盖已有方法、属性

```
var arr = [1, 2, 3, 4, 5];
arr.show = function() {
    alert(this);
}
arr.show(); // 1, 2, 3, 4, 5
```

从上面的例子也可以看出来，this即表示当前函数的调用者是谁，但是在一种情况下不是的，就是使用new 来创建对象时，this并不是指向调用者的


window是全局对象，属于window的全局属性和全局方法



## 5.2 JavaScript中自定义对象，逐步分析JavaScript中的创建对象
### 5.2.1 通过Object创建简单对象

这种方式有一个非常大的弊端，就是如果我有多个人怎么办，每次都要新建一个对象，然后添加属性、方法，这种方式是一次性的，会产生大量重复代码，这是不可取的
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_01 通过Object创建简单对象.html"> 通过Object创建简单对象</a>
```
/**
* 创建一个新对象
* new Object()创建出来的对象几乎是空白的，需要自己添加属性，方法
*/
var person = new Object();
//为person对象添加属性
person.name = "leo";
person.age = 25;
//为person对象添加方法
person.showName = function(){
    alert("姓名："+this.name);
}
person.showAge = function(){
    alert("年龄："+this.age);
}
//调用对象的方法
person.showName();
person.showAge();
```

### 5.2.2 用工厂方式来构造对象

工厂，简单来说就是投入原料、加工、出厂。

通过构造函数来生成对象，将重复的代码提取到一个函数里面，避免像第一种方式写大量重复的代码。这样我们在需要这个对象的时候，就可以简单地创建出来了。
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_02 用工厂方式来构造对象.html">用工厂方式来构造对象</a>
```
//构造函数：工厂
function createPerson(name, age) {
    var person = new Object();
    //为person对象添加属性——————// 原料
    person.name = name;
    person.age = age;
    //为person对象添加方法——————// 加工
    person.showName = function(){
        alert("姓名："+this.name);
    }
    person.showAge = function(){
        alert("年龄："+this.age);
    }
    // 出厂
    return person;
}
//创建两个对象
var p1 = createPerson('leo', 25);
var p2 = createPerson('Bob', 20);


//调用对象的方法
p1.showName();
p1.showAge();
p2.showName();
p2.showAge();
```
这种方式有两个缺点：
1. 一般我们创建对象是通过new来创建，比如new Date()，这里使用的是方法创建.使用new来创建可以简化一些代码，也带来一些新的特性
2. 每个对象都有一套自己的方法，浪费资源

**每个对象都有一套自己的方法?**
创建function()的时候其本质是通过new Function()来创建的，会诞生一个新的函数对象，所以每个对象的方法是不一样的，这样就存在资源浪费的问题了
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_02 用工厂方式来构造对象2.html">用工厂方式来构造对象2</a>
```
//构造函数：工厂
function createPerson(name, age) {
    var person = new Object();
    //为person对象添加属性——————// 原料
    person.name = name;
    person.age = age;
    //为person对象添加方法——————// 加工
    person.showName = function(){
        alert("姓名："+this.name);
    }
    person.showAge = function(){
        alert("年龄："+this.age);
    }
    // person.showSex = function(){} 等价于 person.showSex = new Function('');——————即我们在创建这个函数的时候就是新建了一个对象
    person.showSex = new Function('alert("性别："+this.sex)');
    // 出厂
    return person;
}
//创建两个对象
var p1 = createPerson('leo', 25);
var p2 = createPerson('Bob', 20);


alert(p1.showName == p2.showName); //false
```

### 5.2.3 使用new 来创建JavaScript对象
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_03 使用new 来创建JavaScript对象.html">使用new 来创建JavaScript对象</a>
```
//使用new 来创建JavaScript对象
function Person(name, age) {
    /*  可以假想成系统会创建一个对象
    var this = new Object(); */
    alert(this); // Object

    this.name = name;
    this.age = age;

    this.showName = function(){
        alert("姓名："+this.name);
    }
    this.showAge = function(){
        alert("年龄："+this.age);
    }

    /* 假想返回了对象
    return this;  */
}
//创建两个对象————————在外面new了在function里面就不用new了；在function里面new了，在外面就不用new了
var p1 = new Person('leo', 25);
var p2 = new Person('Bob', 20);


alert(p1.showName == p2.showName); //false
```
1. 在方法调用前使用new来创建，function内的this会指向一个新创建的空白对象，而不是指向方法调用者，而且会自动返回该对象
2. 这种方式只解决了第一个问题，每个对象还是有自己的一套方法

### 5.2.4 在function原型(prototype)上进行扩展 —— 最终版

原型添加的方法不会有多个副本，不会浪费资源，所有的对象只有一套方法
为什么是用的一套方法?
因为所有的方法都等于原型上的方法。
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_04 在function原型(prototype)上进行扩展(最终版).html">在function原型(prototype)上进行扩展(最终版)</a>
```
// Person构造函数：在JavaScript中，构造函数其实就可以看成类，对某个对象的抽象定义
// 在function原型(prototype)上进行扩展
function Person(name, age) {
    // 属性：每个对象的属性各不相同
    this.name = name;
    this.age = age;
}
//在原型上添加方法，这样创建的所有对象都是用的同一套方法
Person.prototype.showName = function() {
    alert("姓名："+this.name);
}
Person.prototype.showAge = function() {
    alert("年龄："+this.age);
}

//创建两个对象
var p1 = new Person('leo', 25);
var p2 = new Person('Bob', 20);


alert(p1.showName === p2.showName); // true
alert(p1.showName == Person.prototype.showName); //true
```

通过prototype我们还可以很方便的扩展系统对象，按照自己的需求来扩展，而且又能适用于所有地方，又不会浪费资源。如下面对Array进行扩展，求数组和的方法。

### 5.2.5 通过prototype扩展系统对象
<a href="http://p03fjrkvd.bkt.clouddn.com/github/2017/112920/code11_05 通过prototype扩展系统对象.html">通过prototype扩展系统对象</a>
```
// 对数组原型扩展一个求和的方法
Array.prototype.sum = function () {
    var sum = 0;
    for(var i = 0; i < this.length; i++) {
        sum += this[i];
    }
    return sum;
}
//通过new Array() 和 [] 创建数组完全是一样的效果
var arr1 = new Array(1, 2, 3, 4);
var arr2 = [11, 12, 13, 14];

alert(arr1.sum()); // 10
alert(arr2.sum()); // 50

alert(arr1.sum === arr2.sum); // true
alert(arr2.sum === Array.prototype.sum); // true

```


<a href="http://www.cnblogs.com/chiangchou/p/js-oop1.html">JavaScript 面向对象(一) —— 基础篇</a>
<a href="http://www.cnblogs.com/chiangchou/p/js-oop2.html">JavaScript 面向对象(二) —— 案例篇</a>
<a href="http://www.cnblogs.com/chiangchou/p/js-oop3.html">JavaScript 面向对象(三) —— 高级篇</a>


























