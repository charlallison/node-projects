const fs = require('fs')

const getNotes = function() {
    return 'My Notes'
}

const addNote = function(title, body)  {
    const notes = loadNotes()
    notes.push({
        title: title,
        body: body
    })

    saveNotes(notes)
}

const saveNotes = function(notes) {
    fs.writeFileSync('notes.json', JSON.stringify(notes))
}

const loadNotes = function() {
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
    addNote: addNote
}