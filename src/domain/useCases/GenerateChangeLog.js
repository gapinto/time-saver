import VersionControl from "../ports/VersionControl";
import ChangeLog from "../entities/ChangeLog";

class GenerateChangeLog {

    /**
     * @param {Object} container 
     * @param {VersionControl} container.versionControl
     */
    constructor({ versionControl }) {
        this.versionControl = versionControl;
    }

    generate(releaseBranch, initialTag, endTag, filters) {
        this.versionControl.checkout(releaseBranch);
        this.versionControl.fetch();
        console.log("initialTag: "+ initialTag);
        console.log("endTag: "+ endTag);
        const logs = this.versionControl.logByTag(initialTag, endTag, filters);
        const changeLog = logs.reduce((changeLog, log) => {
            const cleanedLog = log.replace('(standard input):    ', '').replace('-', '').replace('*', '');

            if (cleanedLog.includes(ChangeLog.story)) {
                changeLog.addStory(cleanedLog);
            }

            if (cleanedLog.includes(ChangeLog.enh)) {
                changeLog.addEnhancement(cleanedLog);
            }

            if (cleanedLog.includes(ChangeLog.bug)) {
                changeLog.addBug(cleanedLog);
            }

            return changeLog;
            
        }, new ChangeLog());

        return changeLog.format();
    }
}

module.exports = GenerateChangeLog;
