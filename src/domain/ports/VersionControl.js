class VersionControl {
    constructor() {}

    clone() {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    fetch() {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {String} remoteBranch
     */
    checkout(remoteBranch) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {String} targetBranch 
     * @param {String} fileName 
     * @param {String} regex 
     * @param {String} path 
     * @param {Boolean} ignoreFirstLine 
     */
    diff(targetBranch, fileName, regex, path, ignoreFirstLine = true) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {String} targetBranch 
     */
    diffNameOnly(targetBranch) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    /**
     * @param {String} initialTag 
     * @param {String} endTag 
     * @param {String} filters 
     */
    logByTag(initialTag, endTag, filters) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = VersionControl;
