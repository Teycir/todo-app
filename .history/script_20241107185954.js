// Todo app functionality
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const saveTodoBtn = document.getElementById('saveTodo');
const uploadTodoBtn = document.getElementById('uploadTodo');
const fileInput = document.getElementById('fileInput');
const todoList = document.getElementById('todoList');

let todos = [];

function saveTodos() {
    // Create content string from todos
    const content = todos.map(todo => todo.text).join('\n');
    
    // Create blob and download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.txt';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Visual feedback
    saveTodoBtn.textContent = 'Saved!';
    setTimeout(() => {
        saveTodoBtn.textContent = 'Save';
    }, 1000);
}

function uploadTodos() {
    fileInput.click();
}

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            // Clear existing todos
            todos = [];
            todoList.innerHTML = '';
            
            // Create new todos from file content
            content.split('\n').forEach(text => {
                if (text.trim()) {
                    const todo = {
                        id: Date.now() + Math.random(),
                        text: text.trim(),
                        completed: false
                    };
                    todos.push(todo);
                    renderTodo(todo);
                }
            });
            
            // Reset file input
            fileInput.value = '';
            
            // Visual feedback
            uploadTodoBtn.textContent = 'Loaded!';
            setTimeout(() => {
                uploadTodoBtn.textContent = 'Upload';
            }, 1000);
        };
        reader.readAsText(file);
    }
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        todos.push(todo);
        renderTodo(todo);
        todoInput.value = '';
    }
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="delete-btn">Delete</button>
    `;

    const checkbox = li.querySelector('input');
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        const todoItem = todoList.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.toggle('completed');
        }
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    const todoItem = todoList.querySelector(`[data-id="${id}"]`);
    if (todoItem) {
        todoItem.remove();
    }
}

// Event Listeners
addTodoBtn.addEventListener('click', addTodo);
saveTodoBtn.addEventListener('click', saveTodos);
uploadTodoBtn.addEventListener('click', uploadTodos);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// Track mouse position for particle effect
document.addEventListener('mousemove', (e) => {
    window.pJSDom[0].pJS.interactivity.mouse.pos_x = e.clientX;
    window.pJSDom[0].pJS.interactivity.mouse.pos_y = e.clientY;
});