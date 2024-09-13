// app.js

import express from 'express';

import mysql from 'mysql';
import{getAllTransaction,getProposedHoldTime,convertEpocToDate,calculateFutureTime,getElapsedTime,capitalizeFirstLetter}  from './src/controllers/controllers.js';
import dotenv from 'dotenv';
import flash from 'express-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';


const app = express();
const port = 3000;

// Set EJS as the template engine
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat', // Secret key to sign the session ID cookie
  resave: false,          // Prevents session from being saved back to the session store if not modified
  saveUninitialized: true // Forces a session to be saved even if it's unmodified
}));
app.use(flash());
dotenv.config();


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  export{connection} ;

// Define a simple route
app.get('/', (req, res) => {
  res.render('index', { error_message:req.flash('error'),message: "" });
});

// Start the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

app.post('/submit', async (req, res) => {
    const surname = req.body['surname'];
    const pin = req.body['pin'];
  
    try {
      const results = await getAllTransaction(capitalizeFirstLetter(surname), pin);
      const time_to_hold = getProposedHoldTime(results[0].rate_type,results[0].proposed_time_hold)
      console.log(results);
      

      res.render("hold_info",{
        d_fname: results[0].d_fname,
        d_lname: results[0].d_lname,
        r_fname: results[0].r_fname,
        r_lname: results[0].r_lname,
        d_tel: results[0].d_phone_num,
        r_tel: results[0].r_phone_num,
        d_email: results[0].d_email,
        r_email : results[0].r_email,
        hold_time: time_to_hold,
        p_holdtime:0,
        p_finalTime:0,
        rate_type: results[0].rate_type,
        order_pin: results[0].pin,
        hold_status: results[0].hold_status,
        dropOff_time: convertEpocToDate(results[0].time_stamp_drop),
        pp_time: calculateFutureTime(results[0].time_stamp_drop,results[0].proposed_time_hold),
        final_hold_time: getElapsedTime(results[0].time_stamp_drop,results[0].rate_type)

      });
    } catch (error) {
      req.flash("error","That Hold Does Not Exist!");
      res.redirect("/");
    }
  });