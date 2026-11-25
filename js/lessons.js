/* 레슨 콘텐츠: 교과서 Ⅱ-1 기계학습 (59~81쪽) 흐름에 맞춘 7개 단계
   블록 종류: theory | quiz | code | mission | widget | reflect              */
const FEATS = "['꽃받침 길이', '꽃받침 너비', '꽃잎 길이', '꽃잎 너비']";

const LOAD_IRIS = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.concat([pd.read_csv('data/Iris1.csv'), pd.read_csv('data/Iris2.csv')], ignore_index=True)
df = df.drop(columns='번호')
features = ${FEATS}
df.head()`;

const LESSONS = [
/* ───────────────────────── 1 ───────────────────────── */
{
  id: 'l1', no: 1, title: '기계학습과 문제 해결', page: '교과서 59~60쪽', icon: '🧠',
  goals: ['전통적 프로그래밍과 기계학습의 차이를 설명할 수 있다.', '기계학습으로 풀 문제와 아닌 문제를 구분할 수 있다.', '데이터로 규칙을 "학습"시켜 미래 값을 예측해 본다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>핵심 개념</h3>
      <p><b>기계학습</b>은 데이터를 학습시켜 <b>스스로 규칙을 발견</b>하고, 그 규칙을 새로운 데이터에 적용해 정보를 얻거나 예측하는 기술입니다.</p>
      <div class="compare">
        <div class="cbox"><h4>전통적 프로그래밍</h4>
          <div class="flow"><span>데이터</span><span>+</span><span class="hl">규칙(사람이 작성)</span><span>→ 컴퓨터 →</span><span>결괏값</span></div>
          <p>사람이 규칙을 알고 있을 때. 예) 평균 기온이 가장 높은 해 찾기</p></div>
        <div class="cbox ml"><h4>기계학습</h4>
          <div class="flow"><span>데이터</span><span>+</span><span>결괏값(정답)</span><span>→ 컴퓨터 →</span><span class="hl">규칙(기계가 발견)</span></div>
          <p>규칙을 사람이 찾기 어려울 때. 예) 2050년의 평균 기온 예측하기</p></div>
      </div>
      <div class="tip">💡 기계학습으로 풀 수 있는 문제 = <b>주어진 데이터 안에서 답을 바로 찾기 어렵거나</b>, <b>사람이 명확한 규칙을 찾기 어려운</b> 문제</div>` },
    { t: 'quiz', id: 'q1', title: '🎯 이 문제, 어느 방법이 어울릴까?', items: [
      { q: '서울의 평균 기온이 가장 높았던 해를 찾는다', o: ['전통적 프로그래밍', '기계학습'], a: 0, why: '표 안에 답이 이미 있어요. 모든 값을 비교해 최댓값을 찾는 규칙이 명확합니다.' },
      { q: '2050년의 평균 기온을 예측한다', o: ['전통적 프로그래밍', '기계학습'], a: 1, why: '데이터 안에 답이 없고, 과거 데이터에서 추세(규칙)를 학습해야 합니다.' },
      { q: '학생 5명의 시험 점수 평균을 구한다', o: ['전통적 프로그래밍', '기계학습'], a: 0, why: '계산 규칙(합 ÷ 개수)이 명확해서 학습이 필요 없어요.' },
      { q: '사진 속 동물이 강아지인지 고양이인지 구분한다', o: ['전통적 프로그래밍', '기계학습'], a: 1, why: '"강아지다움"을 규칙으로 직접 쓰기 어렵지만, 많은 사진으로 학습하면 패턴을 찾아요.' },
      { q: '스팸 메일을 자동으로 걸러낸다', o: ['전통적 프로그래밍', '기계학습'], a: 1, why: '스팸의 특징이 계속 바뀌어 사람이 규칙을 다 쓰기 어렵습니다.' },
      { q: '구구단 표를 출력한다', o: ['전통적 프로그래밍', '기계학습'], a: 0, why: '규칙이 완벽히 알려져 있어요.' }] },
    { t: 'code', id: 'l1-c1', title: '① 가상의 기온 데이터 준비하기',
      desc: '교과서 [표 Ⅱ-1]과 같은 형태의 <b>가상 데이터</b>(1907~2022년)를 만듭니다. 실제 값이 아니라 추세를 흉내 낸 학습용 데이터예요. ▶ 실행해 보세요.',
      code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
year = np.arange(1907, 2023)
temp = 11.0 + 0.025 * (year - 1907) + rng.normal(0, 0.6, len(year))
weather = pd.DataFrame({'연도': year, '평균 기온': temp.round(1)})
weather.head()` },
    { t: 'code', id: 'l1-c2', title: '② (가) 전통적 프로그래밍: 가장 더웠던 해는?',
      desc: '규칙이 명확합니다. "평균 기온이 가장 큰 행의 연도를 찾는다" → <code>idxmax()</code>',
      code: `i = weather['평균 기온'].idxmax()
print('가장 더웠던 해:', weather.loc[i, '연도'], '/ 기온:', weather.loc[i, '평균 기온'])` },
    { t: 'code', id: 'l1-c3', title: '③ (나) 기계학습: 2050년의 평균 기온은?',
      desc: '데이터에는 2050년이 없어요. 모델이 <code>fit()</code>으로 "연도와 기온의 관계"를 학습한 뒤 <code>predict()</code>로 예측합니다.',
      code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(weather[['연도']], weather['평균 기온'])      # 학습: 데이터 + 정답 → 규칙

pred = model.predict(pd.DataFrame({'연도': [2050]}))    # 예측
print('2050년 예상 평균 기온:', round(pred[0], 2), '℃')
print('10년마다 오르는 기온(기울기×10):', round(model.coef_[0] * 10, 3), '℃')

future = pd.DataFrame({'연도': np.arange(1907, 2051)})
plt.figure(figsize=(7, 3.5))
plt.scatter(weather['연도'], weather['평균 기온'], s=12, label='관측 데이터')
plt.plot(future['연도'], model.predict(future), color='crimson', label='학습된 규칙(직선)')
plt.xlabel('연도'); plt.ylabel('평균 기온(℃)'); plt.legend(); plt.title('기계학습이 찾은 규칙')
plt.show()` },
    { t: 'mission', id: 'l1-m1', title: '🧪 미션 1: 2100년을 예측해 보세요',
      desc: '위 ③에서 학습한 <code>model</code>을 이용해 <b>2100년</b>의 평균 기온을 <code>pred_2100</code>에 저장하세요. (빈칸 <code>____</code>을 채우세요)',
      starter: `# 빈칸을 채워 보세요
pred_2100 = model.predict(pd.DataFrame({'연도': [____]}))[0]
print('2100년 예상 평균 기온:', round(pred_2100, 2))`,
      check: `assert 'pred_2100' in globals(), 'pred_2100 변수를 만들어 주세요.'
assert abs(pred_2100 - model.predict(pd.DataFrame({'연도':[2100]}))[0]) < 1e-6, '2100년 값이 맞는지 확인하세요.'`,
      hint: '빈칸에는 예측하고 싶은 연도 숫자를 넣어요. 2050을 넣었던 ③번 코드를 참고하세요.',
      solution: `pred_2100 = model.predict(pd.DataFrame({'연도': [2100]}))[0]` },
    { t: 'reflect', id: 'l1-r', title: '✍️ 생각 정리', qs: [
      '이 직선 모델로 2050년을 예측한 것은 믿을 만할까요? 어떤 점이 걱정되나요?',
      '우리 생활에서 기계학습이 쓰이는 예를 하나 찾고, 왜 전통적 프로그래밍으로는 어려운지 써 보세요.'] }
  ]
},

