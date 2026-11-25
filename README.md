# 🌸 기계학습 실습실

인공지능 기초 Ⅱ-1. 기계학습(교과서 59~81쪽)의 이론을 읽고, **브라우저에서 바로 파이썬 코드를 실행**하며 배우는 자기주도 실습 시뮬레이션입니다.
설치 없이 [Pyodide](https://pyodide.org)로 pandas · scikit-learn · matplotlib이 브라우저 안에서 실행됩니다.

## 구성 (교과서 59~89쪽의 실습 코드 + 핵심 줄 빈칸 채우기)
| 단계 | 교과서 | 내용 |
|---|---|---|
| 1 | 59~62쪽 | 기계학습 개념, 6단계, 군집·분류·회귀 문제 정의 (퀴즈) |
| 2 | 63~67쪽 | 데이터 수집, `read_csv`, `concat`으로 Iris1+Iris2 통합 |
| 3 | 66~73쪽 | 결측치(`isna`, `dropna`), 이상치(`describe`, 히스토그램, 박스플롯, IQR, `drop`), 핵심 속성(`pairplot`, 히트맵), tips 실습 |
| 4 | 74~76, 85, 88쪽 | 학습 유형·알고리즘 선정, KMeans 군집 |
| 5 | 76~77쪽 | X·y 분리, `train_test_split`, `KNeighborsClassifier.fit` |
| 6 | 78~81쪽 | `score`, 혼동행렬, k 변경, `predict`, 정밀도·재현율·F1 |
| 7 | 82~89쪽 | 선형 회귀(원-핫 인코딩, `coef_`, R²), 알고리즘 4종 비교 |

각 단계: 이론 → 퀴즈 → 실행 셀 → **빈칸(`____`) 채우기 미션(자동 채점, 성공 후에만 모범 정답 공개)** → 생각 정리.
진행 상황은 localStorage에 저장되며 "나의 학습 기록"에서 txt로 내보낼 수 있습니다.

## 로컬 실행
```
python -m http.server 8000   # 후 http://localhost:8000
```
## 개발 도구
- `tools/make_data.py` 실습 데이터 생성 · `tools/verify.py` 모든 코드·정답·채점 검증

## 라이선스/출처
- 붓꽃 데이터: Fisher (1936), scikit-learn 내장 데이터. `Iris2.csv`(추가 30개·결측치·이상치 포함)는 교과서 형태를 따라 만든 연습용 가상 데이터. tips: seaborn-data · 폰트: 나눔고딕(SIL OFL 1.1)
