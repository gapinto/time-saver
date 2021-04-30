import fs from 'fs';
import PullRequest from '../entities/PullRequest';
import Release from '../entities/Release';
import { render } from 'mustache';
import VersionControl from '../ports/VersionControl';
import PlatformRepository from '../ports/PlatformRepository';
import ProjectExtractor from '../ports/ProjectExtractor';
import ReleaseDTO from '../dtos/ReleaseDTO';

class CreateNewPullRequest {

    /**
     * @param {Object} container
     * @param {VersionControl} container.versionControl
     * @param {PlatformRepository} container.platformRepository
     * @param {ProjectExtractor} container.projectExtractor
     * @param {Object} container.prTemplateParameters
     */
    constructor({ versionControl, platformRepository, projectExtractor, prTemplateParameters }) {
        this.versionControl = versionControl;
        this.platformRepository = platformRepository;
        this.projectExtractor = projectExtractor;
        this.prTemplateParameters = prTemplateParameters;
    }

    /**
     * 
     * @param {string} releaseBranch 
     * @param {string} targetBranch 
     */
    __extractBranchInfo(releaseBranch, targetBranch) {
        this.versionControl.clone();
        this.versionControl.fetch();
        this.versionControl.checkout(releaseBranch);
        const changeSets = this.versionControl.diffNameOnly(targetBranch);
        const elasticSearchReindexing = this.projectExtractor.extractElastic(changeSets, "elastic");
        const migrations = this.projectExtractor.extractMigration(targetBranch);
        const parameters = this.projectExtractor.extractParameters(targetBranch);
        const commands = this.projectExtractor.extractCommand(changeSets, "command");
        const getRecommendation = (changes) =>  changes.length > 0 ? "Recommended" : "Not Needed";
    
        return {
            targetBranch,
            commands: commands.length > 0 ? "Check if you need to execute any commands!": "Not Needed",
            parameters,
            downtimeNotice: getRecommendation(migrations),
            dbBackup: getRecommendation(migrations),
            migrations,
            elasticSearchReindexing: getRecommendation(elasticSearchReindexing),
        };
    }

    /**
     * 
     * @param {Object} parameters 
     */
    _generatePrDescription(parameters = {}) {
        const templatePath = __dirname + "/../../../resources/templates/release-pr.md";
        const releasePrTemplate = fs.readFileSync(templatePath, 'utf8').toString();
        return render(releasePrTemplate, parameters);
    }
    
    /**
     * @param {ReleaseDTO} latestReleaseDTO
     * @param {Release} newRelease 
     * @param {String} releaseBranch 
     * @param {String} targetBranch
     * 
     * @returns {PullRequest}
     */
    async create(latestReleaseDTO, newRelease, releaseBranch, targetBranch, changeLog) {
        const branchInfo = this.__extractBranchInfo(releaseBranch, targetBranch);
        const templateParameters = this.prTemplateParameters;
        const prDescription = this._generatePrDescription({
            releaseName: newRelease.name,
            releaseCandidateName: newRelease.candidateName,
            latestReleaseName: latestReleaseDTO.name,
            latestReleaseUrl: latestReleaseDTO.url,
            changeLog,
            ...branchInfo,
            ...templateParameters
        });
        const pullRequest = new PullRequest(
            `Release Request ${newRelease.name} (${newRelease.candidateName})`,
            prDescription,
            releaseBranch,
            targetBranch
        );
        const pullRequestDto = await this.platformRepository.createPullRequest(pullRequest);

        pullRequest.setUrl(pullRequestDto.url);

        return pullRequest;
    }
}

module.exports = CreateNewPullRequest;