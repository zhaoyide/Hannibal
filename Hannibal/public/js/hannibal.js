(function($) {
        var currentLink = "http://localhost:3000/hannibal/user/email/";
        const email ="";
        var requestConfig = {
          method: "GET",
          url: "http://localhost:3000/hannibal/user/email/"+$("#user_id").val(),
        };
        $.ajax(requestConfig).then(function(result) {
          $("#contact_email").val(result);
        });
    
    	var requestConfig1 = {
          method: "GET",
          url: "http://localhost:3000/hannibal/categories",
        };
        $.ajax(requestConfig1).then(function(result) {
           $.each(result, function(index) {
     		$('#category_id')
         	.append($("<option></option>")
                    .attr("value",result[index]._id)
                    .text(result[index].name)); 
			});
        });
  })(jQuery);
