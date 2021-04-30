class ProjectExtractor {
    constructor() {}

    /**
     * 
     * @param {String} changeSets 
     */
    extractCommand(changeSets){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * 
     * @param {String} changeSets 
     */
    extractElastic(changeSets) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * 
     * @param {String} targetBranch 
     */
    extractMigration(targetBranch) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * 
     * @param {String} targetBranch 
     */
    extractParameters(targetBranch) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ProjectExtractor;