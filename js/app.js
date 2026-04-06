// NP Matte Åk 9 — App Logic
// Handles: tabs, quiz, filters, study plan, progress, dark mode
// Note: innerHTML usage is intentional — all data is from trusted local sources (questions.js),
// not user input. No external/untrusted content is rendered.

// === STATE ===
const EXAM_DATE = new Date(2026, 4, 11); // 11 maj 2026
// Delprov D: 13 maj 2026
let currentFilters = { level: 'all', delprov: 'all', topic: 'all' };
let quizState = null; // { questions, index, scores }

// === STORAGE ===
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem('np_matte_v2')) || { sessionsCompleted: [], questionsAttempted: {}, darkMode: false };
  } catch { return { sessionsCompleted: [], questionsAttempted: {}, darkMode: false }; }
}
function saveProgress(data) {
  localStorage.setItem('np_matte_v2', JSON.stringify(data));
}

// === THEME ===
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  document.querySelector('.theme-toggle').textContent = isDark ? 'Ljust' : 'Mörkt';
  const prog = loadProgress();
  prog.darkMode = isDark;
  saveProgress(prog);
}

// === TABS ===
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.tab-button').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); b.setAttribute('tabindex', '-1'); });
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');
  var panel = document.getElementById(tabId);
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === COUNTDOWN ===
function updateCountdown() {
  const today = new Date();
  const days = Math.ceil((EXAM_DATE - today) / 86400000);
  document.getElementById('countdown').textContent = days > 0 ? days + ' dagar kvar till provet' : 'Provet är här!';
  document.getElementById('daysLeft').textContent = String(Math.max(0, days));
}

// === STUDY PLAN (dynamic) ===
const SESSIONS = [
  { id: 1, title: 'Procent & decimalräkning', time: '30 min', desc: 'E-frågor: procent + aritmetik', filter: { level: 'E', topic: 'procent' } },
  { id: 2, title: 'Ekvationer & algebra', time: '30 min', desc: 'E-frågor: lös ekvationer', filter: { level: 'E', topic: 'algebra' } },
  { id: 3, title: 'Geometri & enheter', time: '30 min', desc: 'E-frågor: area, vinklar, omvandling', filter: { level: 'E', topic: 'geometri' } },
  { id: 4, title: 'Statistik & sannolikhet', time: '30 min', desc: 'E-frågor: medelvärde, median, kombinatorik', filter: { level: 'E', topic: 'statistik' } },
  { id: 5, title: 'E-quiz blandat', time: '40 min', desc: 'Alla E-frågor, alla ämnen — quiz-läge', filter: { level: 'E' } },
  { id: 6, title: 'C-nivå: procent & algebra', time: '40 min', desc: 'C-frågor + redovisning', filter: { level: 'C' } },
  { id: 7, title: 'Redovisningsguiden', time: '40 min', desc: 'Läs "Redovisning"-fliken på djupet', view: 'view-redovisning' },
  { id: 8, title: 'Delprov C-walkthrough', time: '45 min', desc: 'Guidad genomgång av en undersökningsuppgift', view: 'view-exam' },
  { id: 9, title: 'Delprov D-övning', time: '40 min', desc: 'Riktiga D-uppgifter med redovisning', filter: { delprov: 'D', level: 'E' } },
  { id: 10, title: 'Vanliga fällor + blandad quiz', time: '30 min', desc: 'Läs fällorna i Provdagen + quiz', view: 'view-exam' },
  { id: 11, title: 'Kvällen innan B+C', time: '20 min', desc: 'Mental förberedelse + snabbquiz', view: 'view-exam' },
];

