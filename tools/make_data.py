"""실습용 데이터 생성: 붓꽃 데이터를 교재처럼 두 파일(Iris1/Iris2)로 나눈다.
Iris1: 1936년 측정본(setosa 50, versicolor 50, virginica 10 -> 편향!)
Iris2: 이후 추가 수집본(virginica 40)"""
import pandas as pd
from sklearn.datasets import load_iris
b = load_iris()
df = pd.DataFrame(b.data, columns=['꽃받침 길이','꽃받침 너비','꽃잎 길이','꽃잎 너비'])
df['종류'] = pd.Series(b.target).map({0:'setosa',1:'versicolor',2:'virginica'})
df.insert(0,'번호',range(1,151))
df1 = pd.concat([df.iloc[:110]])
df2 = df.iloc[110:]
df1.to_csv('data/Iris1.csv', index=False, encoding='utf-8')
df2.to_csv('data/Iris2.csv', index=False, encoding='utf-8')
print(df1['종류'].value_counts().to_dict(), df2['종류'].value_counts().to_dict())
