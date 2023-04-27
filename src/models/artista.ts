import {Document, Schema, model} from 'mongoose';

/**
 * Interfaz de un artista
 */
interface ArtistDocumentInterface extends Document {
  name: string,
  genre: string[],
  songs: string[],
  oyentes?: number
}

/**
 * Esquema de un artista de mongoose
 */
const ArtistSchema = new Schema<ArtistDocumentInterface>({
  name: {
    type: String,
    unique: true,
    required: [true, 'El artista debe tener un nombre'],
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('The name of the artist must start with a capital letter');
      }
    },
  },
  genre: {
    type: [String],
    required: [true, 'El artista debe tener géneros musicales asociados'],
    trim: true,
  },
  songs: {
    type: [String],
    required: [true, 'El artista debe tener canciones'],
    trim: true,
  },
  oyentes: {
    type: Number,
    trim: true,
    default: 0,
  },
});

/**
 * Modelo de un artista de mongoose
 */
export const Artist = model<ArtistDocumentInterface>('Artist', ArtistSchema);
