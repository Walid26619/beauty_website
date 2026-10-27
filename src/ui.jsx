import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion,AnimatePresence} from 'motion/react'
import {ImageOff,ChevronDown,ShoppingBag} from 'lucide-react'
import {img,fmt} from './sanity'
import {useCart} from './cart'
export function Pic({src,alt,w=800,className='',priority}){
 const [bad,setBad]=useState(false);const u=img(src,w)
 return <div className={`relative overflow-hidden bg-blush/60 ${className}`}>
  {u&&!bad?<motion.img initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5}} src={u} srcSet={`${img(src,w/2)} ${w/2}w, ${u} ${w}w`} sizes="(min-width:768px) 33vw, 90vw" alt={alt||''} loading={priority?'eager':'lazy'} onError={()=>setBad(true)} className="absolute inset-0 h-full w-full object-cover"/>
  :<div role="img" aria-label={alt?`${alt} (photo coming soon)`:'Photo coming soon'} className="absolute inset-0 grid place-items-center text-brown-soft"><span className="grid place-items-center gap-1 text-xs"><ImageOff size={22}/>Photo coming soon</span></div>}</div>}
export function Card({p}){
 const {add}=useCart();const out=p.available===false;const multi=p.variants?.length>0
 return <motion.article whileHover={{y:-4}} transition={{duration:.25}} className="group flex flex-col">
  <Link to={`/shop/${p.slug}`} className="block"><Pic src={p.mainImage} alt={p.name} className="aspect-[4/5] rounded-2xl"/>
  <h3 className="mt-3 text-xl break-words">{p.name}</h3></Link>
  <p className="text-sm text-brown-soft line-clamp-2">{p.short}</p>
  <div className="mt-2 flex items-baseline gap-2"><span className="font-medium">{fmt(p.price)}</span>{p.oldPrice>p.price&&p.price!=null&&<s className="text-sm text-brown-soft">{fmt(p.oldPrice)}</s>}
  <span className={`ml-auto text-xs ${out?'text-rose':'text-brown-soft'}`}>{out?'Out of stock':'Available'}</span></div>
  {multi?<Link to={`/shop/${p.slug}`} className="btn btn-ghost mt-3">Choose option</Link>:<button disabled={out} onClick={()=>add(p)} className="btn btn-ghost mt-3"><ShoppingBag size={16}/>Add to cart</button>}
 </motion.article>}
export function Grid({items}){return <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">{items.map(p=><Card key={p._id} p={p}/>)}</div>}
export function Faq({items}){
 const [open,setOpen]=useState(null)
 if(!items?.length)return <p className="text-brown-soft">Questions and answers will appear here once they are added in the content dashboard.</p>
 return <div className="divide-y divide-blush-deep/60 border-y border-blush-deep/60">{items.map((f,i)=><div key={i}>
  <h3 className="text-base font-body"><button aria-expanded={open===i} aria-controls={`faq${i}`} onClick={()=>setOpen(open===i?null:i)} className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium">{f.q}<motion.span animate={{rotate:open===i?180:0}}><ChevronDown size={18}/></motion.span></button></h3>
  <AnimatePresence initial={false}>{open===i&&<motion.div id={`faq${i}`} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="pb-4 text-brown-soft">{f.a}</p></motion.div>}</AnimatePresence></div>)}</div>}
export const Loading=()=><div className="wrap py-24 text-center text-brown-soft" role="status">Loading…</div>
export const Err=({msg,retry})=><div className="wrap py-24 text-center" role="alert"><p>We couldn't load the shop.{msg&&<span className="block text-sm text-brown-soft">{msg}</span>}</p><button className="btn btn-primary mt-4" onClick={retry}>Try again</button></div>
