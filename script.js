
const state = {
  guests: 40,
  packageId: "venue-only",
  tierId: null,
  duration: null,
  preferredDate: "",
  calendarView: null,
  quantities: {},
  coffeeChoice: "Cardamom Arabic Coffee",
  submittedRequestId: "",
  submittedSnapshot: null
};

const EVENTS_API_URL = "https://kweider-events-api.abdokweider1.workers.dev/event-request";
const VENUE_ONLY_RATES = {2:400,4:700,6:1000};
const EXTRA_TIME = {2:0,3:150,4:250};

const EXPERIENCE_META = {
  "venue-only": ["Venue Only","المكان فقط"],
  "breakfast": ["Damascene Breakfast","المكان + الفطور"],
  "lunch": ["Private Lunch","المكان + الغداء"],
  "dinner": ["Private Dinner","المكان + العشاء"],
  "sweets-coffee": ["Damascene Sweets & Coffee","حلويات دمشقية وقهوة"],
  "wedding": ["Wedding Hospitality","ضيافة حفلات الزفاف"],
  "special-events": ["Special Events","فعاليات خاصة"],
  "corporate-cultural": ["Corporate & Cultural Events","مؤسسات وفعاليات ثقافية"]
};

const BREAKFAST_MAINS = [
  {id:"olive-oil-foul", name:"Olive Oil Foul", ar:"فول بالزيت", price:7},
  {id:"yogurt-foul", name:"Yogurt Foul", ar:"فول باللبن", price:8},
  {id:"olive-oil-tesqiyeh", name:"Olive Oil Tesqiyeh", ar:"فتة بالزيت", price:7},
  {id:"ghee-nuts-fatteh", name:"Ghee & Nuts Fatteh", ar:"فتة بالسمنة والمكسرات", price:8}
];

const LUNCH_DINNER_MAINS = [
  {id:"ouzi", name:"1 Ouzi with Meat and Nuts", ar:"صرة أوزي باللحمة والمكسرات", price:6},
  {id:"chicken-freekeh", name:"Chicken Freekeh", ar:"فريكة بالدجاج", price:7},
  {id:"meat-maqluba", name:"Meat Maqluba", ar:"مقلوبة باللحم", price:7}
];

const SWEET_CHOICES = [
  {id:"cheese-kunafa", name:"Cheese Kunafa", ar:"كنافة بالجبن", price:7},
  {id:"halawet-el-jibn", name:"Cream Halawet El Jibn", ar:"حلاوة بالجبن", price:7},
  {id:"madlouka", name:"Cream Madlouka", ar:"مدلوقة", price:8},
  {id:"chocolate-kunafa", name:"Chocolate Kunafa", ar:"كنافة بالشوكولا", price:5},
  {id:"cream-baklava", name:"Cream Baklava", ar:"بقلاوة بالقشطة", price:4}
];

const WEDDING_DESSERTS = {
  classic: [
    {id:"muhallaya", name:"Muhallaya", ar:"مهلبية", price:3.5},
    {id:"arabic-icecream", name:"Arabic Ice Cream — 2 slices", ar:"بوظة عربية — شريحتان", price:7},
    {id:"cassata", name:"Cassata — 2 slices", ar:"كاسيتا — شريحتان", price:6}
  ],
  super: [
    {id:"muhallaya", name:"Muhallaya", ar:"مهلبية", price:3.5},
    {id:"arabic-icecream", name:"Arabic Ice Cream — 2 slices", ar:"بوظة عربية — شريحتان", price:7},
    {id:"cassata", name:"Cassata — 2 slices", ar:"كاسيتا — شريحتان", price:6}
  ],
  luxury: [
    {id:"muhallaya-nuts", name:"Muhallaya with Nuts", ar:"مهلبية بالمكسرات", price:5},
    {id:"arabic-icecream-rose", name:"Arabic Ice Cream with Rose & Nuts — 2 slices", ar:"بوظة عربية مع ورد ومكسرات — شريحتان", price:9},
    {id:"cassata-rose", name:"Cassata with Rose & Nuts — 2 slices", ar:"كاسيتا مع ورد ومكسرات — شريحتان", price:7}
  ]
};

const WEDDING_DINNER_EXTRAS = [
  {id:"cream-baklava-2", name:"Cream Baklava — 2 pieces", ar:"بقلاوة بالقشطة — قطعتان", price:2},
  {id:"cream-mabrouma-2", name:"Cream Mabrouma — 2 pieces", ar:"مبرومة بالقشطة — قطعتان", price:3},
  {id:"sugared-almond-pouch", name:"Sugared Almond Pouch", ar:"صرة ملبس", price:1.5}
];

