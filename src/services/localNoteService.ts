import Dexie, { type Table } from 'dexie';
import { type NoteContract, type Note } from './noteContract';

// Class-based schema definition
// TODO: use modern way from doc
class NoteDatabase extends Dexie {
  public notes!: Table<Note, number>;

  public constructor() {
    super('ScribeDB');
    this.version(1).stores({
      // Schema: '++id' for auto-incrementing primary key, 'videoId' for indexing/searching.
      notes: '++id, videoId',
    });
  }
}

const db = new NoteDatabase();

const localNoteService: NoteContract = {
  getNotes: (videoId: string) => {
    return db.notes.where('videoId').equals(videoId).toArray();
  },

  addNote: async (note: Note) => {
    const newId = await db.notes.add(note);
    return { ...note, id: newId };
  },

  updateNote: async (id: number, updates: Partial<Note>): Promise<Note> => {
    await db.notes.update(id, updates);
    const updatedNote = await db.notes.get(id);
    if (updatedNote === undefined) {
      throw new Error(`Failed to retrieve note with id ${id} after update.`);
    }
    return updatedNote;
  },

  deleteNote: (id: number) => {
    return db.notes.delete(id);
  },
};

export default localNoteService;
