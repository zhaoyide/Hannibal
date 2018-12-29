const express = require("express");
const router = express.Router();
const data = require("../data");
const categoryData = data.categories;
const categoryProductData = data.categoryProducts;

router.get("/", async(req, res) => {
	try{
		const categoriesList = await categoryData.getAllcategories();
		const category_products = [];
		 for(var i = 0; i < categoriesList.length;i++){
		 	var category_product = {};
            try{var IdName = await categoryProductData.getPostById(categoriesList[i]._id);}
            catch(e){ var IdName = null}

            category_product.category_name = await categoriesList[i].name;
            category_product.IdandNames=[];
            if(IdName != null){
            for(var n = 0;n <IdName.product_ids.length; n++){
                category_product.IdandNames.push({product_id:IdName.product_ids[n],product_name:IdName.names[n],product_pic:IdName.pics[n]});
            }

            }  
            await category_products.push(category_product);
		}
		if(req.session.user)
			await res.render('index',{"category_products":category_products, "user_id":req.session.user.user_id,partial:"scroll_btn"});
		else
			await res.render('index',{"category_products":category_products,partial:"scroll_btn"});
	}
	catch(e){
		console.log(e);
		res.status(500).json({error: e});
	}
});

router.post("/", async (req, res) => {
	let category = req.body.search;
	let keyword = req.body.keyword;
    try {
		var IdNames = [];
		var category_products = [];
		if (category == "all"){	
			try{
				const categoriesList = await categoryData.getAllcategories();
				for(var i = 0; i < categoriesList.length;i++){
					try{
						var IdName = await categoryProductData.getPostByCatKey(categoriesList[i]._id,keyword);
					}
					catch(e){
						IdName = [];
					}
					IdNames = IdNames.concat(IdName);
				}
			}
			catch(e){IdNames = null}
		}
		else{
			try{
				var category_id = await categoryData.getCategoryByName(category);
				IdNames = await categoryProductData.getPostByCatKey(category_id._id,keyword);
			}
			catch(e){IdNames = null}
		}
		var category_product = {};
		category_product.category_name = category;
		category_product.IdandNames=[];
		if(IdNames != null){
			for(var i = 0;i < IdNames.length; i++){
				category_product.IdandNames.push({product_id:IdNames[i].product_ids,product_name:IdNames[i].names,product_pic:IdNames[i].pics});
			}
		}
		await category_products.push(category_product);
		if (category_product.IdandNames.length == 0){
			await res.render('products/search',{ error: " We didn't find results for your input. " });
		}
		else{
			if(req.session.user){
				await res.render('products/search',{"category_products":category_products, "user_id":req.session.user.user_id });
			}
			else
				await res.render('products/search',{"category_products":category_products });
		}
	} catch (e) {
		await res.render('products/search',{"category_products":category_products , error : e });
	}
});

router.get("/*", async(req, res) => {
  res.redirect("http://localhost:3000/hannibal/");
});

module.exports = router;