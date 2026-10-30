const express = require("express")
const {createNotes, getAllNotes, updateNotes, deleteNotes } = require("../controllers/notesControllers")
const auth = require("../middleware/auth")



const router = express.Router()
router.post ("/", auth, createNotes)
router.get ("/", auth, getAllNotes)
router.put ("/:id", auth, updateNotes)
router.delete ("/:id", auth, deleteNotes)
module.exports = router