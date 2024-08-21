import path from "./utils/path"
import * as PATH from "path"
import { IConfig, util } from "./utils/util"
import * as vscode from "vscode"
export interface ParserInfo extends PATH.ParsedPath {
  // 相对路径
  identifier: string
  tag: string
}

export class CtorAssetFileInfo {
  filePath: string
  rootPath: string
  conf: IConfig
  constructor(filePath: string, rootPath: string, conf: IConfig) {
    this.filePath = path.normalize(filePath)
    this.conf = conf
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
    const prefix = this.conf.field_prefix
    let pathName = relationPath
      .split(path.sep)
      .map((item, i) => {
        if (i === 0) {
          if (typeof prefix === "string" && prefix !== null) return prefix
          else return util.lowerFirstLeter(item)
        } else if (i === 1) {
          return prefix === ""
            ? util.lowerFirstLeter(item)
            : normalizeName(item)
        } else return normalizeName(item)
      })
      .join("")

    if (
      typeof prefix === "object" &&
      ![undefined, null, ""].includes(prefix.from) &&
      prefix.to !== undefined
    ) {
      // to --> null
      const re = new RegExp(`^${prefix.from}`, "")
      pathName = util.lowerFirstLeter(pathName.replace(re, prefix.to || ""))
    }

    const baseName =
      pathName === ""
        ? util.lowerFirstLeter(normalizeName(info.name))
        : normalizeName(info.name)
    const identifier = pathName + baseName
    const tag = `${relationPath.replace(/[\\]/g, "/")}/${info.base}`
    const result: ParserInfo = {
      ...info,
      identifier: identifier,
      tag: !["", null, undefined].includes(this.conf.package_name)
        ? `packages/${this.conf.package_name}/${tag}`
        : tag
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
