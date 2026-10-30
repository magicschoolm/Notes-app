const db = require("../config/db");

const createNotes = async (req, res) => {
    try {
        const { note } = req.body
        if (!note) {
            return res.status(400).json({ message: "note is required" })
        }
        const user_id = req.user.id
        const date = new Date().toISOString().split("T")[0]
        const [result]=await db.query("INSERT INTO notes (user_id, note, date) VALUES (?,?,?)", [user_id, note, date])
        res.status(201).json({
            message: "note created", note_id: result.insertId
        })
    }
    catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
}


const getAllNotes = async (req, res) => {
    try {
        const user_id = req.user.id
        const [ notes ] = await db.query("SELECT * FROM notes WHERE user_id=?", [user_id])
        res.json(notes)
    }
    catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
}

const updateNotes = async (req, res) => {
    try {
        const { note } = req.body
        const user_id = req.user.id
        const note_id = req.params.id
        const [ result ] = await db.query("UPDATE notes SET note=? WHERE user_id=? AND note_id=?", [note, user_id, note_id])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "notes not found"
            })
        }
        res.json({ message: "Note updated"})
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
    }

    const deleteNotes = async (req, res) => {
    try {
        const user_id = req.user.id
        const note_id = req.params.id
        const [ result ] = await db.query("DELETE FROM notes WHERE user_id=? AND note_id=?", [user_id, note_id])
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "notes not found"
            })
        }
        res.json({ message: "Note deleted"})
    } catch (error) {
        res.status(500).json({
            message: "server error", error: error.message
        })
    }
    }

module.exports = {createNotes, getAllNotes, updateNotes, deleteNotes };