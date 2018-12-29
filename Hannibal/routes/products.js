const express = require("express");
const fs = require("fs");
const base64Img = require('base64-img-promise');
const router = express.Router();


const data = require("../data");
const productData = data.products;
const post_itemsData = data.postItems;
const category_productsData = data.categoryProducts;
const categoriesData = data.categories;



router.get("/postItems/:id", async (req, res) => {
	if(req.session.user){
	    try {
		  	const product = await productData.getProductById(req.params.id);
		  	//check whether this user has authentication to edit this product
		  	let post_items = await post_itemsData.getPostById(req.session.user.user_id);
		  	let lists = post_items.product_ids;
		  	for(let i = 0; i < lists.length; i++){
		  		if(lists[i] == req.params.id)
		  			break;
		  		if(i == lists.length - 1){
		  			res.redirect("http://localhost:3000/hannibal/");
	  				return;
		  		}
			}
		    var category = await categoriesData.getCategoryById(product.category_id);
		    let result ={};
		    result.product_id = product._id;
		    result.name = product.name;
		    result.price = product.price;
		    result.description = product.description;
		    result.pics = product.pics;
		    result.contact_email = product.contact_email;
		    result.category_id = category.name;
		    
		    res.render('products/productinfo',{"product": result, partial:"delete", "user_id":req.session.user.user_id});
		}catch (e) {
	    	res.render('products/productinfo2',{"hasErrors":true, "error": "Server is busy, this product is not found..." });
	  	}
	}
	else{
		res.redirect("http://localhost:3000/hannibal");
	}
});

router.put("/:id", async(req, res) => {
	const mutilParts = req.body;
	try{
		var oldProduct = await productData.getProductById(req.params.id);
	}
	catch(e){
		res.status(404).json({ error: "This product doesn't exist"});
	}
	try{
		if(typeof mutilParts.name != "string") throw "No product's name provided";
		//if(typeof mutilParts.price != "number") throw "No product's price provided";
		if(typeof mutilParts.description != "string") throw "No product's description provided";
		//if (!Array.isArray(mutilParts.pics)) throw "No product's pictures provided";
		if(typeof mutilParts.contact_email != "string") throw "No product's contact_email provided";
		
		if(mutilParts.pics != ""){
			try{
				var now = new Date();
				var tempname = "";
				tempname = now.getHours()+"_"+now.getMinutes()+"_"+now.getSeconds()+"_"+Math.floor(Math.random() * Math.floor(100));
				//console.log(tempname);
				await base64Img.img(mutilParts.pics, 'pics', tempname, async(err, filepath) => {
					return filepath;
				});
				let extension = mutilParts.pics.split(';')[0].split('/')[1];
				if(extension == "jpeg")
					extension = "jpg";
				var picname = "http://localhost:3000/hannibal/pics/"+tempname+"."+extension;
			}
			catch(e){
				var picname = oldProduct.pics;
			}
		}
		else{
			var picname = oldProduct.pics;
		}

		var newProduct = {};
		newProduct.name = mutilParts.name;
		newProduct.price = mutilParts.price;
		newProduct.description = mutilParts.description;
		newProduct.contact_email = mutilParts.contact_email;
		newProduct.category_id = mutilParts.category_id;
		newProduct.pics = picname;
		//console.log(newProduct);
		const updatedProduct = await productData.updateProduct(req.params.id, newProduct);
		
		//if category changes
		if(newProduct.category_id != oldProduct.category_id)
			await category_productsData.changeCategory(newProduct.category_id, req.params.id, newProduct.name, newProduct.pics, oldProduct.category_id);
		else
			await category_productsData.editPost(newProduct.category_id, req.params.id, newProduct.name, newProduct.pics);
		// if product's name changes, need to change #post_items
		if(newProduct.name != oldProduct.name)
			await post_itemsData.editPost(mutilParts.user_id, req.params.id, newProduct.name);
		res.json(updatedProduct);
	}
	catch(e){
		res.status(500).json({error: e});
	}
});