const PACKAGES = {
  breakfast: {
    title:"Damascene Breakfast", ar:"فطور دمشقي",
    tiers:{
      classic:{
        name:"Classic", price:4.99,
        included:["Bread","Pickles","Water","Classic Black Tea"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"breakfast-main", items:"breakfast"}
      },
      super:{
        name:"Super", price:7.99,
        included:["Tahini Musabaha","Olive Oil Labneh","Olives","Jam","Butter","Pickles","Water","Bread","Classic Black Tea"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"breakfast-main", items:"breakfast"}
      },
      luxury:{
        name:"Luxury", price:13.99,
        included:["Tahini Musabaha","Olive Oil Labneh","Authentic White Cheese","Olives","Walnut Makdous","Zaatar","Jam","Tahini Halawa","Butter","Pickles","Water","Bread","Classic Black Tea"],
        note:"Sharing style for every 2 guests",
        requirement:{type:"coverage", group:"breakfast-main", items:"breakfast"}
      }
    }
  },

  lunch:{
    title:"Private Lunch", ar:"غداء خاص",
    tiers:{
      classic:{
        name:"Classic", price:9.99,
        included:["Moutabal","1 Meat Kibbeh","Plain Yogurt","Bread","Water"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"lunch-main", items:"meal-main"}
      },
      super:{
        name:"Super", price:17.99,
        included:["Moutabal","Hummus","Cheese Burek","1 Meat Kibbeh","Plain Yogurt","Bread","Classic Black Tea","Water"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"lunch-main", items:"meal-main"}
      },
      luxury:{
        name:"Luxury", price:25.99,
        included:["Moutabal","Hummus","1 Cheese Burek + 1 Meat Burek","1 Meat Kibbeh","Fattoush","Cucumber Yogurt","Bread","Classic Black Tea","Water","Bitter Arabic Coffee"],
        note:"Premium individual setting",
        requirement:{type:"coverage", group:"lunch-main", items:"meal-main"}
      }
    }
  },

  dinner:{
    title:"Private Dinner", ar:"عشاء خاص",
    tiers:{
      classic:{
        name:"Classic", price:9.99,
        included:["Moutabal","1 Meat Kibbeh","Plain Yogurt","Bread","Water"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"dinner-main", items:"meal-main"}
      },
      super:{
        name:"Super", price:17.99,
        included:["Moutabal","Hummus","Cheese Burek","1 Meat Kibbeh","Plain Yogurt","Bread","Classic Black Tea","Water"],
        note:"Individual setting",
        requirement:{type:"coverage", group:"dinner-main", items:"meal-main"}
      },
      luxury:{
        name:"Luxury", price:25.99,
        included:["Moutabal","Hummus","1 Cheese Burek + 1 Meat Burek","1 Meat Kibbeh","Fattoush","Cucumber Yogurt","Bread","Classic Black Tea","Water","Bitter Arabic Coffee"],
        note:"Premium individual setting",
        requirement:{type:"coverage", group:"dinner-main", items:"meal-main"}
      }
    }
  },

  "sweets-coffee":{
    title:"Damascene Sweets & Coffee", ar:"حلويات دمشقية وقهوة",
    tiers:{
      classic:{
        name:"Classic", price:4.99,
        included:["Arabic Coffee or Espresso","Water"],
        note:"Refined Damascene hospitality",
        requirement:{type:"coverage", group:"sweets-main", items:"sweets"}
      },
      super:{
        name:"Super", price:9.99,
        included:["Arabic Coffee or Espresso","Juice","Water"],
        note:"Fuller hospitality",
        requirement:{type:"coverage", group:"sweets-main", items:"sweets"}
      },
      luxury:{
        name:"Luxury", price:12.99,
        included:["Mixed Salted Nuts on the table","Arabic Coffee or Espresso","Juice","Water"],
        note:"Premium hospitality",
        requirement:{type:"coverage", group:"sweets-main", items:"sweets"}
      }
    }
  },

  wedding:{
    title:"Wedding Hospitality", ar:"ضيافة حفلات الزفاف",
    tiers:{
      classic:{
        name:"Classic", price:12,
        included:["1 Petit Four piece","Orange / Pineapple / Mango juice","Water"],
        note:"Classic wedding hospitality",
        requirement:{type:"coverage", group:"wedding-dessert", items:"wedding-dessert"}
      },
      super:{
        name:"Super", price:16,
        included:["1 Petit Four piece","Orange / Pineapple / Mango juice","1 Chocolate piece","Bitter Arabic Coffee"],
        note:"Enhanced wedding hospitality",
        requirement:{type:"coverage", group:"wedding-dessert", items:"wedding-dessert"}
      },
      luxury:{
        name:"Luxury", price:19.99,
        included:["2 Petit Four pieces","Orange / Pineapple / Mango juice","1 Chocolate piece","Mixed Salted Nuts on the table","Sugared Almonds","Bitter Arabic Coffee"],
        note:"Luxury wedding hospitality",
        requirement:{type:"coverage", group:"wedding-dessert", items:"wedding-dessert"}
      },
      dinner:{
        name:"Wedding Dinner", price:29.99,
        included:["Traditional Rice with Bone-In Meat","Plain Yogurt","Tomato Sauce","Water","Cola","Bitter Arabic Coffee Service"],
        note:"Complete wedding dinner",
        requirement:{type:"optional", group:"wedding-dinner-extra", items:"wedding-dinner-extra"}
      }
    }
  }
};

function money(value){
  const n=Number(value)||0;
  const decimals=Math.abs(n-Math.round(n))>.0001?2:0;
  return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",minimumFractionDigits:decimals,maximumFractionDigits:2}).format(n);
}
function toLatinDigits(value){
  const map={"٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"};
  return String(value??"").replace(/[٠-٩۰-۹]/g,d=>map[d]||d);
}
function cleanQty(value){
  const n=Number(toLatinDigits(value).replace(/[^0-9]/g,""));
  return Math.max(0,Math.min(999,Number.isFinite(n)?n:0));
}
function clampGuests(value){
  const n=Number(toLatinDigits(value).replace(/[^0-9]/g,""));
  return Math.min(85,Math.max(1,Number.isFinite(n)?n:1));
}
function privateEligible(){return state.guests>=40;}
function isTailored(){return ["special-events","corporate-cultural"].includes(state.packageId);}
function isHospitality(){return state.packageId!=="venue-only"&&!isTailored();}
function experienceMeta(){return EXPERIENCE_META[state.packageId]||["Private Event","مناسبة خاصة"];}
function selectedTier(){
  const def=PACKAGES[state.packageId];
  return def&&state.tierId?def.tiers[state.tierId]:null;
}
function quantityKey(group,id){return `${group}::${id}`;}
function qty(group,id){return Number(state.quantities[quantityKey(group,id)]||0);}
function setQty(group,id,value){
  const n=cleanQty(value);
  const key=quantityKey(group,id);
  if(n>0)state.quantities[key]=n;
  else delete state.quantities[key];
}
function resetChoices(){
  state.quantities={};
  state.coffeeChoice="Cardamom Arabic Coffee";
}
function venueOnlyRate(){return state.duration?VENUE_ONLY_RATES[state.duration]||0:0;}
function extraTimeFee(){return isHospitality()?(EXTRA_TIME[state.duration]||0):0;}

function itemsForRequirement(req){
  if(!req)return [];
  if(req.items==="breakfast")return BREAKFAST_MAINS;
  if(req.items==="meal-main")return LUNCH_DINNER_MAINS;
  if(req.items==="sweets")return SWEET_CHOICES;
  if(req.items==="wedding-dessert")return WEDDING_DESSERTS[state.tierId]||[];
  if(req.items==="wedding-dinner-extra")return WEDDING_DINNER_EXTRAS;
  return [];
}
function assignedForRequirement(){
  const tier=selectedTier();
  const req=tier?.requirement;
  if(!req||req.type!=="coverage")return 0;
  return itemsForRequirement(req).reduce((sum,item)=>sum+qty(req.group,item.id),0);
}
function coverageReady(){
  const tier=selectedTier();
  const req=tier?.requirement;
  if(!req||req.type!=="coverage")return true;
  return assignedForRequirement()>=state.guests;
}
function selectionExtraTotal(){
  const tier=selectedTier();
  const req=tier?.requirement;
  if(!req)return 0;
  return itemsForRequirement(req).reduce((sum,item)=>sum+qty(req.group,item.id)*item.price,0);
}
function hospitalityBaseTotal(){
  const tier=selectedTier();
  return tier?tier.price*state.guests:0;
}
function hospitalitySubtotal(){return hospitalityBaseTotal()+selectionExtraTotal();}

