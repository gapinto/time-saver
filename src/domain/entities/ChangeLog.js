const STORY = 'STORY';
const ENH = 'ENH';
const BUG = 'BUG';
const FCS = 'FCS';

class ChangeLog {

    constructor() {
        this.stories = [];
        this.enhancements = [];
        this.bugs = [];
    }

    static get story() {
        return STORY;
    }

    static get enh() {
        return ENH;
    }

    static get bug() {
        return BUG;
    }

    static get fcs() {
        return FCS;
    }

    checkIfRadarExists(radars, newRadar) {
        let exist = false;
        const radarNumber = newRadar.match("rdar:\/\/[0-9]+") || newRadar.match("rdar:\/\/problem\/[0-9]+");

        if (radarNumber) {
            exist = radars.some((radar) => radar.includes(radarNumber.join("")));
        }
        
        return exist;
    }

    addBug(bug) {
        if (!this.checkIfRadarExists(this.bugs, bug)) {
            this.bugs.push(bug);
        }
    }

    addEnhancement(enhancement) {
        if (!this.checkIfRadarExists(this.enhancements, enhancement)) {
            this.enhancements.push(enhancement);
        }
    }

    addStory(story) {
        if (!this.checkIfRadarExists(this.stories, story)) {
            this.stories.push(story);
        }
    }

    format() {
        const formatStories = () => {
            if (this.stories.length) {
                const stories = this.stories.join('\n - ');
                return `### Stories \n - ${stories} \n`;
            }

            return '';
        }

        const formatBugs = () => {
            if (this.bugs.length) {
                const bugs = this.bugs.join('\n - ');
                return `### Fixes \n - ${bugs} \n`;
            }

            return '';
        }

        const formatEnhancements = () => {
            if (this.enhancements.length) {
                const enhancements = this.enhancements.join('\n - ');
                return `### Enhancements  \n - ${enhancements} \n`;
            }

            return '';
        }

        return formatStories() + formatEnhancements() + formatBugs();
    }
}

module.exports = ChangeLog;
