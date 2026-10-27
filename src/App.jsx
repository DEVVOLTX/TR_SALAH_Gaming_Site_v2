import { useEffect, useMemo, useState } from 'react'
import {
  Search, ShoppingBag, ShieldCheck, Zap, Headphones, ChevronLeft,
  ArrowUpLeft, Menu, X, Gamepad2, CheckCircle2, Plus, Minus, Sparkles
} from 'lucide-react'

import { BANNER, GAME_IMAGES } from './data/brand'
import { games as baseGames, categories, formatPrice, STORE } from './data/catalog'
import { collection, addDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}


const normalizeWa = (n) => { const d = String(n || '').replace(/\D/g, ''); return d.startsWith('0') ? '20' + d.slice(1) : d }

const buildMessage = (o) => [
  `*طلب جديد — ${STORE.name}*`,
  `رقم الطلب: ${o.no}`,
  '',
  ...o.items.map((it, i) => [`${i + 1}) ${it.name} — ${it.pkg.label}`, it.playerId ? `   ${it.idLabel}: ${it.playerId}` : null, `   السعر: ${formatPrice(it.pkg.price)}`].filter(Boolean).join('\n')),
  '',
  `الإجمالي: *${formatPrice(o.total)}*`,
  `طريقة الدفع: ${o.paymentLabel}`,
  '',
  'برجاء تأكيد الطلب وإرسال تفاصيل الدفع.',
].join('\n')