function renderStudyPlan() {
  const container = document.getElementById('planContainer');
  const prog = loadProgress();
  const today = new Date();
  const daysLeft = Math.max(1, Math.ceil((EXAM_DATE - today) / 86400000));
  const interval = Math.max(1, Math.floor(daysLeft / SESSIONS.length));

  const dayNames = ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'];
  const monthNames = ['jan','feb','mar','apr','maj','jun'];

  // Build plan HTML from trusted static data
  const parts = [];
  SESSIONS.forEach(function(s, i) {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() + i * interval);
    if (s.id === 11) sessionDate.setTime(new Date(2026, 4, 9).getTime());

    const isToday = sessionDate.toDateString() === today.toDateString();
    const completed = prog.sessionsCompleted.indexOf(s.id) !== -1;
    let cls = 'session-card';
    if (isToday) cls += ' today';
    if (completed) cls += ' completed';

    const dateStr = dayNames[sessionDate.getDay()] + ' ' + sessionDate.getDate() + ' ' + monthNames[sessionDate.getMonth()];
    const btnLabel = completed ? '\u21A9' : '\u2713';
    const btnClass = completed ? 'btn-secondary' : 'btn-primary';

    parts.push('<div class="' + cls + '">' +
      '<div class="session-number">' + s.id + '</div>' +
      '<div class="session-info">' +
        '<div class="session-title">' + s.title + '</div>' +
        '<div class="session-meta">' + s.time + ' \u2014 ' + s.desc + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;align-items:center;">' +
        '<span class="session-date">' + dateStr + '</span>' +
        '<button class="btn btn-sm ' + btnClass + '" onclick="toggleSession(' + s.id + ')">' + btnLabel + '</button>' +
      '</div>' +
    '</div>');
  });

  // Exam days
  parts.push('<div class="session-card exam-day">' +
    '<div class="session-number" style="background:#f59e0b;">!</div>' +
    '<div class="session-info"><div class="session-title">DELPROV B + C</div><div class="session-meta">M\u00E5n 11 maj</div></div></div>');
  parts.push('<div class="session-card">' +
    '<div class="session-number">12</div>' +
    '<div class="session-info"><div class="session-title">Kv\u00E4llen innan D \u2014 Redovisningsfokus</div><div class="session-meta">20 min \u2014 M\u00E5n 12 maj</div></div></div>');
  parts.push('<div class="session-card exam-day">' +
    '<div class="session-number" style="background:#f59e0b;">!</div>' +
    '<div class="session-info"><div class="session-title">DELPROV D</div><div class="session-meta">Ons 13 maj</div></div></div>');

  container.innerHTML = parts.join('');
}

function toggleSession(id) {
  const prog = loadProgress();
  const idx = prog.sessionsCompleted.indexOf(id);
  if (idx === -1) prog.sessionsCompleted.push(id);
  else prog.sessionsCompleted.splice(idx, 1);
  saveProgress(prog);
  renderStudyPlan();
  updateDashboard();
}

// === DASHBOARD ===
const TRAPS = [
  'Visa ALLA steg i Delprov D \u2014 r\u00E4tt svar utan redovisning ger bara E-po\u00E4ng.',
  '13,9 \u2212 8,85 = ? Skriv 13,90 \u2212 8,85 f\u00F6r att undvika decimalfel. Svar: 5,05.',
  '"300% st\u00F6rre \u00E4n 10" = 40, inte 30. 300% AV 10 = 30. 300% ST\u00D6RRE = 10 + 30.',
  'Gl\u00F6m inte enheter! "12" utan "cm\u00B2" kan ge 0 po\u00E4ng.',
  '4,2 mil = 42 km, inte 4,2 km. Kolla enhetsomvandlingar noga.',
  'Medianv\u00E4rde: ordna talen i storleksordning f\u00F6rst! Medianen av 5 tal = det 3:e talet.',
  'Ekvation: g\u00F6r SAMMA sak p\u00E5 b\u00E5da sidor. Subtrahera 5? G\u00F6r det \u00F6verallt.',
  'Sannolikhet: P = gynnsamma / m\u00F6jliga. Gl\u00F6m inte att r\u00E4kna ALLA m\u00F6jliga utfall.',
  'Kontrollera svaret! S\u00E4tt in x-v\u00E4rdet i ursprungsekvationen. Tar 10 sekunder.',
  'L\u00E4s fr\u00E5gan igen innan du svarar. M\u00E5nga svarar p\u00E5 fel fr\u00E5ga under tidspress.',
];

function updateDashboard() {
  const prog = loadProgress();
  var completed = prog.sessionsCompleted.length;
  document.getElementById('sessionsProgress').textContent = completed + '/11';

  // Find next uncompleted session
  var nextSession = null;
  for (var i = 0; i < SESSIONS.length; i++) {
    if (prog.sessionsCompleted.indexOf(SESSIONS[i].id) === -1) {
      nextSession = SESSIONS[i];
      break;
    }
  }
  if (!nextSession) nextSession = SESSIONS[0];

  var info = document.getElementById('todaySessionInfo');
  var today = new Date();
  var daysLeft = Math.max(0, Math.ceil((EXAM_DATE - today) / 86400000));

  if (daysLeft <= 0) {
    info.textContent = 'Provet \u00E4r idag! Kolla Provdagen-fliken.';
  } else {
    info.textContent = 'Pass ' + nextSession.id + ': ' + nextSession.title + ' (' + nextSession.time + ')';
  }

  // Daily trap
  var trapIdx = Math.floor(today.getTime() / 86400000) % TRAPS.length;
  document.getElementById('dailyTrapText').textContent = TRAPS[trapIdx];
}

