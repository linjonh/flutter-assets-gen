## 命令 (Provide commands)

- F1 > Search flutter assets
  - `Flutter Assets: Watch`
  - `Flutter Assets: Stop Watch`
  - `Flutter Assets: Generate`

![screenshot](./images/screenshot.png)

## 如何使用 (How to use)

- step 1. 在项目 pubspec.yaml 下添加 (Add under project pubspec.yaml)：

```yaml
flutter_assets_gen:
  assets_path: assets/
  output_path: lib/constants/
  filename: assets.dart
```

- **field_prefix 为可选字段，如果想去掉 assets 前缀，则提供一个空，默认为 assets** (field_prefix is ​​an optional field, if you want to remove the assets prefix, provide an empty value, the default is assets)

```yaml
flutter_assets_gen:
  assets_path: assets/
  output_path: lib/constants/
  filename: assets.dart
  field_prefix:
```

- **修改 prefix** (Modify prefix)

```yaml
flutter_assets_gen:
  assets_path: assets/
  output_path: lib/constants/
  filename: assets.dart
  field_prefix: resource
```

- **忽略注释** (ignore comments)

```yaml
flutter_assets_gen:
  assets_path: assets/
  output_path: lib/constants/
  filename: assets.dart
  field_prefix: resource
  ignore_comments: true
```

- **只选择部分文件夹** (Select Partial Folders)

```yaml
flutter_assets_gen:
  assets_path:
    - assets/images/
    - assets/msic/
  output_path: lib/constants/
  filename: assets.dart
  field_prefix:
  classname: R
```

- **排除部分文件夹**

  使用 exclude 字段数组，来排除不需要生成的文件夹。匹配正则表达式。

```yaml
flutter_assets_gen:
  assets_path:
    - assets/images/
    - assets/msic/
  exclude:
    - assets/images/**/2.0x/**
    - assets/images/**/3.0x/**
    - assets/images/**/4.0x/**
  output_path: lib/constants/
  filename: assets.dart
  field_prefix:
  classname: R
```

- step 2. 生成文件内容 (Generate file content)

```dart
class Assets {
  Assets._();

  /// Assets for loginLogo
  /// assets/images/login/logo.png
  static const String assetsImagesLoginLogo = "assets/images/login/logo.png";

  /// Assets for tabHome
  /// assets/images/tab/home.png
  static const String assetsImagesTabHome = "assets/images/tab/home.png";
}
```

- step 3. 引入 (introduce)

```dart
import 'constants/assets.dart';
/// example1:
Image.asset(Assets.assetsImagesLoginLogo, height: 30, width: 30),
/// example2:
Image(image: AssetImage(Assets.assetsImagesTabHome,), height: 30, width: 30),
```

## 修改类名 (Modify class name)

```yaml
flutter_assets_gen:
  assets_path: assets/
  output_path: lib/constants/
  filename: assets.dart
  field_prefix:
  classname: R
```

生成内容 (Generate content)

```dart
// ignore_for_file: prefer_single_quotes
class R {
  R._();

  /// Assets for loginLogo
  /// assets/images/login/logo.png
  static const String assetsImagesLoginLogo = "assets/images/login/logo.png";

  /// Assets for tabHome
  /// assets/images/tab/home.png
  static const String assetsImagesTabHome = "assets/images/tab/home.png";
}
```

## 使用 package (Use package) [#13](https://github.com/weekitmo/flutter-assets-gen/issues/13)

当通过 `flutter create --template=package my_assets_package` 来创建资源包时，可能会用到

```yaml
flutter_assets_gen:
  assets_path:
    - lib/assets/images/
    - lib/assets/msic/
  output_path: lib/
  filename: assets.dart
  field_prefix:
    from: libAssets
    to:
  classname: MyAsset
  package_name: my_assets_package
```

↓

```dart
// ignore_for_file: prefer_single_quotes
class MyAsset {
  MyAsset._();

  /// Assets for images96f775355c06519b
  /// packages/my_assets_package/lib/assets/images/雷电将军.jpeg
  static const String images96f775355c06519b = "packages/my_assets_package/lib/assets/images/雷电将军.jpeg";

  /// Assets for imagesTap
  /// packages/my_assets_package/lib/assets/images/tap.webp
  static const String imagesTap = "packages/my_assets_package/lib/assets/images/tap.webp";

  /// Assets for msicAdc
  /// packages/my_assets_package/lib/assets/msic/adc.txt
  static const String msicAdc = "packages/my_assets_package/lib/assets/msic/adc.txt";
}
```

此时引入时，不用每次都添加 package 字段

```dart
import 'package:my_assets_package/assets.dart';
// ....
Image.asset(MyAsset.images96f775355c06519b, height: 50, width: 50)
```
