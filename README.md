# github-update-readme

## About

This GitHub Action updates the README.md file of a repository to show latest activity from a GitHub user.

## Inputs

### `header`

**Required** The header of your README.md.

### `subhead`

The subheader of your README.md. Default `""`.

### `footer`

The footer of your README.md. Default `""`.

### `path`

Path of your README.md file. Default `"README.md"`.

### `repoCount`

Number of repositories to load. Default `"6"`.

### `reposPerRow`

Number of repositories to load per row. Default `"3"`.

### `customReadmeFile`

Customise the README.md file format without forking this repository. Use these reserved strings wrapped in `${` and `}` (For instance, `${header}`) to reference certain content:
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
- **Important** Add a `DISPLAY.jpg` to your repositories to show in the table.

## Note

- Due to GitHub's API rate-limiting, this GitHub Action will, at most, only check your 1000 most recent activities.
- This is also my first GitHub Action so feel free to suggest improvements/submit a PR. Thanks!