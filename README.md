Time Saver
=========

This tool is a simple way to generate release requests.

## Introduction

The motivation to build a tool like this came after creating several releases manually, we saw that we were always doing the same steps that could be reduced with a simple script. After documenting all the processes to create a release request, we saw that this documentation could be used as a requirement to build a tool to automatically generate our release.

## Release request process:

- [ ] Create a new branch from master
  - [ ] For a regular release the branch should be named release/x.y.z (for example “release/3.3.3”)
- [x] Go to GitHub to create a new RC (release candidate) tag
  - [x] Tag version: should be named x.y.z-rcw (for example “3.3.3-rc1")
  - [x] Target: The branch created on step 1
  - [x] Title: should be equal to the tag version
  - [x] Do not forget to mark “This is a pre-release” option (since this is still a release request)
- [ ] Adjust the rc tag description on github
  - [x] Copy the template from another release request
  - [ ] Do not forget to put: “Target Environment: STAGE” 
  - [x] Put all the related stories
  - [x] Put all the enhancements and bugs (P1, P2 or opened from a final user)
  - [ ] Click on “Publish Release”
- [x] Open the release request Pull Request
  - [x] Create a new pull request on GitHub
  - [x] Title: Release Request x.y.z (x.y.z-rcw), for example “Release Request 3.3.3 (3.3.3-rc1)”
  - [x] Base: stable
  - [x] Branch: The branch created on step 1
  - [x] Pull request body: Copy from another release request PR
  - [ ] Reviewers and assignees: Marcos Cavalcanti
  - [ ] Labels: release
  - [x] Do not forget to leave the “Green Light by QA” unchecked
  - [x] On the rollback plan the PR should be the last release request PR (the one that is on prod)
- [ ] Send the e-mail
  - [ ] Copy the whole PR created on step 4 and paste it on a new e-mail
  - [ ] Title: [Project] Release Request x.y.z (x.y.z-rcw), for example “[Project] Release Request 3.3.4 (3.3.4-rc1)”

## Plans
- Convert this code to typescript
- Cover it with automated tests
- Generate the FCS base on extracted radars
- Create the release branch
- Send an email to QA DRI using the PR template after PR build

## Architecture

As you can see it is a POC, but I have tried built it using some concepts of hexagonal architecture

Resuming we have:
- Application
  - We have application services, DTO and their validation, Unit of Work, etc.
  - Does not contains businnes logic, does not hold any state.
  - Coordinate behaviours of the DomainServices.
  - It should be used by presentation layer.
  - Does not return never ever Domain objects to outside world! Only returns DTO
- Domain
  - Here is the heart of the application
  - Entities, Aggregates, Aggregates Roots, Value Objects, Repositories Interfaces, Domain Services and Domain Events
  - It should not know about the application and infrastructure layer.
  - It should use ports (interfaces) instead of concrete classes
- Infrastructure
  - All output code should be placed here
  - Persistence, Sending Emails, Loggin, Cache, Client Libs
  - It should implements interfaces from the domain layer
  - Infrastructure is where we are implementing the interfaces exposed by the domain layer, so clients to use the database, S3, Github, git, etc. Should be used here.

We are using `Github API` to create releases and pull requests, but with this structure, we can easily change it to use `Github Command Line`, what we need is just implements `PlatformRepository` and inject this new way to crate releases without change anything else in the core domain.

## Requiriments

- All PR must be merged with a tag `[STORY]` or `[FCS]`
- We are using the last tag name to generate a new release, so make sure that your tag name has this format 3.6.0 (major.minor.patch)

## Usage

We have created an endpoint to this tool, but in the future, we are planning to make it via command line as well:

POST
`http://localhost:3333/release-requests`

Body:
```
{
    "releaseBranch" : "release/test", 
    "targetBranch" : "main",
    "releaseType" : "minor"
}
```

Where will be opened a pull request from `releaseBranch` to `targetBranch`, and release type should be `major`, `minor` or `patch`, that will be used to generate the name of the next release.

## How it works

- We are:
  - Getting all changes from the last tag until now
  - Creating a new release based on `releaseType` and the previous tag name
  - Extracting all information from git log
  - And finalizing creating a PR 
