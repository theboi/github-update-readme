const core = require("@actions/core");
const { Octokit } = require('@octokit/core')
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

(async () => {
  try {
    const repoCount = parseInt(core.getInput('repoCount'))
    const reposPerRow = parseInt(core.getInput('reposPerRow'))
    const username = process.env.GITHUB_REPOSITORY.split("/")[0]
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1]
    const getReadme = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
    }).catch(e => {
      console.error("Failed: ", e)
      core.setFailed("Failed: ", e.message)
    })
    const sha = getReadme.data.sha

    let recentReposHaveImage = []
    let recentRepos = new Set()
    for (let i = 0; recentRepos.size < repoCount && i < 10; i++) {
      const getActivity = await octokit.request(`GET /users/{username}/events?per_page=100&page=${i}`, {
        username: username,
      }).catch(e => {
        console.error("Failed: ", e)
        core.setFailed("Failed: ", e.message)
      })
      for (const value of getActivity.data) {
        let activityRepo = value.repo.name
        if (value.type === "ForkEvent") activityRepo = value.payload.forkee.full_name
        recentRepos.add(activityRepo)
        await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: activityRepo.split("/")[0],
          repo: activityRepo.split("/")[1],
          path: 'DISPLAY.jpg',
        }).then(() => {
          recentReposHaveImage.push(true)
        }).catch(e => {
          recentReposHaveImage.push(false)
        })
        
        if (recentRepos.size >= repoCount) break
      }
    }

    // DO NOT FORMAT `data` BELOW.
    const data = core.getInput("customReadmeFile").replace(/\${\w{0,}}/g, (match) => {
      switch (match) {
        case "${repoTable}": return chunkArray(Array.from(recentRepos), reposPerRow).map((value, row) => {
          console.log("recentRosveImage", recentReposHaveImage)
          return `|${value.map(value => ` [${value}](https://github.com/${value}) |`)}
|${value.map(() => ` :-: |`)}
|${value.map((value, col) => ` <a href="https://github.com/${value}"><img src="https://github.com/${recentReposHaveImage[row*reposPerRow+col] ? value : `${username}/${repo}`}/raw/master/DISPLAY.jpg" alt="${value}" title="${value}" width="150" height="150"></a> |`
          )}\n\n`
        }).toString().replace(/,/g, "")
        case "${header}": return core.getInput('header')
        case "${subhead}": return core.getInput('subhead')
        case "${footer}": return core.getInput('footer')
        default:
          console.error(`${match} is not recognised`)
          return ""
      }
    })

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo: repo,
      path: core.getInput('path'),
      message: '(Automated) Update README.md',
      content: Buffer.from(data, "utf8").toString('base64'),
      sha: sha,
    }).then(() => {
      core.setOutput("repositories", Array.from(recentRepos))
    }).catch((e) => {
      console.error("Failed: ", e)
      core.setFailed("Failed: ", e.message)
    })

  } catch (e) {
    console.error("Failed: ", e)
    core.setFailed("Failed: ", e.message)
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