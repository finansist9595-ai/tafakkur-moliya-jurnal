if (typeof React === "undefined") { document.getElementById("root").innerHTML = "<div style='color:#FBF8F0;padding:20px;font-family:monospace;'>XATOLIK: React yuklanmadi (CDN muammosi bo'lishi mumkin)</div>"; throw new Error("React missing"); }
if (typeof Recharts === "undefined") { document.getElementById("root").innerHTML = "<div style='color:#FBF8F0;padding:20px;font-family:monospace;'>XATOLIK: Recharts yuklanmadi (CDN muammosi bo'lishi mumkin)</div>"; throw new Error("Recharts missing"); }
const { useState, useEffect, useMemo } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } = Recharts;

const COLORS = {
  deepGreen: "#0B2317",
  surface: "#1E4A34",
  surface2: "#255A3F",
  gold: "#D9B24C",
  goldLight: "#F2D57E",
  goldDim: "#8A7328",
  profit: "#4FD9A0",
  loss: "#E17B6C",
  cream: "#FBF8F0",
  creamDim: "#B9C4BA",
};

const STRATEGY_TAGS = ["Reversal", "Breakout", "Pullback", "Boshqa"];
const STRATEGIES = [
  {
    "name": "Reversal",
    "definition": "Reversal, trend yo'nalishining qarama-qarshi tomonga o'zgarishini anglatadi va long pozitsiya bilan ishlaganda, reversal strategiyasi down trendda kelayotgan narx yo'nalishini yuqoriga o'zgartirib narxning uptrendga kirishiga pozitsiya ochiladi. Downtrenddagi aksiyalar qisqa muddatga tiklanayotganda ishlovchi treyding strategiyasi.",
    "criteria": [
      "Downtrend liniyani buzgan bo'lishi. Biz long bilan ishlashimizni inobatga olib, bu degani 1 yillik muddatda kunlik taymfreymda narx downtrend liniyani buzgan bo'lishi, yani nar yuqoriga harakatlanishni boshlagan bo'ladi",
      "narx EMA 20 ni buzib o'tgan bo'ladi. Ya'ni kunlik taymfreymda narx EMA 20ni buzib o'tgan bo'lishi kerak. kuchli down trend buzilib EMA 20ni narx kesib o'tgan bo'lishi, endigina o'tgan bo'lishi kerak. boshqacha qilib aaytganda kunlik taymfreymda EMA 50ni EMA 20 pastga buzib uzoq muddat davom etib keyin qayta EMA 50ni EMA20 buzish arafasida yoki yaqinlashgan bo'ladi Va narx EMA 20dan biroz baland bo'ladi.",
      "Soatlik taymfreymda kamida 2 marta Higher Low hosil bo'lishi kerak. Bu degani men qisqa soatlik taym freymda men narxning aniq harakatini bilish uchun kerak. Yani quyi narlari ko'tarilib borishi kuzatilishi kerak. o'sha yapon shamchalarida hosil bo'lgan narxlarning o'sish boshlangan quyi narxlari yuqorilashib borishini anglatadi. Quyinarxdan keyin biroz muddat narx bir necha shamchalarda ko'trilib boradi. qayta tushganda oldingi quyi narxda yuqorida yana bir quyi narx paydo bo'ladi va qayta ko'tarilishi avvalgi quyidan yuqorida bo'ladi.",
      "Soatlik taymfreymda Higher High 2 marta bo'lishi kerak. bu degani bir down trend uptrendga o'zgarish nuqtasidan boshlab yuqori narlar paydo bo'lishi degani. downtrend uptrendga o'zgaryotganda yuoqri narx paydo bo'lib keyinga yuqori narx oldingisidan palandda paydo bo'ladi. va yana biroz pastlaganda yana qayta ko'tarilganda keyingi yuqori narx oldingisidan yuqorida bo'ladi. shu higher high 2 marta takrorlangan bo'lishi kerak.",
      "Soatlik taym freymda eng yaqin resistance yoki gapni yuqoriga kesib o'tgan bo'lishi kerak. Ya'ni EMA 20 EMA 50ni yuqoriga kesgan holatda bo'lishi nazarda tutilyapti. narx resistance zonadan tepaga harakatlangan."
    ],
    "extra": "",
    "criteriaShort": [
      "Downtrend liniyani buzgan bo'lishi.",
      "narx EMA 20 ni buzib o'tgan bo'ladi.",
      "Soatlik taymfreymda kamida 2 marta Higher Low hosil bo'lishi kerak.",
      "Soatlik taymfreymda Higher High 2 marta bo'lishi kerak.",
      "Soatlik taym freymda eng yaqin resistance yoki gapni yuqoriga kesib o'tgan bo'lishi kerak."
    ]
  },
  {
    "name": "Breakout",
    "definition": "Breakout, narx bir necha marta tegib qaytagn qarshilik yoki qo'llab-quvvatlash zonasini buzib o'tishini anglatadi va Long pozitsiya bilan ishlaganda, breakout strategiyasi uptrendda ketayotgan narx yo'nalishini yuqoriga davom ettirgan holda ketishiga pozitsiya ochiladi. uptrenddagi aksiyalar qisqa muddatda kanalga kirib yana yuqorilashda ishlovchi strategiya.",
    "criteria": [
      "Narx yillikda uptrendda bo'lishi. Ya'ni yillkda kunlik taymfreymda uptrendda bo'lishi kerak. nimani nazarda tutyapman, 1 yillikda hozirgi narxi 1 yil oldingi narxida yuqorida bo'lishi kerak.",
      "Oldin narx kamida 2 marta resistancega tegib qaytgan bo'lib, va endi kuchli buzib o'tgan bo'lishi (agar kuchli buzmagan bo'lsa retestni kutish afzal). masalan biz yillikni kuzatyotgan bo'lsak, tarixda narx kamida 2 marta resistancega tegib qaytgan bo'lishi kerak. ya'ni to'liq sifatli tasdiq bo'lishi uchun. Va hozirgi holatda savdo imkonini izlayotgan bo'lsak, shu vaqtda narx resistanceni buzib o'tishi kerak. Bu nima degani, Narx uptrendda kelib kotarildi va resistancega tegib qaytdi vava keyingi safar biroz pastlab yana resistencega tegib qaytyapti. Nima uchun ikki marta resistencega kamida 2 mata tegib qaytish kerak.chungi kuchli uptrend bo'lmasa shoshib resistenceni buzib o'tar ekandeb pozitsiya ochib qo'ymaslik kerak. yoki resistenceni to'liq buzib o'tishini yoki kamda 2 marta resistencega tegib kuchli tasdiqdan so'ng yani resistenceni buzib keyin kirish kerak. resistencega tegish bir necha martalab ham bo'lish mumkin. Kuchli taklif zonasi paydo bo'lib kanalga tushib qoladigan bo'lsa, yani kuchli taklif borligi kuchli resistance borligi bu yerda tasdiqlanadi. Agar unday bo'lmay kuchli uptrend bo'lib ko'tarilib ketsa 3-strategiyaga PULLbackka tushadi. Ya'ni o'sishda davom etishi mumkin. etiborlisi, resistanceni kuchli buzib, ya'ni kuchli buqasimon buy hosil qilgan va shunda holat kelishini kutish kerak. kirish nuqtalariga etibor bersak, resistanceni kuchli buzish arafasi narxlari yoki buzmasa retestni kutib qayta kuchli buy nuqtasiga kelishini biz kirish nuqtalari deyishimiz mumkin. Ya'ni buqalar o'zini hukmronligini qo'lga olishidagi kirish zonalari nazarda tutilmoqda.",
      "Buy volumeni o'rtachadan ko'payishi. Ya'ni savdo hajmimiz buy tomonda ortayotgan va ko'payotgan bo'lishi kerak. o'rtachaga nisbatan ko'payishi kerak. Oxirgi kunlarda savdo hajmi buy tomonda ya'ni ortachadan ko'payishi sabablarimizni kuchaytiradi.",
      "HL (Higher Low)larni hosil bo'lishi. bu strategiyada HIGHER LOWni o'ziga etibor bersak bo'ladi. chunki bizda kuchli resistance bor. Ya'ni shunday bir holat bo'ladi, kunlik taymfreymda narxlar ko'tariladi va tushadi, yana ko'tariladi va tushadi. bu yerda dastlabki yuqori nuqtasidan pastga tushib qayta ko'tarilganda, quyi nuqta HIGHER LOW hosil bo'ldi. ikkinchi bor tushganda 2-HIGHER LOW paydo bo'lishi kerak. keyingi quyi narx dastlabki quyi narxdan balanda bo'lsa kifoya. va shu tariqa quyi narxlar yuqorilashib borib trend resistancega qarab harakatlanadi. Ya'ni konsolidatsiyadan chiqib narx ko'tarilayotganini ko'rishimiz kerak. Ya'ni bizda Low narxlarimiz ko'tarilib borishi kerak. bu narsa soatlikda masalan, 4 yoki 2 soatlikda aniqroq ko'rinadi.",
      "Narx EMA 20 va EMA 50 dan Yuqori bo'lishi. yani trend uptrenda bo'lishi kerak kunlik taymfreymda. Va narx EMA 20 VA EMA 50 dan tepada bo'lishi kerak."
    ],
    "extra": "Shu bilan birga, grafik shakillarini hosil bo'lgan bo'lishi (ko'tariluvchi uchburchak, to'rtburchak), indikatorlar momentum holatda no'lishi, EMA 20 EMA 50 ni tepaga kesib o'tgan bo'lishi kabilar qo'shimchasiga sabablarni kuchaytiradi.",
    "criteriaShort": [
      "Narx yillikda uptrendda bo'lishi.",
      "Oldin narx kamida 2 marta resistancega tegib qaytgan bo'lib, va endi kuchli buzib o'tgan bo'lishi (agar kuchli buzmagan bo'lsa retestni kutish afzal).",
      "Buy volumeni o'rtachadan ko'payishi.",
      "HL (Higher Low)larni hosil bo'lishi.",
      "Narx EMA 20 va EMA 50 dan Yuqori bo'lishi."
    ]
  },
  {
    "name": "Pullback",
    "definition": "Pullback Pullback, davom etayotgan asosiy trend ichida narx vaqtincha (qisqa muddatda) qarshi yo'nalishda yrishni anlatadi. va Long pozitsiya bilan ishlaganda, pullback startegiyasi uptrendda ketayotgan narx qisqa vaqtda pastlab keyin yana yuqoriga davom etishini boshlaganda pozitsiya ochiladi. Ya'ni yillik holatda kunlik taymfreymda kuchli uptrend davom etmoqda. shu orada trend bir tekis ko'tarolib bormaydi albatda ora-orada pullbacklar hosil bo'ladi. yani narxlar ko'tarildi va pastlab pullback hosil qildi yana ko''tariladi va pullback hosil qiladi. Ya'ni narx umumiy holati ko'tarilib borayotganda narx bir tekisda yurmaydi. ko'tarilish davomida qisqa muddatlarda sho'ng'ishlar bo'ladi. Asosiy yo'nalishini buzmasa ko'tarilishda davom etaveradi. leki qisqa muddatlarda sho'ng'ishlar ya'ni Pullbacklar hosil qiladi. Shuni teskarisi ham bo'lishi mumkin down trenda qisqa muddatlarda pastlash mobaynida biroz ko'tarilishlar bo'ladi. ammo downtrend davom etadi. lekin eslatma Biz downtrend bilan ishlamaymiz, shortga pozitsiya ochmaymiz!!!!!! faqat long pozitsiyada ishlaymiz. Biz Asosiy trend uptrend bo'lganda va pUllbackbo'lib qayta ko'tarilayotgan vaqtda kirib pozitsiya ochib olamiz.",
    "criteria": [
      "Narx EMA 20 va EMA 50 dan yuqorida bo'lishi ( 4 soatlik taymfreymda tekshirish afzal). Bu nima degani? biz aytdikki Bu strategiyada trend uptrend bo'lish kerak shuni aniqlash uchun va tasdiqlash uchun biz EMA 20 va EMA 50 lardan foydalanamiz. va Narx EMA 20 VA EMA 50dan balan bo'lishi kerak.",
      "Davom etib kelayotgan LL (Lower Low) buzilib HL (Higher Low) hosil bo'lishi, ya'ni narx downtrend liniyani yuqoriga kesib o'tgan bo'lishi kerak. bu nima degani 4 soatlik timefreymda ko'rganimizda umumiy uptrendda qisqa muddali kichik downtrend hosil bo'lib, Narx Lower lowdan Higher lowga o'zgarishi yuqori uptrendni boshlashi desak ham bo'ladi.",
      "Asosiy zona yoki avval qayd etilgan resistance daraja supportga aylanib o'sha yerdan tepaga reaksiya olgan bo'lishi kerak. yani kichik downtrend hosil bo'lganda qaytish ya'ni qarshilik nuqta hosil bo'ladi. shu nuqtada narxni buzolmagan va qayta kichik, biros narx pastlaydi va qayta ko'tariladi. va narx resistanceni breakout bilan kesib o'tib biroz yuqorilagandan so'ng qayta downtrend hosil qilganda asosiy zona yoki avval resistance narx zonasi supportga aylanadi va shundan keyin Higher Lowlar hosil qila boshlaydi.",
      "Fibonacci retracement darajalaridan yuqorida bo'lishi. Ya'ni kunlik taymfreymda eng quyi narxdan yuqoriga fibonaccini tortamiz. fibonacci tortishda uzoq muddatni olamiz. va Asosiy zona Fibonaccida yuqorida turishi kerak. shuningdek 4 soatlikda tortganda Asosiy zona qisqa muddatli fibonaccida 0.38 dan yuqorida va shuningdek narx qisqa muddatli fibonaccidan 0.28 ni kesib o'tayotgan nuqta lar bu kirishga tasdiq desa ham bo'ladi."
    ],
    "extra": "Shu bilan birga, Price action boshqa elementlari qo'shimcha sabablarni kuchaytiradi. Masalan grafik shakillardan 3 burchak, yani pastda supportzona va downtrend liniyani chizadigan bo'lsak 3 burchak hosil bo'ladi. va narx uchburchakni boshqacha qilib aytganda kichik downtrendni narx kesib o'tayotganini ko'rsak bo'ladi.",
    "criteriaShort": [
      "Narx EMA 20 va EMA 50 dan yuqorida bo'lishi ( 4 soatlik taymfreymda tekshirish afzal).",
      "Davom etib kelayotgan LL (Lower Low) buzilib HL (Higher Low) hosil bo'lishi, ya'ni narx downtrend liniyani yuqoriga kesib o'tgan bo'lishi kerak.",
      "Asosiy zona yoki avval qayd etilgan resistance daraja supportga aylanib o'sha yerdan tepaga reaksiya olgan bo'lishi kerak.",
      "Fibonacci retracement darajalaridan yuqorida bo'lishi."
    ]
  }
];

