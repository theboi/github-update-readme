const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

(async () => {
  try {
    const postCount = 6
    const username = process.env.GITHUB_REPOSITORY.split("/")[0]
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1]
    const getReadme = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
    })
    const sha = getReadme.data.sha

    // const currentContent = Buffer.from(getReadme.data.content, "base64").toString('utf8')
    // const projectsContent = currentContent.split("---\n")[1].split("\n")

    let recentRepos = new Set()
    for (let i = 0; recentRepos.size < postCount && i < 10; i++) {
      const getActivity = await octokit.request(`GET /users/{username}/events?per_page=100&page=${i}`, {
        username: username,
      })
      for (const value of getActivity.data) {
        recentRepos.add(value.repo.name)
        if (recentRepos.size >= postCount) break
      }
    }
    const isDisplayImageAvailable = await recentRepos.map(async (value) => {
      return await octokit.request('/repos/{owner}/{repo}/contents/{path}', {
        owner: value.split("/")[0],
        repo: value.split("/")[1],
        path: "DISPLAY.jpg"
      }).catch((e) => {
        if (e.status === "404") return `${username}/${repo}`
      }).then(() => value)
    }) 

    // DO NOT FORMAT `data` BELOW.
    const data = `
## ${core.getInput('title')}

${core.getInput('subtitle')}

---

||||
| :-: | :-: | :-: |
${chunkArray(Array.from(recentRepos), 3).map((value) => {
      return `| ${value.map(value => ` **[${value}](https://github.com/${value})** |`)}
  | ${value.map((value) => {
        return ` <a href="https://github.com/${value}"><img src="https://github.com/${value}/raw/master/DISPLAY.jpg" alt="${value}" title="Cover Image" width="150" height="150"></a> |`
      })}\n`
    }).toString().replace(/,/g, "")}

---

[//]: # (BREAK)

**${core.getInput('footer')}**
`

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

const chunkArray = (array, size) => {
  let chunked = []
  let index = 0
  while (index < array.length) {
    chunked.push(array.slice(index, size + index))
    index += size
  }
  return chunked
}