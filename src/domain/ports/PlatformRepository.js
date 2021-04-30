import ReleaseDTO from "../dtos/ReleaseDTO";
import PullRequestDTO from "../dtos/PullRequestDTO";

class PlatformRepository {
    constructor() {}

    /**
     * @returns {ReleaseDTO}
     */
    async getLatestRelease() {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {Release} release 
     * @param {Tag} tag 
     * 
     * @returns {ReleaseDTO}
     */
    async createNewRelease(release, tag) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {PullRequest} pullRequest
     * 
     * @returns {PullRequestDTO}
     */
    async createPullRequest(pullRequest) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    } 
}

module.exports = PlatformRepository;