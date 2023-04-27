import express from 'express';
import {Artist} from '../models/artista';
import {Song} from '../models/cancion';
import {Playlist} from '../models/playlist';

export const deleteRouter = express.Router();

/**
 * Eliminar un artista mediante query string
 */
deleteRouter.delete('/artist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  try {
    const artist = await Artist.findOneAndDelete({name: req.query.name.toString()});

    if (!artist) {
      return res.status(404).send();
    }

    return res.send(artist);
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Eliminar un artista mediante un parámetro
 */
deleteRouter.delete('/artist/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);

    if (!artist) {
      return res.status(404).send();
    }

    return res.send(artist);
  } catch (error) {
    return res.status(400).send();
  }
});

/**
 * Eliminar una cancion mediante query string
 */
deleteRouter.delete('/song', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }

  try {
    const song = await Song.findOneAndDelete({title: req.query.title.toString()});

    if (!song) {
      return res.status(404).send();
    }

    return res.send(song);
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Eliminar una cancion mediante un parámetro
 */
deleteRouter.delete('/song/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).send();
    }

    return res.send(song);
  } catch (error) {
    return res.status(400).send();
  }
});

/**
 * Eliminar una playlist mediante query string
 */
deleteRouter.delete('/playlist', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A title must be provided',
    });
  }

  try {
    const playlist = await Playlist.findOneAndDelete({title: req.query.title.toString()});

    if (!playlist) {
      return res.status(404).send();
    }

    return res.send(playlist);
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * Eliminar una playlist mediante un parámetro
 */
deleteRouter.delete('/playlist/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);

    if (!playlist) {
      return res.status(404).send();
    }

    return res.send(playlist);
  } catch (error) {
    return res.status(400).send();
  }
});
