'use strict'

const DESCRIBE = require('mocha').describe
const BEFORE_EACH = require('mocha').beforeEach
const IT = require('mocha').it
const EXPECT = require('chai').expect
const READING_DATA = require('@delucis/reading-data')
const RD_YAML_LOADER = require('../index')

BEFORE_EACH(function () {
  READING_DATA.uninstall()
  READING_DATA.clean()
})

DESCRIBE('ReadingDataYAMLLoader', function () {
  this.timeout(20000)

  IT('should be an object', function () {
    EXPECT(RD_YAML_LOADER).to.be.an('object')
  })

  IT('should throw an error if not configured with a path', async function () {
    let testScope = 'noPathTest'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should throw an error if passed an invalid path', async function () {
    let path = 256
    let testScope = 'invalidPathIsANumber'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should load a local YAML file if path is not HTTP(S)', async function () {
    let path = '.travis.yml'
    let testScope = 'localPackageYAML'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should load a remote YAML file over HTTPS', async function () {
    let path = 'https://raw.githubusercontent.com/delucis/reading-data/master/.travis.yml'
    let testScope = 'secureGithubTravisYAMLTest'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should follow a 301 redirect', async function () {
    let path = 'http://raw.githubusercontent.com/delucis/reading-data/master/.travis.yml'
    let testScope = 'redirectToGithubTravisYAMLTest'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
  })

  IT('should load multiple paths to multiple scopes', async function () {
    let testScope1 = 'multiScopeSecureGithubTravisYAMLTest'
    let testScope2 = 'multiScopeLocalYAML'
    let testScopes = [testScope1, testScope2]
    let path = {
      [testScope1]: 'https://raw.githubusercontent.com/delucis/reading-data/master/.travis.yml',
      [testScope2]: '.travis.yml'
    }
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScopes,
      path
    })
    await READING_DATA.run()
    for (let scope of testScopes) {
      EXPECT(READING_DATA.data).to.have.property(scope)
    }
  })

  IT('should throw an error if loading a non-YAML resource', async function () {
    let testScope = 'nonYamlURITest'
    let path = 'https://github.com'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should throw an error if loading a local file that doesn’t exist', async function () {
    let path = 'this-file-probably-doesn’t-exist.yml'
    let testScope = 'nonexistentLocalYAMLFile'
    READING_DATA.use(RD_YAML_LOADER, {
      scope: testScope,
      path
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })
})
