import { createContainer, asClass, asValue, InjectionMode} from 'awilix';
import fs from 'fs';
import yaml from 'js-yaml';

import Git from './infrastructure/Git';
import GitHubRepository from './infrastructure/GitHubRepository';
import shell from 'shelljs';
import SymfonyProjectExtractor from './infrastructure/SymfonyProjectExtractor';
import CreateNewPullRequest from './domain/useCases/CreateNewPullRequest';
import CreateNewRelease from './domain/useCases/CreateNewRelease';
import GenerateChangeLog from './domain/useCases/GenerateChangeLog';
import ReleaseRequestPipelineService from './domain/services/ReleaseRequestPipelineService';
import { Octokit } from '@octokit/core';
import ReleaseRequestService from './application/ReleaseRequestService';

const getParameters = () => {
    const fileContents = fs.readFileSync(__dirname + `/../config/parameters.yaml`, 'utf8');
    return yaml.safeLoad(fileContents);
}

const parameters = getParameters();
const container = createContainer({
    injectionMode: InjectionMode.PROXY  
});

// config
container.register({
    gitHubParameters: asValue(parameters.gitHub),
    gitParameters: asValue(parameters.git),
    projectExtractorParameters: asValue(parameters.projectExtractor),
    prTemplateParameters: asValue(parameters.prTemplate)
});

// domain::useCases
container.register({
    createNewPullRequest: asClass(CreateNewPullRequest).singleton(),
    createNewRelease: asClass(CreateNewRelease).singleton(),
    generateChangeLog: asClass(GenerateChangeLog).singleton(),
});

// domain::service
container.register({
    releaseRequestPipelineService: asClass(ReleaseRequestPipelineService).singleton()
});

// application::service
container.register({
    releaseRequestService: asClass(ReleaseRequestService).singleton()
});

// infrastructure
container.register({
    versionControl: asClass(Git).singleton(),
    platformRepository: asClass(GitHubRepository).singleton(),
    projectExtractor: asClass(SymfonyProjectExtractor).singleton(),
    octokit: asClass(Octokit).singleton()
});

container.register({
    shell: asValue(shell)
});

module.exports = container;
