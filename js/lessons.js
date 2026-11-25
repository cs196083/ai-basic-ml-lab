/* 레슨 콘텐츠 — 교과서 Ⅱ-1 기계학습(59~88쪽)의 실습 코드를 그대로 사용하고, 핵심 줄을 빈칸(____)으로 둔다.
   블록 종류: theory | quiz | code | mission | widget | reflect
   code    : 실행해 보는 셀(교과서 코드 그대로)
   mission : 빈칸을 채우는 셀(자동 채점, 성공하면 모범 정답 공개)                                       */

/* 이상치 인덱스: 교과서 71쪽처럼 IQR 울타리로 찾은 행 번호 (tools/make_data.py 로 계산) */
const OUT_IDX = '[13, 14, 15, 18, 22, 23, 24, 41, 43, 44, 98, 106, 117, 119, 131, 160, 164, 172]';

/* 3단계에서 완성한 df3(결측치·이상치 처리 끝난 데이터)를 다시 만드는 준비 코드 */
const PREP = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import koreanize_matplotlib           # 한글 그래프 설정

df1 = pd.read_csv('Iris1.csv', encoding = 'cp949')
df2 = pd.read_csv('Iris2.csv', encoding = 'cp949')
df = pd.concat([df1, df2], ignore_index = True)     # 2단계: 데이터 통합
df3 = df.dropna(axis = 0, inplace = False)          # 3단계: 결측치 행 제거
df3 = df3.drop(index = ${OUT_IDX}, axis = 0)        # 3단계: 이상치 행 제거
print('전처리가 끝난 df3:', df3.shape)`;

const SPLIT = `X = df3[['꽃잎 길이', '꽃잎 너비']]   # 독립 변수(핵심 속성)
y = df3['종류']                      # 종속 변수
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 7)`;

const LESSONS = [
/* ═════════════════ 1 ═════════════════ */
{
  id: 'l1', no: 1, title: '기계학습과 문제 해결', page: '교과서 59~62쪽', icon: '🧠',
  goals: ['전통적 프로그래밍과 기계학습의 차이를 설명할 수 있다.', '기계학습 문제 해결 6단계를 순서대로 말할 수 있다.', '군집·분류·회귀 문제를 구분해 문제를 정의할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>기계학습이란?</h3>
      <p><b>기계학습</b>은 데이터를 학습시켜 <b>스스로 규칙을 발견</b>하고, 이를 새로운 데이터에 적용하여 정보를 얻거나 예측하는 기술입니다.</p>
      <div class="compare">
        <div class="cbox"><h4>전통적 프로그래밍</h4>
          <div class="flow"><span>데이터</span><span>+</span><span class="hl">규칙(사람이 작성)</span><span>→ 컴퓨터 →</span><span>결괏값</span></div>
          <p>예) 서울의 평균 기온이 가장 높은 해는 언제일까? (모든 값을 비교해 최댓값을 찾는다)</p></div>
        <div class="cbox ml"><h4>기계학습</h4>
          <div class="flow"><span>데이터</span><span>+</span><span>결괏값(정답)</span><span>→ 컴퓨터 →</span><span class="hl">규칙(기계가 발견)</span></div>
          <p>예) 2050년의 평균 기온은 얼마나 될까? (데이터 안에 답이 없다)</p></div>
      </div>
      <h3>문제 해결 6단계</h3>
      <div class="steps6"><span>① 문제 정의</span><span>② 데이터 수집</span><span>③ 데이터 전처리</span><span>④ 유형·알고리즘 선정</span><span>⑤ 모델 학습</span><span>⑥ 성능 평가 및 수정</span></div>
      <h3>문제 정의: 군집 · 분류 · 회귀</h3>
      <table class="tbl"><tr><th></th><th>군집</th><th>분류</th><th>회귀</th></tr>
      <tr><td>학습 방법</td><td>비지도학습</td><td colspan="2">지도학습</td></tr>
      <tr><td>학습 데이터 정답 속성</td><td>✕</td><td>○</td><td>○</td></tr>
      <tr><td>종속변수의 유형</td><td>—</td><td>범주형</td><td>수치형</td></tr></table>
      <div class="tip">📘 이 사이트에서 푸는 붓꽃 문제 — (가) 속성으로 비슷한 꽃끼리 묶기(군집) · (나) 붓꽃의 <b>종류</b> 예측(분류) · (다) 빠진 <b>꽃받침 길이</b> 예측(회귀)</div>
      <p class="muted">코드 실습은 2단계부터 시작해요. 이 단계는 개념을 퀴즈로 점검합니다.</p>` },
    { t: 'quiz', id: 'q1a', title: '🎯 전통적 프로그래밍 vs 기계학습', items: [
      { q: '서울의 평균 기온 데이터에서 평균 기온이 가장 높은 해를 찾는다', o: ['전통적 프로그래밍', '기계학습'], a: 0, why: '데이터 안에 답이 있고, 최댓값을 찾는 규칙이 명확합니다.' },
      { q: '서울의 평균 기온 데이터로 2050년의 평균 기온을 예측한다', o: ['전통적 프로그래밍', '기계학습'], a: 1, why: '데이터 안에 답이 없어서 기계가 스스로 규칙을 학습해 예측해야 합니다.' },
      { q: '"기계학습"에서 컴퓨터에 입력하는 것과 컴퓨터가 만들어 내는 것은?', o: ['입력: 데이터+규칙 / 출력: 결괏값', '입력: 데이터+결괏값 / 출력: 규칙'], a: 1, why: '전통적 프로그래밍과 달리, 데이터와 결괏값(정답)을 주면 기계가 규칙을 생성합니다.' }] },
    { t: 'quiz', id: 'q1b', title: '🎯 문제 정의하기: 군집? 분류? 회귀?', items: [
      { q: '꽃잎·꽃받침 속성만 보고(정답 없이) 서로 다른 꽃끼리 묶는다', o: ['군집', '분류', '회귀'], a: 0, why: '정답(레이블)이 없는 데이터를 비슷한 것끼리 묶는 것은 군집(비지도학습)입니다.' },
      { q: '붓꽃의 속성 네 가지를 이용해 붓꽃의 "종류"를 예측한다', o: ['군집', '분류', '회귀'], a: 1, why: '정답이 있고 예측할 값이 범주(종류)이므로 분류(지도학습)입니다.' },
      { q: '꽃받침 너비·꽃잎 속성으로 빠져 있는 "꽃받침 길이(숫자)"를 예측한다', o: ['군집', '분류', '회귀'], a: 2, why: '정답이 있고 예측할 값이 수치이므로 회귀(지도학습)입니다.' }] },
    { t: 'quiz', id: 'q1c', title: '🎯 6단계에서 어떤 일을 할까?', items: [
      { q: '결측치·이상치를 처리하고 스케일링·인코딩을 하는 단계는?', o: ['데이터 수집', '데이터 전처리', '모델 학습'], a: 1, why: '수집한 데이터를 기계학습에 적합한 형태로 만드는 과정이에요.' },
      { q: '테스트 데이터로 성능을 확인하고 속성이나 알고리즘을 바꿔 보는 단계는?', o: ['성능 평가 및 수정', '문제 정의', '유형과 알고리즘 선정'], a: 0, why: '성능이 낮으면 이전 단계로 돌아가 개선할 수 있어요.' }] },
    { t: 'reflect', id: 'l1-r', title: '✍️ 생각 정리', qs: [
      '내 주변에서 기계학습이 쓰이는 사례를 하나 찾고, 왜 전통적 프로그래밍으로는 어려운지 써 보세요.',
      '"2050년의 평균 기온 예측"은 군집·분류·회귀 중 무엇일까요? 이유와 함께 써 보세요.'] }
  ]
},

