/* 기계학습 실습실 — 앱 엔진 (Pyodide: 브라우저에서 실제 파이썬 실행) */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
const STORE_KEY = 'mlab-v1';
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ───── 저장소 (진행 상황·기록) ───── */
let S = { done: {}, notes: {}, quiz: {}, checks: {}, name: '' };
try { S = Object.assign(S, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); } catch (e) { }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { } };

/* ───── Pyodide 엔진 ───── */
const PY_HARNESS = `
import sys, io, ast, json, base64, contextlib, traceback, warnings
warnings.filterwarnings('ignore')
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
fm.fontManager.addfont('/home/pyodide/NanumGothic.ttf')
plt.rcParams['font.family'] = 'NanumGothic'
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['figure.dpi'] = 100
import pandas as pd
pd.set_option('display.max_rows', 40)
ns = {'__name__': '__main__'}

HINTS = {
 'NameError': '정의되지 않은 이름이에요. 철자를 확인하고, 위쪽 셀(특히 "준비" 셀)을 먼저 실행했는지 확인하세요.',
 'SyntaxError': '문법 오류예요. 괄호·따옴표·콜론(:)과 들여쓰기를 확인하세요.',
 'IndentationError': '들여쓰기가 맞지 않아요. 같은 블록은 같은 칸 수로 맞춰 주세요.',
 'KeyError': '그런 이름의 열(속성)이나 키가 없어요. df.columns 로 이름을 확인하고 따옴표 안 철자를 비교해 보세요.',
 'AttributeError': '그 객체에는 없는 기능이에요. 철자와 대소문자를 확인하세요.',
 'TypeError': '함수에 넣은 값의 종류나 개수가 맞지 않아요.',
 'ValueError': '값이 함수가 기대한 형태가 아니에요. 입력한 데이터의 모양(shape)을 확인해 보세요.',
 'FileNotFoundError': '파일을 찾을 수 없어요. 파일 이름이 data/Iris1.csv 처럼 정확한지 확인하세요.',
 'ZeroDivisionError': '0으로 나눌 수 없어요.',
 'ModuleNotFoundError': '불러오려는 모듈을 사용할 수 없어요. 이름을 확인하세요.',
}

def _figs():
    out = []
    for n in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(n).savefig(buf, format='png', bbox_inches='tight', dpi=110)
        out.append(base64.b64encode(buf.getvalue()).decode())
    plt.close('all')
    return out

def _run(code):
    out = io.StringIO(); items = []; err = None
    try:
        tree = ast.parse(code, '<셀>')
        last = None
        if tree.body and isinstance(tree.body[-1], ast.Expr):
            last = ast.Expression(tree.body.pop().value)
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
            exec(compile(tree, '<셀>', 'exec'), ns)
            if last is not None:
                v = eval(compile(last, '<셀>', 'eval'), ns)
                if v is not None:
                    if hasattr(v, '_repr_html_') and v._repr_html_():
                        items.append(['html', v._repr_html_()])
                    else:
                        items.append(['text', repr(v)])
    except BaseException as e:
        line = getattr(e, 'lineno', None) if isinstance(e, SyntaxError) else None
        for fs in traceback.extract_tb(e.__traceback__):
            if fs.filename == '<셀>': line = fs.lineno
        name = type(e).__name__
        msg = str(e).split(chr(10))[0]
        err = {'type': name, 'msg': msg, 'line': line, 'hint': HINTS.get(name, '')}
    return json.dumps({'stdout': out.getvalue(), 'items': items, 'figs': _figs(), 'err': err})

def _check(code):
    try:
        exec(code, ns)
        return json.dumps({'ok': True})
    except AssertionError as e:
        return json.dumps({'ok': False, 'msg': str(e) or '조건을 만족하지 않아요.'})
    except Exception as e:
        return json.dumps({'ok': False, 'msg': '확인하는 중 오류가 났어요(' + type(e).__name__ + '). 위 코드가 끝까지 실행됐는지, 앞 셀을 먼저 실행했는지 확인하세요.'})

def _reset():
    ns.clear(); ns['__name__'] = '__main__'; plt.close('all')
`;

