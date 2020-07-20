# github-update-readme

## About

This GitHub Action updates the README.md file of a repository to show latest activity from a GitHub user.

## Inputs

### `username`

**Required** Your GitHub username. Default `""`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  who-to-greet: 'Mona the Octocat'

Note: Due to GitHub's API rate-limiting, this GitHub Action will, at most, only check your 1000 most recent activities.