function updateDurationOptions(){
  const intro=document.getElementById("durationIntro");
  const note=document.getElementById("durationNote");
  const badge=document.getElementById("recommendedDuration");
  const buttons=[...document.querySelectorAll(".duration-btn")];
  if(!buttons.length)return;

  if(isTailored()){
    document.getElementById("durationPanel").hidden=true;
    return;
  }

  document.getElementById("durationPanel").hidden=false;

  const config=state.packageId==="venue-only"
    ? [
        {hours:2,sub:money(400)},
        {hours:4,sub:money(700)},
        {hours:6,sub:money(1000)}
      ]
    : [
        {hours:2,sub:"Included"},
        {hours:3,sub:"+ £150"},
        {hours:4,sub:"+ £250"}
      ];

  const validHours=config.map(item=>item.hours);
  if(state.duration!==null&&!validHours.includes(state.duration))state.duration=null;

  if(state.packageId==="venue-only"){
    intro.textContent="Choose how long you need the full first-floor venue.";
    note.textContent="Venue Only: 2 hours £400 · 4 hours £700 · 6 hours £1,000.";
  }else{
    intro.textContent="The first 2 hours are included. Choose the duration yourself; extra time is added only if selected.";
    note.textContent="2 hours included · 3 hours +£150 · 4 hours +£250 · Longer events are arranged with management.";
  }

  badge.textContent=state.duration?`${state.duration}h selected`:"Choose duration";
  badge.classList.toggle("is-complete",Boolean(state.duration));

  buttons.forEach((btn,i)=>{
    const c=config[i];
    const selected=state.duration===c.hours;
    btn.dataset.hours=c.hours;
    btn.querySelector("strong").textContent=c.hours;
    btn.querySelector("span").textContent="hours";
    btn.querySelector("small").textContent=c.sub;
    btn.classList.toggle("is-selected",selected);
    btn.classList.remove("is-recommended");
    btn.setAttribute("aria-pressed",selected?"true":"false");
  });
}

function tierButtonsHtml(def){
  const entries=Object.entries(def.tiers);
  return `
    <div class="tier-switch ${entries.length===4?"four":""}" role="tablist" aria-label="${def.title} package level">
      ${entries.map(([id,tier])=>`
        <button type="button" class="tier-tab ${state.tierId===id?"is-selected":""}" data-tier="${id}">
          <span>${tier.name}</span>
          <strong>${money(tier.price)} <small>pp</small></strong>
          ${id==="super"?'<em>Most Popular</em>':""}
        </button>`).join("")}
    </div>`;
}
function includedHtml(tier){
  return `
    <div class="package-detail-card">
      <div class="package-detail-head">
        <div>
          <span class="detail-kicker">YOUR PACKAGE</span>
          <h4>${tier.name} · ${money(tier.price)} per guest</h4>
          <p>${tier.note||""}</p>
        </div>
        <div class="base-total">
          <small>Base for ${state.guests} guests</small>
          <strong>${money(tier.price*state.guests)}</strong>
        </div>
      </div>
      <div class="included-chips">${tier.included.map(x=>`<span>✓ ${x}</span>`).join("")}</div>
    </div>`;
}

function renderQuantityChoices(items,group,{required=false,title="Choose items",subtitle=""}={}){
  const assigned=items.reduce((s,item)=>s+qty(group,item.id),0);
  const target=state.guests;
  const remaining=Math.max(0,target-assigned);
  const extra=Math.max(0,assigned-target);
  const meterText=assigned>=target
    ? (extra>0?`${target} guests covered ✓ · ${extra} extra portions`:`${target} / ${target} guests covered ✓`)
    : `${remaining} more required`;

  return `
    <div class="choice-block ${required&&assigned<target?"needs-attention":""}">
      <div class="choice-block-head">
        <div>
          <span class="detail-kicker">${required?"REQUIRED":"OPTIONAL"}</span>
          <h4>${title}</h4>
          <p>${subtitle}</p>
        </div>
        ${required?`<div class="assignment-meter ${assigned>=target?"is-complete":""}">
          <strong>${assigned} / ${target}</strong>
          <span>${meterText}</span>
        </div>`:""}
      </div>

      <div class="choice-grid">
        ${items.map(item=>`
          <article class="choice-item ${qty(group,item.id)>0?"is-active":""}">
            <div class="choice-copy">
              <strong>${item.name}</strong>
              <small>${item.ar}</small>
              <span>${money(item.price)} each</span>
            </div>
            <div class="mini-qty">
              <button type="button" data-qty-dec="${group}|${item.id}" aria-label="Decrease ${item.name}">−</button>
              <input
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                lang="en"
                dir="ltr"
                autocomplete="off"
                data-qty-input="${group}|${item.id}"
                value="${qty(group,item.id)}"
                aria-label="${item.name} quantity">
              <button type="button" data-qty-inc="${group}|${item.id}" aria-label="Increase ${item.name}">+</button>
            </div>
          </article>`).join("")}
      </div>

      ${required&&assigned<target?`
        <div class="required-note">
          <strong>${remaining} more selections required.</strong>
          Please complete the main hospitality selection for all ${target} guests before continuing.
          <span>يرجى استكمال اختيار الضيافة بما يتناسب مع عدد الضيوف قبل المتابعة.</span>
        </div>`:""}
    </div>`;
}

function renderCoffeeChoices(){
  return `
    <div class="choice-block compact-choice">
      <div class="choice-block-head"><div><span class="detail-kicker">INCLUDED CHOICE</span><h4>Coffee service</h4></div></div>
      <div class="simple-choice-row">
        ${["Cardamom Arabic Coffee","Roasted Espresso"].map(x=>`
          <button type="button" data-coffee="${x}" class="${state.coffeeChoice===x?"is-selected":""}">${x}</button>`).join("")}
      </div>
    </div>`;
}

function renderTierExperience(){
  const def=PACKAGES[state.packageId];
  const content=document.getElementById("selectionContent");
  document.getElementById("selectionTitle").textContent=def.title;
  document.getElementById("selectionIntro").textContent="Choose Classic, Super or Luxury first. The detailed selection opens only after your package is chosen.";

  let html=tierButtonsHtml(def);

  if(!state.tierId){
    html+=`<div class="tier-empty-state">Select a package level to see what is included and complete the required guest selections.</div>`;
    content.innerHTML=html;
  } else {
    const tier=selectedTier();
    html+=includedHtml(tier);
    const req=tier.requirement;
    if(state.packageId==="breakfast"){
      html+=renderQuantityChoices(BREAKFAST_MAINS,req.group,{
        required:true,
        title:"Choose the main dish for your guests",
        subtitle:"Enter quantities directly or use + / −. The total must cover at least the full guest count."
      });
    }
    if(state.packageId==="lunch"||state.packageId==="dinner"){
      html+=renderQuantityChoices(LUNCH_DINNER_MAINS,req.group,{
        required:true,
        title:"Choose the main dishes for your guests",
        subtitle:"You may split the guest count between Ouzi, Chicken Freekeh and Meat Maqluba. The total must cover every guest."
      });
    }
    if(state.packageId==="sweets-coffee"){
      html+=renderCoffeeChoices();
      html+=renderQuantityChoices(SWEET_CHOICES,req.group,{
        required:true,
        title:"Choose Damascene sweets for your guests",
        subtitle:"Select quantities so the total covers at least the full guest count."
      });
    }
    if(state.packageId==="wedding"&&state.tierId!=="dinner"){
      const list=WEDDING_DESSERTS[state.tierId]||[];
      html+=renderQuantityChoices(list,req.group,{
        required:true,
        title:"Choose wedding hospitality desserts",
        subtitle:"You can mix the dessert types. The total quantity must cover at least every guest."
      });
      html+=`<div class="event-pricing-note">Private-event selections are specially curated and priced for group hospitality and presentation.</div>`;
    }
    if(state.packageId==="wedding"&&state.tierId==="dinner"){
      html+=renderQuantityChoices(WEDDING_DINNER_EXTRAS,req.group,{
        required:false,
        title:"Optional wedding dinner extras",
        subtitle:"These extras are optional because the complete dinner is already included in the £29.99 per guest package."
      });
      html+=`<div class="event-pricing-note">Private-event selections are specially curated and priced for group hospitality and presentation.</div>`;
    }
    content.innerHTML=html;
  }

  bindSelectionControls();
}

