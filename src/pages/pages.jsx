import {useMemo,useState} from 'react'
import {Link,useParams,useSearchParams} from 'react-router-dom'
import {motion,AnimatePresence} from 'motion/react'
import {Search,Minus,Plus,MessageCircle} from 'lucide-react'
import {useData} from '../data'
import {useCart,buildWhatsAppUrl} from '../cart'
import {Pic,Grid,Faq} from '../ui'
import {fmt} from '../sanity'
const Sec=({title,children,to})=><section className="wrap mt-20"><div className="mb-8 flex items-end justify-between gap-4"><h2 className="text-3xl md:text-4xl">{title}</h2>{to&&<Link to={to[0]} className="text-sm underline underline-offset-4">{to[1]}</Link>}</div>{children}</section>
export function Home(){
 const {data}=useData();const h=data.home||{};const feat=data.products.filter(p=>p.featured).slice(0,6)
 return <>
  <section className="bg-blush/50"><div className="wrap grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
   <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6}}><h1 className="text-5xl md:text-7xl">{h.heroHeading||'Beauty, simply cared for.'}</h1>
    <p className="mt-5 max-w-md text-lg text-brown-soft">{h.heroText||'Body, hair, lip and skin care from Kismart Beauty Products.'}</p>
    <Link to={h.ctaLink||'/shop'} className="btn btn-primary mt-8">{h.ctaText||'Shop the collection'}</Link></motion.div>
   <Pic src={h.heroImage} alt="Kismart Beauty Products" w={1200} priority className="aspect-[4/5] rounded-t-full md:aspect-[5/6]"/></div></section>
  {feat.length>0&&<Sec title="Featured" to={['/shop','See everything']}><Grid items={feat}/></Sec>}
  {data.categories.length>0&&<Sec title="Shop by category"><div className="grid grid-cols-2 gap-4 md:grid-cols-3">{data.categories.map(c=><Link key={c.slug} to={`/shop?category=${c.slug}`} className="group block"><Pic src={c.image} alt={c.name} className="aspect-[4/3] rounded-2xl"/><p className="mt-2 font-display text-xl">{c.name}</p></Link>)}</div></Sec>}
  {h.promoText&&<Sec title="New and special"><p className="max-w-xl text-lg text-brown-soft">{h.promoText}</p></Sec>}
  <Sec title="About the brand"><p className="max-w-xl text-lg text-brown-soft">{h.intro||'Our brand introduction will be added here.'}</p><Link to="/about" className="mt-4 inline-block underline underline-offset-4">Read more</Link></Sec>
  <Sec title="Questions"><Faq items={h.faqs}/></Sec></>}
export function Shop(){
 const {data}=useData();const [sp,setSp]=useSearchParams();const [q,setQ]=useState('');const [sort,setSort]=useState('order')
 const cat=sp.get('category')||'all'
 const list=useMemo(()=>{let l=data.products.filter(p=>(cat==='all'||p.category===cat)&&p.name.toLowerCase().includes(q.trim().toLowerCase()))
  if(sort==='low')l=[...l].sort((a,b)=>(a.price??1e12)-(b.price??1e12));if(sort==='high')l=[...l].sort((a,b)=>(b.price??-1)-(a.price??-1));if(sort==='name')l=[...l].sort((a,b)=>a.name.localeCompare(b.name));return l},[data,cat,q,sort])
 const chip=(s,n)=><button key={s} aria-pressed={cat===s} onClick={()=>setSp(s==='all'?{}:{category:s})} className={`min-h-11 rounded-full border px-4 text-sm ${cat===s?'border-brown bg-brown text-cream':'border-blush-deep'}`}>{n}</button>
 return <div className="wrap py-12"><h1 className="text-5xl">Shop</h1>
  <div className="mt-6 flex flex-wrap gap-2">{chip('all','All')}{data.categories.map(c=>chip(c.slug,c.name))}</div>
  <div className="mt-4 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><span className="sr-only">Search products</span><Search size={16} className="absolute left-4 top-3.5 text-brown-soft"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products" className="min-h-11 w-full rounded-full border border-blush-deep bg-white/60 pl-10 pr-4"/></label>
   <label><span className="sr-only">Sort</span><select value={sort} onChange={e=>setSort(e.target.value)} className="min-h-11 w-full rounded-full border border-blush-deep bg-white/60 px-4"><option value="order">Featured order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name</option></select></label></div>
  <div className="mt-8">{list.length?<Grid items={list}/>:<p className="py-16 text-center text-brown-soft">No products match. Clear the search or choose another category.</p>}</div></div>}