/* ═════════════════ 2 ═════════════════ */
{
  id: 'l2', no: 2, title: '데이터 수집과 통합', page: '교과서 63~67쪽', icon: '📥',
  goals: ['데이터 수집 방법 세 가지를 구분할 수 있다.', 'read_csv()로 붓꽃 데이터를 불러올 수 있다.', 'concat()으로 두 데이터를 하나로 통합할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>데이터 수집 방법</h3>
      <table class="tbl"><tr><th>방법</th><th>예</th><th>특징</th></tr>
      <tr><td><b>관찰·측정·설문</b>(수동)</td><td>직접 측정, 온라인 설문지</td><td>특별한 기술 없이 가능, 태도·의견 수집 가능</td></tr>
      <tr><td><b>자동화 장치·코드</b></td><td>센서+사물 인터넷, 웹스크래핑 코드</td><td>실시간·연속·방대한 데이터를 빠르게 수집</td></tr>
      <tr><td><b>공유 사이트</b></td><td>국가 기관·기업의 공개 데이터, 캐글</td><td>양질의 데이터, 토론·교육 내용 공유</td></tr></table>
      <h3>데이터 편향성</h3>
      <p>데이터가 현실 세계를 잘 반영하지 못하고 <b>한쪽으로 치우친 것</b>. 특정 집단이 너무 많거나 적거나 빠졌을 때, 잘못 입력하거나 빈 값을 채워 넣을 때, 무의식적인 사회의 편향이 속성 선택에 들어갔을 때 생깁니다. 편향된 데이터로 학습하면 결과의 정확성과 공정성이 떨어져요.</p>
      <h3>이번 실습: 붓꽃 데이터 통합</h3>
      <p>통계학자 피셔가 1936년에 측정한 <code>Iris1.csv</code>(150개)에 <b>종류별 10개씩 새로 수집한</b> <code>Iris2.csv</code>(30개)를 합쳐 하나의 데이터로 만듭니다. 붓꽃의 종류는 <b>세토사·버시컬러·버지니카</b> 각 50개예요.</p>
      <table class="tbl"><tr><th>영문 속성</th><th>한글</th><th>영문 속성</th><th>한글</th></tr>
      <tr><td>Id</td><td>일련번호</td><td>PetalLengthCm</td><td>꽃잎 길이</td></tr>
      <tr><td>SepalLengthCm</td><td>꽃받침 길이</td><td>PetalWidthCm</td><td>꽃잎 너비</td></tr>
      <tr><td>SepalWidthCm</td><td>꽃받침 너비</td><td>Species</td><td>종류</td></tr></table>
      <div class="tip">📌 교과서는 구글 코랩에서 <code>files.upload()</code>로 파일을 올리지만, 이 사이트에는 두 파일(<code>Iris1.csv</code>, <code>Iris2.csv</code>)이 이미 준비되어 있어요. 한글이 들어 있는 파일은 <code>encoding = 'cp949'</code>가 필요합니다.</div>` },
    { t: 'quiz', id: 'q2', title: '🎯 수집 방법과 편향 찾기', items: [
      { q: '교실 온도 센서가 1분마다 온도를 기록한다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 1, why: '센서와 IoT 장치를 이용한 자동 수집이에요.' },
      { q: '학급 학생 30명에게 온라인 설문지로 취미를 묻는다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 0, why: '사람들에게 직접 질문하는 수동 수집이에요.' },
      { q: '캐글에서 붓꽃 데이터(Iris.csv)를 내려받는다', o: ['관찰·측정·설문', '자동화 장치·코드', '공유 사이트'], a: 2, why: '공개된 데이터 사이트에서 다운로드하는 방법이에요.' },
      { q: '얼굴 인식 학습 데이터의 90%가 20대 남성 사진이라면?', o: ['데이터 편향성', '결측치', '이상치'], a: 0, why: '특정 집단이 너무 많이 수집되어 다른 집단에서 성능이 떨어져요.' }] },
    { t: 'mission', id: 'l2-m1', title: '🧪 미션 1: 데이터 불러오기 (교과서 67쪽)',
      desc: 'pandas 모듈을 불러와 별칭을 <code>pd</code>로 정하고, <code>read_csv()</code>로 두 파일을 읽어 앞의 5개 데이터를 출력합니다. 빈칸 3곳을 채우세요.',
      starter: `import pandas as ____   # pandas 모듈을 불러와 별칭을 pd로 지정
df1 = pd.____('Iris1.csv', encoding = 'cp949')   # 데이터프레임으로 변환
df2 = pd.read_csv('Iris2.csv', encoding = 'cp949')
print(df1.shape, df2.shape)    # (행, 열) 크기
df1.head()    # df1의 앞 5개 데이터 출력
# 같은 방법으로 df2 데이터도 출력해 보자  →  아래 빈칸을 채워 보세요
print(df2.____())`,
      check: `assert 'df1' in globals() and 'df2' in globals(), 'df1, df2 변수를 만들어 주세요.'
assert df1.shape == (150, 6) and df2.shape == (30, 6), '파일을 제대로 읽지 못했어요.'
assert pd.__name__ == 'pandas', 'pandas를 pd라는 별칭으로 불러와야 해요.'`,
      hint: '① import pandas as (별칭)  ② CSV 파일을 읽는 함수 이름  ③ "앞부분"을 보여 주는 head',
      solution: `import pandas as pd
df1 = pd.read_csv('Iris1.csv', encoding = 'cp949')
print(df2.head())` },
    { t: 'mission', id: 'l2-m2', title: '🧪 미션 2: 두 데이터 합치기 (교과서 67쪽)',
      desc: 'df1 내용 뒤에 df2 내용이 붙도록 합쳐 <code>df</code> 변수에 저장하세요. 합친 뒤에는 <b>180행</b>이 되어야 해요. <code>ignore_index = True</code>는 행 번호를 0부터 다시 매기는 옵션이에요.',
      starter: `df = pd.____([df1, df2], ignore_index = True)   # df1과 df2를 위아래 방향으로 합치기
print(df.shape)
df`,
      check: `assert 'df' in globals(), 'df 변수를 만들어 주세요.'
assert df.shape == (180, 6), '합친 데이터는 180행 6열이어야 해요. df1, df2를 모두 합쳤나요?'`,
      hint: '"이어 붙이다"라는 뜻의 영어 concatenate에서 따온 함수예요.',
      solution: `df = pd.concat([df1, df2], ignore_index = True)` },
    { t: 'code', id: 'l2-c1', title: '③ 종류별 개수로 편향 살펴보기',
      desc: '교과서 65쪽 활동: 데이터가 편향적으로 수집된 부분이 있는지 살펴봅니다. 종류별 개수를 세어 보세요. (미션 2를 먼저 완료하세요)',
      code: `print(df['종류'].value_counts())
df['종류'].value_counts().plot(kind = 'bar')` },
    { t: 'reflect', id: 'l2-r', title: '✍️ 생각 정리', qs: [
      '붓꽃 데이터에 편향이 있는지 살펴보았나요? 종류별 개수를 보고 알게 된 점을 써 보세요.',
      '이 방법(공유 사이트 이용) 외에 붓꽃 데이터를 수집할 수 있는 방법을 한 가지 생각해 써 보세요.'] }
  ]
},

/* ═════════════════ 3 ═════════════════ */
{
  id: 'l3', no: 3, title: '데이터 전처리', page: '교과서 66~73쪽', icon: '🧹',
  goals: ['수치형·범주형, 독립변수·종속변수를 구분할 수 있다.', '결측치를 확인하고 처리할 수 있다.', '기초 통계량·히스토그램·박스플롯·IQR로 이상치를 찾아 제거할 수 있다.', '산점도·히트맵으로 핵심 속성을 찾을 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>데이터 속성의 구분</h3>
      <table class="tbl"><tr><th>기준</th><th>구분</th><th>설명 / 예</th></tr>
      <tr><td rowspan="2">유형</td><td>수치형</td><td>숫자, 비교·연산 가능 (키, 학급 인원수)</td></tr>
      <tr><td>범주형</td><td>몇 개의 범주·항목 (취미, 혈액형)</td></tr>
      <tr><td rowspan="2">역할</td><td>독립 변수(특성·속성)</td><td>결과에 영향을 주는 속성 → <b>X</b></td></tr>
      <tr><td>종속 변수(레이블·타깃)</td><td>다른 속성에 영향을 받는 속성 → <b>y</b></td></tr></table>
      <h3>데이터 전처리의 네 가지</h3>
      <p><b>정제</b>(비어 있는 값·잡음·모순 교정) · <b>통합</b>(여러 파일 합치기) · <b>축소</b>(샘플링, 차원 축소) · <b>변환</b></p>
      <h3>결측치 처리 방법 3가지</h3>
      <p>(가) 결측치가 있는 <b>열</b> 제거 → 심각한 데이터 손실 · (나) 특정 값으로 대체 → 데이터 편향 우려 · (다) 결측치가 있는 <b>행</b> 제거 → 데이터가 충분할 때 가장 적절</p>
      <h3>이상치 확인 방법</h3>
      <p>기초 통계량(<code>describe()</code>) → 히스토그램 → 박스 플롯 → <b>IQR</b>(사분위수 범위) = Q3 − Q1 · 안 울타리값 = Q1 − 1.5×IQR · 밖 울타리값 = Q3 + 1.5×IQR 을 벗어나는 값을 이상치로 판단</p>
      <h3>핵심 속성 찾기</h3>
      <p><b>산점도</b>(<code>pairplot</code>)와 <b>히트맵</b>(상관계수 −1~1)으로 속성 간의 관계를 보고, 종류를 가장 잘 구분하는 속성을 찾습니다.</p>` },
    { t: 'quiz', id: 'q3', title: '🎯 전처리 개념 점검', items: [
      { q: '"취미(만화 그리기)", "혈액형(A형)" 같은 데이터의 유형은?', o: ['수치형', '범주형'], a: 1, why: '몇 개의 범주(항목)로 나뉘는 질적 데이터는 범주형이에요.' },
      { q: '붓꽃 종류를 예측할 때 "종류" 속성의 역할은?', o: ['독립 변수', '종속 변수(레이블)'], a: 1, why: '예측하려는 대상(정답)이므로 종속 변수예요.' },
      { q: '데이터 양이 충분히 많을 때 교과서가 가장 적절하다고 한 결측치 처리 방법은?', o: ['결측치가 있는 열 제거', '결측치를 특정 값으로 대체', '결측치가 있는 행 제거'], a: 2, why: '열을 지우면 데이터 손실이 크고, 값을 채우면 편향이 생길 수 있어요.' },
      { q: '박스 플롯에서 수염(수직선)을 벗어난 값은 보통 무엇으로 판단할까?', o: ['결측치', '이상치', '핵심 속성'], a: 1, why: 'Q1−1.5×IQR 미만이거나 Q3+1.5×IQR 초과인 값을 이상치로 봅니다.' }] },
    { t: 'code', id: 'l3-c0', title: '① 준비: 데이터 불러오기 (2단계 복습)',
      desc: '이 단계의 모든 실습은 이 <b>준비 셀</b>을 먼저 실행해야 해요. 2단계에서 만든 <code>df</code>(180행)를 다시 만듭니다.',
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns            # 시각화를 위해 필요한 모듈
import koreanize_matplotlib      # 한글 출력 가능한 그래프 모듈

df1 = pd.read_csv('Iris1.csv', encoding = 'cp949')
df2 = pd.read_csv('Iris2.csv', encoding = 'cp949')
df = pd.concat([df1, df2], ignore_index = True)
print(df.shape)
df.tail()` },
    { t: 'mission', id: 'l3-m1', title: '🧪 미션 1: 결측치 확인하고 행 제거하기 (교과서 68쪽)',
      desc: '<code>isna().sum()</code>은 열마다 결측치 개수를 셉니다. 확인한 뒤 <b>결측치가 있는 행을 제거</b>한 결과를 <code>df3</code>에 저장하세요. (<code>axis = 0</code>은 행, <code>axis = 1</code>은 열)',
      starter: `print(df.____().sum())          # 속성별 결측치 개수 확인
df3 = df.dropna(axis = ____, inplace = False)   # 결측치가 있는 행 제거
print('제거 전:', len(df), '행 → 제거 후:', len(df3), '행')
df3`,
      check: `assert 'df3' in globals(), 'df3 변수를 만들어 주세요.'
assert df3.isna().sum().sum() == 0, '아직 결측치가 남아 있어요.'
assert len(df3) == 172, '결측치가 있는 "행"을 제거해야 해요. (172행이 되어야 해요) axis 값을 확인하세요.'`,
      hint: '① 결측치(NA)인지 묻는 메서드 isna  ② 행을 지우려면 axis = 0 (옵션을 생략하면 기본값)',
      solution: `print(df.isna().sum())
df3 = df.dropna(axis = 0, inplace = False)` },
    { t: 'code', id: 'l3-c1', title: '② 기초 통계량으로 이상치 의심하기 (교과서 69쪽)',
      desc: '<code>describe()</code>의 평균·최솟값·최댓값을 살펴보세요. 꽃받침 길이의 최댓값이 15, 꽃잎 길이가 55, 꽃잎 너비가 111…… 붓꽃이 이렇게 클까요? 종류별로도 확인합니다.',
      code: `print(df3.describe())
print()
df3.groupby('종류')['꽃받침 길이'].describe()` },
    { t: 'mission', id: 'l3-m2', title: '🧪 미션 2: 스스로 해결하기 — 꽃잎 길이의 종류별 통계 (69쪽)',
      desc: '<code>groupby()</code>로 붓꽃 <b>종류별</b> <b>꽃잎 길이</b>의 기초 통계량을 구해 <code>stat</code>에 저장하세요. 결과의 최댓값(max)을 보고 이상한 점을 찾아보세요!',
      starter: `stat = df3.____('종류')['꽃잎 길이'].describe()
stat`,
      check: `assert 'stat' in globals(), 'stat 변수를 만들어 주세요.'
assert stat.shape == (3, 8) and '75%' in stat.columns, '종류별로 묶은 뒤 꽃잎 길이의 describe()를 구해야 해요.'`,
      hint: '데이터를 그룹으로 묶어 주는 메서드예요. 위의 꽃받침 길이 예시와 똑같이 써 보세요.',
      solution: `stat = df3.groupby('종류')['꽃잎 길이'].describe()` },
    { t: 'code', id: 'l3-c2', title: '③ 히스토그램으로 이상치 확인하기 (교과서 70쪽)',
      desc: '속성별 분포를 종류(hue)별 색으로 그립니다. 전체 분포에서 멀리 떨어진 막대가 이상치예요. (교과서 코드에 그래프를 나누는 <code>plt.show()</code>를 추가했어요)',
      code: `sns.histplot(data = df3, x = '꽃받침 길이', hue = '종류') # ➊
plt.show()
sns.histplot(data = df3, x = '꽃받침 너비', hue = '종류') # ➋
plt.show()
sns.histplot(data = df3, x = '꽃잎 길이', hue = '종류') # ➌
plt.show()
sns.histplot(data = df3, x = '꽃잎 너비', hue = '종류') # ➍
plt.show()` },
    { t: 'code', id: 'l3-c3', title: '④ 박스 플롯으로 이상치 확정하기 (교과서 70쪽)',
      desc: '수염을 벗어난 점이 이상치예요. 꽃받침 길이(➊)·꽃잎 길이(➌)·꽃잎 너비(➍)에서 이상한 점을 찾아보세요.',
      code: `sns.catplot(data = df3, x = '종류', y = '꽃받침 길이', kind = 'box', hue = '종류') # ➊
plt.show()
sns.catplot(data = df3, x = '종류', y = '꽃받침 너비', kind = 'box', hue = '종류') # ➋
plt.show()
sns.catplot(data = df3, x = '종류', y = '꽃잎 길이', kind = 'box', hue = '종류') # ➌
plt.show()
sns.catplot(data = df3, x = '종류', y = '꽃잎 너비', kind = 'box', hue = '종류') # ➍
plt.show()` },
    { t: 'mission', id: 'l3-m3', title: '🧪 미션 3: 사분위수 범위와 안·밖 울타리값 (교과서 71쪽)',
      desc: '종류별 꽃받침 길이의 제1사분위수(Q1)·제3사분위수(Q3)를 구하고 <b>IQR = Q3 − Q1</b>, <b>안 울타리값 = Q1 − 1.5×IQR</b>, <b>밖 울타리값 = Q3 + 1.5×IQR</b>을 계산하세요.',
      starter: `Q1 = df3.groupby('종류')['꽃받침 길이'].quantile(0.25) # 제1사분위수
Q3 = df3.groupby('종류')['꽃받침 길이'].quantile(____) # 제3사분위수
IQR = Q3 - ____ # 사분위수 범위
print('Q1:', Q1); print('Q3:', Q3); print('IQR:', IQR)

lower = Q1 - ____ * IQR; upper = Q3 + 1.5 * IQR
print('lower:', lower); print('upper:', upper)`,
      check: `g = df3.groupby('종류')['꽃받침 길이']
_q1, _q3 = g.quantile(0.25), g.quantile(0.75)
assert abs(Q3 - _q3).max() < 1e-9, 'Q3는 상위 75% 값이에요. quantile 안의 숫자를 확인하세요.'
assert abs(IQR - (_q3 - _q1)).max() < 1e-9, 'IQR = Q3 - Q1 이에요.'
assert abs(lower - (_q1 - 1.5 * (_q3 - _q1))).max() < 1e-9, '안 울타리값은 Q1 - 1.5 * IQR 이에요.'`,
      hint: '① 제3사분위수는 상위 25% 지점 = 0.75  ② IQR은 Q3에서 Q1을 빼요  ③ 울타리값에 곱하는 수는 1.5',
      solution: `Q3 = df3.groupby('종류')['꽃받침 길이'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR; upper = Q3 + 1.5 * IQR` },
    { t: 'mission', id: 'l3-m4', title: '🧪 미션 4: 이상치 찾기 (교과서 71쪽)',
      desc: '<code>df3</code>에서 <b>버시컬러</b>만 추출해 <code>df4</code>에 저장하고, 꽃받침 길이가 안 울타리값보다 작거나 밖 울타리값보다 큰 행을 <code>found</code>에 저장하세요. (미션 3을 먼저 완료해야 <code>lower</code>, <code>upper</code>가 있어요)',
      starter: `df4 = df3[df3['종류'] == '____']
found = df4[(df4['꽃받침 길이'] < lower['버시컬러']) | (df4['꽃받침 길이'] ____ upper['버시컬러'])]
found`,
      check: `assert 'found' in globals(), 'found 변수를 만들어 주세요.'
assert (found['종류'] == '버시컬러').all() and len(found) >= 1, '버시컬러의 이상치 행을 찾아야 해요.'
assert 160 in found.index and found.loc[160, '꽃받침 길이'] == 15.0, '일련번호 161(꽃받침 길이 15.0)이 이상치로 찾아져야 해요.'`,
      hint: '① 종류 이름은 한글 "버시컬러"  ② 밖 울타리값보다 "큰" 경우를 나타내는 비교 기호',
      solution: `df4 = df3[df3['종류'] == '버시컬러']
found = df4[(df4['꽃받침 길이'] < lower['버시컬러']) | (df4['꽃받침 길이'] > upper['버시컬러'])]` },
    { t: 'code', id: 'l3-c4', title: '⑤ 모든 속성의 이상치를 찾는 함수 만들기 (교과서 71쪽)',
      desc: '교과서는 "위 알고리즘을 <b>함수</b>로 만들어 다른 값들의 이상치를 찾는 데 적용"하라고 해요. 네 속성에 모두 적용해 이상치 행 번호(<code>out_idx</code>)를 모읍니다.',
      code: `def find_outliers(col):
    Q1 = df3.groupby('종류')[col].quantile(0.25)
    Q3 = df3.groupby('종류')[col].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR; upper = Q3 + 1.5 * IQR
    idx = []
    for name in Q1.index:                     # 종류별로 따로 검사
        d = df3[df3['종류'] == name]
        idx += list(d[(d[col] < lower[name]) | (d[col] > upper[name])].index)
    return idx

out_idx = []
for col in ['꽃받침 길이', '꽃받침 너비', '꽃잎 길이', '꽃잎 너비']:
    out_idx += find_outliers(col)
out_idx = sorted(set(out_idx))      # 중복 제거
print('이상치 행 번호:', out_idx)
df3.loc[out_idx].head(10)` },
    { t: 'mission', id: 'l3-m5', title: '🧪 미션 5: 이상치 제거하기 (교과서 71쪽)',
      desc: '특정 행을 삭제하는 <code>drop()</code>으로 이상치 행(<code>out_idx</code>)을 제거해 <code>df3</code>에 다시 저장하세요. (⑤번 셀을 먼저 실행하세요)',
      starter: `df3 = df.dropna(axis = 0)    # 처음 상태에서 시작(여러 번 실행해도 괜찮아요)
df3 = df3.____(index = out_idx, axis = 0)    # 제거하려는 인덱스 설정
print('이상치 제거 후:', df3.shape)
df3.describe()`,
      check: `assert 'df3' in globals(), 'df3 변수를 만들어 주세요.'
assert not any(i in df3.index for i in out_idx), '이상치 행이 아직 남아 있어요.'
assert len(df3) == 172 - len(out_idx), '이상치 행만 지워야 해요.'
assert df3['꽃잎 길이'].max() < 10 and df3['꽃받침 길이'].max() < 10, '이상치가 남아 있어요.'`,
      hint: '"떨어뜨리다"라는 뜻의 영어 단어예요. dropna()와 이름이 비슷해요!',
      solution: `df3 = df3.drop(index = out_idx, axis = 0)` },
    { t: 'code', id: 'l3-c5', title: '⑥ 핵심 속성 ①: pairplot 산점도 (교과서 72쪽)',
      desc: '모든 속성 쌍의 산점도를 한 번에 그립니다. 세 종류(색)를 가장 잘 구분하는 속성은 무엇일까요? (실행에 조금 시간이 걸려요)',
      code: `sns.pairplot(df3, hue = '종류', markers = ['o', 's', 'D'])
plt.show()` },
    { t: 'mission', id: 'l3-m6', title: '🧪 미션 6: 핵심 속성 ②: 히트맵 (교과서 72쪽)',
      desc: '피어슨 상관계수로 속성 간의 관계를 히트맵으로 그립니다. 값을 각 칸에 표시(<code>annot</code>)하려면 어떻게 해야 할까요?',
      starter: `irisData = df3.corr(method = '____', numeric_only = True)
plt.figure(figsize = (10, 10))
sns.heatmap(data = irisData, annot = ____, fmt = '.2f', linewidth = .5,
            cmap = 'RdYlGn_r')
plt.show()
print('꽃잎 길이-꽃잎 너비 상관계수:', round(irisData.loc['꽃잎 길이', '꽃잎 너비'], 2))`,
      check: `assert 'irisData' in globals(), 'irisData 변수를 만들어 주세요.'
_ref = df3.corr(method = 'pearson', numeric_only = True)
assert irisData.shape == _ref.shape and abs(irisData - _ref).max().max() < 1e-9, '상관계수 방법이 피어슨(pearson)인지 확인하세요.'`,
      hint: '① 상관계수 방법 이름: pearson  ② 각 칸에 데이터를 채워 넣을지 정하는 옵션의 값: True / False',
      solution: `irisData = df3.corr(method = 'pearson', numeric_only = True)
sns.heatmap(data = irisData, annot = True, fmt = '.2f', linewidth = .5, cmap = 'RdYlGn_r')` },
    { t: 'mission', id: 'l3-m7', title: '🧪 미션 7: 함께 해결하기 — tips 데이터에서 핵심 속성 찾기 (교과서 73쪽)',
      desc: 'seaborn에 내장된 <b>tips</b> 데이터로 <code>total_bill</code>(총 계산 요금)에 가장 큰 영향을 주는 핵심 속성을 찾습니다. 범주형 속성은 <code>get_dummies()</code>로 0, 1로 바꿔요.',
      starter: `import seaborn as sns
tips_df = sns.load_dataset('____')
print(tips_df.head())
print('--- 속성별 결측치 숫자 ---'); print(tips_df.isna().sum())
print('--- 통계 정보 ---'); print(tips_df.describe())

dummyDf = pd.get_dummies(tips_df) # 범주형을 숫자형으로 변환
tipsCorr = dummyDf.corr()
plt.figure(figsize = (10, 8))
sns.heatmap(data = tipsCorr, annot = True, fmt = '.2f', cmap = 'RdYlGn_r')
plt.show()

# total_bill과의 상관계수 중 절댓값이 가장 큰 속성의 이름(자기 자신 제외)
key_attr = tipsCorr['total_bill'].drop('total_bill').abs().____()
print('total_bill에 가장 큰 영향을 주는 속성:', key_attr)`,
      check: `assert 'tips_df' in globals() and 'total_bill' in tips_df.columns, "load_dataset에 'tips'를 넣어 데이터를 불러오세요."
_c = pd.get_dummies(tips_df).corr()['total_bill'].drop('total_bill').abs()
assert key_attr == _c.idxmax(), '절댓값이 가장 큰 값의 "이름"을 찾는 메서드를 써 보세요.'`,
      hint: '① seaborn 내장 데이터 이름은 tips  ② 가장 큰 값의 "이름(인덱스)"을 알려 주는 메서드: idxmax',
      solution: `tips_df = sns.load_dataset('tips')
key_attr = tipsCorr['total_bill'].drop('total_bill').abs().idxmax()` },
    { t: 'reflect', id: 'l3-r', title: '✍️ 생각 정리', qs: [
      '이상치로 찾은 행들은 모두 "입력 실수"일까요? 이상치를 무조건 지우면 안 되는 경우를 생각해 보세요.',
      'pairplot과 히트맵 결과를 바탕으로, 붓꽃의 종류를 구분하는 핵심 속성 두 가지를 쓰고 근거를 설명해 보세요.',
      'tips 실습에서 통계 정보에 sex, smoker, day, time 속성이 보이지 않는 이유는 무엇일까요?'] }
  ]
},

/* ═════════════════ 4 ═════════════════ */
{
  id: 'l4', no: 4, title: '학습 유형과 알고리즘 선정', page: '교과서 74~76쪽, 85·88쪽', icon: '🧭',
  goals: ['지도·비지도·강화 학습을 구분할 수 있다.', '문제에 알맞은 알고리즘을 고를 수 있다.', 'KMeans로 군집 문제를 해결해 볼 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>기계학습의 유형</h3>
      <table class="tbl"><tr><th>유형</th><th>설명</th><th>예</th></tr>
      <tr><td><b>지도학습</b></td><td>레이블(정답)이 주어진 데이터로 학습. 연속적인 값을 예측(회귀)하거나 클래스로 구분(분류)</td><td>붓꽃 종류 분류</td></tr>
      <tr><td><b>비지도학습</b></td><td>레이블이 없는 데이터에서 패턴을 찾음. 비슷한 데이터끼리 묶는 <b>군집</b>. 성능 평가가 어렵다</td><td>붓꽃 속성으로 군집</td></tr>
      <tr><td><b>강화학습</b></td><td>결과에 대해 보상은 최대화, 벌은 최소화하는 방향으로 시행착오를 거치며 학습</td><td>알파고</td></tr></table>
      <h3>알고리즘과 사이킷런 클래스 (교과서 85쪽)</h3>
      <table class="tbl code-tbl"><tr><th>알고리즘</th><th>용도</th><th>사이킷런 코드 (한 줄)</th></tr>
      <tr><td>선형 회귀</td><td>예측(회귀)</td><td><code>from sklearn.linear_model import LinearRegression</code></td></tr>
      <tr><td>로지스틱 회귀</td><td>분류</td><td><code>from sklearn.linear_model import LogisticRegression</code></td></tr>
      <tr><td>k-최근접 이웃</td><td>분류</td><td><code>from sklearn.neighbors import KNeighborsClassifier</code></td></tr>
      <tr><td>서포트 벡터 머신</td><td>분류</td><td><code>from sklearn.svm import SVC</code></td></tr>
      <tr><td>의사결정트리</td><td>분류</td><td><code>from sklearn.tree import DecisionTreeClassifier</code></td></tr>
      <tr><td>k-평균</td><td>군집</td><td><code>from sklearn.cluster import KMeans</code></td></tr></table>
      <div class="tip">🐾 <b>k-최근접 이웃(k-NN)</b>: 새 데이터와 가까운 <b>k개 이웃</b>을 찾아 <b>다수결</b>로 클래스를 정해요. 그림 Ⅱ-4처럼 k=5에서 이웃 5개 중 4개가 버시컬러면 버시컬러로 분류!</div>` },
    { t: 'widget', name: 'chooser', id: 'w-chooser' },
    { t: 'quiz', id: 'q4', title: '🎯 유형과 알고리즘 고르기', items: [
      { q: '레이블이 없는 데이터에서 비슷한 특징끼리 묶는 학습은?', o: ['지도학습', '비지도학습', '강화학습'], a: 1, why: '레이블 없이 패턴을 찾아내는 것은 비지도학습(군집)이에요.' },
      { q: '행동에 대한 보상을 최대화하며 시행착오로 배우는 학습은?', o: ['지도학습', '비지도학습', '강화학습'], a: 2, why: '알파고가 바둑을 학습한 방식이에요.' },
      { q: '"붓꽃 종류 분류"에 쓸 수 있는 알고리즘이 아닌 것은?', o: ['k-최근접 이웃', '서포트 벡터 머신', 'k-평균'], a: 2, why: 'k-평균(KMeans)은 정답 없이 묶는 군집 알고리즘이에요.' },
      { q: '연습 시간으로 타율(수치)을 예측할 때 알맞은 알고리즘은?', o: ['선형 회귀', '로지스틱 회귀', 'k-평균'], a: 0, why: '연속된 수치를 예측하는 회귀 문제에는 선형 회귀를 써요.' }] },
    { t: 'code', id: 'l4-c0', title: '① 준비: 전처리가 끝난 df3',
      desc: '3단계에서 완성한 <code>df3</code>(결측치·이상치를 제거한 데이터)를 같은 코드로 다시 만듭니다.',
      code: PREP },
    { t: 'mission', id: 'l4-m1', title: '🧪 미션 1: (가) 문제 — KMeans로 붓꽃 군집하기 (교과서 88쪽)',
      desc: '"꽃잎 길이, 꽃잎 너비, 꽃받침 길이, 꽃받침 너비를 알면 서로 다른 꽃을 구분할 수 있을까?" 정답(종류) 없이 <b>꽃잎 길이·너비</b>만으로 3개의 집단으로 묶어 보세요. 알고리즘 모듈과 군집 개수를 채웁니다.',
      starter: `from sklearn.cluster import ____
model = KMeans(n_clusters = ____)
df4 = df3.loc[:, ['꽃잎 길이', '꽃잎 너비']]   # 학습에 사용할 속성만 가져오기
model.fit(df4)
df4['predicted'] = model.____(df4)
idx0 = df4.loc[df4['predicted'] == 0]; print(idx0)`,
      check: `assert 'df4' in globals() and 'predicted' in df4.columns, "df4에 'predicted' 열을 만들어 주세요."
assert df4['predicted'].nunique() == 3, '붓꽃은 3종류이므로 군집을 3개로 묶어 보세요.'
assert len(df4) == len(df3), '데이터 개수가 달라졌어요.'`,
      hint: '① 사이킷런의 k-평균 클래스 이름은 KMeans  ② 3종류이므로 군집 3개  ③ 학습한 모델로 값을 구하는 메서드: predict',
      solution: `from sklearn.cluster import KMeans
model = KMeans(n_clusters = 3)
df4['predicted'] = model.predict(df4)` },
    { t: 'code', id: 'l4-c1', title: '② 같은 방법으로 예측값이 1, 2인 데이터도 출력해 보기',
      desc: '교과서의 힌트처럼 군집 번호 1, 2인 데이터도 출력해 보세요. 숫자를 바꿔 직접 실행해 봅니다. (미션 1 먼저!)',
      code: `idx1 = df4.loc[df4['predicted'] == 1]; print(idx1)
idx2 = df4.loc[df4['predicted'] == 2]; print(idx2)
print('군집별 개수:', df4['predicted'].value_counts().to_dict())
pd.crosstab(df3['종류'], df4['predicted'])    # 실제 종류와 군집 결과 비교` },
    { t: 'mission', id: 'l4-m2', title: '🧪 미션 2: 군집 결과를 산점도로 표현하기 (교과서 88·89쪽)',
      desc: '교과서의 도전 과제: "군집 결과를 산점도로 표현하는 코드를 완성해 보자." 점의 색(<code>c</code>)을 군집 번호 열로 정해 보세요.',
      starter: `plt.scatter(df4['꽃잎 길이'], df4['꽃잎 너비'], c = df4['____'])
plt.xlabel('꽃잎 길이')
plt.ylabel('꽃잎 너비')
plt.title('KMeans 군집 결과')
plt.show()`,
      check: `assert 'predicted' in df4.columns, '앞의 미션 1을 먼저 완료하세요.'
assert df4['predicted'].nunique() == 3`,
      hint: '군집 번호가 저장된 열의 이름을 넣어요. 위에서 만든 새 열이에요.',
      solution: `plt.scatter(df4['꽃잎 길이'], df4['꽃잎 너비'], c = df4['predicted'])` },
    { t: 'reflect', id: 'l4-r', title: '✍️ 생각 정리', qs: [
      '지도학습과 비지도학습의 차이와 공통점을 설명해 보세요.',
      'KMeans로 묶은 결과와 실제 종류(crosstab)를 비교해 보세요. 어떤 종류가 서로 섞였나요?'] }
  ]
},

