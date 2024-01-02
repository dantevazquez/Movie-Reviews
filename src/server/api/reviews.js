const express = require("express");
const router = express.Router();
const prisma = require("../client");
const {verify} = require("../util");


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
                        user: true, // Include user details for each review
                        comments: true // Include comments for each review
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
      include: { user: true } // Include user details for each comment
    });

    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

//POST /api/reviews/id
router.post("/:id", verify, async (req, res, next) => {
    const { rating, textBody, userId } = req.body;
    const movieId = parseInt(req.params.id);
  
    try {
      // Check if the movie exists
      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
      });
  
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      // Create a new review in the database
      const newReview = await prisma.review.create({
        data: {
          rating,
          textBody,
          movie: { connect: { id: movieId } },
          user: { connect: { id: userId } },
        },
      });
  
      // Return the newly created review
      res.status(201).json(newReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });




module.exports = router;
