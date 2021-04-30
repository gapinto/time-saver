import ReleaseDTO from "../dtos/ReleaseDTO";

const releaseIndexByType = {
    "major": 0,
    "minor": 1,
    "patch": 2
}

const RELEASE_CANDIDATE = 'rc';
class Release {

    /**
     * 
     * @param {String} body 
     * @param {Object} currentReleaseInfo 
     * @param {String} releaseType 
     * @param {Boolean} draft 
     * @param {Boolean} preRelease 
     */
    constructor(body, releaseType, draft = true, preRelease = true) {
        this.body = body;
        this.draft = draft;
        this.preRelease = preRelease;
        this.releaseType = releaseType;
    }

    /**
     * 
     * @param {ReleaseDTO} latestReleaseDTO
     */
    generateReleaseNames(latestReleaseDTO) {
        const latestReleaseName = latestReleaseDTO.name;
        const partIndexToBeUpdated = releaseIndexByType[this.releaseType];
        let versionParts = this.convertReleaseNameToVersionParts(latestReleaseName);
        versionParts = this.updateVersionPart(versionParts, partIndexToBeUpdated);
        versionParts = this.resetParts(versionParts)

        const releaseName = versionParts.join(".");
        const releaseCandidateNumber = this.createReleaseCandidateNumber(latestReleaseName);

        this.name = releaseName;
        this.candidateName = `${releaseName}-${RELEASE_CANDIDATE}${releaseCandidateNumber}`;
    }

    updateVersionPart(versionParts, partIndexToBeUpdated) {
        const newPartValue = ++versionParts[partIndexToBeUpdated];
        const action = { index: partIndexToBeUpdated, item: newPartValue}

        return versionParts.map((item, index) => {
            if (index !== action.index) {
                return item
            }
            return action.item
        })
    }

    /**
     * 
     * @param {Array} versionParts
     * 
     * @returns {Array} where index 0 = major, 1 = minor and 2 = patch 
     */
    resetParts(versionParts) {
        const index = releaseIndexByType[this.releaseType];
        if (index === releaseIndexByType.major) {
            return [versionParts[0], 0, 0];
        } else if (index === releaseIndexByType.minor) {
            return [versionParts[0], versionParts[1], 0];
        }

        return versionParts;
    }

    convertReleaseNameToVersionParts(latestReleaseName) {
        const isReleaseCandidate = latestReleaseName.includes(RELEASE_CANDIDATE);
        if (isReleaseCandidate) {
            return latestReleaseName
                .substring(0, latestReleaseName.indexOf(RELEASE_CANDIDATE))
                .split(".");
        }
        
        return latestReleaseName.split(".");
    }

    createReleaseCandidateNumber(latestReleaseName) {
        const isReleaseCandidate = latestReleaseName.includes(RELEASE_CANDIDATE);
        let releaseCandidateNumber = 1;
        if (isReleaseCandidate) {
            releaseCandidateNumber = parseInt(
                latestReleaseName.substring(latestReleaseName.indexOf(RELEASE_CANDIDATE), latestReleaseName.length - 1),
                10
            );

            releaseCandidateNumber = ++releaseCandidateNumber;
        }
        
        return releaseCandidateNumber;
    }

    /**
     * @param {String} url
     */
    setUrl(url) {
        this.url = url;
    }
}

module.exports = Release;