function startTodaySession() {
  var prog = loadProgress();
  var nextSession = null;
  for (var i = 0; i < SESSIONS.length; i++) {
    if (prog.sessionsCompleted.indexOf(SESSIONS[i].id) === -1) {
      nextSession = SESSIONS[i];
      break;
    }
  }
  if (!nextSession) nextSession = SESSIONS[0];

  if (nextSession.view) {
    var btn = document.querySelector('[aria-controls="' + nextSession.view + '"]');
    if (btn) switchTab(nextSession.view, btn);
  } else if (nextSession.filter) {
    var practiceBtn = document.querySelector('[aria-controls="view-practice"]');
    if (practiceBtn) switchTab('view-practice', practiceBtn);
    if (nextSession.filter.level) setFilter('level', nextSession.filter.level);
    if (nextSession.filter.topic) {
      currentFilters.topic = nextSession.filter.topic;
      var topicSelect = document.getElementById('topicFilter');
      if (topicSelect) topicSelect.value = nextSession.filter.topic;
    }
    if (nextSession.filter.delprov) setFilter('delprov', nextSession.filter.delprov);
    renderPractice();
  }
}

// === FILTERS ===
function setFilter(type, value, btn) {
  currentFilters[type] = value;
  // Find the right filter group and sync chip highlights
  var groups = document.querySelectorAll('#filterBar .filter-group');
  var groupIdx = type === 'level' ? 0 : 1;
  if (btn) {
    var group = btn.parentElement;
    var chips = group.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    btn.classList.add('active');
  } else if (groups[groupIdx]) {
    var chips = groups[groupIdx].querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.remove('active');
      var chipValue = chips[i].textContent === 'Alla' ? 'all' : chips[i].textContent;
      if (chipValue === value) chips[i].classList.add('active');
    }
  }
  renderPractice();
}

function setTopicFilter(value) {
  currentFilters.topic = value;
  renderPractice();
}

function getFilteredQuestions() {
  if (typeof questions === 'undefined') return [];
  return questions.filter(function(q) {
    if (currentFilters.level !== 'all' && q.level !== currentFilters.level) return false;
    if (currentFilters.delprov !== 'all' && q.delprov !== currentFilters.delprov) return false;
    if (currentFilters.topic !== 'all' && q.topic !== currentFilters.topic) return false;
    return true;
  });
}

// === PRACTICE RENDERING ===
// All rendered content is from trusted static data in questions.js, not user input
function renderPractice() {
  quizState = null;
  var filtered = getFilteredQuestions();
  var container = document.getElementById('practiceContainer');
  document.getElementById('questionCount').textContent = filtered.length + ' fr\u00E5gor';

  if (filtered.length === 0) {
    container.textContent = '';
    var msg = document.createElement('div');
    msg.className = 'card';
    msg.textContent = 'Inga fr\u00E5gor matchar filtret. Prova att \u00E4ndra filter.';
    container.appendChild(msg);
    return;
  }

  var parts = [];
  for (var i = 0; i < filtered.length; i++) {
    parts.push(buildQuestionCardHTML(filtered[i], false));
  }
  container.innerHTML = parts.join('');
}

function buildQuestionCardHTML(q, isQuiz) {
  var levelCls = q.level.toLowerCase();
  var figureHtml = q.figureUrl ? '<img class="question-figure" src="' + q.figureUrl + '" alt="' + (q.figureAlt || 'Figur till uppgiften') + '" loading="lazy">' : '';
  var mistakeHtml = q.commonMistake ? '<div class="common-mistake"><strong>Vanlig f\u00E4lla:</strong> ' + q.commonMistake + '</div>' : '';
  var quizBtns = isQuiz ? '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-success" onclick="recordQuizAnswer(\'got\')">\u2713 R\u00E4tt</button>' +
    '<button class="btn btn-secondary" onclick="recordQuizAnswer(\'partial\')">~ Delvis</button>' +
    '<button class="btn btn-danger" onclick="recordQuizAnswer(\'missed\')">\u2717 Missade</button></div>' : '';

  return '<div class="question-card level-' + levelCls + '">' +
    '<div>' +
      '<span class="level-badge badge-' + levelCls + '">Niv\u00E5 ' + q.level + '</span>' +
      '<span class="badge-topic">' + q.delprov + '</span>' +
      '<span class="badge-topic">' + topicLabel(q.topic) + '</span>' +
      '<span class="badge-source">' + q.source + '</span>' +
    '</div>' +
    '<p class="question-text">' + q.question + '</p>' +
    figureHtml +
    '<button class="reveal-btn" onclick="revealAnswer(\'' + q.id + '\')">Visa svar</button>' +
    '<div class="hidden-answer" id="answer-' + q.id + '">' +
      '<h4>Svar: ' + q.answer + '</h4>' +
      '<p>' + q.solution + '</p>' +
      mistakeHtml +
    '</div>' +
    quizBtns +
  '</div>';
}

