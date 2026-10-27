import {useEffect,useState} from 'react'
import {Routes,Route,NavLink,Link,useLocation} from 'react-router-dom'
import {motion,AnimatePresence} from 'motion/react'
import {Menu,X,ShoppingBag} from 'lucide-react'
import {useData} from './data'
import {useCart} from './cart'
import {Loading,Err} from './ui'
import {Home,Shop,Product,About,Contact,CartPage} from './pages/pages'
const links=[['/','Home'],['/shop','Shop'],['/about','About'],['/contact','Contact']]
function Header({brand}){
 const [open,setOpen]=useState(false);const {count}=useCart();const loc=useLocation()
 useEffect(()=>setOpen(false),[loc.pathname])
 return <header className="sticky top-0 z-30 border-b border-blush-deep/50 bg-cream/90 backdrop-blur"><div className="wrap flex h-16 items-center justify-between">
  <Link to="/" className="font-display text-xl tracking-wide">{brand}</Link>
  <nav aria-label="Main" className="hidden gap-8 md:flex">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className="relative py-1">{({isActive})=><>{l}{isActive&&<motion.span layoutId="nav" className="absolute inset-x-0 -bottom-0.5 h-px bg-rose"/>}</>}</NavLink>)}</nav>
  <div className="flex items-center gap-1"><Link to="/cart" aria-label={`Cart, ${count} items`} className="relative grid h-11 w-11 place-items-center"><ShoppingBag size={22}/>
   <AnimatePresence>{count>0&&<motion.span key={count} initial={{scale:.5}} animate={{scale:1}} className="absolute right-0 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-xs text-cream">{count}</motion.span>}</AnimatePresence></Link>
   <button className="grid h-11 w-11 place-items-center md:hidden" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div>
  <AnimatePresence>{open&&<motion.nav aria-label="Mobile" initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden bg-cream md:hidden"><div className="wrap flex flex-col pb-4">{links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className="py-3 text-lg">{l}</NavLink>)}</div></motion.nav>}</AnimatePresence></header>}
function Footer({s,brand}){
 const soc=[['Instagram',s?.instagram],['Facebook',s?.facebook],['TikTok',s?.tiktok]].filter(x=>x[1])
 return <footer className="mt-24 bg-sand py-12"><div className="wrap grid gap-6 md:grid-cols-3"><div><p className="font-display text-xl">{brand}</p><p className="mt-2 text-sm text-brown-soft">{s?.footer||'Footer text can be edited in the content dashboard.'}</p></div>
 <div className="text-sm"><p className="font-medium">Visit</p>{links.map(([to,l])=><Link key={to} to={to} className="block py-1">{l}</Link>)}</div>
 <div className="text-sm"><p className="font-medium">Follow</p>{soc.length?soc.map(([n,u])=><a key={n} href={u} target="_blank" rel="noreferrer" className="block py-1">{n}</a>):<p className="text-brown-soft">Social links coming soon.</p>}</div></div></footer>}
export default function App(){
 const {status,data,error,retry}=useData();const loc=useLocation()
 useEffect(()=>window.scrollTo(0,0),[loc.pathname])
 const brand=data?.settings?.brand||'Kismart Beauty Products'
 return <><a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-cream focus:p-3">Skip to content</a><Header brand={brand}/>
  <main id="main">{status==='loading'?<Loading/>:status==='error'?<Err msg={error} retry={retry}/>:<>
   {status==='demo'&&<p className="bg-blush py-2 text-center text-sm">Preview mode: Sanity isn't connected yet, so placeholder products are shown.</p>}
   <Routes><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/shop/:slug" element={<Product/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/cart" element={<CartPage/>}/><Route path="*" element={<div className="wrap py-24"><h1 className="text-4xl">Page not found</h1><Link to="/shop" className="btn btn-primary mt-6">Go to the shop</Link></div>}/></Routes></>}</main>
  <Footer s={data?.settings} brand={brand}/></>}
