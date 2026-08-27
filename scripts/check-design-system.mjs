import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'

const TOKEN_FILE = 'apps/web/app/assets/css/corporate-design-system.css'
const LEGACY_FILE = 'apps/web/app/assets/css/legacy-marketing-normalization.css'
const MAIN_CSS = 'apps/web/app/assets/css/main.css'
const DEFAULT_LAYOUT = 'apps/web/app/layouts/default.vue'
const DESIGN_ROOT = 'apps/web/app/'
const APPROVED_STYLESHEETS = new Set([TOKEN_FILE, LEGACY_FILE, MAIN_CSS])
const APPROVED_RAW_BUTTONS = [
  'apps/web/app/components/base/',
  'apps/web/app/components/navigation/SiteHeader.vue',
]
const SOURCE_EXTENSIONS = new Set(['.vue', '.css', '.ts', '.tsx', '.js', '.jsx'])
const ZERO_SHA = /^0+$/

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
const commitExists = (sha) => {
  if (!sha || ZERO_SHA.test(sha)) return false
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const head = process.env.DESIGN_HEAD_SHA && commitExists(process.env.DESIGN_HEAD_SHA) ? process.env.DESIGN_HEAD_SHA : 'HEAD'
const requestedBase = process.env.DESIGN_BASE_SHA
let base = requestedBase && commitExists(requestedBase) ? requestedBase : ''
if (!base) {
  try {
    base = git('rev-parse', `${head}^`)
  } catch {
    base = head
  }
}

const changedOutput = base === head ? '' : git('diff', '--name-only', '--diff-filter=ACMR', `${base}..${head}`)
const changedFiles = changedOutput ? changedOutput.split('\n').filter(Boolean) : []
const violations = []

const add = (file, message) => violations.push(`${file}: ${message}`)
const read = (file) => readFileSync(file, 'utf8')

if (!existsSync(TOKEN_FILE)) add(TOKEN_FILE, 'missing authoritative corporate token file')
if (!existsSync(DEFAULT_LAYOUT)) add(DEFAULT_LAYOUT, 'missing shared marketing layout')

if (existsSync(TOKEN_FILE)) {
  const tokens = read(TOKEN_FILE).toLowerCase()
  const required = ['#080808', '#050505', '#ffd700', '#f7f8fa', '#c9cbd1', '#979aa2', '#292b30', '--font-ui:', '--button-height: 50px', '--header-height: 76px']
  for (const value of required) if (!tokens.includes(value)) add(TOKEN_FILE, `required design token missing: ${value}`)
}

if (existsSync(DEFAULT_LAYOUT)) {
  const layout = read(DEFAULT_LAYOUT)
  if (!layout.includes('marketing-route')) add(DEFAULT_LAYOUT, 'public shell must keep the .marketing-route governance boundary')
  if (!layout.includes('<SiteHeader')) add(DEFAULT_LAYOUT, 'shared SiteHeader is required')
  if (!layout.includes('<SiteFooter')) add(DEFAULT_LAYOUT, 'shared SiteFooter is required')
}

for (const file of changedFiles) {
  if (!file.startsWith(DESIGN_ROOT) || !existsSync(file)) continue

  if (file.endsWith('.css') && !APPROVED_STYLESHEETS.has(file)) {
    add(file, 'new parallel stylesheets are not allowed; extend the corporate design system instead')
  }

  if (!SOURCE_EXTENSIONS.has(extname(file))) continue
  const source = read(file)
  const tokenFile = file === TOKEN_FILE
  const legacyFile = file === LEGACY_FILE

  if (!tokenFile && /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/.test(source)) {
    add(file, 'literal colors are forbidden outside the authoritative token file')
  }

  if (!tokenFile && /font-family\s*:/.test(source)) {
    add(file, 'page/component font-family declarations are forbidden; use --font-ui')
  }

  if (file.endsWith('.vue') && /\sstyle\s*=\s*["']/.test(source)) {
    add(file, 'inline visual styles are forbidden')
  }

  if (!legacyFile && /rounded-full|rounded-\[[^\]]+\]|border-radius\s*:\s*(?:50%|999\d*px)/.test(source)) {
    add(file, 'pill/circular or arbitrary geometry is outside the corporate radius scale')
  }

  if (!legacyFile && /\b(?:bg|text|border)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/.test(source)) {
    add(file, 'literal framework palette utilities are forbidden; use design tokens')
  }

  if (file.endsWith('.vue') && source.includes('<button') && !APPROVED_RAW_BUTTONS.some((allowed) => file.startsWith(allowed))) {
    add(file, 'raw buttons are forbidden outside approved shared/control components')
  }

  if (file.includes('/pages/') && /definePageMeta\s*\(\s*\{[^}]*layout\s*:\s*false/s.test(source)) {
    add(file, 'public pages may not bypass the shared marketing header/footer layout')
  }
}

if (violations.length) {
  console.error('Klyrow design-system policy failed:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log(`Klyrow design-system policy passed for ${changedFiles.length} changed file(s) in ${base}..${head}.`)
