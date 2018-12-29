const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const bcrypt = require("bcrypt");
const saltRounds = 16;
const users = data.users;
const products = data.products;
const postItems = data.postItems;
const categoryProducts = data.categoryProducts;
const categories = data.categories;

const main = async () => {
	const db = await dbConnection();
  	await db.dropDatabase();

  	//add categories
  	const category_game = await categories.addCategory("Game");
  	const game_id = category_game._id;
  	const category_desktop = await categories.addCategory("Desktop");
  	const desktop_id = category_desktop._id;
  	const category_phone = await categories.addCategory("Phone");
  	const phone_id = category_phone._id;
  	const category_clothing = await categories.addCategory("Clothing");
  	const cloth_id = category_clothing._id;
  	const category_other = await categories.addCategory("Other");
  	const other_id = category_other._id;

  	//sign up a new account
  	const hashpass = await bcrypt.hash("123",saltRounds);
  	const test_user = await users.addUser("test",hashpass,"test@gmail.com"); // "test" is username, "123" is password
  	const user_id = test_user._id;
  	const user_email = test_user.contact_email;

  	//upload a product by this user
  	const zelda = await products.addProduct(
  		"zelda switch", //product name
  		"34.99", 		//product price
  		"It's in good condition!", //product description
  		"http://localhost:3000/hannibal/pics/zelda.png", //product picture
  		user_email, 	//contact email
  		category_game._id //category id
  	); 
  	const product_id = zelda._id;
  	const product_name = zelda.name;
  	const product_pic = zelda.pics;

  	const post_zelda = await postItems.addPost(user_id,product_id, product_name);
  	const category_zelda = await categoryProducts.addPost(category_game._id,product_id, product_name, product_pic);



  	console.log("Done seeding database");
  	await db.serverConfig.close();
}

main().catch(console.log);







