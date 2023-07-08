const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//mongodb
var { MongoClient } = require("mongodb");
const mongoUrl = "mongodb://127.0.0.1:27017/";
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(20);

var bodyParser = require("body-parser");
const { truncate } = require("fs");
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.append("Acess-Control-Allow-Origin", ["*"]),
    res.append("Acess-Control-Allow-Methods", "GET,PUT,POST,DELETE"),
    res.append("Acess-Control-Allow-Headers", "Content_Type"),
    next();
});

const option = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(option));

const regexPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const client = new MongoClient(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

io.on("connection", function (socket) {
  console.log("a user connected");

  //  login eaglepay
  socket.on("login", (req) => {
    console.log(req);
    if (!/^[0-9]{10,10}$/.test(req?.mobile) || req.pass == "") {
      socket.emit("login", "wrong mobile or pass");
    } else {
      client.connect().then((client) => {
        var db = client.db("eaglepay");
        console.log("connected db", req);

        db.collection("eagle_users")
          .find({ mobile: req.mobile, pass: req.pass })
          .toArray(function (err, result) {
            if (err) {
              console.log("1 Error finding:");
              // socket.emit('account result', msg);
              client.close();
            } else {
              if (result.length > 0) {
                console.log("result1", result);
                // let res = {Account_No:result.Account_No,Bank_Name:result.Bank_Name,Holder_Name:result.Holder_Name,IFSC_Code:result.IFSC_Code}
                socket.emit("login", { success: result });
              } else {
                socket.emit("login", {
                  failed: "please enter correct phone no or pass",
                });
                console.log("result2", result);
              }
              client.close();
            }
          });
      });
    }
  });

  // fetch account detailes
  socket.on("account_details", (req) => {
    // console.log('message: ' , acc == "500101010734426");
    // socket.emit('account result', msg);
    client.connect().then((client) => {
      var db = client.db("eaglepay");
      console.log("connected db", req);

      db.collection("BankAccountsDetail")
        .find({
          "Acount_Details.Account_No": req.AccNo,
          "Acount_Details.IFSC_Code": req.IFSCCode,
        })
        .toArray(function (err, result) {
          if (err) {
            console.log("1 Error finding:");
            // socket.emit('account result', msg);
            client.close();
          } else {
            if (result.length > 0) {
              console.log("result1", result);
              // let res = {Account_No:result.Account_No,Bank_Name:result.Bank_Name,Holder_Name:result.Holder_Name,IFSC_Code:result.IFSC_Code}
              socket.emit("user_account", { success: result });
            } else {
              socket.emit("user_account", {
                failed: "please enter correct Account no or IFSC code",
              });
              console.log("result2", result);
            }
            client.close();
          }
        });
    });
  });

  // update account balance
  socket.on("pay_amount", (req) => {
    client.connect().then((client) => {
      var db = client.db("eaglepay");
      console.log("connected db", req);
      let status = "";

      db.collection("BankAccountsDetail").updateOne(
        {
          "Acount_Details.Account_No": req.Account_No,
          "Acount_Details.IFSC_Code": req.IFSC_Code,
        },
        { $inc: { "Acount_Details.Balance": +req.Amount } },
        (err, result) => {
          if (err) {
            console.log("1 Error finding:");
            status = "failed";
            // socket.emit('account result', msg);
            socket.emit("payment_result", "failed");
            client.close();
          } else {
            console.log("result1", result.modifiedCount);
            console.log(req);
            let boo = false;

            if (result.modifiedCount != 0) {
              boo = true;
              console.log("result2", result);
              status = "success";
            } else {
              console.log("result2", result);
              status = "failed";

              boo = false;
            }
            // client.close();

            if (boo) {
              db.collection("BankAccountsDetail").updateOne(
                { mobile: req.myMobile },
                { $inc: { "Acount_Details.Balance": -parseInt(req.Amount) } },
                (err, result2) => {
                  if (err) {
                    console.log("12 Error finding:");
                    // socket.emit('account result', msg);
                    client.close();
                  } else {
                    console.log("result12", result2.modifiedCount);
                    if (result2.modifiedCount != 0) {
                      console.log("result22", result2);
                      socket.emit("payment_result", {
                        result: "success",
                        recivedAmount: req?.Amount,
                      });
                      // socket.emit('currentBalance', {result:"success",mainBalance:req?.Amount});
                    } else {
                      console.log("result2", result2);
                      // socket.emit('currentBalance', "failed");
                      socket.emit("payment_result", "failed");
                    }
                    // client.close();
                  }
                }
              );
            } else {
              socket.emit("payment_result", "failed");
              // client.close();
            }



            db.collection("BankAccountsDetail").updateOne(
              { mobile: req.myMobile },
              {
                $push: {
                  "transaction_history.bank_history": {
                    Holder_Name: req.Holder_Name,
                    Account_No: req.Account_No,
                    Amount: req.Amount,
                    Time: new Date().toTimeString().split(" ")[0],
                    Status: status,
                  },
                },
              },
              { upsert: true },
              (err, result2) => {
                if (err) {
                  console.log("12 Error finding:");
                  // socket.emit('account result', msg);
                  client.close();
                } else {
                  // console.log('result12',result2.modifiedCount)
                  if (result2.modifiedCount != 0) {
                    console.log("result22", result2);
                    // socket.emit('payment_result', {result:"success",recivedAmount:req?.Amount});
                    // socket.emit('currentBalance', {result:"success",mainBalance:req?.Amount});
                  } else {
                    console.log("result2", result2);
                    // socket.emit('currentBalance', "failed");
                    // socket.emit('payment_result', "failed");
                    client.close()
                  }
                }
              }
            );

          }
        }
      );
    });
  });

  // get main Balance
  socket.on("mainBalNo", (req) => {
    client.connect().then((client) => {
      var db = client.db("eaglepay");
      console.log("connected db", req);

      db.collection("BankAccountsDetail")
        .find({ mobile: req })
        .toArray(function (err, result) {
          if (err) {
            console.log("1 Error finding:",);
            // socket.emit('account result', msg);
            client.close();
          } else {
            if (result.length > 0) {
              console.log("result1", result);
              // let res = {Account_No:result.Account_No,Bank_Name:result.Bank_Name,Holder_Name:result.Holder_Name,IFSC_Code:result.IFSC_Code}
              socket.emit("mainBal", result[0]);
            } else {
              socket.emit("mainBal", 0);
              console.log("result2", result);
            }
            client.close();
          }
        });
    });
  });

  // get transaction history
  socket.on("transaction_history", (req) => {
    client.connect().then((client) => {
      var db = client.db("eaglepay");
      console.log("connected db");

      db.collection("BankAccountsDetail")
        .find({ mobile: req.mobile })
        .toArray((err, result) => {
          if (err) {
            console.log("13 Error finding:");
            // socket.emit('account result', msg);
            client.close();
          } else {
            console.log("hiii2", result);
            let history = [];
            // console.log("hiii", result[0].transaction_history?.bank_history);
            result[0]?.transaction_history?.bank_history?.forEach((item) => {

              history.push(item);

            });
            console.log("his", history);
            // history.forEach((item,index)=>{
            //   // let ind =  item['Account_No'].indexOf(req?.Account_No)
            //   // ind>=0 && history.splice(ind,1)
            //   // console.log(item,ind)
            //   history.push({Holder_Name : item.Holder_Name,Account_No:item.Account_No,})
            // })
            

            db.collection("transaction_history").updateOne(
              { mobile: req.mobile },
              { $set: { bank_history: history, mobile: req.mobile } },
              { upsert: true },
              (err, result5) => {
                if (err) {
                  console.log("insert4 error ");
                  client.close();
                } else {
                  console.log("insert4", result5);
                  // client.close();
                }
              }
            );

            db.collection("transaction_history")
              .find({ mobile: req.mobile })
              .toArray(function (err, result) {
                if (err) {
                  console.log("1 Error finding:");
                  // socket.emit('account result', msg);
                  client.close();
                } else {
                  if (result[0].bank_history.length > 0) {
                    console.log("result1", result);

                    const unique = [];
                    history.map(x => unique.filter(a => a.Account_No == x.Account_No && a.Holder_Name == x.Holder_Name).length > 0 ? null : unique.push(x));
                                      
                    socket.emit("transaction_history", { success: unique ,mobile:result[0].mobile});
                  } else {
                    socket.emit("transaction_history", {
                      failed: "No Transaction History",
                    });
                    console.log("result2", result);
                  }
                  client.close();
                }
              });
          }
        });
    });
  });

// individual payment history
  socket.on("Individual_Payment_History", (req) => {
  client.connect().then((client) => {
    var db = client.db("eaglepay");
    console.log("connected db",req);


  db.collection("transaction_history")
    .find({ mobile: req.mobile , "bank_history.Account_No":req.Account_No})
    .toArray(function (err, result) {
      if (err) {
        console.log("1 Error finding:");
        // socket.emit('account result', msg);
        client.close();
      } else {
        if (result.length > 0) {
          let arr = []
          result[0].bank_history.forEach(ele => {
            if(ele.Account_No == req.Account_No){
              arr.push(ele)
            }
          });
          console.log("result111", arr);
          // let res = {Account_No:result.Account_No,Bank_Name:result.Bank_Name,Holder_Name:result.Holder_Name,IFSC_Code:result.IFSC_Code}
          socket.emit("Individual_Payment_History", { success: arr });
        } else {
          socket.emit("Individual_Payment_History", {
            failed: "No Transaction History",
          });
          console.log("result222", result);
        }
        client.close();
      }
    });
  });
  });



});

server.listen(3000, function () {
  console.log("listening on *:3000");
});
