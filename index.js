const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

(async () => {
  try {
    // DO NOT FORMAT `data` BELOW.
    const data =
      `## ${core.getInput('title')}

### ${core.getInput('subtitle')}

---

| visual-algo |
| :-: |
| image |

---

[//]: # (BREAK)

${core.getInput('footer')}

`
    const username = process.env.GITHUB_REPOSITORY.split("/")[0]
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1]
    const getReadme = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
    })
    const sha = getReadme.data.sha
    const currentContent = Buffer.from(getReadme.data.content, "base64").toString('utf8')

    const projectsContent = currentContent.split("---\n")[1].split("\n")

    const getActivity = await octokit.request('GET /users/{username}/events', {
      username: username,
    })
    const recentRepos = getActivity.map(value => value.data.repo)
    console.log('recentRepos', recentRepos);

    console.log('getActivity', getActivity)

    const putReadme = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
      message: '(Automated) Update README.md',
      content: Buffer.from(data, "utf8").toString('base64'),
      sha: sha,
      committer: {
        name: "Ryan The",
        email: "ryan.the.2006@gmail.com"
      }
    })
    console.log("RESPONSE: ", putReadme)

  } catch (e) {
    console.error(e)
    core.setFailed(e.message)
  }
})()