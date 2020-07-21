# github-update-readme

## About

This GitHub Action updates the README.md file of a repository to show latest activity from a GitHub user.

## Inputs

### `header`

**Required** The header of your README.md. Default `""`.

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

## Outputs

### `repositories`

Array of recent repositories put up on the README.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
who-to-greet: 'Mona the Octocat'

Note: Due to GitHub's API rate-limiting, this GitHub Action will, at most, only check your 1000 most recent activities.
