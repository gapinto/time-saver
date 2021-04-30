class PullRequest {

    /**
     * 
     * @param {String} title 
     * @param {String} body 
     * @param {String} fromBranch 
     * @param {String} intoBranch 
     */
    constructor(title, body, fromBranch, intoBranch) {
        this.title = title;
        this.body = body;
        this.fromBranch = fromBranch;
        this.intoBranch = intoBranch;
    }

    /**
     * 
     * @param {String} url 
     */
    setUrl(url) {
        this.url = url;
    }
}

module.exports = PullRequest;