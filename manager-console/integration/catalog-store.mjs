// NOT ROUTED OR DEPLOYED. Principal must be verified server-side before use; never use client role or headers alone.
export function validateCatalog(c){
 const fail=(p)=>{throw Error("INVALID_CATALOG:"+p)};
 const obj=x=>x&&typeof x==="object"&&!Array.isArray(x);
 const fields=(x,allowed,p)=>{if(!obj(x)||Object.keys(x).some(k=>!allowed.includes(k)))fail(p)};
 const str=(v,p,max=20000)=>{if(typeof v!=="string"||v.length>max)fail(p)};
 const num=(v,p,a,b)=>{if(!Number.isInteger(v)||v<a||v>b)fail(p)};
 const price=(v,p)=>{if(typeof v!=="number"||!Number.isFinite(v)||v<0||v>100000||Math.abs(v*100-Math.round(v*100))>1e-6)fail(p)};
 const bool=(v,p)=>{if(typeof v!=="boolean")fail(p)};
 const id=(v,p)=>{if(typeof v!=="string"||!/^[-a-z0-9]{1,60}$/.test(v))fail(p)};
 const list=(v,p,max)=>{if(!Array.isArray(v)||v.length>max)fail(p)};
 const unique=(xs,p)=>{if(new Set(xs).size!==xs.length)fail(p)};
 const url=(v,p)=>{if(v===undefined||v==="")return;str(v,p,2000);if(!/^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(v)||/[\s"'<>\\]/.test(v))fail(p)};
 fields(c,["content","categories"],"root");
 fields(c.content,["title","titleAr","intro","introAr","heroImage","video","tableUrl","terms","termsAr","contactUrl"],"content");
 for(const [k,v] of Object.entries(c.content)){if(["heroImage","video","tableUrl","contactUrl"].includes(k))url(v,k);else str(v,k)}
 list(c.categories,"categories",40);if(!c.categories.some(x=>x?.active))fail("active categories");
 for(const x of c.categories){
  fields(x,["id","name","ar","description","descriptionAr","image","active","min","max","kind","durations","tiers","coffeeChoices"],"category");
  id(x.id,"category id");str(x.name,"category name",200);if(!x.name.trim())fail("category name");str(x.ar,"category ar",200);for(const k of ["description","descriptionAr"])if(x[k]!==undefined)str(x[k],k);url(x.image,"category image");bool(x.active,"category active");num(x.min,"min",40,85);num(x.max,"max",x.min,85);
  if(!["fixed","per-guest","quote"].includes(x.kind))fail("kind");
  list(x.durations,"durations",24);list(x.tiers,"tiers",20);list(x.coffeeChoices,"coffeeChoices",30);x.coffeeChoices.forEach(v=>str(v,"coffee",200));
  if(x.kind!=="quote"&&!x.durations.length)fail("durations required");
  if(x.kind!=="per-guest"&&x.tiers.length)fail("unexpected tiers");
  if(x.kind==="per-guest"&&x.active&&!x.tiers.some(t=>t?.active))fail("active tier required");
  for(const d of x.durations){fields(d,["hours","price"],"duration");num(d.hours,"hours",1,24);price(d.price,"duration price")}
  unique(x.durations.map(d=>d.hours),"duplicate duration");
  for(const t of x.tiers){
   fields(t,["id","name","ar","price","included","includedAr","description","descriptionAr","image","active","coverage","choices"],"tier");
   id(t.id,"tier id");str(t.name,"tier name",200);if(!t.name.trim())fail("tier name");str(t.ar,"tier ar",200);price(t.price,"tier price");bool(t.active,"tier active");bool(t.coverage,"coverage");for(const k of ["included","includedAr","description","descriptionAr"])if(t[k]!==undefined)str(t[k],k);url(t.image,"tier image");
   list(t.choices,"choices",200);if(x.active&&t.active&&t.coverage&&!t.choices.some(i=>i?.active))fail("coverage choices required");
   for(const i of t.choices){
    fields(i,["id","name","ar","price","image","active","menuRef","unit","coveragePerUnit","allowMenuOffer"],"choice");
    id(i.id,"choice id");str(i.name,"choice name",300);if(!i.name.trim())fail("choice name");str(i.ar,"choice ar",300);price(i.price,"choice reference price");bool(i.active,"choice active");url(i.image,"choice image");
    if(i.unit!==undefined)str(i.unit,"unit",100);
    if(i.coveragePerUnit!==undefined)num(i.coveragePerUnit,"coverage per unit",1,85);
    if(i.allowMenuOffer!==undefined)bool(i.allowMenuOffer,"allow offer");
    if(i.menuRef!==undefined){fields(i.menuRef,["name","file","sku","unit"],"menuRef");for(const k of ["name","file","sku","unit"])str(i.menuRef[k],"menu "+k,300);if(!i.menuRef.sku&&(!i.menuRef.name||!i.menuRef.file))fail("menu identity");if(!i.menuRef.unit)fail("menu unit");if(t.coverage&&i.active&&i.menuRef.unit!=="menu serving"&&i.coveragePerUnit===undefined)fail("portion approval required")}
   }
   unique(t.choices.map(i=>i.id),"duplicate choice");
  }
  unique(x.tiers.map(t=>t.id),"duplicate tier");
 }
 unique(c.categories.map(x=>x.id),"duplicate category");
 const json=JSON.stringify(c);if(json.length>180000)fail("catalog size");return json;
}
export function catalogStore(db){
 const currentSQL="SELECT revision,catalog_json,published_at,actor,restored_from FROM event_catalog_revisions ORDER BY revision DESC LIMIT 1";
 const insertSQL="INSERT INTO event_catalog_revisions(revision,catalog_json,published_at,actor,restored_from) SELECT ?,?,?,?,? WHERE COALESCE((SELECT MAX(revision) FROM event_catalog_revisions),0)=?";
 const unpack=r=>r?{revision:r.revision,catalog:JSON.parse(r.catalog_json),publishedAt:r.published_at,actor:r.actor,restoredFrom:r.restored_from}:null;
 const owner=p=>{if(p?.role!=="owner"||typeof p.id!=="string"||!p.id.trim()||p.id.length>200)throw Error("FORBIDDEN")};
 const expected=n=>{if(!Number.isSafeInteger(n)||n<1||n>=Number.MAX_SAFE_INTEGER)throw Error("INVALID_REVISION")};
 const write=async(n,json,actor,restored)=>{const out=await db.prepare(insertSQL).bind(n+1,json,new Date().toISOString(),actor,restored,n).run();if(!out.success)throw Error("DATABASE_WRITE_FAILED");return Number(out.meta?.changes)===1};
 return {
  async current(){return unpack(await db.prepare(currentSQL).first())},
  async initialize(seed){const json=validateCatalog(seed);await write(0,json,"system:initial-seed",null);return this.current()},
  async publish(p,n,c){owner(p);expected(n);const json=validateCatalog(c);if(!await write(n,json,p.id,null))throw Error("REVISION_CONFLICT");return {revision:n+1,catalog:c}},
  async history(p){owner(p);const out=await db.prepare("SELECT revision,published_at,actor,restored_from FROM event_catalog_revisions ORDER BY revision DESC LIMIT 100").all();return out.results},
  async restore(p,n,from){owner(p);expected(n);expected(from);const old=await db.prepare("SELECT catalog_json FROM event_catalog_revisions WHERE revision=?").bind(from).first();if(!old)throw Error("REVISION_NOT_FOUND");const c=JSON.parse(old.catalog_json);const json=validateCatalog(c);if(!await write(n,json,p.id,from))throw Error("REVISION_CONFLICT");return {revision:n+1,catalog:c,restoredFrom:from}}
 };
}