/* ───────────────────────── 2 ───────────────────────── */
{
  id: 'l2', no: 2, title: '데이터 수집과 편향성', page: '교과서 61~65쪽', icon: '📥',
  goals: ['데이터 수집 방법 세 가지를 구분할 수 있다.', '붓꽃 데이터를 불러오고 여러 파일을 하나로 합칠 수 있다.', '데이터 편향성을 확인하고 해소 방법을 설명할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>데이터 수집 방법</h3>
      <table class="tbl"><tr><th>방법</th><th>예</th><th>특징</th></tr>
      <tr><td><b>관찰·측정·설문</b>(수동)</td><td>직접 재기, 온라인 설문</td><td>특별한 기술 없이 가능, 태도·의견 수집에 좋음</td></tr>
      <tr><td><b>자동화 장치·코드</b></td><td>센서(IoT), 웹스크래핑</td><td>실시간·연속·방대한 데이터를 빠르게</td></tr>
      <tr><td><b>공유 사이트</b></td><td>공공데이터포털, 캐글</td><td>양질의 공개 데이터, 토론·교육 자료 공유</td></tr></table>
      <h3>데이터 편향성</h3>
      <p>데이터가 현실을 잘 반영하지 못하고 <b>한쪽으로 치우친 것</b>. 특정 집단이 너무 많거나 적거나 빠졌을 때, 잘못 입력·채워 넣었을 때, 사회의 무의식적 편견이 속성 선택에 들어갔을 때 생깁니다. 편향된 데이터로 학습하면 <b>정확성과 공정성</b>이 떨어져요.</p>` },
    { t: 'quiz', id: 'q2', title: '🎯 수집 방법과 편향 찾기', items: [
      { q: '교실 온도 센서가 1분마다 온도를 기록한다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 1, why: '센서와 IoT 장치를 이용한 자동 수집이에요.' },
      { q: '학급 학생 30명에게 온라인 설문지로 취미를 묻는다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 0, why: '사람들에게 직접 질문하는 수동 수집이에요.' },
      { q: '공공데이터포털에서 기온 CSV 파일을 내려받는다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 2, why: '국가 기관이 공개한 양질의 데이터를 활용하는 방법입니다.' },
      { q: '얼굴 인식 학습 데이터의 90%가 20대 남성 사진이다. 이 문제는?', o: ['데이터 편향성', '결측치', '이상치'], a: 0, why: '특정 집단이 너무 많이 수집되어 다른 집단에서 성능이 떨어질 수 있어요.' }] },
    { t: 'code', id: 'l2-c1', title: '① 붓꽃 데이터 불러오기',
      desc: '1936년 피셔가 측정한 데이터(<code>Iris1.csv</code>)와 이후 추가 수집한 데이터(<code>Iris2.csv</code>)를 <code>pandas</code>로 불러옵니다.',
      code: `import pandas as pd
import matplotlib.pyplot as plt

df1 = pd.read_csv('data/Iris1.csv')   # 기존 측정 데이터
df2 = pd.read_csv('data/Iris2.csv')   # 새로 추가한 데이터

print('df1 크기(행, 열):', df1.shape)
print('df2 크기(행, 열):', df2.shape)
df1.head()` },
    { t: 'code', id: 'l2-c2', title: '② 속성(열)과 데이터 살펴보기',
      desc: '<code>columns</code>로 속성 이름을, <code>info()</code>로 자료형과 빈 값 개수를 확인합니다. <b>종류</b>가 우리가 알고 싶은 정답(레이블)이에요.',
      code: `print('속성 이름:', list(df1.columns))
print()
df1.info()` },
    { t: 'code', id: 'l2-c3', title: '③ 편향이 있는지 확인하기',
      desc: '종류별 개수를 <code>value_counts()</code>로 세어 막대그래프로 봅니다. 한쪽으로 치우쳤나요?',
      code: `counts1 = df1['종류'].value_counts()
print(counts1)

counts1.plot(kind='bar', color=['#0f766e', '#d97706', '#be123c'], figsize=(5, 3))
plt.title('df1의 붓꽃 종류별 개수'); plt.ylabel('개수'); plt.xticks(rotation=0)
plt.show()` },
    { t: 'mission', id: 'l2-m1', title: '🧪 미션 1: 두 데이터를 합쳐 편향 줄이기',
      desc: '<code>pd.concat()</code>으로 df1과 df2를 위아래로 합쳐 <code>df</code>를 만드세요. 합친 뒤 종류별 개수가 <b>모두 50개</b>가 되면 성공!',
      starter: `# 빈칸을 채워 보세요
df = pd.concat([____, ____], ignore_index=True)
print(df['종류'].value_counts())`,
      check: `assert 'df' in globals(), 'df 변수를 만들어 주세요.'
assert len(df) == 150, '합친 데이터는 150행이어야 해요. df1과 df2를 모두 넣었나요?'
assert (df['종류'].value_counts() == 50).all(), '종류별 개수가 50개씩이 아니에요.'`,
      hint: '리스트 안에 합칠 데이터프레임 이름 두 개(df1, df2)를 넣어요.',
      solution: `df = pd.concat([df1, df2], ignore_index=True)` },
    { t: 'code', id: 'l2-c4', title: '④ 합친 결과 확인 (변경 전·후 비교)',
      desc: '미션을 마쳤다면 합치기 전·후를 한눈에 비교해 보세요.',
      code: `fig, ax = plt.subplots(1, 2, figsize=(8, 3), sharey=True)
df1['종류'].value_counts().plot(kind='bar', ax=ax[0], color='#d97706', title='합치기 전(df1)')
df['종류'].value_counts().plot(kind='bar', ax=ax[1], color='#0f766e', title='합친 후(df)')
for a in ax: a.tick_params(axis='x', rotation=0)
plt.show()` },
    { t: 'reflect', id: 'l2-r', title: '✍️ 생각 정리', qs: [
      '편향된 데이터(df1)로만 학습했다면 어떤 종류의 붓꽃을 잘 못 맞출 것 같나요? 왜 그럴까요?',
      '내가 "우리 반 학생의 취미 분석"을 한다면 편향 없이 수집하기 위해 무엇을 조심해야 할까요?'] }
  ]
},

/* ───────────────────────── 3 ───────────────────────── */
{
  id: 'l3', no: 3, title: '데이터 전처리', page: '교과서 66~72쪽', icon: '🧹',
  goals: ['수치형·범주형 데이터, 독립변수·종속변수를 구분할 수 있다.', '결측치와 이상치를 찾아 처리할 수 있다.', '산점도·상관계수로 핵심 속성을 찾을 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>속성의 구분</h3>
      <table class="tbl"><tr><th>기준</th><th>구분</th><th>설명 / 예</th></tr>
      <tr><td rowspan="2">유형</td><td>수치형</td><td>숫자, 연산 가능 (키, 꽃잎 길이)</td></tr>
      <tr><td>범주형</td><td>항목으로 나뉨 (취미, 붓꽃 종류)</td></tr>
      <tr><td rowspan="2">역할</td><td>독립변수(특성)</td><td>결과에 영향을 주는 속성 → <b>X</b></td></tr>
      <tr><td>종속변수(레이블)</td><td>예측하려는 속성 → <b>y</b></td></tr></table>
      <h3>데이터 전처리 4가지</h3>
      <p><b>정제</b>(결측치·이상치 처리) · <b>통합</b>(여러 파일 합치기) · <b>축소</b> · <b>변환</b>(스케일링·인코딩)</p>
      <div class="tip">🔎 <b>결측치</b> = 비어 있는 값 / <b>이상치</b> = 범위를 크게 벗어난 값.<br>
      결측치: 열 제거(손실 큼) · 값 대체(편향 우려) · <b>행 제거</b>(데이터가 부족하면 주의)<br>
      이상치 확인: 기초 통계량, 히스토그램, <b>박스플롯</b></div>` },
    { t: 'code', id: 'l3-c1', title: '① 준비: 데이터 불러오기',
      desc: '이 단계의 모든 실습은 이 <b>준비 셀</b>을 먼저 실행해야 해요. (L2에서 만든 합친 데이터를 다시 만듭니다)',
      code: LOAD_IRIS },
    { t: 'code', id: 'l3-c2', title: '② 속성 유형 구분하기',
      desc: '<code>dtypes</code>로 자료형을 확인하면 수치형(float)과 범주형(object)이 보여요.',
      code: `print(df.dtypes)
print()
X = df[features]       # 독립변수(특성)
y = df['종류']          # 종속변수(레이블)
print('X 모양:', X.shape, '/ y 모양:', y.shape)` },
    { t: 'code', id: 'l3-c3', title: '③ 결측치 만들어 확인하기',
      desc: '붓꽃 데이터에는 빈 값이 없어서, 연습을 위해 <b>일부러 12곳을 비워</b> 봅니다. <code>isnull().sum()</code>은 열마다 빈 값 개수를 세어 줘요.',
      code: `dirty = df.copy()
rng = np.random.default_rng(7)
for col in ['꽃받침 너비', '꽃잎 길이']:
    idx = rng.choice(dirty.index, size=6, replace=False)
    dirty.loc[idx, col] = np.nan

print(dirty.isnull().sum())
print('빈 값이 있는 행의 수:', dirty.isnull().any(axis=1).sum())
dirty[dirty.isnull().any(axis=1)].head()` },
    { t: 'mission', id: 'l3-m1', title: '🧪 미션 1: 결측치가 있는 행 제거하기',
      desc: '<code>dirty</code>에서 <b>빈 값이 있는 행을 제거</b>한 결과를 <code>clean</code>에 저장하세요. 결과에 빈 값이 0개여야 합니다.',
      starter: `# 빈칸에 알맞은 메서드 이름을 넣어 보세요
clean = dirty.____()
print('처리 전:', len(dirty), '행 → 처리 후:', len(clean), '행')
print('남은 빈 값:', clean.isnull().sum().sum())`,
      check: `assert 'clean' in globals(), 'clean 변수를 만들어 주세요.'
assert clean.isnull().sum().sum() == 0, '아직 빈 값이 남아 있어요.'
assert len(clean) == len(dirty.dropna()) and len(clean) < 150, '행을 제거하는 방법을 사용해 보세요.'`,
      hint: '"떨어뜨리다"라는 뜻의 영어 drop 과 결측치(NA)를 합친 이름이에요: drop + na',
      solution: `clean = dirty.dropna()` },
    { t: 'code', id: 'l3-c4', title: '④ 다른 방법: 평균값으로 채우기 (비교 실험)',
      desc: '행을 지우는 대신 <b>열의 평균값으로 대체</b>할 수도 있어요. 데이터 개수는 지켜지지만 값이 한곳으로 몰려 <b>편향</b>될 수 있습니다. 두 방법의 차이를 비교해 보세요.',
      code: `filled = dirty.fillna(dirty.mean(numeric_only=True))
print('제거 방식 행 수:', len(dirty.dropna()), '/ 평균 대체 방식 행 수:', len(filled))
print()
print('꽃잎 길이 표준편차  원본:', round(df['꽃잎 길이'].std(), 3),
      '/ 제거:', round(dirty.dropna()['꽃잎 길이'].std(), 3),
      '/ 평균대체:', round(filled['꽃잎 길이'].std(), 3))` },
    { t: 'code', id: 'l3-c5', title: '⑤ 이상치 찾기: 기초 통계량과 박스플롯',
      desc: '이번엔 <b>입력 실수</b>를 흉내 내요. 꽃잎 길이 5.1을 51.0으로, 꽃받침 너비를 -3.0으로 잘못 입력했다고 합시다. <code>describe()</code>의 최댓값·최솟값과 박스플롯에서 이상한 점이 보이나요?',
      code: `dirty2 = df.copy()
dirty2.loc[10, '꽃잎 길이'] = 51.0     # 소수점 오타
dirty2.loc[70, '꽃받침 너비'] = -3.0   # 말이 안 되는 음수

fig, ax = plt.subplots(1, 2, figsize=(8, 3))
dirty2.boxplot(column='꽃잎 길이', ax=ax[0])
dirty2.boxplot(column='꽃받침 너비', ax=ax[1])
plt.show()
dirty2.describe()` },
    { t: 'mission', id: 'l3-m2', title: '🧪 미션 2: 이상치 제거하기',
      desc: '꽃잎 길이는 <b>10 미만</b>, 꽃받침 너비는 <b>0 초과</b>인 행만 남겨 <code>clean2</code>에 저장하세요. 이상치 2개가 사라져 148행이 되어야 해요.',
      starter: `# 조건의 숫자를 채워 보세요
clean2 = dirty2[(dirty2['꽃잎 길이'] < ____) & (dirty2['꽃받침 너비'] > ____)]
print('처리 후 행 수:', len(clean2))
print('꽃잎 길이 최댓값:', clean2['꽃잎 길이'].max())`,
      check: `assert 'clean2' in globals(), 'clean2 변수를 만들어 주세요.'
assert clean2['꽃잎 길이'].max() < 10, '꽃잎 길이의 이상치가 남아 있어요.'
assert (clean2['꽃받침 너비'] > 0).all(), '꽃받침 너비의 이상치가 남아 있어요.'
assert len(clean2) == 148, '정상 데이터까지 지우지 않았는지 확인하세요. (148행이어야 해요)'`,
      hint: '붓꽃 꽃잎 길이는 보통 1~7cm 정도라 10 미만이면 충분하고, 너비는 0보다 커야 해요.',
      solution: `clean2 = dirty2[(dirty2['꽃잎 길이'] < 10) & (dirty2['꽃받침 너비'] > 0)]` },
    { t: 'code', id: 'l3-c6', title: '⑥ 핵심 속성 찾기 ①: 산점도',
      desc: '어떤 속성 조합이 붓꽃 종류를 잘 구분할까요? 종류별로 색을 달리한 산점도로 봅니다. 색깔이 잘 분리될수록 <b>핵심 속성</b>이에요.',
      code: `colors = {'setosa': '#0f766e', 'versicolor': '#d97706', 'virginica': '#be123c'}
pairs = [('꽃받침 길이', '꽃받침 너비'), ('꽃잎 길이', '꽃잎 너비')]
fig, ax = plt.subplots(1, 2, figsize=(9, 3.8))
for a, (px, py) in zip(ax, pairs):
    for name, g in df.groupby('종류'):
        a.scatter(g[px], g[py], s=18, color=colors[name], label=name)
    a.set_xlabel(px); a.set_ylabel(py)
ax[0].legend()
plt.show()` },
    { t: 'code', id: 'l3-c7', title: '⑦ 핵심 속성 찾기 ②: 상관관계 히트맵',
      desc: '속성끼리의 <b>상관계수</b>(−1~1)를 색으로 표현합니다. 1에 가까울수록 함께 커지는 강한 관계예요.',
      code: `corr = df[features].corr()
fig, ax = plt.subplots(figsize=(5.2, 4.4))
im = ax.imshow(corr, cmap='RdBu_r', vmin=-1, vmax=1)
ax.set_xticks(range(4)); ax.set_xticklabels(features, rotation=40, ha='right')
ax.set_yticks(range(4)); ax.set_yticklabels(features)
for i in range(4):
    for j in range(4):
        ax.text(j, i, f'{corr.iloc[i, j]:.2f}', ha='center', va='center')
plt.colorbar(im); plt.show()` },
    { t: 'mission', id: 'l3-m3', title: '🧪 미션 3: 종류와 가장 관련 깊은 속성은?',
      desc: '종류를 숫자(0,1,2)로 바꾼 뒤, 각 속성과의 상관계수 <b>절댓값이 가장 큰 속성의 이름</b>을 <code>key_feature</code>에 저장하세요.',
      starter: `code = df['종류'].map({'setosa': 0, 'versicolor': 1, 'virginica': 2})
corr_label = df[features].corrwith(code)
print(corr_label.round(3))

# 절댓값이 가장 큰 값의 "이름(인덱스)"을 찾는 메서드는?
key_feature = corr_label.abs().____()
print('핵심 속성:', key_feature)`,
      check: `assert 'key_feature' in globals(), 'key_feature 변수를 만들어 주세요.'
assert key_feature in ['꽃잎 길이', '꽃잎 너비'], '핵심 속성은 꽃잎 쪽에서 나와요. 값을 다시 확인해 보세요.'`,
      hint: '최댓값의 "위치(이름)"를 돌려주는 메서드는 idxmax()입니다. L1에서도 썼어요!',
      solution: `key_feature = corr_label.abs().idxmax()` },
    { t: 'reflect', id: 'l3-r', title: '✍️ 생각 정리', qs: [
      '결측치를 "행 제거"와 "평균 대체" 중 어떤 방법으로 처리하고 싶나요? 어떤 상황에서 그 방법이 더 좋을까요?',
      '이상치는 항상 지워야 할까요? 지우면 안 되는 이상치의 예를 생각해 보세요.'] }
  ]
},

