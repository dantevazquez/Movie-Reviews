const express = require("express");
const router = express.Router();
const prisma = require("../client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  //if username or password is not valid return
  if (!username || !password) {
    res.status(401).send({ message: "Incorrect username or password" });
    return;
  }

  try {
    //look for username in database
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(401).send({ message: "User not found" });
      return;
    }

    //check if password matches the encrypted password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).send({ message: "Not authorized!" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );

    res.status(200).send({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});


router.post("/register", async (req, res, next) => {
  
  const { username, password, email } = req.body;

  //check if a user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: email },
      ],
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  //User doesnt exist so create a new user
  const SALT_ROUNDS = 5;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        isAdmin: false,
      },
    });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    )
    res.status(201).send({ token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;