前端代码规范 (HTML/CSS/JavaScript)
1. 通用规范
文件命名
全部使用小写字母
多个单词用连字符连接：contact-list.html
文件名要有意义，反映文件功能
编码格式
统一使用 UTF-8 编码
使用 2 个空格进行缩进
文件末尾保留一个空行
2. HTML 规范
标签小写，属性使用双引号
自闭合标签不加斜杠：<br>, <img>, <input>
属性顺序：class→ id→ name→ data-*→ src/href→ alt/title
使用语义化标签：<header>, <nav>, <main>, <article>, <section>
3. CSS 规范
 命名规范 (BEM)
/* Block - 独立模块 */
.contact-list { }

/* Element - 块的组成部分 */
.contact-list__item { }
.contact-list__name { }

/* Modifier - 状态或样式修改 */
.contact-list__item--active { }
.contact-list__item--disabled { }
5. 代码组织规范
文件结构
js/
├── config/          # 配置文件
│   └── settings.js
├── services/        # API服务
│   └── api.js
├── utils/           # 工具函数
│   ├── helpers.js
│   └── validators.js
└── modules/         # 功能模块
    └── contacts.js
