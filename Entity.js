//申明扩展类
var ExtendClass = function () { };

//属性访问器
ExtendClass.prototype.accessor = function () {
    this.get = function () {
        return this.val;
    }
    this.set = function (val) {
        if (arguments.length == 2) {
            if (arguments[1] instanceof Function) {
                arguments[1](val);
            }
            val = arguments[0];
        }
        this.val = val;
    }
}
//值正确性校验
ExtendClass.prototype.isCorrectValue = function (val) {
    var flag = true;
    if (val instanceof Object && val instanceof Function && val == undefined && isNaN(isFinite)) {
        flag = false;
    }
    return flag;
}
//动态实体生成
ExtendClass.prototype.entityAccessor = function (entityList) {
    var entity = entityList;
    if (entity instanceof Object) {
        for (var i in entity) {
            var access = new extend.accessor();
            this.constructor.prototype[i] = access;
            var et = entity[i];
            var val = et["value"];
            if (extend.isCorrectValue(val)) {
                //判断是否存在附加函数
                if (et["setVerify"]) {
                    this.constructor.prototype[i].set.call(this.constructor.prototype[i], val, et["setVerify"])
                } else {
                    this.constructor.prototype[i].set(val);
                }
            }
        }
    }
}
//实体转换JSON输出
ExtendClass.prototype.getEntityList = function (entityObj) {
    var entList = entityObj;
    var tempArray = [];
    if (entList instanceof this.entityAccessor) {
        for (var en in entList) {
            tempArray.push(JSON.parse('[{ "' + en + '": "' + entList[en].get() + '" }]')[0]);
        }
    }
    return tempArray;
}


var setVer = function (val) {
    if (parseInt(val) < 0) {
        throw Error(this.lineNumber + "not age number!");
    }
}
var entityList = {
    "name": { value: "topaz.tang" },
    "age": { value: 25, get: true, setVerify: setVer },
    "sex": { value: "Men", get: true },
    "birthday": { value: "1988-11-10" }
}


var extend = new ExtendClass();

var entityFn = new extend.entityAccessor(entityList);   //实例化实体生成器  参数1：实体JSON列表
console.log(entityFn.age.get()) //输出  set函数设置的值.
var allEntity = extend.getEntityList(entityFn);   //输出 [{key:value},{key:value},{key:value}...n]
console.log(JSON.stringify(allEntity));