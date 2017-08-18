# @delucis/reading-data-yaml-loader

[![Build Status](https://travis-ci.org/delucis/reading-data-yaml-loader.svg?branch=master)](https://travis-ci.org/delucis/reading-data-yaml-loader)
[![Coverage Status](https://coveralls.io/repos/github/delucis/reading-data-yaml-loader/badge.svg?branch=master)](https://coveralls.io/github/delucis/reading-data-yaml-loader?branch=master)
[![npm (scoped)](https://img.shields.io/npm/v/@delucis/reading-data-yaml-loader.svg)](https://www.npmjs.com/package/@delucis/reading-data-yaml-loader)

A plugin for [`@delucis/reading-data`](https://github.com/delucis/reading-data)
that loads YAML files over the network or from the local file system.


## Installation

```sh
npm install --save @delucis/reading-data-yaml-loader
```


## Usage

```js
const RD = require('@delucis/reading-data')
const YAML_LOADER = require('@delucis/reading-data-yaml-loader')

RD.use(YAML_LOADER, {
  scope: 'myYAMLFile',
  path: 'https://unpkg.com/@delucis/reading-data/.travis.yml'
})

RD.run().then((res) => {
  console.log(res.data.myYAMLFile)
})
```

Using `reading-data-yaml-loader` to load multiple files:

```js
RD.use(YAML_LOADER, {
  scope: [local, github, unpkg]
  path: {
    local: 'config.yml',
    github: 'https://raw.githubusercontent.com/delucis/reading-data/master/.travis.yml',
    unpkg: 'https://unpkg.com/@delucis/reading-data/.travis.yml'
  }
})

RD.run().then((res) => {
  for (var key in res.data) {
    console.log(key) // 'local', 'github', 'unpkg'
  }
})
```


## Options

name    | type                 | default       | required? | description
--------|----------------------|---------------|:---------:|-------------------------------------------------------------------------------------------------------------------------------------------
`hooks` | `String`, `Object` |               |           | The `reading-data` hook that should load the YAML file. Can be scoped by passing an object with scopes as keys, hooks as values.
`path`  | `String`, `Object` |               |     ✔︎     | The path or URL of the YAML file to load. Can be an object, where the keys match the scope(s) set in the `scope` option.
`scope` | `String`, `Array`  | 'yaml-loader' |           | The scope under which `reading-data` will store this plugin’s data. Can be an array to return multiple filepaths/URLs, to multiple scopes.
