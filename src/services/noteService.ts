import localNoteService from './localNoteService';
import { type NoteContract } from './noteContract';

const isUserLoggedIn = (): boolean => {
  // Future: checking if a JWT exists etc
  return false;
};

const noteService: NoteContract = isUserLoggedIn()
  ? {} as NoteContract // Future: apiNoteService etc etc
  : localNoteService;

export default noteService;
