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