function App() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => load('ts_cart', []))
  const [savedIds, setSavedIds] = useState(() => load('ts_player_ids', {}))
  const [selectedGame, setSelectedGame] = useState(null)
  const [playerId, setPlayerId] = useState('')
  const [packageId, setPackageId] = useState('')
  const [payment, setPayment] = useState(STORE.paymentMethods[0].id)
  const [receipt, setReceipt] = useState(null)
  const [remote, setRemote] = useState(null)

  useEffect(() => onSnapshot(doc(db, 'store', 'catalog'), snap => setRemote(snap.exists() ? snap.data() : null), () => {}), [])

  const games = useMemo(() => baseGames.map(g => {
    const pk = remote?.games?.[g.id]?.packages
    if (!pk?.length) return g
    const min = Math.min(...pk.map(p => p.price))
    return { ...g, packages: pk, minPrice: min, price: `ابتداءً من ${formatPrice(min)}` }
  }), [remote])
  const waNumber = normalizeWa(remote?.whatsapp || STORE.whatsapp)
  const [notice, setNotice] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const visibleGames = useMemo(() => games.filter(game => {
    const categoryMatch = activeCategory === 'الكل' || game.category === activeCategory
    const searchMatch = `${game.name} ${game.sub}`.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && searchMatch
  }), [activeCategory, search])

  useEffect(() => { try { localStorage.setItem('ts_cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { try { localStorage.setItem('ts_player_ids', JSON.stringify(savedIds)) } catch {} }, [savedIds])

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.pkg.price, 0), [cart])

  const openGame = (game) => {
    setSelectedGame(game)
    setPackageId((game.packages.find(p => p.note) || game.packages[0]).id)
    setPlayerId(savedIds[game.id] || '')
    setNotice('')
  }

  const addToCart = () => {
    const id = playerId.trim()
    if (!id && !selectedGame.idOptional) {
      setNotice(`اكتب ${selectedGame.idLabel} الأول عشان نجهّز طلبك.`)
      return
    }
    if (id && selectedGame.idType === 'number' && !/^\d{5,16}$/.test(id)) {
      setNotice(`${selectedGame.idLabel} لازم يكون أرقام فقط (من 5 إلى 16 رقم).`)
      return
    }
    const pkg = selectedGame.packages.find(p => p.id === packageId)
    setCart(items => [...items, { id: selectedGame.id, name: selectedGame.name, color: selectedGame.color, symbol: selectedGame.symbol, idLabel: selectedGame.idLabel, playerId: id, pkg, cartId: Date.now() }])
    if (id) setSavedIds(ids => ({ ...ids, [selectedGame.id]: id }))
    setNotice(`اتضاف ${pkg.label} من ${selectedGame.name} للسلة.`)
    setSelectedGame(null)
    setPlayerId('')
  }

  const confirmOrder = () => {
    if (cart.length === 0) return
    const order = {
      no: `SS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }),
      items: cart, total,
      paymentLabel: STORE.paymentMethods.find(m => m.id === payment).label,
    }
    setReceipt(order)
    addDoc(collection(db, 'orders'), {
      no: order.no, total: order.total, payment: order.paymentLabel, status: 'new', createdAt: serverTimestamp(),
      items: order.items.map(it => ({ game: it.name, pkg: it.pkg.label, price: it.pkg.price, playerId: it.playerId || '' })),
    }).catch(() => {})
  }
  const waLink = receipt ? `https://wa.me/${waNumber}?text=${encodeURIComponent(buildMessage(receipt))}` : '#'
  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(buildMessage(receipt)); setNotice('اتنسخ نص الطلب.') } catch { setNotice('ماقدرناش ننسخ — استخدم زرار واتساب.') }
  }
  const closeReceipt = (clear) => { if (clear) setCart([]); setReceipt(null) }

  const removeFromCart = (cartId) => setCart(items => items.filter(item => item.cartId !== cartId))

  return (
    <div className="site-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        شحنك في أمان — دعم فني يساعدك خطوة بخطوة
        <a href="#how">اعرف أكتر <ChevronLeft size={14} /></a>
      </div>

      <header className="topbar">
        <a className="brand" href="#home" aria-label="تراستد صلاح الرئيسية">
          <span className="brand-mark"><Gamepad2 size={22} strokeWidth={2.2} /></span>
          <span className="brand-copy"><b>تراستد صلاح</b><small>TRUSTED SALAH</small></span>
        </a>
        <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'}>
          <a className="nav-active" href="#games" onClick={() => setMobileMenu(false)}>الألعاب</a>
          <a href="#how" onClick={() => setMobileMenu(false)}>طريقة الشحن</a>
          <a href="#why" onClick={() => setMobileMenu(false)}>ليه تختارنا؟</a>
          <a href="#support" onClick={() => setMobileMenu(false)}>الدعم الفني</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button mobile-menu" aria-label="فتح القائمة" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={19}/> : <Menu size={19}/>}</button>
          <button className="cart-button" onClick={() => document.getElementById('cart-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            <ShoppingBag size={17} /><span>السلة</span><b>{cart.length}</b>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={14} /> مستوى جديد من الشحن</div>
            <h1>اللعبة عليك.<br/><span>والشحن علينا.</span></h1>
            <p>اشحن لعبتك المفضلة بسهولة، بأسعار واضحة وخطوات بسيطة. وقتك للعب — والباقي علينا.</p>
            <div className="hero-actions">
              <a href="#games" className="button-primary">اختار لعبتك <ArrowUpLeft size={17}/></a>
              <a href="#how" className="button-quiet">إزاي بيشتغل؟ <ChevronLeft size={16}/></a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars"><span>م</span><span>ع</span><span>س</span></div>
              <div><b>مجتمع اللاعبين</b><small>تجربة سهلة من أول خطوة</small></div>
              <div className="proof-divider" />
              <div className="rating"><span>★★★★★</span><small>اهتمام بالتفاصيل</small></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="صورة سينمائية لأجواء الألعاب">
            <div className="visual-backdrop" /><img className="brand-banner" src={BANNER} alt="SALAHSTORE — Gaming Top-up, Trusted" />
            
            <div className="visual-vignette" />
            <div className="hero-floating top-float"><span className="float-icon blue"><Zap size={16}/></span><span><b>شحن بسيط</b><small>خطوات واضحة</small></span></div>
            <div className="hero-floating bottom-float"><span className="float-icon green"><ShieldCheck size={17}/></span><span><b>تجربة موثوقة</b><small>بيانات طلبك واضحة</small></span><CheckCircle2 className="float-check" size={17}/></div>
            <div className="visual-index"><span>01</span><i /><span>GAMING, REIMAGINED</span></div>
          </div>
          <div className="hero-bottom-line"><span>مصمّم للاعبين</span><span>سريع · واضح · سهل</span><span>EGYPT / 2026</span></div>
        </section>

        <section className="trust-strip" id="why">
          <div className="trust-item"><span className="trust-icon"><Zap size={18}/></span><div><b>خطوات سريعة</b><small>من اختيار اللعبة لتأكيد الطلب</small></div></div>
          <div className="trust-item"><span className="trust-icon"><ShieldCheck size={18}/></span><div><b>وضوح وشفافية</b><small>تفاصيل الطلب قبل التأكيد</small></div></div>
          <div className="trust-item"><span className="trust-icon"><Headphones size={18}/></span><div><b>مساعدة وقت ما تحتاج</b><small>إرشادات واضحة للدعم</small></div></div>
          <div className="trust-note">مصمم علشان تركز في اللعب.</div>
        </section>

        <section className="games-section section-wrap" id="games">
          <div className="section-heading">
            <div><span className="section-kicker">مكتبة الألعاب / ٠١</span><h2>اختار ساحة اللعب.</h2><p>كل لعبتك المفضلة، في مكان واحد.</p></div>
            <a href="#games" className="text-link" onClick={() => { setActiveCategory('الكل'); setSearch('') }}>عرض كل الألعاب <ChevronLeft size={16}/></a>
          </div>
          <div className="catalog-controls">
            <div className="category-tabs" role="tablist" aria-label="تصنيف الألعاب">
              {categories.map(category => <button key={category} className={activeCategory === category ? 'category-tab selected' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
            <label className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="دور على لعبتك..." aria-label="ابحث عن لعبة" />{search && <button aria-label="مسح البحث" onClick={() => setSearch('')}><X size={14}/></button>}</label>
          </div>
          <div className="games-grid">
            {visibleGames.map((game, index) => <article className="game-card" key={game.id}>
              <button className="game-image" onClick={() => openGame(game)} aria-label={`اشحن ${game.name}`}>
                
                {GAME_IMAGES[game.id] && <img src={GAME_IMAGES[game.id]} alt={game.name} loading="lazy" />}<div className={`game-image-tint ${game.color}`} />
                {!GAME_IMAGES[game.id] && <span className="game-symbol">{game.symbol}</span>}
                {game.tag && <span className="game-tag">{game.tag}</span>}
                <span className="game-open"><ArrowUpLeft size={17}/></span>
                <span className="game-index">0{index + 1}</span>
              </button>
              <div className="game-info">
                <div><h3>{game.name}</h3><p>{game.sub}</p></div>
                <button className="add-game" onClick={() => openGame(game)} aria-label={`اختيار ${game.name}`}><Plus size={18}/></button>
              </div>
              <div className="game-card-footer"><span>{game.price}</span><span className="online-dot">متاح للطلب</span></div>
            </article>)}
          </div>
          {visibleGames.length === 0 && <div className="empty-state"><Search size={26}/><b>ملقيناش اللعبة دي</b><span>جرّب اسم تاني أو اختار تصنيف مختلف.</span><button onClick={() => { setSearch(''); setActiveCategory('الكل') }}>عرض كل الألعاب</button></div>}
        </section>

        <section className="feature-band" id="how">
          <div className="feature-copy"><span className="section-kicker">تجربة بدون تعقيد / ٠٢</span><h2>من اختيارك<br/>لحد لعبك.</h2><p>مش محتاج تلف كتير. اختار اللعبة، حدّد الباقة، واكتب بيانات اللاعب المطلوبة. راجع التفاصيل قبل ما تأكد الطلب.</p><a href="#games" className="button-primary">ابدأ الشحن <ArrowUpLeft size={17}/></a></div>
          <div className="steps-list">
            <div className="step"><span>01</span><div><b>اختار اللعبة</b><p>ابدأ من مكتبة الألعاب واختار اللي بتلعبها.</p></div><ChevronLeft size={18}/></div>
            <div className="step"><span>02</span><div><b>حدد الباقة وبيانات اللاعب</b><p>راجع الـ ID والباقة قبل إضافة الطلب.</p></div><ChevronLeft size={18}/></div>
            <div className="step"><span>03</span><div><b>راجع طلبك</b><p>كل التفاصيل قدامك قبل أي خطوة دفع.</p></div><ChevronLeft size={18}/></div>
          </div>
        </section>

        <section className="cart-section section-wrap" id="cart-panel">
          <div className="section-heading compact-heading"><div><span className="section-kicker">طلبك / ٠٣</span><h2>السلة بتاعتك.</h2><p>راجع الألعاب وبيانات اللاعب قبل المتابعة.</p></div><span className="cart-count">{cart.length} عناصر</span></div>
          {cart.length === 0 ? <div className="cart-empty"><span className="cart-empty-icon"><ShoppingBag size={22}/></span><div><b>لسه مفيش طلبات هنا</b><p>لما تختار لعبة وتضيفها، هتلاقي تفاصيلها في المكان ده.</p></div><a href="#games" className="button-outline">اختار لعبة <ChevronLeft size={15}/></a></div> :
            <div className="cart-items">{cart.map(item => <div className="cart-row" key={item.cartId}><span className={`mini-game-icon ${item.color}`}>{item.symbol}</span><div className="cart-row-info"><b>{item.name}</b><small>{item.playerId ? `${item.idLabel}: ${item.playerId} · ` : ''}{item.pkg.label}</small></div><b className="cart-row-price">{formatPrice(item.pkg.price)}</b><button className="remove-button" onClick={() => removeFromCart(item.cartId)}>إزالة</button></div>)}<div className="cart-total"><span>الإجمالي</span><b>{formatPrice(total)}</b><button className="remove-button" onClick={() => setCart([])}>إفراغ السلة</button></div><div className="pay-methods" role="radiogroup" aria-label="طريقة الدفع">{STORE.paymentMethods.map(m => <button key={m.id} role="radio" aria-checked={payment === m.id} className={payment === m.id ? 'amount-option active' : 'amount-option'} onClick={() => setPayment(m.id)}><span>{m.label}</span></button>)}</div><button className="button-primary modal-submit" onClick={confirmOrder}>تأكيد الطلب <CheckCircle2 size={17}/></button><p className="demo-note">بعد التأكيد بيتفتح طلبك على واتساب بشكل منسّق، وبنرد عليك بتفاصيل الدفع.</p></div>}
        </section>

        <section className="support-banner" id="support">
          <div className="support-orb"><Headphones size={24}/></div><div><span>محتاج مساعدة؟</span><h2>إحنا هنا علشان نسهّلها.</h2><p>لو مش عارف تجيب Player ID أو تختار الباقة، هنوضح لك الخطوات.</p></div><a href="mailto:support@example.com" className="button-outline">تواصل مع الدعم <ArrowUpLeft size={16}/></a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark"><Gamepad2 size={20}/></span><span className="brand-copy"><b>تراستد صلاح</b><small>TRUSTED SALAH</small></span></a>
        <span className="footer-copy">واجهة تجريبية لمتجر شحن ألعاب إلكترونية.</span>
        <div className="footer-links"><a href="#games">الألعاب</a><a href="#how">طريقة الشحن</a><a href="#support">الدعم</a></div>
        <span className="copyright">© 2026 Trusted Salah</span>
      </footer>

      {notice && <div className="toast" role="status"><CheckCircle2 size={17}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="إغلاق"><X size={15}/></button></div>}

      {receipt && <div className="receipt-backdrop" role="dialog" aria-modal="true" aria-label="إيصال الطلب">
        <div className="receipt-stage">
          <div className="printer-slot" />
          <div className="receipt-window"><div className="receipt-paper">
            <div className="rc-head"><b>{STORE.name}</b><small>إيصال طلب</small></div>
            <div className="rc-meta"><span>رقم الطلب</span><b>{receipt.no}</b></div>
            <div className="rc-meta"><span>التاريخ</span><b>{receipt.date}</b></div>
            <div className="rc-meta"><span>الدفع</span><b>{receipt.paymentLabel}</b></div>
            <div className="rc-meta"><span>الحالة</span><b>بانتظار الدفع</b></div>
            <hr />
            {receipt.items.map(it => <div className="rc-item" key={it.cartId}><div><b>{it.name}</b><small>{it.pkg.label}{it.playerId ? ` · ${it.playerId}` : ''}</small></div><span>{formatPrice(it.pkg.price)}</span></div>)}
            <hr />
            <div className="rc-total"><span>الإجمالي</span><b>{formatPrice(receipt.total)}</b></div>
          </div></div>
          <div className="receipt-actions">
            <a className="button-primary modal-submit" href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setTimeout(() => closeReceipt(true), 400)}>إرسال الطلب على واتساب <ArrowUpLeft size={17}/></a>
            <div className="receipt-secondary"><button className="button-outline" onClick={copyOrder}>نسخ الطلب</button><button className="button-outline" onClick={() => closeReceipt(false)}>رجوع للسلة</button></div>
          </div>
        </div>
      </div>}

      {selectedGame && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedGame(null) }}>
        <div className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-top"><span className="section-kicker">تفاصيل الشحن</span><button className="icon-button" onClick={() => setSelectedGame(null)} aria-label="إغلاق"><X size={19}/></button></div>
          <div className="modal-game-head"><div className={`mini-game-icon large ${selectedGame.color}`}>{selectedGame.symbol}</div><div><h2 id="modal-title">{selectedGame.name}</h2><p>{selectedGame.sub}</p></div></div>
          <label className="field-label" htmlFor="player-id">{selectedGame.idLabel} <span>{selectedGame.idOptional ? 'اختياري' : 'مطلوب'}</span></label>
          <input id="player-id" className="form-input" value={playerId} onChange={e => setPlayerId(e.target.value)} placeholder={selectedGame.idHint} inputMode={selectedGame.idType === 'number' ? 'numeric' : 'text'} autoFocus />
          <label className="field-label">اختار الباقة</label>
          <div className="amount-options package-grid">{selectedGame.packages.map(p => <button key={p.id} onClick={() => setPackageId(p.id)} className={packageId === p.id ? 'amount-option active' : 'amount-option'}><span>{p.label}</span><small>{formatPrice(p.price)}{p.note ? ` · ${p.note}` : ''}</small></button>)}</div>
          <div className="modal-total"><span>الإجمالي</span><b>{formatPrice((selectedGame.packages.find(p => p.id === packageId) || selectedGame.packages[0]).price)}</b></div>
          <div className="modal-disclaimer"><ShieldCheck size={16}/><span>راجع الـ ID قبل المتابعة. الدفع بيتم بعد تأكيد الطلب على واتساب.</span></div>
          <button className="button-primary modal-submit" onClick={addToCart}>إضافة للسلة <ShoppingBag size={17}/></button>
        </div>
      </div>}
    </div>
  )
}

export default App
