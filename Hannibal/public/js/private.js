(function($) {
        var cn = 0;
        var currentLink = "http://localhost:3000/hannibal/user/email/";
        const email ="";
        var requestConfig = {
          method: "GET",
          url: "http://localhost:3000/hannibal/user/email/"+$("#user_id").val(),
        };
        $.ajax(requestConfig).then(function(result) {
          $("#contact_email").val(result);
        });

    $("#user_pass").change(function(){
        cn++;

    });

    $("#contact_email").change(function(){
        cn++;
        
    });

    $("#private").click(function(){
        if(cn == 0){
            alert("Looks you didn't change anything!");
            return false;
        }
        
        let url = window.location.href;
        var email = $("#contact_email").val();
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        isok= reg.test(email );
        if (!isok) {
         alert("Please type correct email address");
         return false;
        }


        $.ajax({
            url : url,
            type : 'POST',
            dataType : 'json',
            data: {
                user_name : $('#user_name').val(),
                user_pass : $('#user_pass').val(),
                contact_email : $('#contact_email').val()
                },
            success:function(data){
                if(data.status){
                    alert("sucess");
                    window.location.assign("http://localhost:3000/hannibal");
                    //$("#redirect")[0].click();
                }
                window.location.assign("http://localhost:3000/hannibal");
                
            },
            error:function(){
            }
        });
    });
})(jQuery);