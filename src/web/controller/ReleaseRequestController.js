import bodyParser from 'body-parser';
import { route, POST, before } from 'awilix-router-core';
import ReleaseRequestService from '../../application/ReleaseRequestService';

@route('/release-requests')
export default class ReleaseRequestController {

    /**
     * @param {Object} container
     * @param {ReleaseRequestService} container.releaseRequestService 
     */
    constructor({ releaseRequestService }) {
        this.releaseRequestService = releaseRequestService;
    }

    @POST()
    @before([bodyParser.json()])
    async createReleaseRequest(request, res) {
        const {
            releaseBranch,
            targetBranch,
            releaseType
        } = request.body;

        const releaseRequest = await this.releaseRequestService.createReleaseRequest(
            releaseType, 
            releaseBranch, 
            targetBranch
        );
        
        res.status(201).send({
            releaseUrl: releaseRequest.release.url,
            pullRequestUrl: releaseRequest.pullRequest.url
        });
    }

}