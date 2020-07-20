const core = require("@actions/core");
const github = require("@actions/github");
const axios = require('axios');

try {
  const data = `
## ${core.getInput('title')}
  
### ${core.getInput('subtitle')}
`

  console.log(data)
  console.log("Username ", core.getInput('username'))
  console.log("Repo ", process.env.GITHUB_REPOSITORY)

  octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: core.getInput('username'),
    repo: process.env.GITHUB_REPOSITORY,
    path: core.getInput('path'),
    message: '(Automated) Update README.md',
    content: data,
    committer: {
      name: core.getInput('username'),
      email: ''
    }
  }).then(response => {
    console.log("res ", response)
  })

} catch (e) {
  console.error(e)
  core.setFailed(e.message)
}