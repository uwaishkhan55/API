const UserModel = require('../models/UserModel');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});
module.exports = {

 //create user
  create: (req, res) => {
   
    let user = new UserModel({
     name:req.body.name
    });
   let id=99
    user.save()
      .then(result => {
        id=String(result._id);
        client.hmset(id, [ 'name', req.body.name ],err=>console.log(err))
        client.expire(id, 30000);
        res.json({ success: true, result: result });
       })
      .catch(err => {
        res.json({ success: false, result: err });
      });  
     
  },

  update: (req, res) => {
    let id= req.body.id;
    client.del(id)
    
    UserModel.updateOne({_id:id},{$set:req.body})
      .then(user => {
        if (!user) res.json({ success: false, result: "User does not exist" });

        client.hmset(String(id), ['name', req.body.name ])
        client.expire(String(id), 30000);
        res.json(user);
      })
      .catch(err => {
        res.json({ success: false, result: err });
      });
  },

  retrieve: (req, res) => {

     let id=req.params.id;
    client.hgetall(String(id), function(err, obj){
      if(obj){
        console.log("wohoh")
         res.json({ success: true, result: obj }).end();
      }else{
        UserModel.findOne({_id:id})
        .then(result => {
          if (!result) res.json({ success: false, result: "No results found" });
  
          res.json({ success: true, result: result });
        })
        .catch(err => res.json({success: false, result: err}));
      }
    });



   
  },

  delete: (req, res) => {
    let id=req.body._id;
    client.del(String(id));
    UserModel.deleteOne({_id: id})
      .then(result => {
        if (!result) res.json({ success: false, result: "No user was found with the ID" });
        res.json({ success: true, result: result });
      })
      .catch(err => res.json({ success: false, result: err }));
  }

}