function bindSelectionControls(){
  const content=document.getElementById("selectionContent");

  content.querySelectorAll("[data-tier]").forEach(btn=>{
    btn.onclick=()=>{
      state.tierId=btn.dataset.tier;
      resetChoices();
      renderSelection();
      updateSummary();
    };
  });

  content.querySelectorAll("[data-qty-inc]").forEach(btn=>{
    btn.onclick=()=>{
      const [group,id]=btn.dataset.qtyInc.split("|");
      setQty(group,id,qty(group,id)+1);
      renderSelection();
      updateSummary();
    };
  });

  content.querySelectorAll("[data-qty-dec]").forEach(btn=>{
    btn.onclick=()=>{
      const [group,id]=btn.dataset.qtyDec.split("|");
      setQty(group,id,qty(group,id)-1);
      renderSelection();
      updateSummary();
    };
  });

  content.querySelectorAll("[data-qty-input]").forEach(input=>{
    input.onfocus=()=>input.select();
    input.oninput=e=>{
      const clean=toLatinDigits(e.target.value).replace(/[^0-9]/g,"");
      e.target.value=clean;
    };
    input.onchange=e=>{
      const [group,id]=e.target.dataset.qtyInput.split("|");
      setQty(group,id,e.target.value);
      renderSelection();
      updateSummary();
    };
    input.onblur=e=>{
      const [group,id]=e.target.dataset.qtyInput.split("|");
      setQty(group,id,e.target.value);
      renderSelection();
      updateSummary();
    };
    input.onkeydown=e=>{
      if(e.key==="Enter"){
        e.preventDefault();
        e.target.blur();
      }
    };
  });

  content.querySelectorAll("[data-coffee]").forEach(btn=>{
    btn.onclick=()=>{
      state.coffeeChoice=btn.dataset.coffee;
      renderSelection();
      updateSummary();
    };
  });
}

function renderSelection(){
  const content=document.getElementById("selectionContent");

  if(!privateEligible()){
    document.getElementById("selectionTitle").textContent="Private hire starts from 40 guests";
    document.getElementById("selectionIntro").textContent="For smaller parties, please use table booking.";
    content.innerHTML=`<div class="empty-selection"><strong>Table booking recommended.</strong><br>للمجموعات الأقل من 40 ضيفاً نوصي بحجز الطاولات.</div>`;
    document.getElementById("durationPanel").hidden=true;
    syncSubmitState();
    return;
  }

  if(state.packageId==="venue-only"){
    document.getElementById("durationPanel").hidden=false;
    updateDurationOptions();
    document.getElementById("selectionTitle").textContent="Venue Only";
    document.getElementById("selectionIntro").textContent="Choose the venue duration first.";
    content.innerHTML=`
      <div class="policy-box">
        <div><strong>Private first-floor hire</strong><span>Full venue for 40–85 guests.</span></div>
        <small>${state.duration?`${state.duration} hours<br>${money(venueOnlyRate())}`:"Duration not selected"}</small>
      </div>`;
    syncSubmitState();
    return;
  }

  if(isTailored()){
    document.getElementById("durationPanel").hidden=true;
    const [name,ar]=experienceMeta();
    document.getElementById("selectionTitle").textContent=name;
    document.getElementById("selectionIntro").textContent="This experience is tailored with our management team.";
    content.innerHTML=`
      <div class="special-request-box">
        <h4>${name}</h4>
        <p>${state.packageId==="corporate-cultural"
          ?"Meetings, workshops, talks, poetry evenings and cultural gatherings can be shaped around your group."
          :"Tell us about the occasion, preferred setup and hospitality requirements."}</p>
        <small>${ar}</small>
        <button type="button" data-scroll-contact>Continue to your details</button>
      </div>`;
    content.querySelector("[data-scroll-contact]").onclick=()=>document.querySelector("#contact").scrollIntoView({behavior:"smooth"});
    syncSubmitState();
    return;
  }

  document.getElementById("durationPanel").hidden=false;
  updateDurationOptions();
  renderTierExperience();
  syncSubmitState();
}

function renderSummaryLines(){
  const lines=document.getElementById("summaryLines");
  lines.innerHTML="";

  if(!privateEligible()){
    lines.innerHTML=`<div class="summary-empty">Table booking recommended for fewer than 40 guests.</div>`;
    return;
  }
  if(state.packageId==="venue-only"){
    lines.innerHTML=state.duration?`<div class="summary-line"><span>Venue hire · ${state.duration} hours</span><strong>${money(venueOnlyRate())}</strong></div>`:`<div class="summary-empty">Choose your booking duration.</div>`;
    return;
  }
  if(isTailored()){
    lines.innerHTML=`<div class="summary-empty">Tailored event — final details and pricing are confirmed by management.</div>`;
    return;
  }

  const tier=selectedTier();
  if(!tier){
    lines.innerHTML=`<div class="summary-empty">Choose a package level first.</div>`;
    return;
  }

  lines.innerHTML=`<div class="summary-line"><span>${tier.name} base × ${state.guests}</span><strong>${money(hospitalityBaseTotal())}</strong></div>`;

  const req=tier.requirement;
  const items=itemsForRequirement(req);

  if(req){
    items.filter(item=>qty(req.group,item.id)>0).forEach(item=>{
      const q=qty(req.group,item.id);
      lines.innerHTML+=`<div class="summary-line"><span>${item.name} × ${q}</span><strong>${money(q*item.price)}</strong></div>`;
    });

    if(req.type==="coverage"){
      const assigned=assignedForRequirement();
      lines.innerHTML+=`<div class="summary-line coverage-summary ${assigned>=state.guests?"is-complete":""}">
        <span>Guest selections covered</span><strong>${assigned} / ${state.guests}</strong>
      </div>`;
    }
  }

  if(state.packageId==="sweets-coffee"){
    lines.innerHTML+=`<div class="summary-line"><span>${state.coffeeChoice}</span><strong>Included</strong></div>`;
  }
}

