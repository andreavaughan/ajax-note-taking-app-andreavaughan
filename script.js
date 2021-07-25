const url = 'http://localhost:3000/notes'
const form = document.getElementById('notes-form')
const notesList = document.getElementById('notes-list')
const noteItem = document.querySelector('note-item')


//Event Listeners

form.addEventListener('submit', function (event){
    event.preventDefault()
    const noteEntry = document.getElementById('note-entry').value
    createNote(noteEntry)
    form.reset()
})

notesList.addEventListener('click', function (event){
    event.preventDefault()
    let target = event.target
    let parentListItem = target.parentElement.parentElement.parentElement
    console.log(target)
    if (target.classList.contains('delete')) {
        deleteNote(parentListItem)

    } if (target.classList.contains('fa-edit')) {
        fetch (url)
            .then((response) => response.json())
            .then((data) => {
                let listId = parentListItem.id
                console.log(data)
                console.log(listId)
                for (let note of data){
                    if (String(listId) === String(note.id)){
                        parentListItem.innerHTML = parentListItem.innerHTML + `<form id="edit-form">
        <div id="edit-field" class="field">
        <div class="control">
        <textarea id="edited-entry" class="input" type="text">${note.body}</textarea>
        </div>
        </div>
        <div  class="control">
        <button id="update" class="button is-link">Save Edit</button>
        </div>
        </form>`
                    }
                }
            })

    } if (target.classList.contains('is-link')) {
        updateNote(target)
    }
})


function renderNoteItem (noteObj) {
    const noteListItem = document.createElement('li')
    noteListItem.id = noteObj.id
    noteListItem.classList.add('note-item')
    renderNoteText(noteListItem, noteObj)
    notesList.appendChild(noteListItem)
}

function renderNoteText (noteTextItem, noteObj) {
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
    const noteText = document.getElementById('edited-entry').value
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