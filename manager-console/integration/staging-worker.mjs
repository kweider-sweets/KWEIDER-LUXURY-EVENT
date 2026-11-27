import {quote} from './quote-contract.mjs';
function parseMenu(html) {
 const decode=s=>String(s||"").replace(/&(?:amp|quot|apos|lt|gt|nbsp|#\d+|#x[\da-f]+);/gi,x=>{const k=x.toLowerCase();if(k.startsWith("&#")){const n=k.startsWith("&#x")?parseInt(k.slice(3,-1),16):Number(k.slice(2,-1));return n>0&&n<=0x10ffff?String.fromCodePoint(n):x}return {"&amp;":"&","&quot;":'"',"&apos;":"'","&lt;":"<","&gt;":">","&nbsp;":" "}[k]||x}).trim();
 if(typeof html!=="string"||html.length>3000000)throw Error("MENU_INVALID");
 const rows=[];let category="";
 for(const tag of html.matchAll(/<(?:div|section)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)){
  const a=Object.fromEntries([...tag[0].matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3])]));
  const classes=(a.class||"").split(/\s+/);if(classes.includes("menu-section"))category=a.id||"";if(!classes.includes("item-card"))continue;
  const name=a["data-name-en"],ar=a["data-name-ar"],raw=a["data-price"],img=a["data-img"];
  if(!name||!ar||!raw||!img)continue;
  const price=raw.match(/^£\s*(\d{1,5}(?:\.\d{1,2})?)(?:\s*<small\s*>\s*\(?\s*(\d{1,4})\s*(pcs?|g|kg|ml|l)\s*\)?\s*<\/small\s*>)?\s*$/i);
  if(!price)continue;
  let image=img.startsWith("https://menu.kweidersweets.co.uk/")?img:"https://menu.kweidersweets.co.uk/"+img.replace(/^\.\//,"");
  if(!/^https:\/\/menu\.kweidersweets\.co\.uk\/[a-zA-Z0-9._%/-]+$/.test(image)||image.includes(".."))continue;
  rows.push({name,ar,price:Number(price[1]),unit:price[2]?Number(price[2])+" "+(/^pc/i.test(price[3])?"pc":price[3].toLowerCase()):"menu serving",image,file:image.split("/").pop(),sku:a["data-sku"]||"",offer:/offer/i.test(category)||/\boffer\b/i.test(name)});
 }
 if(!rows.length)throw Error("MENU_EMPTY");return rows;
}
function resolveCatalog(seed, rows){
 const c=JSON.parse(JSON.stringify(seed));let linked=0;
 for(const cat of c.categories)for(const tier of cat.tiers)for(const i of tier.choices){
   if(!i.menuRef)continue;
   const r=i.menuRef;
   const match=rows.filter(p=>r.sku?p.sku===r.sku:p.name===r.name&&p.file===r.file);
   const p=match.length===1?match[0]:null;
   if(!p||p.unit!==r.unit||(p.offer&&!i.allowMenuOffer)){
      i.menuUnavailable=true;
      delete i.menuLinked; i.menuReviewReason=!p?"REFERENCE_NOT_FOUND_OR_AMBIGUOUS":p.unit!==r.unit?"UNIT_CHANGED":"OFFER_NOT_APPROVED";
      continue;
   }
   Object.assign(i,{name:p.name,ar:p.ar,price:p.price,image:p.image,unit:p.unit,menuLinked:true,menuOffer:p.offer});delete i.menuUnavailable;delete i.menuReviewReason;linked++;
 }
 return {catalog:c,linked};
}
const MENU='https://menu.kweidersweets.co.uk/menu.html';
const PREFIX='/manager-console/integration/';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow'}});
async function limitedText(r,max){if(!r.ok)throw Error('SOURCE_UNAVAILABLE');const reader=r.body.getReader(),decoder=new TextDecoder();let out='',size=0;try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw Error('SOURCE_TOO_LARGE');out+=decoder.decode(value,{stream:true})}return out+decoder.decode()}finally{await reader.cancel().catch(()=>{})}}
async function snapshot(env,url){
 let seed;
 try{
  const asset=await env.ASSETS.fetch(new Request(new URL(PREFIX+'staging-seed.json',url)));
  if(!asset.ok)throw Error('SEED_HTTP_'+asset.status);
  seed=JSON.parse(await limitedText(asset,1500000));
  if(!Array.isArray(seed.categories)||!seed.categories.length)throw Error('SEED_INVALID');
 }catch(e){console.error('STAGING seed:',String(e.message));throw Error('SEED_UNAVAILABLE')}
 let rows=[],menuVerified=false,menuIssue=null;
 try{
  const source=await fetch(MENU,{redirect:'follow',headers:{'Accept':'text/html','Cache-Control':'no-cache'},signal:AbortSignal.timeout(10000)});
  if(source.url&&new URL(source.url).hostname!=='menu.kweidersweets.co.uk')throw Error('MENU_REDIRECT_UNEXPECTED');
  if(!source.ok)throw Error('MENU_HTTP_'+source.status);
  rows=parseMenu(await limitedText(source,3000000));
  if(rows.length<20)throw Error('MENU_INCOMPLETE');
  menuVerified=true;
 }catch(e){rows=[];menuIssue=/^MENU_(?:HTTP_\d{3}|EMPTY|INVALID|INCOMPLETE|REDIRECT_UNEXPECTED)$/.test(e.message)?e.message:'MENU_FETCH_FAILED';console.warn('STAGING Menu:',String(e.message))}
 const {catalog,linked}=resolveCatalog(seed,rows);
 const reviewCount=catalog.categories.reduce((n,c)=>n+c.tiers.reduce((m,t)=>m+t.choices.filter(i=>i.active&&i.menuUnavailable).length,0),0);
 if(menuVerified&&reviewCount)menuIssue='MENU_REFERENCE_REVIEW_REQUIRED';
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({catalog,menuVerified})));
 const version=Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
 return {version,menuVerified,menuIssue,reviewCount,linked,catalog};
}
export default {async fetch(req,env){
 const url=new URL(req.url);
 try{
  if(url.pathname==='/api/public-catalog'&&req.method==='GET')return json(await snapshot(env,url));
  if(url.pathname==='/api/staging-quote'&&req.method==='POST'){
   if(req.headers.get('Origin')!==url.origin||!req.headers.get('Content-Type')?.includes('application/json'))return json({error:'INVALID_ORIGIN_OR_FORMAT'},403);
   const body=await limitedText(new Response(req.body),20000);let request;try{request=JSON.parse(body)}catch{return json({error:'INVALID_JSON'},400)}
   const snap=await snapshot(env,url);
   if(!snap.menuVerified)return json({error:snap.menuIssue||'MENU_UNAVAILABLE'},503);
   try{return json(quote(snap,request))}catch(e){return json({error:e.code||'INVALID_QUOTE'},e.code==='PRICE_CHANGED'?409:400)}
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return json({error:'STAGING_READ_ONLY'},405);
  if(url.pathname==='/')return Response.redirect(new URL(PREFIX+'customer-preview.html',url),302);
  if(url.pathname===PREFIX+'customer-preview.html'||url.pathname===PREFIX+'customer-preview.mjs'||url.pathname==='/styles.css'||url.pathname==='/availability.js'||/^\/(images|media)\/[a-zA-Z0-9._%/-]+$/.test(url.pathname)){
   const r=await env.ASSETS.fetch(req);const headers=new Headers(r.headers);headers.set('X-Robots-Tag','noindex, nofollow');headers.set('Cache-Control','no-store');return new Response(r.body,{status:r.status,headers});
  }
  return json({error:'NOT_FOUND'},404);
 }catch(e){console.error('STAGING request:',String(e.message));return json({error:e.message==='SEED_UNAVAILABLE'?'SEED_UNAVAILABLE':'STAGING_CATALOG_UNAVAILABLE'},503)}
}};