let pyodide = null;
const setStatus = (txt, cls) => { const b = $('#engine'); b.textContent = txt; b.className = 'engine ' + (cls || ''); };
const ready = (async () => {
  try {
    setStatus('🐍 파이썬 준비 중… (처음 한 번 20~60초)', 'loading');
    await new Promise((res, rej) => { const s = document.createElement('script'); s.src = PYODIDE_URL + 'pyodide.js'; s.onload = res; s.onerror = () => rej(new Error('pyodide.js 로드 실패')); document.head.appendChild(s); });
    pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
    setStatus('📦 pandas · scikit-learn · matplotlib 설치 중…', 'loading');
    await pyodide.loadPackage(['pandas', 'scikit-learn', 'matplotlib']);
    setStatus('📂 실습 데이터 불러오는 중…', 'loading');
    pyodide.FS.mkdir('data');
    for (const f of ['Iris1.csv', 'Iris2.csv']) {
      const r = await fetch('data/' + f); pyodide.FS.writeFile('data/' + f, new Uint8Array(await r.arrayBuffer()));
    }
    const fr = await fetch('assets/NanumGothic.ttf');
    pyodide.FS.writeFile('/home/pyodide/NanumGothic.ttf', new Uint8Array(await fr.arrayBuffer()));
    await pyodide.runPythonAsync(PY_HARNESS);
    setStatus('✅ 파이썬 준비 완료', 'ok');
    return true;
  } catch (e) {
    console.error(e);
    setStatus('⚠️ 파이썬 엔진을 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침하세요.', 'err');
    throw e;
  }
})();
ready.catch(() => { });

async function runPython(code) {
  await ready;
  const f = pyodide.globals.get('_run');
  const r = JSON.parse(f(code)); f.destroy(); return r;
}
async function runCheck(code) {
  await ready;
  const f = pyodide.globals.get('_check');
  const r = JSON.parse(f(code)); f.destroy(); return r;
}
async function resetPython() { await ready; const f = pyodide.globals.get('_reset'); f(); f.destroy(); }

/* ───── 렌더링 ───── */
const lessonOf = id => LESSONS.find(l => l.id === id);
const missionsOf = l => l.blocks.filter(b => b.t === 'mission');
const progressOf = l => { const ms = missionsOf(l); return { done: ms.filter(m => S.done[m.id]).length, total: ms.length }; };

function renderNav(active) {
  let tot = 0, dn = 0;
  const items = LESSONS.map(l => {
    const p = progressOf(l); tot += p.total; dn += p.done;
    const full = p.done === p.total;
    return `<a href="#${l.id}" class="nav-item ${active === l.id ? 'active' : ''}"><span class="nno">${full ? '✓' : l.no}</span><span class="ntxt"><b>${l.title}</b><small>${l.page} · 미션 ${p.done}/${p.total}</small></span></a>`;
  }).join('');
  $('#nav').innerHTML = `<a href="#home" class="nav-item ${active === 'home' ? 'active' : ''}"><span class="nno">⌂</span><span class="ntxt"><b>시작하기</b><small>학습 안내</small></span></a>${items}
    <a href="#report" class="nav-item ${active === 'report' ? 'active' : ''}"><span class="nno">📄</span><span class="ntxt"><b>나의 학습 기록</b><small>내보내기·제출용</small></span></a>`;
  const pct = tot ? Math.round(dn / tot * 100) : 0;
  $('#overall').innerHTML = `<div class="bar"><i style="width:${pct}%"></i></div><small>전체 미션 ${dn}/${tot} (${pct}%)</small>`;
}

