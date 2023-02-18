const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const creds = require("./config");

const app = express();
const router = express.Router();

const transport = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: creds.USER,
    pass: creds.APP_PASS,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/secure-route", (req, res, next) => {
  const { name, email, message } = req.body;

  const content = `<div>
                    <b>Name: </b>${name}<br/>
                    <b>Email: </b>${email}<br/>
                    <b>Message: </b>${message}
                  </div>`;

  const mail = {
    from: {
      name,
      address: email,
    },
    to: creds.RECEIVER,
    subject: `Message from ${name} via Contact Form`,
    replyTo: email,
    text: `${message} | Sent from: ${email} name: ${name}`,
    html: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

app.use(cors());
app.use(express.json());

// // Create GET request
// app.get("/", (req, res) => {
//   res.send("Express on Vercel");
// });

app.use("/", router);

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
