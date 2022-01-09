# Purpose

This is a spot check test project. Started with:

```shell
npm init vite@latest examples -- --template react # from react-a11y-dialog top-level
```

## Setup

- From top-level `react-a11y-dialog` run `npm run build && npm pack`
- From this directory (`./examples`) run `npm i TAR_GZ_OUTPUT_FROM_LAST_CMD`
For example `npm i ../react-a11y-dialog-6.1.3.tgz`
This will create something like following in the package.json:
`"react-a11y-dialog": "file:../react-a11y-dialog-6.1.3.tgz",`
- `yarn dev` to run