function updateGuestEligibility(){
  const notice=document.getElementById("tableBookingNotice");
  const panel=document.getElementById("packagePanel");
  const eligible=privateEligible();
  const shouldShowNotice=state.guests<40;
  notice.hidden=!shouldShowNotice;
  notice.setAttribute("aria-hidden",shouldShowNotice?"false":"true");
  panel.classList.toggle("is-ineligible",shouldShowNotice);
  if(shouldShowNotice)document.getElementById("durationPanel").hidden=true;
}

function bookingReady(){
  if(!privateEligible())return false;
  if(isTailored())return true;
  if(!state.duration)return false;
  if(state.packageId==="venue-only")return true;
  if(!state.tierId)return false;
  return coverageReady();
}
function syncSubmitState(){
  const btn=document.getElementById("submitRequest");
  if(!btn)return;
  if(state.submittedRequestId){
    btn.disabled=true;
    btn.classList.add("is-disabled");
    btn.textContent="Request Received ✓";
    return;
  }
  const ready=bookingReady();
  btn.disabled=!ready;
  btn.classList.toggle("is-disabled",!ready);

  const tier=selectedTier();
  if(!privateEligible()){
    btn.textContent="Book a Table for Smaller Groups";
  } else if(!isTailored()&&!state.duration){
    btn.textContent="Choose Your Duration";
  } else if(state.packageId==="venue-only"||isTailored()){
    btn.textContent="Send Booking Request";
  } else if(!tier){
    btn.textContent="Choose a Package First";
  } else if(!coverageReady()){
    const remaining=Math.max(0,state.guests-assignedForRequirement());
    btn.textContent=`Complete ${remaining} Guest Selection${remaining===1?"":"s"}`;
  } else {
    btn.textContent="Send Booking Request";
  }
}

function updateSummary(){
  state.guests=clampGuests(document.getElementById("guestCount").value);
  document.getElementById("guestCount").value=state.guests;
  updateGuestEligibility();

  const [name,nameAr]=experienceMeta();
  const tier=selectedTier();

  document.querySelectorAll("[data-guests]").forEach(btn=>{
    btn.classList.toggle("is-active",Number(btn.dataset.guests)===state.guests);
  });
  document.getElementById("sumGuests").textContent=state.guests;
  document.getElementById("sumPackage").textContent=tier?`${name} · ${tier.name}`:name;
  document.getElementById("sumPackageAr").textContent=nameAr;

  const durationBlock=document.getElementById("sumDurationBlock");
  durationBlock.hidden=!privateEligible()||isTailored();
  document.getElementById("sumDuration").textContent=state.duration?`${state.duration} hrs`:"Not selected";

  renderSummaryLines();

  const hospitality=hospitalitySubtotal();
  const extra=extraTimeFee();

  document.getElementById("sumHospitality").textContent=
    state.packageId==="venue-only"?money(0):(isTailored()?"—":money(hospitality));

  const extraRow=document.getElementById("extraTimeRow");
  extraRow.hidden=state.packageId==="venue-only"||isTailored()||!privateEligible();
  document.getElementById("sumExtraTime").textContent=extra===0?"Included":money(extra);

  const venueFeeRow=document.getElementById("venueFeeRow");
  venueFeeRow.hidden=state.packageId!=="venue-only";
  if(state.packageId==="venue-only")venueFeeRow.querySelector("strong").textContent=state.duration?money(venueOnlyRate()):"—";

  let total;
  if(!privateEligible())total="Table booking recommended";
  else if(state.packageId==="venue-only")total=state.duration?money(venueOnlyRate()):"Choose duration";
  else if(isTailored())total="Tailored quote";
  else if(!tier)total="Choose a package";
  else total=money(hospitality+extra);

  document.getElementById("sumTotal").textContent=total;
  document.getElementById("mobileGuests").textContent=`${state.guests} guests`;
  document.getElementById("mobileTotal").textContent=total;

  const mobile=document.getElementById("mobileSummaryContent");
  const clone=document.getElementById("summaryCard").cloneNode(true);
  clone.removeAttribute("id");
  clone.classList.remove("reveal");
  clone.classList.add("drawer-summary-card","is-visible");
  clone.style.opacity="1";
  clone.style.transform="none";
  clone.querySelectorAll("[id]").forEach(el=>el.removeAttribute("id"));
  mobile.replaceChildren(clone);

  syncSubmitState();
}

function setPackage(id){
  if(!privateEligible())return;
  state.packageId=id;
  state.tierId=null;
  resetChoices();

  state.duration=null;

  document.querySelectorAll(".package-card").forEach(card=>card.classList.toggle("is-selected",card.dataset.package===id));
  updateDurationOptions();
  renderSelection();
  updateSummary();

  const target=document.getElementById("selectionPanel");
  target.scrollIntoView({behavior:"smooth",block:"start"});
}

