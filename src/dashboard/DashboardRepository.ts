import { LocalStorageRepository } from "../db/LocalStorageRepository";
import { ProjectPipeline } from "../gateway/models/ListProjectPipelinesResponse";
import { WorkflowJob } from "../gateway/models/ListWorkflowJobsResponse";
import { ProjectConfiguration } from "../project/ProjectConfiguration";


export type JobData = {
    name: string;
    executions: WorkflowJob[];
};

export type WorkflowData = {
    name: string,
    project: ProjectConfiguration,
    mostRecentPipeline: ProjectPipeline,
    jobs: JobData[]
}

const TRACKED_PROJECTS_KEY = 'trackedProjects';
const WORKFLOW_PREFIX_KEY = 'dashboard';
export class DashboardRepository extends LocalStorageRepository {

    public trackProject(project: ProjectConfiguration) {
        const id = `${project.vcsType}/${project.username}/${project.reponame}`;
        const currentProjects = this.loadTrackedProjects() ?? []
        if (currentProjects
            .some(trackedProject => this.projectIdentifier(trackedProject) === id)) {
            return;
        }
        currentProjects.push(project)
        this.persist(TRACKED_PROJECTS_KEY, currentProjects);
    }

    public enableProject(project: ProjectConfiguration) {
        const id = `${this.projectIdentifier(project)}`;
        let currentProjects = this.loadTrackedProjects() ?? []
        currentProjects = currentProjects
            ?.map(trackedProject => {
                const trackedProjectId = `${this.projectIdentifier(trackedProject)}`;
                if (trackedProjectId === id) {
                    trackedProject.enabled = true;
                }
                return trackedProject;
            })
        this.persist(TRACKED_PROJECTS_KEY, currentProjects);
    }

    public disableProject(project: ProjectConfiguration) {
        const id = `${this.projectIdentifier(project)}`;
        let currentProjects = this.loadTrackedProjects() ?? []
        currentProjects = currentProjects
            ?.map(trackedProject => {
                const trackedProjectId = `${this.projectIdentifier(trackedProject)}`;
                if (trackedProjectId === id) {
                    trackedProject.enabled = false;
                }
                return trackedProject;
            })
        this.persist(TRACKED_PROJECTS_KEY, currentProjects);
    }

    public loadTrackedProjects(): ProjectConfiguration[] {
        return this.load(TRACKED_PROJECTS_KEY);
    }

    public persistWorkflow(dashboardWorkflow: WorkflowData) {
        const key = `${WORKFLOW_PREFIX_KEY}:${this.projectIdentifier(dashboardWorkflow.project)}:${dashboardWorkflow.name}`
        return this.persist(key, dashboardWorkflow)
    }

    public loadWorkflow(project: ProjectConfiguration, workflowName: string) {
        const key = `${WORKFLOW_PREFIX_KEY}:${this.projectIdentifier(project)}:${workflowName}`
        return this.load(key)
    }

    private projectIdentifier(project: ProjectConfiguration): string {
        return `${project.vcsType}/${project.username}/${project.reponame}`;
    }

}