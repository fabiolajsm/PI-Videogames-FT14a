require("dotenv").config();
const axios = require("axios");
const { Videogame, Genre, Platform } = require('../db');  // Genre para el nuevo modelo de genre en el newGame.
let { ONEHUNDRED } = require('./videogames')

// Los campos mostrados en la ruta principal para cada videojuegos (imagen, nombre, y géneros)
// Descripción
// Fecha de lanzamiento
// Rating
// Plataformas

const getGamebyId = async (req, res, _next) => {
    let { id } = req.params
    let results = await ONEHUNDRED()
    if (id && typeof id === 'string') {
        let filter = results.filter(e => e.id == id)
        return filter.length > 0 ? res.send(filter) : res.status(404).send(`Sorry! There's no game that match`)
    }
    else {
        return res.status(404).send(`There's no id.`)
    }
};

// POST /videogame:
// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de videojuego por body
// Crea un videojuego en la base de datos
// del front :Ruta de creación de videojuegos: debe contener
//  Un formulario controlado con los siguientes campos
//  Nombre
//  Descripción
//  img 
//  Fecha de lanzamiento
//  Rating

const addGame = async (req, res, _next) => {
    const { name, description, img, releaseDate, rating, platforms, genres } = req.body
    try {
        let exists = await Videogame.findOne({ where: { name: name }, include: Genre })
        if (exists) return res.send('That videogame already exists, try adding another!')
        const newGame = await Videogame.create({
            name: name,
            description: description,
            img: img,
            releaseDate: releaseDate,
            rating: rating,
        })
        let g = genres.map(e => {
            return { name: e };
        })
        let p = platforms.map(e => {
            return { name: e };
        })
        var newGenres = await Genre.bulkCreate(g)
        var newPlatform = await Platform.bulkCreate(p)
        await newGame.setGenres(newGenres);
        await newGame.setPlatforms(newPlatform);
        let game = await Videogame.findOne({ where: { name: name }, include: [Platform, Genre] })
        return res.json(game)
    }
    catch (err) {
        next(err)
    }
};

module.exports = {
    getGamebyId,
    addGame
};