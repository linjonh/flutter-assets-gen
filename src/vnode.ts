import type { ParserInfo } from "./info.js"

export class VNode {
  info: ParserInfo
  ignoreComments: boolean
  constructor(info: ParserInfo, ignoreComments = false) {
    this.info = info
    this.ignoreComments = ignoreComments || false
  }

  generateComments() {
    if (this.ignoreComments) return ""
    return `  /// Assets for ${this.info.identifier}\n  /// ${this.info.tag}\n`
  }

  gen() {
    return `${this.generateComments()}  static const String ${this.info.identifier} = '${this.info.tag}';`
  }
}
