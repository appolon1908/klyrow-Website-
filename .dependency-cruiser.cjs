module.exports = {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'ui-no-server',
      severity: 'error',
      from: { path: '^apps/web/app' },
      to: { path: '^apps/web/server' },
    },
    {
      name: 'services-no-vue',
      severity: 'error',
      from: { path: '/services/' },
      to: { path: '\\.vue$' },
    },
    {
      name: 'api-through-services',
      severity: 'error',
      from: { path: '^apps/web/server/api' },
      to: { path: '^apps/web/server/(adapters|repositories)' },
    },
    {
      name: 'packages-no-app',
      severity: 'error',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.base.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
    },
  },
}
