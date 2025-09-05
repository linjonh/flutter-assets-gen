import * as glob from "glob"
import { CtorAssetFileInfo, sortAssets } from "./info.js"
import type { ParserInfo } from "./info.js"
import { outputCode } from "./output.js"
import path from "./utils/path.js"
import { validateFlutterProject } from "./utils/check.js"
import { loadConf } from "./utils/util.js"
import * as vscode from "vscode"
import { pluginName } from "./utils/constants.js"

export class Find {
  rootPath: string
  constructor(rootPath: string) {
    this.rootPath = rootPath
  }

  start() {
    process.chdir(this.rootPath)

    const isValid = validateFlutterProject()

    if (!isValid) return
    const conf = loadConf()
    if (!conf.output_path || !conf.assets_path) {
      vscode.window.showErrorMessage(
        `Please set the pubspec file configuration correctly`
      )
      return
    }

    let normalizeFile: ParserInfo[] = []
    console.log(`[${pluginName}] Start find assets...`)
    console.log(`[${pluginName}] exclude patterns: ${conf.exclude}`)

    conf.assets_path
      .map(item => path.resolve(this.rootPath, item))
      .forEach(partern => {
        const files = glob.sync(partern.replace(/\\/g, "/") + `/**/*`, {
          ignore: conf.exclude
        })

        files
          .filter(file => {
            const ext = path.parse(file).ext
            return ext !== "" && ext !== `.dart`
          })
          .forEach(filePath => {
            console.log(`[${pluginName}] found asset: ${filePath}`)
            const info = new CtorAssetFileInfo(filePath, this.rootPath, conf)
            const p = info.parserPath()
            if (p) {
              normalizeFile.push(p)
            }
          })
      })

    normalizeFile = this.deduplicate(normalizeFile)
    normalizeFile = sortAssets(normalizeFile)

    outputCode(normalizeFile, conf.output_path, conf.filename)
  }

  deduplicate(list: ParserInfo[]) {
    const map = new Map<string, ParserInfo>()
    list.forEach(item => {
      if (!map.has(item.identifier)) {
        map.set(item.identifier, item)
      }
    })
    return Array.from(map.values())
  }
}
