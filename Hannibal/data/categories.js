const mongoCollections = require("../config/mongoCollections");
const categories = mongoCollections.categories;
const uuid = require("uuid/v4");

const exportedMethods = {
	async getAllcategories(){
		
		const categoriesCollection = await categories();
		return await categoriesCollection.find({}).toArray();
	},

	async getAllcategoriesName(){
		const categoriesCollection = await categories();
		var allCategories = await categoriesCollection.find({}).toArray();
		var names = allCategories.map(item => item.name);
		return names;
	},

	async getCategoryByName(name){
		const categoriesCollection = await categories();
		const category = await categoriesCollection.findOne({name:name});
		if(!category) throw "category not found";
		return category;
	},

	async getCategoryById(id){
		const categoriesCollection = await categories();
		const category = await categoriesCollection.findOne({_id:id});
		if(!category) throw "category not found";
		return category;
	},

	async addCategory(name){
		if(typeof name != "string") throw "No category's name provided";

		const categoriesCollection = await categories();
		
		const newCategory = {
			_id: uuid(),//category_id
			name: name
		};

		const newCategoryInfo = await categoriesCollection.insertOne(newCategory);
		return newCategory;
	},

	async deleteCategory(id){
		const categoriesCollection = await categories();
		const category = await categoriesCollection.removeOne({_id:id});
		if(!category) throw `category with id ${id} not found`;
		return `category with id ${id} deleted`;
	}
}

module.exports = exportedMethods;