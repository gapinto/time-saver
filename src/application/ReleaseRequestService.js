import ReleaseRequestPipelineService from '../domain/services/ReleaseRequestPipelineService';
import ReleaseRequestDTO from '../domain/dtos/ReleaseRequestDTO';

export default class ReleaseRequestService {

    /**
     * @param {Object} container
     * @param {ReleaseRequestPipelineService} container.releaseRequestPipelineService 
     */
    constructor({ releaseRequestPipelineService }) {
        this.releaseRequestPipelineService = releaseRequestPipelineService;
    }

    /**
     * @param {String} releaseType 
     * @param {String} releaseBranch 
     * @param {String} targetBranch 
     */
    async createReleaseRequest(releaseType, releaseBranch, targetBranch) {
        await this.releaseRequestPipelineService.startProcessWith(releaseType, releaseBranch, targetBranch);
        const release = await this.releaseRequestPipelineService.createRelease();
        const pullRequest = await this.releaseRequestPipelineService.createPullRequest();
        
        return new ReleaseRequestDTO(pullRequest, release);
    }

}