function renderHome() {
  const cards = LESSONS.map(l => { const p = progressOf(l); return `<a class="lcard" href="#${l.id}"><span class="lico">${l.icon}</span><div><small>${l.no}단계 · ${l.page}</small><h3>${l.title}</h3><p>${l.goals[0]}</p><div class="mini"><i style="width:${p.total ? p.done / p.total * 100 : 0}%"></i></div></div></a>`; }).join('');
  return `<section class="hero"><h1>🌸 기계학습 실습실</h1><p class="sub">인공지능 기초 · Ⅱ. 인공지능과 학습 · 1. 기계학습 (교과서 59~81쪽)</p>
    <p>교과서의 <b>이론</b>을 읽고, 바로 아래에서 <b>실제 파이썬 코드를 실행</b>하며 확인해요. 설치할 것은 없고, 브라우저에서 모두 실행됩니다.</p></section>
    <div class="how"><div><b>1</b><span>이론 읽기</span></div><div><b>2</b><span>퀴즈로 점검</span></div><div><b>3</b><span>코드 ▶ 실행·수정</span></div><div><b>4</b><span>미션 도전 (자동 채점)</span></div><div><b>5</b><span>생각 정리 기록</span></div></div>
    <div class="note"><b>💡 자기주도 학습 팁</b><ul>
      <li>코드는 <b>고쳐서 다시 실행</b>해도 괜찮아요. 망가지면 <b>↺ 처음 코드로</b> 버튼!</li>
      <li>각 단계의 <b>준비 셀</b>을 먼저 실행하면 어느 단계부터든 시작할 수 있어요.</li>
      <li>미션이 막히면 <b>힌트</b>를 보세요. <b>정답은 미션을 맞힌 뒤에</b> 내 코드와 비교용으로 열려요!</li>
      <li><b>Ctrl+Enter</b> 로 셀을 실행할 수 있어요. 진행 상황은 이 브라우저에 자동 저장됩니다.</li></ul></div>
    <h2>학습 단계</h2><div class="lgrid">${cards}</div>`;
}

function codeCell(b, mission) {
  const start = mission ? b.starter : b.code;
  const rows = Math.min(18, Math.max(3, start.split('\n').length));
  return `<div class="cell ${mission ? 'mission' : ''}" data-id="${b.id}">
    <div class="chead"><h4>${b.title}</h4>${mission ? `<span class="badge ${S.done[b.id] ? 'ok' : ''}" data-badge>${S.done[b.id] ? '✔ 완료' : '미완료'}</span>` : ''}</div>
    <p class="cdesc">${b.desc}</p>
    <div class="editor"><textarea spellcheck="false" rows="${rows}" data-orig="${esc(start)}">${esc(start)}</textarea></div>
    <div class="cbar"><button class="btn run" data-act="run">▶ 실행 <kbd>Ctrl+Enter</kbd></button>
      <button class="btn ghost" data-act="reset">↺ 처음 코드로</button>
      ${mission ? '<button class="btn ghost" data-act="hint">💡 힌트</button><span class="solslot"></span>' : ''}</div>
    ${mission ? `<div class="hintbox" hidden>💡 ${b.hint}</div><div class="solbox" hidden></div><div class="result" hidden></div>` : ''}
    <div class="out" hidden></div></div>`;
}

function quizBlock(b) {
  const items = b.items.map((it, i) => {
    const saved = S.quiz[b.id + '-' + i];
    return `<div class="qitem" data-q="${b.id}-${i}" data-a="${it.a}"><p><b>Q${i + 1}.</b> ${it.q}</p><div class="opts">${it.o.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join('')}</div><div class="why" hidden>${it.why}</div></div>`;
  }).join('');
  return `<div class="quiz"><h4>${b.title}</h4>${items}</div>`;
}

function reflectBlock(b) {
  return `<div class="reflect"><h4>${b.title}</h4>${b.qs.map((q, i) => `<label>${q}<textarea rows="3" data-note="${b.id}-${i}" placeholder="내 생각을 적어 보세요 (자동 저장)">${esc(S.notes[b.id + '-' + i] || '')}</textarea></label>`).join('')}</div>`;
}

