export interface Note {
  id?: number;
  videoId: string;
  content: string;
  timestamp: number;
}

export interface NoteContract {
  getNotes(videoId: string): Promise<Note[]>;
  getAllNotes(): Promise<Note[]>;
  addNote(note: Note): Promise<Note>; //dexie returns id(pkey) of new record/note
  //TODO: update signature to <Note> then handle localService
  //better sig for when the api service is here
  updateNote(id: number, updates: Partial<Note>): Promise<Note>; //returns no. of records updated (1/0)
  deleteNote(id: number): Promise<void>;
}
