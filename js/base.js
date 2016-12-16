/* 
* @Author: Marte
* @Date:   2016-12-16 09:47:26
* @Last Modified by:   Marte
* @Last Modified time: 2016-12-16 16:12:54
*/

$(document).ready(function(){
    //点击文字阅读全文
    var closeSpeed = 800 ;
    $(document).on("click","article .title a,article .close-article,article .textfoot a" ,function(){
        var a = $(this).closest('article') ;
        var url = a.attr("data-more") ;
        if(!a.attr("data-loaded")){
            a.attr("data-loaded",1) ;
            a.find(".text-container").load("./"+url+" .text",function(){
                a.find(".text p:gt(0)").fadeIn(closeSpeed);
            });
        }
        a.toggleClass('open') ;
        
        if(a.hasClass('open')){
            a.find(".text p:gt(0)").fadeIn(closeSpeed);
        }else{
            a.find(".text p:gt(0)").fadeOut(closeSpeed);
        }
    }) ;

    $.getJSON("./page/article-config.json",function(data){
       $(".blogitem").html(_.template(TPL["../src/tpl/article.html"])(data)) ;
    }) ;
});
//HEAD 
window["TPL"] = {};

window["TPL"]["../src/tpl/article.html"] = "<%$.each(articles,function(i,r){%>\n" +
    "<article data-more=\"<%=r.filename%>\">\n" +
    "    <h2 class=\"title\">\n" +
    "      <a href=\"javascript:void(0)\"><%=r.title%></a>\n" +
    "      <span class=\"close-article\">-></span>\n" +
    "    </h2>\n" +
    "    <div class=\"text-container\">\n" +
    "      <ul class=\"text\">\n" +
    "        <p><%=r.content%></p>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <div class=\"textfoot\">\n" +
    "      <a href=\"javascript:void(0)\">阅读全文</a><a href=\"/\">转载</a>\n" +
    "    </div>\n" +
    "</article> \n" +
    "<%})%>"; 
// END 
/* 
* @Author: Marte
* @Date:   2016-11-22 10:52:31
* @Last Modified by:   Marte
* @Last Modified time: 2016-11-22 10:52:43
*/

!(function() {
  var root = this;
  var breaker = {};
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  root._ = _;

  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };
}).call(window);