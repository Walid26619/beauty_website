import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
const projectId=import.meta.env.VITE_SANITY_PROJECT_ID
export const configured=!!projectId&&projectId!=='your_project_id'
export const client=configured?createClient({projectId,dataset:import.meta.env.VITE_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:true}):null
const b=client&&imageUrlBuilder(client)
export const img=(s,w=800)=>s&&b?b.image(s).width(w).auto('format').url():null
const cur=import.meta.env.VITE_CURRENCY||'UGX'
export const fmt=(p,c=cur)=>p==null?'Price to be confirmed':`${c} ${Number(p).toLocaleString('en-US')}`
