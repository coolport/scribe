import localNoteService from './localNoteService';
import { type NoteContract } from './noteContract';
import createApiNoteService from './apiNoteService'; // Import createApiNoteService

// This function will return the appropriate note service based on authentication status
export const getNoteService = (isAuthenticated: boolean, jwt: string | null): NoteContract => {

  if (isAuthenticated && jwt) {
    return createApiNoteService({ jwt });
  } else {
    return localNoteService;
  }
};