router.post("/", async(req, res) => {
	const mutilParts = req.body;
	try{
		if(typeof mutilParts.name != "string") throw "No product's name provided";
		//if(typeof mutilParts.price != "number") throw "No product's price provided";
		if(typeof mutilParts.description != "string") throw "No product's description provided";
		//if (!Array.isArray(mutilParts.pics)) throw "No product's pictures provided";
		if(typeof mutilParts.contact_email != "string") throw "No product's contact_email provided";
		//if(typeof mutilParts.category_id != "number") throw "No product's category_id provided";
		if(typeof mutilParts.user_id != "string") throw "Invaild user_id provided";

		// if (Object.keys(req.files).length == 0) {
  //   		return res.status(400).send('No files were uploaded.');
  // 		}	
  		
  		if(Object.keys(req.files).length != 0){
		var picsList = req.files.pics;
		var now = new Date();
		var tempname = now.getHours()+"_"+now.getMinutes()+"_"+now.getSeconds()+"_"+req.files.pics.name;
		var picname = "http://localhost:3000/hannibal/pics/"+tempname;
		var wholename = process.cwd()+"/pics/"+tempname;
		picsList.mv(wholename);
		}
		else{
			var picname = "";
		}

		const newProduct = await productData.addProduct(mutilParts.name, mutilParts.price, mutilParts.description, picname, mutilParts.contact_email, mutilParts.category_id);
	
		try{
			const newPost1 = await post_itemsData.updatePost(mutilParts.user_id, newProduct._id, newProduct.name);
		}
		catch(e){
			const newPost2 = await post_itemsData.addPost(mutilParts.user_id, newProduct._id, newProduct.name);
		}
	
		try{
			const newPost3 = await category_productsData.updatePost(newProduct.category_id, newProduct._id, newProduct.name, newProduct.pics);
		}
		catch(e){
			const newPost4 = await category_productsData.addPost(newProduct.category_id, newProduct._id, newProduct.name, newProduct.pics);
		}
		
		res.redirect("/hannibal/postItems/"+mutilParts.user_id);
		//add post_items the user_id and product_id and also catrgory_products
	}
	catch(e){
		res.render("products/uploadProduct",{"hasErrors": true});
	}
});

router.get("/editForm/:id", async(req, res) => {
  	if(req.session.user){
	  	try {
	  		var product = await productData.getProductById(req.params.id);
	  	//check whether this user has authentication to edit this product
		  	let post_items = await post_itemsData.getPostById(req.session.user.user_id);
		  	let lists = post_items.product_ids;
		  	for(let i = 0; i < lists.length; i++){
		  		if(lists[i] == req.params.id)
		  			break;
		  		if(i == lists.length - 1){
		  			res.redirect("http://localhost:3000/hannibal/");
	  				return;
		  		}
		  	}
			var product = await productData.getProductById(req.params.id);
		    res.render("products/editProduct",{
		      partial:"edit",
		      "user_id":req.session.user.user_id,
		      "product": product,
		      "product_id":req.params.id
		    });
    	}
    	catch (e) {
	    	res.render('products/editProduct',{"hasErrors":true, "error": "Server is busy, this product is not found..." });  	
		}
	}
	else{
		res.redirect("http://localhost:3000/hannibal");
	}
});


router.delete("/:product_id.:user_id", async(req, res) => {
  	try {
    	var info = await productData.getProductById(req.params.product_id);
  	}
  	catch (e) {
    	res.status(404).json({ error: "Product not found"});
    	return;
  	}
  	try {
    	await productData.deleteProduct(req.params.product_id);
    	await post_itemsData.deletePost(req.params.user_id, req.params.product_id);
    	await category_productsData.deletePost(info.category_id, req.params.product_id);
    	res.redirect("/hannibal/postItems/"+req.params.user_id);
  	} 
  	catch (e) {
    	res.status(500).json({ error: e });
  	}
});

//yide
router.get("/:id", async (req, res) => {
	try {
	    const product = await productData.getProductById(req.params.id);
	    let result ={};
	    result.name = product.name;
	    result.price = product.price;
	    result.description = product.description;
	    result.pics = product.pics;
	    result.contact_email = product.contact_email;
	    result.category_id = product.category_id;
	    
	    res.render('products/productinfo2',{"product": result});
	}catch (e) {
	    res.render('products/productinfo2',{"hasErrors":true, "error": "Server is busy, this product is not found..." });
	}
});

module.exports = router;




