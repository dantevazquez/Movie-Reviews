const express = require("express");
const router = express.Router();
const prisma = require("../client");
const {verify} = require("../util");


// GET /api/comments
router.get("/", async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

//POST /api/comments/id
router.post("/:id", verify, async (req, res, next) => {
  const { textBody, userId } = req.body;
  const reviewId = parseInt(req.params.id);

  try {
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Create a new comment in the database
    const newComment = await prisma.comment.create({
      data: {
        textBody,
        user: { connect: { id: userId } },
        review: { connect: { id: reviewId } },
      },
    });

    // Return the newly created comment
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