const EMOTION_TAGS = ["Xotirjam", "Ishonchli", "FOMO", "Qo'rquv", "Sabrsizlik", "Qasos (revenge)"];
const SECTOR_TAGS = ["Texnologiya", "Sog'liqni saqlash", "Moliya", "Energetika", "Iste'mol tovarlari", "Sanoat", "Kommunal xizmatlar", "Boshqa"];
const SECTOR_COLORS = ["#D9B24C", "#4FD9A0", "#7FB3E0", "#E17B6C", "#C79FE8", "#E0B85C", "#7FD4C9", "#B9C4BA"];
const CHECKLIST_ITEMS = [
  { id: "c1", text: "Bozor ochilishidan avval oxirgi yangiliklarni ko'rib chiqdim" },
  { id: "c2", text: "Oldingi kun ochilgan pozitsiyalarga Stop Loss qo'yildimi tekshirdim" },
  { id: "c3", text: "Haftalik tahlildagi nomzod aksiyalar holatini kuzatdim" },
  { id: "c4", text: "Kirish uchun barcha mezonlar mos tushdi" },
  { id: "c5", text: "Bitta savdodagi risk 1-2% dan oshmadi" },
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  const d1 = new Date(a), d2 = new Date(b);
  return Math.max(0, Math.round((d2 - d1) / 86400000));
}
function fmtMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toFixed(2);
}
function fmtPct(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return sign + (n * 100).toFixed(1) + "%";
}
function fmtNum(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toFixed(d);
}

