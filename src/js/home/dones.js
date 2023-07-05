import Todos from './todos'

import { fetchData, updateData, deleteData } from '../components/data'
import createButton from '../components/button'
import { getNextElement, todoToDone } from '../components/switch'
import loadAnimation from '../components/animation'

class Dones {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('home-dones-container'),
            heading: document.getElementById('home-dones-heading')
        }

        this.edit = {
            modal: document.getElementById('modal-edit-todo'),
            form: {
                form: document.getElementById('form-edit-todo'),
                fields: {
                    id: document.getElementById('form-edit-todo-id'),
                    project: document.getElementById('form-edit-todo-project'),
                    title: document.getElementById('form-edit-todo-title'),
                    description: document.getElementById('form-edit-todo-description')
                },
                submit: document.getElementById('form-edit-todo-submit')
            },
            close: document.getElementById('modal-edit-todo-close-button')
        }

        this.delete = {
            modal: document.getElementById('modal-delete-todo'),
            deleted: document.getElementById('modal-delete-todo-deleted'),
            confirm: document.getElementById('modal-delete-todo-confirm'),
            cancel: document.getElementById('modal-delete-todo-cancel'),
            close: document.getElementById('modal-delete-todo-close-button')
        }
    }

    // Create and return a container for a Done task
    // Params: doneId (int) -> the task ID
    // Return: card (HTML element) -> the card container
    createCard = (doneId) => {
        const card = document.createElement('div')
        card.className = 'w-full pb-2 bg-white border border-solid border-slate-700 rounded-2xl shadow-card-sm cursor-move overflow-hidden'
        card.setAttribute('draggable', true)
        card.setAttribute('data-id', doneId)

        return card
    }

    // Create and return the heading part of the card
    // Params: doneTitle (string) -> the task title
    //         project (string) -> the project that the task is a part of
    // Return: heading (HTML element) -> the heading containing the title and the project
    createHeading = (doneTitle, project) => {
        const heading = document.createElement('div')
        heading.className = 'flex gap-4 justify-between items-center bg-teal-600 px-4 py-2 text-teal-500 '

        const title = document.createElement('h1')
        title.className = 'flex-1 text-xl font-semibold'
        title.textContent = doneTitle

        const label = document.createElement('span')
        label.className = 'px-2 py-1 border border-solid border-teal-500 text-sm rounded-full'
        label.textContent = project

        heading.append(title, label)

        return heading
    }

    // Create and return the description part of the card
    // Params: doneDesc (string) -> the task description
    // Return: description (HTML element) -> the description container
    createDescription = (doneDesc) => {
        const description = document.createElement('div')
        description.className = 'bg-white px-4 py-2 text-neutral-400 text-xs'
        description.textContent = doneDesc

        return description
    }

    // Create and return the toolbar part of the card
    // Params: editButton (HTML element) -> a button element to edit the task
    //         deleteButton (HTML element) -> a button element to delete the task
    //         undoneButton (HTML element) -> a button element to send the task back to the To Do column
    // Return: toolbar (HTML element) -> the toolbar containing all the buttons
    createToolbar = (editButton, deleteButton, undoneButton) => {
        const toolbar = document.createElement('div')
        toolbar.className = 'flex justify-between bg-white px-4'

        const leftButtons = document.createElement('span')
        const rightButtons = document.createElement('span')

        leftButtons.append(editButton, deleteButton)
        rightButtons.append(undoneButton)

        toolbar.append(leftButtons, rightButtons)

        return toolbar
    }

    // Create a card by merging all the components
    // Params: doneId (int) -> the task ID
    //         doneTitle (string) -> the task title
    //         project (string) -> the project that the task is a part of
    //         doneDesc (string) -> the task description
    // Return: card (HTML element) -> the card container
    createDone = (doneId, doneTitle, project, doneDesc) => {
        // Create all the components
        const card = this.createCard(doneId)
        const heading = this.createHeading(doneTitle, project)
        const description = this.createDescription(doneDesc)

        // Define a handler for the edit button
        const handleEdit = async () => {
            // If the edit button clicked, show the edit modal
            this.showEditModal()

            // Fill all the fields inside the modal with the relevant data
            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.edit.form.fields.id.value = data.todo_id
            this.edit.form.fields.project.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description
        }

        // Define a handler for the delete button
        const handleDelete = async () => {
            // If the delete button clicked, show the delete modal
            this.showDeleteModal()

            // Show the task title to the user
            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)
            this.delete.deleted.textContent = data.title

            // If the user click confirm:
            this.delete.confirm.addEventListener('click', async () => {
                // Show the loading state
                this.delete.confirm.innerHTML = ''
                loadAnimation(this.delete.confirm, 'dots-white')

                // Make an api call to delete the task using its ID
                try {
                    const res = await deleteData(`/api/users/${this.user}/todos/${doneId}`)
                    // If success, reload the page
                    if (res.success) {
                        location.reload()
                        // If not, abort the loading state and show a notice with error message
                    } else {
                        this.delete.confirm.innerHTML = 'Confirm'
                        this.closeDeleteModal()

                        showNotice(res.message, 'error')
                    }
                } catch (err) {
                    console.error(err)
                }
            })

            // If the user click cancel:
            this.delete.cancel.addEventListener('click', () => {
                // Close the modal
                this.closeDeleteModal()
            })
        }

        // Define a handler for the undone button
        this.handleUndone = async () => {
            const todo = document.querySelector(`[data-id="${doneId}"]`)
            const undoneButton = todo.querySelector('button[name="undone-button"]')

            // If the undone button clicked, show the loading state
            undoneButton.innerHTML = ''
            loadAnimation(undoneButton, 'dots-white')

            // Get the updated data of the task
            try {
                const updatedData = await this.markAsUndone(doneId)
                if (updatedData) {
                    // After getting the updated data, make an api call to update the data
                    const res = await updateData(`/api/users/${this.user}/todos/${doneId}`, JSON.stringify(updatedData))

                    // If success, reload the page
                    if (res.success) {
                        location.reload()
                        // If not, abort the loading state and show a notice with error message
                    } else {
                        undoneButton.innerHTML = '<i class="fa-solid fa-arrow-rotate-left"></i>'

                        showNotice(res.message, 'error')
                    }
                }
            } catch (err) {
                console.error(err)
            }
        }

        // Create all the buttons
        const editButton = createButton('px-4 py-px text-xs text-emerald-500 rounded-lg shadow-button-sm bg-emerald-700', 'Edit', handleEdit, 'edit-button', 'Edit this task')
        const deleteButton = createButton('ml-1 px-4 py-px text-xs text-rose-500 rounded-lg shadow-button-sm bg-rose-700', 'Delete', handleDelete, 'delete-button', 'Delete this task')
        const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-button-sm bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', this.handleUndone, 'undone-button', 'Mark as undone')

        // Put the buttons inside their container
        const toolbar = this.createToolbar(editButton, deleteButton, undoneButton)

        // Put all the card components inside the container
        card.append(heading, description, toolbar)

        return card
    }

    // Create a stack of task cards
    // Params: data (array) -> an array of tasks data
    // Return: None
    createStack = (data) => {
        // Iterate over the array
        for (let i = 0; i < data.length; i++) {
            const id = data[i].todo_id
            const title = data[i].title
            const project = data[i].project_title
            const description = data[i].description

            // Make a card using the data
            const done = this.createDone(id, title, project, description)

            // Append the card to the main container
            this.stack.container.append(done)
        }
    }

    // Get the stack using the tasks data from the database
    // Params: None
    // Return: data (array) -> the tasks data from the database
    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/dones`)

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    // Create an empty state if the user hasn't got any task yet
    // Params: None
    // Return: None
    emptyState = () => {
        // Create the container
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-teal-600 text-teal-600 text-xl capitalize rounded-2xl'
        emptyBox.setAttribute('id', 'empty-state')

        // Create the illustration
        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('alt', 'This column is empty')
        illustration.setAttribute('src', '/static/dist/img/empty-secondary.svg')

        // Create the message
        const text = document.createElement('h3')
        text.textContent = "you haven't finished any tasks yet"
        text.className = 'text-sm sm:text-base md:text-lg'

        // Put the components into the container
        emptyBox.append(illustration, text)

        // Append the empty state to the main container
        this.stack.container.append(emptyBox)
    }

    // Check if a task is a Done task or not
    // Params: doneId (int) -> the task ID
    // Return: data (object) -> the task data
    checkDone = async (doneId) => {
        // Get the data from the endpoint
        try {
            const { data } = await fetchData(`/api/users/${this.user}/todos/${doneId}`)

            // If the task is a Done task, return the data
            if (data.is_done) {
                return data
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Mark a task as undone
    // Params: doneId (int) -> the task ID
    // Return: updatedData (object) -> the updated data object
    markAsUndone = async (doneId) => {
        // Get the data if the task is a Done task
        try {
            const data = await this.checkDone(doneId)
            // After getting the data, make an updated data with 'is_done' attribute set to 'false' and return it
            if (data) {
                const updatedData = {
                    ...data,
                    is_done: false,
                }

                return updatedData
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Handle the drag start and drag end events
    // Params: None
    // Return: None 
    handleDragSender = () => {
        // If the user starts to drag the task card:
        this.handleDragStart = (e) => {
            // Set the data using the task ID
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'))

            // Make the card half transparent
            e.target.classList.add('opacity-50');
        }

        // If the user ends the drag:
        this.handleDragEnd = (e) => {
            // Turn the card back to normal
            e.target.classList.remove('opacity-50')
        }

        // Attach the event listeners to all the task cards
        const allTasks = this.stack.container.querySelectorAll('div[draggable="true"]')
        allTasks.forEach((task) => {
            task.addEventListener('dragstart', this.handleDragStart)
            task.addEventListener('dragend', this.handleDragEnd)
        })
    }

    // Handle the drag over and drop events
    // Params: None
    // Return: None 
    handleDragRecipient = () => {
        // If the user drags the card over the main container:
        this.handleDragOver = (e) => {
            // Set the container to be a droppable zone
            e.preventDefault()

            // Get the task ID
            const data = e.dataTransfer.getData('text/plain')

            // Target the dragged card using the task ID
            const dragged = document.querySelector(`[data-id="${data}"]`)

            // Create an undone button
            const undoneButton = createButton('px-4 py-px text-xs text-white rounded-lg shadow-button-sm bg-teal-600', '<i class="fa-solid fa-arrow-rotate-left"></i>', this.handleUndone, 'undone-button', 'Mark as undone')

            // Switch the dragged card appearance
            todoToDone(dragged, undoneButton)

            // Determine if the card is dragged over another element or not, if yes get the element
            const { nextElement } = getNextElement(this.stack.container, e.clientY)

            // If the main container is empty, replace the empty state with the dragged card
            if (this.stack.container.contains(document.getElementById('empty-state'))) {
                this.stack.container.replaceChild(dragged, document.getElementById('empty-state'))
            }

            // If there is no other element next to the dragged card, append the card to the bottom of the main container
            if (!nextElement) {
                this.stack.container.append(dragged)
                // If there is another element, insert the dragged card before the element
            } else {
                this.stack.container.insertBefore(dragged, nextElement)
            }

            // If the dragged card was the only card in the original container, show the empty state in the original container
            const todos = new Todos(this.user)
            if (!todos.stack.heading.nextElementSibling) {
                todos.emptyState()
            }
        }

        // If the user drops the card on the main container:
        this.handleDrop = async (e) => {
            // Set the container to be a droppable zone
            e.preventDefault()

            // Get the task ID
            const data = e.dataTransfer.getData('text/plain')

            // Mark the task as a Done task and get the updated data
            const todos = new Todos(this.user)
            const updatedData = await todos.markAsDone(data)
            if (updatedData) {
                // After getting the updated data, show the loading state
                this.stack.heading.innerHTML = ''
                loadAnimation(this.stack.heading, 'dots-teal')

                // Make an api call to update the data
                try {
                    const res = await updateData(`/api/users/${this.user}/todos/${data}`, JSON.stringify(updatedData))

                    // If success, reload the page
                    if (res.success) {
                        location.reload()
                        // If not, abort the loading state and show a notice with error message
                    } else {
                        this.stack.heading.innerHTML = 'Done'

                        showNotice(res.message, 'error')
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }

        // Attach the event listeners to the main container
        this.stack.container.addEventListener('dragover', this.handleDragOver)
        this.stack.container.addEventListener('drop', this.handleDrop)
    }

    // Remove all drag and drop event listeners
    // Params: None
    // Return: None
    resetDrag = () => {
        const allTasks = this.stack.container.querySelectorAll('div[draggable="true"]')
        allTasks.forEach((task) => {
            task.removeEventListener('dragstart', this.handleDragStart)
            task.removeEventListener('dragend', this.handleDragEnd)
        })

        this.stack.container.removeEventListener('dragover', this.handleDragOver)
        this.stack.container.removeEventListener('drop', this.handleDrop)
    }

    // Get the stack and the event listeners. If there is no stack, show the empty state
    // Params: None
    // Return: stack (array) -> the tasks data
    handleStack = async () => {
        try {
            // Get the stack
            const stack = await this.getStack()
            // If the stack is empty, show the empty state
            if (stack.length === 0) {
                this.emptyState()
                this.handleDragRecipient()
            } else {
                this.handleDragSender()
                this.handleDragRecipient()
            }

            return stack
        } catch (err) {
            console.error(err)
        }
    }

    // Remove all the task cards and the event listeners from the main container
    // Params: None
    // Return: None
    resetStack = () => {
        this.resetDrag()

        while (this.stack.container.hasChildNodes()) {
            this.stack.container.removeChild(this.stack.container.firstChild)
        }

        this.stack.container.appendChild(this.stack.heading)
    }

    // Filter the task cards based on the project they belong to
    // Params: projectId (int) -> the project ID
    // Return: filtered (array) -> the filtered tasks data based on the project ID
    filterByProject = async (projectId) => {
        // Reset the stack
        this.resetStack()

        // Get the data from the api endpoint
        try {
            const { data } = await fetchData(`/api/users/${this.user}/dones`)

            // Filter the data
            const filtered = data.filter((done) => {
                return done.project_id === parseInt(projectId)
            })

            // Show empty state if the filtered data is empty
            if (filtered.length === 0) {
                this.emptyState()
                this.handleDragRecipient()
                // If not empty, rebuild the stack using the filtered data
            } else {
                this.createStack(filtered)
                this.handleDragSender()
                this.handleDragRecipient()
            }

            return filtered
        } catch (err) {
            console.error(err)
        }
    }

    // Show and close modals
    // Params: None
    // Return: None

    showEditModal = () => {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditModal = () => {
        this.edit.modal.classList.add('hidden')
    }

    showDeleteModal = () => {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteModal = () => {
        this.delete.modal.classList.add('hidden')
    }
}

export default Dones