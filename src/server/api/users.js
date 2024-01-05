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

// GET /api/users/:id
router.get("/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Use prisma.user.findUnique to retrieve a user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//////////////////////////////
// GET /api/users/:id/reviews
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Use prisma.review.findMany to retrieve a user's reviews by ID
    const userReviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).send(userReviews);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// GET /api/users/:id/comments
router.get("/:id/comments", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    // Use prisma.comment.findMany to retrieve a user's comments by ID
    const userComments = await prisma.comment.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).send(userComments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
