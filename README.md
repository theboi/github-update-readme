# github-update-readme

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![Example of profile README](https://raw.githubusercontent.com/theboi/github-update-readme/master/example.png)

## About

This GitHub Action updates your profile README.md to show your latest activity.

## Inputs

### `header`

**Required** The header of your README.md. Markdown supported.

### `subhead`

The subheader of your README.md. Markdown supported. Default `""`.

### `footer`

The footer of your README.md. Markdown supported. Default `""`.

### `path`

Path of your README.md file. Default `"README.md"`.

### `repoCount`

Number of repositories to load. Default `"6"`.

### `reposPerRow`

Number of repositories to load per row. Default `"3"`.

### `imageSize`

Length (in pixels) of each side of the square image. Default `"150"`.

### `excludeActivity`

Types of event to exclude from the recent activity table in a **JSON array**. Recent events, such as `"PushEvent"` or `"ForkEvent"`, can be found at https://api.github.com/users/{username}/events, replacing `username` with your username. Example input would be `'["WatchEvent", "ForkEvent"]'`. Default `"[]"`.

### `customReadmeFile`

Customise the README.md file format without forking this repository. Markdown supported.

Use these reserved strings wrapped in `${` and `}` (For instance, `${header}`) to reference certain content:
- `repoTable`: Set of tables with most recent repository activity.
- `header`
- `subhead`
- `footer`

```yaml
Default: |
  ## ${header}
      
  ${subhead}

  ---
      
  ${repoTable}
      
  ---
      
  ${footer}
```

Note: `|` denotes a multiline string block in YAML. Ensure you indent properly when setting this.

## Environment Inputs

### `GITHUB_TOKEN`

**Required** Set this to: `${{ secrets.GITHUB_TOKEN }}`

## Outputs

### `repositories`

Array of recent repositories to be displayed on your profile README.md.

## Example usage

- Article on Medium: https://medium.com/@theboi/how-to-dynamically-update-your-github-profile-readme-using-github-actions-684be5db9932
- Create a repository named your username, add a `README.md` file.
- Create a workflow and paste this under `steps`:
```yaml
- name: Update GitHub Profile README
  uses: theboi/github-update-readme@v1.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    header: "Hey, I'm Ryan! 👋"
    subhead: "Currently a student in Singapore, passionate about creating all-things-tech to improve society."
    footer: "**Learn more about me at [ryanthe.com](https://www.ryanthe.com)!**"
```
- You might want to schedule this to run every 10 mins, paste this under `on`:
```yaml
schedule:
  - cron: "*/10 * * * *"
```
- This will now run and fetch repositories you were most recently active on, every 10 mins.
- **Important** Add a `DISPLAY.jpg` to your repositories (including username/username) to show in the table. If image does not exist, will default to `DISPLAY.jpg` on username/username.

## Note

- Due to GitHub's API rate-limiting, this GitHub Action will, at most, only check your 1000 most recent activities.
- This is also my first GitHub Action so feel free to suggest improvements/submit a PR. Thanks!