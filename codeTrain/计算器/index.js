window.onload = function() {
    var getDom = function(id) {
        return document.getElementById(id);
    }

    var oContainer = getDom('container'),
        oText1 = getDom('text1'),
        oText2 = getDom('text2'),
        arr = [],
        oper = [],
        operEqual = [];

    oContainer.onclick = function(e) {
        var target = e.target;
        if(target.nodeName.toLowerCase() === 'span') {
            var spanType = target.innerText;    //获取span元素的内容
            switch(spanType) {
                case 'AC':
                    clearAll();
                    break;
                case 'CE':
                    clean();
                    break;
                case '=':
                    equal(spanType);
                    break;
                case '+'://这四项合并
                case '-':
                case 'x':
                case '÷':
                    clickOperator(spanType);
                    break;
                default: //小数点及0~9
                    clickNumber(spanType);
                    break;
            }
        }
    }

    //AC按钮
    clearAll(); //两个输入框初始化为0
    function clearAll() {
        oText1.value = oText2.value = 0;
        arr = [];
        oper = [];    
    }

    //CE按钮
    function clean() {
        var len1 = oText1.value.length;
        var len2 = oText2.value.length;          
        if(oText2.value.lastIndexOf('=') > -1) {//input2存在“=”号，全部清除
            clearAll();
        }
        if( !isNaN(oText1.value) ) {//input1是数字
                if(!isNaN(oText2.value)) { //input2是数字
                    clearAll();
                }
                else {//input2不是数字
                    // console.log('oText2.value.substring(len2-len1-1, len2):  ' + oText2.value.substring(len2-len1, len2));
                    if(oText2.value.substring(len2 - len1, len2) != oText1.value) {//input2的最后一个不等于input1
                            if(oper.length >= 2) {
                                oText1.value = 0;
                                oText2.value = oText2.value.substring(0, 1);
                            }
                            else {
                                clearAll();
                            }
                    }
                    else {//input2的最后一个有等于input1的
                        oText1.value = 0;
                        oText2.value = oText2.value.substring(0, len2 - len1);
                        
                    }
                }
            
        }
        else {//input1不是数字的时候
            oText1.value = 0;
            oText2.value = oText2.value.substring(0, len2-1);
        }
    }

    //点击计算
    function equal(spanType) {
        if(oText2.value.lastIndexOf('=') > -1 || oText2.value == 'Digit Limit Met') {//作用是消除这种情况：6+6 = 12,再次点击“=”的时候变成了6 + 6 = 12 = 24
            return;
        }
        operEqual.push(spanType);
        arr.push(oText1.value);
        
        if(oText2.value.substring(oText2.value.length, oText2.value.length) != '=') { //0的时候不允许连续输入“=”
            oText2.value += (oText1.value == oText2.value) ? (spanType + oText1.value) : spanType; //两个相等的时候点击“=”号,直接赋值（2 = 2）； 不相等的时候，直接在后面拼接“=”。
        }
            markOper(); 
    }

    //点击数字
    function clickNumber(spanType) {
        if(oText2.value.lastIndexOf('=') > -1) {
            clearAll();
        }
        if(!isNaN(oText1.value)) {  //oText1.value是数字
            // 0.6 + 0.3、 2 + 0.5、 .6 + .3 、 2 + .5
            //当前点击是否是小数点、以及oText1中是否有小数点（小数点前是''，是0，是整数还是运算符）
            if(spanType == '.') {//点击了小数点
                if(oText1.value.lastIndexOf('.') > -1) {//不允许存在两个相邻的小数点
                    return;
                }
        
                oText1.value = (oText1.value != '') ? (oText1.value + spanType) : ('0' + spanType); //oText1不为空的话,在原来基础上拼接，否则在前面拼接0
                oText2.value = (oText2.value != 'Digit Limit Met') ? (oText2.value + spanType) : ('0' + spanType);//oText2是否为字符串'Digit Limit Met'
                // oText2.value += spanType;
            }
            else {//点击的不是小数点
                if(oText1.value.lastIndexOf('.') > -1) {//oText1中有小数点
                    oText1.value += spanType;
                    oText2.value += spanType;
                }
                else {//oText1中没有有小数点
                    if(oText2.value == 'Digit Limit Met') {//超出长度限制提示符时，先清空，再赋值。
                        clearAll();
                        oText1.value = oText2.value = spanType;
                    }
                    else {
                    oText1.value = (oText2.value == 0) ? spanType : (oText1.value + spanType);  //oText2中的值为0的话，点击的按钮的innerHTML替换掉0，否则在此基础上进行拼接
                    oText2.value = (oText2.value == 0) ? spanType : (oText2.value + spanType);
                    }
                }
            } 
             
        }
        else {  //oText1.value不是数字
            if(oText1.value == '÷' && spanType == 0) {//是除号且当前点击是是0的话，禁止输入
                return;
            }
            oText1.value = (spanType == '.') ? ('0' + spanType) : spanType; //在0~9和.号当中，当前点击的是否“.”号的时候
            oText2.value += oText1.value;
        } 

        if(oText1.value.length >= 12 || oText2.value.length >= 22) {
            oText1.value = 0;
            oText2.value = 'Digit Limit Met';
            return;
        }
    }

    //判断是哪种运算
    function markOper() {
        switch(oper[0]) {
            case '+':
                add();
                break;
            case '-':
                sub();
                break; 
            case 'x':
                mul();
                break;          
            case '÷':
                divide();
                break;
            default:
                break;             
        }       
    }
    
    //点击+、-、x、÷
    function clickOperator(spanType) {
        if(oText1.value == 0) {//不允许直接输入运算符
            return;
        }

        if(oText2.value.lastIndexOf('=') > -1) {//运算后的结果继续进行运算
            arr = [];
            oper = [];
            arr.push(oText1.value);
            oText1.value = arr.pop();
            oText2.value = oText1.value;
        } 


        if(oText1.value != '+' && oText1.value != '-' && oText1.value != 'x' && oText1.value != '÷') { //不能连续出现+
                arr.push(oText1.value);
                oText1.value = spanType;
                oText2.value += spanType;
                oper.push(spanType);    
        }        
    }

    //加法运算
    function add() {
        var str = 0;
        for(var i = 0; i < arr.length; i++) {
            str += parseFloat(arr[i]);
        }
        isFloat(str);
    }
    //减法运算
    function sub() {
        var str = parseFloat(arr[0]);
        for(var i = 1; i < arr.length; i++) {
            str -= parseFloat(arr[i]);
        }
        isFloat(str);
    }
     //乘法运算
    function mul() {
        var str = 1;
        for(var i = 0; i < arr.length; i++) {
            str *= parseFloat(arr[i]);
        }
        isFloat(str);
    }
     //除法运算
    function divide() {
        var str = parseFloat(arr[0]);
        for(var i = 1; i < arr.length; i++) {
            str /= parseFloat(arr[i]);
        }
        isFloat(str);
    }

    //确认是否需要小数点及小数点位数函数
    function isFloat(str) {
        var strlen = String(str).length;
        var index = String(str).lastIndexOf('.');
        if(index > -1) {
            str = ((strlen - index - 1) >= 2) ? parseFloat(str).toFixed(2) : parseFloat(str);
            oText1.value = str;
            oText2.value += str;
        }
        else {
            oText1.value = str;
            oText2.value += str;
        }
    }
}



















