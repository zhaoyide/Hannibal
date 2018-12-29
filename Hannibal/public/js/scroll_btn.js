(function($) { 
    $(".ProdNames").filter(function(){
      var WordLen = $(this).text().length;
      if(WordLen > 28){
        $(this).text( $(this).text().substring(0,28)+"...");
      }

    });
    $(".button-right").filter(function(){
      var width = $(this).parent().find(".categoryProducts").width();
      var scrollwidth = $(this).parent().find(".categoryProducts").get(0).scrollWidth;
      return width >= scrollwidth;
    }).css("visibility","hidden");
    
    $(".button-left").click(function(){
        var n = $(this).parent().find(".categoryProducts").scrollLeft();
        if(n<=200){
          
        $(this).parent().find(".categoryProducts").animate({scrollLeft: 0},500);
        $(this).parent().find(".button-left").css({"visibility" : "hidden"});        
        }
        else{
        $(this).parent().find(".categoryProducts").animate({scrollLeft: n-270},500);
        }
        $(this).parent().find(".button-right").css({"visibility" : "visible"});
    });
    $(".button-right").click(function(){
        var n = $(this).parent().find(".categoryProducts").scrollLeft();
        var width = $(this).parent().find(".categoryProducts").width();
        var scrollwidth = $(this).parent().find(".categoryProducts").get(0).scrollWidth;
        if(n >= scrollwidth-width-200){
        $(this).parent().find(".categoryProducts").animate({scrollLeft: scrollwidth-width},500);
        $(this).parent().find(".button-right").css({"visibility" : "hidden"});
        }
        else{      
        $(this).parent().find(".categoryProducts").animate({scrollLeft: n+270},500);
        }
        $(this).parent().find(".button-left").css({"visibility" : "visible"});
    });           
})(jQuery);
