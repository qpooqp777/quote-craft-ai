# 報價智造 QuoteCraft AI

> 用一句話描述需求，整理成一份能成交的報價。

報價智造是一個面向設計師、顧問、攝影師、工程團隊與自由工作者的 AI 報價單生成平台。使用者可以從行業模板開始，讓 AI 產生可編輯的報價草稿，再套用不同版面風格、補齊客戶與公司資訊，最後匯出 PDF 或高畫質 PNG。

## 語言

繁體中文（預設） · [简体中文](README.zh-CN.md) · [English](README.en.md)

## 主要功能

| 功能 | 說明 |
| --- | --- |
| AI 報價草稿 | 以自然語言描述專案，從行業模板快速產生報價起點。 |
| 可編輯報價單 | 編輯客戶名稱、日期、付款條件、公司地址、統一編號、聯絡資訊、Logo 與報價項目。 |
| 智慧金額計算 | 支援數量、單價、折扣與稅率，並即時計算項目小計、折扣金額、稅額與含稅總額。 |
| 20 種版面風格 | 透過 JSON 參數管理顏色、字體、密度、圓角、陰影與文件標頭配置。 |
| 收藏最愛風格 | 將常用版面收藏到瀏覽器本機，方便快速套用。 |
| 文件匯出 | 將目前預覽匯出為 PDF 或高畫質 PNG。 |
| 草稿儲存 | 將編輯中的報價單儲存在瀏覽器本機，下次載入後繼續編輯。 |

## 技術架構

本專案採用 React 19、TypeScript、Vite、Tailwind CSS 4、shadcn/ui 與 Lucide React。行業模板與報價起始項目位於 `client/src/data/quote-data.json`；20 組版面風格位於 `client/src/data/quote-styles.json`。目前草稿與收藏資料使用瀏覽器 `localStorage`，不需要後端資料庫即可運作。

| 路徑 | 用途 |
| --- | --- |
| `client/src/App.tsx` | React 應用程式入口與路由。 |
| `client/src/pages/Home.tsx` | 品牌首頁、報價工作區與互動預覽。 |
| `client/src/data/quote-data.json` | 行業與報價起始項目資料。 |
| `client/src/data/quote-styles.json` | 20 組可套用的版面風格參數。 |
| `client/src/index.css` | Paperwork Atelier 全站設計系統。 |
| `.github/workflows/deploy-pages.yml` | GitHub Pages 自動建置與部署流程。 |

## 本機開發

請先安裝 Node.js 22 或相容版本，以及 pnpm。接著執行：

```bash
pnpm install
pnpm dev
```

開發伺服器啟動後，使用瀏覽器開啟終端機顯示的本機網址。執行型別檢查與正式建置：

```bash
pnpm check
pnpm build
```

## GitHub Pages

專案已包含 GitHub Actions 工作流程。將程式推送到 `main` 分支後，workflow 會執行依賴安裝、Vite 建置與 Pages artifact 部署。由於 GitHub Pages 使用 repository 子路徑，Vite 在 Actions 環境會套用 `/quote-craft-ai/` base path。

若要啟用 Pages，請在 GitHub repository 的 `Settings → Pages` 將建置來源設為 **GitHub Actions**。若 repository 維持私有，Pages 可用性會依 GitHub 帳戶方案與組織政策而異；若無法啟用，請改用公開 repository 或使用 Manus 內建託管。

## 資料與隱私

目前的報價草稿、Logo Data URL 與最愛風格只儲存在使用者目前瀏覽器的本機儲存空間，不會透過本專案的前端功能自動同步到雲端。清除瀏覽器網站資料可能會移除這些內容。正式商用前，建議加入帳號、雲端儲存、權限控管與備份策略。

## 授權

本專案的授權方式尚未指定。若要公開發佈或供第三方使用，請先補上適合的 LICENSE 檔案與品牌使用規範。

## 作者

Manus AI
