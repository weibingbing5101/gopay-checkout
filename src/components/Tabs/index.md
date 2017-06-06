# Tabs

选项卡切换组件。

## 用途

切换组件

## API

### Tabs

| 参数             | 说明                                         | 类型     | 默认值        |
|------------------|----------------------------------------------|----------|---------------|         |
| defaultActiveKey | 初始化选中面板的 key，如果没有设置 activeKey | String   | 第一个面板    |
| onChange         | 切换面板的回调                               | Function | 无            |
| onTabClick       | tab 被点击的回调                             | Function | 无            |


### Tabs.TabPane

| 参数 | 说明             | 类型                    | 默认值 |
|------|------------------|-------------------------|--------|
| tabKey  | 对应 activeKey   | String                  | 无     |
| title  | 选项卡头显示文字 | React.Element or String | 无     |