/* ═════════════════ 5 ═════════════════ */
{
  id: 'l5', no: 5, title: '모델 학습', page: '교과서 76~77쪽', icon: '🏋️',
  goals: ['독립변수(X)와 종속변수(y)를 나눌 수 있다.', 'train_test_split()으로 훈련·테스트 데이터를 분리할 수 있다.', 'KNeighborsClassifier 모델을 fit()으로 학습시킬 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>훈련 데이터와 테스트 데이터</h3>
      <p>전처리된 데이터를 <b>독립 변수(X)</b>와 <b>종속 변수(y)</b>로 나눕니다. X에는 핵심 속성인 <b>꽃잎 길이·꽃잎 너비</b>, y에는 <b>종류</b>를 넣어요. 그다음 X, y를 <b>중복되지 않게</b> 훈련 데이터와 테스트 데이터로 나눕니다.</p>
      <ul><li><b>훈련 데이터</b>: 기계학습으로 모델을 만드는 데 사용 (보통 60~80%)</li><li><b>테스트 데이터</b>: 훈련을 끝낸 모델의 성능을 평가하는 데 사용 (보통 20~40%) — 모델이 본 적 없는 데이터!</li></ul>
      <pre class="snip">X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 7)</pre>
      <p><code>test_size = 0.2</code> → 훈련 80% : 테스트 20%</p>
      <h3>모델 생성과 학습</h3>
      <pre class="snip">model = KNeighborsClassifier()          # 모델 생성 (아직 학습하지 않은 뇌!)
model.fit(X_train, y_train)               # 모델 객체.fit(훈련 데이터, 훈련 데이터의 정답)</pre>
      <div class="tip">💡 데이터프레임에서 <b>여러 개의 열</b>을 선택할 때는 대괄호를 겹쳐서(<code>df3[['꽃잎 길이', '꽃잎 너비']]</code>) 사용해요.<br>과적합: 모델이 훈련 데이터에 너무 맞춰져 새 데이터에서 성능이 나빠지는 현상 / 과소적합: 패턴을 충분히 학습하지 못한 현상</div>` },
    { t: 'code', id: 'l5-c0', title: '① 준비: 전처리가 끝난 df3',
      desc: '3단계의 결과(<code>df3</code>)를 다시 만듭니다. 이 셀을 먼저 실행하세요.', code: PREP },
    { t: 'mission', id: 'l5-m1', title: '🧪 미션 1: 독립 변수·종속 변수 만들고 데이터 나누기 (교과서 76쪽)',
      desc: '종속 변수 열 이름과 테스트 데이터 비율을 채우세요. 훈련:테스트를 <b>8:2</b>로 나눕니다.',
      starter: `X = df3[['꽃잎 길이', '꽃잎 너비']] # 독립 변수(핵심 속성)
y = df3['____']  # 종속 변수

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = ____,
                                                    random_state = 7)
