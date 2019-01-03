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
  	var product_id = zelda._id;
  	var product_name = zelda.name;
  	var product_pic = zelda.pics;

  	var post_zelda = await postItems.addPost(user_id,product_id, product_name);
  	var category_zelda = await categoryProducts.addPost(category_game._id,product_id, product_name, product_pic);
    
    //upload second product by this user
    const nba = await products.addProduct(
      "NBA 2K19", //product name
      "36.00",    //product price
      "It's in good condition!", //product description
      "http://localhost:3000/hannibal/pics/NBA.png", //product picture
      user_email,   //contact email
      game_id //category id
    ); 
    var product_id2 = nba._id;
    var product_name2 = nba.name;
    var product_pic2 = nba.pics;

    var post_NBA = await postItems.updatePost(user_id,product_id2, product_name2);
    var category_NBA = await categoryProducts.updatePost(game_id,product_id2, product_name2, product_pic2);

    //upload third product by this user
    const cod = await products.addProduct(
      "CALL of Duty: Black OPS", //product name
      "44.00",    //product price
      "It's in good condition!", //product description
      "http://localhost:3000/hannibal/pics/cod.png", //product picture
      user_email,   //contact email
      game_id //category id
    ); 
    var product_id3 = cod._id;
    var product_name3 = cod.name;
    var product_pic3 = cod.pics;

    var post_cod = await postItems.updatePost(user_id,product_id3, product_name3);
    var category_cod = await categoryProducts.updatePost(game_id,product_id3, product_name3, product_pic3);

    //upload forth product by this user
    const rdr2 = await products.addProduct(
      "RED DEAD REDEMPTION II", //product name
      "54.00",    //product price
      "It's in good condition!", //product description
      "http://localhost:3000/hannibal/pics/RDR2.png", //product picture
      user_email,   //contact email
      game_id //category id
    ); 
    var product_id4 = rdr2._id;
    var product_name4 = rdr2.name;
    var product_pic4 = rdr2.pics;

    var post_rdr2 = await postItems.updatePost(user_id,product_id4, product_name4);
    var category_rdr2 = await categoryProducts.updatePost(game_id,product_id4, product_name4, product_pic4);

  	console.log("Done seeding database");
  	await db.serverConfig.close();
}

main().catch(console.log);







