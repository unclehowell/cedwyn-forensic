/* Forensic Assessments v1.4.0 — directory controls, activity journal and catalogue identity. */
(function () {
  "use strict";
  var input=document.getElementById("fa-q"),clear=document.getElementById("fa-clear"),select=document.getElementById("fa-sort");
  var list=document.getElementById("fa-cards"),result=document.getElementById("fa-results"),empty=document.getElementById("fa-empty");
  var buttons=Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards=list?Array.prototype.slice.call(list.querySelectorAll(":scope > li")):[],active="all",total=cards.length;
  var month={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
  function dateValue(text){
    var value=String(text||"").trim();
    if(!value||/^(none|no contact|none on file|—|-)$/i.test(value))return 0;
    var parsed=Date.parse(value);if(!Number.isNaN(parsed))return parsed;
    var m=value.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
    return !m||month[m[2].toLowerCase()]===undefined?0:Date.UTC(Number(m[3]),month[m[2].toLowerCase()],Number(m[1]));
  }
  function chipValue(card,prefix){
    var chips=card.querySelectorAll(".fa-chips span");
    for(var i=0;i<chips.length;i++){var v=chips[i].textContent.trim();if(v.toLowerCase().indexOf(prefix)===0)return v.slice(prefix.length).trim();}
    return "";
  }
  cards.forEach(function(card,index){
    var reading=card.querySelector(".fa-liab-strong,.fa-liab-some,.fa-liab-none"),unassessed=/not yet assessed/i.test(card.textContent),title=card.querySelector("a.t");
    card.dataset.order=String(index);card.dataset.kind=unassessed?"unassessed":"assessed";
    card.dataset.indicator=reading&&reading.classList.contains("fa-liab-strong")?"strong":reading&&reading.classList.contains("fa-liab-some")?"some":"none";
    card.dataset.name=title?title.textContent.trim().toLocaleLowerCase():"";
    card.dataset.last=String(dateValue(chipValue(card,"last contact")));
    card.dataset.next=String(dateValue(chipValue(card,"next")));
  });
  function matches(card,query){
    if(query&&card.textContent.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())<0)return false;
    if(active==="assessed"||active==="unassessed")return card.dataset.kind===active;
    if(active==="strong"||active==="some"||active==="none")return card.dataset.indicator===active;
    return true;
  }
  function sortCards(items){
    var mode=select?select.value:"priority";
    if(mode==="name")return items.sort(function(a,b){return a.dataset.name.localeCompare(b.dataset.name);});
    if(mode==="recent")return items.sort(function(a,b){return Number(b.dataset.last)-Number(a.dataset.last)||Number(a.dataset.order)-Number(b.dataset.order);});
    if(mode==="deadline")return items.sort(function(a,b){var av=Number(a.dataset.next)||Number.MAX_SAFE_INTEGER,bv=Number(b.dataset.next)||Number.MAX_SAFE_INTEGER;return av-bv||Number(a.dataset.order)-Number(b.dataset.order);});
    if(mode==="indicator"){var rank={strong:0,some:1,none:2};return items.sort(function(a,b){return rank[a.dataset.indicator]-rank[b.dataset.indicator]||Number(a.dataset.order)-Number(b.dataset.order);});}
    return items.sort(function(a,b){return Number(a.dataset.order)-Number(b.dataset.order);});
  }
  function render(){
    if(!list)return;
    var query=input?input.value.trim():"",visible=sortCards(cards.filter(function(card){return matches(card,query);}));
    visible.forEach(function(card){list.appendChild(card);});
    cards.forEach(function(card){card.hidden=visible.indexOf(card)<0;});
    if(result)result.textContent="Showing "+visible.length+" of "+total+" institutions.";
    if(empty)empty.hidden=visible.length!==0;
    buttons.forEach(function(button){var on=button.dataset.filter===active;button.classList.toggle("is-active",on);button.setAttribute("aria-pressed",on?"true":"false");});
  }
  function setFilter(filter){active=filter||"all";render();}
  buttons.forEach(function(button){button.addEventListener("click",function(){setFilter(button.dataset.filter);});});
  if(input)input.addEventListener("input",render);
  if(clear)clear.addEventListener("click",function(){if(input){input.value="";input.focus();}setFilter("all");});
  if(select)select.addEventListener("change",render);
  document.querySelectorAll("[data-stat-filter]").forEach(function(button){
    button.addEventListener("click",function(){
      setFilter(button.dataset.statFilter);var directory=document.getElementById("fa-directory");
      if(directory&&typeof directory.scrollIntoView==="function"){var reduced=false;try{reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){}directory.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});}
    });
  });
  render();
  function note(lang){var el=document.querySelector(".fa-tp");if(el)el.hidden=!(lang==="cy"||lang==="es");}
  document.addEventListener("ghf-lang-change",function(event){note(event.detail&&event.detail.lang);});
  note(document.documentElement.getAttribute("lang"));
})();

