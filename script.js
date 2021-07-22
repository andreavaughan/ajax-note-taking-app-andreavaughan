const url = 'http://localhost:3000/notes/'
const form = document.getElementById('notes-form')
const notesList = document.getElementById('notes-list')

form.addEventListener('submit', function (e){
    e.preventDefault()
    const noteEntry = document.getElementById('note-entry').value
    console.log(noteEntry)
})