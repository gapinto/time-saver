import Release from "../entities/Release";
import Tag from "../entities/Tag";
import PlatformRepository from "../ports/PlatformRepository";
import ReleaseDTO from "../dtos/ReleaseDTO";

class CreateNewRelease {

    /**
     * @param {Object} container 
     * @param {PlatformRepository} container.platformRepository
     */
    constructor({ platformRepository }) {
        this.platformRepository = platformRepository;
    }

    /**
     * @param {ReleaseDTO} latestReleaseDTO
     * @param {String} releaseType 
     * @param {String} body 
     * @param {String} releaseBranch
     * 
     * @returns {Release}
     */
    async create(latestReleaseDTO, releaseType, body, releaseBranch) {
        // TODO `releaseType` should be required
        const release = new Release(body, releaseType);

        release.generateReleaseNames(latestReleaseDTO)
        
        const newReleaseDTO = await this.platformRepository.createNewRelease(
            release, 
            new Tag(release.candidateName, releaseBranch)
        );

        release.setUrl(newReleaseDTO.url);

        return release;
    }
}

module.exports = CreateNewRelease;