document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const saveTodoBtn = document.getElementById('saveTodo');
    const uploadTodoBtn = document.getElementById('uploadTodo');
    const todoList = document.getElementById('todoList');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Function to save todos to txt file on Desktop
    async function saveTodosTxt() {
        const todoText = todos.map(todo => 
            `[${todo.completed ? 'x' : ' '}] ${todo.text}`
        ).join('\n');
        
        try {
            const blob = new Blob([todoText], { type: 'text/plain' });
            const handle = await window.showSaveFilePicker({
                suggestedName: 'todos.txt',
                startIn: 'desktop',
                types: [{
                    description: 'Text Files',
                    accept: { 'text/plain': ['.txt'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } catch (err) {
            console.error('Failed to save todos to file:', err);
        }
    }

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.className = 'ripple';
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
    }

    // Add hover effects to buttons
    function addButtonEffects(button) {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05) rotate(1deg)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
        });
        
        button.addEventListener('click', createRipple);
    }

    // Render existing todos
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;

            // Toggle completion
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                li.classList.toggle('completed');
                saveTodos();
            });

            // Delete todo
            const deleteBtn = li.querySelector('.delete-btn');
            addButtonEffects(deleteBtn);
            deleteBtn.addEventListener('click', () => {
                li.style.transform = 'translateX(100px)';
                li.style.opacity = '0';
                setTimeout(() => {
                    todos.splice(index, 1);
                    renderTodos();
                    saveTodos();
                }, 300);
            });

            todoList.appendChild(li);
        });
    }

    // Save todos to localStorage only
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Load todos from txt file
    async function loadTodosFromFile() {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Text Files',
                    accept: { 'text/plain': ['.txt'] },
                }],
            });
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            // Parse the txt file content
            todos = content.split('\n').map(line => ({
                text: line.substring(4),
                completed: line.startsWith('[x]')
            })).filter(todo => todo.text);
            
            renderTodos();
            saveTodos();
        } catch (err) {
            console.error('Failed to load todos from file:', err);
        }
    }

    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                text,
                completed: false
            });
            todoInput.value = '';
            renderTodos();
            saveTodos();
            todoInput.focus();
        }
    }

    // Add effects to buttons
    addButtonEffects(addTodoBtn);
    addButtonEffects(saveTodoBtn);
    addButtonEffects(uploadTodoBtn);

    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);
    saveTodoBtn.addEventListener('click', saveTodosTxt);
    uploadTodoBtn.addEventListener('click', loadTodosFromFile);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .todo-item {
            transition: transform 0.3s, opacity 0.3s;
        }

        .delete-btn, #addTodo, #saveTodo, #uploadTodo {
            position: relative;
            overflow: hidden;
            transform: scale(1) rotate(0deg);
            transition: transform 0.3s, box-shadow 0.3s;
        }
    `;
    document.head.appendChild(style);

    // Initial render
    renderTodos();
    todoInput.focus();
});
