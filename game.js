(() => {
"use strict";
const $=id=>document.getElementById(id), SAVE_KEY="magnat_empire_save_v2";
const BIZ=[
{id:"lemon",name:"Лимонадный киоск",emoji:"🍋",desc:"Недорогой старт для будущего предпринимателя.",cost:100,base:2,unlock:1,xp:12,area:"market"},
{id:"coffee",name:"Кофейня",emoji:"☕",desc:"Постоянные клиенты и ароматный денежный поток.",cost:650,base:10,unlock:1,xp:20,area:"market"},
{id:"market",name:"Мини-маркет",emoji:"🛒",desc:"Повседневные товары — стабильный спрос.",cost:2400,base:34,unlock:2,xp:30,area:"center"},
{id:"studio",name:"Дизайн-студия",emoji:"🎨",desc:"Креатив, брендинг и дорогие заказы.",cost:8500,base:95,unlock:3,xp:45,area:"center"},
{id:"restaurant",name:"Ресторан",emoji:"🍽️",desc:"Сервис высокого класса и большие чеки.",cost:28000,base:260,unlock:4,xp:60,area:"center"},
{id:"hotel",name:"Отель",emoji:"🏨",desc:"Гости приезжают со всего города.",cost:65000,base:430,unlock:5,xp:80,area:"waterfront"},
{id:"factory",name:"Фабрика",emoji:"🏭",desc:"Производи товары тысячами и расширяйся.",cost:150000,base:920,unlock:6,xp:100,area:"industrial"},
{id:"logistics",name:"Логистическая компания",emoji:"🚚",desc:"Связывай бизнесы в единую цепочку.",cost:390000,base:2200,unlock:7,xp:130,area:"industrial"},
{id:"tech",name:"IT-компания",emoji:"💻",desc:"Цифровые продукты с огромным потенциалом.",cost:950000,base:5900,unlock:8,xp:160,area:"tech"},
{id:"bank",name:"Инвестиционный банк",emoji:"🏦",desc:"Капитал начинает работать на капитал.",cost:2600000,base:16000,unlock:10,xp:200,area:"center"},
{id:"space",name:"Космические технологии",emoji:"🚀",desc:"Высокий риск, высокая отдача и новые горизонты.",cost:9500000,base:65000,unlock:12,xp:250,area:"tech"},
{id:"tower",name:"Международная корпорация",emoji:"🏙️",desc:"Финальная ступень перед глобальной экспансией.",cost:45000000,base:320000,unlock:15,xp:350,area:"tech"}
];
const UPGRADES=[
{id:"ads",name:"Таргетированная реклама",emoji:"📣",desc:"+20% дохода всех компаний.",cost:800,mult:1.2,kind:"income"},
{id:"crm",name:"Система лояльности",emoji:"💝",desc:"+25% дохода и больше постоянных клиентов.",cost:4000,mult:1.25,kind:"income"},
{id:"automation",name:"Умная автоматизация",emoji:"⚙️",desc:"+35% дохода всех компаний.",cost:18000,mult:1.35,kind:"income"},
{id:"brand",name:"Международный бренд",emoji:"💎",desc:"+50% дохода и репутации.",cost:90000,mult:1.5,kind:"income"},
{id:"analytics",name:"Предиктивная аналитика",emoji:"📊",desc:"+60% дохода, решения на основе данных.",cost:420000,mult:1.6,kind:"income"},
{id:"franchise",name:"Франчайзинг",emoji:"🌍",desc:"+100% дохода от всех компаний.",cost:3000000,mult:2,kind:"income"}
];
const RESEARCH=[
{id:"ecom",name:"Электронная торговля",emoji:"🛍️",desc:"+15% дохода. Открой новые каналы продаж.",cost:1,req:1,mult:1.15},
{id:"loyalty",name:"Клиентская лояльность",emoji:"💚",desc:"+20% дохода и репутации.",cost:2,req:2,mult:1.2},
{id:"ai",name:"ИИ-оптимизация",emoji:"🤖",desc:"+35% дохода от всех компаний.",cost:3,req:4,mult:1.35},
{id:"global",name:"Глобальная экспансия",emoji:"🌐",desc:"+50% дохода и скидка на новые бизнесы.",cost:5,req:7,mult:1.5},
{id:"quantum",name:"Квантовые вычисления",emoji:"⚛️",desc:"+100% дохода. Будущее уже здесь.",cost:8,req:10,mult:2}
];
const STAFF=[
{id:"cashier",name:"Операционный менеджер",emoji:"🧑‍💼",desc:"+10% дохода за каждого специалиста.",cost:2500,bonus:.1},
{id:"marketer",name:"Директор по маркетингу",emoji:"📢",desc:"+20% дохода за каждого специалиста.",cost:16000,bonus:.2},
{id:"analyst",name:"Финансовый аналитик",emoji:"🧑‍💻",desc:"+30% дохода за каждого специалиста.",cost:90000,bonus:.3},
{id:"ceo",name:"Исполнительный директор",emoji:"🤵",desc:"+50% дохода за каждого специалиста.",cost:650000,bonus:.5}
];
const DISTRICTS=[
{id:"market",name:"Старый рынок",emoji:"🛍️",desc:"Идеально для первых магазинов и кофеен.",cost:0,req:1,bonus:.05},
{id:"center",name:"Деловой центр",emoji:"🏢",desc:"Открывает доступ к серьёзным компаниям.",cost:3500,req:3,bonus:.1},
{id:"waterfront",name:"Набережная",emoji:"🌊",desc:"Престижный район для гостиниц и отдыха.",cost:30000,req:5,bonus:.12},
{id:"industrial",name:"Промзона",emoji:"🏭",desc:"Здесь рождаются производство и логистика.",cost:160000,req:7,bonus:.18},
{id:"tech",name:"Технологический парк",emoji:"🧬",desc:"Дом инноваций и международных проектов.",cost:1200000,req:10,bonus:.25}
];
const QUESTS=[
{id:"buy1",name:"Первая инвестиция",desc:"Купи любую компанию.",emoji:"🌱",reward:150,xp:20,check:s=>totalOwned(s)>=1,progress:s=>Math.min(1,totalOwned(s)),target:1},
{id:"buy3",name:"Маленькая сеть",desc:"Владей тремя разными компаниями.",emoji:"🏪",reward:800,xp:40,check:s=>BIZ.filter(b=>(s.owned[b.id]||0)>0).length>=3,progress:s=>Math.min(3,BIZ.filter(b=>(s.owned[b.id]||0)>0).length),target:3},
{id:"level3",name:"Опытный руководитель",desc:"Достигни 3-го уровня.",emoji:"⭐",reward:600,xp:30,check:s=>s.level>=3,progress:s=>Math.min(3,s.level),target:3},
{id:"income100",name:"Деньги работают",desc:"Достигни дохода ₽100 в минуту.",emoji:"📈",reward:1500,xp:60,check:s=>income(s)>=100,progress:s=>Math.min(100,Math.floor(income(s))),target:100},
{id:"upgrade",name:"Улучшай и властвуй",desc:"Купи первое постоянное улучшение.",emoji:"🚀",reward:1200,xp:50,check:s=>s.upgrades.length>=1,progress:s=>Math.min(1,s.upgrades.length),target:1},
{id:"rep100",name:"Имя на слуху",desc:"Набери 100 репутации.",emoji:"🏆",reward:2500,xp:75,check:s=>s.rep>=100,progress:s=>Math.min(100,s.rep),target:100},
{id:"million",name:"Первый миллион",desc:"Накопи ₽1 000 000 одновременно.",emoji:"💰",reward:25000,xp:150,check:s=>s.money>=1000000,progress:s=>Math.min(1000000,Math.floor(s.money)),target:1000000}
];
const ACHIEVEMENTS=[
{id:"starter",name:"Всё начинается с малого",desc:"Заработай первые ₽1 000 суммарно.",emoji:"🪙",reward:1,check:s=>s.totalEarned>=1000},
{id:"tycoon",name:"Локальный магнат",desc:"Владей пятью компаниями одновременно.",emoji:"🏬",reward:2,check:s=>totalOwned(s)>=5},
{id:"empire",name:"Корпоративный гигант",desc:"Владей восемью компаниями одновременно.",emoji:"🏙️",reward:3,check:s=>totalOwned(s)>=8},
{id:"scientist",name:"Умный капитал",desc:"Открой три исследования.",emoji:"🧪",reward:2,check:s=>s.research.length>=3},
{id:"employer",name:"Работодатель года",desc:"Найми трёх сотрудников.",emoji:"🤝",reward:2,check:s=>Object.values(s.staff).reduce((a,b)=>a+b,0)>=3},
{id:"prestige",name:"Новая глава",desc:"Совершить престижное перерождение.",emoji:"👑",reward:2,check:s=>s.prestige>=1}
];
const fresh=()=>({money:500,level:1,xp:0,rep:0,science:0,prestige:0,owned:{},bizLevels:{},upgrades:[],research:[],staff:{},districts:["market"],quests:[],achievements:[],moneySpent:0,totalEarned:0,totalClicks:0,daysPlayed:1,streak:0,lastDaily:"",lastSeen:Date.now(),lastEvent:0,adUntil:0,logs:[],eventReady:false,careerStart:Date.now(),careerCount:0});
let s=load(), currentFilter="all",missionTab="quests",toastTimer=null;
function load(){try{const x=JSON.parse(localStorage.getItem(SAVE_KEY));return x?{...fresh(),...x,owned:x.owned||{},bizLevels:x.bizLevels||{},upgrades:x.upgrades||[],research:x.research||[],staff:x.staff||{},districts:x.districts||["market"],quests:x.quests||[],achievements:x.achievements||[],logs:x.logs||[]}:fresh()}catch{return fresh()}}
function save(){s.lastSeen=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}}
function num(n){if(!Number.isFinite(n))return "0";if(n>=1e12)return (n/1e12).toFixed(2)+" трлн";if(n>=1e9)return (n/1e9).toFixed(2)+" млрд";if(n>=1e6)return (n/1e6).toFixed(2)+" млн";if(n>=10000)return Math.floor(n).toLocaleString("ru-RU");return Math.floor(n).toLocaleString("ru-RU")}
function cash(n){return "₽ "+num(n)}
function totalOwned(st=s){return Object.values(st.owned).reduce((a,b)=>a+b,0)}
function levelCost(b){return Math.floor(b.cost*.7*Math.pow(Math.max(1,s.bizLevels[b.id]||1),1.55))}
function mult(st=s){let m=1+st.prestige*.1;for(const u of UPGRADES)if(st.upgrades.includes(u.id))m*=u.mult;for(const r of RESEARCH)if(st.research.includes(r.id))m*=r.mult;for(const staff of STAFF)m*=1+staff.bonus*(st.staff[staff.id]||0);if(st.districts.includes("center"))m*=1.1;if(st.districts.includes("waterfront"))m*=1.12;if(st.districts.includes("industrial"))m*=1.18;if(st.districts.includes("tech"))m*=1.25;if(Date.now()<st.adUntil)m*=1.15;return m}
function income(st=s){return BIZ.reduce((a,b)=>a+(st.owned[b.id]||0)*b.base*(1+((st.bizLevels[b.id]||1)-1)*.55),0)*mult(st)}
function xpNeed(st=s){return st.level*100}
function addLog(icon,text){s.logs.unshift({icon,text,time:Date.now()});s.logs=s.logs.slice(0,12)}
function toast(text){const t=$("toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2700)}
function addXP(n){s.xp+=n;let leveled=0;while(s.xp>=xpNeed()){s.xp-=xpNeed();s.level++;s.science+=1;s.money+=s.level*120;leveled++;s.rep+=5}if(leveled){addLog("⭐",`Новый уровень ${s.level}! Получено ${leveled} очко науки и денежный бонус.`);toast(`Новый уровень ${s.level}! +${leveled} 🔬 науки`)}}
function gain(n,why){s.money+=n;s.totalEarned+=n;if(why)addLog("💰",`${why}: +${cash(n)}`)}
function checkUnlock(b){return s.level>=b.unlock&&(DISTRICTS.find(d=>d.id===b.area)?.req||1)<=s.level&&s.districts.includes(b.area)}
function price(b){return Math.floor(b.cost*Math.pow(1.17,s.owned[b.id]||0)*(s.research.includes("global")?.9:1))}
function fmtIncome(n){return cash(n)+" / мин"}
function ranks(){if(s.rep>=2000)return"Легенда бизнеса";if(s.rep>=800)return"Корпоративный гигант";if(s.rep>=300)return"Известный предприниматель";if(s.rep>=100)return"Уважаемый бизнесмен";if(s.rep>=25)return"Перспективный предприниматель";return"Начинающий"}
function renderStats(){$("money").textContent=cash(s.money);$("cashflow").textContent="+"+cash(income())+" / мин";$("level").textContent=s.level;$("xpBar").style.width=Math.min(100,s.xp/xpNeed()*100)+"%";$("xpText").textContent=`${num(s.xp)} / ${num(xpNeed())} опыта`;$("rep").textContent=num(s.rep);$("rank").textContent=ranks();$("prestige").textContent=num(s.prestige);$("sciencePoints").textContent=num(s.science);$("dayChip").textContent=`День ${s.daysPlayed}`;$("businessCount").textContent=`${BIZ.filter(b=>(s.owned[b.id]||0)>0).length} компаний`;$("missionCount").textContent=`${s.quests.length} заданий получено`;$("cityCaption").textContent=`Репутация: ${num(s.rep)} · ${ranks()}`;$("prestigeGain").textContent=num(prestigeGain())}
function bizCard(b){const own=s.owned[b.id]||0,lv=s.bizLevels[b.id]||1,unlocked=checkUnlock(b),cost=price(b),profit=b.base*(1+(lv-1)*.55)*mult(),locked=!unlocked;return `<article class="business-card"><div class="biz-head"><div class="biz-icon">${locked?"🔒":b.emoji}</div><div class="biz-title"><h3>${b.name}</h3><small>${own?`Уровень ${lv} · ${own} шт.`:locked?`Открывается на ${b.unlock} уровне`:"Готов к покупке"}</small></div>${own?'<span class="owned-badge">ТВОЙ</span>':""}</div><p class="biz-desc">${locked?"Развивай бизнес и открывай новые районы.":b.desc}</p><div class="biz-stats"><div class="biz-stat"><small>Доход за объект / мин</small><b class="profit">${fmtIncome(profit)}</b></div><div class="biz-stat"><small>Стоимость</small><b>${locked?"—":cash(own?levelCost(b):cost)}</b></div></div>${own?`<div class="biz-progress"><i style="width:${Math.min(100,lv*10)}%"></i></div>`:""}${locked?`<div class="locked-note">🔒 Нужно: уровень ${b.unlock} и район «${DISTRICTS.find(d=>d.id===b.area)?.name||"Город"}»</div>`:`<div class="biz-actions">${own?`<button class="btn btn-outline" data-biz-up="${b.id}">⬆ Улучшить · ${cash(levelCost(b))}</button><button class="btn btn-green" data-buy="${b.id}">Купить ещё · ${cash(cost)}</button>`:`<button class="btn btn-green" data-buy="${b.id}" ${s.money<cost?"disabled":""}>Купить · ${cash(cost)}</button>`}</div>`}</article>`}
function renderBusiness(){const list=BIZ.filter(b=>{const own=(s.owned[b.id]||0)>0,unlocked=checkUnlock(b);return currentFilter==="owned"?own:currentFilter==="available"?!own&&unlocked:currentFilter==="locked"?!unlocked:true});$("businessCatalog").innerHTML=list.map(bizCard).join("")||'<div class="panel" style="padding:20px;color:var(--muted)">Пока здесь пусто. Попробуй другой фильтр.</div>';$("featuredBusinesses").innerHTML=BIZ.filter(b=>(s.owned[b.id]||0)>0).slice(0,4).map(bizCard).join("")||'<div class="panel" style="padding:18px;color:var(--muted);grid-column:1/-1">Твои компании появятся здесь после первой покупки.</div>'}
function renderDistricts(){$("districts").innerHTML=DISTRICTS.map(d=>{const owned=s.districts.includes(d.id),open=s.level>=d.req;return `<article class="district-card"><div class="district-top"><span class="district-emoji">${d.emoji}</span><div><h3>${d.name}</h3><small>${owned?"Район открыт":open?"Доступен для покупки":`Откроется на ${d.req} уровне`}</small></div></div><p>${d.desc}<br><b style="color:var(--green)">Бонус к доходу: +${Math.round(d.bonus*100)}%</b></p>${owned?'<button class="btn btn-outline" disabled>✓ Приобретён</button>':`<button class="btn btn-green" data-district="${d.id}" ${!open||s.money<d.cost?"disabled":""}>${open?"Открыть · "+cash(d.cost):"🔒 Заблокирован"}</button>`}</article>`}).join("")}
function renderResearch(){ $("researchTree").innerHTML=RESEARCH.map(r=>{const got=s.research.includes(r.id),open=s.level>=r.req;return `<article class="research-card ${got?"unlocked":""}"><div class="research-icon">${r.emoji}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="research-foot"><b>${got?"✓ Изучено":`${r.cost} 🔬 науки`}</b><button class="btn ${got?"btn-outline":"btn-green"}" data-research="${r.id}" ${got||!open||s.science<r.cost?"disabled":""}>${got?"Активно":!open?`Ур. ${r.req}`:"Изучить"}</button></div></article>`}).join("");$("staffList").innerHTML=STAFF.map(t=>{const n=s.staff[t.id]||0,cost=Math.floor(t.cost*Math.pow(1.8,n));return `<article class="staff-card"><div class="staff-icon">${t.emoji}</div><div><h3>${t.name} ×${n}</h3><p>${t.desc}</p><small style="color:var(--gold);font-size:10px">${cash(cost)}</small></div><button class="btn btn-green" data-staff="${t.id}" ${s.money<cost?"disabled":""}>Нанять</button></article>`}).join("")}
function questProgress(q){return Math.min(q.target,q.progress(s))}
function renderMissions(){const qs=QUESTS.map(q=>{const done=s.quests.includes(q.id),p=questProgress(q),ratio=Math.min(100,p/q.target*100);return `<article class="mission ${done?"done":""}"><div class="mission-icon">${done?"✅":q.emoji}</div><div class="mission-copy"><h3>${q.name}</h3><p>${q.desc}</p><div class="progress-line"><i style="width:${ratio}%"></i></div><small style="font-size:9px;color:var(--muted)">${num(p)} / ${num(q.target)}</small></div><div class="mission-reward">${done?"Выполнено":`+${cash(q.reward)}<br>+${q.xp} XP`}${!done&&q.check(s)?`<button class="btn btn-green" data-quest="${q.id}">Забрать</button>`:""}</div></article>`}).join("");$("questList").innerHTML=qs;const as=ACHIEVEMENTS.map(a=>{const done=s.achievements.includes(a.id),ready=a.check(s);return `<article class="mission ${done?"done":""}"><div class="mission-icon">${done?"🏅":a.emoji}</div><div class="mission-copy"><h3>${a.name}</h3><p>${a.desc}</p></div><div class="mission-reward">${done?"Открыто":`+${a.reward} 💎`}${!done&&ready?`<button class="btn btn-gold" data-achievement="${a.id}">Забрать</button>`:""}</div></article>`}).join("");$("achievementList").innerHTML=as}
function renderLog(){$("eventLog").innerHTML=s.logs.slice(0,5).map(l=>`<div class="log-item"><div class="log-icon">${l.icon}</div><div class="log-copy">${l.text}<small>${new Date(l.time).toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}</small></div></div>`).join("")||'<div class="log-item"><div class="log-icon">📘</div><div class="log-copy">Здесь появятся важные события твоей компании.<small>Только начало истории</small></div></div>'}
function renderActions(){$("nextActions").innerHTML=[{icon:"🏪",title:"Купить бизнес",desc:"Запусти новый источник дохода",view:"business"},{icon:"🧪",title:"Изучить технологию",desc:"Усиль экономику империи",view:"research"},{icon:"🎯",title:"Забрать награду",desc:"Проверь выполненные задания",view:"missions"}].map(a=>`<button class="action-tile" data-goto="${a.view}"><span class="tile-icon">${a.icon}</span><b>${a.title}</b><small>${a.desc}</small></button>`).join("");}
function renderStatsGrid(){$("statsGrid").innerHTML=[["💸 Всего заработано",cash(s.totalEarned)],["🏪 Всего компаний",num(totalOwned())],["📦 Покупок улучшений",num(s.upgrades.length)],["🧬 Исследования",num(s.research.length)],["🤝 Сотрудники",num(Object.values(s.staff).reduce((a,b)=>a+b,0))],["🔁 Карьер",num(s.careerCount+1)]].map(x=>`<div class="stat-box"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("")}
function renderDaily(){const today=new Date().toISOString().slice(0,10),ready=s.lastDaily!==today;$("dailyBtn").disabled=!ready;$("dailyBtn").textContent=ready?"Забрать награду":"Получено сегодня";$("dailyDescription").textContent=ready?"Забери ежедневный бонус. За серию входов награда растёт!":"Бонус уже получен. Возвращайся завтра.";$("streakText").textContent=`Серия входов: ${s.streak} ${s.streak===1?"день":"дней"}`}
function render(){renderStats();renderBusiness();renderDistricts();renderResearch();renderMissions();renderLog();renderActions();renderStatsGrid();renderDaily();const promo=Date.now()<s.adUntil;$("promoStatus").textContent=promo?`Активна ещё ${Math.ceil((s.adUntil-Date.now())/60000)} мин.`:"Кампания не активна";$("promoBtn").disabled=promo||s.money<2000;$("promoBtn").textContent=promo?"Активна":"₽ 2 000";$("prestigeBtn").disabled=prestigeGain()<1}
function goto(view){document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===view));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));window.scrollTo({top:0,behavior:"smooth"})}
function buyBiz(id){const b=BIZ.find(x=>x.id===id);if(!b||!checkUnlock(b))return toast("Сначала открой нужный район и уровень");const c=price(b);if(s.money<c)return toast("Пока не хватает денег — дай бизнесу время заработать 💰");s.money-=c;s.moneySpent+=c;s.owned[id]=(s.owned[id]||0)+1;s.bizLevels[id]=s.bizLevels[id]||1;s.rep+=2;addXP(b.xp);addLog(b.emoji,`Приобретена компания «${b.name}».`);toast(`${b.name} теперь часть империи!`);save();render()}
function upgradeBiz(id){const b=BIZ.find(x=>x.id===id);if(!b||!s.owned[id])return;const c=levelCost(b);if(s.money<c)return toast("Не хватает денег на улучшение");s.money-=c;s.moneySpent+=c;s.bizLevels[id]=(s.bizLevels[id]||1)+1;s.rep+=3;addXP(10*(s.bizLevels[id]||1));addLog("⬆️",`«${b.name}» улучшен до уровня ${s.bizLevels[id]}.`);toast("Бизнес стал эффективнее!");save();render()}
function claimQuest(id){const q=QUESTS.find(x=>x.id===id);if(!q||s.quests.includes(id)||!q.check(s))return;s.quests.push(id);gain(q.reward,`Задание «${q.name}»`);s.rep+=10;addXP(q.xp);s.science+=1;addLog("🎯",`Задание выполнено: ${q.name}. +1 очко науки.`);save();render()}
function claimAchievement(id){const a=ACHIEVEMENTS.find(x=>x.id===id);if(!a||s.achievements.includes(id)||!a.check(s))return;s.achievements.push(id);s.prestige+=a.reward;s.rep+=20;addLog("🏅",`Получено достижение «${a.name}»: +${a.reward} престижа.`);toast(`Достижение открыто! +${a.reward} 💎`);save();render()}
function prestigeGain(){return Math.floor(Math.sqrt(Math.max(0,s.totalEarned)/1000000))}
function doPrestige(){const n=prestigeGain();if(n<1)return toast("Нужно заработать больше, прежде чем начать новую главу");if(!confirm(`Начать новую карьеру и получить ${n} очков престижа? Деньги, бизнесы, улучшения, исследования и уровень сбросятся. Престиж останется.`))return;const keep={prestige:s.prestige+n,careerCount:s.careerCount+1,achievements:s.achievements.filter(id=>id==="prestige"),logs:s.logs,totalEarned:s.totalEarned};s={...fresh(),...keep};s.money=700;s.rep=10;s.science=1;s.lastSeen=Date.now();addLog("👑",`Новая глава! Получено ${n} очков престижа.`);save();render();goto("dashboard");toast(`Новая карьера началась! +${n} престижа`)}
function randomEvent(){const now=Date.now();if(now-s.lastEvent<180000)return toast("Следующее событие появится чуть позже");s.lastEvent=now;const events=[
{title:"Фестиваль в городе",text:"Городской фестиваль увеличил спрос. Получи разовую прибыль, равную 3 минутам дохода.",run:()=>gain(Math.max(100,income()*3),"Городской фестиваль")},
{title:"Неожиданный налоговый возврат",text:"Бухгалтерия нашла переплату. Государство возвращает часть средств.",run:()=>gain(Math.max(150,s.money*.08),"Налоговый возврат")},
{title:"Вирусный пост",text:"О твоей компании написали в сети. Репутация растёт!",run:()=>{s.rep+=20;gain(Math.max(50,income()*1.5),"Вирусная реклама")}},
{title:"Новый деловой контакт",text:"Знакомство с инвестором приносит науку и опыт.",run:()=>{s.science+=1;addXP(30);s.rep+=10;}},
{title:"Скидки поставщиков",text:"Поставщики предложили выгодные условия. Получи денежный бонус.",run:()=>gain(Math.max(200,income()*5),"Скидка поставщиков")}
];const e=events[Math.floor(Math.random()*events.length)];$("eventTitle").textContent=e.title;$("eventText").textContent=e.text;e.run();s.eventReady=true;addLog("🎲",`Событие: ${e.title}.`);save();render();toast("Событие завершено!")}
function applyResearch(id){const r=RESEARCH.find(x=>x.id===id);if(!r||s.research.includes(id))return;if(s.level<r.req)return toast(`Нужен уровень ${r.req}`);if(s.science<r.cost)return toast("Не хватает очков науки");s.science-=r.cost;s.research.push(id);s.rep+=10;addXP(20);addLog(r.emoji,`Исследование «${r.name}» завершено.`);toast("Новая технология открыта!");save();render()}
function hire(id){const t=STAFF.find(x=>x.id===id);if(!t)return;const cost=Math.floor(t.cost*Math.pow(1.8,s.staff[id]||0));if(s.money<cost)return toast("Не хватает денег для найма");s.money-=cost;s.moneySpent+=cost;s.staff[id]=(s.staff[id]||0)+1;s.rep+=5;addXP(15);addLog(t.emoji,`Нанят специалист: ${t.name}.`);toast("Команда стала сильнее!");save();render()}
function buyDistrict(id){const d=DISTRICTS.find(x=>x.id===id);if(!d||s.districts.includes(id))return;if(s.level<d.req||s.money<d.cost)return toast("Пока район недоступен");s.money-=d.cost;s.moneySpent+=d.cost;s.districts.push(id);s.rep+=15;addXP(35);addLog(d.emoji,`Открыт район «${d.name}».`);toast("Новый район теперь твой!");save();render()}
function daily(){const today=new Date().toISOString().slice(0,10);if(s.lastDaily===today)return;const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);s.streak=s.lastDaily===yesterday?s.streak+1:1;s.lastDaily=today;const reward=250+s.streak*100;gain(reward,"Ежедневная награда");s.science+=s.streak%3===0?1:0;addXP(20);addLog("🎁",`Ежедневная награда получена. Серия: ${s.streak} дн.`);save();render();toast(`Бонус дня: ${cash(reward)}!`)}
function exportSave(){const blob=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="magnat-empire-save.json";a.click();URL.revokeObjectURL(url);toast("Резервная копия подготовлена")}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;if(t.dataset.goto)goto(t.dataset.goto);if(t.dataset.buy)buyBiz(t.dataset.buy);if(t.dataset.bizUp)upgradeBiz(t.dataset.bizUp);if(t.dataset.district)buyDistrict(t.dataset.district);if(t.dataset.research)applyResearch(t.dataset.research);if(t.dataset.staff)hire(t.dataset.staff);if(t.dataset.quest)claimQuest(t.dataset.quest);if(t.dataset.achievement)claimAchievement(t.dataset.achievement)});
$("nav").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)goto(b.dataset.view)});
$("businessFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;currentFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderBusiness()});
document.querySelector(".mission-tabs").addEventListener("click",e=>{const b=e.target.closest("[data-mission-tab]");if(!b)return;missionTab=b.dataset.missionTab;document.querySelectorAll("[data-mission-tab]").forEach(x=>x.classList.toggle("active",x===b));$("questList").classList.toggle("hidden",missionTab!=="quests");$("achievementList").classList.toggle("hidden",missionTab!=="achievements")});
$("collectBtn").addEventListener("click",()=>{const amount=income()*5;if(amount<=0)return toast("Сначала купи бизнес — он начнёт приносить доход");gain(amount,"Сбор прибыли за 5 минут");s.totalClicks++;addXP(2);save();render();toast(`Собрано ${cash(amount)}!`)});
$("dailyBtn").addEventListener("click",daily);
$("promoBtn").addEventListener("click",()=>{if(s.money<2000||Date.now()<s.adUntil)return;s.money-=2000;s.moneySpent+=2000;s.adUntil=Date.now()+10*60*1000;addLog("📣","Запущена рекламная кампания на 10 минут.");save();render();toast("Реклама запущена! +15% дохода на 10 минут")});
$("eventBtn").addEventListener("click",randomEvent);
$("prestigeBtn").addEventListener("click",doPrestige);
$("saveBtn").addEventListener("click",()=>{save();toast("Прогресс сохранён 💾")});

function closeIntro(){const el=$("introScreen");el.classList.add("intro-closing");try{localStorage.setItem("magnat_intro_seen_v1","1")}catch{}setTimeout(()=>{el.classList.add("hidden");el.classList.remove("intro-closing")},260)}
function openIntro(){const el=$("introScreen");el.classList.remove("hidden","intro-closing");}
$("startGameBtn").addEventListener("click",()=>{closeIntro();toast("Добро пожаловать, босс! Твоя империя ждёт 🚀")});
$("introLaterBtn").addEventListener("click",closeIntro);
$("helpBtn").addEventListener("click",openIntro);
try{if(localStorage.getItem("magnat_intro_seen_v1"))$("introScreen").classList.add("hidden")}catch{}
$("settingsBtn").addEventListener("click",()=>$("settingsDialog").showModal());
$("closeSettings").addEventListener("click",()=>$("settingsDialog").close());
$("exportBtn").addEventListener("click",exportSave);$("modalExport").addEventListener("click",exportSave);
$("resetBtn").addEventListener("click",()=>{if(confirm("Точно удалить весь прогресс? Это действие нельзя отменить.")){s=fresh();addLog("🌱","Новая история империи начинается.");save();render();$("settingsDialog").close();toast("Прогресс сброшен")}});

function tick(){const now=Date.now(),elapsed=Math.min(8*60*60*1000,Math.max(0,now-(s.lastSeen||now)));if(elapsed>0){const earned=income()*elapsed/60000;if(earned>0){s.money+=earned;s.totalEarned+=earned;}s.lastSeen=now;}if(now-s.lastEvent>300000&&Math.random()<.015){s.eventReady=true;$("eventTitle").textContent="На рынке назревает событие";$("eventText").textContent="Открой задания и нажми «Проверить», чтобы получить случайный бонус."}save();renderStats();renderBusiness();renderDistricts();renderResearch();renderMissions();renderStatsGrid();renderDaily();$("promoStatus").textContent=now<s.adUntil?`Активна ещё ${Math.ceil((s.adUntil-now)/60000)} мин.`:"Кампания не активна";$("promoBtn").disabled=now<s.adUntil||s.money<2000;$("promoBtn").textContent=now<s.adUntil?"Активна":"₽ 2 000";$("prestigeBtn").disabled=prestigeGain()<1}
const prev=s.lastSeen||Date.now(),offline=Math.min(8*60*60*1000,Math.max(0,Date.now()-prev));if(offline>60000){const earned=income()*offline/60000;if(earned>0){s.money+=earned;s.totalEarned+=earned;addLog("💸",`Пока тебя не было, бизнес заработал ${cash(earned)}.`)}s.daysPlayed+=Math.max(0,Math.floor(offline/86400000));}
if(!s.logs.length)addLog("👋","Ты открыл свою первую компанию. Пора строить империю!");
try{const tg=window.Telegram&&window.Telegram.WebApp;if(tg){tg.ready();tg.expand();}}catch{}
save();render();setInterval(tick,5000);
})();