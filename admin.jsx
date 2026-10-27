import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { games as baseGames, STORE, formatPrice } from './data/catalog'
import './admin.css'

// للعرض فقط — الحماية الفعلية في firestore.rules
const ALLOWED = ['amrt6509@gmail.com', 'salahahmed1102010@gmail.com']

const buildDraft = (remote) => Object.fromEntries(baseGames.map(g => [g.id, (remote?.games?.[g.id]?.packages?.length ? remote.games[g.id].packages : g.packages).map(p => ({ ...p, price: String(p.price) }))]))

function Login({ err, setErr }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass) }
    catch { setErr('البريد أو كلمة المرور غير صحيحة') }
    setBusy(false)
  }
  return <div className="wrap" style={{ maxWidth: 440, paddingTop: 90 }}><form className="card" onSubmit={submit}>
    <span className="mono">SALAH_STORE / ADMIN</span>
    <h1 style={{ margin: '10px 0 6px' }}>دخول لوحة التحكم</h1>
    <p className="muted" style={{ margin: '0 0 20px' }}>للمشرفين فقط</p>
    <input type="email" autoComplete="username" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', direction: 'ltr', marginBottom: 12 }} required />
    <input type="password" autoComplete="current-password" placeholder="كلمة المرور" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', direction: 'ltr', marginBottom: 14 }} required />
    {err && <p className="err" style={{ margin: '0 0 12px' }}>{err}</p>}
    <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? '...' : 'دخول'}</button>
  </form></div>
}

function Orders() {
  const [orders, setOrders] = useState([])
  useEffect(() => onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50)), s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))), () => {}), [])
  const mark = (id, status) => updateDoc(doc(db, 'orders', id), { status })
  if (!orders.length) return <p className="muted" style={{ textAlign: 'center', padding: 24 }}>مفيش طلبات لسه</p>
  return orders.map(o => <div className="row order" key={o.id}>
    <b style={{ minWidth: 90 }}>{o.no}</b>
    <div style={{ flex: 1, minWidth: 180 }}>{(o.items || []).map((it, i) => <span key={i} style={{ display: 'block' }}>{it.game} — {it.pkg}{it.playerId ? ` · ${it.playerId}` : ''}</span>)}<small>{o.payment} · {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString('ar-EG') : ''}</small></div>
    <b>{formatPrice(o.total)}</b>
    <button className={o.status === 'done' ? 'chip on' : 'chip'} onClick={() => mark(o.id, o.status === 'done' ? 'new' : 'done')}>{o.status === 'done' ? 'تم التسليم ✓' : 'تحديد كمُسلَّم'}</button>
  </div>)
}

