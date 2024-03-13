import { LocalStorageRepository } from '../db/LocalStorageRepository'
import { ProjectData, TrackedProjectData } from '../domain-models/models'

const TRACKED_PROJECTS_KEY = 'trackedProjects'
const PROJECT_PREFIX_KEY = 'project'

export class DashboardRepository extends LocalStorageRepository {
    public trackProject(project: TrackedProjectData) {
        const id = `${project.vcsType}/${project.username}/${project.reponame}`
        const currentProjects = this.loadTrackedProjects() ?? []
        if (currentProjects.some((trackedProject) => this.projectIdentifier(trackedProject) === id)) {
            return
        }
        currentProjects.push(project)
        this.persist(TRACKED_PROJECTS_KEY, currentProjects)
    }

    public enableProject(project: TrackedProjectData | ProjectData) {
        const id = `${this.projectIdentifier(project)}`
        let currentProjects = this.loadTrackedProjects() ?? []
        currentProjects = currentProjects?.map((trackedProject) => {
            const trackedProjectId = `${this.projectIdentifier(trackedProject)}`
            if (trackedProjectId === id) {
                trackedProject.enabled = true
            }
            return trackedProject
        })
        this.persist(TRACKED_PROJECTS_KEY, currentProjects)
    }

    public disableProject(project: TrackedProjectData | ProjectData) {
        const id = `${this.projectIdentifier(project)}`
        let currentProjects = this.loadTrackedProjects() ?? []
        currentProjects = currentProjects?.map((trackedProject) => {
            const trackedProjectId = `${this.projectIdentifier(trackedProject)}`
            if (trackedProjectId === id) {
                trackedProject.enabled = false
            }
            return trackedProject
        })
        this.persist(TRACKED_PROJECTS_KEY, currentProjects)
    }

    public loadTrackedProjects(): TrackedProjectData[] {
        return this.load(TRACKED_PROJECTS_KEY)
    }

    public persistProject(project: TrackedProjectData | ProjectData): void {
        const key = `${PROJECT_PREFIX_KEY}:${this.projectIdentifier(project)}`
        return this.persist(key, project)
    }

    public loadProject(project: TrackedProjectData | ProjectData): ProjectData | undefined {
        const key = `${PROJECT_PREFIX_KEY}:${this.projectIdentifier(project)}`
        return this.load(key)
    }

    private projectIdentifier(project: TrackedProjectData | ProjectData): string {
        return `${project.vcsType}/${project.username}/${project.reponame}`
    }
}