/* 위젯 */
function widgetBlock(b) {
  if (b.name === 'chooser') return `<div class="widget" id="${b.id}"><h4>🧭 알고리즘 선택 도우미</h4><p class="cdesc">질문에 답하면 알맞은 학습 유형과 알고리즘을 알려 줘요.</p>
    <div class="wq"><span>1. 학습 데이터에 <b>정답(레이블)</b>이 있나요?</span><div class="seg" data-k="label"><button data-v="yes">있다</button><button data-v="no">없다</button><button data-v="reward">보상으로 학습</button></div></div>
    <div class="wq" data-for="type" hidden><span>2. 예측하려는 값은 어떤 종류인가요?</span><div class="seg" data-k="type"><button data-v="cat">범주(종류·합격/불합격)</button><button data-v="num">연속 수치(기온·가격)</button></div></div>
    <div class="wres" hidden></div></div>`;
  if (b.name === 'metrics') return `<div class="widget" id="${b.id}"><h4>🧮 혼동행렬 계산기</h4><p class="cdesc">교과서의 질병 예측 예시(긍정=질병 있음)로 시작해요. 숫자를 바꾸며 지표가 어떻게 변하는지 관찰해 보세요.</p>
    <div class="cm"><div></div><div class="ch">예측: 질병 O</div><div class="ch">예측: 질병 X</div>
      <div class="ch">실제: 질병 O</div><label>TP<input type="number" min="0" value="9" data-m="tp"></label><label>FN<input type="number" min="0" value="1" data-m="fn"></label>
      <div class="ch">실제: 질병 X</div><label>FP<input type="number" min="0" value="30" data-m="fp"></label><label>TN<input type="number" min="0" value="60" data-m="tn"></label></div>
    <div class="mres"></div><div class="mtip"></div></div>`;
  if (b.name === 'checklist') return `<div class="widget" id="${b.id}"><h4>✅ 문제 해결 6단계 자기 점검</h4><p class="cdesc">이번 단원에서 내가 직접 해 본 것에 체크하세요.</p>
    ${['문제를 기계학습으로 풀 수 있는지 판단하고, 분류/회귀/군집으로 정의했다', '여러 파일을 합치고 데이터 편향을 확인했다', '결측치와 이상치를 찾아 처리했다', '산점도·상관계수로 핵심 속성을 찾았다', '훈련/테스트 데이터로 나누어 fit()으로 학습시켰다', '정확도·혼동행렬·k 변경으로 성능을 평가하고 개선했다'].map((t, i) => `<label class="chk"><input type="checkbox" data-chk="c${i}" ${S.checks['c' + i] ? 'checked' : ''}> ${t}</label>`).join('')}</div>`;
  return '';
}

