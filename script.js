const url = 'http://localhost:3000/notes'
const form = document.getElementById('notes-form')
const notesList = document.getElementById('notes-list')
const noteItem = document.querySelector('note-item')


//Event Listeners

//Sends input to json database when submitted, and clears form

form.addEventListener('submit', function (event){
    event.preventDefault()
    const noteEntry = document.getElementById('note-entry').value
    createNote(noteEntry)
    form.reset()
})

//Updates page based on which button on the page is clicked

notesList.addEventListener('click', function (event){
    event.preventDefault()
    let target = event.target
    let parentListItem = target.closest('.card')

    //Deletes note when 1 of 2 buttons are clicked: "x" icon next to unedited note line, or from the "Delete" button in the note editor
    if (target.classList.contains('fa-trash') || target.classList.contains('is-danger')) {
        deleteNote(parentListItem)

    //Opens editor input when "edit" icon is clicked; line display is switched to none
    } if (target.classList.contains('fa-edit')) {
        fetch (url)
            .then((response) => response.json())
            .then((data) => {
                let listId = parentListItem.id
                for (let note of data){
                    if (String(listId) === String(note.id)){
                        parentListItem.innerHTML = parentListItem.innerHTML + `<form id="edit-form-${listId}" class="edit-form">
                        <div id="edit-field" class="field">
                        <div class="control">
                        <textarea id="edited-entry" class="input" type="text">${note.body}</textarea>
                        </div>
                        </div>
                        <div  class="control">
                        <div class="edit-buttons">
                        <button id="update" class="button is-link">Save Edit</button>
                        <button id="discard" class="button is-warning">Discard Edit</button>
                        <button id="delete-large" class="button is-danger">Delete Note</button>
                        </div>
                        </form>`
                    }
                } let spanIdToToggle = 'span' + String(listId)
                let spanToToggle = document.getElementById(spanIdToToggle)
                spanToToggle.style.display = "none"
            })
    
    //Updates note displayed 
    } if (target.classList.contains('is-link')) {
        updateNote(target)

    //Discards edit changes but keeps original note data
    } if(target.classList.contains('is-warning')) {
        let parentButtonItem = target.closest('.edit-form')

        parentButtonItem.remove()

        //code to reset the list element's display to block
        let parentId = parentListItem.id
        let hiddenId = 'span' + String(parentId)
        let hiddenSpan = document.getElementById(hiddenId)
        hiddenSpan.style.display = ""
    }
})

// functions to render note objects on page 

function renderNoteItem (noteObj) {
    const noteListItem = document.createElement('div')
    noteListItem.id = noteObj.id
    noteListItem.classList.add('card')
    renderNoteText(noteListItem, noteObj)
    notesList.appendChild(noteListItem)
}

function renderNoteText (noteTextItem, noteObj) {
    let insertedId = 'span' + String(noteObj.id)
    noteTextItem.innerHTML = `<span id="${insertedId}" class="card-content"><span class="content test-class">${noteObj.body}</span><button class="button"><span class="icon"><i class="fas fa-trash"></i></span></button><button class="button"><span class="icon"><i class="fas fa-edit"></i></span></button></span>`
}

//CRUD functions

function listNotes() {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            for (const note of data){
                renderNoteItem(note)
            } 
        })
}

listNotes() //don't forget to call this function to display!


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
    const listItemElement = element.closest('.card')
    const noteId = listItemElement.id
    
    const noteText = document.getElementById('edited-entry').value
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
            renderNoteText(listItemElement, data)
        })
}