import { type NoteContract, type Note } from "./noteContract";

interface ApiNoteServiceProps {
  jwt: string | null;
}

const createApiNoteService = ({ jwt }: ApiNoteServiceProps): NoteContract => ({
  getNotes: async (videoId: string) => {
    if (!jwt) {
      throw new Error("Not authenticated.");
    }
    const response = await fetch(`http://localhost:8080/api/notes`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch notes from API.");
    }
    const allNotes: Note[] = await response.json();
    return allNotes.filter(note => note.videoId === videoId);
  },

  getAllNotes: async () => {
    if (!jwt) {
      throw new Error("Not authenticated.");
    }
    const response = await fetch("http://localhost:8080/api/notes", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch all notes from API.");
    }
    return response.json();
  },

  addNote: async (note: Note) => {
    if (!jwt) {
      throw new Error("Not authenticated.");
    }
    const response = await fetch("http://localhost:8080/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(note),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Response:", errorBody);
      throw new Error("Failed to add note via API.");
    }
    const newId = await response.json();
    return { ...note, id: newId };
  },

  updateNote: async (id: number, updates: Partial<Note>) => {
    if (!jwt) {
      throw new Error("Not authenticated.");
    }
    const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update note via API.");
    }
    // Assuming the API returns the updated note or a success status
    // For now, we'll just return a dummy updated note
    return { id, ...updates } as Note;
  },

  deleteNote: async (id: number) => {
    if (!jwt) {
      throw new Error("Not authenticated.");
    }
    const response = await fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete note via API.");
    }
  },
});

export default createApiNoteService;