function bindWidgets(root) {
  const ch = $('#w-chooser', root);
  if (ch) {
    const st = {};
    const upd = () => {
      const tq = $('[data-for=type]', ch), res = $('.wres', ch); let h = '';
      tq.hidden = st.label !== 'yes';
      if (st.label === 'no') h = `<b>군집 · 비지도학습</b><p>정답 없이 비슷한 것끼리 묶는 문제예요. 알고리즘: <code>KMeans</code> (from sklearn.cluster import KMeans)</p>`;
      else if (st.label === 'reward') h = `<b>강화학습</b><p>행동의 결과로 받는 보상을 최대화하도록 스스로 학습해요. 예) 게임 AI, 로봇 제어</p>`;
      else if (st.label === 'yes' && st.type === 'cat') h = `<b>분류 · 지도학습</b><p>알고리즘: <code>KNeighborsClassifier</code>, <code>LogisticRegression</code>, <code>SVC</code>, <code>DecisionTreeClassifier</code></p>`;
      else if (st.label === 'yes' && st.type === 'num') h = `<b>회귀 · 지도학습</b><p>알고리즘: <code>LinearRegression</code> (from sklearn.linear_model import LinearRegression)</p>`;
      res.hidden = !h; res.innerHTML = h;
    };
    ch.addEventListener('click', e => {
      const bt = e.target.closest('button'); if (!bt) return;
      const seg = bt.parentElement; st[seg.dataset.k] = bt.dataset.v;
      if (seg.dataset.k === 'label' && bt.dataset.v !== 'yes') delete st.type;
      seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === bt)); upd();
    });
  }
  const me = $('#w-metrics', root);
  if (me) {
    const calc = () => {
      const g = k => Math.max(0, +$(`[data-m=${k}]`, me).value || 0);
      const tp = g('tp'), fn = g('fn'), fp = g('fp'), tn = g('tn'), n = tp + fn + fp + tn;
      const acc = n ? (tp + tn) / n : 0, pre = tp + fp ? tp / (tp + fp) : 0, rec = tp + fn ? tp / (tp + fn) : 0, f1 = pre + rec ? 2 * pre * rec / (pre + rec) : 0;
      const bar = (name, v, f) => `<div class="mrow"><span>${name}</span><div class="mbar"><i style="width:${v * 100}%"></i></div><b>${(v * 100).toFixed(1)}%</b><small>${f}</small></div>`;
      $('.mres', me).innerHTML = bar('정확도', acc, `(${tp}+${tn}) / ${n}`) + bar('정밀도', pre, `${tp} / (${tp}+${fp})`) + bar('재현율', rec, `${tp} / (${tp}+${fn})`) + bar('F1-점수', f1, '2×정밀도×재현율 / (정밀도+재현율)');
      $('.mtip', me).innerHTML = rec > acc + .15 ? '👀 정확도는 낮은데 재현율은 높아요. 질병 예측처럼 "놓치지 않는 것"이 중요하면 이런 모델도 쓸모가 있어요. 대신 정밀도(헛경보)는 낮죠.' : (pre < .5 ? '👀 정밀도가 낮아요: 긍정이라 예측한 것 중 틀린 게 많아요.' : '');
    };
    me.addEventListener('input', calc); calc();
  }
  root.querySelectorAll('[data-chk]').forEach(c => c.addEventListener('change', () => { S.checks[c.dataset.chk] = c.checked; save(); }));
}

function renderLesson(l) {
  const i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const body = l.blocks.map(b => {
    switch (b.t) {
      case 'theory': return `<section class="theory">${b.html}</section>`;
      case 'quiz': return quizBlock(b);
      case 'code': return codeCell(b, false);
      case 'mission': return codeCell(b, true);
      case 'widget': return widgetBlock(b);
      case 'reflect': return reflectBlock(b);
    } return '';
  }).join('');
  return `<header class="lhead"><small>${l.page}</small><h1>${l.icon} ${l.no}단계. ${l.title}</h1>
    <ul class="goals">${l.goals.map(g => `<li>${g}</li>`).join('')}</ul>
    <button class="btn ghost" id="runall">⏩ 이 단계의 코드 셀을 위에서부터 모두 실행</button></header>${body}
    <nav class="pager">${prev ? `<a href="#${prev.id}">← ${prev.title}</a>` : '<span></span>'}${next ? `<a href="#${next.id}">${next.title} →</a>` : '<a href="#report">학습 기록 보기 →</a>'}</nav>`;
}

function renderReport() {
  const rows = LESSONS.map(l => { const p = progressOf(l); return `<tr><td>${l.no}. ${l.title}</td><td>${p.done}/${p.total}</td></tr>`; }).join('');
  const notes = LESSONS.map(l => { const r = l.blocks.find(b => b.t === 'reflect'); if (!r) return ''; return `<h3>${l.no}. ${l.title}</h3>` + r.qs.map((q, i) => `<div class="rnote"><b>${q}</b><p>${esc(S.notes[r.id + '-' + i] || '(작성 안 함)').replace(/\n/g, '<br>')}</p></div>`).join(''); }).join('');
  return `<header class="lhead"><h1>📄 나의 학습 기록</h1><p>이름을 쓰고 <b>텍스트 파일로 저장</b>하면 선생님께 제출하기 좋아요.</p></header>
    <div class="widget"><label>이름(학번) <input id="myname" type="text" value="${esc(S.name || '')}" placeholder="예) 10101 홍길동"></label>
    <table class="tbl"><tr><th>단계</th><th>미션 완료</th></tr>${rows}</table>
    <div class="cbar"><button class="btn run" id="dl">⬇ 학습 기록 저장(.txt)</button><button class="btn ghost" id="wipe">🗑 모든 기록 지우기</button></div></div>${notes}`;
}

