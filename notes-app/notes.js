const fs = require('fs')
const chalk = require('chalk');
const { Console } = require('console');

const listNotes = () => {
    const notes = loadNotes();
    if(notes.length > 0) {
        console.log(chalk.bold.inverse("Your notes"))
        notes.forEach(note => console.log(note.title))
    }
}

const addNote = (title, body) => {
    const notes = loadNotes()

    const duplicatNote = notes.find(note => title === note.title)

    if(!duplicatNotes) {
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

const readNote = title => {
    const notes = loadNotes()
    const note = notes.find(note => note.title === title)
    
    if(!note) { // or noteToRead === undefined
        console.log(chalk.red.inverse('Note not found'))
    } else {
        console.log(chalk.bold.inverse(note.title))
        console.log(note.body)
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
    listNotes: listNotes,
    readNote: readNote,
    addNote: addNote,
    removeNote: removeNote
}