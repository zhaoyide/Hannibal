(function($) {
    $("#submit").click(function(){
      $.ajax({
        type:"POST",
        url: "http://localhost:3000/hannibal/user/login",
        dataType: "text",
        data: JSON.stringify({
          user_name: $("#user_name").val(),
          user_pass: $("#user_pass").val()
        }),
        contentType:"application/json",
        success: function(data,textStatus, xhr){
          if(xhr.status == 200)
            location.href = "http://localhost:3000/hannibal/"
          else if(xhr.status == 201)
            $('.message').replaceWith("wrong password or account");
          else if(xhr.status == 202)
            $('.message').replaceWith("account does not exist");
          else
            $('.message').replaceWith("Server busy");
        },        
      });
    });        
})(jQuery);