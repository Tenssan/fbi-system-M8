const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const { results: agentes } = require("./data/agentes");
require("dotenv").config();

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ".")));

app.post("/SignIn", (req, res) => {
  const { email, password } = req.body;
  const agent = agentes.find(
    (a) => a.email === email && a.password === password
  );

  if (agent) {
    const token = jwt.sign({ email: agent.email }, SECRET_KEY, {
      expiresIn: "2m",
    });
    console.log("Token created:", token);

    const expiresAt = Math.round(Date.now() / 1000) + 120;
    const expiresInSec = expiresAt - Math.floor(Date.now() / 1000);

    res.status(200).send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <link rel="stylesheet" href="/style.css">
            <title>Welcome</title>
          </head>
          <body class="bg-dark text-white">
            <div class="container text-center mt-5">
              <h2>Welcome: ${agent.email}</h2>
              <p>Click on the button before<span id="countdown">${expiresInSec}</span> seconds or lose access privileges</p>
              <button class="btn btn-primary" onclick="accessRestrictedRoute('${token}')">Go to restricted route</button>
            </div>
            <script>
              sessionStorage.setItem('token', '${token}');
              let countdownInterval;
              function accessRestrictedRoute(token) {
                clearInterval(countdownInterval);
                const url = '/restricted?token=' + token;
                window.location.href = url;
              }
              function startCountdown() {
                const countdownElement = document.getElementById('countdown');
                let expiresInSec = ${expiresInSec};
                countdownInterval = setInterval(() => {
                  countdownElement.textContent = expiresInSec;
                  expiresInSec--;
                  if (expiresInSec < 0) {
                    clearInterval(countdownInterval);
                    countdownElement.textContent = '0';
                    document.querySelector('p').textContent = 'Token has expired.';
                  }
                }, 1000);
              }
              startCountdown();
            </script>
          </body>
        </html>
      `);
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/restricted", (req, res) => {
  const token = req.query.token;
  console.log("Token received:", token);

  if (!token) {
    console.error("No token provided");
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token verified for email:", decoded.email);
    res.status(200).send(`
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <link rel="stylesheet" href="/style.css">
            <title>Restricted Area</title>
          </head>
          <body class="bg-dark text-white">
            <div class="container text-center mt-5">
              <h1>Welcome: ${decoded.email}</h1>
              <p>You're in the restricted FBI route</p>
              <a href="/" class="btn btn-primary">Return to home</a>
            </div>
          </body>
        </html>
      `);
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(400).send("Invalid token.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