function exportReport() {
  let t = `[기계학습 실습실 학습 기록]\n이름: ${S.name || '(미입력)'}\n저장일: ${new Date().toLocaleString('ko-KR')}\n\n■ 미션 진행\n`;
  LESSONS.forEach(l => { const p = progressOf(l); t += `- ${l.no}. ${l.title}: ${p.done}/${p.total}\n`; });
  t += '\n■ 생각 정리\n';
  LESSONS.forEach(l => { const r = l.blocks.find(b => b.t === 'reflect'); if (!r) return; t += `\n[${l.no}. ${l.title}]\n`; r.qs.forEach((q, i) => { t += `Q. ${q}\nA. ${S.notes[r.id + '-' + i] || '(작성 안 함)'}\n`; }); });
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain;charset=utf-8' }));
  a.download = '기계학습_학습기록.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* 정답은 미션을 맞힌 뒤에만 화면에 만들어진다 */
function unlockSolution(cell, b) {
  if (!cell || $('[data-act=sol]', cell)) return;
  $('.solslot', cell).innerHTML = '<button class="btn ghost" data-act="sol">🔑 모범 정답 비교하기</button>';
  $('.solbox', cell).innerHTML = `<b>모범 정답 예시</b> <small>(내 코드와 비교해 보세요)</small><pre>${esc(b.solution)}</pre>`;
}

/* ───── 셀 실행 ───── */
async function execCell(cell) {
  const ta = $('textarea', cell), out = $('.out', cell), btn = $('[data-act=run]', cell);
  const code = ta.value, id = cell.dataset.id;
  out.hidden = false;
  if (code.includes('____')) { out.innerHTML = `<div class="err">✏️ 아직 빈칸(<code>____</code>)이 남아 있어요. 알맞은 내용으로 바꾼 뒤 실행하세요.</div>`; return false; }
  btn.disabled = true; const old = btn.innerHTML; btn.textContent = '⏳ 실행 중…'; out.innerHTML = '<div class="muted">실행 중…</div>';
  let ok = false;
  try {
    const r = await runPython(code);
    let h = '';
    if (r.stdout) h += `<pre class="stdout">${esc(r.stdout)}</pre>`;
    r.items.forEach(([k, v]) => { h += k === 'html' ? `<div class="tblwrap">${v}</div>` : `<pre class="stdout">${esc(v)}</pre>`; });
    r.figs.forEach(f => { h += `<img class="fig" alt="그래프" src="data:image/png;base64,${f}">`; });
    if (r.err) {
      h += `<div class="err"><b>${esc(r.err.type)}</b>${r.err.line ? ` (${r.err.line}번째 줄)` : ''}: ${esc(r.err.msg)}${r.err.hint ? `<br><span>💬 ${r.err.hint}</span>` : ''}</div>`;
    } else { ok = true; if (!h) h = '<div class="muted">✔ 실행 완료 (출력할 내용이 없어요)</div>'; }
    out.innerHTML = h;
    if (ok && cell.classList.contains('mission')) await gradeMission(cell, id);
  } catch (e) { out.innerHTML = `<div class="err">엔진을 사용할 수 없어요. 페이지를 새로고침해 주세요.</div>`; }
  btn.disabled = false; btn.innerHTML = old;
  return ok;
}

async function gradeMission(cell, id) {
  const l = LESSONS.find(x => x.blocks.some(b => b.id === id)), b = l.blocks.find(x => x.id === id);
  const res = $('.result', cell), r = await runCheck(b.check); res.hidden = false;
  if (r.ok) {
    res.className = 'result good'; res.innerHTML = '🎉 <b>성공!</b> 미션을 해결했어요.';
    S.done[id] = true; save();
    unlockSolution(cell, b);
    const bd = $('[data-badge]', cell); bd.textContent = '✔ 완료'; bd.classList.add('ok'); renderNav(l.id);
  } else { res.className = 'result bad'; res.innerHTML = '🤔 <b>조금만 더!</b> ' + esc(r.msg); }
}

/* ───── 이벤트 ───── */
document.addEventListener('click', e => {
  const q = e.target.closest('.opt');
  if (q) {
    const it = q.closest('.qitem'); if (it.dataset.locked) return;
    const right = +q.dataset.j === +it.dataset.a;
    q.classList.add(right ? 'right' : 'wrong');
    if (right) { it.dataset.locked = 1; $('.why', it).hidden = false; it.querySelectorAll('.opt').forEach(o => o.disabled = true); }
    else { $('.why', it).hidden = true; q.disabled = true; }
    return;
  }
  const bt = e.target.closest('[data-act]'); if (!bt) return;
  const cell = bt.closest('.cell'), act = bt.dataset.act;
  if (act === 'run') execCell(cell);
  else if (act === 'reset') { const ta = $('textarea', cell); ta.value = ta.dataset.orig; autosize(ta); }
  else if (act === 'hint') $('.hintbox', cell).hidden = false;
  else if (act === 'sol') { const sb = $('.solbox', cell); sb.hidden = !sb.hidden; }
});
document.addEventListener('keydown', e => {
  const ta = e.target.closest && e.target.closest('.editor textarea'); if (!ta) return;
  if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); execCell(ta.closest('.cell')); }
});
document.addEventListener('input', e => {
  if (e.target.matches('textarea[data-note]')) { S.notes[e.target.dataset.note] = e.target.value; save(); }
  if (e.target.matches('.editor textarea')) autosize(e.target);
  if (e.target.id === 'myname') { S.name = e.target.value; save(); }
});
function autosize(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(520, ta.scrollHeight + 4) + 'px'; }

