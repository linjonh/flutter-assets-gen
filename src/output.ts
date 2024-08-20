import * as fs from "fs"
import path from "./utils/path"
import type { ParserInfo } from "./info"
import { VNode } from "./vnode"
import * as vscode from "vscode"
import { IConfig, loadConf } from "./utils/util"

const createTemplateBasicStr = () => `
// ignore_for_file: prefer_single_quotes
class Assets {
  Assets._();
  __CODE_TEMPLATE_CONTENTS_REPLACEMENT__
}

`
export function getTemplate(conf: IConfig) {
  let result = createTemplateBasicStr().replace(/^[\n\r]/, "")

  if (conf.classname) {
    result = result.replace(/Assets/gi, conf.classname)
  }

  return result
}

export function outputCode(
  list: ParserInfo[],
  dist: string,
  filename = "assets.dart"
) {
  const conf = loadConf()
  const content = list
    .map((item: ParserInfo) =>
      new VNode(item, conf.ignore_comments || false).gen()
    )
    .join("\n")
  const temp = getTemplate(conf)

  const result = temp.replace("__CODE_TEMPLATE_CONTENTS_REPLACEMENT__", content)

  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true })
  }
  const outputPath = `${dist}${path.sep}${filename}`

  // 如果文件存在, 先删除重新生成
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
  fs.writeFileSync(outputPath, result)

  vscode.window.showInformationMessage(`Assets generate successful`)
}
