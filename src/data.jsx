import {createContext,useContext,useEffect,useState} from 'react'
import {client,configured} from './sanity'
const Q=`{"products":*[_type=="product"]|order(order asc){_id,name,"slug":slug.current,price,oldPrice,short,description,mainImage,images,"category":category->slug.current,available,variants,featured,details},
"categories":*[_type=="category"&&visible!=false]|order(order asc){name,"slug":slug.current,description,image},
"settings":*[_type=="settings"][0],"home":*[_type=="home"][0]}`
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-')
// Development placeholders only (shown when Sanity is not configured). No prices or product claims.
const demo={products:[['Body wax','body-care'],['Hair oil','hair-care'],['Lip scrub','lip-care'],['Carrot oil','oils'],['Skin and body oil','oils'],['Jelly for men and women','jellies']].map(([name,category],i)=>({_id:'demo'+i,name,slug:slug(name),price:null,short:'Details coming soon.',category,available:true,featured:true})),
categories:[['Body Care','body-care'],['Hair Care','hair-care'],['Lip Care','lip-care'],['Oils','oils'],['Jellies','jellies']].map(([name,s])=>({name,slug:s})),settings:null,home:null}
const Ctx=createContext()
export const useData=()=>useContext(Ctx)
export function DataProvider({children}){
 const [s,set]=useState({status:configured?'loading':'demo',data:configured?null:demo})
 const load=()=>{if(!configured)return;set({status:'loading',data:null});client.fetch(Q).then(d=>set({status:'ok',data:d})).catch(e=>set({status:'error',data:null,error:e.message}))}
 useEffect(load,[])
 return <Ctx.Provider value={{...s,retry:load}}>{children}</Ctx.Provider>
}
