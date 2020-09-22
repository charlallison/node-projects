const fs = require('fs')
const chalk = require('chalk')

const getNotes = () => {
    return "All your notes..."
}

const addNote = (title, body) => {
    const notes = loadNotes()

    const duplicatNotes = notes.filter(note => title === note.title)

    if(duplicatNotes.length === 0) {
        notes.push({
            title: title,
            body: body
        })
        saveNotes(notes)
        console.log(chalk.green.bold('Note saved.'))
    } else {
        console.log(chalk.red.bold('Error: Note title already taken'))
    }
}

const removeNote = title => {
    const notes = loadNotes()
    const newNotes = notes.filter(note => title !== note.title)

    if(newNotes.length === 0) {
        console.log(chalk.red.bold('Error: Note not found.'))
    } else {        
        saveNotes(newNotes)
        console.log(chalk.bgRed.green.bold('Note removed'))
    }
}

const saveNotes = notes => fs.writeFileSync('notes.json', JSON.stringify(notes))

const loadNotes = _ => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch(e) {
        return []
    }
}

module.exports = {
    getNotes: getNotes,
    addNote: addNote,
    removeNote: removeNote
}