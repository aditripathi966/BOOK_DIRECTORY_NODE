const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const User=require("../models/db");


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Homepage' });
});

router.get('/signin', (req, res, next) => {
  res.render('signin', { title: 'Signin-page' });
});

router.post('/signin', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.send(`User not found. <a href="/signin">signin</a>`);
    }

    if (user.password !== password) {
      return res.send(`Incorrect password. <a href="/signin">signin</a>`);
    }

    res.redirect('/profile/' + user._id);
  } catch (error) {
    res.send(error);
  }
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Signup-page' });
});

router.post('/signup', async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.redirect('/signin');
  } catch (error) {
    res.send(error);
  }
});

router.get('/profile/:id', async (req, res, next) => {
  try {
    const users = await userModel.find();
    const user = await userModel.findById(req.params.id);
    res.render('profile', { title: 'Profile',user, users });
  } catch (error) {
    res.send(error);
  }
});

router.get('/create/:id', (req, res, next) => {
  res.render('create', { title: 'create', id: req.params.id });
});

router.get('/bookview/:id', async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.render('bookview', { title: 'Books', arr: user.db, id: req.params.id });
  } catch (error) {
    res.send(error);
  }
});

router.post('/create/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const user = await userModel.findById(req.params.id);
    user.db.push(data);
    await user.save();
    res.redirect('/bookview/'+req.params.id);
  } catch (error) {
    res.send(error);
  }
});

router.get('/delete/:id/:index', async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    let arr=user.db;
        arr.splice(req.params.index, 1);
        user.db=arr;
        user.save();
    res.redirect("back");
  } catch (error) {
    res.send(error);
  }
});

router.get("/update/:id/:index", async function (req, res, next) {
  try {
      let user = await userModel.findById(req.params.id);
      res.render("update", { title: "Update Task", user :user.db[req.params.index] ,id:req.params.id,index:req.params.index});
  } catch (error) {
      res.send(error);
  }
});

router.post("/update/:id/:index", async function (req, res, next) {
  try {
     let user= await userModel.findById(req.params.id);
     let arr=user.db[req.params.index];
     arr.title=req.body.title;
     arr.author=req.body.author;
     arr.coverimage=req.body.coverimage;
     arr.datepublish=req.body.datepublish;
     arr.desc=req.body.desc;
     user.db[req.params.index]=arr;
     user.save();
     res.redirect("/bookview/"+req.params.id)
  } catch (error) {
      res.send(error);
  }
});
router.get('/forgetpw', (req, res, next) => {
  res.render('forgetpw', { title: 'forgetpw'});
});
router.post('/forgetpw', async function(req, res, next) {
  try {
      const user = await userModel.findOne({email: req.body.email})

      if (user == null){
          return res.send(
              `user not found. <a href ="/forgetpw">Forget password</a>`
          )
      }
        res.redirect("/changepw/" + user._id)
  } catch (error) {
         res.send(error)
  }
});
router.get('/changepw/:id', function(req, res, next) {
  res.render("changepw",{
      title: "changepw",
      id:req.params.id,
  })
});
router.post('/changepw/:id', async function(req, res, next) {
   try {
       await userModel.findByIdAndUpdate(req.params.id , req.body)
       res.redirect("/signin") 
           
   } catch (error) {
         res.send(error)
   }
});
module.exports = router;