function topicLabel(topic) {
  var labels = {
    aritmetik: 'Aritmetik', algebra: 'Algebra', geometri: 'Geometri',
    procent: 'Procent', brak: 'Br\u00E5k', statistik: 'Statistik',
    sannolikhet: 'Sannolikhet', kombinatorik: 'Kombinatorik',
    funktioner: 'Funktioner', enheter: 'Enheter'
  };
  return labels[topic] || topic;
}

// === QUIZ ===
function startQuiz() {
  var filtered = getFilteredQuestions();
  if (filtered.length === 0) return;
  quizState = {
    questions: filtered.sort(function() { return Math.random() - 0.5; }),
    index: 0,
    scores: { got: 0, partial: 0, missed: 0 }
  };
  showQuizQuestion();
}

function showQuizQuestion() {
  var container = document.getElementById('practiceContainer');
  var qs = quizState.questions;
  if (quizState.index >= qs.length) {
    showQuizScore();
    return;
  }
  var q = qs[quizState.index];
  var progress = Math.round(((quizState.index + 1) / qs.length) * 100);

  var header = '<div class="card" style="margin-bottom:8px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<span>Fr\u00E5ga ' + (quizState.index + 1) + ' av ' + qs.length + '</span>' +
      '<span style="font-size:0.85em;color:#78716c;">' + quizState.scores.got + ' r\u00E4tt</span>' +
    '</div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
  '</div>';

  container.innerHTML = header + buildQuestionCardHTML(q, true);
}

function recordQuizAnswer(result) {
  var q = quizState.questions[quizState.index];
  quizState.scores[result]++;

  var prog = loadProgress();
  prog.questionsAttempted[q.id] = { result: result, date: new Date().toISOString().slice(0, 10) };
  saveProgress(prog);

  quizState.index++;
  showQuizQuestion();
}

function showQuizScore() {
  var got = quizState.scores.got;
  var partial = quizState.scores.partial;
  var missed = quizState.scores.missed;
  var total = got + partial + missed;
  var pct = total > 0 ? Math.round((got / total) * 100) : 0;
  var feedback = '';
  if (pct >= 80) feedback = 'Utm\u00E4rkt! Du \u00E4r v\u00E4l f\u00F6rberedd.';
  else if (pct >= 60) feedback = 'Bra! Fokusera p\u00E5 det du missade.';
  else if (pct >= 40) feedback = 'OK start. K\u00F6r igen och fokusera p\u00E5 E-fr\u00E5gor.';
  else feedback = 'B\u00F6rja med E-fr\u00E5gor och jobba upp\u00E5t. Du klarar det!';

  document.getElementById('practiceContainer').innerHTML =
    '<div class="card quiz-score">' +
      '<h3>Quiz klar!</h3>' +
      '<div class="score-circle">' + pct + '%</div>' +
      '<p style="font-size:1.1em;margin:16px 0;">' + feedback + '</p>' +
      '<p>R\u00E4tt: <strong>' + got + '</strong> | Delvis: ' + partial + ' | Missade: ' + missed + '</p>' +
      '<div style="margin-top:20px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
        '<button class="btn btn-primary" onclick="startQuiz()">K\u00F6r igen</button>' +
        '<button class="btn btn-secondary" onclick="renderPractice()">Visa alla fr\u00E5gor</button>' +
      '</div>' +
    '</div>';
  quizState = null;
}

// === HELPERS ===
function revealAnswer(qId) {
  var el = document.getElementById('answer-' + qId);
  if (el) el.classList.toggle('visible');
}

function toggleCheckbox(item) {
  var cb = item.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = !cb.checked;
}

function toggleExpand(el) {
  el.classList.toggle('open');
}

// === INIT ===
document.addEventListener('DOMContentLoaded', function() {
  var prog = loadProgress();
  if (prog.darkMode) {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle').textContent = 'Ljust';
  }
  updateCountdown();
  updateDashboard();
  renderStudyPlan();
  renderPractice();
});
