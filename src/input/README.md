```Vue
<yma-input v-model="text" placeholder="请输入" clearable></yma-input>
        <yma-input v-model="withIcon" placeholder="前置图标" prefix-icon="info"></yma-input>
        <yma-input v-model="password" placeholder="请输入密码" show-password></yma-input>
        <yma-input
            v-model="limit"
            placeholder="最多 20 字"
            maxlength="20"
            show-word-limit
        ></yma-input>
        <yma-input v-model="locked" placeholder="禁用" disabled></yma-input>
        <yma-input v-model="site" placeholder="请输入域名">
            <template slot="prepend">https://</template>
            <template slot="append">.com</template>
        </yma-input>
        <yma-input
            v-model="area"
            type="textarea"
            placeholder="请输入多行文本"
            maxlength="100"
            show-word-limit
        ></yma-input>
```