/* ───────────────────────── 4 ───────────────────────── */
{
  id: 'l4', no: 4, title: '학습 유형과 알고리즘 선정', page: '교과서 73~76쪽', icon: '🧭',
  goals: ['군집·분류·회귀 문제를 구분할 수 있다.', '지도·비지도·강화 학습을 설명할 수 있다.', '문제에 알맞은 알고리즘을 고를 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>문제 정의 3가지</h3>
      <table class="tbl"><tr><th></th><th>군집</th><th>분류</th><th>회귀</th></tr>
      <tr><td>학습 방법</td><td>비지도</td><td colspan="2">지도</td></tr>
      <tr><td>정답(레이블) 유무</td><td>✕</td><td>○</td><td>○</td></tr>
      <tr><td>종속변수 유형</td><td>—</td><td>범주형</td><td>수치형</td></tr>
      <tr><td>예</td><td>꽃을 비슷한 것끼리 묶기</td><td>꽃의 종류 예측</td><td>꽃잎 길이 예측</td></tr></table>
      <p><b>지도학습</b>: 레이블이 있는 데이터로 학습 · <b>비지도학습</b>: 레이블 없는 데이터에서 패턴 찾기 · <b>강화학습</b>: 보상은 최대화, 벌은 최소화하는 방향으로 학습</p>
      <h3>알고리즘과 라이브러리 코드</h3>
      <table class="tbl code-tbl"><tr><th>알고리즘</th><th>용도</th><th>sklearn 코드</th></tr>
      <tr><td>선형 회귀</td><td>회귀</td><td><code>from sklearn.linear_model import LinearRegression</code></td></tr>
      <tr><td>로지스틱 회귀</td><td>분류</td><td><code>from sklearn.linear_model import LogisticRegression</code></td></tr>
      <tr><td>k-최근접 이웃(KNN)</td><td>분류</td><td><code>from sklearn.neighbors import KNeighborsClassifier</code></td></tr>
      <tr><td>서포트 벡터 머신(SVM)</td><td>분류</td><td><code>from sklearn.svm import SVC</code></td></tr>
      <tr><td>결정 트리</td><td>분류</td><td><code>from sklearn.tree import DecisionTreeClassifier</code></td></tr></table>` },
    { t: 'widget', name: 'chooser', id: 'w-chooser' },
    { t: 'quiz', id: 'q4', title: '🎯 문제 유형 판별하기', items: [
      { q: '꽃잎 길이·너비를 보고 붓꽃의 "종류"를 맞힌다', o: ['군집', '분류', '회귀'], a: 1, why: '정답이 있고(지도), 예측할 값이 범주(종류)이므로 분류입니다.' },
      { q: '내일 서울의 "최고 기온(℃)"을 예측한다', o: ['군집', '분류', '회귀'], a: 2, why: '정답이 있고(지도), 예측할 값이 연속적인 수치이므로 회귀입니다.' },
      { q: '정답 표시 없는 고객 구매 기록을 비슷한 고객끼리 묶는다', o: ['군집', '분류', '회귀'], a: 0, why: '정답(레이블)이 없는 데이터를 묶는 것은 군집(비지도학습)입니다.' },
      { q: '게임 AI가 점수(보상)를 많이 받는 행동을 스스로 익힌다', o: ['지도학습', '비지도학습', '강화학습'], a: 2, why: '보상은 최대화·벌은 최소화하는 방향으로 학습하는 강화학습이에요.' }] },
    { t: 'code', id: 'l4-c1', title: '① 준비: 데이터 불러오기', desc: '붓꽃 데이터를 불러옵니다.', code: LOAD_IRIS },
    { t: 'code', id: 'l4-c2', title: '② 비지도학습 체험: 정답 없이 묶어 보기',
      desc: '<b>종류(정답)를 가린 채</b> 꽃잎 길이·너비만으로 <code>KMeans</code>가 3개 집단으로 묶습니다. 오른쪽의 실제 종류와 얼마나 비슷한가요?',
      code: `from sklearn.cluster import KMeans

X = df[['꽃잎 길이', '꽃잎 너비']]            # 정답(종류)은 사용하지 않아요!
km = KMeans(n_clusters=3, n_init=10, random_state=0)
group = km.fit_predict(X)

fig, ax = plt.subplots(1, 2, figsize=(9, 3.6))
ax[0].scatter(X['꽃잎 길이'], X['꽃잎 너비'], c=group, cmap='viridis', s=18)
ax[0].set_title('기계가 묶은 군집(비지도)')
real = df['종류'].map({'setosa': 0, 'versicolor': 1, 'virginica': 2})
ax[1].scatter(X['꽃잎 길이'], X['꽃잎 너비'], c=real, cmap='viridis', s=18)
ax[1].set_title('실제 종류(정답)')
for a in ax: a.set_xlabel('꽃잎 길이'); a.set_ylabel('꽃잎 너비')
plt.show()
pd.crosstab(df['종류'], group, rownames=['실제 종류'], colnames=['군집 번호'])` },
    { t: 'mission', id: 'l4-m1', title: '🧪 미션 1: 군집 개수를 바꿔 보기',
      desc: '이번에는 <b>군집을 2개</b>로 묶어 보세요. <code>labels</code>에 결과를 저장하고, 몇 종류가 하나로 합쳐졌는지 관찰해 봅니다.',
      starter: `km2 = KMeans(n_clusters=____, n_init=10, random_state=0)
labels = km2.fit_predict(X)
print('군집 번호별 개수:', pd.Series(labels).value_counts().to_dict())
pd.crosstab(df['종류'], labels)`,
      check: `assert 'labels' in globals(), 'labels 변수를 만들어 주세요.'
assert len(set(labels)) == 2, '군집이 2개가 되도록 n_clusters 값을 바꿔 보세요.'`,
      hint: 'n_clusters는 "묶을 집단의 수"예요. 2개로 묶고 싶으니까?',
      solution: `km2 = KMeans(n_clusters=2, n_init=10, random_state=0)
labels = km2.fit_predict(X)` },
    { t: 'reflect', id: 'l4-r', title: '✍️ 생각 정리', qs: [
      '군집 개수를 2개로 했을 때 어떤 붓꽃끼리 묶였나요? 이유를 그래프로 설명해 보세요.',
      '"정답이 있는 데이터"를 만드는 일은 왜 비용이 많이 들까요?'] }
  ]
},

/* ───────────────────────── 5 ───────────────────────── */
{
  id: 'l5', no: 5, title: '모델 학습', page: '교과서 77~79쪽', icon: '🏋️',
  goals: ['훈련 데이터와 테스트 데이터로 나눌 수 있다.', '<code>fit()</code>으로 KNN 모델을 학습시킬 수 있다.', '학습된 모델로 새 데이터를 예측할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>훈련 데이터와 테스트 데이터</h3>
      <p><b>훈련 데이터</b>로 모델을 만들고, 학습에 쓰지 않은 <b>테스트 데이터</b>로 성능을 평가합니다. 시험 문제를 미리 보고 공부하면 진짜 실력을 알 수 없는 것과 같아요. 보통 테스트 비율은 20~40%.</p>
      <pre class="snip">X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)</pre>
      <h3>모델 학습 3단계</h3>
      <ol><li>알고리즘 선택해 <b>모델 객체</b> 만들기: <code>model = KNeighborsClassifier(n_neighbors=5)</code></li>
      <li><b>학습</b>: <code>model.fit(훈련 데이터, 훈련 데이터의 정답)</code></li>
      <li><b>예측</b>: <code>model.predict(새 데이터)</code></li></ol>
      <div class="tip">🐾 <b>KNN(k-최근접 이웃)</b>: 새 데이터와 가장 가까운 <b>k개 이웃</b>의 종류를 보고 다수결로 정해요. "친구 따라 강남 간다" 알고리즘!</div>` },
    { t: 'code', id: 'l5-c1', title: '① 준비 + 훈련/테스트 데이터 나누기',
      desc: '전체 150개 중 20%를 테스트용으로 떼어 둡니다. <code>random_state</code>를 고정하면 항상 같은 방식으로 나뉘어요. <b>test_size</b> 값을 바꿔 실행해 보며 개수 변화를 확인해 보세요!',
      code: LOAD_IRIS + `

from sklearn.model_selection import train_test_split

X = df[features]
y = df['종류']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print('훈련 데이터:', X_train.shape, '/ 테스트 데이터:', X_test.shape)
print('훈련 데이터의 종류 분포:', y_train.value_counts().to_dict())` },
    { t: 'code', id: 'l5-c2', title: '② (선택) 정규화: 값의 범위 맞추기',
      desc: '속성마다 값의 범위가 다르면 거리 계산에 영향을 줘요. <code>MinMaxScaler</code>는 모든 값을 0~1로 바꿉니다. <b>훈련 데이터로만 fit</b>하고 테스트 데이터는 transform만 한다는 점에 주목!',
      code: `from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
X_train_s = scaler.fit_transform(X_train)   # 훈련 데이터로 범위를 학습 + 변환
X_test_s = scaler.transform(X_test)         # 테스트 데이터는 변환만

print('정규화 전 최솟값/최댓값:', X_train.min().min(), '/', X_train.max().max())
print('정규화 후 최솟값/최댓값:', X_train_s.min(), '/', X_train_s.max())` },
    { t: 'code', id: 'l5-c3', title: '③ KNN 모델 학습시키고 예측해 보기',
      desc: '<code>fit()</code>으로 학습하고, 테스트 데이터 5개를 <code>predict()</code>로 예측해 실제 정답과 비교합니다.',
      code: `from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)   # 1) 모델 객체 만들기
model.fit(X_train, y_train)                    # 2) 학습

pred = model.predict(X_test)                   # 3) 테스트 데이터 예측
result = pd.DataFrame({'예측': pred[:8], '실제 정답': y_test.values[:8]})
result['일치'] = result['예측'] == result['실제 정답']
result` },
    { t: 'code', id: 'l5-c4', title: '④ k를 바꾸면 경계가 어떻게 달라질까? (시각화)',
      desc: '꽃잎 길이·너비 두 속성으로 KNN이 <b>영역을 나누는 모습</b>을 그립니다. <code>k</code> 값(1, 5, 15, 50…)을 바꿔 가며 다시 실행해 보세요. k가 작으면 들쭉날쭉(과하게 민감), 크면 부드러워져요.',
      code: `k = 5     # ← 이 값을 바꿔 보세요

f2 = ['꽃잎 길이', '꽃잎 너비']
names = ['setosa', 'versicolor', 'virginica']
codes = df['종류'].map({n: i for i, n in enumerate(names)})
m2 = KNeighborsClassifier(n_neighbors=k).fit(df[f2].values, codes)

gx, gy = np.meshgrid(np.linspace(0.5, 7.2, 200), np.linspace(0, 2.8, 200))
zone = m2.predict(np.c_[gx.ravel(), gy.ravel()]).reshape(gx.shape)

plt.figure(figsize=(6.5, 4))
plt.contourf(gx, gy, zone, alpha=0.25, cmap='viridis', levels=[-0.5, 0.5, 1.5, 2.5])
plt.scatter(df[f2[0]], df[f2[1]], c=codes, cmap='viridis', edgecolor='white', s=28)
plt.xlabel(f2[0]); plt.ylabel(f2[1]); plt.title(f'k = {k} 일 때 KNN의 분류 영역')
plt.show()` },
    { t: 'mission', id: 'l5-m1', title: '🧪 미션 1: 새로 발견한 꽃의 종류 맞히기',
      desc: '꽃받침 길이 5.8, 꽃받침 너비 2.7, 꽃잎 길이 5.1, 꽃잎 너비 1.9인 새 꽃을 발견했어요! 학습된 <code>model</code>로 종류를 예측해 <code>answer</code>에 저장하세요.',
      starter: `new_flower = pd.DataFrame([[5.8, 2.7, 5.1, 1.9]], columns=features)
answer = model.____(new_flower)[0]
print('예측한 종류:', answer)`,
      check: `assert 'answer' in globals(), 'answer 변수를 만들어 주세요.'
assert answer == model.predict(pd.DataFrame([[5.8, 2.7, 5.1, 1.9]], columns=features))[0], '예측 결과가 모델의 예측과 달라요.'`,
      hint: '학습 후 새 데이터의 값을 알아낼 때 쓰는 메서드예요. ③번 셀에서 테스트 데이터에 썼어요.',
      solution: `answer = model.predict(new_flower)[0]` },
    { t: 'reflect', id: 'l5-r', title: '✍️ 생각 정리', qs: [
      'k=1 과 k=50 일 때 영역의 모양이 어떻게 달랐나요? 어느 쪽이 새 데이터에 더 잘 맞을 것 같나요?',
      '테스트 데이터를 학습에 함께 쓰면 왜 평가가 믿을 수 없게 될까요?'] }
  ]
},