// window.onload = function() {
//     var getDom = function(id) {
//         return document.getElementById(id);
//     }
//     var getByClass = function(oParent, sClass) {
//         var arr = [];
//         var aEl = oParent.getElementsByTagName('*');
//         var reg = new RegExp('\\b' + sClass + '\\b', 'i');

//         for(var i = 0; i < aEl.length; i++) {
//             // if(aEl[i].className == sClass) {
//             if(reg.test(aEl[i].className)) {
//                 arr.push(aEl[i]);
//             }
//         }
//         return arr;
//     };

//     var oContainer = getDom('container');
//     var oText1 = getDom('text1');
//     var oText2 = getDom('text2');
//     var oper = [];
//     var operEqual = [];
//     var arr = [];



//     //AC按钮
//     clearAll();
//     var oAC = getByClass(oContainer, 'ac')[0];
//     oAC.onclick = clearAll;
//     function clearAll() {
//         oText1.value = oText2.value = 0;
//         arr = [];
//         oper = [];    
//     }

//     //CE按钮
//     clean();
//     function clean() {
//         var oCE = getByClass(oContainer, 'ce')[0];
//             oCE.onclick = function() {
//                 var len1 = oText1.value.length;
//                 var len2 = oText2.value.length;          
//                 if(oText2.value.lastIndexOf('=') > -1) {//input2存在“=”号，全部清除
//                     clearAll();
//                 }
//                 if( !isNaN(oText1.value) ) {//input1是数字
//                         if(!isNaN(oText2.value)) { //input2是数字
//                             clearAll();
//                         }
//                         else {//input2不是数字
//                             console.log('oText2.value.substring(len2-len1-1, len2):  ' + oText2.value.substring(len2-len1, len2));
//                             if(oText2.value.substring(len2 - len1, len2) != oText1.value) {//input2的最后一个不等于input1
//                                     if(oper.length >= 2) {
//                                         oText1.value = 0;
//                                         oText2.value = oText2.value.substring(0, 1);
//                                     }
//                                     else {
//                                         clearAll();
//                                         // console.log('aaaa:  ' + 1)
//                                     }
//                             }
//                             else {//input2的最后一个有等于input1的
//                                 oText1.value = 0;
//                                 oText2.value = oText2.value.substring(0, len2 - len1);
                                
