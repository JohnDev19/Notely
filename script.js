const notesContainer = document.getElementById('notesContainer');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNote');
const searchInput = document.getElementById('searchInput');
const toggleThemeBtn = document.getElementById('toggleTheme');

const modal = document.getElementById('viewModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close-btn');
const themeBtn = document.querySelector('.theme-btn');
const themeOptions = document.querySelector('.theme-options');
const themeOptionBtns = document.querySelectorAll('.theme-option');
const themeBackground = document.querySelector('.theme-bg');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingNoteId = null;

function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note-item');
    noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="actions">
            <button class="view-btn"><i class="fas fa-eye"></i></button>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    noteElement.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
    noteElement.querySelector('.edit-btn').addEventListener('click', () => editNote(note.id));
    noteElement.querySelector('.view-btn').addEventListener('click', () => viewNote(note));

    return noteElement;
}

function renderNotes(notesToRender = notes) {
    notesContainer.innerHTML = '';
    notesToRender.forEach(note => {
        notesContainer.appendChild(createNoteElement(note));
    });
}

function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        const newNote = {
            id: Date.now(),
            title,
            content,
        };

        notes.unshift(newNote);
        saveNotesToLocalStorage();
        renderNotes();
        noteTitle.value = '';
        noteContent.value = '';
    }
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotesToLocalStorage();
    renderNotes();
}

function editNote(id) {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
        noteTitle.value = noteToEdit.title;
        noteContent.value = noteToEdit.content;
        editingNoteId = id;
        saveNoteBtn.textContent = 'Update Note';
    }
}

function updateNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title && content) {
        const index = notes.findIndex(note => note.id === editingNoteId);
        if (index !== -1) {
            notes[index].title = title;
            notes[index].content = content;
            saveNotesToLocalStorage();
            renderNotes();
            noteTitle.value = '';
            noteContent.value = '';
            editingNoteId = null;
            saveNoteBtn.textContent = 'Save Note';
        }
    }
}

function searchNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function viewNote(note) {
    modalTitle.textContent = note.title;
    modalContent.textContent = note.content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    resetModalTheme();
}

function resetModalTheme() {
    modal.classList.remove('dark-mode');
    const themeBackground = modal.querySelector('.theme-bg');
    themeBackground.className = 'theme-bg';
    themeBackground.style.backgroundImage = '';
    themeBackground.style.backgroundColor = '';
}

function applyTheme(theme) {
    const modalContent = modal.querySelector('.modal-content');
    const themeBackground = modal.querySelector('.theme-bg');
    
    modal.classList.remove('dark-mode');
    themeBackground.className = 'theme-bg';
    
    switch(theme) {
        case 'light':
            modalContent.style.backgroundColor = '#ffffff';
            modalContent.style.color = '#333';
            themeBackground.style.backgroundColor = '#ffffff';
            break;
        case 'dark':
            modal.classList.add('dark-mode');
            modalContent.style.backgroundColor = '#1a1a2e';
            modalContent.style.color = '#f0f0f0';
            themeBackground.style.backgroundColor = '#1a1a2e';
            break;
        case 'nature':
        case 'city':
            themeBackground.style.backgroundImage = `url('bg.jpg')`;
            themeBackground.classList.add('glassmorphism');
            modalContent.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            modalContent.style.color = '#ffffff';
            break;
    }
}

saveNoteBtn.addEventListener('click', () => {
    if (editingNoteId) {
        updateNote();
    } else {
        addNote();
    }
});

searchInput.addEventListener('input', searchNotes);
toggleThemeBtn.addEventListener('click', toggleTheme);

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetModalTheme();
});

themeBtn.addEventListener('click', () => {
    themeOptions.style.display = themeOptions.style.display === 'block' ? 'none' : 'block';
});

themeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        applyTheme(theme);
        themeOptions.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (!event.target.closest('.theme-selector')) {
        themeOptions.style.display = 'none';
    }
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModalTheme();
    }
});

// Initial render
renderNotes();