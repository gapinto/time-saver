import CreateNewRelease from "../useCases/CreateNewRelease";
import CreateNewPullRequest from "../useCases/CreateNewPullRequest";
import PlatformRepository from "../ports/PlatformRepository";
import GenerateChangeLog from "../useCases/GenerateChangeLog";
import ChangeLog from "../entities/ChangeLog";

const HEAD_TAG = 'HEAD';

class ReleaseRequestPipelineService {

    /**
     * @param {Object} container 
     * @param {CreateNewRelease} container.createNewRelease
     * @param {CreateNewPullRequest} container.createNewPullRequest
     * @param {PlatformRepository} container.platformRepository
     * @param {GenerateChangeLog} container.generateChangeLog
     */
    constructor({ createNewRelease, createNewPullRequest, platformRepository, generateChangeLog }) {
        this.createNewRelease = createNewRelease;
        this.createNewPullRequest = createNewPullRequest;
        this.platformRepository = platformRepository;
        this.generateChangeLog = generateChangeLog;
    }

    /**
     * @private
     * @param {String} endTag 
     * @param {String} filters 
     */
    extractChangeLog(endTag, filters) {
        return this.generateChangeLog.generate(
            this.releaseBranch, 
            this.latestRelease.name, 
            endTag, 
            filters
        );
    }

    /**
     * @public
     * @param {String} releaseType
     * @param {String} releaseBranch 
     * @param {String} targetBranch
     */
    async startProcessWith(releaseType, releaseBranch, targetBranch) {
        this.releaseType = releaseType;
        this.releaseBranch = releaseBranch;
        this.targetBranch = targetBranch;
        this.latestRelease = await this.platformRepository.getLatestRelease();
        this.changeLog = this.extractChangeLog(HEAD_TAG, [ChangeLog.story, ChangeLog.fcs]);
    }

    /**
     * @pu
     */
    async createRelease() {
        this.newRelease = await this.createNewRelease.create(
            this.latestRelease, 
            this.releaseType, 
            this.changeLog, 
            this.releaseBranch
        );
        
        return this.newRelease;
    }

    async createPullRequest() {
        const pullRequest = await this.createNewPullRequest.create(
            this.latestRelease, 
            this.newRelease, 
            this.releaseBranch, 
            this.targetBranch,
            this.changeLog
        );
        
        return pullRequest;
    }
}

module.exports = ReleaseRequestPipelineService;
