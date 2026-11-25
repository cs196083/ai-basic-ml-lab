"""교과서(65~73쪽)와 같은 형태의 실습 데이터 생성
 - Iris1.csv: 붓꽃 150개(일련번호 1~150), 한글 열 이름·종류, cp949 인코딩
 - Iris2.csv: 추가 수집 30개(종류별 10개, 일련번호 151~180)
     · 결측치 12칸(꽃받침 길이 3, 꽃받침 너비 4, 꽃잎 길이 2, 꽃잎 너비 3) -> 8개 행
     · 이상치(입력 실수) 3칸: 161번 꽃받침 길이 15.0 / 165번 꽃잎 너비 111 / 173번 꽃잎 길이 55
 - tips.csv: seaborn tips 데이터셋(교과서 73쪽 실습)"""
import numpy as np, pandas as pd
from sklearn.datasets import load_iris
KOR = {0:'세토사', 1:'버시컬러', 2:'버지니카'}
cols = ['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비']
b = load_iris()
df1 = pd.DataFrame(b.data, columns=cols)
df1['종류'] = pd.Series(b.target).map(KOR)
df1.insert(0,'일련번호',range(1,151))

rng = np.random.default_rng(2024)
rows = []
for t in range(3):
    g = df1[df1['종류']==KOR[t]][cols]
    mu, sd = g.mean().values, g.std().values
    for _ in range(10):
        v = np.clip(rng.normal(mu, sd*0.8), 0.1, None).round(1)
        rows.append(list(v)+[KOR[t]])
df2 = pd.DataFrame(rows, columns=cols+['종류'])
df2.insert(0,'일련번호',range(151,181))
df2 = df2.set_index('일련번호', drop=False)
# 이상치(입력 실수)
df2.loc[161,'꽃받침 길이'] = 15.0
df2.loc[165,'꽃잎 너비'] = 111.0
df2.loc[173,'꽃잎 길이'] = 55.0
# 결측치 12칸 / 8개 행
miss = {151:['꽃받침 길이'],152:['꽃받침 너비'],153:['꽃받침 너비','꽃잎 너비'],155:['꽃받침 길이','꽃잎 길이'],
        156:['꽃받침 너비','꽃잎 너비'],162:['꽃받침 길이','꽃잎 너비'],175:['꽃받침 너비'],176:['꽃잎 길이']}
for i,cs in miss.items():
    for c in cs: df2.loc[i,c] = np.nan
df2 = df2.reset_index(drop=True)
df1.to_csv('data/Iris1.csv', index=False, encoding='cp949')
df2.to_csv('data/Iris2.csv', index=False, encoding='cp949')
print(df2.isna().sum().to_dict(), len(df2.dropna()))

# 이상치 인덱스(교과서 71쪽 방식: 종류별 IQR 울타리) - 교재 코드의 drop(index=[...]) 목록
df = pd.concat([df1, df2], ignore_index=True); df3 = df.dropna(axis=0)
out = set()
for c in cols:
    Q1 = df3.groupby('종류')[c].quantile(0.25); Q3 = df3.groupby('종류')[c].quantile(0.75)
    IQR = Q3-Q1; lo = Q1-1.5*IQR; up = Q3+1.5*IQR
    for sp in KOR.values():
        d = df3[df3['종류']==sp]
        out |= set(d[(d[c]<lo[sp])|(d[c]>up[sp])].index)
print(sorted(out), len(out))
