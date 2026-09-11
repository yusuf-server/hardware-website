# 荣昌工具网站 - Astro + 无头 WordPress + WooCommerce

这是一个使用 Astro、无头 WordPress 和 WooCommerce 构建的现代化五金工具网站。采用深色科技风格、全屏滚动、毛玻璃效果和流畅动画。

## 项目结构

```
/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   ├── layouts/         # 布局模板
│   │   ├── BaseLayout.astro      # 基础布局（已弃用）
│   │   └── MainLayout.astro      # 主布局（全屏滚动）
│   ├── lib/            # 工具库
│   │   ├── wordpress.ts          # WordPress API 客户端
│   │   └── woocommerce.ts        # WooCommerce API 客户端
│   └── pages/          # 页面路由
│       ├── index.astro            # 首页（全屏滚动设计）
│       ├── products/              # 产品页面
│       │   ├── index.astro        # 产品列表
│       │   └── [slug].astro       # 产品详情
│       └── blog/                  # 博客页面
│           ├── index.astro        # 博客列表
│           └── [slug].astro       # 文章详情
├── astro.config.mjs    # Astro 配置
├── package.json
└── tsconfig.json
```

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 WordPress 和 WooCommerce API

复制 `.env.example` 到 `.env`:

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置你的 WordPress 和 WooCommerce API：

```bash
# WordPress REST API
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2

# WooCommerce REST API
WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
```

**获取 WooCommerce API 密钥：**

1. 登录 WordPress 管理后台
2. 进入 WooCommerce > 设置 > 高级 > REST API
3. 点击"添加密钥"
4. 填写描述，选择权限（建议"读取"）
5. 生成密钥后，复制 Consumer Key 和 Consumer Secret 到 `.env` 文件

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:4321` 查看网站。

### 4. 构建生产版本

```bash
npm run build
```

构建输出在 `dist/` 目录。

## WordPress 和 WooCommerce 设置

确保你的 WordPress 网站：
1. 已安装并启用 WooCommerce 插件
2. 启用了 REST API（默认已启用）
3. 允许跨域请求（如果需要）
4. 有公开的文章和产品内容
5. 已在 WooCommerce > 设置 > 高级 > REST API 中生成 API 密钥

## 功能特性

### 核心功能
- ✅ 静态站点生成（SSG）
- ✅ WordPress 文章集成
- ✅ WooCommerce 产品集成
- ✅ 动态路由（文章和产品详情页）
- ✅ TypeScript 支持
- ✅ 响应式设计
- ✅ SEO 友好

### 设计特性
- ✅ 深色科技风格设计
- ✅ 全屏吸附滚动（Snap Scroll）
- ✅ 毛玻璃效果（Glassmorphism）
- ✅ 流畅动画和过渡效果
- ✅ 手风琴式产品展示
- ✅ 银光流动线特效
- ✅ 径向扩散交互效果
- ✅ 侧边导航点和页码指示器

## 可用的 API 函数

### WordPress API (`src/lib/wordpress.ts`)

- `getPosts(perPage?)` - 获取文章列表
- `getPostBySlug(slug)` - 根据 slug 获取单篇文章
- `getPages()` - 获取页面列表
- `getPageBySlug(slug)` - 根据 slug 获取单个页面

### WooCommerce API (`src/lib/woocommerce.ts`)

- `getProducts(perPage?, category?)` - 获取产品列表
- `getProductBySlug(slug)` - 根据 slug 获取单个产品
- `getProductById(id)` - 根据 ID 获取产品
- `getCategories()` - 获取产品分类列表
- `getCategoryBySlug(slug)` - 根据 slug 获取分类
- `getFeaturedProducts(perPage?)` - 获取精选产品
- `searchProducts(query, perPage?)` - 搜索产品

## 命令

| 命令                   | 操作                                           |
| :--------------------- | :--------------------------------------------- |
| `npm install`          | 安装依赖                                        |
| `npm run dev`          | 在 `localhost:4321` 启动开发服务器              |
| `npm run build`        | 构建生产版本到 `./dist/`                        |
| `npm run preview`      | 在本地预览构建的网站                            |
| `npm run astro ...`    | 运行 Astro CLI 命令，如 `astro add`, `astro check` |

## 设计说明

本项目采用参考 `gemini-code-1788874041749.html` 的设计风格：

### 视觉风格
- **配色方案**：深色背景 (#06080d) + 商务蓝强调色 (#2563eb)
- **字体**：Plus Jakarta Sans (正文) + Syne (标题)
- **玻璃态设计**：毛玻璃卡片效果，带有半透明背景和模糊
- **渐变效果**：标题使用银白至淡蓝的渐变

### 交互效果
- **全屏滚动**：8个全屏 Section，支持吸附滚动
- **侧边导航**：右侧圆点导航，实时高亮当前页面
- **手风琴展示**：产品卡片鼠标悬停时展开，其他收缩
- **银光流动**：垂直分隔线上的流光动画
- **径向扩散**：鼠标悬停时的蓝光扩散效果

### 布局结构
1. **Section 1**: Hero 首页 - 大标题 + 精选产品卡片
2. **Section 2**: 产品目录 - 分类展示（1大3小网格）
3. **Section 3**: 精选产品 - 手风琴式横向展开
4. **Section 4**: 关于我们 - 四大支柱卡片
5. **Section 5**: 应用领域 - 6列交互式展示
6. **Section 6**: 联系我们 - Footer 信息

## 下一步开发

- [ ] 创建产品列表页面 (`/products`)
- [ ] 创建产品详情页面 (`/products/[slug]`)
- [ ] 添加产品分类筛选功能
- [ ] 实现产品搜索功能
- [ ] 添加购物车功能（如需要）
- [ ] 优化移动端响应式设计
- [ ] 添加图片懒加载
- [ ] 集成 SEO 元标签
- [ ] 添加多语言支持
