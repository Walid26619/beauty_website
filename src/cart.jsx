import {createContext,useContext,useEffect,useMemo,useState} from 'react'
import {useData} from './data'
import {fmt} from './sanity'
const C=createContext()
export const useCart=()=>useContext(C)
export const buildWhatsAppUrl=(number,lines,total)=>{
 const body=['Hello Kismart Beauty Products, I would like to order:',...lines.map(l=>`- ${l.name}${l.variant?` (${l.variant})`:''} x${l.qty}: ${l.price!=null?fmt(l.price*l.qty):'price to be confirmed'}`),total!=null?`Total: ${fmt(total)}`:'Total: to be confirmed'].join('\n')
 return `https://wa.me/${String(number).replace(/\D/g,'')}?text=${encodeURIComponent(body)}`}
export function CartProvider({children}){
 const {data}=useData()
 const [items,set]=useState(()=>{try{return JSON.parse(localStorage.getItem('kb-cart'))||[]}catch{return[]}})
 useEffect(()=>{try{localStorage.setItem('kb-cart',JSON.stringify(items))}catch{}},[items])
 const add=(p,variant='',qty=1)=>set(s=>{const key=p._id+'|'+variant,f=s.find(i=>i.key===key);qty=Math.max(1,Math.min(99,qty|0));return f?s.map(i=>i.key===key?{...i,qty:Math.min(99,i.qty+qty)}:i):[...s,{key,id:p._id,variant,qty,price:p.price}]})
 const setQty=(key,q)=>set(s=>q<1?s.filter(i=>i.key!==key):s.map(i=>i.key===key?{...i,qty:Math.min(99,q)}:i))
 const lines=useMemo(()=>items.map(i=>{const p=data?.products.find(p=>p._id===i.id);return{...i,name:p?.name||'Unknown product',slug:p?.slug,price:p?p.price:i.price,unavailable:!p||p.available===false,priceChanged:!!p&&i.price!==p.price}}),[items,data])
 const ok=lines.filter(l=>!l.unavailable)
 const total=ok.length&&ok.every(l=>l.price!=null)?ok.reduce((a,l)=>a+l.price*l.qty,0):null
 const count=items.reduce((a,i)=>a+i.qty,0)
 return <C.Provider value={{lines,ok,total,count,add,setQty}}>{children}</C.Provider>
}