/* ───────────────────────── 6 ───────────────────────── */
{
  id: 'l6', no: 6, title: '성능 평가와 개선', page: '교과서 80~81쪽', icon: '📊',
  goals: ['정확도·정밀도·재현율·F1-점수를 설명하고 계산할 수 있다.', '혼동행렬을 읽고 잘못 분류한 경우를 찾을 수 있다.', '하이퍼파라미터(k)를 바꿔 성능을 개선할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>평가 지표</h3>
      <table class="tbl"><tr><th>지표</th><th>의미</th><th>언제 중요?</th></tr>
      <tr><td><b>정확도</b></td><td>전체 중 맞춘 비율</td><td>클래스 비율이 비슷할 때</td></tr>
      <tr><td><b>정밀도</b></td><td>긍정이라 예측한 것 중 실제 긍정 비율</td><td>스팸 메일 분류</td></tr>
      <tr><td><b>재현율</b></td><td>실제 긍정 중 모델이 찾아낸 비율</td><td>질병 예측</td></tr>
      <tr><td><b>F1-점수</b></td><td>정밀도와 재현율의 조화평균</td><td>둘의 균형이 필요할 때</td></tr></table>
      <div class="tip">정밀도와 재현율은 <b>서로 상충</b>해요. 하나를 올리면 다른 하나가 내려가기 쉬워서 균형을 보는 F1-점수를 씁니다.</div>` },
    { t: 'widget', name: 'metrics', id: 'w-metrics' },
    { t: 'quiz', id: 'q6', title: '🎯 어떤 지표를 봐야 할까?', items: [
      { q: '스팸 메일 분류기: 정상 메일이 스팸함에 들어가면 곤란하다. 중요한 지표는?', o: ['정밀도', '재현율'], a: 0, why: '"스팸이라고 한 것 중 진짜 스팸의 비율"이 높아야 정상 메일을 덜 잃어요.' },
      { q: '질병 진단 모델: 아픈 사람을 놓치면 위험하다. 중요한 지표는?', o: ['정밀도', '재현율'], a: 1, why: '"실제 환자 중 찾아낸 비율"이 높아야 환자를 놓치지 않아요.' }] },
    { t: 'code', id: 'l6-c1', title: '① 준비: 학습까지 한 번에',
      desc: '이번에는 <b>꽃받침 속성 2개만</b> 사용해 조금 어려운 문제로 만들었어요(정확도가 100%가 아니어야 평가 연습이 되니까요). 나중에 <code>features</code>를 4개로 바꿔 비교해 보세요!',
      code: `import pandas as pd, numpy as np, matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

df = pd.concat([pd.read_csv('data/Iris1.csv'), pd.read_csv('data/Iris2.csv')], ignore_index=True)
features = ['꽃받침 길이', '꽃받침 너비']      # ← 4개로 바꿔 보세요 (꽃잎 길이, 꽃잎 너비 추가)

X, y = df[features], df['종류']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
y_pred = model.predict(X_test)
print('준비 완료! 테스트 데이터', len(X_test), '개')` },
    { t: 'code', id: 'l6-c2', title: '② 정확도 계산하기',
      desc: '예측이 실제 정답과 얼마나 일치하는지 봅니다.',
      code: `from sklearn.metrics import accuracy_score

acc = accuracy_score(y_test, y_pred)
print('정확도:', round(acc, 3), f'({int(acc * len(y_test))}/{len(y_test)}개 정답)')` },
    { t: 'code', id: 'l6-c3', title: '③ 혼동행렬로 어디서 틀렸는지 보기',
      desc: '행은 <b>실제 값</b>, 열은 <b>예측 값</b>이에요. 대각선이 맞춘 개수, 대각선 밖이 틀린 개수입니다. 어떤 종류끼리 헷갈리나요?',
      code: `from sklearn.metrics import confusion_matrix, classification_report

names = ['setosa', 'versicolor', 'virginica']
cm = confusion_matrix(y_test, y_pred, labels=names)

fig, ax = plt.subplots(figsize=(4.6, 4))
ax.imshow(cm, cmap='Blues')
ax.set_xticks(range(3)); ax.set_xticklabels(names, rotation=20)
ax.set_yticks(range(3)); ax.set_yticklabels(names)
ax.set_xlabel('예측 값'); ax.set_ylabel('실제 값'); ax.set_title('혼동행렬')
for i in range(3):
    for j in range(3):
        ax.text(j, i, cm[i, j], ha='center', va='center',
                color='white' if cm[i, j] > cm.max() / 2 else 'black', fontsize=14)
plt.show()
print(classification_report(y_test, y_pred))` },
    { t: 'code', id: 'l6-c4', title: '④ k를 바꿔 가며 성능 비교하기',
      desc: 'k를 1~20까지 바꿔 학습하고 테스트 정확도를 그래프로 그립니다. 어느 k가 가장 좋은가요?',
      code: `ks = list(range(1, 21))
accs = []
for k in ks:
    m = KNeighborsClassifier(n_neighbors=k).fit(X_train, y_train)
    accs.append(m.score(X_test, y_test))

plt.figure(figsize=(6.5, 3.4))
plt.plot(ks, accs, marker='o', color='#0f766e')
plt.xticks(ks); plt.xlabel('k (이웃의 수)'); plt.ylabel('정확도'); plt.grid(alpha=.3)
plt.title('k에 따른 정확도')
plt.show()` },
    { t: 'mission', id: 'l6-m1', title: '🧪 미션 1: 가장 좋은 k 찾기',
      desc: '위 ④의 <code>accs</code> 리스트에서 정확도가 가장 높은 위치를 찾아, 그때의 k를 <code>best_k</code>에 저장하세요. (k는 1부터 시작하고, 리스트 위치는 0부터 시작해요!)',
      starter: `# 최댓값의 "위치"를 찾는 numpy 함수는?
best_k = int(np.____(accs)) + 1
print('가장 좋은 k:', best_k, '/ 그때 정확도:', round(accs[best_k - 1], 3))`,
      check: `assert 'best_k' in globals(), 'best_k 변수를 만들어 주세요.'
assert 1 <= best_k <= 20, 'k는 1~20 사이여야 해요.'
assert accs[best_k - 1] == max(accs), '그 k의 정확도가 가장 높지 않아요. 위치(인덱스)와 k의 관계를 다시 생각해 보세요.'`,
      hint: 'argmax는 "가장 큰 값이 있는 위치"를 돌려줘요. (인덱스 + 1 = k)',
      solution: `best_k = int(np.argmax(accs)) + 1` },
    { t: 'code', id: 'l6-c5', title: '⑤ 도전: 속성을 4개로 늘리면?',
      desc: '꽃잎 속성까지 모두 쓰면 성능이 어떻게 달라지는지 확인해 보세요. (핵심 속성의 힘!)',
      code: `all4 = ['꽃받침 길이', '꽃받침 너비', '꽃잎 길이', '꽃잎 너비']
Xa_tr, Xa_te, ya_tr, ya_te = train_test_split(df[all4], df['종류'], test_size=0.3, random_state=42)
m4 = KNeighborsClassifier(n_neighbors=5).fit(Xa_tr, ya_tr)
print('속성 2개(꽃받침) 정확도:', round(model.score(X_test, y_test), 3))
print('속성 4개 정확도       :', round(m4.score(Xa_te, ya_te), 3))` },
    { t: 'reflect', id: 'l6-r', title: '✍️ 생각 정리', qs: [
      '혼동행렬에서 가장 많이 헷갈린 두 종류는 무엇이었나요? 산점도(L3)와 연결해 이유를 설명해 보세요.',
      '정확도가 높다고 항상 좋은 모델일까요? 질병 예측 사례로 설명해 보세요.'] }
  ]
},

/* ───────────────────────── 7 ───────────────────────── */
{
  id: 'l7', no: 7, title: '종합 도전 & 자유 실습', page: '교과서 82~85쪽', icon: '🏆',
  goals: ['여러 알고리즘의 성능을 비교할 수 있다.', '문제 해결 6단계를 스스로 설계하고 실행할 수 있다.', '자신만의 실험을 설계해 결과를 해석할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>기계학습 문제 해결 6단계 (되돌아가며 개선!)</h3>
      <div class="steps6"><span>① 문제 정의</span><span>② 데이터 수집</span><span>③ 전처리</span><span>④ 유형·알고리즘 선정</span><span>⑤ 모델 학습</span><span>⑥ 성능 평가·수정</span></div>
      <p>⑥에서 성능이 만족스럽지 않으면 ②~⑤ 중 어느 단계로든 돌아가 데이터를 더 모으거나, 속성을 바꾸거나, 알고리즘을 바꿉니다.</p>
      <h3>이번 단계의 핵심 코드 흐름</h3>
      <pre class="snip">import pandas as pd
df = pd.read_csv('Iris.csv')                          # 데이터 불러오기
from sklearn.preprocessing import MinMaxScaler        # 정규화
from sklearn.model_selection import train_test_split  # 데이터 분할
from sklearn.linear_model import LogisticRegression   # 알고리즘
model.fit(X_train, y_train)                           # 모델 학습
from sklearn.metrics import accuracy_score, confusion_matrix  # 평가</pre>` },
    { t: 'code', id: 'l7-c1', title: '① 준비: 데이터 분할',
      desc: '모든 알고리즘을 같은 조건에서 비교하기 위해 같은 훈련/테스트 데이터를 사용합니다.',
      code: LOAD_IRIS + `

from sklearn.model_selection import train_test_split
X, y = df[features], df['종류']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=3)
print('훈련', X_train.shape, '/ 테스트', X_test.shape)` },
    { t: 'code', id: 'l7-c2', title: '② 알고리즘 4개 한 번에 비교하기',
      desc: '교과서에 나온 알고리즘 중 분류에 쓰는 4가지를 모두 학습시켜 정확도를 비교합니다.',
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

models = {
    'KNN': KNeighborsClassifier(n_neighbors=5),
    '로지스틱 회귀': LogisticRegression(max_iter=300),
    'SVM': SVC(),
    '결정 트리': DecisionTreeClassifier(random_state=0),
}
results = {}
for name, m in models.items():
    m.fit(X_train, y_train)
    results[name] = round(m.score(X_test, y_test), 3)

pd.Series(results, name='정확도').sort_values(ascending=False).to_frame()` },
    { t: 'mission', id: 'l7-m1', title: '🧪 미션 1: 가장 성능 좋은 알고리즘 찾기',
      desc: '<code>results</code> 딕셔너리에서 정확도가 가장 높은 알고리즘의 <b>이름</b>을 <code>best_name</code>에 저장하세요.',
      starter: `# max(딕셔너리, key=값을_꺼내는_함수)  →  값이 가장 큰 "키"를 돌려줘요
best_name = max(results, key=results.____)
print('가장 좋은 알고리즘:', best_name, '→', results[best_name])`,
      check: `assert 'best_name' in globals(), 'best_name 변수를 만들어 주세요.'
assert best_name in results and results[best_name] == max(results.values()), '정확도가 가장 높은 알고리즘이 아니에요.'`,
      hint: '딕셔너리에서 키로 값을 꺼내 주는 메서드는 get 이에요.',
      solution: `best_name = max(results, key=results.get)` },
    { t: 'mission', id: 'l7-m2', title: '🧪 미션 2: 나만의 실험 설계 (자유)',
      desc: '아래 틀을 고쳐서 <b>나만의 실험</b>을 해 보세요. 속성 조합, test_size, 알고리즘, 하이퍼파라미터 중 <b>한 가지만</b> 바꾸고 결과를 <code>my_acc</code>에 저장하면 완료예요. 생각 정리에 가설과 결과를 꼭 기록해요.',
      starter: `# 예) 속성을 꽃잎 두 개로 줄이면? / SVC(kernel='linear')를 써 보면? / test_size를 0.5로 하면?
my_features = ['꽃잎 길이', '꽃잎 너비']
Xa, Xb, ya, yb = train_test_split(df[my_features], df['종류'], test_size=0.3, random_state=3)
my_model = DecisionTreeClassifier(max_depth=2, random_state=0).fit(Xa, ya)
my_acc = my_model.score(Xb, yb)
print('내 실험의 정확도:', round(my_acc, 3))`,
      check: `assert 'my_acc' in globals(), 'my_acc 변수를 만들어 주세요.'
assert 0 <= my_acc <= 1, '정확도는 0~1 사이 값이에요.'`,
      hint: '틀의 한 줄만 바꿔서 다시 실행해 보세요. 바꾼 내용과 결과를 아래 "생각 정리"에 기록하면 멋진 보고서가 돼요.',
      solution: `# 정해진 답은 없어요. 바꾼 부분 하나와 결과를 기록해 보세요.` },
    { t: 'code', id: 'l7-c3', title: '🧰 자유 실습장',
      desc: '여기서는 무엇이든 시도해 보세요! <code>df</code>(붓꽃 전체), <code>X_train</code> 등 지금까지의 변수를 모두 쓸 수 있어요. 예: <code>df.describe()</code>, 히스토그램, 다른 알고리즘…',
      code: `# 자유롭게 실험해 보세요
df.groupby('종류').mean(numeric_only=True)` },
    { t: 'widget', name: 'checklist', id: 'w-final' },
    { t: 'reflect', id: 'l7-r', title: '✍️ 나의 실험 보고', qs: [
      '[내 실험] 무엇을 바꿨나요? 바꾸기 전에 어떤 결과를 예상했나요(가설)?',
      '[결과] 실제 정확도는 어땠나요? 예상과 같았나요? 왜 그런 결과가 나왔을지 생각해 보세요.',
      '[배운 점] 이 단원에서 새로 알게 된 것과 더 알고 싶은 것을 써 보세요.'] }
  ]
}
];