print('전체:', len(X), '/ 훈련:', len(X_train), '/ 테스트:', len(X_test))`,
      check: `assert list(X.columns) == ['꽃잎 길이', '꽃잎 너비'], 'X는 꽃잎 길이, 꽃잎 너비 두 열이어야 해요.'
assert y.name == '종류', 'y는 종류 속성이어야 해요.'
assert len(X_test) == round(len(X) * 0.2) or len(X_test) == int(len(X) * 0.2) + 1, '테스트 데이터가 20%가 되도록 test_size를 정하세요.'`,
      hint: '① 예측하려는 정답 속성의 이름  ② 8:2 로 나누려면 테스트 비율은 0.2',
      solution: `y = df3['종류']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 7)` },
    { t: 'code', id: 'l5-c1', title: '② 나눈 데이터 살펴보기',
      desc: '훈련 데이터의 입력(X_train)과 정답(y_train)이 어떻게 생겼는지 확인해 보세요. (미션 1 먼저)',
      code: `print(X_train.head())
print()
print(y_train.head())` },
    { t: 'mission', id: 'l5-m2', title: '🧪 미션 2: k-최근접 이웃 모델 학습시키기 (교과서 77쪽)',
      desc: '<code>KNeighborsClassifier()</code>로 모델을 만들고, 훈련 데이터와 훈련 데이터의 정답을 넣어 학습시키세요. (미션 1의 X_train, y_train 사용)',
      starter: `from sklearn.neighbors import KNeighborsClassifier
