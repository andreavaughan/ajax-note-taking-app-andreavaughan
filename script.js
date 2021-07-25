const url = 'http://localhost:3000/notes'
const form = document.getElementById('notes-form')
const notesList = document.getElementById('notes-list')

//Event Listeners

form.addEventListener('submit', function (e){
    e.preventDefault()
    const noteEntry = document.getElementById('note-entry').value
    createNote(noteEntry)
    form.reset()
})

notesList.addEventListener('click', function (event){
    let target = event.target
    let parentListItem = target.parentElement.parentElement.parentElement
    if (target.classList.contains('delete')) {
        //console.log(parentListItem)
        deleteNote(parentListItem)

    } if (target.classList.contains('fa-edit')) {
        let editInputField = document.createElement()
        parentListItem.appendChild
        updateNote(target)
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
    noteTextItem.innerHTML = `<span class="content test-class">${noteObj.body}</span><button class="button"><span class="icon"><i class="delete"></i></span></button><button class="button"><span class="icon"><i class="fas fa-edit"></i></span></button>`
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
    const noteId = element.id
    fetch(url + '/' + `${noteId}`, {
        method: 'Delete'
    }).then(() => element.remove())
}

function updateNote (element) {
    const listItemElement = element.parentElement.parentElement.parentElement
    const noteId = listItemElement.id
    console.log(noteId)
    const noteText = document.getElementById('note-entry').value
    console.log(noteText)
    fetch(url + '/' + `${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
            title: noteText,
            body: noteText,
            updated_at: moment().format()
        })
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            renderNoteText(listItemElement, data)
        })
}