const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

try {
  const data = `
## ${core.getInput('title')}
  
### ${core.getInput('subtitle')}
`

  const username = process.env.GITHUB_REPOSITORY.split("/")[0]
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1]
  const sha = process.env.GITHUB_SHA

  console.log(data)
  console.log("Username2 ", username)
  console.log("Repo2 ", repo)

  octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: username,
    repo: repo,
    path: core.getInput('path'),
    message: '(Automated) Update README.md',
    content: data,
    sha: sha,
  }).then(response => {
    console.log("res ", response)
  }).catch(e => {
    console.error(e)
  })

} catch (e) {
  console.error(e)
  core.setFailed(e.message)
}