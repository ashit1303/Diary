//Add EMAIL and PASS to send email from your Gmail account


//CHANGE LINK FOR DEFAULT LOCALHOST
const link='sabutils.herokuapp.com'
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/duser');
const dailyEntry = require('../models/entry');
const nodemailer = require('nodemailer');
var ejs = require("ejs");
var upload = require('express-fileupload');
const express = require('express');
const path = require('path');
var emailOtp = path.join(__dirname, '..', 'views/mailotp.ejs');

var uppath = path.join(__dirname, '..', 'public/dp/');
var allimgs = path.join(__dirname, '..', 'public/allimg/');
const app = express();
app.use(upload());

const sender='noreply.sabutils@gmail.com'//YOUR EMAIL//
const sender_pass='ashitkumar07'//YOUR PASS//

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: sender_pass
  }
});

module.exports = {

  /* *** GET ENDPOINTS *** */
  login: (req, res) => {
    let errors = [];
    errors.push({ text: 'Incorrect Password' });
    res.render('index', { errors ,link})
  },

  register: (req, res) => res.render('index',{link}),


  logout: (req, res) => {
    let errors = [];
    req.logout();
    errors.push({ text: 'You have been logged out' });
    res.render('index', { errors,link });
  },

  secret: (req, res) => {
    let errors = [];
    let currentUser = req.user;
    let thisUser = req.user;
    errors.push({ text: 'Logged in as' });
    res.render('main', { errors, currentUser, thisUser ,link });
  },
  saved: (req, res) => {
    let errors = [];
    let currentUser = [];
    let thisUser = req.user;
    errors.push({ text: 'Entry saved' });
    currentUser.push({ name: '.' });
    res.render('main', { errors, currentUser, thisUser ,link });
  },


  show: (req, res) => {
    let errors = [];
    let currentUser = req.user;
    let thisUser = req.user;
    var date= new Date(req.body.doe);
    var nextdate= new Date(req.body.doe);
    var allentries=[];
     dailyEntry.find({ $query:{ email: req.user.email, entryDate: {$gt : date , $lt: nextdate} }, $project: {topic: 1,entryDate:1}}).sort({entryDate:1})
      .then(dayentry => {
        allentries= dayentry;
      }); 
    nextdate.setDate(date.getDate() + 1);
    dailyEntry.findOne({ $query:{ email: req.user.email, entryDate: {$gt : date , $lt: nextdate} }}).sort({entryDate:-1})
      .then(foundEntry => {
        if (foundEntry==null) {
          currentUser={name:''}
          let alldata={ topic : 'Nothing to display', entry: '' , pics:'imagenotfound.png' ,entryDate : req.body.doe }
          errors.push({ text: 'No entry found on selected date' });
          res.render('show', { errors, currentUser, thisUser, alldata, allentries ,link});
        }
        else {
          let alldata=foundEntry;
          errors.push({ text: 'Logged in as' });
          res.render('show', { errors, currentUser, thisUser, alldata, allentries ,link });
        }
      }

      )
  },


  /* *** POST ENDPOINTS *** */

  postRegister: (req, res) => {
    let errors = [];
    var signup=false;
    let no = req.body.email.indexOf("@")+1;
    let lenstr=req.body.email.length;
    var domain = req.body.email.slice(no, lenstr);
    console.log(domain+' '+lenstr+' '+no);
    let allowedDomain=['gmail.com','yahoo.com','icloud.com','outlook.com','ymail.com','rediffmail.com'];
    for(i=0;i<allowedDomain.length;i++){
        if(domain==allowedDomain[i]){
          signup=true;
          break;
        }
        console.log(allowedDomain[i])
      }
    if (req.body.password != req.body.rpassword) {
      errors.push({ text: 'Password do not match' });
      console.log('Password do not match');
    }  
    if(signup!=true){
      errors.push({ text: 'Email with this domain is not allowed' });
      console.log('Email with this id is not allowed');
    }
    if (req.body.password != req.body.rpassword) {
      errors.push({ text: 'Password do not match' });
      console.log('Password do not match');
    }
    if (req.body.password.length < 8) {
      errors.push({ text: 'Password must be at least 8 characters!' });
      console.log('Password must be at least 8 characters!');
    }
    // verify if errors exist
    if (errors.length > 0) {/* 
      res.render('index'); */
      res.render('index', { errors, link });
    }
    else {
      User.findOne({ email: req.body.email })
        .then(user => {
          if (user) {
            errors.push({ text: 'User already exist!' });
            res.render('index', { errors,link });
          } else {
            const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              dob: req.body.dob,
              gender: req.body.gender,
              mobile: req.body.mobile,
              isVerified: false,
            });
            if (req.files.profilepic) {
              var no = req.body.email.indexOf("@");
              var userName = req.body.email.slice(0, no);
              var file = req.files.profilepic,
                name = userName + "-" + Date.now() + "-" + file.name.slice(-7),
                type = file.mimetype;
              console.log(name + "    " + type);
              newUser.dpdet.name = name;
              newUser.dpdet.mimetype = type;
              var uploadpath = uppath + name;
              file.mv(uploadpath, function (err) {
                if (err) {
                  console.log("File Upload Failed", name, err);
                }
                else {
                  console.log("File Uploaded", name);
                }
              });
            }
            //otp generator
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 1; i < 6; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            newUser.otp = text;
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    console.log(`User ${user.name} registered!`);
                    ejs.renderFile(emailOtp, { otp: text }, function (err, data) {
                      if (err) {
                        console.log(err);
                      } else {
                        var mailOptions = {
                          from: '"Sabutils Diary" <SENDEREMAIL>',
                          to: req.body.email,
                          subject: 'SABUTILS email verification',
                          html: data
                        };
                        transporter.sendMail(mailOptions, function (err, info) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log('Message sent: ' + info.response);
                          }
                        });
                      };

                    });
                    console.log(`Otp ${user.otp} send!`);
                    errors.push({ text: 'Successfully Registered, Check ' + user.email + ' for OTP' });
                    res.render('index', { errors ,link});
                    /* res.redirect('/index', email); */
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
    }
  },

  verOtp: (req, res) => {
    let errors = [];
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          errors.push({ text: 'User not found' });
          res.render('index', { errors ,link });
        } else {
          User.findOne({ email: req.body.email }, { otp: 1, isVerified: 1, _id: 0 })
            .then(verifyobj => {
              if (verifyobj.isVerified == true) {
                errors.push({ text: 'Email already verified' });
                console.log('Email already verified');
                res.render('index', { errors ,link });
              }
              else if (verifyobj.otp == req.body.otp) {
                var conditions = { email: req.body.email }, update = { $set: { isVerified: true } };
                User.update(conditions, update, { upsert: true }, function callback(err) {
                  console.log(err);
                })
                errors.push({ text: 'Email verified' });
                console.log('Email verified');
                res.render('index', { errors ,link});
              }
              else {
                errors.push({ text: 'Incorrect otp unable to verify' });
                console.log('Wrong OTP');
                res.render('index', { errors ,link });
              }
            })
        }
      });
  },

  postLogin: (req, res, next) => {
    let errors = [];
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          errors.push({ text: 'User not found' });
          res.render('index', { errors ,link });
        }
        else {
          User.findOne({ email: req.body.email }, { isVerified: 1, _id: 0 })
            .then(obj => {
              if (obj.isVerified != true) {
                errors.push({ text: 'You need to verify your email' });
                console.log('You need to verify your email');
                res.render('index', { errors ,link})
              }
              else {
                passport.authenticate('local', {
                  successRedirect: 'main',
                  failureRedirect: '/login'
                })(req, res, next);
              }

            })
        }
      });

  },

  genotp: (req, res) => {
    let errors = [];
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          errors.push({ text: 'Email not registered' });
          res.render('index', { errors ,link });
        } else {
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
          for (var i = 1; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          ejs.renderFile(emailOtp, { otp: text }, function (err, data) {
            if (err) {
              console.log(err);
            } else {
              var mailOptions = {
                from: '"Sabutils Diary" <SENDEREMAIL>',
                to: req.body.email,
                subject: 'SABUTILS email verification',
                html: data
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Message sent: ' + info.response);
                }
              });
            }
          })
          var conditions = { email: req.body.email }, update = { $set: { otp: text } };
          User.update(conditions, update, { upsert: true }, function callback(err) {
            console.log(err);
          });
          errors.push({ text: 'OTP Sent! Also check spam' });
          res.render('index', { errors,link });
        };

      });
  },



  passreset: (req, res) => {
    let errors = [];
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          errors.push({ text: 'Email not registered' });
          res.render('index', { errors,link });
        }
        else if (req.body.password !== req.body.rpassword) {
          errors.push({ text: 'Password do not match' });
          res.render('index', { errors ,link });
        }
        else if (user.otp == req.body.otp) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              var conditions = { email: req.body.email }, update = { $set: { password: hash } };
              User.update(conditions, update, { upsert: true }, function callback(err) {
                console.log(err);
              });
              errors.push({ text: 'Password successfully changed' });
              res.render('index', { errors ,link});
            })
          })
        }
        else {
          errors.push({ text: 'Incorrect otp unable to verify' });
          res.render('index', { errors,link });
        }
      })
  },

  postSave: (req, res) => {
    var no = req.user.email.indexOf("@");
    var userName = req.user.email.slice(0, no);
    const newEntry = new dailyEntry({
      email: req.user.email,
      topic: req.body.topic,
      entry: req.body.entry
    });
    if (req.files.profilepic) {
      var file = req.files.profilepic;
      var name = userName + "-" + Date.now() + "-" + "0" + file.name.slice(-7);
      var uploadpath = allimgs + name;
      newEntry.pics=name/* .push({ name: name }) */;
      file.mv(uploadpath, function (err) {
        if (err) {
          console.log("File Upload Failed", name, err);
        }
        else {
          console.log("File Uploaded", name);
        }
      });
      if (req.files.imge1) {
        var file = req.files.imge1
        var name = userName + "-" + Date.now() + "-" + "1" + file.name.slice(-7);
        var uploadpath = allimgs + name;
        file.mv(uploadpath, function (err) {
          if (err) {
            console.log("File Upload Failed", name, err);
          }
          else {
            console.log("File Uploaded", name);
            newEntry.pics.push(filename);
            newEntry.pics.push({ name: name });
          }
        });
      }
      if (req.files.imge2) {
        var file = req.files.imge2
        var name = userName + "-" + Date.now() + "-" + "2" + file.name.slice(-7);
        var uploadpath = allimgs + name;
        var filename = { name: name };


        file.mv(uploadpath, function (err) {
          if (err) {
            console.log("File Upload Failed", name, err);
          }
          else {
            console.log("File Uploaded", name);
            newEntry.pics.push(filename);
            newEntry.pics.push({ name: name });

          }
        });
      }
    }

    newEntry.save()
      .then(user => {
        console.log(`memo saved`);
        res.redirect('/entrysaved');
      })
  }
  // Finish
};
