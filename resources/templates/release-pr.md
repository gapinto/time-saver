### General Information
-----------
#### Tag to be deployed
- **{{releaseName}}**, which will be created on `{{targetBranch}}` branch after this PR is merged.

#### Green Light by QA
- [ ] STAGE {{responsibleQA}} 

#### FCS
- TODO rdar://66575290 ([FCS] GoLive Version 3.3.6)

**Note:** Check related radars for complete list of stories, bug fixes and enhancements this version contains.

#### PR link
- {{prlink}} TODO update after PR creation

#### RC tag
- https://repository.url/releases/tag/{{releaseCandidateName}}

### Content
-----------
{{{changeLog}}}

### Pre-Deploy
-----------
#### Environment Variables
{{{parameters}}}

#### Downtime Notice
- {{downtimeNotice}}

#### DB Backup
- {{dbBackup}}

### Deploy
-----------
#### Migrations
{{{migrations}}}

#### Elastic Search Reindexing
- {{elasticSearchReindexing}}

### Post-Deploy
-----------
#### Obfuscated PR
- {{obfuscatedPr}} TODO How Can I implement it?

#### Commands
- {{commands}}

#### Help
-  TODO change PR link [#xx](https://github)

#### Rollback Plan
- Rollback to {{latestReleaseName}} code.
- Current Version: {{{latestReleaseUrl}}}
