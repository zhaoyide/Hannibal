const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 16;
const data = require("../data");
const userData = data.users;

router.post("/", async(req, res) => {
	try{
		const upload = req.body;
		if(await userData.checkUsername(upload.user_name)){
			const hashpass = await bcrypt.hash(upload.user_pass,saltRounds);
			let result = await userData.addUser(upload.user_name, hashpass, upload.contact_email);
			res.redirect("/hannibal");
			
		}
		else{
			res.render("users/signup", {message:"This username has been taken."});
		}
	}
	catch(e){
		res.redirect("/hannibal/signup");
	}
});

router.post("/login", async(req, res) => {
	try{
		const upload = req.body;
		var userInfo = await userData.getUserByName(upload.user_name);
		if(await bcrypt.compare(upload.user_pass, userInfo.user_pass)){
			req.session.user = {"user_id":userInfo._id};
			//console.log(req.session);
			res.status(200).redirect("http://localhost:3000/hannibal/");
			//res.status(200).render("index",{"user": req.session.user});
		}
		else{
			res.status(201).render("users/login", {message:"username/password is not correct!"});
		}
	}
	catch(e){
		res.status(202).render("users/login", {message:"account doesn't exist!"});
	}
});

router.get("/email/:id", async(req, res) => {
	if(req.session.user){
	try{
		const email = await userData.getEmailById(req.params.id);
		res.json(email);
	}
	catch(e){
		res.status(500).json({error: e});
	}
	}
	else
		res.redirect("http://localhost:3000/hannibal/");
});

// xt
router.get("/private/:id", async(req, res) => {
	if(req.session.user)
	res.render("users/private", {"user_id" : req.params.id, partial:"private"});
	else
		res.redirect("http://localhost:3000/hannibal/");
});

router.post("/private/:id", async(req, res) => {
	
	const edit = req.body;
	const user_id = req.params.id;
	const updateData = {};
	try{
		var oldinfo = await userData.getUserById(user_id);
	}
	catch(e){
		res.render("users/private",{"user_id" : user_id, message:"This username has been taken."});
		return;
	}
	updateData.user_name = oldinfo.user_name;
	if(edit.user_pass){
			const hashpass = await bcrypt.hash(edit.user_pass,saltRounds);
			updateData.user_pass = hashpass;
	}
	if(edit.contact_email){
	 		updateData.contact_email = edit.contact_email;
	}
	await userData.updateUserById(req.params.id, updateData);
	res.json({
		status:true
	});
	

	// let flag = 0;
	// if(edit.user_name){
	// 	if(await userData.getUserById(user_id)){
			
	// 	}
	// 	else{
	// 		flag = 1;
	// 		res.render("users/private",{"user_id" : user_id, message:"This username has been taken."})
	// 	}
	// }
	// if(flag == 0){
	// 	if(edit.user_pass){
	// 		const hashpass = await bcrypt.hash(edit.user_pass,saltRounds);
	// 		updateData.user_pass = hashpass;
	// 	}
	// 	if(edit.contact_email){
	// 		updateData.contact_email = edit.contact_email;
	// 	}
	// 	await userData.updateUserById(req.params.id, updateData);
	// 	res.json({
	// 		status:true
	// 	});
	// 	// res.redirect("http://localhost:3000/hannibal/");
	// }
});

router.get("/*", async(req, res) => {
  res.redirect("http://localhost:3000/hannibal/");
});


module.exports = router;




