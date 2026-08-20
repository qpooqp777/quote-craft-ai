// Paperwork Atelier：本頁像一張攤開的報價工作桌；暖白紙張、編輯式標籤、校樣青只標記關鍵動作。
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import quoteData from "@/data/quote-data.json";
import quoteStylesData from "@/data/quote-styles.json";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileDown,
  Heart,
  ImageDown,
  FileCheck2,
  FileText,
  Hammer,
  Lightbulb,
  Menu,
  MoreHorizontal,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Store,
  WandSparkles,
  X,
} from "lucide-react";

const { industries, starterItems: starterQuoteItems } = quoteData;
const { styles: quoteStyles } = quoteStylesData;

function money(value: number) {
  return new Intl.NumberFormat("zh-TW").format(value);
}

export default function Home() {
  const [industry, setIndustry] = useState(industries[1].label);
  const [prompt, setPrompt] = useState("為一間剛開幕的咖啡店製作品牌識別與社群內容，預計 6 週完成。");
  const [items, setItems] = useState(starterQuoteItems);
  const [generated, setGenerated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [activeStyleId, setActiveStyleId] = useState("paperwork-atelier");
  const [customerName, setCustomerName] = useState("日常咖啡 Daily Coffee");
  const [quoteDate, setQuoteDate] = useState("2026-08-20");
  const [paymentTerms, setPaymentTerms] = useState("簽約 50%，交付尾款 50%");
  const [logoUrl, setLogoUrl] = useState("");
  const [favoriteStyleIds, setFavoriteStyleIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("quotecraft-favorite-styles") ?? "[]"); } catch { return []; }
  });
  const quotePreviewRef = useRef<HTMLDivElement>(null);

  const activeStyle = quoteStyles.find((style) => style.id === activeStyleId) ?? quoteStyles[0];

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price, 0), [items]);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const generateQuote = () => {
    setGenerated(true);
    toast.success("已整理成一份報價草稿", { description: "你可以直接修改品項、金額或交付條件。" });
  };

  const addItem = () => {
    setItems((current) => [...current, { id: `custom-${Date.now()}`, industryId: "custom", name: "追加服務項目", detail: "點擊此處編輯說明", price: 3000, unit: "式" }]);
    toast("已新增一列報價項目", { description: "這是前端展示流程，儲存功能之後可接上你的帳號。" });
  };

  const notifyAction = (label: string) => toast(label, { description: "展示流程已觸發；正式版可連接 PDF、Email 或團隊工作區。" });

  const updateItem = (index: number, field: "name" | "detail" | "price", value: string) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === "price" ? Number(value) || 0 : value } : item));
  };

  const applyStyle = (styleId: string) => {
    setActiveStyleId(styleId);
    setStyleOpen(false);
    const selected = quoteStyles.find((style) => style.id === styleId);
    toast.success(`已套用「${selected?.name ?? "新風格"}」`, { description: "版面參數已即時套用到報價預覽。" });
  };

  const toggleFavorite = (styleId: string) => {
    setFavoriteStyleIds((current) => {
      const next = current.includes(styleId) ? current.filter((id) => id !== styleId) : [...current, styleId];
      localStorage.setItem("quotecraft-favorite-styles", JSON.stringify(next));
      return next;
    });
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const exportImage = async () => {
    if (!quotePreviewRef.current) return;
    toast("正在產生高畫質圖片", { description: "請稍候，完成後會自動下載 PNG。" });
    const canvas = await html2canvas(quotePreviewRef.current, { scale: 3, backgroundColor: activeStyle.paper, useCORS: true });
    const link = document.createElement("a");
    link.download = `quote-${customerName || "quotation"}.png`;
    link.href = canvas.toDataURL("image/png", 1);
    link.click();
  };

  const exportPdf = async () => {
    if (!quotePreviewRef.current) return;
    toast("正在產生 PDF", { description: "將以目前的版面與編輯內容建立檔案。" });
    const canvas = await html2canvas(quotePreviewRef.current, { scale: 3, backgroundColor: activeStyle.paper, useCORS: true });
    const image = canvas.toDataURL("image/png", 1);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min((pageWidth - 20) / canvas.width, (pageHeight - 20) / canvas.height);
    pdf.addImage(image, "PNG", 10, 10, canvas.width * ratio, canvas.height * ratio, undefined, "FAST");
    pdf.save(`quote-${customerName || "quotation"}.pdf`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1eb] text-[#222321] selection:bg-[#b9e7de]">
      <header className="relative z-30 border-b border-[#222321]/10 bg-[#f4f1eb]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label="返回報價智造首頁">
            <span className="grid size-9 place-items-center rounded-[8px] bg-[#222321] shadow-[3px_3px_0_#0f8f86]">
              <span className="text-lg font-bold text-[#f4f1eb]">⌁</span>
            </span>
            <span className="font-serif text-[20px] tracking-[-0.05em]">報價智造</span>
            <span className="hidden border-l border-[#222321]/20 pl-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6c6b65] sm:inline">QuoteCraft AI</span>
          </a>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#64645d] md:flex">
            <a className="transition-colors hover:text-[#0f8f86]" href="#workflow">怎麼運作</a>
            <a className="transition-colors hover:text-[#0f8f86]" href="#templates">行業模板</a>
            <a className="transition-colors hover:text-[#0f8f86]" href="#workspace">工作區</a>
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <button onClick={() => notifyAction("登入入口") } className="text-[13px] font-semibold text-[#64645d] hover:text-[#222321]">登入</button>
            <a href="#workspace" className="group flex items-center gap-2 bg-[#0f8f86] px-4 py-2.5 text-[13px] font-bold text-white shadow-[3px_3px_0_#222321] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#222321] active:translate-y-0 active:scale-[0.98]">免費建立報價 <ArrowUpRight size={15} /></a>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="開啟選單"><Menu size={22} /></button>
        </div>
        {mobileOpen && <div className="border-t border-[#222321]/10 bg-[#f4f1eb] px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm font-semibold"><a href="#workflow" onClick={() => setMobileOpen(false)}>怎麼運作</a><a href="#templates" onClick={() => setMobileOpen(false)}>行業模板</a><a href="#workspace" onClick={() => setMobileOpen(false)}>工作區</a></div></div>}
      </header>

      <section id="top" className="relative mx-auto grid max-w-[1360px] items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="relative z-10 max-w-[620px]">
          <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f8f86]"><span className="h-px w-8 bg-[#0f8f86]" /> AI QUOTATION WORKSPACE <span className="rounded-full border border-[#0f8f86]/30 px-2 py-1 text-[9px] tracking-[0.1em]">BETA</span></div>
          <h1 className="max-w-[650px] font-serif text-[clamp(3.5rem,7.4vw,6.8rem)] leading-[0.92] tracking-[-0.07em] text-[#222321]">把一句需求，<br /><em className="text-[#0f8f86]">整理成</em>一份<br />能成交的報價。</h1>
          <p className="mt-8 max-w-[480px] text-[16px] leading-[1.8] text-[#64645d]">不論你是設計師、顧問、攝影師或工程團隊，報價智造把零散的服務內容，變成清楚、專業、可以直接寄出的報價單。</p>
          <div className="mt-10 flex flex-wrap items-center gap-4"><a href="#workspace" className="group flex items-center gap-3 bg-[#222321] px-5 py-3.5 text-[14px] font-bold text-[#f4f1eb] shadow-[4px_4px_0_#0f8f86] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#0f8f86] active:translate-y-0 active:scale-[0.98]">開始生成我的報價 <ArrowUpRight size={17} className="transition-transform group-hover:rotate-45" /></a><span className="text-[11px] leading-4 text-[#89877d]">不用信用卡<br />3 分鐘內完成初稿</span></div>
          <div className="mt-12 flex items-center gap-3 text-[11px] font-medium text-[#89877d]"><span className="flex -space-x-2"><span className="grid size-7 place-items-center rounded-full border-2 border-[#f4f1eb] bg-[#d5c4ad] text-[10px]">林</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#f4f1eb] bg-[#bdd7d2] text-[10px]">陳</span><span className="grid size-7 place-items-center rounded-full border-2 border-[#f4f1eb] bg-[#e4b78f] text-[10px]">W</span></span> 已有 2,800+ 位工作者開始使用</div>
        </div>
        <div className="relative min-h-[460px] lg:min-h-[560px]">
          <div className="absolute -right-14 -top-10 h-[540px] w-[540px] rounded-full bg-[#cfe8e1]/45 blur-3xl" />
          <div className="paper-card absolute right-0 top-3 w-[93%] max-w-[620px] rotate-[2.5deg] border border-[#222321]/10 bg-[#fffdf8] p-5 shadow-[0_24px_80px_rgba(47,53,48,0.15)] sm:p-8">
            <div className="flex items-start justify-between border-b border-[#222321]/15 pb-5"><div><div className="mb-2 flex items-center gap-2"><span className="size-2 rounded-full bg-[#0f8f86]" /><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f8f86]">Quotation / 2026—018</span></div><h2 className="font-serif text-3xl tracking-[-0.05em]">品牌識別與內容顧問</h2></div><div className="text-right text-[11px] text-[#8c8a80]">報價日期<br /><strong className="text-[#222321]">2026.08.20</strong></div></div>
            <div className="grid grid-cols-2 gap-4 border-b border-[#222321]/10 py-5 text-[11px]"><div><p className="mb-1 uppercase tracking-[0.15em] text-[#9b988e]">Prepared for</p><p className="font-semibold">日常咖啡 Daily Coffee</p></div><div><p className="mb-1 uppercase tracking-[0.15em] text-[#9b988e]">Prepared by</p><p className="font-semibold">山丘工作室</p></div></div>
            <div className="space-y-1 py-4 text-[12px]">{starterQuoteItems.map((item, index) => <div key={item.name} className="grid grid-cols-[28px_1fr_auto] items-start gap-3 border-b border-dashed border-[#222321]/10 py-3"><span className="text-[10px] text-[#aaa69b]">0{index + 1}</span><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-[#96938a]">{item.detail}</p></div><span className="font-mono text-[12px]">NT$ {money(item.price)}</span></div>)}</div>
            <div className="flex items-end justify-between pt-5"><div className="max-w-[230px] text-[10px] leading-5 text-[#9b988e]">報價有效期限為 14 天。專案啟動後將提供正式時程表與付款節點。</div><div className="text-right"><p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#9b988e]">Total incl. tax</p><p className="font-mono text-2xl font-bold tracking-[-0.06em]">NT$ 48,300</p></div></div>
            <span className="absolute -right-4 top-14 rotate-90 bg-[#0f8f86] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] text-white shadow-[2px_2px_0_#222321]">AI DRAFT</span>
          </div>
          <div className="absolute bottom-4 left-0 hidden w-52 -rotate-6 border border-[#222321]/10 bg-[#e7eee8] p-4 shadow-[8px_12px_30px_rgba(47,53,48,0.12)] sm:block"><div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em]"><span>AI 建議</span><Sparkles size={13} className="text-[#0f8f86]" /></div><p className="text-[12px] leading-5">「把交付內容分成 3 個階段，客戶會更容易理解價值。」</p><div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#0f8f86]"><Check size={13} /> 套用建議</div></div>
        </div>
      </section>

      <section id="workflow" className="border-y border-[#222321]/10 bg-[#222321] text-[#f4f1eb]"><div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:py-20"><div><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7bcfc1]">A calmer way to quote</p><h2 className="max-w-[420px] font-serif text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl">你不需要再從一張空白表格開始。</h2></div><div className="grid gap-8 sm:grid-cols-3">{[{n:"01",t:"說出你的服務",d:"用你平常說話的方式描述客戶需求，AI 會先理解脈絡。",i:PenLine},{n:"02",t:"一起校對細節",d:"自動拆解品項、工時與交付節點，你保留最後決定權。",i:FileCheck2},{n:"03",t:"寄出專業版本",d:"調整品牌色與付款條件，下載或複製連結，直接送給客戶。",i:Send}].map(({n,t,d,i:Icon})=><div key={n} className="border-t border-[#f4f1eb]/20 pt-5"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-xs text-[#7bcfc1]">{n}</span><Icon size={18} className="text-[#a9aaa3]" /></div><h3 className="text-base font-semibold">{t}</h3><p className="mt-3 text-[13px] leading-6 text-[#aaa9a1]">{d}</p></div>)}</div></div></section>

      <section id="workspace" className="relative mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="absolute right-0 top-20 -z-10 h-80 w-80 bg-[#dcece7] opacity-60 blur-3xl"/><div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f8f86]"><WandSparkles size={14} /> Build your quote</div><h2 className="font-serif text-5xl tracking-[-0.06em] sm:text-6xl">先說你要做什麼。</h2><p className="mt-4 max-w-[520px] text-sm leading-7 text-[#6f6e67]">選一個最接近的行業，描述這次專案。報價智造會先提出一個可編輯的起點。</p></div><div className="flex items-center gap-2 text-[11px] font-medium text-[#8e8b82]"><span className="size-2 rounded-full bg-[#0f8f86]" /> 草稿自動保留在本機</div></div>
        <div className="mb-6 flex flex-col gap-3 border-y border-[#222321]/12 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="proof-tag"><span className="size-1.5 rounded-full bg-[#0f8f86]" /> 版面風格</span><span className="text-sm font-semibold">{activeStyle.name}</span><span className="hidden text-[11px] text-[#8e8b82] sm:inline">{activeStyle.description}</span></div><div className="relative"><button onClick={() => setStyleOpen(!styleOpen)} className="flex items-center gap-2 border border-[#222321]/18 bg-[#fffdf8] px-3 py-2 text-[11px] font-bold shadow-[2px_2px_0_#222321] transition-all hover:-translate-y-0.5 active:translate-y-0">切換 20 種 AI 版面 <ChevronDown size={14} /></button>{styleOpen && <div className="absolute right-0 top-11 z-20 grid max-h-80 w-[min(88vw,390px)] grid-cols-2 gap-px overflow-y-auto border border-[#222321]/15 bg-[#222321]/15 p-px shadow-[0_16px_32px_rgba(47,53,48,.16)] sm:grid-cols-3"><div className="col-span-2 flex items-center justify-between border-b border-[#222321]/12 bg-[#f4f1eb] px-3 py-2 sm:col-span-3"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e8b82]">{favoriteStyleIds.length ? `最愛風格 ${favoriteStyleIds.length} 組` : "選一個適合客戶的版面"}</span><button onClick={() => setStyleOpen(false)} className="text-[#8e8b82] hover:text-[#222321]" aria-label="關閉風格選單"><X size={14}/></button></div>{quoteStyles.map((style) => <div key={style.id} className={`relative bg-[#fffdf8] p-2 text-left transition-colors hover:bg-[#e7eee8] ${activeStyleId === style.id ? "ring-2 ring-inset ring-[#0f8f86]" : ""}`}><button onClick={() => applyStyle(style.id)} className="block w-full text-left"><div className="mb-2 h-12 overflow-hidden border border-[#222321]/10" style={{ backgroundColor: style.paper }}><div className="h-2.5" style={{ backgroundColor: style.accent }} /><div className="space-y-1 p-2"><span className="block h-1 w-3/4" style={{ backgroundColor: style.ink }} /><span className="block h-1 w-1/2" style={{ backgroundColor: style.muted }} /><span className="block h-1 w-full" style={{ backgroundColor: style.border }} /><span className="block h-1 w-2/3" style={{ backgroundColor: style.border }} /></div></div><span className="block truncate text-[10px] font-bold">{style.name}</span><span className="mt-1 block text-[9px] leading-4 text-[#8e8b82]">{style.category}</span></button><button onClick={() => toggleFavorite(style.id)} className={`absolute right-2 top-2 grid size-6 place-items-center border bg-[#fffdf8]/90 ${favoriteStyleIds.includes(style.id) ? "border-[#0f8f86] text-[#0f8f86]" : "border-[#222321]/10 text-[#aaa69b]"}`} aria-label={favoriteStyleIds.includes(style.id) ? `取消收藏${style.name}` : `收藏${style.name}`}><Heart size={12} fill={favoriteStyleIds.includes(style.id) ? "currentColor" : "none"}/></button></div>)}</div>}</div></div><div className="grid gap-6 lg:grid-cols-[0.83fr_1.17fr]">
          <div className="border border-[#222321]/15 bg-[#fffdf8] p-6 shadow-[0_16px_50px_rgba(47,53,48,0.08)] sm:p-8"><div className="mb-7 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa69b]">Step 01 / 02</p><h3 className="mt-2 text-xl font-semibold">告訴我們你的專案</h3></div><span className="font-mono text-[11px] text-[#0f8f86]">{generated ? "READY" : "DRAFT"}</span></div><label className="mb-3 block text-[12px] font-bold">你的行業</label><div className="relative mb-7"><select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full appearance-none border border-[#222321]/20 bg-[#f4f1eb] px-4 py-3 text-sm outline-none transition-colors focus:border-[#0f8f86]"><option>室內設計</option><option>行銷顧問</option><option>攝影服務</option><option>工程承包</option><option>自由接案</option></select><ChevronDown className="pointer-events-none absolute right-4 top-3.5" size={16} /></div><label className="mb-3 block text-[12px] font-bold">用一句話描述需求</label><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} className="w-full resize-none border border-[#222321]/20 bg-[#f4f1eb] px-4 py-3 text-sm leading-6 outline-none transition-colors focus:border-[#0f8f86]" placeholder="例如：幫客戶規劃一套..."/><div className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-[#858279]"><Lightbulb size={15} className="mt-0.5 shrink-0 text-[#0f8f86]" /> 描述越接近你平常的工作語言，建議的品項就會越貼近實際。</div><button onClick={generateQuote} className="mt-7 flex w-full items-center justify-center gap-2 bg-[#0f8f86] px-4 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_#222321] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">{generated ? "重新整理這份報價" : "生成我的報價草稿"} <Sparkles size={16} /></button></div>
          <div className="relative border p-4 sm:p-6" style={{ backgroundColor: activeStyle.surface, borderColor: activeStyle.border }}><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c887d]">Live preview / {industry}</p><h3 className="mt-1 text-xl font-semibold">報價單預覽</h3></div><div className="flex gap-1"><button onClick={() => notifyAction("預覽設定")} className="grid size-8 place-items-center border border-[#222321]/15 bg-[#f4f1eb]" aria-label="更多設定"><MoreHorizontal size={16}/></button></div></div><div className="mb-4 grid gap-3 border border-[#222321]/12 bg-[#f4f1eb] p-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#88857B]">客戶名稱<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-2 w-full border-b border-[#222321]/20 bg-transparent py-1 text-[12px] font-semibold outline-none focus:border-[#0f8f86]" /></label><label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#88857B]">報價日期<input type="date" value={quoteDate} onChange={(event) => setQuoteDate(event.target.value)} className="mt-2 w-full border-b border-[#222321]/20 bg-transparent py-1 text-[12px] font-semibold outline-none focus:border-[#0f8f86]" /></label><label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#88857B]">付款條件<input value={paymentTerms} onChange={(event) => setPaymentTerms(event.target.value)} className="mt-2 w-full border-b border-[#222321]/20 bg-transparent py-1 text-[12px] font-semibold outline-none focus:border-[#0f8f86]" /></label><label className="flex items-end gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#88857B]"><span className="flex-1">品牌 Logo<input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="mt-2 block w-full text-[10px] font-normal normal-case tracking-normal file:mr-2 file:border-0 file:bg-[#222321] file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-white" /></span>{logoUrl ? <img src={logoUrl} alt="已上傳品牌 Logo" className="size-9 object-contain" /> : <span className="grid size-9 place-items-center border border-dashed border-[#222321]/25 text-[9px]">LOGO</span>}</label></div><div ref={quotePreviewRef} className="min-h-[490px] border p-5 sm:p-8" style={{ backgroundColor: activeStyle.paper, borderColor: activeStyle.border, borderRadius: activeStyle.radius, boxShadow: activeStyle.shadow, color: activeStyle.ink }}><div className="mb-3 flex items-center justify-between"><span className="proof-tag" style={{ backgroundColor: `${activeStyle.accent}20`, color: activeStyle.accent }}><span className="size-1.5 rounded-full" style={{ backgroundColor: activeStyle.accent }} /> AI 版面已套用</span><span className="font-mono text-[9px] text-[#99958a]">{activeStyle.id.toUpperCase()}</span></div><div className="flex justify-between border-b border-[#222321]/15 pb-5"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center border border-dashed text-[9px]" style={{ borderColor: activeStyle.accent, color: activeStyle.accent }}>{logoUrl ? <img src={logoUrl} alt="品牌 Logo" className="size-full object-contain" /> : "LOGO"}</div><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: activeStyle.accent }}><BadgeCheck size={13} /> QuoteCraft AI</div><h4 className="font-serif text-3xl tracking-[-0.05em]">專案服務報價單</h4></div></div><div className="text-right text-[10px] leading-5 text-[#99958a]">QUOTE NO.<br/><strong className="font-mono text-[#222321]">QC-2026-018</strong><br/><span>{quoteDate}</span></div></div><div className="grid grid-cols-2 gap-4 border-b border-[#222321]/10 py-5 text-[11px]"><div><p className="mb-1 text-[#aaa69b]">客戶名稱</p><p className="font-semibold">{customerName || "未填寫客戶名稱"}</p></div><div><p className="mb-1 text-[#aaa69b]">專案類型</p><p className="font-semibold">{industry}</p></div></div><div className="py-4">{items.map((item,index)=><div key={`${item.id}-${index}`} className="group grid grid-cols-[26px_1fr_auto] gap-3 border-b border-dashed py-3 text-[12px]" style={{ borderColor: activeStyle.border }}><span className="font-mono text-[10px] text-[#aaa69b]">0{index+1}</span><div className="min-w-0"><input aria-label={`編輯第 ${index + 1} 項名稱`} value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} className="w-full border-b border-transparent bg-transparent px-0 py-0 font-semibold outline-none transition-colors focus:border-current"/><input aria-label={`編輯第 ${index + 1} 項說明`} value={item.detail} onChange={(event) => updateItem(index, "detail", event.target.value)} className="mt-1 w-full border-b border-transparent bg-transparent px-0 py-0 text-[10px] text-[#949187] outline-none transition-colors focus:border-current"/></div><div className="flex items-start gap-2"><label className="flex items-center font-mono">NT$ <input aria-label={`編輯第 ${index + 1} 項金額`} value={item.price} onChange={(event) => updateItem(index, "price", event.target.value)} type="number" min="0" className="w-20 bg-transparent text-right font-mono outline-none"/></label><button className="hidden text-[#aaa69b] group-hover:block" onClick={() => setItems((current) => current.filter((_,i) => i !== index))} aria-label={`刪除${item.name}`}><X size={13}/></button></div></div>)}</div><div className="flex flex-wrap items-center justify-between gap-3"><button onClick={addItem} className="flex items-center gap-1.5 py-3 text-[11px] font-bold text-[#0f8f86] hover:underline"><Plus size={14}/> 新增報價項目</button><span className="text-[10px] text-[#99958a]">點擊文字與金額即可編輯</span></div><div className="mt-3 flex items-end justify-between border-t border-[#222321]/15 pt-5"><div className="max-w-[230px] text-[10px] leading-5 text-[#99958a]">付款條件：{paymentTerms || "尚未設定"}。報價有效期限 14 天。</div><div className="text-right"><p className="text-[10px] text-[#99958a]">含稅總額</p><p className="mt-1 font-mono text-2xl font-bold tracking-[-0.06em]">NT$ {money(total)}</p><p className="mt-1 text-[10px] text-[#aaa69b]">未稅小計 NT$ {money(subtotal)} · 稅額 NT$ {money(tax)}</p></div></div></div><div className="mt-4 flex flex-wrap justify-end gap-2"><button onClick={() => notifyAction("已複製報價連結")} className="flex items-center gap-2 border border-[#222321]/15 bg-[#f4f1eb] px-3 py-2 text-[11px] font-bold hover:border-[#0f8f86]"><Copy size={14}/> 複製連結</button><button onClick={exportImage} className="flex items-center gap-2 border border-[#222321]/15 bg-[#f4f1eb] px-3 py-2 text-[11px] font-bold hover:border-[#0f8f86]"><ImageDown size={14}/> 高清 PNG</button><button onClick={exportPdf} className="flex items-center gap-2 bg-[#222321] px-3 py-2 text-[11px] font-bold text-[#f4f1eb] hover:bg-[#0f8f86]"><FileDown size={14}/> 下載 PDF</button></div></div>
        </div>
      </section>

      <section id="templates" className="border-t border-[#222321]/10 bg-[#e9e5dc]"><div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f8f86]">Built for the real work</p><h2 className="font-serif text-5xl leading-none tracking-[-0.06em]">每個行業，<br/><em>都有自己的說法。</em></h2><p className="mt-5 max-w-[360px] text-sm leading-7 text-[#6f6d64]">我們不把所有人塞進同一張模板。從服務語言開始，才有真正能用的報價。</p></div><div className="grid gap-px border border-[#222321]/15 bg-[#222321]/15 sm:grid-cols-2 lg:grid-cols-3">{industries.map((item, index) => <button key={item.id} onClick={() => { setIndustry(item.label); document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" }); }} className={`group relative bg-[#f4f1eb] p-6 text-left transition-colors hover:bg-[#fffdf8] ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}><div className="mb-12 flex items-start justify-between"><span className="grid size-9 place-items-center border border-[#222321]/15 text-lg">{item.icon}</span><ArrowUpRight size={16} className="text-[#aaa69b] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#0f8f86]"/></div><p className="font-serif text-2xl tracking-[-0.04em]">{item.label}</p><p className="mt-2 text-[11px] text-[#8e8b82]">{item.note}</p><p className="mt-4 border-t border-dashed border-[#222321]/15 pt-3 text-[10px] leading-4 text-[#aaa69b]">{item.quoteDetails.join(" · ")}</p></button>)}</div></div></div></section>

      <footer className="bg-[#222321] text-[#f4f1eb]"><div className="mx-auto max-w-[1360px] px-5 py-12 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-8 border-b border-[#f4f1eb]/15 pb-10 sm:flex-row sm:items-end"><div><div className="mb-4 flex items-center gap-3"><span className="grid size-8 place-items-center bg-[#0f8f86] text-lg">⌁</span><span className="font-serif text-xl tracking-[-0.04em]">報價智造</span></div><p className="max-w-[300px] text-sm leading-6 text-[#aaa9a1]">把專業整理好，讓每一次報價都更接近成交。</p></div><div className="flex gap-8 text-[12px] text-[#aaa9a1]"><a href="#workflow" className="hover:text-[#7bcfc1]">怎麼運作</a><a href="#templates" className="hover:text-[#7bcfc1]">行業模板</a><a href="#workspace" className="hover:text-[#7bcfc1]">開始使用</a></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-[10px] uppercase tracking-[0.16em] text-[#777970] sm:flex-row"><span>© 2026 QuoteCraft AI</span><span>Made for people who do the work.</span></div></div></footer>
    </main>
  );
}
