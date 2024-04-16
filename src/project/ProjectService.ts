import { DashboardRepository } from '../dashboard/DashboardRepository'
import { ProjectData, TrackedProjectData } from '../domain-models/models'
import { emitProjectSynched } from '../events/Events'
import { circleCiClient } from '../gateway/CircleCiClient'
import { WorkflowFetcher } from './WorkflowFetcher'

export class ProjectService {
    private readonly dashboardRepository = new DashboardRepository()

    public async listUserProjects(): Promise<TrackedProjectData[]> {
        const userProjects = await circleCiClient.listUserProjects()
        return await Promise.all(
            userProjects.map(async (project) => ({
                enabled: false,
                vcsType: project.vcs_type,
                reponame: project.reponame,
                username: project.username,
                defaultBranch: project.default_branch,
                vcsUrl: project.vcs_url,
            }))
        )
    }
    public trackProject(project: TrackedProjectData) {
        return this.dashboardRepository.trackProject(project)
    }

    public enableProject(project: TrackedProjectData) {
        return this.dashboardRepository.enableProject(project)
    }

    public disableProject(project: TrackedProjectData) {
        return this.dashboardRepository.disableProject(project)
    }

    public loadTrackedProjects(): TrackedProjectData[] {
        return this.dashboardRepository.loadTrackedProjects() || []
    }

    public loadProject(project: TrackedProjectData | ProjectData): ProjectData | undefined {
        return this.dashboardRepository.loadProject(project)
    }

    public async syncProject(project: TrackedProjectData | ProjectData): Promise<ProjectData> {
        const result: ProjectData = {
            vcsType: project.vcsType,
            reponame: project.reponame,
            username: project.username,
            vcsUrl: project.vcsUrl,
            ciUrl: `https://app.circleci.com/pipelines/${project.vcsType}/${project.username}/${project.reponame}`,
            defaultBranch: project.defaultBranch,
            workflows: await new WorkflowFetcher(project).getProjectWorkflows(),
        }

        this.dashboardRepository.persistProject(result)
        emitProjectSynched({ project: result })
        return result
    }
}
