# fraq-plugin-face-reaction

让机器人回应（贴）任何表情。

## 安装与配置

将插件添加至 `dependencies`，然后在创建 `Context` 时引入并配置插件：

```typescript
import FaceReactionPlugin from "fraq-plugin-face-reaction";

ctx.install(FaceReactionPlugin);
```

## Usage

发送 `react` 命令即可让机器人给当前消息贴上指定的表情：

```
react <一个 Emoji 或 QQ 表情>
```

机器人将会给当前消息贴上指定的表情。也可以通过表情 ID 来贴表情：

```
react <face|emoji> <表情 ID>
```

此外，也可以引用一条消息再发送 `react` 命令来让机器人给引用的消息贴上指定的表情：

```
[引用消息] react <一个 Emoji 或 QQ 表情>
[引用消息] react <face|emoji> <表情 ID>
```
