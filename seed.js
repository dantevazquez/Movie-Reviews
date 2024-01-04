const prisma = require("./src/server/client");
const bcrypt = require('bcrypt');

async function main() {

  const saltRounds = 5;
  const movie1 = await prisma.movie.create({
    data: {
      name: 'Movie 1',
      genre: 'Action',
      releaseYear: 2020,
      director: 'Director 1',
      imgLink: 'https://example.com/image1.jpg',
      avgRating: 0,
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      name: 'Movie 2',
      genre: 'Drama',
      releaseYear: 2019,
      director: 'Director 2',
      imgLink: 'https://example.com/image2.jpg',
      avgRating: 0,
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      name: 'Movie 3',
      genre: 'Comedy',
      releaseYear: 2021,
      director: 'Director 3',
      imgLink: 'https://example.com/image3.jpg',
      avgRating: 0,
    },
  });

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

  const hashedAdminPassword = await bcrypt.hash('admin123', saltRounds);
  const user3 = await prisma.user.create({
    data: {
      username: 'Admin',
      password: hashedAdminPassword,
      email: 'admin@example.com',
      isAdmin: true,
    },
  });

  // Seed reviews and comments
  const review1 = await prisma.review.create({
    data: {
      rating: 4,
      textBody: 'Great movie!',
      movieId: movie1.id,
      userId: user1.id,
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      textBody: 'I agree!',
      userId: user2.id,
      reviewId: review1.id,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      rating: 5,
      textBody: 'Awesome!',
      movieId: movie2.id,
      userId: user2.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      textBody: 'Totally!',
      userId: user1.id,
      reviewId: review2.id,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      rating: 3,
      textBody: 'It was okay.',
      movieId: movie3.id,
      userId: user3.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      textBody: 'I expected more.',
      userId: user1.id,
      reviewId: review3.id,
    },
  });

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