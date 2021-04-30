class ReleaseRequestDTO {
    /**
     * @param {PullRequestDTO} pullRequestDTO
     * @param {ReleaseDTO} releaseDTO
     */
    constructor(pullRequestDTO, releaseDTO) {
        this.pullRequest = pullRequestDTO;
        this.release = releaseDTO;
    }
}

module.exports = ReleaseRequestDTO;