//                             }
//                         }
                    
//                 }
//                 else {//input1不是数字的时候
//                     oText1.value = 0;
//                     oText2.value = oText2.value.substring(0, len2-1);
//                 }


//             }
//     }

//     //点击数字
//     clickNumber();
//     function clickNumber() {
//         var aSpan = getByClass(oContainer, 'number');
//         for(var i = 0; i < aSpan.length; i++) {
//             // aSpan[i].index = i; 
//             aSpan[i].onclick = function() {
//                 if(oText2.value.lastIndexOf('=') > -1) {
//                     clearAll();
//                     // oper = [];
//                     // arr = [];
//                 }

//                 if(!isNaN(oText1.value)) {
//                     // if(Number(oText1.value) == 0) {
//                     if(typeof Number(oText1.value) == 'number') {
//                         if(oText2.value == 0) { //输入0~9
//                             oText1.value = oText2.value = this.innerHTML;
//                         }
//                         else {//多位数
//                             oText1.value += this.innerHTML;
//                             oText2.value += this.innerHTML
//                         }

                       
//                         // alert('oText1.value:  ' + oText1.value + '   ' + 'clickNumber 2:  ' + arr);
//                     }
//                     else {
//                         oText1.value += this.innerHTML;
//                         oText2.value += this.innerHTML;
//                     }
//                 }
//                 else {
//                     console.log('Number区 arr:   ' + arr);
//                     oText1.value = this.innerHTML;
//                     oText2.value += oText1.value;
//                     // alert(arr);
//                     // alert('oText1.value:  ' + oText1.value + '   ' + 'clickNumber 2:  ' + arr);
//                 } 
//             }
//         }
//     }

//     //点击计算
//     equal();
//     function equal() {
//         var oEqual = getByClass(oContainer,'equal')[0];
//         oEqual.onclick = function() {
//             operEqual.push(this.innerHTML);
//             arr.push(oText1.value);
            
//             if(oText2.value.substring(oText2.value.length, oText2.value.length) != '=') { //0的时候不允许连续输入“=”
//                 if(oText1.value == oText2.value) {//两个相等的时候点击“=”,直接赋值
//                     oText2.value += this.innerHTML + oText1.value;
//                 }
//                 else {//不相等的时候，直接拼接
//                     oText2.value += this.innerHTML;
//                 }
//             }


//             // if(oText1.value != 0) {
//             //     console.log(oText1.value == oText2.value);
//             //     // oText1.value = oText1.value;
//             //     // oText2.value = this.innerHTML + oText1.value;
//             // }


//             markOper();
//             // switch(oper);
//             // alert('arr=' + arr + '    oText1.value:' + oText1.value + '   oText2.value:' + oText2.value);
//             // alert(oper[0])
//             // add();
//             // sub();
//             // mul();
//             // divide();
//             // console.log(markOper(oper));
//         }    
//     }

