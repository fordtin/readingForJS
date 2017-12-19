
window.onload = function() {
    new Caculator('container');
}

// Caculator.js
function Caculator(id) {
    this.oContainer = document.getElementById(id);
    this.oText1 = document.getElementById('text1');
    this.oText2 = document.getElementById('text2');
    this.arr = [];
    this.oper = [];
    this.operEqual = [];
    var _this = this;

    this.oContainer.onclick = function() {
        _this.clickBtn();
    };

    this.clearAll(); //两个输入框初始化为0

    //点击+、-、x、÷
     if(this.oText1.value == 0) {//不允许直接输入运算符
        return;
    }

    if(this.oText2.value.lastIndexOf('=') > -1) {//运算后的结果继续进行运算
        this.arr = [];
        this.oper = [];
        this.arr.push(this.oText1.value);
        this.oText1.value = this.arr.pop();
        this.oText2.value = this.oText1.value;
    } 

    if(this.oText1.value != '+' && this.oText1.value != '-' && this.oText1.value != 'x' && this.oText1.value != '÷') { //不能连续出现+、-、x、÷
            this.arr.push(this.oText1.value);
            this.oText1.value = spanType;
            this.oText2.value += spanType;
            this.oper.push(spanType);    
    } 
}
Caculator.prototype = {
    //点击面板按钮
    clickBtn: function(e) {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase() === 'span') {
            var spanType = target.innerText;    //获取span元素的内容
            switch(spanType) {
                case 'AC':
                    this.clearAll();
                    break;
                case 'CE':
                    this.clean();
                    break;
                case '=':
                    this.equal(spanType);
                    break;
                case '+'://这四项合并
                case '-':
                case 'x':
                case '÷':
                    this.clickOperator(spanType);
                    break;
                default: //小数点及0~9
                    this.clickNumber(spanType);
                    break;
            }
        }
    },
    // AC按钮——————清除所有
    clearAll: function() {
        this.oText1.value = this.oText2.value = 0;
        this.arr = [];
        this.oper = [];    
    },
    // 计算
    caculate: function() {
        var result = 0;
        // console.log('通道1：' + 1);
        for(var i = 0; i < this.oper.length; i++) {
            var s = this.oper[i];
            switch(s) {
                case '+':
                    result = parseFloat(this.arr[0]) + parseFloat(this.arr[1]);
                    if(this.arr.length > 2) {
                        this.arr.splice(0, 2, result);
                    }
                break;
                case '-':
                    result = parseFloat(this.arr[0]) - parseFloat(this.arr[1]);
                    if(this.arr.length > 2) {
                        this.arr.splice(0, 2, result);
                    }
                break;
                case 'x':
                    result = parseFloat(this.arr[0]) * parseFloat(this.arr[1]);
                    if(this.arr.length > 2) {
                        this.arr.splice(0, 2, result);   
                    }
                break;
                case '÷':
                    result = parseFloat(this.arr[0]) / parseFloat(this.arr[1]);
                    if(this.arr.length > 2) {
                        this.arr.splice(0, 2, result);
                    }
                break;
                default:
                break;
            }
        }

        result = this.oper.length ? result : this.arr[0];
        this.isFloat(result);
    },
    //CE按钮
    clean: function() {
        var len1 = this.oText1.value.length;
        var len2 = this.oText2.value.length;          
        if(this.oText2.value.lastIndexOf('=') > -1) {//input2存在“=”号，全部清除
            this.clearAll();
        }
        if( !isNaN(this.oText1.value) ) {//input1是数字
                if(!isNaN(this.oText2.value)) { //input2是数字
                    this.clearAll();
                }
                else {//input2不是数字
                    // console.log('this.oText2.value.substring(len2-len1-1, len2):  ' + this.oText2.value.substring(len2-len1, len2));
                    if(this.oText2.value.substring(len2 - len1, len2) != this.oText1.value) {//input2的最后一个不等于input1
                            if(this.oper.length >= 2) {
                                this.oText1.value = 0;
                                this.oText2.value = this.oText2.value.substring(0, 1);
                            }
                            else {
                                this.clearAll();
                            }
                    }
                    else {//input2的最后一个有等于input1的
                        this.oText1.value = 0;
                        this.oText2.value = this.oText2.value.substring(0, len2 - len1);
                        
                    }
                }
            
        }
        else {//input1不是数字的时候
            this.oText1.value = 0;
            this.oText2.value = this.oText2.value.substring(0, len2-1);
        }
    },
    //点击准备计算
    equal: function(spanType) {
        if(this.oText2.value.lastIndexOf('=') > -1 || this.oText2.value == 'Digit Limit Met') {//作用是消除这种情况：6+6 = 12,再次点击“=”的时候变成了6 + 6 = 12 = 24
            return;
        }
        if((this.oText1.value == this.oText2.value) && this.oText1.value == 0) {//input2中不允许出现0=0；
            return;
        }

        if(this.oText1.value == '÷') {//是除号且当前点击是是0的话，禁止输入
            return;
        }
        if(isNaN(this.oText1.value)) {//+、-、x、÷后面不能直接出现=
            return;
        }

        this.operEqual.push(spanType);
        this.arr.push(this.oText1.value);

        if(this.oText2.value.substring(this.oText2.value.length - 1, this.oText2.value.length) != '=') { //0的时候不允许连续输入“=”
            this.oText2.value += (this.oText1.value == this.oText2.value) ? (spanType + this.oText1.value) : spanType; //两个相等的时候点击“=”号,直接赋值（2 = 2）； 不相等的时候，直接在后面拼接“=”。
        }
        if(this.oper.length < 1) {//不允许出现l类似6=66这种情况
            return;
        }
        this.caculate();
    },
    //点击数字
    clickNumber: function(spanType) {
        if(this.oText2.value.lastIndexOf('=') > -1) {
            this.clearAll();
        }
        if(!isNaN(this.oText1.value)) {  //this.oText1.value是数字
            // 0.6 + 0.3、 2 + 0.5、 .6 + .3 、 2 + .5
            //当前点击是否是小数点、以及this.oText1中是否有小数点（小数点前是''，是0，是整数还是运算符）
            if(spanType == '.') {//点击了小数点
                if(this.oText1.value.lastIndexOf('.') > -1) {//不允许存在两个相邻的小数点
                    return;
                }
        
                this.oText1.value = (this.oText1.value != '') ? (this.oText1.value + spanType) : ('0' + spanType); //this.oText1不为空的话,在原来基础上拼接，否则在前面拼接0
                this.oText2.value = (this.oText2.value != 'Digit Limit Met') ? (this.oText2.value + spanType) : ('0' + spanType);//this.oText2是否为字符串'Digit Limit Met'
                // this.oText2.value += spanType;
            }
            else {//点击的不是小数点
                if(this.oText1.value.lastIndexOf('.') > -1) {//this.oText1中有小数点
                    this.oText1.value += spanType;
                    this.oText2.value += spanType;
                }
                else {//this.oText1中没有有小数点
                    if(this.oText2.value == 'Digit Limit Met') {//超出长度限制提示符时，先清空，再赋值。
                        this.clearAll();
                        this.oText1.value = this.oText2.value = spanType;
                    }
                    else {
                    this.oText1.value = (this.oText2.value == 0) ? spanType : (this.oText1.value + spanType);  //this.oText2中的值为0的话，点击的按钮的innerHTML替换掉0，否则在此基础上进行拼接
                    this.oText2.value = (this.oText2.value == 0) ? spanType : (this.oText2.value + spanType);
                    }
                }
            } 
             
        }
        else {  //this.oText1.value不是数字
            if(this.oText1.value == '÷' && spanType == 0) {//是除号且当前点击是是0的话，禁止输入
                return;
            }
            this.oText1.value = (spanType == '.') ? ('0' + spanType) : spanType; //在0~9和.号当中，当前点击的是否“.”号的时候
            this.oText2.value += this.oText1.value;
        } 

        if(this.oText1.value.length >= 12 || this.oText2.value.length >= 22) {
            this.oText1.value = 0;
            this.oText2.value = 'Digit Limit Met';
            return;
        }
    },
    //确认是否需要小数点及小数点位数函数
    isFloat: function(str) {
        var strlen = String(str).length;
        var index = String(str).lastIndexOf('.');
        if(index > -1) {
            str = ((strlen - index - 1) >= 2) ? parseFloat(str).toFixed(2) : parseFloat(str);
            this.oText1.value = str;
            this.oText2.value += str;
        }
        else {
            this.oText1.value = str;
            this.oText2.value += str;
        }
    },
    //点击+、-、x、÷
    clickOperator: function(spanType) {
        if(this.oText1.value == 0) {//不允许直接输入运算符
            return;
        }

        if(this.oText2.value.lastIndexOf('=') > -1) {//运算后的结果继续进行运算
            this.arr = [];
            this.oper = [];
            this.arr.push(this.oText1.value);
            this.oText1.value = this.arr.pop();
            this.oText2.value = this.oText1.value;
        } 

        if(this.oText1.value != '+' && this.oText1.value != '-' && this.oText1.value != 'x' && this.oText1.value != '÷') { //不能连续出现+
                this.arr.push(this.oText1.value);
                this.oText1.value = spanType;
                this.oText2.value += spanType;
                this.oper.push(spanType);    
        }  
    }   
}




