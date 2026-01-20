# 3D送福（3d fu）

一个基于 Three.js 的浏览器 3D 小项目：在 3D 场景中加载并展示一个「福」字 `glb` 模型，支持鼠标交互（旋转 / 缩放 / 平移），并提供基础灯光、阴影与加载提示。

## 预览与交互

- 鼠标左键拖拽：旋转
- 滚轮：缩放
- 鼠标右键拖拽：平移

页面内也有操作提示（左上角）。

## 技术栈

- Three.js（ESM 模块方式，通过 importmap 引入本地 three.module.js）
- GLTFLoader + DRACOLoader + MeshoptDecoder（兼容 glTF/glb、Draco 压缩与 meshopt）
- OrbitControls（相机轨道控制）

## 本地运行（推荐）

该项目使用 ES Module（`type="module"`）并通过相对路径加载资源，建议使用本地静态服务器运行，避免直接用 `file://` 打开导致的跨域/模块加载问题。

### 方式一：一键启动（Windows）

- 双击运行 [start.bat](start.bat)
- 脚本会启动 `static-web-server` 并自动打开：`http://127.0.0.1:8000/`

### 方式二：手动启动服务器

- 进入 [server/start.bat](server/start.bat) 启动服务
- 或者你也可以使用任意静态服务器（示例）：

```bash
python -m http.server 8000
```

然后在浏览器打开：`http://127.0.0.1:8000/`

## 模型资源

- 默认模型路径：`./model/fu.glb`
- 入口脚本会在加载后自动：
  - 计算包围盒并等比缩放到合适大小
  - 将模型居中到场景原点
  - 若模型带动画，会自动播放所有动画片段

如需替换模型：

1. 将你的 `.glb` 文件放入 [model/](model/)（例如 `my.glb`）
2. 修改 [js/main.js](js/main.js) 中的模型路径：

```js
const modelPath = './model/my.glb';
```

## 目录结构

- [index.html](index.html)：页面入口（含 importmap 配置）
- [js/main.js](js/main.js)：Three.js 场景、灯光、控制器与模型加载逻辑
- [css/style.css](css/style.css)：基础样式（全屏画布、提示与加载文案）
- [model/](model/)：模型资源（默认 `fu.glb`）
- [js/vendor/three/](js/vendor/three/)：Three.js 本地依赖（three.module.js + examples/jsm）
- [server/](server/)：静态服务器与配置（sws.toml）

## 常见问题

- 页面提示“你正在用 file:// 打开页面…”：请用本地服务器运行（见上方“本地运行”）。
- 模型加载失败：确认 [model/](model/) 下文件名与 [js/main.js](js/main.js) 中路径一致，并查看浏览器控制台报错信息。

## License

本项目遵循仓库内的 [LICENSE](LICENSE)。
