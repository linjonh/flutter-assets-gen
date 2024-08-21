import type { ParserInfo } from "./info"

export class VNode {
  info: ParserInfo
  ignoreComments: boolean
  constructor(info: ParserInfo, ignoreComments = false) {
    this.info = info
    this.ignoreComments = ignoreComments || false
  }

  generateComments() {
    if (this.ignoreComments) return ""
    return `
  /// Assets for ${this.info.identifier}
  /// ${this.info.tag}
    `
  }

  gen() {
    return `${this.generateComments().trimEnd()}
  static const String ${this.info.identifier} = "${this.info.tag}";`
  }
}
