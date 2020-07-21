const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

(async () => {
  try {
    const postCount = parseInt(core.getInput('postCount'))
    const postPerRow = parseInt(core.getInput('postsPerRow'))
    const username = process.env.GITHUB_REPOSITORY.split("/")[0]
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1]
    const getReadme = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
    })
    const sha = getReadme.data.sha

    let recentRepos = new Set()
    for (let i = 0; recentRepos.size < postCount && i < 10; i++) {
      const getActivity = await octokit.request(`GET /users/{username}/events?per_page=100&page=${i}`, {
        username: username,
      })
      for (const value of getActivity.data) {
        let activityRepo = value.repo.name
        if (value.type === "ForkEvent") activityRepo = value.payload.forkee.full_name
        recentRepos.add(activityRepo)
        if (recentRepos.size >= postCount) break
      }
    }

    // DO NOT FORMAT `data` BELOW.
    const data = `
## ${core.getInput('title')}

${core.getInput('subtitle')}

---

||||
| :-: | :-: | :-: |
${chunkArray(Array.from(recentRepos), postPerRow).map((value) => {
      return `| ${value.map(value => ` **[${value}](https://github.com/${value})** |`)}
  | ${value.map((value) => {
        return ` <a href="https://github.com/${value}"><img src="https://github.com/${value}/raw/master/DISPLAY.jpg" alt="${value}" title="${value}" width="150" height="150"></a> |`
      })}\n`
    }).toString().replace(/,/g, "")}

---

[//]: # (BREAK)

${core.getInput('footer')}
`

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
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

  } catch (e) {
    console.error(e)
    core.setFailed(e.message)
  }
})()

const chunkArray = (array, size) => {
  let chunked = []
  let index = 0
  while (index < array.length) {
    chunked.push(array.slice(index, size + index))
    index += size
  }
  return chunked
}