// ----- Availability / calendar -----
function isDateUnavailable(dateStr){
  const cfg=window.KWEIDER_AVAILABILITY||{};
  if(!dateStr)return false;
  if((cfg.disabledDates||[]).includes(dateStr))return true;
  const d=new Date(dateStr+"T12:00:00");
  if((cfg.disabledWeekdays||[]).includes(d.getDay()))return true;
  return (cfg.disabledDateRanges||[]).some(r=>dateStr>=r.from&&dateStr<=r.to);
}
function buildRequestedDate(){return state.preferredDate||"";}
function parseISODate(dateStr){
  if(!dateStr)return null;
  const [y,m,d]=dateStr.split("-").map(Number);
  return new Date(y,m-1,d,12,0,0,0);
}
function isoDate(y,m,d){return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function monthStart(date){return new Date(date.getFullYear(),date.getMonth(),1,12);}
function addMonths(date,count){return new Date(date.getFullYear(),date.getMonth()+count,1,12);}
function sameMonth(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth();}
function formatLongDate(dateStr){
  const d=parseISODate(dateStr);
  return d?new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"numeric",month:"long",year:"numeric"}).format(d):"";
}
function setCalendarOpen(open){
  const pop=document.getElementById("calendarPopover");
  const trigger=document.getElementById("calendarTrigger");
  if(!pop||!trigger)return;
  pop.hidden=!open;
  trigger.setAttribute("aria-expanded",open?"true":"false");
  if(open)renderCalendar();
}
function renderCalendar(){
  const label=document.getElementById("calendarMonthLabel");
  const daysWrap=document.getElementById("calendarDays");
  const prev=document.getElementById("calendarPrev");
  const next=document.getElementById("calendarNext");
  if(!label||!daysWrap)return;

  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  const minMonth=monthStart(today);
  const maxMonth=addMonths(minMonth,24);

  if(!state.calendarView)state.calendarView=state.preferredDate?monthStart(parseISODate(state.preferredDate)):minMonth;
  if(state.calendarView<minMonth)state.calendarView=minMonth;
  if(state.calendarView>maxMonth)state.calendarView=maxMonth;

  label.textContent=new Intl.DateTimeFormat("en-GB",{month:"long",year:"numeric"}).format(state.calendarView);
  prev.disabled=sameMonth(state.calendarView,minMonth);
  next.disabled=sameMonth(state.calendarView,maxMonth);

  const y=state.calendarView.getFullYear();
  const m=state.calendarView.getMonth()+1;
  const first=new Date(y,m-1,1,12);
  const offset=(first.getDay()+6)%7;
  const daysInMonth=new Date(y,m,0,12).getDate();
  daysWrap.innerHTML="";

  for(let i=0;i<offset;i++){
    const blank=document.createElement("span");
    blank.className="calendar-blank";
    daysWrap.appendChild(blank);
  }

  for(let d=1;d<=daysInMonth;d++){
    const iso=isoDate(y,m,d);
    const date=parseISODate(iso);
    const blocked=isDateUnavailable(iso);
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="calendar-day";
    btn.textContent=String(d);
    btn.disabled=date<today||blocked;
    if(iso===state.preferredDate)btn.classList.add("is-selected");
    if(date.getTime()===today.getTime())btn.classList.add("is-today");
    if(blocked)btn.classList.add("is-unavailable");
    btn.onclick=()=>{
      state.preferredDate=iso;
      document.getElementById("calendarTriggerText").textContent=formatLongDate(iso);
      document.getElementById("calendarSelectedText").textContent=`Selected: ${formatLongDate(iso)}`;
      validateAvailability();
      setCalendarOpen(false);
    };
    daysWrap.appendChild(btn);
  }
}
function initCalendar(){
  const trigger=document.getElementById("calendarTrigger");
  const pop=document.getElementById("calendarPopover");
  const prev=document.getElementById("calendarPrev");
  const next=document.getElementById("calendarNext");
  const clear=document.getElementById("calendarClear");
  if(!trigger||!pop)return;

  state.calendarView=monthStart(new Date());

  trigger.onclick=e=>{e.stopPropagation();setCalendarOpen(pop.hidden);};
  pop.onclick=e=>e.stopPropagation();
  prev.onclick=()=>{state.calendarView=addMonths(state.calendarView,-1);renderCalendar();};
  next.onclick=()=>{state.calendarView=addMonths(state.calendarView,1);renderCalendar();};
  clear.onclick=()=>{
    state.preferredDate="";
    document.getElementById("calendarTriggerText").textContent="Choose a date";
    document.getElementById("calendarSelectedText").textContent="No date selected";
    document.getElementById("availabilityMessage").textContent="";
    renderCalendar();
  };
  document.addEventListener("click",()=>setCalendarOpen(false));
  renderCalendar();
}
function validateAvailability(){
  const date=buildRequestedDate();
  const time=document.getElementById("eventTime").value;
  const msg=document.getElementById("availabilityMessage");
  if(!date){msg.textContent="";return true;}
  if(isDateUnavailable(date)){msg.textContent="This date is currently unavailable.";return false;}
  const blocked=(window.KWEIDER_AVAILABILITY?.disabledTimesByDate||{})[date]||[];
  if(time&&blocked.includes(time)){msg.textContent="This time is currently unavailable on your selected date.";return false;}
  msg.textContent="Preferred date/time noted. Final availability is confirmed by the Kweider team.";
  return true;
}

function toast(text){
  const t=document.getElementById("toast");
  t.textContent=text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2600);
}


