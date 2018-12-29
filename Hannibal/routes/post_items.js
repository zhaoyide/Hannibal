const express = require("express");
const router = express.Router();

const data = require("../data");
const post_itemsData = data.postItems;
const userData = data.users;

router.get("/:id", async (req, res) => {
  if(req.session.user && req.session.user.user_id == req.params.id){
    //check id is legal
    try{
        var useri = await userData.getUserById2(req.params.id);
    }
    catch(e){
        res.redirect("http://localhost:3000/hannibal");
        return;
    }
    try{
      const product = await post_itemsData.getPostById(req.params.id);
      let result = [];
      for(let i = 0; i < product.names.length; i++){
      	result[i] = {"name":product.names[i], "product_id":product.product_ids[i]};
      }
      //console.log(result);
      res.render('products/allProducts',{"products": result});
    } 
    catch (e) {
    	//check whether the user_id exist?
    	result = [];
    	result.name = "";
    	result.product_id="";
      res.render('products/allProducts',{"products": result});
    }
  }
  else
  	res.redirect("http://localhost:3000/hannibal");
});

router.get("/*", async(req, res) => {
  res.redirect("http://localhost:3000/hannibal/");
});

module.exports = router;


