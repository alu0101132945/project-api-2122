import express from 'express';
import {Artist} from '../models/artista';
import {Song} from '../models/cancion';
import {Playlist} from '../models/playlist';

export const patchRouter = express.Router();

/**
 * Actualización de un artista mediante query string
 */
patchRouter.patch('/artist', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  const allowedUpdates = ['name', 'genre', 'songs', 'oyentes'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const artist =
    await Artist.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!artist) {
      return res.status(404).send();
    }

    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualización de un artista mediante un parámetro
 */
patchRouter.patch('/artist/:id', async (req, res) => {
  const allowedUpdates = ['name', 'genre', 'songs', 'oyentes'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!artist) {
      return res.status(404).send();
    }

    return res.send(artist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualización de una cancion mediante query string
 */
patchRouter.patch('/song', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  const allowedUpdates = ['title', 'artist', 'duration', 'gender', 'single', 'totalViews'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const song =
    await Song.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).send();
    }

    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualización de una cancion mediante un parámetro
 */
patchRouter.patch('/song/:id', async (req, res) => {
  const allowedUpdates = ['title', 'artist', 'duration', 'gender', 'single', 'totalViews'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).send();
    }

    return res.send(song);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualización de una playlist mediante query string
 */
patchRouter.patch('/playlist', async (req, res) => {
  if (!req.query.title) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  const allowedUpdates = ['title', 'songs', 'duration', 'genres'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const playlist =
    await Playlist.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
      new: true,
      runValidators: true,
    });

    if (!playlist) {
      return res.status(404).send();
    }

    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Actualización de una playlist mediante un parámetro
 */
patchRouter.patch('/playlist/:id', async (req, res) => {
  const allowedUpdates = ['title', 'songs', 'duration', 'genres'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!playlist) {
      return res.status(404).send();
    }

    return res.send(playlist);
  } catch (error) {
    return res.status(400).send(error);
  }
});
