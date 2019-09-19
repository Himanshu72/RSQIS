var express = require('express');
var router = express.Router();
/* GET login page. */
router.get('/', function(req, res, next) {
  
  res.render('login',{data:""});
  
});

/* POST login page. */
router.post('/login', function(req,res,next){

  let username=req.body.username
  let password=req.body.password;
  if(username && password ){
    res.status(200).redirect("/"+req.body.username+"/filter_road");

  }else{
    res.status(404).render("login",{data:{
      error:true,
      msg:"Invalid Username or Password"
    }});
  }
  
});


/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register',{data:""});
});


/* GET road gallary page. */
router.get('/forgot', function(req, res, next) {
  res.render('forgot',{data:""});
});



/* GET road gallary page. */
router.get('/:user/filter_road', function(req, res, next) {
  res.render('road_gallary',{data:""});
});


/* GET road page. */
router.get('/:user/road:id', function(req, res, next) {
  res.render('road',{data:""});
});

/* GET road complaint page. */
router.get('/:user/complaint_list', function(req, res, next) {
  res.render('road',{data:""});
})  ;



module.exports = router;