//     //判断是哪种运算
//     function markOper() {
//         switch(oper[0]) {
//             case '+':
//             // alert(1);
//                 add();
//                 break;
//             case '-':
//                 sub();
//                 break; 
//             case 'x':
//                 mul();
//                 break;          
//             case '÷':
//                 divide();
//                 break;
//             default:
//                 break;             
//         }       
//     }

//     function clickOperator(_this) {
//         if(oText1.value == 0) {//不允许直接输入运算符
//             return;
//         }

//         if(oText2.value.lastIndexOf('=') > -1) {//运算后的结果继续进行运算
//             arr = [];
//             oper = [];
//             arr.push(oText1.value);
//             // operEqual.push(oText1.value);
//             oText1.value = arr.pop();
//             oText2.value = oText1.value;
//         } 


//         if(oText1.value != '+' && oText1.value != '-' && oText1.value != 'x' && oText1.value != '÷') { //不能连续出现+
//         // if(oText1.value != '+') { //不能连续出现+
//             arr.push(oText1.value);
//             oText1.value = _this.innerHTML;
//             oText2.value += _this.innerHTML;
//             oper.push(_this.innerHTML);    
//             console.log('Click点击区22222  ' + 'oText1.value  ' + oText1.value + 'arr:    ' + arr + '  oper:   ' + oper + '_this: '  + _this.innerHTML)
//         }        
//     }


//     var oAdd = getByClass(oContainer,'add')[0];
//     oAdd.onclick = function() {
//         var _this = this;

//             /*if(oText2.value.lastIndexOf('=') > -1) {
//             arr = [];
//             operEqual = [];
//             // console.log('测试：' + oText1.value)
//             arr.push(oText1.value);
//             // console.log('测试1111：' + arr)
//             oText1.value = arr.pop();
//             // console.log('测试2222：' + arr)
//             oText2.value = oText1.value;
//         } */
//         clickOperator(_this);
//         // if(oText1.value != '+') { //不能连续出现+
//             // console.log('Click点击区00000  ' + 'oText1.value  ' + oText1.value + 'arr:    ' + arr)
//             // arr.push(oText1.value);
//             // console.log('Click点击区11111  ' + 'oText1.value  ' + oText1.value + 'arr:    ' + arr)
//             // oText1.value = this.innerHTML;
//             // oText2.value += this.innerHTML;
//             // oper.push(this.innerHTML);    
//             // console.log('Click点击区22222  ' + 'oText1.value  ' + oText1.value + 'arr:    ' + arr + '  oper:   ' + oper + 'this: '  + this.innerHTML)
//         // }
//     }
//     var oSub = getByClass(oContainer,'sub')[0];
//     oSub.onclick = function() {
//         var _this = this;
//         clickOperator(_this);
//     }
//     var oMult = getByClass(oContainer,'multiply')[0];
//     oMult.onclick = function() {
//         var _this = this;
//         clickOperator(_this);
//     }
//     var oDivide = getByClass(oContainer,'divide')[0];
//     oDivide.onclick = function() {
//         var _this = this;
//         clickOperator(_this);
//     }


//     //加法运算
//     function add() {
//         var str = 0;
//         for(var i = 0; i < arr.length; i++) {
//             str += parseFloat(arr[i]);
//         }
//         oText1.value = str;
//         oText2.value += str;
//     }
//     //减法运算
//     function sub() {
//         var str = parseFloat(arr[0]);
//         for(var i = 1; i < arr.length; i++) {
//             str -= parseFloat(arr[i]);
//         }
//         oText1.value = str;
//         oText2.value += str;
//     }
//      //乘法运算
//     function mul() {
//         var str = 1;
//         for(var i = 0; i < arr.length; i++) {
//             str *= parseFloat(arr[i]);
//         }
//         oText1.value = str;
//         oText2.value += str;
//     }
//      //除法运算
//     function divide() {
//         var str = parseFloat(arr[0]);
//         for(var i = 1; i < arr.length; i++) {
//             str /= parseFloat(arr[i]);
//         }
//         oText1.value = str;
//         oText2.value += str;
//     }



// }