function Panel({ user }) {
  const [tab, setTab] = useState('prices')
  const [gid, setGid] = useState(baseGames[0].id)
  const [remote, setRemote] = useState(undefined)
  const [draft, setDraft] = useState(() => buildDraft(null))
  const [wa, setWa] = useState(STORE.whatsapp)
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState('')
  const [nl, setNl] = useState(''); const [np, setNp] = useState('')

  useEffect(() => onSnapshot(doc(db, 'store', 'catalog'), s => setRemote(s.exists() ? s.data() : null), () => setRemote(null)), [])
  useEffect(() => { if (remote !== undefined && !dirty) { setDraft(buildDraft(remote)); setWa(remote?.whatsapp || STORE.whatsapp) } }, [remote, dirty])

  const say = (m) => { setToast(m); setTimeout(() => setToast(''), 1800) }
  const pk = draft[gid]
  const edit = (id, patch) => { setDraft(d => ({ ...d, [gid]: d[gid].map(p => p.id === id ? { ...p, ...patch } : p) })); setDirty(true) }
  const del = (id) => { setDraft(d => ({ ...d, [gid]: d[gid].filter(p => p.id !== id) })); setDirty(true) }
  const add = () => {
    if (!nl.trim() || !(Number(np) > 0)) return say('اكتب الاسم وسعر صحيح')
    setDraft(d => ({ ...d, [gid]: d[gid].concat([{ id: 'p' + Date.now(), label: nl.trim(), price: String(Number(np)) }]) })); setNl(''); setNp(''); setDirty(true)
  }
  const save = async () => {
    for (const g of baseGames) {
      const list = draft[g.id]
      if (!list.length) return say(`${g.name}: لازم باقة واحدة على الأقل`)
      if (list.some(p => !p.label.trim() || !(Number(p.price) > 0))) return say(`${g.name}: راجع الأسماء والأسعار`)
    }
    const digits = wa.replace(/\D/g, '')
    if (digits.length < 10) return say('رقم الواتساب غير صحيح')
    try {
      await setDoc(doc(db, 'store', 'catalog'), {
        whatsapp: wa.trim(),
        games: Object.fromEntries(baseGames.map(g => [g.id, { packages: draft[g.id].map(p => ({ id: p.id, label: p.label.trim(), price: Number(p.price), ...(p.note ? { note: p.note } : {}) })) }])),
        updatedAt: serverTimestamp(),
      })
      setDirty(false); say('اتحفظ — المتجر اتحدّث')
    } catch { say('فشل الحفظ — تأكد من الصلاحيات') }
  }

  return <div className="wrap">
    <div className="top"><div style={{ direction: 'ltr' }}><b style={{ fontSize: 22 }}>SALAH <span style={{ color: '#ff2a2a' }}>STORE</span></b><span className="mono">ADMIN PANEL</span></div>
      <div className="top"><span className="muted" style={{ direction: 'ltr' }}>{user.email}</span><button className="chip" onClick={() => signOut(auth)}>خروج</button></div></div>
    <div className="chips">{[['prices', 'الأسعار'], ['orders', 'الطلبات'], ['settings', 'الإعدادات']].map(([k, l]) => <button key={k} className={tab === k ? 'chip on' : 'chip'} onClick={() => setTab(k)}>{l}</button>)}</div>

    {tab === 'prices' && <div className="card">
      <div className="chips" style={{ marginTop: 0 }}>{baseGames.map(g => <button key={g.id} className={gid === g.id ? 'chip on' : 'chip'} onClick={() => setGid(g.id)}>{g.name}</button>)}</div>
      {pk.map(p => <div className="row" key={p.id}>
        <input className="grow" value={p.label} onChange={e => edit(p.id, { label: e.target.value })} aria-label="اسم الباقة" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}><input type="number" min="0" value={p.price} onChange={e => edit(p.id, { price: e.target.value })} style={{ width: 100 }} aria-label="السعر" />ج.م</label>
        <button className="danger" onClick={() => del(p.id)}>حذف</button>
      </div>)}
      <div className="row" style={{ borderStyle: 'dashed' }}>
        <input className="grow" placeholder="باقة جديدة، مثال: 2000 جوهرة" value={nl} onChange={e => setNl(e.target.value)} />
        <input type="number" min="0" placeholder="السعر" value={np} onChange={e => setNp(e.target.value)} style={{ width: 100 }} />
        <button className="chip" onClick={add}>إضافة</button>
      </div>
    </div>}

    {tab === 'orders' && <div className="card"><Orders /></div>}

    {tab === 'settings' && <div className="card"><label htmlFor="wa" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>رقم الواتساب</label>
      <input id="wa" value={wa} onChange={e => { setWa(e.target.value); setDirty(true) }} style={{ width: '100%', direction: 'ltr' }} />
      <p className="muted">الرقم بيستخدمه زرار إرسال الطلب في المتجر. اكتبه بصيغة 010... أو 2010...</p></div>}

    {tab !== 'orders' && <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}><button className="btn" onClick={save} disabled={!dirty}>حفظ التغييرات</button>{dirty && <span className="muted">فيه تغييرات لسه ما اتحفظتش</span>}</div>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}

function App() {
  const [user, setUser] = useState(undefined)
  const [err, setErr] = useState('')
  useEffect(() => onAuthStateChanged(auth, u => {
    if (u && !ALLOWED.includes((u.email || '').toLowerCase())) { signOut(auth); setErr('الحساب ده مش مصرّح له'); setUser(null); return }
    setUser(u)
  }), [])
  if (user === undefined) return <p className="muted" style={{ textAlign: 'center', paddingTop: 120 }}>...</p>
  return user ? <Panel user={user} /> : <Login err={err} setErr={setErr} />
}

createRoot(document.getElementById('root')).render(<App />)
