const productRoutes = require("./products");
const post_itemsRoutes = require("./post_items");
const userRoutes = require("./users");
const homeRoutes = require("./home");
const CategoryRoutes = require("./categories");

const constructorMethod = app => {

  app.use("/hannibal/product", productRoutes);
  app.use("/hannibal/user", userRoutes);
  app.use("/hannibal/postItems",post_itemsRoutes);

  app.use("/hannibal/categories",CategoryRoutes);

  //this is upload a product
  app.use("/hannibal/upload", (req, res) =>{
    if(req.session.user){
  		res.render("products/uploadProduct",{
  			partial:"showEmail",
  			"user_id":req.session.user.user_id
  		});
  	}
  	else{
  		res.redirect("http://localhost:3000/hannibal");
  	}
  });

  //sign up
  app.use("/hannibal/signup", (req, res) =>{
  	res.render("users/signup"
  	);
  });

  app.use("/hannibal/login", (req, res) =>{
  	res.render("users/login", {partial:"ajax_signup"}
  	);
  });

  app.get('/hannibal/logout', (req, res) => {
     delete req.session.user;
     res.redirect("http://localhost:3000/hannibal");
  });


  app.use("/hannibal", homeRoutes);
  
  app.use("/hannibal", (req, res) =>{
  	res.render("index", {partial:"scroll_btn"});
  });



  app.use("*", (req, res) => {
    res.redirect("http://localhost:3000/hannibal");
  });


};

module.exports = constructorMethod;




