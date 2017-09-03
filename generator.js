/**
 * Generate syntax/cloudformation.vim syntax file based on the config file syntax_mapping.yml
 *
 * @author Niykle Nguyen <NLKNguyen@MSN.com>
 * @origin https://github.com/NLKNguyen/cloudformation-syntax.vim
 * @license MIT
 */

// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html
const YAML = require('yamljs')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')


// Import resources.json for resource names and their property names
const resources_json_path = path.join(__dirname, 'cloudformation-doc-scraper', 'resources.json')
const resources = JSON.parse(fs.readFileSync(resources_json_path, 'utf8'))
const all_resources = _.map(resources, 'resource')
const all_properties = _.flatMap(resources, 'properties')

// Import parameters.json for property names of parameters
const parameters_json_path = path.join(__dirname, 'cloudformation-doc-scraper', 'parameters.json')
const parameters = JSON.parse(fs.readFileSync(parameters_json_path, 'utf8'))
const all_parameter_properties = _.map(parameters, 'property')

// Read syntax_mapping.yml
const syntaxMapping = YAML.load('syntax_mapping.yml')

// Update using data from imported json
// syntaxMapping['CfmYamlResourceProperty'].matches = all_properties.join(' ')
syntaxMapping['CfmYamlResourceName'].matches = all_resources.join(' ')
// syntaxMapping['CfmYamlGeneralProperty'].matches = all_parameter_properties.join(' ')
// console.log(syntaxMapping)

const lines = []
lines.push(`
" This is an automatically generated syntax file created on ${(new Date()).toUTCString()}
" Origin: https://github.com/NLKNguyen/cloudformation-syntax.vim
set ft=yaml
`)

const syntaxKeywords = []
const highlightLinks = []

_.forOwn(syntaxMapping, (group, name) => {
  const keywords = group['keywords']
  let keywordsList = []
  if (!_.isEmpty(keywords)) {
    keywordsList = keywords.split(/[\s\n]+/).filter(Boolean)
  }

  const matches = group['matches']
  let matchesList = []
  if (!_.isEmpty(matches)) {
    matchesList = matches.split(/[\s\n]+/).filter(Boolean)
  }
  const highlight_link = group['highlight_link']
  const contained_in = group['contained_in']


  _.forEach(matchesList, match => { 
    let postFix = ''
    if (!_.isEmpty(contained_in)) {
      postFix = `contained containedin=${ contained_in }`
    }
    lines.push(`syn match ${name} "\\<${match}\\>" ${postFix}`)
  })

  if (!_.isEmpty(keywordsList)) {
    lines.push(String.raw`syn keyword ${name} ${ keywordsList.join(' ') }`)
  }

  highlightLinks.push(`hi link ${name} ${highlight_link}`)
})


lines.push(...syntaxKeywords)
lines.push(...highlightLinks)

console.log(lines.join('\n'))

