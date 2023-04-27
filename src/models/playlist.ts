import {Document, model, Schema} from 'mongoose';

/**
 * Interfaz de una playlist
 */
interface PlaylistDocumentInterface extends Document {
  title: string,
  songs: string[],
  duration?: number,
  genres:string[]
}

/**
 * Esquema de una playlist de mongoose
 */
const PlaylistSchema = new Schema<PlaylistDocumentInterface>({
  title: {
    type: String,
    required: [true, 'La playlist debe tener un título'],
    unique: true,
  },
  songs: {
    type: [String],
    required: [true, 'Deben haber canciones dentro de la playlist'],
  },
  duration: {
    type: Number,
    required: false,
    default: 0,
  },
  genres: {
    type: [String],
    required: [true, 'La playlist debe tener asociada géneros musicales'],
  },
});

/**
 * Modelo de una playlist de mongoose
 */
export const Playlist = model<PlaylistDocumentInterface>('Playlist', PlaylistSchema);
