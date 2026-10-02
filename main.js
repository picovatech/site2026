/* ---------- Mobile menu ---------- */
(function(){
  var menu = document.getElementById('menu');
  var btn = document.querySelector('.menu-btn');
  function setMenu(open){
    menu.classList.toggle('mobile-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.textContent = open ? '✕' : '☰';
  }
  btn.addEventListener('click', function(){ setMenu(!menu.classList.contains('mobile-open')); });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  document.addEventListener('click', function(e){
    if(menu.classList.contains('mobile-open') && !menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 850) setMenu(false); });
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();

/* ---------- WhatsApp chat widget ---------- */
(function(){
  var WA_NUMBER = '8801575847515';           // country code + number, no + or spaces
  var SERVICES = ['Web Development','Mobile App','Software','UI/UX Design','AI & Automation','Digital Marketing'];

  var fab = document.getElementById('waFab');
  var panel = document.getElementById('waPanel');
  var body = document.getElementById('waBody');
  var input = document.getElementById('waInput');
  var send = document.getElementById('waSend');
  var teaser = document.getElementById('waTeaser');
  var badge = document.getElementById('waBadge');
  var closeBtn = panel.querySelector('.wa-close');
  var chosen = '';
  var started = false;
  var teaserTimer;

  function scrollDown(){ body.scrollTop = body.scrollHeight; }
  function addMsg(text, who){
    var d = document.createElement('div');
    d.className = 'wa-msg ' + who;
    d.textContent = text;
    body.appendChild(d); scrollDown(); return d;
  }
  function botSay(text, delay, cb){
    var t = document.createElement('div');
    t.className = 'wa-typing'; t.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(t); scrollDown();
    setTimeout(function(){ t.remove(); addMsg(text,'bot'); if(cb) cb(); }, delay);
  }
  function showChips(){
    var wrap = document.createElement('div');
    wrap.className = 'wa-chips';
    SERVICES.forEach(function(s){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'wa-chip'; b.textContent = s;
      b.addEventListener('click', function(){
        chosen = s; wrap.remove();
        addMsg(s, 'user');
        botSay('Great choice! Tell us a little about your project, then tap send to continue on WhatsApp.', 700, function(){ input.focus(); });
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap); scrollDown();
  }
  function startChat(){
    if(started) return; started = true;
    botSay('Hi 👋 Welcome to Picova Tech!', 500, function(){
      botSay('What do you need help with?', 700, showChips);
    });
  }
  function openChat(){
    panel.classList.add('open'); fab.classList.add('open');
    panel.setAttribute('aria-hidden','false'); fab.setAttribute('aria-expanded','true');
    hideTeaser(); startChat();
    if(window.innerWidth > 560) setTimeout(function(){ input.focus(); }, 300);
  }
  function closeChat(){
    panel.classList.remove('open'); fab.classList.remove('open');
    panel.setAttribute('aria-hidden','true'); fab.setAttribute('aria-expanded','false');
  }
  function hideTeaser(){
    teaser.classList.remove('show'); clearTimeout(teaserTimer);
    try{ sessionStorage.setItem('waTeaserSeen','1'); }catch(e){}
  }

  function sendToWhatsApp(){
    var text = input.value.trim();
    if(!text && !chosen){ input.focus(); return; }
    var msg = 'Hello Picova Tech!';
    if(chosen) msg += ' I am interested in ' + chosen + '.';
    if(text) msg += '\n' + text;
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    if(text) addMsg(text, 'user');
    input.value = ''; input.style.height = 'auto';
    window.open(url, '_blank', 'noopener');
    setTimeout(function(){ addMsg('Opening WhatsApp… If it did not open, tap the send button again.', 'bot'); }, 300);
  }

  fab.addEventListener('click', function(){ panel.classList.contains('open') ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);
  send.addEventListener('click', sendToWhatsApp);
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendToWhatsApp(); }
  });
  input.addEventListener('input', function(){
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 96) + 'px';
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && panel.classList.contains('open')) closeChat(); });
  teaser.querySelector('button').addEventListener('click', hideTeaser);
  teaser.querySelector('.wa-teaser-text').addEventListener('click', openChat);

  // Show a small teaser once per visit
  var seen = false;
  try{ seen = sessionStorage.getItem('waTeaserSeen') === '1'; }catch(e){}
  if(!seen){
    teaserTimer = setTimeout(function(){
      if(!panel.classList.contains('open')) teaser.classList.add('show');
    }, 5000);
  } else if(badge){ badge.style.display = 'none'; }
})();
