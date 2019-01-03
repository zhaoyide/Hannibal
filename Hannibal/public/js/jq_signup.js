(function($) {
    $("form").on("submit",function(event) {
      if($("#user_name").val().length > 0 && $("#user_pass").val().length > 0)
      {
      if(event.preventDefault) event.preventDefault();
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
          {
            $('.message').replaceWith("wrong password or account");
            $('.message').css("color","red");
          }
          else if(xhr.status == 202)
          {
            $('.message').replaceWith("account does not exist");
            $('.message').css("color","red");
          }
          else
          {
            $('.message').replaceWith("Server busy");
            $('.message').css("color","red");
          }
        }        
      });
    }
    });
})(jQuery);