export function Product(){
 const {slug}=useParams();const {data}=useData();const {add}=useCart();const p=data.products.find(x=>x.slug===slug)
 const [i,setI]=useState(0);const [v,setV]=useState('');const [qty,setQty]=useState(1);const [added,setAdded]=useState(false)
 if(!p)return <div className="wrap py-24"><h1 className="text-4xl">Product not found</h1><Link to="/shop" className="btn btn-primary mt-6">Back to the shop</Link></div>
 const pics=[p.mainImage,...(p.images||[])].filter(Boolean);const out=p.available===false;const need=p.variants?.length>0&&!v
 const rel=data.products.filter(x=>x.category===p.category&&x._id!==p._id).slice(0,3)
 return <div className="wrap py-12"><div className="grid gap-10 md:grid-cols-2">
  <div><AnimatePresence mode="wait"><motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}><Pic src={pics[i]} alt={p.name} w={1000} priority className="aspect-[4/5] rounded-2xl"/></motion.div></AnimatePresence>
   {pics.length>1&&<div className="mt-3 flex gap-2">{pics.map((s,k)=><button key={k} aria-label={`Photo ${k+1}`} aria-current={k===i} onClick={()=>setI(k)} className={`w-16 rounded-lg ${k===i?'ring-2 ring-rose':''}`}><Pic src={s} w={160} alt="" className="aspect-square rounded-lg"/></button>)}</div>}</div>
  <div><h1 className="break-words text-4xl md:text-5xl">{p.name}</h1>
   <p className="mt-3 text-2xl">{fmt(p.price)} {p.oldPrice>p.price&&p.price!=null&&<s className="text-base text-brown-soft">{fmt(p.oldPrice)}</s>}</p>
   <p className={`mt-1 text-sm ${out?'text-rose':'text-brown-soft'}`}>{out?'Out of stock':'Available'}</p>
   <p className="mt-5 whitespace-pre-line text-brown-soft">{p.description||p.short||'Full description coming soon.'}</p>
   {p.details?.length>0&&<ul className="mt-4 list-disc pl-5 text-sm text-brown-soft">{p.details.map((d,k)=><li key={k}>{d}</li>)}</ul>}
   {p.variants?.length>0&&<fieldset className="mt-6"><legend className="mb-2 font-medium">Option</legend><div className="flex flex-wrap gap-2">{p.variants.map(x=><button key={x} aria-pressed={v===x} onClick={()=>setV(x)} className={`min-h-11 rounded-full border px-4 ${v===x?'border-brown bg-brown text-cream':'border-blush-deep'}`}>{x}</button>)}</div></fieldset>}
   <div className="mt-6 flex items-center gap-4"><div className="flex items-center rounded-full border border-blush-deep"><button aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center" onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={16}/></button><span aria-live="polite" className="w-8 text-center">{qty}</span><button aria-label="Increase quantity" className="grid h-11 w-11 place-items-center" onClick={()=>setQty(Math.min(99,qty+1))}><Plus size={16}/></button></div>
    <button disabled={out||need} onClick={()=>{add(p,v,qty);setAdded(true);setTimeout(()=>setAdded(false),1800)}} className="btn btn-primary flex-1">{added?'Added to cart':'Add to cart'}</button></div>
   {need&&!out&&<p className="mt-2 text-sm text-brown-soft">Choose an option to add this product.</p>}</div></div>
  {rel.length>0&&<Sec title="You may also like"><Grid items={rel}/></Sec>}</div>}
