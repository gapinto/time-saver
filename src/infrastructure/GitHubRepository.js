import PlatformRepository from "../domain/ports/PlatformRepository";
import { Octokit } from "@octokit/core";
import ReleaseDTO from "../domain/dtos/ReleaseDTO";
import PullRequestDTO from "../domain/dtos/PullRequestDTO";
 
class GitHubRepository extends PlatformRepository {
    
    /**
     * @param {Object} container
     * 
     * @param {Object} container.gitHubParameters
     */
    constructor({ gitHubParameters }) {
        super();
        const { auth, repo, owner, org, type, baseUrl } = gitHubParameters;
        
        this.client = new Octokit({ auth });
        this.repo = repo;
        this.owner = owner;
        this.org = org;
        this.type = type;
        this.baseUrl = baseUrl;
    }

    /**
     * @inheritdoc
     */
    async getLatestRelease() {
        const response = await this.client.request("GET /repos/{owner}/{repo}/releases/latest", {
            owner: this.owner,
            repo: this.repo,
            org: this.org,
            type: this.type,
            baseUrl: this.baseUrl
        });

        return new ReleaseDTO(response.data.name, response.data.html_url);
    }

    /**
     * @inheritdoc
     */
    async createNewRelease(release, tag) {
        const response = await this.client.request("POST /repos/{owner}/{repo}/releases", {
            owner: this.owner,
            repo: this.repo,
            org: this.org,
            type: this.type,
            baseUrl: this.baseUrl,
            tag_name: tag.name,
            target_commitish: tag.commitId,
            name: release.candidateName,
            body: release.body,
            draft: release.draft,
            prerelease: release.preRelease
        });

        return new ReleaseDTO(response.data.name, response.data.html_url, response.data.tag_name);
    }

    /**
     * @inheritdoc
     */
    async createPullRequest(pullRequest) {
        const response = await this.client.request('POST /repos/{owner}/{repo}/pulls', {
            owner: this.owner,
            repo: this.repo,
            org: this.org,
            type: this.type,
            baseUrl: this.baseUrl,
            title: pullRequest.title,
            head: pullRequest.fromBranch,
            base: pullRequest.intoBranch,
            body: pullRequest.body
        });

        return new PullRequestDTO(response.data.html_url);
    }
}

module.exports = GitHubRepository;