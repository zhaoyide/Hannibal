const productsData = require("./products");
const postItemsData = require("./post_items");
const usersData = require("./users");
const categoryProductsData = require("./category_products");
const categoriesData = require("./categories");

module.exports = {
	products: productsData,
	postItems: postItemsData,
	categoryProducts: categoryProductsData,
	users: usersData,
	categories: categoriesData
}