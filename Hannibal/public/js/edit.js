(function($) {
      var cl = 0;
    	var requestConfig1 = {
          method: "GET",
          url: "http://localhost:3000/hannibal/categories",
        };
        $.ajax(requestConfig1).then(function(result) {
           $.each(result, function(index) {
            if(result[index]._id==$('#selected').val()){
             $('#selected').text(result[index].name); 
            }
              else{
         		$('#category_id')
             	.append($("<option></option>")
                        .attr("value",result[index]._id)
                        .text(result[index].name)); 
             }
			     });
        });

      $("#name").change(function(){
        cl++;
      });
      $("#price").change(function(){
        cl++;
      });
      $("#description").change(function(){
        cl++;
      });
      $("#contact_email").change(function(){
        cl++;
      });
      $("#category_id").change(function(){
        cl++;
      });
      $("#pics").change(function(){
        cl++;
      });

      $("#submit").click(function(){ 
        if(cl == 0){
            alert("Looks you didn't change anything...");
            return false;
        }

        var email = $("#contact_email").val();
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        isok= reg.test(email );
        if (!isok) {
         alert("Please type correct email address");
         return false;
        }

        $.ajax({
          type:"put",
          url: "http://localhost:3000/hannibal/product/"+$("#product_id").val(),
          dataType: "text",
          data: JSON.stringify({
            name: filterXSS($("#name").val()),
            price: filterXSS($("#price").val()),
            description: filterXSS($("#description").val()),
            contact_email: filterXSS($("#contact_email").val()),
            user_id: filterXSS($("#user_id").val()),
            category_id: filterXSS($("#category_id option:selected").val()),
            pics:$("#pic_b").val()
          }),
          contentType:"application/json",
          success: function(data,textStatus, xhr){
            if(!data.error){
              alert("Edit successfully!");
              location.reload(true);
            // alert(xhr);
            // if(xhr.status == 200){
            //   alert("success");
            //   location.reload(true);
            }
            else
              alert("Server is busy! Try again later...")
          },
        });
      });  

  })(jQuery);
