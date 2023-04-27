import {Document, Schema, model} from 'mongoose';

/**
 * Interfaz de una canción
 */
export interface SongDocumentInterface extends Document {
  title: string,
  artist: string,
  duration?: number,
  gender: string[],
  single?: boolean,
  totalViews?: number
}

/**
 * Esquema de una canción de mongoose
 */
const SongSchema = new Schema<SongDocumentInterface>({
  title: {
    type: String,
    unique: true,
    required: [true, 'La cancion debe tener un titulo'],
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('The title of the song must start with a capital letter');
      }
    },
  },
  artist: {
    type: String,
    required: [true, 'La canción debe tener artistas que la cantan'],
    trim: true,
  },
  duration: {
    type: Number,
    required: false,
    trim: true,
    min: 0,
    max: 20,
  },
  gender: {
    type: [String],
    required: [true, 'La cancion debe tener mínimo un género asociado'],
    trim: true,
  },
  single: {
    type: Boolean,
    required: false,
    trim: true,
    default: true,
  },
  totalViews: {
    type: Number,
    required: false,
    trim: true,
    default: 0,
  },
});

/**
 * Modelo de una cancion de mongoose
 */
export const Song = model<SongDocumentInterface>('Song', SongSchema);
