class Tag {

    /**
     * @param {String} name 
     * @param {String} commitId 
     */
    constructor(name, commitId) {
        this.name = name;
        this.commitId = commitId;
    }
}

module.exports = Tag;