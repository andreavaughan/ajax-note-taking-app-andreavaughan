const url = 'http://localhost:3000/notes'
const form = document.getElementById('notes-form')
const notesList = document.getElementById('notes-list')

//Event Listeners

form.addEventListener('submit', function (e){
    e.preventDefault()
    const noteEntry = document.getElementById('note-entry').value
    console.log(noteEntry)
    createNote(noteEntry)
    form.reset()
})

notesList.addEventListener('click', function (e){
    if (e.target.classList.contains('delete')) {
        deleteNote(e.target)
    }

    if (e.target.classList.contains('edit')) {
        updateTodo(e.target)
        form.reset()
    }
})


function renderNoteItem (noteObj) {
    const noteListItem = document.createElement('li')
    noteListItem.id = noteObj.id
    noteListItem.classList.add('note-item')
    renderNoteText(noteListItem, noteObj)
    console.log(noteListItem)
    notesList.appendChild(noteListItem)
}

function renderNoteText (noteTextItem, noteObj) {
    console.log(noteObj)
    noteTextItem.innerHTML = `<span class="content test-class">${noteObj.body}</span><i class="delete"></i><i class="edit"></i>`
}


function listNotes() {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            for (const note of data){
                renderNoteItem(note)
            } 
        })
}

listNotes()

function createNote(noteEntry) {
    fetch(url, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: noteEntry,
            body: noteEntry,
            create_at: moment().format()
        })
    })
        .then (response => response.json())
        .then (data => renderNoteItem(data))
}

function deleteNote(element) {
    const noteId = element.parentElement.id
    fetch(url + '/' + `${noteId}`, {
        method: 'Delete'
    }).then(() => element.parentElement.remove())
}