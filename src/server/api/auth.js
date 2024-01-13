const express = require("express");
const router = express.Router();
const prisma = require("../client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {verify} = require("../util");


//POST auth/login
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
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.status(200).send({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

//POST auth/register
router.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;

  // Input validation
  if (!username || !password || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if a user exists
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

  // User doesn't exist so create a new user
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
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
    res.status(500).json({ error: "Server error" });
  }
});


// POST auth/make-admin
//Only the admin seeded has access to this call initially
router.post("/make-admin/:id", verify, async (req, res, next) => {
  const userId = parseInt(req.params.id);

  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized. Only admins can make users admin.' });
    }

    // Check if the user to be made admin exists
    const userToMakeAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToMakeAdmin) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Make the user admin
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;