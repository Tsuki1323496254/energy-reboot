/* =========================================================
   精力重启 · 28 天小助手  —  逻辑（纯原生 JS，无依赖）
   数据保存在浏览器 localStorage，不上传服务器。
   ========================================================= */
(function () {
  'use strict';

  const STORE_KEY = 'energy28_v1';
  const DAILY_GOAL = 7; // 6 项清单 + 水（共 7 项）
  const TOTAL_DAYS = 28;

  /* ---------------- 计划内容 ---------------- */
  const WEEKS = [
    {
      n: 1, title: '重启周 · 先把睡眠稳住', focus: '15 分钟专注', color: 'sun',
      tasks: ['23:00 睡 / 7:00 起，周末不差 1 小时', '睡前 1 小时不碰手机', '每天 20 分钟有氧运动']
    },
    {
      n: 2, title: '稳定周 · 让注意力回血', focus: '20 分钟专注', color: 'mint',
      tasks: ['延续固定作息，不补觉', '每天 5–10 分钟冥想', '少喝奶茶和甜饮料']
    },
    {
      n: 3, title: '增强周 · 体能专注加码', focus: '25 分钟专注', color: 'sky',
      tasks: ['运动加到 25 分钟', '午休 20 分钟，15 点后不睡', '关掉多任务，一次只做一件事']
    },
    {
      n: 4, title: '巩固周 · 把好习惯固定下来', focus: '30 分钟专注', color: 'lav',
      tasks: ['运动 25–30 分钟', '用「外脑法」记录待办', '每周复盘一次状态']
    }
  ];
  const WEEK_PRESET = [15, 20, 25, 30];

  const TIPS = [
    {
      emoji: '😴', title: '睡眠修复（最关键，先做这个）', cls: 'sun',
      items: [
        '固定作息：选一个能坚持的睡觉/起床时间（如 23:00–7:00），周末差值不超过 1 小时。',
        '睡前 1 小时「断电」：手机放远或开飞行模式；可以看书、泡脚、听轻音乐、拉伸、写日记。',
        '睡眠环境：房间要黑、要凉（18～22℃）、安静；枕头床垫舒服一点值得花钱。',
        '中午小憩 20 分钟，别超过 30 分钟；下午 3 点后不要再睡。'
      ]
    },
    {
      emoji: '🎯', title: '注意力训练（让大脑重新能打）', cls: 'mint',
      items: [
        '渐进式番茄：第 1 周 15+5 分钟，第 2 周 20+5，第 3 周 25+5，第 4 周 30+5，每天 4～6 轮。',
        '主动学习：边听边手写笔记；每 10 分钟问自己「刚才讲了什么、核心观点是什么」。',
        '走神拉回：发现走神就深呼吸，轻轻把注意力拉回来，不要自责。',
        '减少多任务：关掉无关网页和通知，别一边听课一边刷微信。'
      ]
    },
    {
      emoji: '🏃', title: '身体充电（运动是最好的大脑补品）', cls: 'sky',
      items: [
        '每天 20～30 分钟有氧：跑步、快走、跳绳、骑车都行；心跳加快、微微出汗、说话有点喘但能说。',
        '每坐 1 小时，站起来活动 5 分钟：伸懒腰、走动、深蹲、转脖子。',
        '每天 5～10 分钟冥想/深呼吸：关注呼吸，走神就拉回。',
        '睡前 2 小时内别做剧烈运动。'
      ]
    },
    {
      emoji: '🥗', title: '饮食调整（给大脑喂对燃料）', cls: 'sun',
      items: [
        '早饭一定要吃，且有蛋白质：鸡蛋、牛奶/豆浆、坚果；别只吃包子、粥、面包。',
        '每餐配比：一半蔬菜 + 四分之一蛋白 + 四分之一主食，血糖稳就不容易困。',
        '每天喝水 1500～2000ml（约 7～8 杯），轻度脱水就会注意力下降。',
        '少碰精力杀手：奶茶甜饮料、功能饮料、过量咖啡（一天 ≤2 杯，14 点后不喝）。'
      ]
    },
    {
      emoji: '🧠', title: '健忘怎么办？', cls: 'lav',
      items: [
        '「一件事原则」：一次只做一件事，做完再做下一件。',
        '「外脑法」：重要的事写在备忘录/便签上，大脑用来思考，不是用来记事。',
        '睡眠和注意力改善后，工作记忆和切换能力会自然好转。'
      ]
    },
    {
      emoji: '✅', title: '第一周就做这 5 件', cls: 'mint',
      items: [
        '每天 23:00 睡、7:00 起（周末也一样）',
        '睡前 1 小时不碰手机',
        '每天运动 20 分钟',
        '用「15 分钟专注 + 5 分钟休息」学习',
        '早饭加个鸡蛋'
      ]
    }
  ];

  const TIP_STRIP = [
    { t: '💡 小贴士', s: '睡前 1 小时把手机放到另一个房间，大脑会更快安静下来。' },
    { t: '💡 小贴士', s: '走神不是失败，拉回来一次，注意力就强一点。' },
    { t: '💡 小贴士', s: '早餐加个鸡蛋或一杯牛奶，上午 10 点不那么困。' },
    { t: '💡 小贴士', s: '每坐 1 小时站起来动 5 分钟，大脑供血立刻回来。' },
    { t: '💡 小贴士', s: '一次只做一件事，比同时开三个任务快得多。' },
    { t: '💡 小贴士', s: '午睡别超过 20 分钟，不然醒来更懵。' }
  ];

  /* ---------------- 工具函数 ---------------- */
  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtDate = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parseDate(s); d.setDate(d.getDate() + n); return fmtDate(d); };
  const diffDays = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);
  const todayStr = () => fmtDate(new Date());
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const norm = (s) => (s || '').replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));

  function safeStore() {
    try {
      localStorage.setItem('__t', '1');
      localStorage.removeItem('__t');
      return localStorage;
    } catch (e) { return null; }
  }
  const LS = safeStore();
  let memory = null;

  /* ---------------- 状态 ---------------- */
  function defaultState() {
    return {
      version: 1,
      startDate: todayStr(),
      settings: { bed: '23:00', wake: '07:00', waterGoal: 8, preset: 0 },
      days: {},
      meta: { created: Date.now() }
    };
  }

  let state = null;
  function loadState() {
    let raw = null;
    try { raw = LS ? LS.getItem(STORE_KEY) : memory; } catch (e) { raw = null; }
    let s = null;
    try { s = raw ? JSON.parse(raw) : null; } catch (e) { s = null; }
    if (!s || typeof s !== 'object' || !s.settings) s = defaultState();
    s.settings = Object.assign(defaultState().settings, s.settings || {});
    s.days = s.days && typeof s.days === 'object' ? s.days : {};
    if (!s.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) s.startDate = todayStr();
    return s;
  }
  function saveState() {
    const raw = JSON.stringify(state);
    try { if (LS) LS.setItem(STORE_KEY, raw); else memory = raw; } catch (e) { memory = raw; }
  }

  /* ---------------- 日数据 ---------------- */
  function dayOf(date) {
    if (!state.days[date]) state.days[date] = { checks: {}, water: 0, focusRounds: 0, focusMins: 0 };
    const d = state.days[date];
    d.checks = d.checks && typeof d.checks === 'object' ? d.checks : {};
    d.water = Number(d.water) || 0;
    d.focusRounds = Number(d.focusRounds) || 0;
    d.focusMins = Number(d.focusMins) || 0;
    return d;
  }
  function peekDay(date) {
    return state.days[date] || { checks: {}, water: 0, focusRounds: 0, focusMins: 0 };
  }
  function dayScore(date) {
    const d = peekDay(date);
    return CHECK_DEFS.reduce((n, it) => n + (it.done(d) ? 1 : 0), 0);
  }
  function isDoneDay(date) { return dayScore(date) >= 5; }

  function weekOfDayIndex(idx) { return clamp(Math.ceil(idx / 7), 1, 4); }
  function dayIndex() { return diffDays(state.startDate, todayStr()) + 1; }

  const CHECK_DEFS = [
    {
      id: 'sleep', emoji: '😴', title: '按时睡 / 起',
      sub: () => state.settings.bed + ' 睡 · ' + state.settings.wake + ' 起',
      done: (d) => !!d.checks.sleep, set: (d, v) => { d.checks.sleep = v; }
    },
    {
      id: 'noPhone', emoji: '📵', title: '睡前 1 小时不碰手机',
      sub: () => '给大脑关个机',
      done: (d) => !!d.checks.noPhone, set: (d, v) => { d.checks.noPhone = v; }
    },
    {
      id: 'exercise', emoji: '🏃', title: '运动',
      sub: () => (weekOfDayIndex(dayIndex()) >= 3 ? '25–30 分钟有氧' : '20 分钟有氧'),
      done: (d) => !!d.checks.exercise, set: (d, v) => { d.checks.exercise = v; }
    },
    {
      id: 'breakfast', emoji: '🥚', title: '早餐有蛋白质',
      sub: () => '鸡蛋 / 牛奶 / 豆浆 / 坚果',
      done: (d) => !!d.checks.breakfast, set: (d, v) => { d.checks.breakfast = v; }
    },
    {
      id: 'meditation', emoji: '🧘', title: '冥想 / 深呼吸',
      sub: () => '5–10 分钟，走神就拉回',
      done: (d) => !!d.checks.meditation, set: (d, v) => { d.checks.meditation = v; }
    },
    {
      id: 'focus', emoji: '🍅', title: '番茄专注',
      sub: () => '完成 ≥1 轮（' + focusMinutes() + ' 分钟）',
      done: (d) => d.focusRounds >= 1, set: (d, v) => { if (!v) d.focusRounds = 0; }
    },
    {
      id: 'water', emoji: '💧', title: '喝够水',
      sub: () => '目标 ' + state.settings.waterGoal + ' 杯',
      done: (d) => d.water >= state.settings.waterGoal,
      set: (d, v) => { d.water = v ? state.settings.waterGoal : 0; }
    }
  ];

  function focusMinutes() {
    const preset = Number(state.settings.preset) || 0;
    if (preset) return preset;
    return WEEK_PRESET[weekOfDayIndex(dayIndex()) - 1];
  }

  /* ---------------- DOM 快捷 ---------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  let currentTab = 'today';
  let installPrompt = null;

  /* ---------------- 视图切换 ---------------- */
  function switchTab(tab) {
    if (!document.getElementById('view-' + tab)) return;
    currentTab = tab;
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + tab));
    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (tab === 'today') renderToday();
    if (tab === 'focus') renderFocus();
    if (tab === 'plan') renderPlan();
    if (tab === 'tips') renderTips();
    if (tab === 'me') renderMe();
  }

  /* ---------------- 今天 ---------------- */
  function renderToday() {
    const today = todayStr();
    const d = dayOf(today);
    const idx = dayIndex();
    const week = weekOfDayIndex(idx);
    const score = CHECK_DEFS.filter((it) => it.done(d)).length;
    const pct = Math.round((score / DAILY_GOAL) * 100);

    $('#dayChip').textContent = idx >= 1 && idx <= TOTAL_DAYS ? ('第 ' + idx + ' 天 / ' + TOTAL_DAYS) : (idx < 1 ? '计划未开始' : '28 天已完成 🎉');
    $('#weekChip').textContent = idx >= 1 && idx <= TOTAL_DAYS ? ('第 ' + week + ' 周 · ' + WEEKS[week - 1].title.split('·')[0].trim()) : '自由模式';

    // 进度环
    const c = 2 * Math.PI * 42;
    const ring = $('#todayRing');
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c * (1 - score / DAILY_GOAL);
    $('#todayPct').textContent = pct + '%';
    $('#checkCount').textContent = score + ' / ' + DAILY_GOAL;
    $('#todayDone').textContent = score;
    $('#todayRounds').textContent = d.focusRounds;
    $('#todayWater').textContent = d.water;
    $('#waterCount').textContent = d.water + ' / ' + state.settings.waterGoal;

    // 表情
    const mascot = $('#mascot');
    mascot.classList.remove('sleepy', 'happy', 'party');
    if (score >= 7) mascot.classList.add('party');
    else if (score >= 3) mascot.classList.add('happy');
    else mascot.classList.add('sleepy');

    // 气泡文案
    const hour = new Date().getHours();
    let bubble;
    if (score >= 7) bubble = '全部完成！今天状态满格，给自己比个耶 ✌️';
    else if (score >= 5) bubble = '已经很棒啦，再把剩下的小事做完就圆满～';
    else if (score >= 3) bubble = '节奏不错！一件一件来，不着急 🌱';
    else if (hour < 10) bubble = '早上好呀，先吃个有蛋白质的早饭吧 🥚';
    else if (hour >= 21) bubble = '晚上啦，准备进入睡前断电模式 📵';
    else bubble = '今天也一起加油鸭～ 先挑一件小事开始 💪';
    $('#mascotBubble').textContent = bubble;

    // 清单
    const list = $('#checklist');
    list.innerHTML = '';
    CHECK_DEFS.forEach((it) => {
      const on = it.done(d);
      const item = el('div', 'check-item' + (on ? ' on' : ''));
      item.dataset.id = it.id;
      item.innerHTML =
        '<div class="emoji-box">' + it.emoji + '</div>' +
        '<div class="txt"><div class="t">' + it.title + '</div><div class="s">' + it.sub() + '</div></div>' +
        '<div class="checkbox"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7.5"/></svg></div>';
      item.addEventListener('click', () => toggleCheck(it.id));
      list.appendChild(item);
    });

    // 喝水
    const cups = $('#cups');
    cups.innerHTML = '';
    for (let i = 0; i < Math.max(8, state.settings.waterGoal); i++) {
      if (i >= state.settings.waterGoal && i >= 8) break;
      const cup = el('div', 'cup' + (i < d.water ? ' on' : ''), '💧');
      cup.title = '第 ' + (i + 1) + ' 杯';
      cup.addEventListener('click', () => tapCup(i));
      cups.appendChild(cup);
    }

    // 番茄小卡
    const preset = focusMinutes();
    $('#focusMini').innerHTML =
      '<div class="fm-emoji">🍅</div>' +
      '<div class="fm-txt"><div class="fm-t">今日 ' + d.focusRounds + ' 轮 · 累计 ' + d.focusMins + ' 分钟</div>' +
      '<div class="fm-s">本周节奏：专注 ' + preset + ' 分钟 + 休息 5 分钟</div></div>' +
      '<button class="btn primary" style="padding:9px 14px;font-size:13px" data-goto="focus">开始</button>';
    $('#focusMini').querySelector('[data-goto]').addEventListener('click', () => switchTab('focus'));

    // 贴士条
    const t = TIP_STRIP[Math.abs(idx) % TIP_STRIP.length];
    $('#tipStrip').innerHTML = '<div class="ts-t">' + t.t + '</div><div class="ts-s">' + t.s + '</div>';

    // 连续天数
    $('#streakNum').textContent = calcStreak(today);
  }

  function toggleCheck(id) {
    const today = todayStr();
    const d = dayOf(today);
    const it = CHECK_DEFS.find((x) => x.id === id);
    if (!it) return;
    const next = !it.done(d);
    it.set(d, next);
    saveState();
    renderToday();
    if (next && CHECK_DEFS.filter((x) => x.done(d)).length === DAILY_GOAL) {
      celebrate();
      toast('🎉 今天全部完成，太棒了！');
    } else if (next && id === 'water') {
      toast('水喝够啦，继续加油 💧');
    }
  }

  function tapCup(i) {
    const d = dayOf(todayStr());
    d.water = (d.water === i + 1) ? i : i + 1;
    saveState();
    renderToday();
    if (d.water >= state.settings.waterGoal) toast('💧 今天的水喝够了！');
  }

  function calcStreak(today) {
    let streak = 0;
    let cursor = today;
    if (!isDoneDay(today)) cursor = addDays(today, -1);
    while (isDoneDay(cursor) && streak < 3650) {
      streak++;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  /* ---------------- 专注（番茄钟） ---------------- */
  const timer = {
    running: false,
    mode: 'work',       // work | rest
    remain: 15 * 60,
    total: 15 * 60,
    id: null,
    restMin: 5
  };

  function setTimerFromPreset() {
    if (timer.running) return;
    const p = focusMinutes();
    timer.mode = 'work';
    timer.remain = p * 60;
    timer.total = p * 60;
  }

  function renderFocus() {
    const idx = dayIndex();
    const week = weekOfDayIndex(idx);
    setTimerFromPreset();
    $('#focusWeekChip').textContent = '第 ' + week + ' 周 · 专注 ' + focusMinutes() + ' 分钟';
    renderPresets();
    renderRhythm();
    updateTimerUI();
    const d = dayOf(todayStr());
    $('#roundsToday').textContent = d.focusRounds;
    const total = Object.values(state.days).reduce((n, x) => n + (Number(x.focusRounds) || 0), 0);
    const mins = Object.values(state.days).reduce((n, x) => n + (Number(x.focusMins) || 0), 0);
    $('#roundsTotal').textContent = total;
    $('#focusMin').textContent = mins;
    $('#focusModeChip').textContent = timer.mode === 'work' ? '专注' : '休息';
  }

  function renderPresets() {
    const row = $('#presetRow');
    row.innerHTML = '';
    [15, 20, 25, 30].forEach((m) => {
      const b = el('button', 'preset' + (focusMinutes() === m ? ' on' : ''), m + ' 分钟');
      b.addEventListener('click', () => {
        if (timer.running) { toast('先暂停/重置计时器再切换哦'); return; }
        state.settings.preset = m;
        saveState();
        setTimerFromPreset();
        renderFocus();
        renderToday();
      });
      row.appendChild(b);
    });
  }

  function renderRhythm() {
    const list = $('#rhythmList');
    list.innerHTML = '';
    WEEKS.forEach((w) => {
      const row = el('div', 'rhythm-row');
      const active = weekOfDayIndex(dayIndex()) === w.n;
      row.innerHTML = '<span class="rhythm-week">第' + w.n + '周</span><span class="rhythm-time">' + WEEK_PRESET[w.n - 1] + ' 分钟专注 + 5 分钟休息</span>';
      if (active) row.classList.add('on');
      list.appendChild(row);
    });
  }

  function updateTimerUI() {
    const m = Math.floor(timer.remain / 60);
    const s = timer.remain % 60;
    $('#timerTime').textContent = pad2(m) + ':' + pad2(s);
    const c = 2 * Math.PI * 52;
    const ring = $('#timerRing');
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c * (1 - timer.remain / timer.total);
    ring.classList.toggle('rest', timer.mode === 'rest');
    const sub = timer.running ? (timer.mode === 'work' ? '专注中 · 加油' : '休息中 · 放松') : (timer.remain === timer.total ? (timer.mode === 'work' ? '准备开始' : '休息一下') : '已暂停');
    $('#timerSub').textContent = sub;
    $('#btnStart').textContent = timer.running ? '暂停' : (timer.mode === 'work' ? '开始专注' : '开始休息');
    $('#focusModeChip').textContent = timer.mode === 'work' ? '专注' : '休息';
  }

  function startTimer() {
    if (timer.running) { pauseTimer(); return; }
    timer.running = true;
    $('#btnStart').textContent = '暂停';
    timer.id = setInterval(function () {
      timer.remain -= 1;
      if (timer.remain <= 0) {
        timer.remain = 0;
        updateTimerUI();
        finishSession();
        return;
      }
      updateTimerUI();
    }, 1000);
    updateTimerUI();
    beep(660, 0.06);
  }

  function pauseTimer() {
    timer.running = false;
    clearInterval(timer.id);
    updateTimerUI();
  }

  function resetTimer() {
    clearInterval(timer.id);
    timer.running = false;
    setTimerFromPreset();
    updateTimerUI();
  }

  function finishSession() {
    clearInterval(timer.id);
    timer.running = false;
    const today = todayStr();
    const d = dayOf(today);
    if (timer.mode === 'work') {
      d.focusRounds += 1;
      d.focusMins += timer.total / 60;
      saveState();
      celebrate(true);
      toast('🍅 完成 1 轮！休息 5 分钟吧');
      timer.mode = 'rest';
      timer.remain = timer.restMin * 60;
      timer.total = timer.restMin * 60;
      renderFocus();
      renderToday();
      startTimer(); // 自动开始休息
    } else {
      toast('休息结束，准备下一轮吧 💪');
      timer.mode = 'work';
      setTimerFromPreset();
      renderFocus();
    }
    beep(880, 0.12);
    vibrate([120, 60, 120]);
  }

  function skipSession() {
    if (!timer.running) {
      timer.remain = 0;
      finishSession();
      return;
    }
    toast('先完成这一轮再跳过吧～');
  }

  /* ---------------- 28 天计划 ---------------- */
  function renderPlan() {
    const doneDays = [];
    for (let i = 0; i < TOTAL_DAYS; i++) {
      if (isDoneDay(addDays(state.startDate, i))) doneDays.push(i);
    }
    const pct = Math.round((doneDays.length / TOTAL_DAYS) * 100);
    const c = 2 * Math.PI * 42;
    const ring = $('#planRing');
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c * (1 - doneDays.length / TOTAL_DAYS);
    $('#planPct').textContent = pct + '%';
    $('#planRange').textContent = state.startDate + ' ~ ' + addDays(state.startDate, TOTAL_DAYS - 1) + ' · 已达标 ' + doneDays.length + ' / ' + TOTAL_DAYS + ' 天';

    const host = $('#weeks');
    host.innerHTML = '';
    const today = todayStr();
    WEEKS.forEach((w) => {
      const card = el('div', 'card week-card');
      const head = el('div', 'week-title');
      head.innerHTML = '<div class="week-badge" style="background:' + colorOf(w.color) + '">' + w.n + '</div>' +
        '<div><h3>' + w.title + '</h3></div><span class="wt-focus">' + w.focus + '</span>';
      card.appendChild(head);

      const days = el('div', 'week-days');
      for (let k = 0; k < 7; k++) {
        const i = (w.n - 1) * 7 + k;
        const date = addDays(state.startDate, i);
        const ds = dayScore(date);
        const pill = el('div', 'day-pill');
        if (isDoneDay(date)) pill.classList.add('done');
        if (date === today) pill.classList.add('today');
        if (poseCompare(date, today) > 0) pill.classList.add('future');
        pill.innerHTML = '<b>' + (i + 1) + '</b>' + (ds > 0 ? ds + '/7' : '·');
        pill.title = date + ' · ' + ds + '/7';
        days.appendChild(pill);
      }
      card.appendChild(days);

      const tasks = el('div', 'week-tasks');
      w.tasks.forEach((t) => { tasks.appendChild(el('span', null, '· ' + t)); });
      card.appendChild(tasks);
      host.appendChild(card);
    });
  }

  function poseCompare(a, b) { return diffDays(a, b); }
  function colorOf(c) {
    return { sun: '#FFD166', mint: '#8FE3C0', sky: '#9CD3FF', lav: '#CDBDFF' }[c] || '#FFD166';
  }

  /* ---------------- 贴士 ---------------- */
  function renderTips() {
    const host = $('#tipsList');
    host.innerHTML = '';
    TIPS.forEach((t) => {
      const card = el('div', 'card tip-card ' + t.cls);
      const h = el('h3', null, '<span class="tip-emoji">' + t.emoji + '</span><span>' + t.title + '</span>');
      card.appendChild(h);
      const ul = el('ul', 'tip-list');
      t.items.forEach((x) => { ul.appendChild(el('li', null, x)); });
      card.appendChild(ul);
      host.appendChild(card);
    });
  }

  /* ---------------- 我的 ---------------- */
  let deferredInstall = null;
  function renderMe() {
    $('#inpStart').value = state.startDate;
    $('#inpBed').value = state.settings.bed;
    $('#inpWake').value = state.settings.wake;
    $('#inpWater').value = state.settings.waterGoal;
    $('#btnInstall').hidden = !deferredInstall;
  }

  /* ---------------- 通用交互 ---------------- */
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function celebrate(small) {
    const host = $('#confetti');
    const emojis = small ? ['🍅', '✨', '💚'] : ['🎉', '✨', '🍅', '💚', '⭐', '🧡'];
    const n = small ? 8 : 22;
    for (let i = 0; i < n; i++) {
      const s = el('span', null, emojis[i % emojis.length]);
      s.style.left = (8 + Math.random() * 84) + 'vw';
      s.style.animationDelay = (Math.random() * 0.25) + 's';
      s.style.fontSize = (16 + Math.random() * 14) + 'px';
      host.appendChild(s);
      setTimeout(() => s.remove(), 1800);
    }
  }

  let audioCtx = null;
  function beep(freq, dur) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.06;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + (dur || 0.12));
    } catch (e) { /* 忽略 */ }
  }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { } }

  /* ---------------- 备份 / 导入 ---------------- */
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '精力重启-备份-' + todayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('已导出备份 ✅');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const s = JSON.parse(String(reader.result));
        if (!s || !s.settings || !s.days) throw new Error('bad');
        state = s;
        state.settings = Object.assign(defaultState().settings, state.settings);
        state.days = state.days || {};
        if (!/^\d{4}-\d{2}-\d{2}$/.test(state.startDate || '')) state.startDate = todayStr();
        saveState();
        renderToday();
        toast('导入成功 ✅');
      } catch (e) {
        toast('文件格式不对哦');
      }
    };
    reader.readAsText(file);
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    $$('.tab').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));
    document.addEventListener('click', function (e) {
      const goto = e.target.closest('[data-goto]');
      if (goto) switchTab(goto.dataset.goto);
    });

    $('#btnStart').addEventListener('click', startTimer);
    $('#btnReset').addEventListener('click', resetTimer);

    $('#inpStart').addEventListener('change', function () {
      if (!this.value) return;
      state.startDate = this.value;
      saveState();
      toast('开始日期已更新');
      renderToday(); renderPlan();
    });
    $('#inpBed').addEventListener('change', function () { state.settings.bed = this.value || '23:00'; saveState(); renderToday(); });
    $('#inpWake').addEventListener('change', function () { state.settings.wake = this.value || '07:00'; saveState(); renderToday(); });
    $('#inpWater').addEventListener('change', function () {
      state.settings.waterGoal = clamp(parseInt(norm(this.value), 10) || 8, 4, 12);
      saveState(); renderToday();
    });

    $('#btnExport').addEventListener('click', exportData);
    $('#btnImport').addEventListener('click', () => $('#fileImport').click());
    $('#fileImport').addEventListener('change', function () {
      if (this.files && this.files[0]) importData(this.files[0]);
      this.value = '';
    });
    $('#btnResetAll').addEventListener('click', function () {
      if (!confirm('确定清空全部打卡数据吗？此操作不可恢复。')) return;
      state = defaultState();
      saveState();
      renderToday(); renderPlan(); renderMe();
      toast('已清空，重新开始 🌱');
    });

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredInstall = e;
      $('#btnInstall').hidden = false;
    });
    $('#btnInstall').addEventListener('click', async function () {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      try { await deferredInstall.userChoice; } catch (e) { }
      deferredInstall = null;
      $('#btnInstall').hidden = true;
    });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) renderToday();
    });
    setInterval(function () {
      if (currentTab === 'today') renderToday();
    }, 60000);
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    state = loadState();
    saveState();
    if (!LS) {
      setTimeout(function () { toast('提示：当前浏览器不允许本地存储，打卡可能无法保存，建议用浏览器打开或安装 PWA'); }, 900);
    }
    bind();
    renderTips();
    renderToday();
    renderFocus();
    renderPlan();
    renderMe();
    // 打开指定页签（用于调试/分享）：?tab=focus
    try {
      const p = new URLSearchParams(location.search).get('tab');
      if (p) switchTab(p);
    } catch (e) { }

    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.__SINGLE_FILE__) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
