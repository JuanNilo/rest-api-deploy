const express = require("express");
const crypto = require("node:crypto")
const movies = require("./movies.json");
const app = express();

app.disable("x-powered-by");

const ACCEPTED_ORIGINS = [
  'http://192.168.1.118:8080',
  "http://localhost:8082",
  'https://juannilo.com'
]

app.use(express.json())
app.get("/", (req, res) => {
  res.json({ message: "Hola mundo" });
});

// Devolver todas las peliculas
app.get("/movies", (req, res) => {
  // Evitar problema de cors
  const origin = req.header('origin')
  if(ACCEPTED_ORIGINS.includes(origin) ){
    res.header('Access-Control-Allow-Origin',origin )
  }

  const { genre} = req.query;
if(genre){
    const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
}

  res.json(movies);
});

// Devolver pelicula por id
app.get("/movies/:id", (req, res) => {
  
  // Path-to-reqex
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: "Movie not found" });
});

app.post('/movies',(req, res) =>{
  const { title, genre, year, director, duration, rate, poster } = req.body
  const newMovie = {
    id: crypto.randomUUID,
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster
  }
  movies.push(newMovie)

  res.status(201).json(newMovie)
})


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log("Server Listening");
});
