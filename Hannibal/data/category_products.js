const mongoCollections = require("../config/mongoCollections");
const category_products = mongoCollections.categoryProducts;

const exportedMethods = {
	async getPostById(category_id){
		const category_productsCollection = await category_products();
		const post = await category_productsCollection.findOne({category_id: category_id});
		if(!post) throw "product not found";
		return post;
	},

	async getPostByCatKey(category_id,key){
		const category_productsCollection = await category_products();
		const arr = await category_productsCollection.find({ category_id: category_id}).toArray();
		var reg = new RegExp(key.toLowerCase());
		var n = 0;
		var getPost = [];
		arr[0].names.forEach(function(element) {
			if(reg.test(element.toLowerCase())){
				n = arr[0].names.indexOf(element,n);
				getPost.push({product_ids: arr[0].product_ids[n], names: arr[0].names[n], pics: arr[0].pics[n]});
			}
		});
		return getPost;
	},
	
	async addPost(category_id, product_id, name, pic){
		const category_productsCollection = await category_products();
		let product_idList = [];
		let nameList = [];
		let picList = [];
		product_idList.push(product_id);
		nameList.push(name);
		picList.push(pic);
		const newPost = {
			category_id: category_id,
			product_ids: product_idList,
			names: nameList,
			pics: picList
		};

		const newPostInfo = await category_productsCollection.insertOne(newPost);
		return newPost;
	},

	async updatePost(category_id, product_id, name, pic){
		const category_productsCollection = await category_products();
		const updatePostData = {};
		oldPost = await this.getPostById(category_id);
		
		let newIdList = oldPost.product_ids;
		let newNameList = oldPost.names;
		let newPicList = oldPost.pics;
		newIdList.push(product_id);
		newNameList.push(name);
		newPicList.push(pic);

		updatePostData.product_ids = newIdList;
		updatePostData.names = newNameList;
		updatePostData.pics = newPicList;
	
		let updateCommand = {
	      $set: updatePostData
	    };

	    await category_productsCollection.updateOne({"category_id": category_id}, updateCommand);
	    return await this.getPostById(category_id);
	},

	async changeCategory(category_id, product_id, name, pic, old_category_id){
		const category_productsCollection = await category_products();
		const updatePostData = {};
		oldPost = await this.getPostById(old_category_id);

		let newIdList = oldPost.product_ids;
		for(let i = 0; i < newIdList.length; i++){
			if (newIdList[i] == product_id)
				var index = i;
		}
		//delete from the old category
		oldPost.names.splice(index,1);
		oldPost.product_ids.splice(index,1);
		oldPost.pics.splice(index,1);
		updatePostData.product_ids = oldPost.product_ids;
		updatePostData.names = oldPost.names;
		updatePostData.pics = oldPost.pics;
		let updateCommand = {
	      $set: updatePostData
	    };

	    await category_productsCollection.updateOne({"category_id": old_category_id}, updateCommand);

		//add it to new category
		try{
			return await this.updatePost(category_id, product_id, name, pic);
		}
		catch(e){
			return await this.addPost(category_id, product_id, name, pic);
		}
	},

	async editPost(category_id, product_id, name, pic){
		const category_productsCollection = await category_products();
		const updatePostData = {};
		oldPost = await this.getPostById(category_id);

		let newIdList = oldPost.product_ids;
		for(let i = 0; i < newIdList.length; i++){
			if (newIdList[i] == product_id)
				var index = i;
		}
		oldPost.names[index] = name;
		oldPost.pics[index] = pic;
		let newNameList = oldPost.names;
		let newPicList = oldPost.pics;

		updatePostData.product_ids = newIdList;
		updatePostData.names = newNameList;
		updatePostData.pics = newPicList;

		let updateCommand = {
	      $set: updatePostData
	    };

	    await category_productsCollection.updateOne({"category_id": category_id}, updateCommand);
	    return await this.getPostById(category_id);
	},

	async deletePost(category_id, product_id){
		const category_productsCollection = await category_products();
		const updatePostData = {};
		oldPost = await this.getPostById(category_id);

		let newIdList = oldPost.product_ids;
		for(let i = 0; i < newIdList.length; i++){
			if (newIdList[i] == product_id)
				var index = i;
		}
		oldPost.names.splice(index,1);
		oldPost.product_ids.splice(index,1);
		oldPost.pics.splice(index,1);

		updatePostData.product_ids = oldPost.product_ids;
		updatePostData.names = oldPost.names;
		updatePostData.pics = oldPost.pics;
		let updateCommand = {
	      $set: updatePostData
	    };

	    return await category_productsCollection.updateOne({"category_id": category_id}, updateCommand);

	}
}

module.exports = exportedMethods;