function ensureSuccessModal(){
  if(document.getElementById("bookingSuccessModal"))return;

  const style=document.createElement("style");
  style.id="bookingSuccessModalStyles";
  style.textContent=`
    .booking-success-backdrop{
      position:fixed;inset:0;z-index:10050;
      display:none;align-items:center;justify-content:center;
      padding:18px;background:rgba(9,9,11,.74);backdrop-filter:blur(8px);
    }
    .booking-success-backdrop.is-open{display:flex}
    .booking-success-card{
      width:min(520px,100%);max-height:min(720px,calc(100vh - 36px));overflow:auto;
      background:#f4ede3;color:#171516;border:1px solid #c6a15b;
      border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.36);padding:24px;
    }
    .booking-success-kicker{
      margin:0 0 8px;color:#9c742b;font:700 11px/1.2 Inter,system-ui,sans-serif;
      letter-spacing:.16em;text-transform:uppercase;
    }
    .booking-success-card h2{
      margin:0;color:#53131c;font-size:clamp(30px,7vw,44px);line-height:1;
    }
    .booking-success-lead{margin:12px 0 18px;color:#655b54;font-size:14px;line-height:1.55}
    .booking-success-ref{
      padding:14px 16px;border-radius:14px;background:#0f0f10;color:#f4ede3;
      border:1px solid rgba(198,161,91,.38);margin-bottom:14px;
    }
    .booking-success-ref small{display:block;color:#c6a15b;font:700 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px}
    .booking-success-ref strong{display:block;font-size:18px;overflow-wrap:anywhere}
    .booking-success-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 14px}
    .booking-success-grid div{padding:11px 12px;border:1px solid #d9ccbe;border-radius:12px;background:#fbf7f1}
    .booking-success-grid span{display:block;color:#8a776c;font:700 9px/1.2 Inter,system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
    .booking-success-grid strong{font-size:13px;color:#241b1b}
    .booking-success-note{margin:0 0 18px;padding:11px 12px;border-left:2px solid #c6a15b;background:#fbf7f1;color:#655b54;font-size:12px;line-height:1.5}
    .booking-success-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .booking-success-actions a,.booking-success-actions button{
      min-height:44px;border-radius:999px;padding:0 14px;display:flex;align-items:center;justify-content:center;
      font:700 11px/1 Inter,system-ui,sans-serif;text-decoration:none;cursor:pointer;
    }
    .booking-success-actions .primary{background:#53131c;color:#fff8ef;border:1px solid #53131c}
    .booking-success-actions .secondary{background:transparent;color:#53131c;border:1px solid #c6a15b}
    .submitted-summary-meta{margin:14px 0 0;padding-top:14px;border-top:1px solid rgba(198,161,91,.28)}
    .submitted-summary-meta .ss-status{margin:0 0 12px;padding:10px 12px;border-left:2px solid #c6a15b;background:rgba(198,161,91,.08);font-size:12px;line-height:1.5;color:#e9ddca}
    .submitted-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
    .submitted-summary-grid div{padding:10px 11px;border:1px solid rgba(198,161,91,.22);border-radius:10px;background:#1b191a}
    .submitted-summary-grid span{display:block;color:#aa9b92;font:700 9px/1.2 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
    .submitted-summary-grid strong{display:block;color:#f4ede3;font-size:12px;overflow-wrap:anywhere}
    .submitted-summary-contact{padding:10px 11px;border:1px solid rgba(198,161,91,.22);border-radius:10px;background:#1b191a;color:#f4ede3;font-size:11px;line-height:1.55;overflow-wrap:anywhere}
    .submitted-summary-contact strong{display:block;color:#c6a15b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em;font-size:9px}
    .submitted-summary-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
    .submitted-summary-actions button,.submitted-summary-actions a{min-height:42px;border-radius:999px;display:flex;align-items:center;justify-content:center;text-decoration:none;font:700 11px/1 Inter,system-ui,sans-serif}
    .submitted-summary-actions button{background:#53131c;color:#fff8ef;border:1px solid #53131c}
    .submitted-summary-actions a{background:transparent;color:#f4ede3;border:1px solid #c6a15b}
    @media(max-width:520px){
      .booking-success-backdrop{align-items:flex-end;padding:8px}
      .booking-success-card{width:100%;max-height:82vh;border-radius:20px 20px 14px 14px;padding:20px 16px calc(18px + env(safe-area-inset-bottom))}
      .booking-success-card h2{font-size:34px}
      .booking-success-grid{grid-template-columns:1fr 1fr}
      .booking-success-actions{grid-template-columns:1fr}
      .submitted-summary-grid{grid-template-columns:1fr 1fr}
      .submitted-summary-actions{grid-template-columns:1fr}
    }
  `;
  document.head.appendChild(style);

  const modal=document.createElement("div");
  modal.id="bookingSuccessModal";
  modal.className="booking-success-backdrop";
  modal.setAttribute("role","dialog");
  modal.setAttribute("aria-modal","true");
  modal.setAttribute("aria-labelledby","bookingSuccessTitle");
  modal.innerHTML=`
    <section class="booking-success-card">
      <p class="booking-success-kicker">Private Bookings · Kweider</p>
      <h2 id="bookingSuccessTitle">Request Received</h2>
      <p class="booking-success-lead">Thank you. Your private booking request has been received and is now with our team for review.</p>
      <div class="booking-success-ref">
        <small>Booking reference</small>
        <strong id="bookingSuccessReference">—</strong>
      </div>
      <div class="booking-success-grid">
        <div><span>Guests</span><strong id="bookingSuccessGuests">—</strong></div>
        <div><span>Estimated total</span><strong id="bookingSuccessTotal">—</strong></div>
        <div><span>Preferred date</span><strong id="bookingSuccessDate">—</strong></div>
        <div><span>Preferred time</span><strong id="bookingSuccessTime">—</strong></div>
      </div>
      <p class="booking-success-note">Submitting this request does not confirm your booking. Our team reviews booking requests during business hours and will respond as soon as possible, within 48 hours at the latest.</p>
      <div class="booking-success-actions">
        <button type="button" class="primary" id="bookingSuccessSummary">View Request Summary</button>
        <a class="secondary" href="https://kweidersweets.co.uk">Return to Kweider</a>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click",e=>{
    if(e.target===modal)modal.classList.remove("is-open");
  });
  document.getElementById("bookingSuccessSummary").addEventListener("click",()=>{
    modal.classList.remove("is-open");
    refreshSubmittedSummaries();
    if(window.matchMedia("(max-width: 1023px)").matches)openDrawer();
    else document.getElementById("summaryCard")?.scrollIntoView({behavior:"smooth",block:"center"});
  });
}


function escapeHtml(value){
  return String(value??"").replace(/[&<>'"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
}

function applySubmittedSummary(card,snapshot){
  if(!card||!snapshot)return;
  const kicker=card.querySelector(".summary-kicker");
  const title=card.querySelector("h3");
  if(kicker)kicker.textContent="BOOKING REQUEST SUMMARY";
  if(title)title.textContent="Your Request";

  card.querySelectorAll(".summary-edit,.submitted-summary-meta,.submitted-summary-actions").forEach(el=>el.remove());

  const meta=document.createElement("div");
  meta.className="submitted-summary-meta";
  meta.innerHTML=`
    <p class="ss-status"><strong>Awaiting confirmation.</strong><br>Submitting this request does not confirm your booking. Our team reviews requests during business hours and will respond within 48 hours at the latest.</p>
    <div class="submitted-summary-grid">
      <div><span>Booking reference</span><strong>${escapeHtml(snapshot.requestId||"—")}</strong></div>
      <div><span>Preferred date</span><strong>${escapeHtml(snapshot.preferredDate||"—")}</strong></div>
      <div><span>Preferred time</span><strong>${escapeHtml(snapshot.preferredTime||"—")}</strong></div>
      <div><span>Status</span><strong>Awaiting review</strong></div>
    </div>
    <div class="submitted-summary-contact">
      <strong>Customer details</strong>
      ${escapeHtml(snapshot.name||"—")}<br>
      ${escapeHtml(snapshot.phone||"—")}${snapshot.email?`<br>${escapeHtml(snapshot.email)}`:""}
    </div>
  `;
  card.appendChild(meta);

  const actions=document.createElement("div");
  actions.className="submitted-summary-actions";
  actions.innerHTML=`
    <button type="button" data-close-submitted-summary>Close Summary</button>
    <a href="https://kweidersweets.co.uk">Return to Kweider</a>
  `;
  card.appendChild(actions);
  actions.querySelector("[data-close-submitted-summary]")?.addEventListener("click",()=>{
    if(card.closest("#mobileDrawer"))closeDrawer();
    else document.getElementById("bookingSuccessModal")?.classList.add("is-open");
  });
}

function refreshSubmittedSummaries(){
  if(!state.submittedSnapshot)return;
  applySubmittedSummary(document.getElementById("summaryCard"),state.submittedSnapshot);
  const mobile=document.getElementById("mobileSummaryContent");
  if(mobile){
    const clone=document.getElementById("summaryCard")?.cloneNode(true);
    if(clone){
      clone.removeAttribute("id");
      clone.classList.remove("reveal");
      clone.classList.add("drawer-summary-card","is-visible");
      clone.style.opacity="1";
      clone.style.transform="none";
      clone.querySelectorAll("[id]").forEach(el=>el.removeAttribute("id"));
      mobile.replaceChildren(clone);
      applySubmittedSummary(clone,state.submittedSnapshot);
    }
  }
}

function showSuccessModal(result){
  ensureSuccessModal();
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value||"—";};
  set("bookingSuccessReference",result?.requestId);
  set("bookingSuccessGuests",`${state.guests} guests`);
  set("bookingSuccessTotal",result?.totalFormatted||document.getElementById("sumTotal")?.textContent||"—");
  set("bookingSuccessDate",state.preferredDate||"—");
  set("bookingSuccessTime",document.getElementById("eventTime")?.value||"—");
  const modal=document.getElementById("bookingSuccessModal");
  modal.classList.add("is-open");
  modal.querySelector(".booking-success-card")?.scrollTo(0,0);
}
function openDrawer(){
  document.getElementById("mobileDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("open");
  document.getElementById("mobileDrawer").setAttribute("aria-hidden","false");
}
function closeDrawer(){
  document.getElementById("mobileDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("open");
  document.getElementById("mobileDrawer").setAttribute("aria-hidden","true");
}
function submissionSelections(){
  const tier=selectedTier();
  const req=tier?.requirement;
  if(!req)return [];
  return itemsForRequirement(req)
    .map(item=>({id:item.id,qty:qty(req.group,item.id)}))
    .filter(item=>item.qty>0);
}

function createSubmissionId(){
  if(globalThis.crypto?.randomUUID)return crypto.randomUUID();
  return `web-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}

