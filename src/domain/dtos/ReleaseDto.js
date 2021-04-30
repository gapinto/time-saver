class ReleaseDTO {

    /**
     * @param {String} name 
     * @param {String} url 
     * @param {String} tag
     */
    constructor(name, url, tag) {
        this.name = name;
        this.url = url;
        this.tag = tag;
    }
}

module.exports = ReleaseDTO;
