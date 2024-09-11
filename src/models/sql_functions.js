import { connection} from "../../app.js";

const getActiveTransactions = (surname, pin, callback) => {
    const sql = `SELECT * FROM holdyah_transaction WHERE r_lname = ? AND pin = ? AND hold_status = 'Active'`;
    
    connection.query(sql, [surname, pin], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  };

  export{getActiveTransactions};
  