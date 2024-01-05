const express = require("express");
const router = express.Router();
const prisma = require("../client");
const {verify} = require("../util");

// GET /api/movies
router.get("/", async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany();
    res.status(200).send(movies);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

router.get('/:id', async (req, res) => {
  const movieId = parseInt(req.params.id);

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    res.status(200).set('Content-Type', 'application/json').send(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post("/", verify, async (req, res, next) => {
  const { name, genre, releaseYear, director, imgLink } = req.body;

  try {
      const movie = await prisma.movie.create({
          data: {
              name,
              genre,
              releaseYear,
              director,
              imgLink,
              avgRating: 0,
          },
      });

      res.status(201).send(movie);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//DELETE api/movies/id
router.delete("/:id", verify, async (req, res, next) => {
  const movieId= parseInt(req.params.id);

  //check if the movie to delete exists
  try{
    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!existingMovie) {
      return res.status(404).json({ error: 'Movie not found'});
    }

    //check is the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized'});
    }
    
    //Delete the movie
    await prisma.movie.delete({
      where: { id: movieId},
    });

    res.status(200).json('Movie deleted');
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;
