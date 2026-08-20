# 报价智造 QuoteCraft AI

> 用一句话描述需求，整理成一份能成交的报价。

报价智造是一个面向设计师、顾问、摄影师、工程团队与自由工作者的 AI 报价单生成平台。用户可以从行业模板开始，让 AI 生成可编辑的报价草稿，再套用不同版面风格、补充客户与公司信息，最后导出 PDF 或高清 PNG。

## 语言

[繁體中文（預設）](README.md) · 简体中文 · [English](README.en.md)

## 主要功能

| 功能 | 说明 |
| --- | --- |
| AI 报价草稿 | 用自然语言描述项目，从行业模板快速生成报价起点。 |
| 可编辑报价单 | 编辑客户名称、日期、付款条件、公司地址、统一编号、联系信息、Logo 与报价项目。 |
| 智能金额计算 | 支持数量、单价、折扣与税率，并实时计算项目小计、折扣金额、税额与含税总额。 |
| 20 种版面风格 | 通过 JSON 参数管理颜色、字体、密度、圆角、阴影与文件标题配置。 |
| 收藏常用风格 | 将常用版面收藏到浏览器本地，方便快速套用。 |
| 文件导出 | 将当前预览导出为 PDF 或高清 PNG。 |
| 草稿保存 | 将编辑中的报价单保存到浏览器本地，下次载入后继续编辑。 |

## 技术架构

本项目采用 React 19、TypeScript、Vite、Tailwind CSS 4、shadcn/ui 与 Lucide React。行业模板与报价起始项目位于 `client/src/data/quote-data.json`；20 组版面风格位于 `client/src/data/quote-styles.json`。目前草稿与收藏数据使用浏览器 `localStorage`，不需要后端数据库即可运行。

| 路径 | 用途 |
| --- | --- |
| `client/src/App.tsx` | React 应用入口与路由。 |
| `client/src/pages/Home.tsx` | 品牌首页、报价工作区与互动预览。 |
| `client/src/data/quote-data.json` | 行业与报价起始项目数据。 |
| `client/src/data/quote-styles.json` | 20 组可套用的版面风格参数。 |
| `client/src/index.css` | Paperwork Atelier 全站设计系统。 |
| `.github/workflows/deploy-pages.yml` | GitHub Pages 自动构建与部署流程。 |

## 本地开发

请先安装 Node.js 22 或兼容版本，以及 pnpm。然后执行：

```bash
pnpm install
pnpm dev
```

开发服务器启动后，使用浏览器打开终端显示的本地网址。执行类型检查与正式构建：

```bash
pnpm check
pnpm build
```

## GitHub Pages

项目已包含 GitHub Actions 工作流程。将代码推送到 `main` 分支后，workflow 会执行依赖安装、Vite 构建与 Pages artifact 部署。由于 GitHub Pages 使用 repository 子路径，Vite 在 Actions 环境会套用 `/quote-craft-ai/` base path。

若要启用 Pages，请在 GitHub repository 的 `Settings → Pages` 将构建来源设为 **GitHub Actions**。如果 repository 保持私有，Pages 可用性会根据 GitHub 账户方案与组织政策而定；如果无法启用，请改用公开 repository 或 Manus 内置托管。

## 数据与隐私

目前的报价草稿、Logo Data URL 与收藏风格只保存在用户当前浏览器的本地存储空间，不会通过本项目的前端功能自动同步到云端。清除浏览器网站数据可能会移除这些内容。正式商用前，建议加入账户、云端存储、权限控制与备份策略。

## 授权

本项目的授权方式尚未指定。如果要公开发布或供第三方使用，请先补充适合的 LICENSE 文件与品牌使用规范。

## 作者

Manus AI
