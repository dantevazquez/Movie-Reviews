const express = require("express");
const router = express.Router();
const prisma = require("../client");
const { verify } = require("../util");


// GET /api/reviews
router.get("/", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany();
    res.status(200).send(reviews);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }

});

//GET /api/reviews/id
router.get("/:id", async (req, res, next) => {
  const movieId = parseInt(req.params.id);

  try {
    // Retrieve the movie with its reviews
    const movieWithReviews = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        reviews: {
          include: {
            user: true,
            comments: true 
          }
        }
      }
    });

    if (!movieWithReviews) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movieWithReviews.reviews);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
});

//GET /api/reviews/id/comments
router.get('/:id/comments', async (req, res) => {
  const reviewId = parseInt(req.params.id);

  try {
    const comments = await prisma.comment.findMany({
      where: { reviewId },
      include: { user: true }
    });

    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

//This router posts review for a movie, if the movie is 
//GET /api/reviews/id
router.post("/:id", verify, async (req, res, next) => {
  const { rating, textBody } = req.body;
  const movieId = parseInt(req.params.id);
  const userId = req.user.id; // Extract user ID from the token

  try {
    // Check if the movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if the user has already reviewed the movie
    const existingReview = await prisma.review.findFirst({
      where: {
        movieId: movieId,
        userId: userId,
      },
    });

    // If a review already exists, update it instead of creating a new one
    if (existingReview) {
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          textBody,
        },
      });
      res.status(200).json(updatedReview);
    } else {
      // Create a new review in the database
      const newReview = await prisma.review.create({
        data: {
          rating,
          textBody,
          movie: { connect: { id: movieId } },
          user: { connect: { id: userId } },
        },
      });
      res.status(201).json(newReview);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;