/* Forensic Assessments v1.2.0 - activity journal: each institution page shows its journal section from /forensic/journal/. - Sion's Tab agent */
(function(){"use strict";
  var m=location.pathname.match(/^\/forensic\/([a-z0-9-]+)\/?$/),main=document.querySelector("main.faw");if(!main)return;
  if(!m){if(/^\/forensic\/?$/.test(location.pathname)&&!document.getElementById("fj-link")){var p=document.createElement("p");p.id="fj-link";p.className="fa-reading";p.innerHTML='<strong>New:</strong> <a href="/forensic/journal/">Activity journal</a>: every reply, request and website change for each institution, dated, with a plain reading and links to the full emails and page copies.';var h=main.querySelector("h1");if(h&&h.parentNode)h.parentNode.insertBefore(p,h.nextSibling);else main.insertBefore(p,main.firstChild);}return;}
  var slug=m[1];if(slug==="journal")return;
  var box=document.createElement("section");box.id="journal";box.innerHTML='<h2>Activity journal</h2><p class="fa-kicker"><a href="/forensic/journal/'+slug+'/">Open the full journal for this institution</a></p>';
  var since=document.getElementById("since"),tgt=since?(since.closest&&since.closest(".cwl-s"))||since:null;box.className="fj-box";if(tgt&&tgt.parentNode)tgt.parentNode.insertBefore(box,tgt);else main.appendChild(box);
  if(!window.fetch||!window.DOMParser)return;
  fetch("/forensic/journal/"+slug+"/",{credentials:"same-origin"}).then(function(r){return r.ok?r.text():"";}).then(function(t){
    if(!t)return;var d=new DOMParser().parseFromString(t,"text/html"),s=d.getElementById("j-"+slug);if(!s)return;
    var h=s.querySelector("h2");if(h)h.parentNode.removeChild(h);
    var st=d.querySelector("head style");if(st&&!document.getElementById("fj-css")){var c=document.createElement("style");c.id="fj-css";c.textContent=st.textContent;document.head.appendChild(c);}
    while(s.firstChild)box.appendChild(s.firstChild);
  }).catch(function(){});
})();


/* Forensic Assessments v1.4.0 — publish the permanent catalogue identity and SemVer on each assessed institution page. */
(function () {
  "use strict";
  var match = location.pathname.match(/^\/forensic\/([a-z0-9-]+)\/?$/);
  if (!match || match[1] === "journal") return;
  var main = document.querySelector("main.faw");
  var kicker = main && main.querySelector(".fa-kicker");
  if (!kicker || document.getElementById("fa-catalogue-ref")) return;
  fetch("/forensic/data.json", { credentials: "same-origin", cache: "no-cache" })
    .then(function (response) { if (!response.ok) throw new Error("Directory unavailable"); return response.json(); })
    .then(function (directory) {
      var record = (directory.institutions || []).filter(function (item) {
        return item.slug === match[1] && item.kind === "assessed";
      })[0];
      if (!record || !record.catalogue_id || !record.version) return;
      var line = document.createElement("p");
      line.id = "fa-catalogue-ref";
      line.className = "fa-catalogue-ref";
      var label = document.createElement("span");
      label.textContent = "Catalogue record: ";
      line.appendChild(label);
      var link = document.createElement("a");
      link.href = "/catalogue/?id=" + encodeURIComponent(record.catalogue_id);
      link.textContent = record.catalogue_id;
      line.appendChild(link);
      line.appendChild(document.createTextNode(" · Semantic version "));
      var version = document.createElement("code");
      version.textContent = "v" + record.version;
      line.appendChild(version);
      kicker.insertAdjacentElement("afterend", line);
    })
    .catch(function () { /* Keep the report readable if the directory cannot be fetched. */ });
})();
