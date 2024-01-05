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

//GET api/reviews/get-review/review id
router.get('/get-review/:reviewId', async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: true,
        comments: true,
        movie: true,
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

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

//Helper function for updateMovieAverageRating
//Looks at the reviews and calculates the average rating of the movie
function calculateAverageRating(reviews) {
  if (reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
}

//helper function for POST api/reviews/movie-id
const updateMovieAverageRating = async (movieId) => {
  const reviews = await prisma.review.findMany({
    where: { movieId },
  });

  const avgRating = calculateAverageRating(reviews);

  await prisma.movie.update({
    where: { id: movieId },
    data: { avgRating },
  });
};

//POST api/reviews/movie-id
router.post("/:id", verify, async (req, res, next) => {
  const { rating, textBody } = req.body;
  const movieId = parseInt(req.params.id);
  const userId = req.user.id;

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

    if (existingReview) {
      // If review exists, just update
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          textBody,
        },
      });

      // Update the movie's average rating
      await updateMovieAverageRating(movieId);

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

      // Update the movie's average rating
      await updateMovieAverageRating(movieId);

      res.status(201).json(newReview);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete api/reviews/review ID
//this function deletes a review and its comments

router.delete('/:reviewId', verify, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);

  //Check if the review to delete exists
  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { comments: true },
    });

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if requester is the owner of the review or an admin
    if (existingReview.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 
        'Unauthorized. You do not have permission to delete this review.'});
    }

    // Delete the comments inside the review
    const deleteComments = prisma.comment.deleteMany({
      where: { reviewId },
    });

    // Delete the review
    const deleteReview = prisma.review.delete({
      where: { id: reviewId },
    });

    //had to add this in order to perform multiple delete queries
    await prisma.$transaction([deleteComments, deleteReview]);

    res.status(200).json("Succesfully delete Review and its assocaited comments");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
