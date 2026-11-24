(()=>{"use strict";
if(window.CYAExtras)return;
const css=`
#cya-tools{position:fixed;right:12px;bottom:12px;z-index:99999;font:14px system-ui;color:#fff}
#cya-tools button{cursor:pointer;border:1px solid #ffffff40;border-radius:12px;padding:10px 14px;background:#242033;color:#fff}
#cya-tools .panel{position:fixed;inset:auto 12px 62px auto;width:min(420px,calc(100vw - 24px));max-height:75vh;overflow:auto;background:#171522;border:1px solid #ffffff30;border-radius:16px;padding:16px;box-shadow:0 16px 50px #0009}
#cya-tools h2{margin:0 0 12px;font-size:20px}#cya-tools .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
#cya-tools .tabs button{padding:7px 9px}#cya-tools button.active{background:#7046c8}
#cya-tools .body{background:#ffffff0d;border-radius:12px;padding:12px;min-height:120px}
#cya-tools .actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
#cya-tools .muted{opacity:.72;font-size:12px}#cya-tools .big{font-size:28px;font-weight:800;letter-spacing:2px}
#cya-tools .fire{filter:drop-shadow(0 0 8px #ff7a22);animation:cyaPulse .8s infinite alternate}
@keyframes cyaPulse{to{filter:drop-shadow(0 0 17px #ff3b18)}}
@media(prefers-reduced-motion:reduce){#cya-tools *{animation:none!important;transition:none!important}}
`;
const style=document.createElement("style");style.textContent=css;document.head.append(style);
const root=document.createElement("div");root.id="cya-tools";root.innerHTML='<button id="cya-open">Practice / Tools</button><section class="panel" id="cya-panel" hidden><h2>Practice / Tools</h2><div class="tabs"><button data-tab="blackjack">Blackjack</button><button data-tab="reel">Reel demo</button><button data-tab="perf">Performance</button><button id="cya-close">Close</button></div><div class="body" id="cya-content"></div></section>';document.body.append(root);
const $=s=>root.querySelector(s),content=$("#cya-content");let tab="blackjack",deck=[],player=[],dealer=[],done=false,stats={hands:0,wins:0};
try{stats=Object.assign(stats,JSON.parse(localStorage.getItem("cya_extras_practice_v1")||"{}"))}catch{}
const save=()=>localStorage.setItem("cya_extras_practice_v1",JSON.stringify(stats));
const shuffle=()=>{deck=[];for(let s of ["♠","♥","♦","♣"])for(let v of ["A","2","3","4","5","6","7","8","9","10","J","Q","K"])deck.push({s,v});for(let i=deck.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}};
const val=c=>c.v==="A"?11:["J","Q","K"].includes(c.v)?10:+c.v;
const score=h=>{let n=h.reduce((a,c)=>a+val(c),0),a=h.filter(c=>c.v==="A").length;while(n>21&&a-- >0)n-=10;return n};
const cards=h=>h.map(c=>c.v+c.s).join("  ");
function newHand(){shuffle();player=[deck.pop(),deck.pop()];dealer=[deck.pop(),deck.pop()];done=false;render()}
function finish(){while(score(dealer)<17)dealer.push(deck.pop());done=true;stats.hands++;if(score(player)<=21&&(score(dealer)>21||score(player)>score(dealer)))stats.wins++;save();render()}
function render(){content.innerHTML='<b>Blackjack practice — no bets or credits</b><p>Dealer: <span class="big">'+cards(dealer)+'</span> ('+(done?score(dealer):"?")+')</p><p>You: <span class="big">'+cards(player)+'</span> ('+score(player)+')</p><p class="muted">Practice record: '+stats.wins+' wins / '+stats.hands+' hands</p><div class="actions"><button id="cya-hit" '+(done?'disabled':'')+'>Hit</button><button id="cya-stand" '+(done?'disabled':'')+'>Stand</button><button id="cya-new">New hand</button></div>'+(done?'<p><b>'+ (score(player)>21?'Bust':score(dealer)>21||score(player)>score(dealer)?'You win':score(player)===score(dealer)?'Push':'Dealer wins') +'</b></p>':'')}
function show(){if(tab==="blackjack"){if(!player.length)newHand();else render();return}if(tab==="reel"){content.innerHTML='<b>Scripted animation preview</b><p class="muted">A visual effect only. It does not affect the original game, outcomes, balance or statistics.</p><div class="big" id="cya-reels">7　7　BAR</div><div class="actions"><button id="cya-demo">Play preview</button></div>';return}content.innerHTML='<b>Performance snapshot</b><p id="cya-fps">Sampling frame rate…</p><p>Viewport: '+innerWidth+' × '+innerHeight+'<br>Device pixel ratio: '+devicePixelRatio+'<br>Reduced motion: '+matchMedia("(prefers-reduced-motion: reduce)").matches+'<br>Page visible: '+!document.hidden+'</p><p class="muted">FPS is sampled while this panel is open; this tool does not modify the original renderer.</p>';let frames=0,last=performance.now(),fps=$("#cya-fps");function tick(t){if(tab!=="perf"||$("#cya-panel").hidden)return;frames++;if(t-last>=1000){fps.textContent="Approx. FPS: "+Math.round(frames*1000/(t-last));frames=0;last=t}requestAnimationFrame(tick)}requestAnimationFrame(tick)}
$("#cya-open").onclick=()=>{$("#cya-panel").hidden=false;show()};$("#cya-close").onclick=()=>$("#cya-panel").hidden=true;
root.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;root.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));show()});
content.addEventListener("click",e=>{if(e.target.id==="cya-hit"&&!done){player.push(deck.pop());if(score(player)>=21)finish();else render()}if(e.target.id==="cya-stand"&&!done)finish();if(e.target.id==="cya-new")newHand();if(e.target.id==="cya-demo"){const r=$("#cya-reels");r.classList.add("fire");r.textContent="7　7　7";setTimeout(()=>{r.textContent="7　7　BAR";r.classList.remove("fire")},1100)}});
window.CYAExtras={open:()=>{$("#cya-panel").hidden=false;show()},close:()=>$("#cya-panel").hidden=true,resetPracticeStats:()=>{stats={hands:0,wins:0};save();show()},version:"1.1.0"};
})();