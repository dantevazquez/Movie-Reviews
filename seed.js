const prisma = require("./src/server/client");
const bcrypt = require('bcrypt');
require('dotenv').config();
const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.API_KEY);

NUM_PAGES = 50;

const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function seedMovies(page) {
  console.log(`Seeding movies for page: ${page}`);
  moviedb.discoverMovie({ page: page }).then(res => {
    let promises = res.results.map(movie => {
      return moviedb.movieCredits(movie.id).then(credits => {
        let movieObj = {
          name: movie.title,
          imgLink: 'https://image.tmdb.org/t/p/w185' + movie.poster_path,
          releaseYear: parseInt(movie.release_date.split('-')[0]), // Extract the year from the release date
          genre: genres[movie.genre_ids[0]], // This will give you an array of genre ids
          avgRating: 0 // Initialize average rating as 0
        };
        let director = credits.crew.find(person => person.job === 'Director');
        if (director) {
          movieObj.director = director.name;
        }
        // Store the movie object in the database
        return prisma.movie.create({
          data: movieObj
        });
      }).catch(console.error);
    });

    Promise.all(promises).then(() => console.log('Movies seeded successfully')).catch(console.error);
  }).catch(console.error);
}


async function main() {

  for(let i = 1; i < NUM_PAGES; i++){
    seedMovies(i);
  }
  const saltRounds = 5;

  // Seed users
  const hashedPassword1 = await bcrypt.hash('password1', saltRounds);
  const user1 = await prisma.user.create({
    data: {
      username: 'User1',
      password: hashedPassword1,
      email: 'user1@example.com',
      isAdmin: false,
    },
  });

  const hashedPassword2 = await bcrypt.hash('password2', saltRounds);
  const user2 = await prisma.user.create({
    data: {
      username: 'User2',
      password: hashedPassword2,
      email: 'user2@example.com',
      isAdmin: false,
    },
  });

  //This is important because its the initial admin account.
  //Only this account will be able to make other users admin
  const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN, saltRounds);
  const user3 = await prisma.user.create({
    data: {
      username: 'Admin',
      password: hashedAdminPassword,
      email: 'admin@example.com',
      isAdmin: true,
    },
  });

  // // Seed reviews and comments
  // const review1 = await prisma.review.create({
  //   data: {
  //     rating: 4,
  //     textBody: 'Great movie!',
  //     movieId: movie1.id,
  //     userId: user1.id,
  //   },
  // });

  // const comment1 = await prisma.comment.create({
  //   data: {
  //     textBody: 'I agree!',
  //     userId: user2.id,
  //     reviewId: review1.id,
  //   },
  // });

  // const review2 = await prisma.review.create({
  //   data: {
  //     rating: 5,
  //     textBody: 'Awesome!',
  //     movieId: movie2.id,
  //     userId: user2.id,
  //   },
  // });

  // const comment2 = await prisma.comment.create({
  //   data: {
  //     textBody: 'Totally!',
  //     userId: user1.id,
  //     reviewId: review2.id,
  //   },
  // });

  // const review3 = await prisma.review.create({
  //   data: {
  //     rating: 3,
  //     textBody: 'It was okay.',
  //     movieId: movie3.id,
  //     userId: user3.id,
  //   },
  // });

  // const comment3 = await prisma.comment.create({
  //   data: {
  //     textBody: 'I expected more.',
  //     userId: user1.id,
  //     reviewId: review3.id,
  //   },
  // });

  console.log('Seed data inserted successfully');
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })