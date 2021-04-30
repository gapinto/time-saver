import VersionControl from '../domain/ports/VersionControl';
import fs from "fs";

class Git extends VersionControl {
    
    /**
     * 
     * @param {Object} container
     * @param {Object} container.shell
     * @param {Object} container.gitParameters
     */
    constructor({ shell, gitParameters }) {
        super();
        const { token, gitUrl, repoFolderPath } = gitParameters;

        this.shell = shell;
        this.token = token;
        this.gitUrl = gitUrl;
        this.repoFolderPath = repoFolderPath;
    }

    /**
     * @inheritdoc
     */
    _checkIfGitIsInstalled() {
        if (!this.shell.which('git')) {
            this.shell.echo('Sorry, this script requires git');
            this.shell.exit(1);
        }
    }

    /**
     * @inheritdoc
     */
    clone() {
        if (!fs.existsSync(this.repoFolderPath)) {
            this._checkIfGitIsInstalled();
            this.shell.rm('-rf', this.repoFolderPath);
            this.shell.exec(`git clone https://${this.token}@${this.gitUrl} ${this.repoFolderPath}`);
        }
    }

    /**
     * @inheritdoc
     */
    fetch() {
        this._checkIfGitIsInstalled();
        this.shell.exec(`git fetch`, { cwd: this.repoFolderPath });
    }

    /**
     * @inheritdoc
     */
    checkout(remoteBranch) {
        this._checkIfGitIsInstalled();
        this.shell.exec(`git checkout ${remoteBranch}`, { cwd: this.repoFolderPath });
    }

    /**
     * @inheritdoc
     */
    diff(targetBranch, fileName, regex, ignoreFirstLine = true) {
        this._checkIfGitIsInstalled();

        const grep = regex ? `| grep '${regex}'`: '';
        const withFirstLine = ignoreFirstLine? '-w --ignore-all-space' : '';
        return this.shell.exec(
            `git diff ${withFirstLine} origin/${targetBranch} ${fileName} ${grep}`,
            { cwd: this.repoFolderPath }
        ).toString().trim().split('\n');
    }

    /**
     * @inheritdoc
     */
    diffNameOnly(targetBranch) {
        this._checkIfGitIsInstalled();
        
        return this.shell.exec(
            `git diff origin/${targetBranch} --name-only`, 
            { cwd: this.repoFolderPath }
        ).toString().trim().split('\n');
    }

    /**
     * @inheritdoc
     */
    logByTag(initialTag, endTag, filters) {
        this._checkIfGitIsInstalled();

        const filtersConcatenated = filters.join('|')

        return this.shell.exec(
            `git log ${initialTag}..${endTag} | grep -i -r -w -E '${filtersConcatenated}'`, 
            { cwd: this.repoFolderPath }
        ).toString().trim().split('\n');
    }
}

module.exports = Git;
