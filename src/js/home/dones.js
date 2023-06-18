import fetchData from '../components/data'
import createList from '../components/list'
import createSeparator from '../components/separator'
import createEmptyState from '../components/empty'

class Dones {
    constructor() {
        this.name = 'dones'

        this.container = document.getElementById('home-dones-container')
        this.heading = document.getElementById('home-dones-heading')
    }

    async getData(user_id) {
        return await fetchData(`/api/users/${user_id}/dones`)
    }

    async getList(user_id) {
        try {
            const data = await this.getData(user_id)

            createList(data, this.container, 'teal')

            return data
        } catch (err) {
            console.error(err)
        }
    }

    filterByProjects(dones, projectId) {
        while (this.container.hasChildNodes()) {
            this.container.removeChild(this.container.firstChild)
        }

        this.container.appendChild(this.heading)

        const filtered = dones.filter((done) => {
            return done.project_id === parseInt(projectId)
        })

        createList(filtered, this.container, 'teal')
    }

    emptyState() {
        const emptyBox = createEmptyState(this.name)

        const separator = createSeparator('teal')

        this.container.append(separator, emptyBox)

        return emptyBox
    }
}

export default Dones