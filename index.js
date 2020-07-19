const core = require("@actions/core");
const github = require("@actions/github");

try {
  core.debug(`## ${core.getInput('title')}

  ### ${core.getInput('subtitle')}
  `);

  console.log(`## ${core.getInput('title')}

  ### ${core.getInput('subtitle')}
  `)

  core.setOutput("string", `## ${core.getInput('title')}

  ### ${core.getInput('subtitle')}
  `);
} catch(e) {
  console.error(e)
  core.setFailed(e.message)
}