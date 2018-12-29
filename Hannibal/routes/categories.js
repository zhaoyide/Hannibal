const express = require("express");
const router = express.Router();
const data = require("../data");
const categoryData = data.categories;

router.get("/", async(req, res) => {
	try{
		const categoriesList = await categoryData.getAllcategories();
		res.json(categoriesList);
	}
	catch(e){
		//console.log(e);
		res.status(500).json({error: e});
	}
});

router.get("/:id", async (req, res) => {
  try {
    const category = await categoryData.getCategoryById(req.params.id);
    res.json(category);
  } catch (e) {
    res.status(404).json({ error: "category not found" });
  }
});

router.post("/", async(req, res) => {
	const mutilParts = req.body;
	try{
		if(typeof mutilParts.name != "string") throw "No product's name provided";
		
		const newCategory = await categoryData.addCategory(mutilParts.name);

		res.json(newCategory);
		
	}
	catch(e){
		console.log(e);
		res.status(500).json({error: e});
	}
});

router.delete("/:id",async (req,res) => {
	try {
    let deleteInformation = await categoryData.deleteCategory(req.params.id);
    res.json(deleteInformation);
  } catch (e) {
    console.log(e);
    res.Status(500).json({error: e});
   
  }
})

module.exports = router;