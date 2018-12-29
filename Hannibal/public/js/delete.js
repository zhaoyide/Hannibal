(function($) {
    $("#delete").click(function(){
      $.ajax({
        type:"DELETE",
        url: "http://localhost:3000/hannibal/product/"+$("#product_id").val()+"."+$("#user_id").val(),
        dataType: "text",
        success: function(data,textStatus, xhr){
        	if(data.error){
            alert("Server is bust, try again later!");
          }
          if(xhr.status == 200){
            alert("Delete successfully!");
        	  window.location.assign("http://localhost:3000/hannibal/postItems/"+$("#user_id").val());
          }
          else
            alert("Server is bust, try again later!");
        },
      });
    });        
})(jQuery);