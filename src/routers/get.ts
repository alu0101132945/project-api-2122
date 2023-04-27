import express from 'express';
import {Artist} from '../models/artista';
import {Song} from '../models/cancion';
import {Playlist} from '../models/playlist';


export const getRouter = express.Router();

/**
 * Consulta de un artista mediante query string
 */
getRouter.get('/artist', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const artist = await Artist.find(filter);
    if (artist.length !== 0) {
      return res.send(artist);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Consulta de un artista mediante un parámetro
 */
getRouter.get('/artist/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).send();
    }

    return res.send(artist);
  } catch (error) {
    return res.status(500).send();
  }
});


/**
 * Consulta de una cancion mediante query string
 */
getRouter.get('/song', async (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};

  try {
    const song = await Song.find(filter);
    if (song.length !== 0) {
      return res.send(song);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Consulta de una cancion mediante un parámetro
 */
getRouter.get('/song/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send();
    }

    return res.send(song);
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Consulta de una playlist mediante query string
 */
getRouter.get('/playlist', async (req, res) => {
  const filter = req.query.title?{title: req.query.title.toString()}:{};

  try {
    const playlist = await Playlist.find(filter);
    if (playlist.length !== 0) {
      return res.send(playlist);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Consulta de una playlist mediante un parámetro
 */
getRouter.get('/playlist/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).send();
    }

    return res.send(playlist);
  } catch (error) {
    return res.status(500).send();
  }
});