model = KNeighborsClassifier( )  # k-최근접 이웃 모델 생성
model.____(X_train, ____)        # 훈련 데이터와 훈련 데이터의 정답으로 학습
print('학습 완료!', model)`,
      check: `from sklearn.utils.validation import check_is_fitted
check_is_fitted(model)
assert len(model.classes_) == 3, '붓꽃 3종류를 모두 학습했는지 확인하세요.'
assert model._fit_X.shape[0] == len(X_train), '훈련 데이터(X_train)로 학습해야 해요.'`,
      hint: '"맞추다(적합시키다)"라는 뜻의 fit 메서드에 (X_train, 정답) 순서로 넣어요. 정답은 y_train!',
      solution: `model.fit(X_train, y_train)` },
    { t: 'reflect', id: 'l5-r', title: '✍️ 생각 정리', qs: [
      '테스트 데이터를 학습에 함께 쓰면 왜 성능 평가를 믿을 수 없게 될까요?',
      '여기서 X에 "꽃잎 길이, 꽃잎 너비"만 사용한 이유는 무엇인가요? (3단계 결과와 연결해 보세요)'] }
  ]
},

/* ═════════════════ 6 ═════════════════ */
{
  id: 'l6', no: 6, title: '성능 평가와 개선', page: '교과서 78~81쪽', icon: '📊',
  goals: ['score()로 정확도를 구할 수 있다.', '혼동행렬을 그리고 읽을 수 있다.', '정밀도·재현율·F1-점수를 계산할 수 있다.', 'k를 바꿔 모델을 개선하고 새 데이터를 예측할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>정확도와 혼동행렬</h3>
      <p><b>정확도</b>는 모델의 예측 결과가 실제 정답과 얼마나 일치하는지를 나타내요. 사이킷런의 모든 분류 모델은 <code>score()</code>를 제공하고, 이때는 반드시 <b>테스트 데이터</b>를 사용합니다. 정확도만으로는 무엇을 잘못 예측했는지 알기 어려워 <b>혼동행렬</b>을 이용해요.</p>
      <table class="tbl"><tr><th></th><th>예측: 참</th><th>예측: 거짓</th></tr>
      <tr><td>실제: 참</td><td>TP(참 긍정)</td><td>FN(거짓 부정)</td></tr>
      <tr><td>실제: 거짓</td><td>FP(거짓 긍정)</td><td>TN(참 부정)</td></tr></table>
      <table class="tbl"><tr><th>지표</th><th>공식</th><th>중요한 경우</th></tr>
      <tr><td><b>정확도</b></td><td>(TP+TN) / (TP+TN+FP+FN)</td><td>전체 일치 비율</td></tr>
      <tr><td><b>정밀도</b></td><td>TP / (TP+FP)</td><td>스팸 메일 분류 (FP가 문제)</td></tr>
      <tr><td><b>재현율</b></td><td>TP / (TP+FN)</td><td>질병 예측 (FN이 문제)</td></tr>
      <tr><td><b>F1-점수</b></td><td>2 × (정밀도×재현율) / (정밀도+재현율)</td><td>둘의 균형이 필요할 때</td></tr></table>
      <h3>모델 개선과 활용</h3>
      <p><b>하이퍼 파라미터</b>(예: k-NN의 이웃 수 k)는 학습 전에 사용자가 정해 주는 값이에요. k를 바꿔 가며 가장 정확도가 높은 값을 찾습니다. 완성한 모델은 <code>predict()</code>로 새로운 데이터를 분류하는 데 활용해요.</p>` },
    { t: 'widget', name: 'metrics', id: 'w-metrics' },
    { t: 'quiz', id: 'q6', title: '🎯 어떤 지표를 봐야 할까?', items: [
      { q: '스팸 메일 분류: 정상 메일을 스팸이라고 잘못 분류하면 곤란하다. 중요한 지표는?', o: ['정밀도', '재현율'], a: 0, why: '스팸이라고 예측한 것 중 실제 스팸 비율(정밀도)이 높아야 해요. FP가 중요합니다.' },
      { q: '질병 예측: 실제 환자를 정상이라고 예측하면 위험하다. 중요한 지표는?', o: ['정밀도', '재현율'], a: 1, why: '실제 환자 중 찾아낸 비율(재현율)이 높아야 해요. FN이 중요합니다.' },
      { q: '질병 예측 혼동행렬(TP=9, FN=1, FP=30, TN=60)의 정확도는?', o: ['0.69', '0.37', '0.90'], a: 0, why: '(9+60) / (9+60+30+1) = 69/100 = 0.69' }] },
    { t: 'code', id: 'l6-c0', title: '① 준비: 데이터 분할과 모델 학습까지',
      desc: '5단계까지의 결과(df3 → 분할 → 학습)를 한 번에 다시 만듭니다. 이 셀을 먼저 실행하세요.',
      code: PREP + `

` + SPLIT + `
from sklearn.neighbors import KNeighborsClassifier
model = KNeighborsClassifier()
model.fit(X_train, y_train)
print('준비 완료! 테스트 데이터', len(X_test), '개')` },
    { t: 'mission', id: 'l6-m1', title: '🧪 미션 1: 정확도 확인하기 (교과서 78쪽)',
      desc: '<b>테스트 데이터</b>로 모델의 정확도를 계산해 <code>acc</code>에 저장하세요. <code>score()</code>를 사용합니다.',
      starter: `acc = model.____(X_test, y_test) # 모델의 정확도를 계산하여 저장
print('테스트 데이터 점수: {:.3f}'.format(acc)) # 정확도(소수점 셋째 자리까지 출력)`,
      check: `assert 'acc' in globals(), 'acc 변수를 만들어 주세요.'
assert abs(acc - model.score(X_test, y_test)) < 1e-9, '테스트 데이터(X_test, y_test)로 정확도를 구해야 해요.'`,
      hint: '"점수"라는 뜻의 영어 단어 메서드예요.',
      solution: `acc = model.score(X_test, y_test)` },
    { t: 'mission', id: 'l6-m2', title: '🧪 미션 2: 혼동행렬 그리기 (교과서 80쪽)',
      desc: '테스트 데이터를 예측(<code>predict</code>)하고, 실젯값과 예측값으로 혼동행렬을 만들어 히트맵으로 그립니다. 가로축은 예측값, 세로축은 실젯값이에요. 대각선 밖의 숫자가 잘못 분류한 개수!',
      starter: `from sklearn.metrics import confusion_matrix, classification_report
predicted = model.____(X_test) # 테스트 데이터에 대한 예측값
classNames = sorted(df3['종류'].unique())   # 혼동행렬은 이름순으로 계산되므로 순서를 맞춰요
cm = confusion_matrix(y_test, ____) # 혼동행렬(실젯값과 예측값)
df_cm = pd.DataFrame(cm, index = [i for i in classNames],
                     columns = [i for i in classNames])
sns.heatmap(data = df_cm, annot = True, fmt = '0.2f', cmap = 'YlGnBu')
plt.xlabel('예측값')
plt.ylabel('실젯값')
plt.show()`,
      check: `assert 'cm' in globals() and cm.shape == (3, 3), 'cm 혼동행렬(3×3)을 만들어 주세요.'
assert cm.sum() == len(y_test), '혼동행렬 안 숫자의 합은 테스트 데이터 개수와 같아야 해요.'
assert (cm == confusion_matrix(y_test, model.predict(X_test))).all(), '실젯값(y_test)과 예측값(predicted)으로 만들어 주세요.'`,
      hint: '① 새 데이터의 값을 알아낼 때 쓰는 메서드 predict  ② confusion_matrix(실젯값, 예측값) — 예측값을 담은 변수 이름은?',
      solution: `predicted = model.predict(X_test)
cm = confusion_matrix(y_test, predicted)` },
    { t: 'code', id: 'l6-c1', title: '② 분류 보고서로 지표 한눈에 보기',
      desc: '<code>classification_report</code>는 종류별 정밀도(precision)·재현율(recall)·F1-점수(f1-score)를 한 번에 보여 줘요. (미션 2 먼저)',
      code: `print(classification_report(y_test, predicted))` },
    { t: 'mission', id: 'l6-m3', title: '🧪 미션 3: k를 바꿔 모델 개선하기 (교과서 80쪽)',
      desc: '이웃의 수 <b>k를 1~19</b>까지 바꿔 가며 학습하고 정확도를 <code>acc</code> 리스트에 모아 산점도로 그립니다. <b>반복문</b>의 핵심 부분을 채우세요.',
      starter: `import numpy as np
acc = [ ]
k_range = range(1, ____) # 이웃의 수 (1~19)
for k in k_range: # 이웃의 수(k)를 1~19까지 변화시키기 위한 반복문
  model = KNeighborsClassifier(n_neighbors = ____) # 이웃의 수를 k로 지정
  model.fit(X_train, y_train)  # 훈련 데이터를 이용하여 학습
  acc.append(model.____(X_test, y_test)) # 테스트 데이터를 이용한 정확도
plt.scatter(k_range, acc) # k_range와 acc의 관계 산점도
plt.xlabel('이웃의 수') # x축 라벨
plt.ylabel('정확도') # y축 라벨
plt.show()
print('가장 좋았던 k:', list(k_range)[int(np.argmax(acc))], '/ 정확도:', round(max(acc), 3))`,
      check: `assert isinstance(acc, list) and len(acc) == 19, 'k가 1~19이면 정확도가 19개 모여야 해요. range의 끝 값을 확인하세요.'
_m = KNeighborsClassifier(n_neighbors = 1).fit(X_train, y_train)
assert abs(acc[0] - _m.score(X_test, y_test)) < 1e-9, 'k를 n_neighbors에 넣었는지 확인하세요.'`,
      hint: '① range(1, 20)은 1~19까지  ② n_neighbors에는 반복 변수 k를  ③ 정확도는 score',
      solution: `k_range = range(1, 20)
  model = KNeighborsClassifier(n_neighbors = k)
  acc.append(model.score(X_test, y_test))` },
    { t: 'mission', id: 'l6-m4', title: '🧪 미션 4: 모델 활용하기 — 새로운 붓꽃 분류 (교과서 81쪽)',
      desc: '꽃잎 길이 <b>1.0</b>, 꽃잎 너비 <b>1.5</b>인 새로운 붓꽃은 어느 종류일까요? <code>predict()</code>에 새 데이터를 넣어 판별하세요. (교과서 결과: 세토사)',
      starter: `new = [[1.0, ____]]
print(model.____(new))`,
      check: `assert 'new' in globals() and new == [[1.0, 1.5]], '꽃잎 너비를 1.5로 만들어 주세요.'
assert len(model.predict(new)) == 1`,
      hint: 'new 안에는 [꽃잎 길이, 꽃잎 너비] 순서로 값이 들어가요. 분류 메서드는 predict.',
      solution: `new = [[1.0, 1.5]]
print(model.predict(new))` },
    { t: 'mission', id: 'l6-m5', title: '🧪 미션 5: 스스로 해결하기 — 세토사 분류 모델의 지표 계산 (교과서 81쪽)',
      desc: '3×3 혼동행렬(<code>cm</code>)을 "세토사인가 아닌가"의 2×2 혼동행렬(TP·FN·FP·TN)로 바꾸고 <b>정밀도·재현율·F1-점수</b>를 계산하세요. (미션 2의 <code>cm</code>, <code>classNames</code> 필요)',
      starter: `i = classNames.index('세토사')      # 세토사가 몇 번째 행/열인지
TP = cm[i, i]                        # 세토사를 세토사로 예측
FN = cm[i].sum() - TP                # 세토사인데 아니라고 예측
FP = cm[:, i].sum() - TP             # 세토사가 아닌데 세토사라고 예측
TN = cm.sum() - TP - FN - FP

accuracy = (TP + TN) / (TP + TN + FP + FN)
precision = TP / (TP + ____)
recall = TP / (TP + ____)
f1 = 2 * (precision * recall) / (____ + recall)
print('TP, FN, FP, TN =', TP, FN, FP, TN)
print('정확도 {:.3f} / 정밀도 {:.3f} / 재현율 {:.3f} / F1 {:.3f}'.format(accuracy, precision, recall, f1))`,
      check: `_i = classNames.index('세토사'); _tp = cm[_i, _i]; _fn = cm[_i].sum() - _tp; _fp = cm[:, _i].sum() - _tp
assert abs(precision - _tp / (_tp + _fp)) < 1e-9, '정밀도 = TP / (TP + FP) 예요.'
assert abs(recall - _tp / (_tp + _fn)) < 1e-9, '재현율 = TP / (TP + FN) 예요.'
assert abs(f1 - 2 * precision * recall / (precision + recall)) < 1e-9, 'F1 = 2 × (정밀도×재현율) / (정밀도+재현율) 예요.'`,
      hint: '정밀도의 분모는 "긍정이라고 예측한 것(TP+FP)", 재현율의 분모는 "실제 긍정(TP+FN)", F1의 분모는 정밀도+재현율이에요.',
      solution: `precision = TP / (TP + FP)
recall = TP / (TP + FN)
f1 = 2 * (precision * recall) / (precision + recall)` },
    { t: 'reflect', id: 'l6-r', title: '✍️ 생각 정리', qs: [
      '혼동행렬에서 잘못 분류한 경우가 있었나요? 어떤 종류를 어떤 종류로 잘못 예측했는지 써 보세요.',
      'k값이 바뀌어도 정확도가 비슷하게 나온 이유는 무엇일까요? (그림 Ⅱ-6 참고)',
      '정확도가 높은 모델이 항상 좋은 모델일까요? 질병 예측 사례로 설명해 보세요.'] }
  ]
},

