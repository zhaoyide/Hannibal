const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

const uuid = require("uuid/v4");

const exportedMethods = {
	async checkUsername(name){
		const userCollection = await users();
		const user = await userCollection.findOne({user_name: name});
		if(!user){
			return true;
		}
		else{
			return false;
		}
	}, 

	async getUserByName(name){
		const userCollection = await users();
		const user = await userCollection.findOne({user_name: name});
		if(!user){
			throw "Wrong username/password";
		}
		return user;
	}, 

	async addUser(name,pass,email){
		const userCollection = await users();
		const newUser = {
			_id: uuid(),
			user_name: name,
			user_pass: pass,
			contact_email: email
		};
		const newUserInfo = await userCollection.insertOne(newUser);
		return newUser;
	},

	async getEmailById(user_id){
		const userCollection = await users();
		const result = await userCollection.findOne({_id: user_id});
		return result.contact_email;
	},

	async getUserById2(id){
		const userCollection = await users();
		const user = await userCollection.findOne({_id:id});
		if(!user) throw "user not found";
		return user;
	},

	//xt
	async getUserById(id) {
        if (!id) throw "No User ID provided!";
        const userCollection = await users();
        const getInfo = await userCollection.find({_id:id}).toArray();
        if(getInfo === 0) throw "No such User in Database!";
        return getInfo;
	},

	async updateUserById(user_id, user_info){
		const userCollection = await users();
		const updateData = {};
		if(user_info.user_name){
			updateData.user_name = user_info.user_name;
		}
		if(user_info.user_pass){
			updateData.user_pass = user_info.user_pass;
		}
		if(user_info.contact_email){
			updateData.contact_email = user_info.contact_email;
		}
		const updateInfo = await userCollection.updateOne({_id : user_id},{$set : updateData});
		if(updateInfo === null) throw "Can not update this user!";
        return await this.getUserById(user_id);
	}
	//xt

}


module.exports = exportedMethods;







