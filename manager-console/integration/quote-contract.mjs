// Staging only. No storage, network, authentication, or payment operations.
// snapshot MUST be server-resolved from an approved catalog and verified Menu response.
// version MUST be an authoritative fingerprint including resolved prices, active IDs and unit rules.
export function quote(snapshot, request) {
  const reject=(code)=>{throw Object.assign(new Error(code),{code})};
  const money=(n)=>{if(typeof n!=="number"||!Number.isFinite(n)||n<0||n>1000000||Math.abs(n*100-Math.round(n*100))>1e-6)reject("INVALID_PRICE");return Math.round(n*100)};
  const integer=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
  if(!snapshot||typeof snapshot.version!=="string"||!snapshot.version||!Array.isArray(snapshot.catalog?.categories))reject("CATALOG_UNAVAILABLE");
  if(request?.version!==snapshot.version)reject("PRICE_CHANGED");
  const c=snapshot.catalog.categories.find(c=>c.id===request.experience&&c.active===true);
  if(!c)reject("EXPERIENCE_UNAVAILABLE");
  const guests=request.guests;
  if(!integer(guests,40,85)||!integer(c.min,40,85)||!integer(c.max,c.min,85)||guests<c.min||guests>c.max)reject("GUEST_COUNT");
  const selections=request.selections??[];
  if(!Array.isArray(selections)||selections.length>100)reject("INVALID_SELECTIONS");
  const result={version:snapshot.version,experienceId:c.id,experience:c.name,guests,kind:c.kind,currency:"GBP",tierId:null,tier:null,duration:null,basePence:null,extraPence:null,timePence:null,totalPence:null,items:[],included:[]};
  if(c.kind==="quote"){
    if(selections.length||request.tier!=null||request.duration!=null)reject("INVALID_TAILORED_SELECTION");
    return result;
  }
  if(!integer(request.duration,1,24))reject("INVALID_DURATION");
  const duration=c.durations?.find(d=>d.hours===request.duration);
  if(!duration)reject("INVALID_DURATION");
  result.duration=duration.hours;
  if(c.kind==="fixed"){
    if(selections.length||request.tier!=null)reject("INVALID_FIXED_SELECTION");
    result.basePence=result.totalPence=money(duration.price);result.extraPence=result.timePence=0;return result;
  }
  if(c.kind!=="per-guest")reject("INVALID_EXPERIENCE_KIND");
  const t=c.tiers?.find(t=>t.id===request.tier&&t.active===true);
  if(!t)reject("PACKAGE_UNAVAILABLE");
  result.tierId=t.id;result.tier=t.name;result.included=String(t.included||"").split(/\r?\n/).filter(Boolean);
  result.basePence=money(t.price)*guests;result.timePence=money(duration.price);result.extraPence=0;
  let covered=0;const seen=new Set();
  for(const s of selections){
    if(!s||typeof s.id!=="string"||seen.has(s.id)||!integer(s.qty,1,200))reject("INVALID_SELECTION");
    seen.add(s.id);
    const i=t.choices?.find(i=>i.id===s.id&&i.active===true);
    if(!i)reject("ITEM_UNAVAILABLE");
    if(i.menuUnavailable||((i.menuRef||i.menuLinked)&&(!i.menuLinked||!snapshot.menuVerified)))reject("MENU_UNAVAILABLE");
    if(i.menuOffer&&!i.allowMenuOffer)reject("OFFER_NOT_APPROVED");
    let coverage=i.coveragePerUnit;
    if(coverage===undefined){
      if(t.coverage&&i.menuLinked&&i.unit!=="menu serving")reject("PORTION_REVIEW_REQUIRED");
      coverage=1;
    }
    if(!integer(coverage,1,85))reject("INVALID_PORTION");
    covered+=s.qty*coverage;
    const unitPence=money(i.price),linePence=unitPence*s.qty;result.extraPence+=linePence;
    result.items.push({id:i.id,name:i.name,ar:i.ar??"",qty:s.qty,unit:i.unit??"event serving",coveragePerUnit:coverage,unitPence,linePence,menuLinked:!!i.menuLinked});
  }
  if(t.coverage&&covered<guests)reject("GUEST_COVERAGE");
  result.totalPence=result.basePence+result.extraPence+result.timePence;
  return result;
}
