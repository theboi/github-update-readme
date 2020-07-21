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

### `postCount`

Number of repositories to load. Default `"6"`.

### `postsPerRow`

Number of repositories to load per row. Default `"3"`.

## Environment Inputs

### `GITHUB_TOKEN`

**Required** Just use this: `${{ secrets.GITHUB_TOKEN }}`

## Outputs

### `repositories`

Array of recent repositories put up on the README.

## Example usage

uses: theboi/github-update-readme@master
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
with:
  header: "Hey, I'm Ryan! 👋"
  subhead: "Currently a student in Singapore, passionate about creating all-things-tech to improve society."
  footer: "**Learn more about me at [ryanthe.com](https://www.ryanthe.com)!**"

## Note

- Due to GitHub's API rate-limiting, this GitHub Action will, at most, only check your 1000 most recent activities.
- This is also my first GitHub action so apoplogies if its pretty bad... 😓
- Feel free to suggest improvements/submit a PR. Thanks!