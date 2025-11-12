# Debug
- yarn compile
- vscode editor press F5 debug

# Publish
## Installation
Make sure you have Node.js installed. Then run:
```bash
npm install -g @vscode/vsce
```
## Usage
You can use vsce to easily package and publish your extensions:

```bash
$ cd myExtension
# vsce package build vsix file and upload to website (https://marketplace.visualstudio.com/manage/publishers/linjonh?auth_redirect=True)
$ vsce package 
# myExtension.vsix generated
$ vsce publish
# <publisher id>.myExtension published to VS Code Marketplace
```

vsce can also search, retrieve metadata, and unpublish extensions. For a reference on all the available vsce commands, run vsce --help.

## Publishing extensions
see guides [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## version and ChangeLog

根据提交记录自动更新changelog.md
```bash
npm run version
```