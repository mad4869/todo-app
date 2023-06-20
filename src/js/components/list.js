import createCard from './card'
import createSeparator from './separator'

const createList = (arr, category, container, separatorColor) => {
    for (let i = 0; i < arr.length; i++) {
        const id = arr[i].todo_id
        const title = JSON.stringify(arr[i].title).split('"').join('')
        const project = JSON.stringify(arr[i].project_title).split('"').join('')
        const description = JSON.stringify(arr[i].description).split('"').join('')

        const card = createCard(id, title, project, description, category)

        const separator = createSeparator(separatorColor)

        container.append(separator, card)
    }
}

export default createList