/* ═════════════════ 7 ═════════════════ */
{
  id: 'l7', no: 7, title: '기계학습 알고리즘 실습', page: '교과서 82~89쪽', icon: '🏆',
  goals: ['선형 회귀로 빠진 속성값(꽃받침 길이)을 예측할 수 있다.', '범주형 데이터를 원-핫 인코딩으로 바꿀 수 있다.', '회귀 모델을 R²로 평가할 수 있다.', '알고리즘별 사이킷런 클래스를 불러와 비교할 수 있다.'],
  blocks: [
    { t: 'theory', html: `
      <h3>(다) 문제: 선형 회귀로 꽃받침 길이 예측하기</h3>
      <p>일련번호 151인 데이터는 <b>꽃받침 길이</b>를 모릅니다. <code>Iris1.csv</code>의 데이터(df1)로 <b>꽃받침 너비·꽃잎 길이·꽃잎 너비·종류</b>를 독립 변수 X, <b>꽃받침 길이</b>를 종속 변수 y로 하는 <b>회귀 모델</b>을 만들어 해결합니다.</p>
      <ul><li><b>선형 회귀</b>: 데이터를 가장 잘 설명하는 직선(회귀식 <code>y = ax + b</code>, a: 기울기·가중치 / b: 절편·편향)을 찾아 연속된 값을 예측</li>
      <li><b>원-핫 인코딩</b>: 범주형(종류)을 열 여러 개(종류_버시컬러, 종류_버지니카, 종류_세토사)로 늘려 0 또는 1로 표현</li>
      <li><b>R²(결정 계수)</b>: 독립 변수가 종속 변수를 얼마나 설명하는지. <b>1에 가까울수록</b> 우수 / <b>평균제곱오차(MSE)</b>는 0에 가까울수록 우수</li></ul>
      <div class="tip">⚠️ 이 사이트의 데이터는 교과서 데이터와 조금 달라서 R² 같은 <b>출력 값이 교과서와 다를 수 있어요</b>. 과정과 코드를 익히는 것이 목표!</div>
      <h3>알고리즘 비교 (교과서 85쪽)</h3>
      <p>로지스틱 회귀 · k-최근접 이웃 · 서포트 벡터 머신 · 의사결정트리는 모두 <code>fit()</code>과 <code>score()</code>를 똑같이 사용해서, <b>모델 생성 한 줄만 바꾸면</b> 알고리즘을 쉽게 바꿔 볼 수 있어요.</p>` },
    { t: 'code', id: 'l7-c0', title: '① 준비: 데이터 불러오기',
      desc: '이 단계에서 쓸 <code>df1</code>(Iris1.csv)과 앞 단계의 <code>df3</code>를 준비합니다.', code: PREP + `
from sklearn.model_selection import train_test_split` },
    { t: 'code', id: 'l7-c1', title: '② 일부러 오류 만나기: 범주형 데이터를 그대로 넣으면? (교과서 86쪽)', expectError: true,
      desc: '종류 속성(문자)을 그대로 독립 변수에 넣어 선형 회귀를 학습시키면 <b>오류</b>가 나요. 교과서처럼 <code>ValueError</code>를 확인해 보세요. (오류가 나는 게 정상입니다!)',
      code: `X = df1[['꽃받침 너비', '꽃잎 길이', '꽃잎 너비', '종류']]  # 독립 변수
y = df1['꽃받침 길이']  # 종속 변수
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2,
                         shuffle = True, random_state = 7) # shuffle = True: 데이터를 무작위로 섞음.
from sklearn.linear_model import LinearRegression
model = LinearRegression() # 선형 회귀 모델 생성
model.fit(X_train, y_train) # 선형 회귀 모델 학습` },
    { t: 'mission', id: 'l7-m1', title: '🧪 미션 1: 원-핫 인코딩으로 범주형을 수치형으로 (교과서 86~87쪽)',
      desc: '<code>get_dummies()</code>로 <b>종류</b> 속성을 0/1 열로 바꾼 뒤 훈련·테스트 데이터로 나눕니다. 어떤 열을 변환할지 채우세요.',
      starter: `df1 = pd.read_csv('Iris1.csv', encoding = 'cp949')   # 처음 상태에서 시작(다시 실행해도 OK)
df1 = pd.get_dummies(df1, columns = ['____'])
X = df1[['꽃받침 너비', '꽃잎 길이', '꽃잎 너비', '종류_버시컬러', '종류_버지니카', '종류_세토사']]
y = df1['꽃받침 길이']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2,
                         shuffle = True, random_state = 7)
print(X.head())`,
      check: `assert '종류_세토사' in df1.columns and '종류' not in df1.columns, "'종류' 열을 get_dummies로 변환해야 해요."
assert X.shape[1] == 6 and len(X_train) == 120, 'X(6개 열)와 훈련 데이터 120개를 확인하세요.'`,
      hint: '범주형 데이터인 붓꽃의 "종류" 속성을 지정해요. 변환 후에는 종류_세토사 같은 열이 생겨요.',
      solution: `df1 = pd.get_dummies(df1, columns = ['종류'])` },
    { t: 'mission', id: 'l7-m2', title: '🧪 미션 2: 선형 회귀 모델 학습하고 기울기·절편 확인 (교과서 86~87쪽)',
      desc: '<code>LinearRegression()</code>으로 모델을 만들어 학습시킵니다. <code>coef_</code>는 가중치(기울기), 절편(편향)은 <code>intercept_</code>예요.',
      starter: `from sklearn.linear_model import LinearRegression
model = ____() # 선형 회귀 모델 생성
model.fit(X_train, y_train) # 선형 회귀 모델 학습
print('선형 회귀 가중치: {}'.format(model.coef_)) # coef_: 가중치(기울기)
print('선형 회귀 편향: {}'.format(model.____)) # 편향(절편)`,
      check: `from sklearn.utils.validation import check_is_fitted
check_is_fitted(model)
assert type(model).__name__ == 'LinearRegression', 'LinearRegression 모델을 만들어 주세요.'
assert len(model.coef_) == 6, '독립 변수 6개에 대한 가중치가 있어야 해요. 미션 1을 먼저 완료했나요?'`,
      hint: '① 선형 회귀 클래스 이름: LinearRegression  ② 절편(편향)을 담은 속성 이름은 intercept_ (끝에 밑줄)',
      solution: `model = LinearRegression()
print('선형 회귀 편향: {}'.format(model.intercept_))` },
    { t: 'mission', id: 'l7-m3', title: '🧪 미션 3: R²로 회귀 모델 성능 평가하기 (교과서 87쪽)',
      desc: '테스트 데이터에 대한 예측값 <code>y_pred</code>와 <b>실젯값</b>으로 결정 계수 R²를 구하세요. 1에 가까울수록 좋아요.',
      starter: `from sklearn.metrics import r2_score  # 회귀 모델 성능 지표 모듈
y_pred = model.predict(X_test) # 테스트 데이터에 대한 예측값
r2 = r2_score(____, y_pred)  # 결정 계수
print('결정 계수 R2: ', r2 )`,
      check: `from sklearn.metrics import r2_score as _r2
assert abs(r2 - _r2(y_test, model.predict(X_test))) < 1e-9, 'r2_score(실젯값, 예측값) 순서예요. 실젯값은 y_test!'`,
      hint: 'r2_score(정답, 예측)에서 정답에 해당하는 테스트 데이터의 종속 변수는?',
      solution: `r2 = r2_score(y_test, y_pred)` },
    { t: 'mission', id: 'l7-m4', title: '🧪 미션 4: 꽃받침 길이 예측하기 (교과서 87쪽)',
      desc: '꽃받침 너비 3.1, 꽃잎 길이 1.5, 꽃잎 너비 0.2, 종류가 <b>세토사</b>인 붓꽃의 꽃받침 길이를 예측합니다. 세토사만 1이고 나머지 종류 열은 0이에요. (열 순서: 꽃받침 너비, 꽃잎 길이, 꽃잎 너비, 종류_버시컬러, 종류_버지니카, 종류_세토사)',
      starter: `new_X = [[3.1, 1.5, 0.2, 0, 0, ____]]
predict = model.____(new_X); print(predict)`,
      check: `assert new_X == [[3.1, 1.5, 0.2, 0, 0, 1]], '세토사 열(마지막)만 1이어야 해요.'
assert abs(float(predict.ravel()[0]) - float(model.predict(new_X).ravel()[0])) < 1e-9`,
      hint: '① 마지막 열은 종류_세토사: 세토사이므로 1  ② 예측 메서드는 predict',
      solution: `new_X = [[3.1, 1.5, 0.2, 0, 0, 1]]
predict = model.predict(new_X); print(predict)` },
    { t: 'mission', id: 'l7-m5', title: '🧪 미션 5: 알고리즘 바꿔 비교하기 (교과서 85쪽)',
      desc: '붓꽃 종류 분류(3단계의 <code>df3</code>, 꽃잎 길이·너비)를 4가지 분류 알고리즘으로 비교합니다. 사이킷런 클래스 이름을 85쪽 표에서 찾아 빈칸을 채우세요. (참고: 교과서 표의 <code>ecisionTreeClassifier</code>는 오타예요)',
      starter: `from sklearn.linear_model import ____   # 로지스틱 회귀
from sklearn.neighbors import KNeighborsClassifier   # k-최근접 이웃
from sklearn.svm import ____                         # 서포트 벡터 머신
from sklearn.tree import ____                        # 의사결정트리

X = df3[['꽃잎 길이', '꽃잎 너비']]
y = df3['종류']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 7)

models = {'로지스틱 회귀': LogisticRegression(), 'k-최근접 이웃': KNeighborsClassifier(),
          'SVM': SVC(), '의사결정트리': DecisionTreeClassifier()}
results = {}
for name, m in models.items():
    m.fit(X_train, y_train)
    results[name] = round(m.score(X_test, y_test), 3)
    print(name, '정확도:', results[name])`,
      check: `assert len(results) == 4, '네 알고리즘의 결과가 모두 있어야 해요.'
assert all(0 <= v <= 1 for v in results.values())
assert type(models['SVM']).__name__ == 'SVC' and type(models['의사결정트리']).__name__ == 'DecisionTreeClassifier'`,
      hint: '① LogisticRegression  ② SVC  ③ DecisionTreeClassifier — 위 theory 85쪽 표(4단계)와 똑같이 써요.',
      solution: `from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier` },
    { t: 'widget', name: 'checklist', id: 'w-final' },
    { t: 'reflect', id: 'l7-r', title: '✍️ 정리하기', qs: [
      '선형 회귀(회귀)와 k-최근접 이웃(분류)은 무엇이 다른가요? 예측하는 값의 종류로 설명해 보세요.',
      '알고리즘 비교에서 어떤 알고리즘이 가장 잘 맞혔나요? 정확도가 높은 모델을 선택하면 충분할까요?',
      '이번 단원에서 새로 알게 된 것과 더 알고 싶은 것을 써 보세요.'] }
  ]
}
];
