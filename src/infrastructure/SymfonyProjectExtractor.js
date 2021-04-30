import ProjectExtractor from "../domain/ports/ProjectExtractor";
import VersionControl from "../domain/ports/VersionControl";

class SymfonyProjectExtractor extends ProjectExtractor {

    /**
     * @param {Object} container 
     * @param {VersionControl} container.versionControl
     * @param {Object} container.projectExtractorParameters
     */
    constructor({ versionControl, projectExtractorParameters }) {
        super();
        const { migrationsFilterPath } = projectExtractorParameters;
        this.migrationsFilterPath = migrationsFilterPath;
        this.versionControl = versionControl;
    }

    /**
     * @param {Array} changeSets 
     * @param {String} text 
     */
    __filterChanges(changeSets, text) {
        return changeSets.filter((change) => change.toLowerCase().includes(text)).length > 0;
    }

    /**
     * @param {Array} changeSets 
     */
    extractCommand(changeSets) {
        return this.__filterChanges(changeSets, "command");
    }

    /**
     * @param {Array} changeSets 
     */
    extractElastic(changeSets) {
        return this.__filterChanges(changeSets, "elastic");
    }

    /**
     * 
     * @param {String} targetBranch 
     */
    extractMigration(targetBranch) {
        const breakPoint = "#finish";
        const isComment = (change) => change.includes('/**') || change.includes('*') || change.includes('*/');
        const conditions = (change) => (change.includes('Version') || isComment(change)) && !change.includes('class');
        const clearResult = (changes) => changes.replace(/#finish/g, "").replace(/\+/g, '');
        
        const result = this.versionControl.diff(targetBranch, this.migrationsFilterPath, "+", false)
            .filter(conditions)
            .reduce((previousValue, actualValue, currentIndex, changeSets) => {
                if (actualValue.includes('Version') && actualValue.endsWith(".php")) {
                    const versionPath = changeSets[currentIndex];
                    const versionName = versionPath
                        .substring(versionPath.indexOf('Version'), versionPath.indexOf('.php'));
                    return `${previousValue} \n - ${versionName}`;
                }
    
                if (previousValue.endsWith(breakPoint)) {
                    return previousValue;
                }
    
                if (actualValue.includes('/**')) {
                    return previousValue;
                }
    
                if (actualValue.includes('*/')) {
                    return `${previousValue} ${breakPoint}`;
                }

                const comment = actualValue.replace('*', '');
                const isBlankLine = comment.replace('+', '').trim().length === 0;
                if (isBlankLine) {
                    return previousValue;
                }
    
                return `- ${previousValue} \n     - ${comment}`; 
                
            }, '');
    
        return clearResult(result);
    }

    /**
     * @param {String} targetBranch
     */
    extractParameters(targetBranch) {
        const regex = "+    ";
        const fileName = "./backend/app/config/parameters.yml.dist";
        return this.versionControl.diff(targetBranch, fileName, regex)
                .map((parameter) => {
                    const newParameter = parameter.replace(regex, '')
    
                    return `- \`${newParameter}\` `;
                })
                .join('\n');
    }
}

module.exports = SymfonyProjectExtractor;