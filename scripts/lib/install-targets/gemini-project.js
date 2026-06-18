const { createInstallTargetAdapter } = require('./helpers');

module.exports = createInstallTargetAdapter({
  id: 'gemini-project',
  target: 'gemini',
  kind: 'project',
  rootSegments: ['.gemini'],
  installStatePathSegments: ['efa-install-state.json'],
  nativeRootRelativePath: '.gemini',
});