/* ───── 라우팅 ───── */
function route() {
  const id = (location.hash || '#home').slice(1);
  const main = $('#main'); let active = id;
  const l = lessonOf(id);
  if (l) main.innerHTML = renderLesson(l);
  else if (id === 'report') { main.innerHTML = renderReport(); }
  else { main.innerHTML = renderHome(); active = 'home'; }
  renderNav(active); bindWidgets(main);
  main.querySelectorAll('.editor textarea').forEach(autosize);
  if (l) l.blocks.filter(b => b.t === 'mission' && S.done[b.id]).forEach(b => unlockSolution(main.querySelector(`.cell[data-id="${b.id}"]`), b));
  window.scrollTo(0, 0); document.body.classList.remove('navopen');
  if (id === 'report') {
    $('#dl').onclick = exportReport;
    $('#wipe').onclick = () => { if (confirm('모든 진행 상황과 기록이 지워져요. 계속할까요?')) { S = { done: {}, notes: {}, quiz: {}, checks: {}, name: '' }; save(); route(); } };
  }
  const ra = $('#runall');
  if (ra) ra.onclick = async () => {
    ra.disabled = true;
    for (const c of main.querySelectorAll('.cell:not(.mission)')) { const ok = await execCell(c); if (!ok) { c.scrollIntoView({ block: 'center' }); break; } }
    ra.disabled = false;
  };
}
window.addEventListener('hashchange', route);
$('#menu').addEventListener('click', () => document.body.classList.toggle('navopen'));
$('#resetpy').addEventListener('click', async () => { if (confirm('파이썬의 변수를 모두 초기화할까요? (코드는 그대로예요)')) { await resetPython(); alert('초기화했어요. 각 단계의 준비 셀부터 다시 실행해 주세요.'); } });
route();
