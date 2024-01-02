const express = require("express");
const router = express.Router();
const prisma = require("../client");

// GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});



module.exports = router;
