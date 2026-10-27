// ============================================================
// كتالوج الألعاب والباقات والأسعار — عدّل الأسعار من هنا فقط.
// الأسعار الحالية تجريبية (جنيه مصري) وغير مرتبطة بأي مورّد.
// ============================================================

// ---- بيانات المتجر (غيّرها من هنا) ----
export const STORE = {
  name: 'SALAH STORE',
  whatsapp: '201042099772', // الرقم بصيغة دولية بدون + أو أصفار
  paymentMethods: [
    { id: 'vodafone', label: 'فودافون كاش' },
    { id: 'instapay', label: 'إنستا باي' },
    { id: 'other', label: 'طريقة أخرى (نتفق في واتساب)' },
  ],
}

export const formatPrice = (n) => `${n.toLocaleString('ar-EG')} ج.م`

const rawGames = [
  {
    id: 1, name: 'PUBG MOBILE', sub: 'شدّ UC وارجع للساحة', category: 'الأكثر طلبًا', tag: 'الأكثر مبيعًا',
    color: 'pubg', symbol: 'PUBG', currency: 'UC',
    idLabel: 'Character ID', idType: 'number', idHint: 'رقم الشخصية من داخل اللعبة (أرقام فقط)',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'uc60', label: '60 UC', price: 55 },
      { id: 'uc325', label: '325 UC', price: 270 },
      { id: 'uc660', label: '660 UC', price: 540, note: 'الأكثر طلبًا' },
      { id: 'uc1800', label: '1800 UC', price: 1350 },
    ],
  },
  {
    id: 2, name: 'FREE FIRE', sub: 'دايموندز في ثواني', category: 'الأكثر طلبًا', tag: 'شحن سريع',
    color: 'fire', symbol: 'FF', currency: 'Diamonds',
    idLabel: 'Player ID', idType: 'number', idHint: 'رقم اللاعب من صفحة البروفايل (أرقام فقط)',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'd50', label: '50 دايموند', price: 30 },
      { id: 'd110', label: '110 دايموند', price: 55 },
      { id: 'd200', label: '200 دايموند', price: 105 },
      { id: 'd310', label: '310 دايموند', price: 155 },
      { id: 'd520', label: '520 دايموند', price: 260, note: 'الأكثر طلبًا' },
      { id: 'd1060', label: '1060 دايموند', price: 510 },
    ],
  },
  {
    id: 3, name: 'eFOOTBALL', sub: 'كوينز لفريق الأحلام', category: 'رياضة', tag: 'جديد',
    color: 'football', symbol: 'eF', currency: 'Coins',
    idLabel: 'Konami ID', idType: 'text', idOptional: true, idHint: 'مش مطلوب لطلبات الكوينز — تقدر تسيبه فاضي',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'c137', label: '137 كوينز', price: 70 },
      { id: 'c315', label: '315 كوينز', price: 155 },
      { id: 'c580', label: '580 كوينز', price: 265, note: 'الأكثر طلبًا' },
      { id: 'c790', label: '790 كوينز', price: 355 },
      { id: 'c1100', label: '1100 كوينز', price: 490 },
      { id: 'c2235', label: '2235 كوينز', price: 965 },
    ],
  },
  {
    id: 4, name: 'CALL OF DUTY', sub: 'CP جاهزة للمعركة', category: 'أكشن', tag: '',
    color: 'cod', symbol: 'COD', currency: 'CP',
    idLabel: 'Player UID', idType: 'number', idHint: 'الـ UID من إعدادات الحساب (أرقام فقط)',
    image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'cp80', label: '80 CP', price: 60 },
      { id: 'cp400', label: '400 CP', price: 290 },
      { id: 'cp800', label: '800 CP', price: 570, note: 'الأكثر طلبًا' },
      { id: 'cp2000', label: '2000 CP', price: 1400 },
    ],
  },
  {
    id: 5, name: 'ROBLOX', sub: 'Robux لعالمك الخاص', category: 'متنوعة', tag: '',
    color: 'roblox', symbol: 'R', currency: 'Robux',
    idLabel: 'اسم المستخدم', idType: 'text', idHint: 'اسم المستخدم (Username) في Roblox',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'r400', label: '400 Robux', price: 95 },
      { id: 'r800', label: '800 Robux', price: 185 },
      { id: 'r1700', label: '1700 Robux', price: 380, note: 'الأكثر طلبًا' },
    ],
  },
  {
    id: 6, name: 'GENSHIN IMPACT', sub: 'احصل على Genesis Crystals', category: 'متنوعة', tag: '',
    color: 'genshin', symbol: 'GI', currency: 'Crystals',
    idLabel: 'UID', idType: 'number', idHint: 'الـ UID يظهر أسفل يمين شاشة اللعبة (أرقام فقط)',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
    packages: [
      { id: 'g60', label: '60 Crystals', price: 80 },
      { id: 'g300', label: '300 Crystals', price: 400 },
      { id: 'g980', label: '980 Crystals', price: 1250, note: 'الأكثر طلبًا' },
      { id: 'g1980', label: '1980 Crystals', price: 2450 },
    ],
  },
]

// السعر الظاهر على الكارت يتحسب تلقائيًا من أرخص باقة
export const games = rawGames.map((g) => {
  const min = Math.min(...g.packages.map((p) => p.price))
  return { ...g, minPrice: min, price: `ابتداءً من ${formatPrice(min)}` }
})

export const categories = ['الكل', 'الأكثر طلبًا', 'رياضة', 'أكشن', 'متنوعة']
