export interface Note {
  id?: number;
  videoId: string;
  content: string;
  timestamp: number;
}

export interface NoteContract {
  getNotes(videoId: string): Promise<Note[]>;
  addNote(note: Note): Promise<Note>;
  updateNote(id: number, updates: Partial<Note>): Promise<number>;
  deleteNote(id: number): Promise<void>;
}