function IconBase({ children, size = 20, color = "currentColor", strokeWidth = 2, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      {children}
    </svg>
  );
}
const Home = (p) => <IconBase {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></IconBase>;
const BookOpen = (p) => <IconBase {...p}><path d="M3 5c2-1 5-1 7 0v14c-2-1-5-1-7 0z" /><path d="M21 5c-2-1-5-1-7 0v14c2-1 5-1 7 0z" /></IconBase>;
const Target = (p) => <IconBase {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" /></IconBase>;
const Eye = (p) => <IconBase {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></IconBase>;
const BarChart3 = (p) => <IconBase {...p}><path d="M4 20V10M12 20V4M20 20v-7" /></IconBase>;
const Plus = (p) => <IconBase {...p}><path d="M12 5v14M5 12h14" /></IconBase>;
const X = (p) => <IconBase {...p}><path d="M18 6L6 18M6 6l12 12" /></IconBase>;
const Check = (p) => <IconBase {...p}><path d="M20 6L9 17l-5-5" /></IconBase>;
const Edit2 = (p) => <IconBase {...p}><path d="M17 3a2.8 2.8 0 114 4L7 21l-4 1 1-4z" /></IconBase>;
const Trash2 = (p) => <IconBase {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></IconBase>;
const TrendingUp = (p) => <IconBase {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></IconBase>;
const TrendingDown = (p) => <IconBase {...p}><path d="M3 7l6 6 4-4 8 8" /><path d="M17 17h4v-4" /></IconBase>;
const Scale = (p) => <IconBase {...p}><path d="M12 3v18M5 8l-3 6a4 4 0 008 0zM19 8l-3 6a4 4 0 008 0z" /><path d="M5 8h14M9 21h6" /></IconBase>;
const Calendar = (p) => <IconBase {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></IconBase>;
const Sparkles = (p) => <IconBase {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 15l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z" /></IconBase>;
const Calculator = (p) => <IconBase {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" /></IconBase>;
const AlertTriangle = (p) => <IconBase {...p}><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 17h.01" /></IconBase>;
const ChevronRight = (p) => <IconBase {...p}><path d="M9 6l6 6-6 6" /></IconBase>;
const ChevronDown = (p) => <IconBase {...p}><path d="M6 9l6 6 6-6" /></IconBase>;
const ChevronLeft = (p) => <IconBase {...p}><path d="M15 6l-6 6 6 6" /></IconBase>;
const Loader2 = (p) => <IconBase {...p}><path d="M12 3a9 9 0 109 9" /></IconBase>;
const ShieldCheck = (p) => <IconBase {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></IconBase>;
const Info = (p) => <IconBase {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></IconBase>;
const CalendarDays = (p) => <IconBase {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><circle cx="8" cy="15" r="1" /><circle cx="12" cy="15" r="1" /><circle cx="16" cy="15" r="1" /></IconBase>;
const CalendarRange = (p) => <IconBase {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M8 15h8" /></IconBase>;
const ListChecks = (p) => <IconBase {...p}><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" /><path d="M10 6h10M10 12h10M10 18h10" /></IconBase>;
const History = (p) => <IconBase {...p}><path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5M12 7v5l4 2" /></IconBase>;
const Download = (p) => <IconBase {...p}><path d="M12 3v13m0 0l4-4m-4 4l-4-4" /><path d="M4 20h16" /></IconBase>;
const Coins = (p) => <IconBase {...p}><circle cx="9" cy="9" r="6" /><path d="M14.5 14.5a6 6 0 108-8" /></IconBase>;
const Wallet = (p) => <IconBase {...p}><path d="M3 7a2 2 0 012-2h13a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M16 12h4M16.2 12a1.5 1.5 0 000 3H20v-3z" /></IconBase>;
const Settings = (p) => <IconBase {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 00-.2-1.6l2-1.5-2-3.5-2.3.9a7 7 0 00-2.8-1.6L15.3 2h-2.6l-.4 2.7a7 7 0 00-2.8 1.6l-2.3-.9-2 3.5 2 1.5A7 7 0 005 12c0 .5.1 1.1.2 1.6l-2 1.5 2 3.5 2.3-.9c.8.7 1.8 1.3 2.8 1.6l.4 2.7h2.6l.4-2.7a7 7 0 002.8-1.6l2.3.9 2-3.5-2-1.5c.1-.5.2-1.1.2-1.6z" /></IconBase>;
const RefreshCw = (p) => <IconBase {...p}><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></IconBase>;

function computeTrade(t) {
  const totalBuy = t.qty * t.buyPrice;
  const isOpen = !t.sellDate || t.sellPrice === null || t.sellPrice === undefined || t.sellPrice === "";
  const sellPrice = isOpen ? null : Number(t.sellPrice);
  const profitUsd = isOpen ? null : (sellPrice - t.buyPrice) * t.qty - (Number(t.brokerFee) || 0);
  const profitPct = isOpen ? null : sellPrice / t.buyPrice - 1;
  const daysHeld = isOpen ? daysBetween(t.buyDate, todayISO()) : daysBetween(t.buyDate, t.sellDate);
  let rMultiple = null;
  const sl = t.stopLoss ? Number(t.stopLoss) : null;
  const tp = t.takeProfit ? Number(t.takeProfit) : null;
  if (sl && sl !== t.buyPrice) {
    const riskPerShare = t.buyPrice - sl;
    if (riskPerShare !== 0) {
      if (!isOpen) rMultiple = (sellPrice - t.buyPrice) / riskPerShare;
      else if (tp) rMultiple = (tp - t.buyPrice) / riskPerShare;
    }
  }
  return {
    ...t,
    totalBuy,
    isOpen,
    sellPrice,
    profitUsd,
    profitPct,
    daysHeld,
    rMultiple,
    isWin: profitUsd !== null ? profitUsd > 0 : null,
    taxTerm: isOpen ? null : daysHeld >= 365 ? "long" : "short",
    sector: t.sector || "Boshqa",
  };
}

function computePortfolioStats(trades, capitalTx) {
  const netCapital = (capitalTx || []).reduce((s, c) => s + (c.type === "withdrawal" ? -Number(c.amount) : Number(c.amount)), 0);
  const computed = trades.map(computeTrade);
  const closed = computed.filter((c) => !c.isOpen);
  const open = computed.filter((c) => c.isOpen);
  const realizedPL = closed.reduce((s, c) => s + c.profitUsd, 0);
  const unrealizedPL = open.reduce((s, c) => (c.currentPrice ? s + (Number(c.currentPrice) - c.buyPrice) * c.qty : s), 0);
  const portfolioValue = netCapital + realizedPL + unrealizedPL;
  const growthPct = netCapital > 0 ? ((realizedPL + unrealizedPL) / netCapital) * 100 : 0;
  const deployedCapital = open.reduce((s, c) => s + c.totalBuy, 0);
  const idleCash = portfolioValue - deployedCapital;
  return { netCapital, realizedPL, unrealizedPL, portfolioValue, growthPct, deployedCapital, idleCash, openPositions: open };
}

function computePortfolioTimeline(trades, capitalTx) {
  const closed = trades.map(computeTrade).filter((c) => !c.isOpen && c.sellDate);
  const events = [
    ...(capitalTx || []).filter((c) => c.date).map((c) => ({ date: c.date, delta: c.type === "withdrawal" ? -Number(c.amount) : Number(c.amount), isCapital: true })),
    ...closed.map((c) => ({ date: c.sellDate, delta: c.profitUsd, isCapital: false })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  let value = 0;
  let capital = 0;
  return events.map((e) => {
    value += e.delta;
    if (e.isCapital) capital += e.delta;
    return { date: e.date.slice(5), value: Number(value.toFixed(2)), pct: capital > 0 ? Number(((value / capital) * 100).toFixed(1)) : 0 };
  });
}

async function fetchLivePrices(symbols, apiKey) {
  const uniqueSymbols = [...new Set(symbols.map((s) => s.toUpperCase()))];
  let resp;
  try {
    resp = await fetch(
      "https://api.twelvedata.com/quote?symbol=" + uniqueSymbols.join(",") + "&apikey=" + encodeURIComponent(apiKey)
    );
  } catch (networkErr) {
    const err = new Error("CORS_OR_NETWORK");
    err.detail = networkErr.message;
    throw err;
  }
  if (!resp.ok) {
    const err = new Error("HTTP_" + resp.status);
    try {
      const body = await resp.text();
      err.detail = body.slice(0, 200);
    } catch (e2) {}
    throw err;
  }
  const data = await resp.json();
  const prices = {};
  if (uniqueSymbols.length === 1) {
    const sym = uniqueSymbols[0];
    if (data && data.close) prices[sym] = Number(data.close);
    else if (data && data.status === "error") { const err = new Error("API_ERROR"); err.detail = data.message || ""; throw err; }
  } else {
    Object.entries(data || {}).forEach(([symbol, quote]) => {
      if (quote && quote.close) prices[symbol] = Number(quote.close);
    });
  }
  return prices;
}

const SEED_TRADES = [
  { ticker: "VRT", qty: 1, buyPrice: 156.08, buyDate: "2025-12-18", sellPrice: 166, sellDate: "2025-12-22", brokerFee: 1 },
  { ticker: "ELF", qty: 5, buyPrice: 79.54, buyDate: "2025-12-18", sellPrice: 85.07, sellDate: "2026-01-08", brokerFee: 1, takeProfit: 87.28, stopLoss: 85.07 },
  { ticker: "RBRK", qty: 2, buyPrice: 79.985, buyDate: "2025-12-22", sellPrice: 75.63, sellDate: "2026-01-02", brokerFee: 1, takeProfit: 85, stopLoss: 75.63 },
  { ticker: "CVLT", qty: 1, buyPrice: 127.33, buyDate: "2025-12-24", sellPrice: 123.83, sellDate: "2026-01-02", brokerFee: 0, takeProfit: 133, stopLoss: 123.83 },
  { ticker: "CXM", qty: 5, buyPrice: 7.84, buyDate: "2025-12-30", sellPrice: 7.01, sellDate: "2026-01-15", brokerFee: 0 },
  { ticker: "CXM", qty: 10, buyPrice: 7.83, buyDate: "2025-12-31", sellPrice: 7.01, sellDate: "2026-01-15", brokerFee: 0 },
  { ticker: "IPAR", qty: 1, buyPrice: 86.07, buyDate: "2026-01-07", sellPrice: 90, sellDate: "2026-01-15", brokerFee: 0.9 },
  { ticker: "IPAR", qty: 1, buyPrice: 85.56, buyDate: "2026-01-07", sellPrice: 89.36, sellDate: "2026-01-13", brokerFee: 0.86, takeProfit: 90.04 },
  { ticker: "ENPH", qty: 1, buyPrice: 35.53, buyDate: "2026-01-07", sellPrice: 37.22, sellDate: "2026-01-13", brokerFee: 0.35, takeProfit: 38 },
  { ticker: "ENPH", qty: 2, buyPrice: 35.53, buyDate: "2026-01-07", sellPrice: 37.47, sellDate: "2026-01-13", brokerFee: 1, takeProfit: 38 },
  { ticker: "CRDO", qty: 1, buyPrice: 153.6, buyDate: "2026-01-15", sellPrice: 139.81, sellDate: "2026-01-21", brokerFee: 1, notes: "TP va SL qo'yilmagan edi, shu sabab foyda yoki minimal zarar bilan chiqish imkoni bo'lmadi." },
  { ticker: "ENPH", qty: 2, buyPrice: 35.32, buyDate: "2026-01-17", sellPrice: 37, sellDate: "2026-01-22", brokerFee: 0.78, notes: "Riskdan havotirlanib TP kam qo'yilgan edi, shu sabab erta Take Profit ishladi." },
  { ticker: "IOT", qty: 2, buyPrice: 35, buyDate: "2026-01-16", sellPrice: 24.79, sellDate: "2026-02-03", brokerFee: 1 },
  { ticker: "VRT", qty: 1, buyPrice: 177.6, buyDate: "2026-01-17", sellPrice: 176.02, sellDate: "2026-01-21", brokerFee: 1, notes: "SL bo'yicha risk kam olingani uchun Stop Loss tez ishladi." },
  { ticker: "NXT", qty: 2, buyPrice: 99.6, buyDate: "2026-01-21", sellPrice: 104.58, sellDate: "2026-01-22", brokerFee: 1 },
  { ticker: "CRDO", qty: 2, buyPrice: 133.01, buyDate: "2026-01-22", sellPrice: 121.84, sellDate: "2026-02-02", brokerFee: 1 },
  { ticker: "ESTC", qty: 3, buyPrice: 72, buyDate: "2026-01-23", sellPrice: 59.56, sellDate: "2026-02-03", brokerFee: 1 },
  { ticker: "INOD", qty: 5, buyPrice: 54.54, buyDate: "2026-02-03", sellPrice: 45, sellDate: "2026-02-04", brokerFee: 1 },
  { ticker: "ESTC", qty: 3, buyPrice: 59, buyDate: "2026-02-04", sellPrice: 63.9, sellDate: "2026-02-10", brokerFee: 1 },
  { ticker: "CRVL", qty: 3, buyPrice: 52.15, buyDate: "2026-02-04", sellPrice: null, sellDate: null, brokerFee: 0 },
  { ticker: "ELF", qty: 3, buyPrice: 74.5, buyDate: "2026-02-12", sellPrice: 80.8, sellDate: "2026-07-29", brokerFee: 1 },
].map((t) => ({
  id: uid(),
  type: "trade",
  strategyTag: "",
  emotionTag: "",
  matchedPlan: null,
  halalChecked: false,
  notes: "",
  brokerFee: 0,
  ...t,
}));

const cardStyle = {
  background: "linear-gradient(160deg, " + COLORS.surface2 + " 0%, " + COLORS.surface + " 100%)",
  borderRadius: 14,
  padding: 14,
  border: "1px solid " + COLORS.goldDim,
  boxShadow: "0 5px 14px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)",
};
const inputStyle = {
  width: "100%",
  background: COLORS.deepGreen,
  border: "1px solid " + COLORS.goldDim,
  borderRadius: 10,
  padding: "11px 12px",
  color: COLORS.cream,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 0 2px 5px rgba(0,0,0,0.4)",
};
const labelStyle = { fontSize: 11, color: COLORS.creamDim, marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 };
const btnGold = {
  background: "linear-gradient(180deg, #F2D57E 0%, #D9B24C 45%, #B8912E 100%)",
  color: "#2A2108",
  border: "1px solid #8A6D1F",
  borderRadius: 10,
  padding: "13px 16px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  width: "100%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.2)",
  textShadow: "0 1px 0 rgba(255,255,255,0.35)",
};
const btnGhost = {
  background: "linear-gradient(180deg, " + COLORS.surface2 + " 0%, " + COLORS.surface + " 100%)",
  color: COLORS.goldLight,
  border: "1px solid " + COLORS.goldDim,
  borderRadius: 10,
  padding: "11px 14px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 3px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
};
const sectionLabel = { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: COLORS.gold, fontWeight: 700, marginBottom: 10, marginTop: 4 };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function StrategyChecklist({ strategyName, checks, onToggle }) {
  const strat = STRATEGIES.find((s) => s.name === strategyName);
  if (!strat) return null;
  return (
    <div style={{ ...cardStyle, marginBottom: 14 }}>
      <div style={sectionLabel}>{strat.name} — kirish mezonlari</div>
      {strat.criteriaShort.map((c, i) => {
        const checked = !!(checks && checks[i]);
        return (
          <div key={i} onClick={() => onToggle(i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, marginTop: 1, border: checked ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, flexShrink: 0, boxShadow: checked ? "0 2px 5px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.4)" }}>
              {checked && <Check size={12} color="#2A2108" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 12, color: checked ? COLORS.cream : COLORS.creamDim, lineHeight: 1.4 }}>{c}</span>
          </div>
        );
      })}
      <div style={{ fontSize: 10, color: COLORS.creamDim, marginTop: 4 }}>{Object.values(checks || {}).filter(Boolean).length} / {strat.criteriaShort.length} mezon bajarildi</div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(4,10,7,0.78)", zIndex: 50, display: "flex", alignItems: "flex-end", borderRadius: 20 }}>
      <div style={{ background: COLORS.deepGreen, borderTop: "1px solid " + COLORS.goldDim, borderRadius: "18px 18px 0 0", width: "100%", maxHeight: "88%", overflowY: "auto", padding: 18, boxSizing: "border-box", boxShadow: "0 -8px 24px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="tm-serif tm-gold-shine" style={{ fontSize: 18 }}>{title}</div>
          <button onClick={onClose} style={{ background: "linear-gradient(180deg, " + COLORS.surface2 + ", " + COLORS.surface + ")", border: "1px solid " + COLORS.goldDim, borderRadius: 8, padding: 7, color: COLORS.cream, cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MizonScale({ winRate }) {
  const wr = isNaN(winRate) ? 50 : winRate;
  const tilt = ((wr - 50) / 50) * -11;
  return (
    <svg viewBox="0 0 240 110" width="180" height="82" style={{ filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.45))" }}>
      <defs>
        <linearGradient id="tmGoldBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2D57E" />
          <stop offset="100%" stopColor="#B8912E" />
        </linearGradient>
      </defs>
      <line x1="120" y1="18" x2="120" y2="86" stroke="url(#tmGoldBar)" strokeWidth="5" strokeLinecap="round" />
      <rect x="92" y="86" width="56" height="7" rx="3.5" fill="url(#tmGoldBar)" />
      <circle cx="120" cy="15" r="7" fill={COLORS.goldLight} />
      <g style={{ transform: "rotate(" + tilt + "deg)", transformOrigin: "120px 20px", transition: "transform 0.7s ease" }}>
        <line x1="32" y1="20" x2="208" y2="20" stroke="url(#tmGoldBar)" strokeWidth="5" strokeLinecap="round" />
        <line x1="32" y1="20" x2="32" y2="42" stroke={COLORS.gold} strokeWidth="2" />
        <ellipse cx="32" cy="49" rx="22" ry="8" fill={COLORS.profit} />
        <line x1="208" y1="20" x2="208" y2="42" stroke={COLORS.gold} strokeWidth="2" />
        <ellipse cx="208" cy="49" rx="22" ry="8" fill={COLORS.loss} />
      </g>
    </svg>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 12px" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid #8A6D1F", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, " + COLORS.surface2 + " 0%, " + COLORS.deepGreen + " 100%)", flexShrink: 0, boxShadow: "0 3px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 2px rgba(217,178,76,0.5)" }}>
        <span className="tm-serif tm-gold-shine" style={{ fontSize: 16, fontWeight: 700 }}>TM</span>
      </div>
      <div>
        <div className="tm-serif tm-gold-shine" style={{ fontSize: 20, lineHeight: 1.1 }}>Tafakkur Moliya</div>
        <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.gold, marginTop: 3 }}>
          Oltin mezonlar • Adolat • Abadiy manfaat
        </div>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { key: "home", icon: Home, label: "Bosh" },
    { key: "journal", icon: BookOpen, label: "Jurnal" },
    { key: "plan", icon: Target, label: "Reja" },
    { key: "watchlist", icon: Eye, label: "Kuzatuv" },
    { key: "stats", icon: BarChart3, label: "Statistika" },
  ];
  return (
    <div style={{ position: "sticky", bottom: 0, display: "flex", background: COLORS.deepGreen, borderTop: "1px solid " + COLORS.goldDim, padding: "8px 4px", zIndex: 20, borderRadius: "0 0 20px 20px" }}>
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", padding: "6px 2px", cursor: "pointer", color: active ? "#2A2108" : COLORS.creamDim }}
          >
            <div style={{ width: 34, height: 24, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : "transparent", boxShadow: active ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "none" }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} color={active ? "#2A2108" : COLORS.creamDim} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? COLORS.gold : COLORS.creamDim }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Badge({ children, color, bg }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, padding: "3px 8px", borderRadius: 20, letterSpacing: 0.3 }}>
      {children}
    </span>
  );
}

function TradeCard({ t, onEdit, onDelete }) {
  const c = computeTrade(t);
  return (
    <div style={{ ...cardStyle, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.cream }}>{t.ticker}</span>
          <Badge color={COLORS.gold} bg="rgba(212,175,55,0.15)">{t.type === "investment" ? "INVESTITSIYA" : "TRADE"}</Badge>
          {t.halalChecked && (
            <span style={{ color: COLORS.profit }}>
              <ShieldCheck size={14} />
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onEdit(t)} style={{ background: "transparent", border: "none", color: COLORS.creamDim, cursor: "pointer" }}>
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(t.id)} style={{ background: "transparent", border: "none", color: COLORS.loss, cursor: "pointer" }}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div style={{ fontSize: 12, color: COLORS.creamDim, marginBottom: 6 }}>
        {t.qty} dona · Kirish ${fmtNum(t.buyPrice)} {c.isOpen ? "· Ochiq pozitsiya" : "→ Chiqish $" + fmtNum(c.sellPrice)} · {c.sector}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.creamDim, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {c.daysHeld} kun ushlandi{c.rMultiple !== null ? " · R: " + fmtNum(c.rMultiple, 1) : ""}
          {c.taxTerm && <Badge color={c.taxTerm === "long" ? COLORS.profit : COLORS.creamDim} bg={COLORS.deepGreen}>{c.taxTerm === "long" ? "UZOQ MUDDATLI" : "QISQA MUDDATLI"}</Badge>}
        </span>
        {c.isOpen ? (
          <Badge color={COLORS.goldLight} bg="rgba(212,175,55,0.12)">OCHIQ</Badge>
        ) : (
          <span style={{ fontSize: 15, fontWeight: 700, color: c.isWin ? COLORS.profit : COLORS.loss }}>
            {fmtMoney(c.profitUsd)} ({fmtPct(c.profitPct)})
          </span>
        )}
      </div>
      {t.notes ? <div style={{ fontSize: 12, color: COLORS.creamDim, marginTop: 8, fontStyle: "italic", borderTop: "1px solid " + COLORS.goldDim, paddingTop: 8 }}>{t.notes}</div> : null}
    </div>
  );
}

function TradeFormModal({ initial, onSave, onClose }) {
  const [f, setF] = useState(
    initial
      ? { ...initial, sector: initial.sector || "Boshqa" }
      : {
          id: uid(), type: "trade", ticker: "", qty: "", buyPrice: "", buyDate: todayISO(),
          sellPrice: "", sellDate: "", brokerFee: "", takeProfit: "", stopLoss: "",
          strategyTag: "", emotionTag: "", matchedPlan: null, halalChecked: false, notes: "", sector: "Boshqa", strategyCriteria: {},
        }
  );
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!f.ticker || !f.qty || !f.buyPrice || !f.buyDate) return;
    onSave({
      ...f,
      qty: Number(f.qty),
      buyPrice: Number(f.buyPrice),
      sellPrice: f.sellPrice === "" ? null : Number(f.sellPrice),
      sellDate: f.sellDate || null,
      brokerFee: Number(f.brokerFee) || 0,
      takeProfit: f.takeProfit === "" ? null : Number(f.takeProfit),
      stopLoss: f.stopLoss === "" ? null : Number(f.stopLoss),
      ticker: f.ticker.toUpperCase(),
    });
  };

  return (
    <Modal title={initial ? "Savdoni tahrirlash" : "Yangi savdo qo'shish"} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["trade", "investment"].map((tp) => (
          <button
            key={tp}
            onClick={() => set("type", tp)}
            style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: f.type === tp ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: f.type === tp ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: f.type === tp ? "#2A2108" : COLORS.creamDim, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: f.type === tp ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {tp === "trade" ? "Trade" : "Investitsiya"}
          </button>
        ))}
      </div>

      <Field label="Aksiya belgisi (ticker)">
        <input style={inputStyle} value={f.ticker} onChange={(e) => set("ticker", e.target.value)} placeholder="Masalan: AAPL" />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Miqdori">
            <input type="number" style={inputStyle} value={f.qty} onChange={(e) => set("qty", e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Kirish narxi ($)">
            <input type="number" style={inputStyle} value={f.buyPrice} onChange={(e) => set("buyPrice", e.target.value)} />
          </Field>
        </div>
      </div>
      <Field label="Kirish sanasi">
        <input type="date" style={inputStyle} value={f.buyDate} onChange={(e) => set("buyDate", e.target.value)} />
      </Field>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Chiqish narxi ($, ochiq bo'lsa bo'sh)">
            <input type="number" style={inputStyle} value={f.sellPrice} onChange={(e) => set("sellPrice", e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Chiqish sanasi">
            <input type="date" style={inputStyle} value={f.sellDate || ""} onChange={(e) => set("sellDate", e.target.value)} />
          </Field>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Take Profit ($)">
            <input type="number" style={inputStyle} value={f.takeProfit} onChange={(e) => set("takeProfit", e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Stop Loss ($)">
            <input type="number" style={inputStyle} value={f.stopLoss} onChange={(e) => set("stopLoss", e.target.value)} />
          </Field>
        </div>
      </div>

      <Field label="Broker haqi ($)">
        <input type="number" style={inputStyle} value={f.brokerFee} onChange={(e) => set("brokerFee", e.target.value)} />
      </Field>

      <Field label="Sektor">
        <select style={inputStyle} value={f.sector} onChange={(e) => set("sector", e.target.value)}>
          {SECTOR_TAGS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Strategiya">
            <select style={inputStyle} value={f.strategyTag} onChange={(e) => set("strategyTag", e.target.value)}>
              <option value="">Tanlanmagan</option>
              {STRATEGY_TAGS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Psixologik holat">
            <select style={inputStyle} value={f.emotionTag} onChange={(e) => set("emotionTag", e.target.value)}>
              <option value="">Tanlanmagan</option>
              {EMOTION_TAGS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <StrategyChecklist strategyName={f.strategyTag} checks={f.strategyCriteria} onToggle={(i) => set("strategyCriteria", { ...(f.strategyCriteria || {}), [i]: !(f.strategyCriteria || {})[i] })} />

      <Field label="Rejaga mos keldimi?">
        <div style={{ display: "flex", gap: 8 }}>
          {[["Ha", true], ["Yo'q", false], ["Belgilanmagan", null]].map(([lab, val]) => (
            <button
              key={lab}
              onClick={() => set("matchedPlan", val)}
              style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: f.matchedPlan === val ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: f.matchedPlan === val ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: f.matchedPlan === val ? "#2A2108" : COLORS.cream, fontSize: 12, cursor: "pointer", fontWeight: 700, boxShadow: f.matchedPlan === val ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}
            >
              {lab}
            </button>
          ))}
        </div>
      </Field>

      <div onClick={() => set("halalChecked", !f.halalChecked)} style={{ display: "flex", alignItems: "center", gap: 10, ...cardStyle, marginBottom: 14, cursor: "pointer" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, border: f.halalChecked ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, display: "flex", alignItems: "center", justifyContent: "center", background: f.halalChecked ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, flexShrink: 0, boxShadow: f.halalChecked ? "0 2px 5px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.4)" }}>
          {f.halalChecked && <Check size={14} color="#2A2108" strokeWidth={3} />}
        </div>
        <span style={{ fontSize: 13, color: COLORS.cream }}>Shariat mezonlariga tekshirilgan (halol)</span>
      </div>

      <Field label="Izoh">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Kirish sababi, xatolar, o'rganilgan narsalar..." />
      </Field>

      <button style={btnGold} onClick={handleSave}>Saqlash</button>
    </Modal>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 16px", color: COLORS.creamDim }}>
      <Icon size={30} color={COLORS.goldDim} style={{ marginBottom: 10 }} />
      <div style={{ fontSize: 14, color: COLORS.cream, marginBottom: 4, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12 }}>{subtitle}</div>
    </div>
  );
}

function JournalTab({ trades, onAdd, onEdit, onDelete }) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDup, setPendingDup] = useState(null);

  const filtered = trades.filter((t) => filter === "all" || t.type === filter).sort((a, b) => (b.buyDate || "").localeCompare(a.buyDate || ""));

  const checkDuplicate = (data) => {
    return trades.some((t) => t.id !== data.id && t.ticker === data.ticker && t.buyDate === data.buyDate && Number(t.buyPrice) === Number(data.buyPrice));
  };

  const handleSave = (data) => {
    if (checkDuplicate(data) && !pendingDup) {
      setPendingDup(data);
      return;
    }
    onAdd(data);
    setShowForm(false);
    setEditing(null);
    setPendingDup(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["all", "Hammasi"], ["trade", "Trade"], ["investment", "Investitsiya"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: filter === k ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: filter === k ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: filter === k ? "#2A2108" : COLORS.creamDim, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: filter === k ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}>
            {l}
          </button>
        ))}
      </div>

      <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => { setEditing(null); setShowForm(true); }}>
        <Plus size={17} /> Yangi savdo qo'shish
      </button>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Hali savdo yo'q" subtitle="Birinchi savdongizni yuqoridagi tugma orqali qo'shing." />
      ) : (
        filtered.map((t) => (
          <TradeCard key={t.id} t={t} onEdit={(tr) => { setEditing(tr); setShowForm(true); }} onDelete={onDelete} />
        ))
      )}

      {showForm && (
        <TradeFormModal
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); setPendingDup(null); }}
          onSave={handleSave}
        />
      )}

      {pendingDup && (
        <Modal title="Diqqat" onClose={() => setPendingDup(null)}>
          <div style={{ ...cardStyle, marginBottom: 14, display: "flex", gap: 10 }}>
            <AlertTriangle size={20} color={COLORS.goldLight} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: COLORS.cream }}>
              Bir xil ticker, sana va narx bilan savdo allaqachon mavjudga o'xshaydi. Baribir saqlaysizmi?
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...btnGhost, flex: 1 }} onClick={() => setPendingDup(null)}>Bekor qilish</button>
            <button style={{ ...btnGold, flex: 1 }} onClick={() => handleSave(pendingDup)}>Baribir saqlash</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CandidateFormModal({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { id: uid(), ticker: "", currentPrice: "", entry: "", takeProfit: "", stopLoss: "", halalChecked: false, notes: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal title={initial ? "Nomzodni tahrirlash" : "Yangi nomzod aksiya"} onClose={onClose}>
      <Field label="Aksiya belgisi">
        <input style={inputStyle} value={f.ticker} onChange={(e) => set("ticker", e.target.value)} placeholder="Masalan: MSFT" />
      </Field>
      <Field label="Hozirgi narx ($)">
        <input type="number" style={inputStyle} value={f.currentPrice} onChange={(e) => set("currentPrice", e.target.value)} />
      </Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Kirish narxi"><input type="number" style={inputStyle} value={f.entry} onChange={(e) => set("entry", e.target.value)} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Take Profit"><input type="number" style={inputStyle} value={f.takeProfit} onChange={(e) => set("takeProfit", e.target.value)} /></Field></div>
      </div>
      <Field label="Stop Loss">
        <input type="number" style={inputStyle} value={f.stopLoss} onChange={(e) => set("stopLoss", e.target.value)} />
      </Field>
      <div onClick={() => set("halalChecked", !f.halalChecked)} style={{ display: "flex", alignItems: "center", gap: 10, ...cardStyle, marginBottom: 14, cursor: "pointer" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, border: f.halalChecked ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, display: "flex", alignItems: "center", justifyContent: "center", background: f.halalChecked ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, flexShrink: 0, boxShadow: f.halalChecked ? "0 2px 5px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.4)" }}>
          {f.halalChecked && <Check size={14} color="#2A2108" strokeWidth={3} />}
        </div>
        <span style={{ fontSize: 13, color: COLORS.cream }}>Shariat mezonlariga tekshirilgan</span>
      </div>
      <Field label="Izoh">
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Kirish sharti, kuzatuv sababi..." />
      </Field>
      <button style={btnGold} onClick={() => { if (!f.ticker) return; onSave({ ...f, ticker: f.ticker.toUpperCase(), currentPrice: Number(f.currentPrice) || null, entry: Number(f.entry) || null, takeProfit: Number(f.takeProfit) || null, stopLoss: Number(f.stopLoss) || null }); }}>
        Saqlash
      </button>
    </Modal>
  );
}

function WatchlistTab({ watchlist, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => { setEditing(null); setShowForm(true); }}>
        <Plus size={17} /> Nomzod aksiya qo'shish
      </button>
      {watchlist.length === 0 ? (
        <EmptyState icon={Eye} title="Kuzatuv ro'yxati bo'sh" subtitle="Haftalik tahlil paytida topilgan nomzodlarni shu yerga qo'shing." />
      ) : (
        watchlist.map((c) => {
          const near = c.currentPrice && c.entry && Math.abs(c.currentPrice / c.entry - 1) < 0.03;
          return (
            <div key={c.id} style={{ ...cardStyle, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{c.ticker}</span>
                  {c.halalChecked && <ShieldCheck size={14} color={COLORS.profit} />}
                  {near && <Badge color={COLORS.deepGreen} bg={COLORS.goldLight}>YAQIN</Badge>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setEditing(c); setShowForm(true); }} style={{ background: "transparent", border: "none", color: COLORS.creamDim, cursor: "pointer" }}><Edit2 size={15} /></button>
                  <button onClick={() => onDelete(c.id)} style={{ background: "transparent", border: "none", color: COLORS.loss, cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.creamDim }}>
                Hozirgi: ${fmtNum(c.currentPrice)} · Kirish: ${fmtNum(c.entry)} · TP: ${fmtNum(c.takeProfit)} · SL: ${fmtNum(c.stopLoss)}
              </div>
              {c.notes && <div style={{ fontSize: 12, color: COLORS.creamDim, marginTop: 6, fontStyle: "italic" }}>{c.notes}</div>}
            </div>
          );
        })
      )}
      {showForm && (
        <CandidateFormModal initial={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={(d) => { onAdd(d); setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}

function fgLabel(v) {
  if (v <= 24) return { text: "Ekstremal qo'rquv", color: COLORS.loss };
  if (v <= 44) return { text: "Qo'rquv", color: COLORS.loss };
  if (v <= 55) return { text: "Neytral", color: COLORS.creamDim };
  if (v <= 75) return { text: "Ochko'zlik", color: COLORS.profit };
  return { text: "Ekstremal ochko'zlik", color: COLORS.profit };
}

function GoalSection({ goals, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [f, setF] = useState({ mainGoal: "", tradingType: "Swing trading", strategies: "", riskTolerance: "O'rta", monthlyTarget: "", annualTarget: "", riskMgmt: "" });
  const latest = goals[goals.length - 1];
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {latest ? (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 8 }}>{latest.date} versiyasi</div>
          <div style={{ marginBottom: 8 }}><span style={labelStyle}>Asosiy maqsad</span><div style={{ fontSize: 14 }}>{latest.mainGoal}</div></div>
          <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
            <div><span style={labelStyle}>Trading turi</span><div style={{ fontSize: 13 }}>{latest.tradingType}</div></div>
            <div><span style={labelStyle}>Risk darajasi</span><div style={{ fontSize: 13 }}>{latest.riskTolerance}</div></div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
            <div><span style={labelStyle}>Oylik maqsad</span><div style={{ fontSize: 13 }}>%{latest.monthlyTarget}</div></div>
            <div><span style={labelStyle}>Yillik maqsad</span><div style={{ fontSize: 13 }}>%{latest.annualTarget}</div></div>
          </div>
          {latest.strategies && <div style={{ marginBottom: 8 }}><span style={labelStyle}>Strategiyalar</span><div style={{ fontSize: 13 }}>{latest.strategies}</div></div>}
          {latest.riskMgmt && <div><span style={labelStyle}>Risk menejment</span><div style={{ fontSize: 13 }}>{latest.riskMgmt}</div></div>}
        </div>
      ) : (
        <EmptyState icon={Target} title="Maqsad hali belgilanmagan" subtitle="Quyidagi tugma orqali birinchi maqsadingizni kiriting." />
      )}

      <button style={{ ...btnGhost, width: "100%", marginBottom: 10 }} onClick={() => setShowForm(true)}>Yangi maqsad versiyasi qo'shish</button>

      {goals.length > 1 && (
        <button onClick={() => setShowHistory(!showHistory)} style={{ background: "transparent", border: "none", color: COLORS.creamDim, fontSize: 12, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", marginBottom: 10 }}>
          <History size={14} /> Tarix ({goals.length - 1}) {showHistory ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
      {showHistory && goals.slice(0, -1).reverse().map((g) => (
        <div key={g.id} style={{ ...cardStyle, marginBottom: 8, background: COLORS.deepGreen }}>
          <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>{g.date}</div>
          <div style={{ fontSize: 13 }}>{g.mainGoal}</div>
        </div>
      ))}

      {showForm && (
        <Modal title="Yangi maqsad versiyasi" onClose={() => setShowForm(false)}>
          <Field label="Asosiy maqsad"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.mainGoal} onChange={(e) => set("mainGoal", e.target.value)} /></Field>
          <Field label="Trading turi">
            <select style={inputStyle} value={f.tradingType} onChange={(e) => set("tradingType", e.target.value)}>
              {["Skalping", "Kunlik trading", "Swing trading", "Pozitsion trading", "Uzoq muddatli investitsiya"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Asosiy strategiyalar"><input style={inputStyle} value={f.strategies} onChange={(e) => set("strategies", e.target.value)} /></Field>
          <Field label="Riskka bardoshlilik darajasi">
            <select style={inputStyle} value={f.riskTolerance} onChange={(e) => set("riskTolerance", e.target.value)}>
              {["Past", "O'rta", "Yuqori"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Oylik maqsad (%)"><input type="number" style={inputStyle} value={f.monthlyTarget} onChange={(e) => set("monthlyTarget", e.target.value)} /></Field></div>
            <div style={{ flex: 1 }}><Field label="Yillik maqsad (%)"><input type="number" style={inputStyle} value={f.annualTarget} onChange={(e) => set("annualTarget", e.target.value)} /></Field></div>
          </div>
          <Field label="Risk menejment strategiyasi"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.riskMgmt} onChange={(e) => set("riskMgmt", e.target.value)} /></Field>
          <button style={btnGold} onClick={() => { if (!f.mainGoal) return; onAdd({ id: uid(), date: todayISO(), ...f }); setShowForm(false); }}>Saqlash</button>
        </Modal>
      )}
    </div>
  );
}

function StrategyCard({ strat }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...cardStyle, marginBottom: 10 }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <span className="tm-serif tm-gold-shine" style={{ fontSize: 16 }}>{strat.name}</span>
        {open ? <ChevronDown size={16} color={COLORS.gold} /> : <ChevronRight size={16} color={COLORS.gold} />}
      </div>
      {open && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, color: COLORS.cream, lineHeight: 1.6, marginBottom: 10 }}>{strat.definition}</div>
          <div style={{ ...sectionLabel, marginBottom: 8 }}>Kriteriyalari</div>
          {strat.criteria.map((c, i) => (
            <div key={i} style={{ fontSize: 12, color: COLORS.creamDim, lineHeight: 1.5, marginBottom: 8, paddingLeft: 14, borderLeft: "2px solid " + COLORS.goldDim }}>
              <span style={{ color: COLORS.goldLight, fontWeight: 700 }}>{i + 1}. </span>{c}
            </div>
          ))}
          {strat.extra && (
            <div style={{ fontSize: 11, color: COLORS.creamDim, lineHeight: 1.5, marginTop: 8, fontStyle: "italic", borderTop: "1px solid " + COLORS.goldDim, paddingTop: 8 }}>
              {strat.extra}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StrategiesSection() {
  return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.creamDim, marginBottom: 14 }}>
        Asosiy strategiyalarimiz — barchasi faqat LONG pozitsiya uchun. Biz downtrend bilan ishlamaymiz, shortga pozitsiya ochmaymiz.
      </div>
      {STRATEGIES.map((s) => <StrategyCard key={s.name} strat={s} />)}
    </div>
  );
}

function MonthlySection({ entries, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ reviewedStocks: "", criteria: "", watchlistNote: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div>
      <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setShowForm(true)}>
        <Plus size={17} /> Yangi oylik tahlil
      </button>
      {entries.length === 0 ? (
        <EmptyState icon={CalendarRange} title="Oylik tahlil hali kiritilmagan" subtitle="Oyiga kamida 1-2 marta kuzatuvdagi aksiyalarni ko'zdan kechiring." />
      ) : (
        [...entries].reverse().map((e) => (
          <div key={e.id} style={{ ...cardStyle, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: COLORS.gold, marginBottom: 6, fontWeight: 700 }}>{e.date}</div>
            {e.reviewedStocks && <div style={{ marginBottom: 6 }}><span style={labelStyle}>Ko'rib chiqilgan aksiyalar</span><div style={{ fontSize: 13 }}>{e.reviewedStocks}</div></div>}
            {e.criteria && <div style={{ marginBottom: 6 }}><span style={labelStyle}>Tanlash kriteriyalari</span><div style={{ fontSize: 13 }}>{e.criteria}</div></div>}
            {e.watchlistNote && <div><span style={labelStyle}>Kuzatuvga qo'shilgan</span><div style={{ fontSize: 13 }}>{e.watchlistNote}</div></div>}
          </div>
        ))
      )}
      {showForm && (
        <Modal title="Yangi oylik tahlil" onClose={() => setShowForm(false)}>
          <Field label="Ko'rib chiqilgan aksiyalar"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.reviewedStocks} onChange={(e) => set("reviewedStocks", e.target.value)} /></Field>
          <Field label="Aksiya tanlash kriteriyalari"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.criteria} onChange={(e) => set("criteria", e.target.value)} /></Field>
          <Field label="Yaqin kuzatuv ro'yxatiga qo'shilganlar"><textarea style={{ ...inputStyle, minHeight: 60 }} value={f.watchlistNote} onChange={(e) => set("watchlistNote", e.target.value)} /></Field>
          <button style={btnGold} onClick={() => { onAdd({ id: uid(), date: todayISO(), ...f }); setShowForm(false); setF({ reviewedStocks: "", criteria: "", watchlistNote: "" }); }}>Saqlash</button>
        </Modal>
      )}
    </div>
  );
}

function WeeklySection({ entries, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const blank = { weekStartDate: todayISO(), sentiment: "neytral", fearGreed: 50, upcomingEvents: "", impactNotes: "", setups: [0, 1, 2, 3, 4].map(() => ({ ticker: "", entry: "", exit: "", risk: "" })) };
  const [f, setF] = useState(blank);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const setSetup = (i, k, v) => setF((p) => { const s = [...p.setups]; s[i] = { ...s[i], [k]: v }; return { ...p, setups: s }; });
  const fg = fgLabel(Number(f.fearGreed) || 50);

  return (
    <div>
      <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setShowForm(true)}>
        <Plus size={17} /> Yangi haftalik tahlil
      </button>
      {entries.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Haftalik tahlil hali kiritilmagan" subtitle="Har hafta oxirida (shanba/yakshanba) tahlil qiling." />
      ) : (
        [...entries].reverse().map((e) => (
          <div key={e.id} style={{ ...cardStyle, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>{e.weekStartDate}</span>
              <Badge color={fgLabel(e.fearGreed).color} bg="rgba(212,175,55,0.1)">F&G: {e.fearGreed} — {fgLabel(e.fearGreed).text}</Badge>
            </div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Bozor sentimenti: <b>{e.sentiment}</b></div>
            {e.upcomingEvents && <div style={{ marginBottom: 6 }}><span style={labelStyle}>Kelgusi hafta hodisalari</span><div style={{ fontSize: 13 }}>{e.upcomingEvents}</div></div>}
            {e.setups.filter((s) => s.ticker).length > 0 && (
              <div style={{ marginTop: 6 }}>
                <span style={labelStyle}>Aksiya sozlamalari</span>
                {e.setups.filter((s) => s.ticker).map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: COLORS.creamDim, marginBottom: 2 }}>
                    {s.ticker}: kirish ${s.entry} → TP ${s.exit} {s.risk ? "(" + s.risk + ")" : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
      {showForm && (
        <Modal title="Yangi haftalik tahlil" onClose={() => setShowForm(false)}>
          <Field label="Hafta sanasi"><input type="date" style={inputStyle} value={f.weekStartDate} onChange={(e) => set("weekStartDate", e.target.value)} /></Field>
          <Field label="Bozor sentimenti">
            <div style={{ display: "flex", gap: 8 }}>
              {["o'sish", "neytral", "pasayish"].map((s) => (
                <button key={s} onClick={() => set("sentiment", s)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: f.sentiment === s ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: f.sentiment === s ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: f.sentiment === s ? "#2A2108" : COLORS.cream, fontSize: 12, cursor: "pointer", fontWeight: 700, boxShadow: f.sentiment === s ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}>{s}</button>
              ))}
            </div>
          </Field>
          <Field label={"Ochko'zlik va qo'rquv indeksi: " + f.fearGreed + " (" + fg.text + ")"}>
            <input type="range" min="0" max="100" step="1" value={f.fearGreed} onChange={(e) => set("fearGreed", Number(e.target.value))} style={{ width: "100%" }} />
          </Field>
          <Field label="Kelgusi hafta bozorga ta'sir qiluvchi hodisalar/hisobotlar"><textarea style={{ ...inputStyle, minHeight: 55 }} value={f.upcomingEvents} onChange={(e) => set("upcomingEvents", e.target.value)} /></Field>
          <Field label="Savdolarga ta'siri"><textarea style={{ ...inputStyle, minHeight: 55 }} value={f.impactNotes} onChange={(e) => set("impactNotes", e.target.value)} /></Field>
          <div style={sectionLabel}>Kuzatuv ro'yxatidagi aksiyalar uchun sozlama (5 tagacha)</div>
          {f.setups.map((s, i) => (
            <div key={i} style={{ ...cardStyle, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 6 }}>{i + 1}-aksiya sozlamasi</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Ticker" value={s.ticker} onChange={(e) => setSetup(i, "ticker", e.target.value)} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="Kirish" value={s.entry} onChange={(e) => setSetup(i, "entry", e.target.value)} />
                <input style={{ ...inputStyle, flex: 1 }} placeholder="TP" value={s.exit} onChange={(e) => setSetup(i, "exit", e.target.value)} />
              </div>
              <input style={inputStyle} placeholder="Risk nisbati / SL" value={s.risk} onChange={(e) => setSetup(i, "risk", e.target.value)} />
            </div>
          ))}
          <button style={btnGold} onClick={() => { onAdd({ id: uid(), ...f, fearGreed: Number(f.fearGreed) }); setShowForm(false); setF(blank); }}>Saqlash</button>
        </Modal>
      )}
    </div>
  );
}

function DailySection({ checklist, onToggle }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: COLORS.creamDim, marginBottom: 12 }}>Bugungi tekshiruv ro'yxati — har kuni avtomatik yangilanadi</div>
      {CHECKLIST_ITEMS.map((item) => {
        const checked = !!(checklist.checks && checklist.checks[item.id]);
        return (
          <div key={item.id} onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, ...cardStyle, marginBottom: 8, cursor: "pointer" }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, border: checked ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, display: "flex", alignItems: "center", justifyContent: "center", background: checked ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, flexShrink: 0, boxShadow: checked ? "0 2px 5px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.4)" }}>
              {checked && <Check size={14} color="#2A2108" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 13, color: checked ? COLORS.creamDim : COLORS.cream, textDecoration: checked ? "line-through" : "none" }}>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}

function PlanTab({ plan, onAddGoal, onAddMonthly, onAddWeekly, dailyChecklist, onToggleCheck }) {
  const [sub, setSub] = useState("goal");
  const subs = [
    { key: "goal", label: "Maqsad", icon: Target },
    { key: "strategies", label: "Strategiyalar", icon: TrendingUp },
    { key: "monthly", label: "Oylik", icon: CalendarRange },
    { key: "weekly", label: "Haftalik", icon: CalendarDays },
    { key: "daily", label: "Kunlik", icon: ListChecks },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
        {subs.map((s) => {
          const Icon = s.icon;
          const active = sub === s.key;
          return (
            <button key={s.key} onClick={() => setSub(s.key)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 20, border: active ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: active ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: active ? "#2A2108" : COLORS.creamDim, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", boxShadow: active ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}>
              <Icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>
      {sub === "goal" && <GoalSection goals={plan.goals} onAdd={onAddGoal} />}
      {sub === "strategies" && <StrategiesSection />}
      {sub === "monthly" && <MonthlySection entries={plan.monthly} onAdd={onAddMonthly} />}
      {sub === "weekly" && <WeeklySection entries={plan.weekly} onAdd={onAddWeekly} />}
      {sub === "daily" && <DailySection checklist={dailyChecklist} onToggle={onToggleCheck} />}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: COLORS.creamDim, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || COLORS.cream }}>{value}</div>
    </div>
  );
}

const MONTH_NAMES = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const WEEKDAY_LETTERS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

function PnLCalendar({ trades }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const closed = useMemo(() => trades.map(computeTrade).filter((c) => !c.isOpen), [trades]);

  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const dailyPL = useMemo(() => {
    const map = {};
    closed.forEach((c) => {
      if (!c.sellDate) return;
      const d = new Date(c.sellDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        map[d.getDate()] = (map[d.getDate()] || 0) + c.profitUsd;
      }
    });
    return map;
  }, [closed, year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const maxAbs = Math.max(1, ...Object.values(dailyPL).map((v) => Math.abs(v)));

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const cellStyle = (day) => {
    if (day === null) return { background: "transparent", border: "none" };
    const pl = dailyPL[day];
    if (pl === undefined) return { background: COLORS.deepGreen, border: "1px solid " + COLORS.goldDim };
    const intensity = Math.min(1, Math.abs(pl) / maxAbs);
    const base = pl >= 0 ? "79,217,160" : "225,123,108";
    return { background: "rgba(" + base + "," + (0.25 + intensity * 0.55).toFixed(2) + ")", border: "1px solid " + (pl >= 0 ? COLORS.profit : COLORS.loss) };
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => setMonthOffset((m) => m - 1)} style={{ background: "linear-gradient(180deg, " + COLORS.surface2 + ", " + COLORS.surface + ")", border: "1px solid " + COLORS.goldDim, borderRadius: 8, padding: 6, color: COLORS.cream, cursor: "pointer" }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.goldLight }}>{MONTH_NAMES[month]} {year}</span>
        <button onClick={() => setMonthOffset((m) => m + 1)} style={{ background: "linear-gradient(180deg, " + COLORS.surface2 + ", " + COLORS.surface + ")", border: "1px solid " + COLORS.goldDim, borderRadius: 8, padding: 6, color: COLORS.cream, cursor: "pointer" }}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {WEEKDAY_LETTERS.map((d) => <div key={d} style={{ fontSize: 9, textAlign: "center", color: COLORS.creamDim }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          const st = cellStyle(day);
          return (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: st.background, border: st.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: COLORS.cream }}>
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsTab({ trades, capitalTx, portfolioStats, plan }) {
  const [filter, setFilter] = useState("all");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [errorRegistry, setErrorRegistry] = useState(null);
  const [errLoading, setErrLoading] = useState(false);
  const [errError, setErrError] = useState("");

  const computed = trades.filter((t) => filter === "all" || t.type === filter).map(computeTrade);
  const closed = computed.filter((c) => !c.isOpen);
  const wins = closed.filter((c) => c.isWin);
  const losses = closed.filter((c) => !c.isWin);
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 50;
  const totalPL = closed.reduce((s, c) => s + c.profitUsd, 0);
  const grossProfit = wins.reduce((s, c) => s + c.profitUsd, 0);
  const grossLoss = Math.abs(losses.reduce((s, c) => s + c.profitUsd, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
  const avgDays = closed.length ? closed.reduce((s, c) => s + c.daysHeld, 0) / closed.length : 0;
  const openCount = computed.filter((c) => c.isOpen).length;

  const equityData = useMemo(() => {
    const sorted = [...closed].sort((a, b) => (a.sellDate || "").localeCompare(b.sellDate || ""));
    let running = 0;
    return sorted.map((c) => {
      running += c.profitUsd;
      return { date: c.sellDate ? c.sellDate.slice(5) : "", value: Number(running.toFixed(2)) };
    });
  }, [closed]);

  const drawdownData = useMemo(() => {
    let peak = 0;
    return equityData.map((d) => {
      peak = Math.max(peak, d.value);
      return { date: d.date, dd: Number((d.value - peak).toFixed(2)) };
    });
  }, [equityData]);
  const maxDrawdown = drawdownData.length ? Math.min(...drawdownData.map((d) => d.dd)) : 0;
  const maxDrawdownPct = portfolioStats && portfolioStats.netCapital > 0 ? (maxDrawdown / portfolioStats.netCapital) * 100 : 0;

  const portfolioTimeline = useMemo(() => computePortfolioTimeline(trades, capitalTx || []), [trades, capitalTx]);

  const concentration = useMemo(() => {
    if (!portfolioStats || !portfolioStats.portfolioValue) return [];
    return (portfolioStats.openPositions || [])
      .map((p) => ({ ticker: p.ticker, pct: (p.totalBuy / portfolioStats.portfolioValue) * 100, value: p.totalBuy }))
      .sort((a, b) => b.pct - a.pct);
  }, [portfolioStats]);

  const latestGoal = plan && plan.goals && plan.goals.length ? plan.goals[plan.goals.length - 1] : null;

  const sectorSplit = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      const sec = t.sector || "Boshqa";
      map[sec] = (map[sec] || 0) + t.qty * t.buyPrice;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) })).filter((d) => d.value > 0);
  }, [trades]);

  const shortTermPL = closed.filter((c) => c.taxTerm === "short").reduce((s, c) => s + c.profitUsd, 0);
  const longTermPL = closed.filter((c) => c.taxTerm === "long").reduce((s, c) => s + c.profitUsd, 0);

  const strategyStats = useMemo(() => {
    const map = {};
    closed.forEach((c) => {
      const key = c.strategyTag || "Belgilanmagan";
      if (!map[key]) map[key] = { total: 0, wins: 0, pl: 0 };
      map[key].total += 1;
      if (c.isWin) map[key].wins += 1;
      map[key].pl += c.profitUsd;
    });
    return Object.entries(map).map(([name, v]) => ({ name, winRate: (v.wins / v.total) * 100, total: v.total, pl: v.pl })).sort((a, b) => b.total - a.total);
  }, [closed]);

  const planVsActual = useMemo(() => {
    const matched = closed.filter((c) => c.matchedPlan === true);
    const deviated = closed.filter((c) => c.matchedPlan === false);
    const calc = (arr) => ({
      total: arr.length,
      winRate: arr.length ? (arr.filter((c) => c.isWin).length / arr.length) * 100 : 0,
      pl: arr.reduce((s, c) => s + c.profitUsd, 0),
    });
    return { matched: calc(matched), deviated: calc(deviated) };
  }, [closed]);

  const typeSplit = useMemo(() => {
    const tradeSum = trades.filter((t) => t.type === "trade").reduce((s, t) => s + t.qty * t.buyPrice, 0);
    const investSum = trades.filter((t) => t.type === "investment").reduce((s, t) => s + t.qty * t.buyPrice, 0);
    return [
      { name: "Trade", value: Number(tradeSum.toFixed(2)) },
      { name: "Investitsiya", value: Number(investSum.toFixed(2)) },
    ].filter((d) => d.value > 0);
  }, [trades]);

  const bestWorst = [...closed].sort((a, b) => b.profitUsd - a.profitUsd);
  const best = bestWorst.slice(0, 3);
  const worst = bestWorst.slice(-3).reverse();

  const runAI = async () => {
    setAiLoading(true);
    setAiError("");
    setAiText("");
    try {
      const recent = closed.slice(-12).map((c) => c.ticker + ": " + (c.isWin ? "foyda" : "zarar") + " " + fmtPct(c.profitPct) + (c.notes ? ", izoh: " + c.notes : "")).join("\n");
      const prompt = "Sen tajribali, mehribon trading murabbiysisan. Quyida foydalanuvchining so'nggi yopilgan savdolari keltirilgan. O'zbek tilida, 120-180 so'z atrofida, qisqa va konstruktiv tahlil ber: naqshlarni top (masalan takrorlanayotgan xatolar), ijobiy tomonlarni ham qayd et, hukm chiqarmasdan kuzatuv taqdim et. Yakuniy qarorni foydalanuvchining o'zi qabul qilishini unutma.\n\nWin rate: " + winRate.toFixed(0) + "%, Profit Factor: " + profitFactor.toFixed(2) + "\n\nSavdolar:\n" + recent;
      const text = await callAIProxy(prompt);
      setAiText(text || "Tahlil olinmadi.");
    } catch (e) {
      setAiError("AI tahlilni olishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    } finally {
      setAiLoading(false);
    }
  };

  const runErrorAnalysis = async () => {
    setErrLoading(true);
    setErrError("");
    setErrorRegistry(null);
    try {
      const withNotes = closed.filter((c) => c.notes && c.notes.trim().length > 0);
      if (withNotes.length === 0) {
        setErrError("Hali izohli savdolar yo'q. Jurnalga xato/sabab yozib borilsa, bu yerda naqshlar chiqadi.");
        setErrLoading(false);
        return;
      }
      const list = withNotes.map((c) => "- " + c.ticker + " (" + (c.isWin ? "foyda" : "zarar") + "): " + c.notes).join("\n");
      const prompt = "Quyida foydalanuvchining savdo jurnalidagi izohlari keltirilgan (asosan xato yoki o'rganilgan narsalar haqida). Bu izohlarni o'xshash naqshlar bo'yicha guruhla va TAKRORLANUVCHI xatolarni top. FAQAT quyidagi JSON massiv formatida javob ber, hech qanday boshqa matn, izoh yoki markdown belgisisiz:\n[{\"pattern\": \"xato nomi o'zbek tilida, qisqa\", \"count\": necha marta uchragani (son), \"tip\": \"qisqa maslahat, o'zbek tilida, 1 gap\"}]\n\nFaqat haqiqatan 2 yoki undan ko'p marta takrorlangan naqshlarni kirit. Agar hech qanday takrorlanuvchi naqsh topilmasa, bo'sh massiv [] qaytar.\n\nIzohlar:\n" + list;
      const resp_text = await callAIProxy(prompt);
      const cleaned = resp_text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setErrorRegistry(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setErrError("Xatolarni tahlil qilishda muammo yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    } finally {
      setErrLoading(false);
    }
  };

  const pieColors = [COLORS.gold, COLORS.profit];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["all", "Hammasi"], ["trade", "Trade"], ["investment", "Investitsiya"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: filter === k ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: filter === k ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: filter === k ? "#2A2108" : COLORS.creamDim, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: filter === k ? "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.3)" }}>
            {l}
          </button>
        ))}
      </div>

      {portfolioStats && (
        <div style={{ ...cardStyle, marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>Portfel qiymati</div>
          <div className="tm-gold-shine" style={{ fontSize: 26, fontWeight: 700 }}>{fmtMoney(portfolioStats.portfolioValue)}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: portfolioStats.growthPct >= 0 ? COLORS.profit : COLORS.loss, marginTop: 2 }}>{fmtPct(portfolioStats.growthPct / 100)} o'sish</div>
          {portfolioTimeline.length > 1 && (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={portfolioTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.goldDim} />
                <XAxis dataKey="date" tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
                <YAxis tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
                <Tooltip contentStyle={{ background: COLORS.surface2, border: "1px solid " + COLORS.goldDim, fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke={COLORS.gold} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            <div style={{ background: COLORS.deepGreen, borderRadius: 8, padding: "8px 6px" }}>
              <div style={{ fontSize: 9, color: COLORS.creamDim }}>Band qilingan</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtMoney(portfolioStats.deployedCapital)}</div>
            </div>
            <div style={{ background: COLORS.deepGreen, borderRadius: 8, padding: "8px 6px" }}>
              <div style={{ fontSize: 9, color: COLORS.creamDim }}>Bo'sh (naqd)</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtMoney(portfolioStats.idleCash)}</div>
            </div>
          </div>
        </div>
      )}

      {latestGoal && (latestGoal.monthlyTarget || latestGoal.annualTarget) && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Maqsad vs Amaliyot</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: COLORS.creamDim }}>Yillik maqsad</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.goldLight }}>{latestGoal.annualTarget ? "%" + latestGoal.annualTarget : "—"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: COLORS.creamDim }}>Haqiqiy natija</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: portfolioStats.growthPct >= 0 ? COLORS.profit : COLORS.loss }}>{fmtPct(portfolioStats.growthPct / 100)}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
        <MizonScale winRate={winRate} />
        <div className="tm-gold-shine" style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{winRate.toFixed(0)}% Win Rate</div>
        <div style={{ fontSize: 11, color: COLORS.creamDim }}>Mezon — adolat tarozisi</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatCard label="Jami P&L" value={fmtMoney(totalPL)} color={totalPL >= 0 ? COLORS.profit : COLORS.loss} />
        <StatCard label="Profit Factor" value={isFinite(profitFactor) ? fmtNum(profitFactor, 2) : "∞"} />
        <StatCard label="Ochiq pozitsiya" value={openCount} />
        <StatCard label="O'rtacha kun" value={fmtNum(avgDays, 0)} />
      </div>

      {concentration.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Pozitsiya kontsentratsiyasi</div>
          {concentration.map((c) => (
            <div key={c.ticker} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span>{c.ticker}</span>
                <span style={{ fontWeight: 700, color: c.pct > 25 ? COLORS.loss : COLORS.cream }}>{c.pct.toFixed(1)}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: COLORS.deepGreen, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: Math.min(100, c.pct) + "%", background: c.pct > 25 ? COLORS.loss : "linear-gradient(90deg, #B8912E, #F2D57E)", borderRadius: 3 }} />
              </div>
            </div>
          ))}
          {concentration.some((c) => c.pct > 25) && (
            <div style={{ fontSize: 11, color: COLORS.loss, marginTop: 6 }}>Bitta aksiyaga 25%+ bog'langan — kontsentratsiya riski yuqori</div>
          )}
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div style={sectionLabel}>P&L taqvimi</div>
        <PnLCalendar trades={trades} />
      </div>

      {equityData.length > 1 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Kapital egri chizig'i</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.goldDim} />
              <XAxis dataKey="date" tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
              <YAxis tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: "1px solid " + COLORS.goldDim, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke={COLORS.gold} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {drawdownData.length > 1 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={sectionLabel}>Drawdown (kapitaldan pasayish)</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.loss }}>{fmtMoney(maxDrawdown)}{maxDrawdownPct ? " (" + maxDrawdownPct.toFixed(1) + "%)" : ""}</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.goldDim} />
              <XAxis dataKey="date" tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
              <YAxis tick={{ fill: COLORS.creamDim, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: "1px solid " + COLORS.goldDim, fontSize: 12 }} />
              <Line type="monotone" dataKey="dd" stroke={COLORS.loss} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: COLORS.creamDim, marginTop: 4 }}>Maksimal drawdown — eng chuqur pasayish nuqtasi</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatCard label="Qisqa muddatli P&L" value={fmtMoney(shortTermPL)} color={shortTermPL >= 0 ? COLORS.profit : COLORS.loss} />
        <StatCard label="Uzoq muddatli P&L" value={fmtMoney(longTermPL)} color={longTermPL >= 0 ? COLORS.profit : COLORS.loss} />
      </div>

      {typeSplit.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Trade vs Investitsiya (kapital bo'yicha)</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={typeSplit} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65}>
                {typeSplit.map((d, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: COLORS.surface2, border: "1px solid " + COLORS.goldDim, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 11, marginTop: 4 }}>
            {typeSplit.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: pieColors[i % pieColors.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {sectorSplit.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Sektor taqsimoti (kapital bo'yicha)</div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={sectorSplit} dataKey="value" nameKey="name" innerRadius={38} outerRadius={65}>
                {sectorSplit.map((d, i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: COLORS.surface2, border: "1px solid " + COLORS.goldDim, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, fontSize: 11, marginTop: 4 }}>
            {sectorSplit.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {(planVsActual.matched.total > 0 || planVsActual.deviated.total > 0) && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Reja vs Amaliyot</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: COLORS.deepGreen, border: "1px solid " + COLORS.profit }}>
              <div style={{ fontSize: 10, color: COLORS.creamDim, marginBottom: 4 }}>Rejaga mos ({planVsActual.matched.total} ta)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.profit }}>{planVsActual.matched.winRate.toFixed(0)}%</div>
              <div style={{ fontSize: 11, color: COLORS.creamDim }}>{fmtMoney(planVsActual.matched.pl)}</div>
            </div>
            <div style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: COLORS.deepGreen, border: "1px solid " + COLORS.loss }}>
              <div style={{ fontSize: 10, color: COLORS.creamDim, marginBottom: 4 }}>Rejadan chetlashgan ({planVsActual.deviated.total} ta)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.loss }}>{planVsActual.deviated.winRate.toFixed(0)}%</div>
              <div style={{ fontSize: 11, color: COLORS.creamDim }}>{fmtMoney(planVsActual.deviated.pl)}</div>
            </div>
          </div>
          {planVsActual.matched.total > 0 && planVsActual.deviated.total > 0 && (
            <div style={{ fontSize: 11, color: COLORS.creamDim, marginTop: 10, textAlign: "center" }}>
              {planVsActual.matched.winRate > planVsActual.deviated.winRate
                ? "Rejaga mos savdolaringiz " + (planVsActual.matched.winRate - planVsActual.deviated.winRate).toFixed(0) + " foizga ko'proq g'alaba qozonadi — intizom natija beryapti"
                : "Hozircha ikkala guruh yaqin natija bermoqda"}
            </div>
          )}
        </div>
      )}

      {strategyStats.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Strategiya bo'yicha Win Rate</div>
          {strategyStats.map((s) => (
            <div key={s.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: COLORS.cream, fontWeight: 700 }}>{s.name} <span style={{ color: COLORS.creamDim, fontWeight: 400 }}>({s.total} ta)</span></span>
                <span style={{ color: s.pl >= 0 ? COLORS.profit : COLORS.loss, fontWeight: 700 }}>{s.winRate.toFixed(0)}% · {fmtMoney(s.pl)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: COLORS.deepGreen, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: Math.min(100, s.winRate) + "%", background: "linear-gradient(90deg, #B8912E, #F2D57E)", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {(best.length > 0 || worst.length > 0) && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={sectionLabel}>Eng yaxshi / eng yomon savdolar</div>
          {best.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span>{c.ticker}</span><span style={{ color: COLORS.profit, fontWeight: 700 }}>{fmtMoney(c.profitUsd)}</span>
            </div>
          ))}
          {worst.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span>{c.ticker}</span><span style={{ color: COLORS.loss, fontWeight: 700 }}>{fmtMoney(c.profitUsd)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Sparkles size={16} color={COLORS.gold} />
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.goldLight }}>AI tahlil (bepul)</span>
        </div>
        {!aiText && !aiLoading && (
          <button style={btnGhost} onClick={runAI}>So'nggi savdolar bo'yicha tahlil olish</button>
        )}
        {aiLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.creamDim, fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Tahlil qilinmoqda...
          </div>
        )}
        {aiError && <div style={{ color: COLORS.loss, fontSize: 13 }}>{aiError}</div>}
        {aiText && (
          <div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.cream, whiteSpace: "pre-wrap" }}>{aiText}</div>
            <button style={{ ...btnGhost, marginTop: 10, fontSize: 12 }} onClick={runAI}>Qayta tahlil qilish</button>
          </div>
        )}
      </div>

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AlertTriangle size={16} color={COLORS.gold} />
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.goldLight }}>Xatolar reestri (bepul, AI)</span>
        </div>
        {!errorRegistry && !errLoading && (
          <button style={btnGhost} onClick={runErrorAnalysis}>Takrorlanuvchi xatolarni aniqlash</button>
        )}
        {errLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.creamDim, fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Izohlar tahlil qilinmoqda...
          </div>
        )}
        {errError && <div style={{ color: COLORS.loss, fontSize: 13 }}>{errError}</div>}
        {errorRegistry && errorRegistry.length === 0 && !errError && (
          <div style={{ fontSize: 13, color: COLORS.creamDim }}>Hozircha aniq takrorlanuvchi xato naqshi topilmadi — bu yaxshi belgi!</div>
        )}
        {errorRegistry && errorRegistry.length > 0 && (
          <div>
            {errorRegistry.map((e, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < errorRegistry.length - 1 ? "1px solid " + COLORS.goldDim : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.cream }}>{e.pattern}</span>
                  <Badge color={COLORS.deepGreen} bg={COLORS.goldLight}>{e.count} marta</Badge>
                </div>
                {e.tip && <div style={{ fontSize: 12, color: COLORS.creamDim }}>{e.tip}</div>}
              </div>
            ))}
            <button style={{ ...btnGhost, marginTop: 4, fontSize: 12 }} onClick={runErrorAnalysis}>Qayta tahlil qilish</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PositionCalcModal({ onClose, defaultCapital }) {
  const [capital, setCapital] = useState(defaultCapital ? String(Math.round(defaultCapital)) : "");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("");
  const [sl, setSl] = useState("");
  const riskAmount = (Number(capital) || 0) * (Number(riskPct) || 0) / 100;
  const perShareRisk = Number(entry) - Number(sl);
  const shares = perShareRisk > 0 ? Math.floor(riskAmount / perShareRisk) : 0;
  return (
    <Modal title="Pozitsiya hajmi kalkulyatori" onClose={onClose}>
      <Field label="Portfel hajmi ($)">
        <input type="number" style={inputStyle} value={capital} onChange={(e) => setCapital(e.target.value)} />
        {defaultCapital > 0 && <div style={{ fontSize: 10, color: COLORS.creamDim, marginTop: 4 }}>Joriy portfel qiymatingizdan avtomatik to'ldirildi — xohlasangiz o'zgartiring</div>}
      </Field>
      <Field label="Risk % (bitta savdo uchun)"><input type="number" style={inputStyle} value={riskPct} onChange={(e) => setRiskPct(e.target.value)} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}><Field label="Kirish narxi"><input type="number" style={inputStyle} value={entry} onChange={(e) => setEntry(e.target.value)} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Stop Loss"><input type="number" style={inputStyle} value={sl} onChange={(e) => setSl(e.target.value)} /></Field></div>
      </div>
      <div style={{ ...cardStyle, textAlign: "center", marginTop: 6 }}>
        <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>Risk summasi: {fmtMoney(riskAmount)}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.goldLight }}>{shares} dona</div>
        <div style={{ fontSize: 11, color: COLORS.creamDim }}>sotib olish tavsiya etiladi</div>
      </div>
    </Modal>
  );
}

function ZakatCalcModal({ onClose, defaultValue }) {
  const [value, setValue] = useState(defaultValue ? String(Math.round(defaultValue)) : "");
  const zakat = (Number(value) || 0) * 0.025;
  return (
    <Modal title="Zakot hisoblagichi" onClose={onClose}>
      <Field label="Portfel qiymati / yillik sof foyda ($)">
        <input type="number" style={inputStyle} value={value} onChange={(e) => setValue(e.target.value)} />
        {defaultValue > 0 && <div style={{ fontSize: 10, color: COLORS.creamDim, marginTop: 4 }}>Joriy portfel qiymatingizdan avtomatik to'ldirildi — xohlasangiz o'zgartiring</div>}
      </Field>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>Taxminiy zakot (2.5%)</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.goldLight }}>{fmtMoney(zakat)}</div>
      </div>
      <div style={{ display: "flex", gap: 8, fontSize: 12, color: COLORS.creamDim }}>
        <Info size={26} />
        <span>Bu taxminiy ko'rsatkich. Nisob va aniq fiqhiy hisob-kitob mazhab va shaxsiy holatga qarab farq qilishi mumkin — yakuniy miqdorni ustoz yoki ilmiy manba bilan tasdiqlashni tavsiya qilamiz.</span>
      </div>
    </Modal>
  );
}

function SettingsModal({ settings, onSave, onClose }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  return (
    <Modal title="Sozlamalar — Jonli narx" onClose={onClose}>
      <div style={{ ...cardStyle, marginBottom: 14, display: "flex", gap: 8 }}>
        <Info size={26} color={COLORS.creamDim} />
        <span style={{ fontSize: 12, color: COLORS.creamDim }}>
          Kalitingiz shaxsiy xotirangizda saqlanadi — kodga yozilmaydi va hech kimga yuborilmaydi.
        </span>
      </div>
      <Field label="Twelve Data API Key">
        <input style={inputStyle} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Twelve Data kalitingiz" />
      </Field>
      <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 14 }}>
        Bepul kalit olish uchun: <a href="https://twelvedata.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.goldLight }}>twelvedata.com</a> (faqat email bilan ro'yxatdan o'ting)
      </div>
      <button style={btnGold} onClick={() => { onSave({ apiKey: apiKey.trim() }); onClose(); }}>Saqlash</button>
    </Modal>
  );
}

function CapitalModal({ entries, stats, onAdd, onDelete, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ date: todayISO(), type: "deposit", amount: "", notes: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const typeLabel = { initial: "Boshlang'ich balans", deposit: "Depozit", withdrawal: "Pul yechish" };

  return (
    <Modal title="Portfel / Kapital" onClose={onClose}>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>Joriy portfel qiymati</div>
        <div className="tm-gold-shine" style={{ fontSize: 28, fontWeight: 700 }}>{fmtMoney(stats.portfolioValue)}</div>
        <div style={{ fontSize: 13, color: stats.growthPct >= 0 ? COLORS.profit : COLORS.loss, fontWeight: 700, marginTop: 4 }}>{fmtPct(stats.growthPct / 100)} o'sish</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatCard label="Kiritilgan kapital" value={fmtMoney(stats.netCapital)} />
        <StatCard label="Realized P&L" value={fmtMoney(stats.realizedPL)} color={stats.realizedPL >= 0 ? COLORS.profit : COLORS.loss} />
        <StatCard label="Unrealized P&L" value={fmtMoney(stats.unrealizedPL)} color={stats.unrealizedPL >= 0 ? COLORS.profit : COLORS.loss} />
        <StatCard label="Band qilingan" value={fmtMoney(stats.deployedCapital)} />
      </div>

      {!showForm ? (
        <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setShowForm(true)}>
          <Plus size={17} /> Depozit / pul yechish qo'shish
        </button>
      ) : (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <Field label="Turi">
            <div style={{ display: "flex", gap: 8 }}>
              {["initial", "deposit", "withdrawal"].map((tp) => (
                <button key={tp} onClick={() => set("type", tp)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: f.type === tp ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, background: f.type === tp ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, color: f.type === tp ? "#2A2108" : COLORS.creamDim, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {typeLabel[tp]}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Sana"><input type="date" style={inputStyle} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Miqdor ($)"><input type="number" style={inputStyle} value={f.amount} onChange={(e) => set("amount", e.target.value)} /></Field>
          <Field label="Izoh"><input style={inputStyle} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Masalan: IBKR hisobiga birinchi to'ldirish" /></Field>
          <button style={btnGold} onClick={() => { if (!f.amount) return; onAdd({ id: uid(), ...f, amount: Number(f.amount) }); setF({ date: todayISO(), type: "deposit", amount: "", notes: "" }); setShowForm(false); }}>Saqlash</button>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState icon={Wallet} title="Hali kapital kiritilmagan" subtitle="Boshlang'ich balansingizni yuqoridagi tugma orqali kiriting." />
      ) : (
        [...entries].reverse().map((e) => (
          <div key={e.id} style={{ ...cardStyle, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: COLORS.creamDim }}>{e.date} · {typeLabel[e.type] || e.type}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: e.type === "withdrawal" ? COLORS.loss : COLORS.profit }}>{e.type === "withdrawal" ? "-" : "+"}{fmtMoney(Number(e.amount))}</div>
              {e.notes && <div style={{ fontSize: 11, color: COLORS.creamDim, fontStyle: "italic" }}>{e.notes}</div>}
            </div>
            <button onClick={() => onDelete(e.id)} style={{ background: "transparent", border: "none", color: COLORS.loss, cursor: "pointer" }}><Trash2 size={15} /></button>
          </div>
        ))
      )}
    </Modal>
  );
}

function CurrencyCostModal({ entries, onAdd, onDelete, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ date: todayISO(), uzsAmount: "", rate: "", usdReceived: "", fee: "", notes: "" });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const totalUzs = entries.reduce((s, e) => s + (Number(e.uzsAmount) || 0), 0);
  const totalUsd = entries.reduce((s, e) => s + (Number(e.usdReceived) || 0), 0);
  const totalFee = entries.reduce((s, e) => s + (Number(e.fee) || 0), 0);
  const effRate = totalUsd > 0 ? totalUzs / totalUsd : 0;

  return (
    <Modal title="Valyuta xarajatlari" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatCard label="Jami UZS" value={Math.round(totalUzs).toLocaleString() + " so'm"} />
        <StatCard label="Jami USD" value={fmtMoney(totalUsd)} />
        <StatCard label="Jami komissiya" value={fmtMoney(totalFee)} />
        <StatCard label="O'rtacha kurs" value={effRate ? fmtNum(effRate, 0) : "—"} />
      </div>

      {!showForm ? (
        <button style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => setShowForm(true)}>
          <Plus size={17} /> Yangi konvertatsiya qo'shish
        </button>
      ) : (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <Field label="Sana"><input type="date" style={inputStyle} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="UZS miqdori"><input type="number" style={inputStyle} value={f.uzsAmount} onChange={(e) => set("uzsAmount", e.target.value)} /></Field>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}><Field label="Kurs (1$)"><input type="number" style={inputStyle} value={f.rate} onChange={(e) => set("rate", e.target.value)} /></Field></div>
            <div style={{ flex: 1 }}><Field label="Qabul qilingan USD"><input type="number" style={inputStyle} value={f.usdReceived} onChange={(e) => set("usdReceived", e.target.value)} /></Field></div>
          </div>
          <Field label="Komissiya / o'tkazma haqi ($)"><input type="number" style={inputStyle} value={f.fee} onChange={(e) => set("fee", e.target.value)} /></Field>
          <Field label="Izoh"><input style={inputStyle} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Masalan: Wise orqali IBKR'ga" /></Field>
          <button style={btnGold} onClick={() => { if (!f.uzsAmount) return; onAdd({ id: uid(), ...f }); setF({ date: todayISO(), uzsAmount: "", rate: "", usdReceived: "", fee: "", notes: "" }); setShowForm(false); }}>Saqlash</button>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState icon={Coins} title="Hali konvertatsiya kiritilmagan" subtitle="UZS dan USD ga o'tkazgan har bir tranzaksiyangizni shu yerga qo'shing." />
      ) : (
        [...entries].reverse().map((e) => (
          <div key={e.id} style={{ ...cardStyle, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: COLORS.creamDim }}>{e.date}</span>
              <button onClick={() => onDelete(e.id)} style={{ background: "transparent", border: "none", color: COLORS.loss, cursor: "pointer" }}><Trash2 size={14} /></button>
            </div>
            <div style={{ fontSize: 13 }}>{Number(e.uzsAmount).toLocaleString()} so'm → {fmtMoney(Number(e.usdReceived))} {e.fee ? "(komissiya: " + fmtMoney(Number(e.fee)) + ")" : ""}</div>
            {e.notes && <div style={{ fontSize: 11, color: COLORS.creamDim, marginTop: 4, fontStyle: "italic" }}>{e.notes}</div>}
          </div>
        ))
      )}
    </Modal>
  );
}

function HomeTab({ trades, plan, portfolioStats, dailyChecklist, onOpenPosCalc, onOpenZakatCalc, onOpenCurrencyCost, onOpenCapital, onOpenSettings, onUpdatePrice, onRefreshLive, liveLoading, liveError, hasApiKey, onGoTab, onExport }) {
  const today = new Date();
  const dow = today.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const isMonthEnd = dayOfMonth >= daysInMonth - 2;

  const computed = trades.map(computeTrade);
  const closed = computed.filter((c) => !c.isOpen);
  const wins = closed.filter((c) => c.isWin).length;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  const totalPL = closed.reduce((s, c) => s + c.profitUsd, 0);
  const openPositions = computed.filter((c) => c.isOpen);
  const checksDone = CHECKLIST_ITEMS.filter((it) => dailyChecklist.checks && dailyChecklist.checks[it.id]).length;

  return (
    <div>
      <div className="tm-serif" style={{ fontSize: 20, color: COLORS.cream, marginBottom: 4 }}>Assalomu alaykum{TG_USER && TG_USER.first_name ? ", " + TG_USER.first_name : ""}!</div>
      <div style={{ fontSize: 12, color: COLORS.creamDim, marginBottom: 16 }}>Bizning bugungi yo'l xaritamiz</div>

      <div onClick={onOpenCapital} style={{ ...cardStyle, marginBottom: 14, textAlign: "center", cursor: "pointer" }}>
        <div style={{ fontSize: 11, color: COLORS.creamDim, marginBottom: 4 }}>Portfel qiymati</div>
        <div className="tm-gold-shine" style={{ fontSize: 30, fontWeight: 700 }}>{fmtMoney(portfolioStats.portfolioValue)}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: portfolioStats.growthPct >= 0 ? COLORS.profit : COLORS.loss, marginTop: 4 }}>
          {fmtPct(portfolioStats.growthPct / 100)} umumiy o'sish
        </div>
        {portfolioStats.netCapital === 0 && <div style={{ fontSize: 11, color: COLORS.goldLight, marginTop: 6 }}>Boshlang'ich kapitalni kiritish uchun bosing →</div>}
      </div>

      {isWeekend ? (
        <div style={{ ...cardStyle, marginBottom: 14, borderColor: COLORS.gold }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CalendarDays size={18} color={COLORS.gold} />
            <span style={{ fontWeight: 700, color: COLORS.goldLight, fontSize: 14 }}>Bugun haftalik tahlil kuni</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.creamDim, marginBottom: 10 }}>Bozor holatini, kuzatuvdagi nomzodlarni va o'tgan hafta natijalarini tahlil qilish vaqti keldi.</div>
          <button style={btnGold} onClick={() => onGoTab("plan")}>Haftalik tahlilga o'tish</button>
        </div>
      ) : isMonthEnd ? (
        <div style={{ ...cardStyle, marginBottom: 14, borderColor: COLORS.gold }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CalendarRange size={18} color={COLORS.gold} />
            <span style={{ fontWeight: 700, color: COLORS.goldLight, fontSize: 14 }}>Oylik tahlil vaqti yaqinlashmoqda</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.creamDim, marginBottom: 10 }}>Kuzatuvdagi barcha aksiyalarni ko'zdan kechirib chiqing.</div>
          <button style={btnGold} onClick={() => onGoTab("plan")}>Oylik tahlilga o'tish</button>
        </div>
      ) : (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <ListChecks size={18} color={COLORS.gold} />
            <span style={{ fontWeight: 700, color: COLORS.goldLight, fontSize: 14 }}>Bugungi vazifalar ({checksDone}/{CHECKLIST_ITEMS.length})</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.creamDim, marginBottom: 10 }}>Kunlik tekshiruv ro'yxatini bajaring va ochiq pozitsiyalarni kuzating.</div>
          <button style={btnGold} onClick={() => onGoTab("plan")}>Tekshiruv ro'yxatiga o'tish</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <StatCard label="Win Rate" value={winRate.toFixed(0) + "%"} />
        <StatCard label="Jami P&L" value={fmtMoney(totalPL)} color={totalPL >= 0 ? COLORS.profit : COLORS.loss} />
        <StatCard label="Ochiq" value={openPositions.length} />
      </div>

      {openPositions.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={sectionLabel}>Ochiq pozitsiyalar</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onOpenSettings} style={{ background: "transparent", border: "none", color: COLORS.creamDim, cursor: "pointer", padding: 4 }} aria-label="Sozlamalar">
                <Settings size={15} />
              </button>
              <button onClick={onRefreshLive} disabled={liveLoading} style={{ display: "flex", alignItems: "center", gap: 4, background: hasApiKey ? "linear-gradient(180deg, #F2D57E, #D9B24C)" : COLORS.deepGreen, border: hasApiKey ? "1px solid #8A6D1F" : "1px solid " + COLORS.goldDim, borderRadius: 8, padding: "5px 9px", color: hasApiKey ? "#2A2108" : COLORS.creamDim, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                <RefreshCw size={12} className={liveLoading ? "animate-spin" : ""} /> Jonli narx
              </button>
            </div>
          </div>
          <div style={{ fontSize: 10, color: COLORS.creamDim, marginBottom: 10 }}>
            {hasApiKey ? "Jonli narxni yangilash uchun tugmani bosing, yoki qo'lda kiriting" : "Jonli narx uchun Sozlamalarda API kalit kiriting, yoki qo'lda kiriting"}
          </div>
          {liveError && <div style={{ fontSize: 11, color: COLORS.loss, marginBottom: 10 }}>{liveError}</div>}
          {openPositions.map((p) => {
            const cp = p.currentPrice ? Number(p.currentPrice) : null;
            const pctToSL = cp && p.stopLoss ? ((cp - Number(p.stopLoss)) / cp) * 100 : null;
            const pctToTP = cp && p.takeProfit ? ((Number(p.takeProfit) - cp) / cp) * 100 : null;
            return (
              <div key={p.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid " + COLORS.goldDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.ticker} <span style={{ fontWeight: 400, color: COLORS.creamDim }}>· {p.daysHeld} kun</span></span>
                  {!p.stopLoss && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, color: COLORS.loss, fontSize: 11 }}>
                      <AlertTriangle size={12} /> SL qo'yilmagan
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: COLORS.creamDim, whiteSpace: "nowrap" }}>Joriy narx:</span>
                  <input
                    type="number"
                    defaultValue={p.currentPrice || ""}
                    onBlur={(e) => onUpdatePrice(p.id, e.target.value)}
                    placeholder={"$" + fmtNum(p.buyPrice)}
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: 13, width: 100 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: COLORS.creamDim }}>{p.stopLoss ? "SL: $" + fmtNum(p.stopLoss) : "SL: —"}</span>
                  {pctToSL !== null && <Badge color={pctToSL < 3 ? COLORS.loss : COLORS.creamDim} bg={COLORS.deepGreen}>SL'gacha {fmtNum(pctToSL, 1)}%</Badge>}
                  <span style={{ fontSize: 11, color: COLORS.creamDim }}>{p.takeProfit ? "TP: $" + fmtNum(p.takeProfit) : "TP: —"}</span>
                  {pctToTP !== null && <Badge color={pctToTP < 3 ? COLORS.profit : COLORS.creamDim} bg={COLORS.deepGreen}>TP'gacha {fmtNum(pctToTP, 1)}%</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button style={{ ...btnGhost, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }} onClick={onOpenCapital}>
        <Wallet size={15} /> Portfel / Kapital
      </button>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button style={{ ...btnGhost, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={onOpenPosCalc}>
          <Calculator size={15} /> Pozitsiya hajmi
        </button>
        <button style={{ ...btnGhost, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={onOpenZakatCalc}>
          <Scale size={15} /> Zakot
        </button>
      </div>
      <button style={{ ...btnGhost, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }} onClick={onOpenCurrencyCost}>
        <Coins size={15} /> Valyuta xarajatlari
      </button>
      <button style={{ ...btnGhost, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }} onClick={onOpenSettings}>
        <Settings size={15} /> Sozlamalar (jonli narx API)
      </button>
      <button style={{ ...btnGhost, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={onExport}>
        <Download size={15} /> Zaxira nusxa (JSON) yuklab olish
      </button>
    </div>
  );
}

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxodgG-OQgte4ATI__dvD_II-t-NlGpvo165YGhtpkLn-83FG9X1YWjhW4Mb22aoUO6bQ/exec";

const tg = (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
if (tg) {
  tg.ready();
  tg.expand();
}
const TG_INIT_DATA = tg ? tg.initData : "";
const TG_USER = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;

let LAST_STORAGE_ERROR = null;

const tmStorage = {
  async get(key) {
    const res = await fetch(BACKEND_URL + "?key=" + encodeURIComponent(key) + "&initData=" + encodeURIComponent(TG_INIT_DATA));
    const data = await res.json();
    if (data.error) { LAST_STORAGE_ERROR = data.error + (data.debug ? " | " + JSON.stringify(data.debug) : ""); console.error("tmStorage.get:", data.error, data.debug); return null; }
    LAST_STORAGE_ERROR = null;
    return (data.value !== null && data.value !== undefined && data.value !== "") ? { key: data.key, value: data.value } : null;
  },
  async set(key, value) {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "set", key: key, value: value, initData: TG_INIT_DATA }),
    });
    return res.json();
  },
  async delete(key) {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "delete", key: key, initData: TG_INIT_DATA }),
    });
    return res.json();
  },
};

async function callAIProxy(prompt) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "ai_proxy", prompt: prompt, initData: TG_INIT_DATA }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

function useStorage() {
  const [trades, setTrades] = useState([]);
  const [plan, setPlan] = useState({ goals: [], monthly: [], weekly: [] });
  const [watchlist, setWatchlist] = useState([]);
  const [currencyCosts, setCurrencyCosts] = useState([]);
  const [capitalTx, setCapitalTx] = useState([]);
  const [settings, setSettings] = useState({ apiKey: "", apiSecret: "" });
  const [dailyChecklist, setDailyChecklist] = useState({ date: todayISO(), checks: {} });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [tRes, pRes, wRes, dRes, ccRes, capRes, setRes] = await Promise.allSettled([
          tmStorage.get("tm_trades"),
          tmStorage.get("tm_plan"),
          tmStorage.get("tm_watchlist"),
          tmStorage.get("tm_daily_checklist"),
          tmStorage.get("tm_currency_costs"),
          tmStorage.get("tm_capital"),
          tmStorage.get("tm_settings"),
        ]);
        if (tRes.status === "fulfilled" && tRes.value) {
          setTrades(JSON.parse(tRes.value.value));
        }
        if (pRes.status === "fulfilled" && pRes.value) setPlan(JSON.parse(pRes.value.value));
        if (wRes.status === "fulfilled" && wRes.value) setWatchlist(JSON.parse(wRes.value.value));
        if (ccRes.status === "fulfilled" && ccRes.value) setCurrencyCosts(JSON.parse(ccRes.value.value));
        if (capRes.status === "fulfilled" && capRes.value) setCapitalTx(JSON.parse(capRes.value.value));
        if (setRes.status === "fulfilled" && setRes.value) setSettings(JSON.parse(setRes.value.value));
        if (dRes.status === "fulfilled" && dRes.value) {
          const parsed = JSON.parse(dRes.value.value);
          if (parsed.date === todayISO()) setDailyChecklist(parsed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAuthError(LAST_STORAGE_ERROR);
        setLoading(false);
      }
    })();
  }, []);

  const persistTrades = (next) => {
    setTrades(next);
    tmStorage.set("tm_trades", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistPlan = (next) => {
    setPlan(next);
    tmStorage.set("tm_plan", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistWatchlist = (next) => {
    setWatchlist(next);
    tmStorage.set("tm_watchlist", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistCurrencyCosts = (next) => {
    setCurrencyCosts(next);
    tmStorage.set("tm_currency_costs", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistCapitalTx = (next) => {
    setCapitalTx(next);
    tmStorage.set("tm_capital", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistSettings = (next) => {
    setSettings(next);
    tmStorage.set("tm_settings", JSON.stringify(next)).catch((e) => console.error(e));
  };
  const persistDailyChecklist = (next) => {
    setDailyChecklist(next);
    tmStorage.set("tm_daily_checklist", JSON.stringify(next)).catch((e) => console.error(e));
  };

  return { trades, persistTrades, plan, persistPlan, watchlist, persistWatchlist, currencyCosts, persistCurrencyCosts, capitalTx, persistCapitalTx, settings, persistSettings, dailyChecklist, persistDailyChecklist, loading, authError };
}

function TafakkurMoliyaJournal() {
  const { trades, persistTrades, plan, persistPlan, watchlist, persistWatchlist, currencyCosts, persistCurrencyCosts, capitalTx, persistCapitalTx, settings, persistSettings, dailyChecklist, persistDailyChecklist, loading, authError } = useStorage();
  const [tab, setTab] = useState("home");
  const [showPosCalc, setShowPosCalc] = useState(false);
  const [showZakatCalc, setShowZakatCalc] = useState(false);
  const [showCurrencyCost, setShowCurrencyCost] = useState(false);
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState("");

  const portfolioStats = useMemo(() => computePortfolioStats(trades, capitalTx), [trades, capitalTx]);

  const addOrUpdateTrade = (data) => {
    const exists = trades.some((t) => t.id === data.id);
    const next = exists ? trades.map((t) => (t.id === data.id ? data : t)) : [...trades, data];
    persistTrades(next);
  };
  const deleteTrade = (id) => persistTrades(trades.filter((t) => t.id !== id));
  const updateCurrentPrice = (id, price) => persistTrades(trades.map((t) => (t.id === id ? { ...t, currentPrice: price === "" ? null : Number(price) } : t)));

  const refreshLivePrices = async () => {
    if (!settings.apiKey) {
      setLiveError("Avval Sozlamalarda Twelve Data API kalitini kiriting.");
      return;
    }
    const openTickers = trades.filter((t) => !t.sellDate || !t.sellPrice).map((t) => t.ticker);
    if (openTickers.length === 0) {
      setLiveError("Hozircha ochiq pozitsiya yo'q.");
      return;
    }
    setLiveLoading(true);
    setLiveError("");
    try {
      const prices = await fetchLivePrices(openTickers, settings.apiKey);
      const next = trades.map((t) => {
        const isOpen = !t.sellDate || !t.sellPrice;
        if (isOpen && prices[t.ticker.toUpperCase()] !== undefined) {
          return { ...t, currentPrice: prices[t.ticker.toUpperCase()] };
        }
        return t;
      });
      persistTrades(next);
      if (Object.keys(prices).length === 0) {
        setLiveError("Javob keldi, lekin narx topilmadi — ticker nomlarini tekshiring.");
      }
    } catch (e) {
      if (e.message === "CORS_OR_NETWORK") {
        setLiveError("Brauzer so'rovni bloklaladi (CORS). Texnik tafsilot: " + (e.detail || "noma'lum") + ". Qo'lda kiritish davom etadi.");
      } else if (e.message === "HTTP_401" || e.message === "HTTP_403") {
        setLiveError("Kalit qabul qilinmadi (kod " + e.message.slice(5) + "). Sozlamalarda Twelve Data kalitingizni tekshiring.");
      } else if (e.message === "HTTP_429" || e.message === "API_ERROR") {
        setLiveError("Kunlik so'rov chegarasiga yetdi yoki API xatosi: " + (e.detail || "") + ". Birozdan so'ng qayta urinib ko'ring.");
      } else if (e.message && e.message.startsWith("HTTP_")) {
        setLiveError("Server xatosi (kod " + e.message.slice(5) + "). Tafsilot: " + (e.detail || "yo'q"));
      } else {
        setLiveError("Kutilmagan xatolik: " + (e.message || "noma'lum") + ". Qo'lda kiritish davom etadi.");
      }
    } finally {
      setLiveLoading(false);
    }
  };

  const addOrUpdateCandidate = (data) => {
    const exists = watchlist.some((c) => c.id === data.id);
    const next = exists ? watchlist.map((c) => (c.id === data.id ? data : c)) : [...watchlist, data];
    persistWatchlist(next);
  };
  const deleteCandidate = (id) => persistWatchlist(watchlist.filter((c) => c.id !== id));

  const addGoal = (g) => persistPlan({ ...plan, goals: [...plan.goals, g] });
  const addMonthly = (m) => persistPlan({ ...plan, monthly: [...plan.monthly, m] });
  const addWeekly = (w) => persistPlan({ ...plan, weekly: [...plan.weekly, w] });

  const addCurrencyCost = (data) => persistCurrencyCosts([...currencyCosts, data]);
  const deleteCurrencyCost = (id) => persistCurrencyCosts(currencyCosts.filter((c) => c.id !== id));

  const addCapitalTx = (data) => persistCapitalTx([...capitalTx, data]);
  const deleteCapitalTx = (id) => persistCapitalTx(capitalTx.filter((c) => c.id !== id));

  const toggleCheck = (id) => {
    const base = dailyChecklist.date === todayISO() ? dailyChecklist : { date: todayISO(), checks: {} };
    const nextChecks = { ...base.checks, [id]: !base.checks[id] };
    persistDailyChecklist({ date: todayISO(), checks: nextChecks });
  };

  const exportData = () => {
    const payload = JSON.stringify({ trades, plan, watchlist, currencyCosts, capitalTx }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tafakkur_moliya_zaxira_" + todayISO() + ".json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeDailyChecklist = dailyChecklist.date === todayISO() ? dailyChecklist : { date: todayISO(), checks: {} };

  if (loading) {
    return (
      <div style={{ background: COLORS.deepGreen, minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, maxWidth: 480, margin: "0 auto" }}>
        <Loader2 size={26} color={COLORS.gold} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.deepGreen, borderRadius: 20, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: COLORS.cream, maxWidth: 480, margin: "0 auto", position: "relative", border: "1px solid " + COLORS.goldDim, boxShadow: "0 8px 30px rgba(0,0,0,0.35)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        .tm-serif { font-family: 'Playfair Display', Georgia, serif; }
        .tm-gold-shine {
          background: linear-gradient(180deg, #FBEDBE 0%, #F2D57E 35%, #D9B24C 65%, #A9821F 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #D9B24C;
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
        }
        .tm-btn-raised:active { transform: translateY(1px); filter: brightness(0.95); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8) sepia(1) saturate(3) hue-rotate(10deg); }
        .animate-spin { animation: tm-spin-kf 1s linear infinite; }
        @keyframes tm-spin-kf { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <Header />
      {authError && (
        <div style={{ margin: "0 16px 14px", background: "#4a1f1f", border: "1px solid " + COLORS.loss, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.loss, marginBottom: 4 }}>⚠️ Serverga ulanishda muammo</div>
          <div style={{ fontSize: 11, color: COLORS.cream }}>Ilovani yopib, "t.me/..." havolasi orqali qayta oching.</div>
        </div>
      )}
      <div style={{ padding: "0 16px 20px" }}>
        {tab === "home" && (
          <HomeTab
            trades={trades}
            plan={plan}
            portfolioStats={portfolioStats}
            dailyChecklist={activeDailyChecklist}
            onOpenPosCalc={() => setShowPosCalc(true)}
            onOpenZakatCalc={() => setShowZakatCalc(true)}
            onOpenCurrencyCost={() => setShowCurrencyCost(true)}
            onOpenCapital={() => setShowCapitalModal(true)}
            onOpenSettings={() => setShowSettings(true)}
            onUpdatePrice={updateCurrentPrice}
            onRefreshLive={refreshLivePrices}
            liveLoading={liveLoading}
            liveError={liveError}
            hasApiKey={!!settings.apiKey}
            onGoTab={setTab}
            onExport={exportData}
          />
        )}
        {tab === "journal" && <JournalTab trades={trades} onAdd={addOrUpdateTrade} onEdit={() => {}} onDelete={deleteTrade} />}
        {tab === "plan" && (
          <PlanTab
            plan={plan}
            onAddGoal={addGoal}
            onAddMonthly={addMonthly}
            onAddWeekly={addWeekly}
            dailyChecklist={activeDailyChecklist}
            onToggleCheck={toggleCheck}
          />
        )}
        {tab === "watchlist" && <WatchlistTab watchlist={watchlist} onAdd={addOrUpdateCandidate} onDelete={deleteCandidate} />}
        {tab === "stats" && <StatsTab trades={trades} capitalTx={capitalTx} portfolioStats={portfolioStats} plan={plan} />}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
      {showPosCalc && <PositionCalcModal onClose={() => setShowPosCalc(false)} defaultCapital={portfolioStats.portfolioValue} />}
      {showZakatCalc && <ZakatCalcModal onClose={() => setShowZakatCalc(false)} defaultValue={portfolioStats.portfolioValue} />}
      {showCurrencyCost && (
        <CurrencyCostModal
          entries={currencyCosts}
          onAdd={addCurrencyCost}
          onDelete={deleteCurrencyCost}
          onClose={() => setShowCurrencyCost(false)}
        />
      )}
      {showCapitalModal && (
        <CapitalModal
          entries={capitalTx}
          stats={portfolioStats}
          onAdd={addCapitalTx}
          onDelete={deleteCapitalTx}
          onClose={() => setShowCapitalModal(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={persistSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<TafakkurMoliyaJournal />);
