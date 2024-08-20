import path from "./utils/path"
import * as PATH from "path"
import { util } from "./utils/util"
import * as vscode from "vscode"
export interface ParserInfo extends PATH.ParsedPath {
  // 相对路径
  identifier: string
  tag: string
}

export class CtorAssetFileInfo {
  filePath: string
  rootPath: string
  prefix: string
  constructor(filePath: string, rootPath: string, prefix: string) {
    this.filePath = path.normalize(filePath)
    this.prefix = prefix
    rootPath = path.normalize(rootPath)
    if (rootPath.endsWith(path.sep)) this.rootPath = rootPath
    else if (rootPath) {
      this.rootPath = `${rootPath}${path.sep}`
    } else this.rootPath = ``
  }

  parserPath() {
    if (!this.filePath) {
      vscode.window.showErrorMessage(`File path is invalid`)
      return null
    }
    /// {  root: "", dir: "assets/images", base: "xx.png", ext: ".png", name: "xx" }
    const info = path.parse(this.filePath)

    // path.sep on win is \ & darwin or linux is /
    const relationPath = info.dir.replace(this.rootPath, ``)

    const pathName = relationPath
      .split(path.sep)
      .map((item, i) => {
        if (i === 0) {
          if (this.prefix !== null) return this.prefix
          else return util.lowerFirstLeter(item)
        } else if (this.prefix === "") {
          return i === 1 ? util.lowerFirstLeter(item) : normalizeName(item)
        } else return normalizeName(item)
      })
      .join("")

    const baseName =
      pathName === ""
        ? util.lowerFirstLeter(normalizeName(info.name))
        : normalizeName(info.name)
    const identifier = pathName + baseName
    const result: ParserInfo = {
      ...info,
      identifier: identifier,
      tag: `${relationPath.replace(/[\\]/g, "/")}/${info.base}`
    }

    return result
  }
}

export function normalizeName(str: string) {
  const _str = translateChinese(str)
  return _str
    .replace(/[-\.]/g, "_")
    .replace(/@/g, "")
    .split("_")
    .map((v: string) => util.upperFirstLetter(v))
    .join("")
}

export function translateChinese(str: string) {
  return str.replace(/[\u4e00-\u9fa5]/g, function (word, i) {
    const charStr = word.charCodeAt(0).toString(16)
    return i === 0 ? charStr : `_${charStr}`
  })
}

export function sortAssets(list: ParserInfo[]) {
  return list.sort((a: ParserInfo, b: ParserInfo) => {
    return a.identifier > b.identifier ? 1 : -1
  })
}