export function About(){const {data}=useData();return <div className="wrap max-w-2xl py-16"><h1 className="text-5xl">About us</h1><p className="mt-6 whitespace-pre-line text-lg text-brown-soft">{data.settings?.about||'Our story will be added here by the owner.'}</p></div>}
export function Contact(){
 const {data}=useData();const s=data.settings||{};const wa=s.whatsapp||import.meta.env.VITE_WHATSAPP_NUMBER
 return <div className="wrap max-w-3xl py-16"><h1 className="text-5xl">Contact</h1>
  <div className="mt-6 space-y-2 text-lg text-brown-soft"><p>Phone: {s.phone||'Phone number coming soon'}</p><p>Email: {s.email||'Email address coming soon'}</p><p>Location: {s.address||'Address coming soon'}</p></div>
  {wa?<a className="btn btn-primary mt-6" href={`https://wa.me/${String(wa).replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Chat on WhatsApp</a>:<p className="mt-6 text-sm text-brown-soft">WhatsApp ordering will be available once the number is added.</p>}
  <h2 className="mb-6 mt-16 text-3xl">Frequently asked questions</h2><Faq items={data.home?.faqs}/></div>}
export function CartPage(){
 const {lines,ok,total,setQty}=useCart();const {data}=useData();const wa=data.settings?.whatsapp||import.meta.env.VITE_WHATSAPP_NUMBER
 if(!lines.length)return <div className="wrap py-24 text-center"><h1 className="text-4xl">Your cart is empty</h1><Link to="/shop" className="btn btn-primary mt-6">Start shopping</Link></div>
 return <div className="wrap max-w-3xl py-12"><h1 className="text-5xl">Your cart</h1>
  <ul className="mt-6 divide-y divide-blush-deep/60">{lines.map(l=><motion.li layout key={l.key} className="flex flex-wrap items-center gap-4 py-4"><div className="min-w-0 flex-1"><p className="break-words font-medium">{l.name}{l.variant&&` (${l.variant})`}</p><p className="text-sm text-brown-soft">{fmt(l.price)}</p>
   {l.unavailable&&<p className="text-sm text-rose">Unavailable. It won't be included in your order.</p>}{l.priceChanged&&!l.unavailable&&<p className="text-sm text-rose">The price has changed since you added this.</p>}</div>
   <div className="flex items-center rounded-full border border-blush-deep"><button aria-label={`Decrease ${l.name}`} className="grid h-11 w-11 place-items-center" onClick={()=>setQty(l.key,l.qty-1)}><Minus size={16}/></button><span className="w-8 text-center">{l.qty}</span><button aria-label={`Increase ${l.name}`} className="grid h-11 w-11 place-items-center" onClick={()=>setQty(l.key,l.qty+1)}><Plus size={16}/></button></div>
   <button className="text-sm underline" onClick={()=>setQty(l.key,0)}>Remove</button></motion.li>)}</ul>
  <p className="mt-6 text-xl">Total: <motion.span key={total} initial={{opacity:.3}} animate={{opacity:1}}>{total!=null?fmt(total):'to be confirmed'}</motion.span></p>
  <div className="mt-6 flex flex-wrap gap-3"><Link to="/shop" className="btn btn-ghost">Continue shopping</Link>
   {wa&&ok.length>0?<a className="btn btn-primary" target="_blank" rel="noreferrer" href={buildWhatsAppUrl(wa,ok,total)}><MessageCircle size={18}/>Order on WhatsApp</a>:<button className="btn btn-primary" disabled>Order on WhatsApp</button>}</div>
  <p className="mt-4 text-sm text-brown-soft">{wa?'This opens WhatsApp with your order. Your order is not confirmed or paid until Kismart replies.':'WhatsApp ordering will be available once the shop number is added.'}</p></div>}
