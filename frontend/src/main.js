
import { runDiscovery, searchPapers } from "./api.js";

function esc(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderAgents(rs, done){
  var A=['Query Interpreter','Graph Divergence Mapper','Evidence Harvester',
    'Analogy Engine','Hypothesis Composer','Adversarial Critic','Experimental Program Designer'];
  return A.map(function(name,i){
    var m=(rs||[]).find(function(r){return r.step===i+1;});
    var ok=done||!!m;
    return '<div class="d-arow'+(ok?'':' pend')+'">'
      +'<div class="d-adot'+(ok?' done':'')+'"></div>'
      +'<div class="d-ainfo"><span class="d-aname">'+esc(name)+'</span>'
      +(m?' <span class="d-atag">'+esc((m.tag||'').toUpperCase())+'</span>':'')
      +(m?'<div class="d-asum">'+esc(m.summary)+'</div>':'')
      +'</div></div>';
  }).join('');
}

function renderCards(cards){
  return (cards||[]).map(function(c){
    return '<div class="d-hc" onclick="this.classList.toggle(\'flipped\')">'
      +'<div class="d-hcfront"><div class="d-cagent">'+esc(c.agent)+'</div>'
      +'<div class="d-cscore">'+esc(c.score)+'</div>'
      +'<div class="d-cnov">Novelty: '+esc(c.novelty)+'</div>'
      +'<div class="d-ctitle">'+esc(c.title)+'</div>'
      +'<div class="d-cbody">'+esc(c.front)+'</div>'
      +'<button class="d-cflip">Flip &#x2192;</button></div>'
      +'<div class="d-hcback"><div class="d-ctitle">'+esc(c.title)+'</div>'
      +'<div class="d-cbody">'+esc(c.back)+'</div>'
      +'<button class="d-cflip">&#x2190; Back</button></div></div>';
  }).join('');
}

function renderMetrics(m){
  return Object.entries(m||{}).map(function(kv){
    return '<span class="d-schip">'+esc(kv[0])+'&nbsp;<strong>'+esc(kv[1])+'</strong></span>';
  }).join('');
}

function renderBlock(data){
  var h='';
  h+='<div class="d-ailbl">DVNC &#8212; '+esc(data.model_used||'')+'</div>';
  h+='<div class="d-aisum">'+esc(data.summary)+'</div>';
  h+='<div class="d-oc"><div class="d-och">Primary Hypothesis</div>'
    +'<div class="d-ocb"><p class="d-hyp">'+esc(data.primary_hypothesis)+'</p></div></div>';
  h+='<div class="d-oc"><div class="d-och">7-Agent Reasoning Trace</div>'
    +'<div class="d-ocb"><div class="d-alist">'+renderAgents(data.reasoning,true)+'</div></div></div>';
  if(data.connectome_html){
    h+='<div class="d-oc"><div class="d-och">Connectome &#183; Active Path</div>'
      +'<div class="d-ocb" style="padding:8px;">'+data.connectome_html+'</div></div>';
  }
  if(data.cards&&data.cards.length){
    h+='<div class="d-oc"><div class="d-och">Hypothesis Cards &#8212; tap to flip</div>'
      +'<div class="d-ocb"><div class="d-crow">'+renderCards(data.cards)+'</div></div></div>';
  }
  h+='<div class="d-oc"><div class="d-och">Discovery Metrics</div>'
    +'<div class="d-ocb"><div class="d-schips">'+renderMetrics(data.metrics)+'</div>'
    +'<ol class="d-steps"><li>Construct candidate material or protocol.</li>'
    +'<li>Test mechanistic signal under controlled conditions.</li>'
    +'<li>Compare against baseline alternatives.</li>'
    +'<li>Falsify using adversarial risk criteria.</li></ol></div></div>';
  h+='<div class="d-pacc">'
    +'<div class="d-pacch" onclick="var b=this.nextElementSibling;b.style.display=b.style.display===\'block\'?\'none\':\'block\'">Supporting Papers <span>&#x25be;</span></div>'
    +'<div class="d-paccb"><p style="padding:12px 14px;font-size:12px;color:#aaa;">Switch to Self-Learning Graph tab to search arXiv papers.</p></div></div>';
  return h;
}

function renderSkeleton(model){
  return '<div class="d-ailbl">DVNC &#8212; '+esc(model)+'</div>'
    +'<div class="d-oc"><div class="d-och">Running 7-agent discovery stack&#8230;</div>'
    +'<div class="d-ocb"><div class="d-alist">'+renderAgents([],false)+'</div></div></div>'
    +'<div class="d-skel" style="height:180px;margin-top:10px;"></div>';
}

var state = { model:'DVNC Sovereign', tab:'discovery', hasChat:false };

function switchTab(t){
  state.tab=t;
  ['discovery','papers'].forEach(function(n){
    var p=document.getElementById('dp-'+n);
    var b=document.getElementById('dt-'+n);
    if(p) p.classList.toggle('on',n===t);
    if(b) b.classList.toggle('on',n===t);
  });
}

// Side menu
var sm=document.getElementById('d-sm');
var ov=document.getElementById('d-ov');
document.getElementById('d-openmenu').addEventListener('click',function(){ sm.classList.add('open');ov.classList.add('open'); });
document.getElementById('d-closemenu').addEventListener('click',function(){ sm.classList.remove('open');ov.classList.remove('open'); });
ov.addEventListener('click',function(){ sm.classList.remove('open');ov.classList.remove('open'); });

// New chat
document.getElementById('d-newchat').addEventListener('click',function(){
  var landing=document.getElementById('d-landing');
  var thread=document.getElementById('d-thread');
  if(thread){thread.innerHTML='';thread.classList.add('off');}
  if(landing){landing.style.display='flex';landing.style.opacity='1';}
  document.querySelector('.d-leosvg').classList.remove('dim');
  document.getElementById('d-emblem').classList.remove('vis');
  state.hasChat=false;
  switchTab('discovery');
  sm.classList.remove('open');ov.classList.remove('open');
  var ci=document.getElementById('d-cinput');
  if(ci){ci.value='';ci.disabled=false;ci.focus();}
});

// Tab buttons
document.querySelectorAll('[data-tab]').forEach(function(el){
  el.addEventListener('click',function(){
    var t=el.getAttribute('data-tab');
    if(t){switchTab(t);sm.classList.remove('open');ov.classList.remove('open');}
  });
});

// Model dropdown
var mdrop=document.getElementById('d-mdrop');
function openDrop(e){if(e)e.stopPropagation();mdrop.classList.add('open');}
function closeDrop(){mdrop.classList.remove('open');}
document.getElementById('d-hpill').addEventListener('click',openDrop);
document.getElementById('d-cpill').addEventListener('click',openDrop);
document.addEventListener('click',function(e){
  if(!mdrop.contains(e.target)&&e.target!==document.getElementById('d-hpill')&&e.target!==document.getElementById('d-cpill')) closeDrop();
});
document.querySelectorAll('.d-mopt').forEach(function(opt){
  opt.addEventListener('click',function(){
    var m=opt.getAttribute('data-model');
    state.model=m;
    var sh=m.replace('DVNC ','');
    document.getElementById('d-hpill').innerHTML=m+' <span>&#x25BE;</span>';
    document.getElementById('d-cpill').innerHTML=sh+' &#x25BE;';
    document.querySelectorAll('.d-mopt').forEach(function(o){
      o.classList.remove('sel');
      var c=o.querySelector('.d-mochk');if(c)c.classList.add('off');
    });
    opt.classList.add('sel');
    var chk=opt.querySelector('.d-mochk');if(chk)chk.classList.remove('off');
    closeDrop();
  });
});

// Submit discovery
async function submitQuery(q){
  if(!q||!q.trim()) return;
  var landing=document.getElementById('d-landing');
  var thread=document.getElementById('d-thread');
  if(!state.hasChat){
    if(landing){landing.style.transition='opacity 0.5s';landing.style.opacity='0';setTimeout(function(){landing.style.display='none';},500);}
    document.querySelector('.d-leosvg').classList.add('dim');
    document.getElementById('d-emblem').classList.add('vis');
    state.hasChat=true;
  }
  thread.classList.remove('off');
  var ud=document.createElement('div');ud.className='d-umsg';ud.textContent=q;
  thread.appendChild(ud);
  var ad=document.createElement('div');ad.className='d-aiblock';
  ad.innerHTML=renderSkeleton(state.model);
  thread.appendChild(ad);
  var main=document.querySelector('.d-main');
  if(main) setTimeout(function(){main.scrollTop=main.scrollHeight;},50);
  var ci=document.getElementById('d-cinput');
  var cs=document.getElementById('d-csend');
  if(ci){ci.disabled=true;ci.value='';}
  if(cs) cs.disabled=true;
  try {
    var data = await runDiscovery(q, state.model);
    ad.innerHTML=renderBlock(data);
  } catch(e) {
    ad.innerHTML='<div class="d-ailbl">Error</div><div class="d-aisum">'+esc(e.message)+'</div>';
  } finally {
    if(ci){ci.disabled=false;ci.focus();}
    if(cs) cs.disabled=false;
    if(main) setTimeout(function(){main.scrollTop=main.scrollHeight;},50);
  }
}

var ci=document.getElementById('d-cinput');
var cs=document.getElementById('d-csend');
cs.addEventListener('click',function(){submitQuery(ci.value.trim());});
ci.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitQuery(ci.value.trim());}
});

// Paper search
async function submitPaper(q){
  if(!q||!q.trim()) return;
  var res=document.getElementById('d-presults');
  if(res) res.innerHTML='<div class="d-skel" style="height:60px;margin-bottom:8px;"></div>'.repeat(3);
  try {
    var data = await searchPapers(q);
    if(!data.papers||!data.papers.length){res.innerHTML='<p class="d-empty">No papers found.</p>';return;}
    res.innerHTML=data.papers.map(function(p){
      return '<div class="d-prow"><div>'
        +'<a href="'+esc(p.link)+'" target="_blank" class="d-ptitle">'+esc(p.title)+'</a>'
        +(p.summary?'<div class="d-psum">'+esc(p.summary)+'</div>':'')
        +'</div><span class="d-pbadge">arXiv</span></div>';
    }).join('');
  } catch(e) {
    res.innerHTML='<p class="d-empty">Search failed: '+esc(e.message)+'</p>';
  }
}

var pi=document.getElementById('d-pinput');
var pb=document.getElementById('d-psend');
pb.addEventListener('click',function(){submitPaper(pi.value.trim());});
pi.addEventListener('keydown',function(e){
  if(e.key==='Enter'){e.preventDefault();submitPaper(pi.value.trim());}
});

switchTab('discovery');
