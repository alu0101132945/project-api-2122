import express from 'express';
import {Artist} from '../models/artista';
import {Song} from '../models/cancion';
import {Playlist} from '../models/playlist';


export const postRouter = express.Router();

/**
 * Creacion de un artista
 */
postRouter.post('/artist', async (req, res) => {
  const artist = new Artist(req.body);

  try {
    await artist.save();
    return res.status(201).send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Creacion de una cancion
 */
postRouter.post('/song', async (req, res) => {
  const song = new Song(req.body);

  try {
    await song.save();
    return res.status(201).send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Creacion de una playlist
 */
postRouter.post('/playlist', async (req, res) => {
  const playlist = new Playlist(req.body);

  try {
    await playlist.save();
    return res.status(201).send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

