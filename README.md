# YMA Component

基于 Vue 2 的组件库。源码入口是 `src/index.js`，由业务工程一起编译。

## 安装

```bash
npm install yma-component
```

`vue@^2.6.14` 是 peerDependency。样式依赖 `yma-csskit`。

```js
import Vue from 'vue';
import Yma from 'yma-component';

Vue.use(Yma);
```

也可以按组件引入，例如 `import Input from 'yma-component/src/input'`。

## 组件

`Vue.use` 会注册 Breadcrumb、Center、Checkbox、Choice、Col、Countdown、Desktop、Dropdown、Form、Icon、Input、Link、List、Menu、Pagination、Panel、Scroll、Row、Table、Tag、Text、Reader、Writer、Message。

Desktop 同时注册 Aside、Header、Footer、Container、Main。有 `footer` 插槽时才会渲染底栏。

## 表单

```html
<yma-form ref="form" :model="model" :rules="rules">
    <yma-form-item label="名称" prop="name">
        <yma-input v-model="model.name"></yma-input>
    </yma-form-item>
</yma-form>
```

```js
rules: {
    name: [{required: true, message: '请输入名称', trigger: 'blur'}],
}
```

规则支持 `required`、`min`、`max`、`pattern`、`type`（`email`、`number`）和 `validator`。`this.$refs.form.validate()` 返回 Promise，也可以传入回调。`resetFields()` 恢复字段挂载时的值，`clearValidate()` 只清掉错误提示。

## 消息

组件可以直接放在页面里。安装之后也可以调用：

```js
this.$message('已保存');
this.$message.success('成功');
this.$message.error({message: '失败', duration: 0});
```

`duration` 默认 3000 毫秒，设为 `0` 时不自动关闭。返回值上的 `close()` 可以手动关掉。

## 图标

内置图标在安装 Icon 时注册。业务侧额外的 SVG sprite 用 `registerIcons` 接进来：

```js
import {registerIcons} from 'yma-component';

registerIcons(require.context('@/asset/svg', false, /\.svg$/));
```

## 工具

```js
import {Util} from 'yma-component';

Util.write({filename: 'a.txt', filetype: 'text/plain', content: 'hello'});
Util.copy('hello');
```

`copy` 优先使用浏览器 Clipboard API，不可用时再加载 `clipboard`。`Util.$Copy.destroy()` 可以拆掉兜底按钮。
