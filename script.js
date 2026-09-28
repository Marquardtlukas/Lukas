const tents = [
["Armbrustschützenzelt","gross","Großes Festzelt"],["Augustiner Festhalle","gross","Großes Festzelt"],["Fischer-Vroni","gross","Großes Festzelt"],["Hacker-Festzelt","gross","Großes Festzelt"],["Hofbräu-Festzelt","gross","Großes Festzelt"],["Käfer Wiesn-Schänke","gross","Großes Festzelt"],["Kufflers Weinzelt","gross","Großes Festzelt"],["Löwenbräu-Festzelt","gross","Großes Festzelt"],["Marstall Festzelt","gross","Großes Festzelt"],["Ochsenbraterei","gross","Großes Festzelt"],["Paulaner Festzelt","gross","Großes Festzelt"],["Pschorr-Festzelt Bräurosl","gross","Großes Festzelt"],["Festhalle Schottenhamel","gross","Großes Festzelt"],["Schützen-Festzelt","gross","Großes Festzelt"],
["Hühner- und Entenbraterei AMMER","klein","Kleines Zelt"],["Bartls Flösserstadl","klein","Kleines Zelt · neu 2026"],["Bodo's Cafézelt & Cocktailbar","klein","Kleines Zelt"],["Rischart's Café Kaiserschmarrn","klein","Kleines Zelt"],["Café Theres’","klein","Kleines Zelt"],["Feisingers Kas- und Weinstubn","klein","Kleines Zelt"],["Fisch-Bäda","klein","Kleines Zelt"],["Glöckle Wirt","klein","Kleines Zelt"],["Goldener Hahn","klein","Kleines Zelt"],["Heimer Enten- und Hühnerbraterei","klein","Kleines Zelt"],["Heinz Wurst- und Hühnerbraterei","klein","Kleines Zelt"],["Hochreiters Haxnbraterei","klein","Kleines Zelt"],["Hochreiter's Zur Bratwurst","klein","Kleines Zelt"],["Hühnerbraterei Poschner","klein","Kleines Zelt"],["Kalbsbraterei","klein","Kleines Zelt"],["Münchner Knödelei","klein","Kleines Zelt"],["Schiebl's Kaffeehaferl","klein","Kleines Zelt"],["Vinzenzmurr Metzger Stubn","klein","Kleines Zelt"],["Wiesn Guglhupf","klein","Kleines Zelt"],["Wildstuben","klein","Kleines Zelt"],["Wirtshaus im Schichtl","klein","Kleines Zelt"],
["Boandlkramerei","oide","Oide Wiesn"],["Festzelt Tradition","oide","Oide Wiesn"],["Schützenlisl®","oide","Oide Wiesn"]
];
const key="wiesn-tracker-2026";
let visited=new Set(JSON.parse(localStorage.getItem(key)||"[]"));
let filter="all";
const $=s=>document.querySelector(s);
function render(){
 const q=$("#search").value.trim().toLowerCase();
 const list=tents.filter(t=>{
   const matchesFilter=filter==="all"||filter===t[1]||(filter==="visited"&&visited.has(t[0]))||(filter==="open"&&!visited.has(t[0]));
   return matchesFilter && t[0].toLowerCase().includes(q);
 });
 $("#grid").innerHTML=list.length?list.map(t=>{
   const v=visited.has(t[0]);
   return '<article class="card '+(v?'visited':'')+'" data-name="'+esc(t[0])+'" tabindex="0" role="button" aria-pressed="'+v+'"><span class="type">'+label(t[1])+'</span><div class="check">✓</div><h2>'+esc(t[0])+'</h2><p>'+esc(t[2])+'</p></article>';
 }).join(""):'<div class="empty">Kein Zelt gefunden.</div>';
 document.querySelectorAll(".card").forEach(c=>{c.onclick=()=>toggle(c.dataset.name);c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle(c.dataset.name)}}});
 updateStats();
}
function label(x){return x==="gross"?"Großes Zelt":x==="klein"?"Kleines Zelt":"Oide Wiesn"}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function toggle(name){visited.has(name)?visited.delete(name):visited.add(name);save();render()}
function save(){localStorage.setItem(key,JSON.stringify([...visited]))}
function updateStats(){const n=visited.size,total=tents.length,p=Math.round(n/total*100);$("#count").textContent=n+" / "+total;$("#percent").textContent=p+"%";$("#remaining").textContent=total-n;$("#bar").style.width=p+"%";document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));document.querySelector('.tab[data-filter="all"]').textContent="Alle "+total}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()});
$("#search").oninput=render;
$("#reset").onclick=()=>{if(confirm("Wirklich alle Markierungen löschen?")){visited.clear();save();render()}};
$("#export").onclick=()=>{const blob=new Blob([JSON.stringify({version:1,visited:[...visited]},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wiesn-fortschritt.json";a.click();URL.revokeObjectURL(a.href)};
$("#import").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.visited))throw 0;visited=new Set(d.visited.filter(x=>tents.some(t=>t[0]===x)));save();render()}catch{alert("Die Datei konnte nicht importiert werden.")}};r.readAsText(f);e.target.value=""};
render();