async function sendEventRequest(payload){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch(EVENTS_API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),
      signal:controller.signal,
      credentials:"omit"
    });
    let data={};
    try{data=await response.json();}catch{}
    if(!response.ok||!data.ok){
      throw new Error(data.message||"We could not submit your request. Please try again.");
    }
    return data;
  }finally{
    clearTimeout(timeout);
  }
}

function initReveal(){
  const items=document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){
    items.forEach(x=>x.classList.add("is-visible"));
    return;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  },{threshold:.08,rootMargin:"0px 0px -30px 0px"});
  items.forEach((el,i)=>{
    el.style.transitionDelay=`${Math.min(i%4,3)*55}ms`;
    obs.observe(el);
  });
}

function init(){
  document.querySelectorAll("[data-scroll]").forEach(btn=>{
    btn.onclick=()=>document.querySelector(btn.dataset.scroll).scrollIntoView({behavior:"smooth",block:"start"});
  });
  document.querySelectorAll(".package-card").forEach(card=>{
    card.onclick=()=>setPackage(card.dataset.package);
  });

  const input=document.getElementById("guestCount");

  document.getElementById("guestMinus").onclick=()=>{
    input.value=clampGuests(state.guests-1);
    state.guests=clampGuests(input.value);
    resetChoices();
    renderSelection();
    updateSummary();
  };
  document.getElementById("guestPlus").onclick=()=>{
    input.value=clampGuests(state.guests+1);
    state.guests=clampGuests(input.value);
    resetChoices();
    renderSelection();
    updateSummary();
  };

  input.oninput=e=>{
    e.target.value=toLatinDigits(e.target.value).replace(/[^0-9]/g,"");
  };
  input.onchange=e=>{
    state.guests=clampGuests(e.target.value);
    e.target.value=state.guests;
    resetChoices();
    renderSelection();
    updateSummary();
  };
  input.onblur=e=>{
    state.guests=clampGuests(e.target.value);
    e.target.value=state.guests;
  };

  document.querySelectorAll("[data-guests]").forEach(btn=>{
    btn.onclick=()=>{
      input.value=btn.dataset.guests;
      state.guests=Number(btn.dataset.guests);
      resetChoices();
      renderSelection();
      updateSummary();
    };
  });

  document.querySelectorAll(".duration-btn").forEach(btn=>{
    btn.onclick=()=>{
      state.duration=Number(btn.dataset.hours);
      updateDurationOptions();
      renderSelection();
      updateSummary();
    };
  });

  document.getElementById("eventTime").onchange=validateAvailability;

  document.getElementById("submitRequest").onclick=async()=>{
    const btn=document.getElementById("submitRequest");
    if(state.submittedRequestId)return;
    if(!privateEligible()){
      toast("Private hire starts from 40 guests.");
      return;
    }
    if(!bookingReady()){
      if(!isTailored()&&!state.duration){
        toast("Please choose how long you would like the venue.");
        document.getElementById("durationPanel")?.scrollIntoView({behavior:"smooth",block:"center"});
      }else if(!state.tierId&&!isTailored()&&state.packageId!=="venue-only"){
        toast("Choose a package level first.");
      }else{
        const remaining=Math.max(0,state.guests-assignedForRequirement());
        toast(`Please complete ${remaining} more guest selection${remaining===1?"":"s"} first.`);
      }
      return;
    }
    if(!validateAvailability())return;

    const name=document.getElementById("contactName").value.trim();
    const phone=document.getElementById("contactPhone").value.trim();
    const email=document.getElementById("contactEmail").value.trim();
    const notes=document.getElementById("contactNotes").value.trim();
    const preferredTime=document.getElementById("eventTime").value;
    if(!name||!phone){
      toast("Please add your name and phone number.");
      return;
    }
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      toast("Please enter a valid email address.");
      return;
    }

    const payload={
      submissionId:createSubmissionId(),
      guests:state.guests,
      experience:state.packageId,
      tier:state.tierId,
      duration:state.duration,
      preferredDate:state.preferredDate,
      preferredTime,
      coffeeChoice:state.coffeeChoice,
      selections:submissionSelections(),
      contact:{name,phone,email,notes},
      website:""
    };

    const originalText=btn.textContent;
    btn.disabled=true;
    btn.classList.add("is-disabled");
    btn.textContent="Sending Request…";

    try{
      const result=await sendEventRequest(payload);
      state.submittedRequestId=result.requestId;
      state.submittedSnapshot={
        requestId:result.requestId,
        preferredDate:state.preferredDate,
        preferredTime,
        name,phone,email,notes
      };
      btn.textContent="Request Received ✓";
      if(typeof result.total==="number"){
        document.getElementById("sumTotal").textContent=result.totalFormatted;
        document.getElementById("mobileTotal").textContent=result.totalFormatted;
      }
      refreshSubmittedSummaries();
      toast(`Request ${result.requestId} received. Our team will contact you to confirm.`);
      showSuccessModal(result);
    }catch(error){
      btn.textContent=originalText;
      state.submittedRequestId="";
      syncSubmitState();
      const message=error?.name==="AbortError"
        ? "The request took too long. Please check your connection and try again."
        : (error?.message||"We could not submit your request. Please try again.");
      toast(message);
    }
  };

  document.getElementById("openMobileSummary").onclick=openDrawer;
  document.getElementById("closeMobileSummary").onclick=closeDrawer;
  document.getElementById("drawerBackdrop").onclick=closeDrawer;

  initCalendar();
  initReveal();
  state.guests=clampGuests(input.value);
  updateGuestEligibility();
  updateDurationOptions();
  renderSelection();
  updateSummary();
}

init();
