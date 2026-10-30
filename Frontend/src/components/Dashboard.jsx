
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes",
        { withCredentials: true }
      );

      setNotes(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateOrUpdateNotes = async () => {
    if (!note.trim()) {
      setError("Please enter a note");
      return;
    }

    try {
      setError("");

      if (editingNoteId !== null) {
        await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          { note },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/notes",
          { note },
          { withCredentials: true }
        );
      }

      setNote("");
      setEditingNoteId(null);
      await fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to save note");
    }
  };

  const handleEditNote = (selectedNote) => {
    setNote(selectedNote.note);
    setEditingNoteId(selectedNote.note_id);
    setError("");
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `http://localhost:5000/api/notes/${id}`,
        { withCredentials: true }
      );

      await fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Your workspace</p>
            <h1 className="dashboard-title">My Notes</h1>
            {error && <p className="error">{error}</p>}
          </div>
        </header>

        <section className="note-composer" aria-label="Create a note">
          <label className="note-label" htmlFor="new-note">
            {editingNoteId !== null ? "Edit note" : "New note"}
          </label>

          <textarea
            className="note-input"
            id="new-note"
            placeholder="Write something worth remembering..."
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="note-composer-footer">
            <span className="note-hint">
              Your thoughts, kept in one place.
            </span>

            <button
              onClick={handleCreateOrUpdateNotes}
              className="note-create-button"
              type="button"
            >
              {editingNoteId !== null ? "Update Note" : "Create Note"}
            </button>

            {editingNoteId !== null && (
              <button
                type="button"
                onClick={() => {
                  setNote("");
                  setEditingNoteId(null);
                  setError("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="notes-list" aria-label="Saved notes">
          {notes.length > 0 ? (
            notes.map((item) => (
              <article className="note-card" key={item.note_id}>
                <div className="note-card-header">
                  <h2>{item.note}</h2>

                  <div className="note-actions">
                    <button
                      className="note-action"
                      type="button"
                      onClick={() => handleEditNote(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="note-action note-action-delete"
                      type="button"
                      onClick={() => handleDeleteNote(item.note_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {item.date && (
                  <time className="note-date">
                    {item.date}
                  </time>
                )}
              </article>
            ))
          ) : (
            <p>No notes yet. Create your first note!</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;