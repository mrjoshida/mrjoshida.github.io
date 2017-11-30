#!/usr/bin/env node
/*
  Check whether package.json's version number contains a -cdo prerelease tag.
  This should run during the `npm version` step, and helps ensure we keep our
  version ids separate from the upstream project.
*/
var fs = require('fs');

try {
  var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  // If the version id starts with #.#.#-cdo then we're all good.
  if (/^\d+\.\d+\.\d+-cdo/.test(packageInfo.version)) {
    process.exit();
  }

  console.error('The version id "' + packageInfo.version + '" is not valid.');
  console.error('This package requires version ids to contain a "-cdo" tag, to keep them separate from the upstream project (e.g. "1.0.0-cdo").');
  process.exit(1);
} catch (e) {
  console.error('There was an error while checking the new version number: ' + e);
  process.exit(1);
}
