"""모든 레슨 코드를 순서대로 실행해 검증한다.
 - code 셀: 그대로 실행(expectError 셀은 오류가 나야 정상)
 - mission: 빈칸(____)을 정답으로 채워 실행 → 채점(check) 통과 확인, 빈칸 상태로는 채점이 통과하면 안 됨
사용: python tools/verify.py <lessons.json>   (cwd 는 프로젝트 루트)"""
import json, sys, os, io, shutil, tempfile, contextlib, warnings, types
warnings.filterwarnings('ignore')
import matplotlib; matplotlib.use('agg')
import pandas as pd, seaborn as sns
sys.modules['koreanize_matplotlib'] = types.ModuleType('koreanize_matplotlib')
root = os.getcwd()
tmp = tempfile.mkdtemp()
for f in ['Iris1.csv','Iris2.csv','tips.csv']: shutil.copy(os.path.join(root,'data',f), tmp)
os.chdir(tmp)
_o = sns.load_dataset
sns.load_dataset = lambda n,*a,**k: pd.read_csv('tips.csv') if n=='tips' else _o(n,*a,**k)

BLANKS = {
 'l2-m1':['pd','read_csv','head'], 'l2-m2':['concat'],
 'l3-m1':['isna','0'], 'l3-m2':['groupby'], 'l3-m3':['0.75','Q1','1.5'], 'l3-m4':['버시컬러','>'],
 'l3-m5':['drop'], 'l3-m6':['pearson','True'], 'l3-m7':['tips','idxmax'],
 'l4-m1':['KMeans','3','predict'], 'l4-m2':['predicted'],
 'l5-m1':['종류','0.2'], 'l5-m2':['fit','y_train'],
 'l6-m1':['score'], 'l6-m2':['predict','predicted'], 'l6-m3':['20','k','score'], 'l6-m4':['1.5','predict'],
 'l6-m5':['FP','FN','precision'],
 'l7-m1':['종류'], 'l7-m2':['LinearRegression','intercept_'], 'l7-m3':['y_test'], 'l7-m4':['1','predict'],
 'l7-m5':['LogisticRegression','SVC','DecisionTreeClassifier'],
}
L = json.load(open(sys.argv[1], encoding='utf-8'))
bad = 0; n = 0
def run(code, ns):
    with contextlib.redirect_stdout(io.StringIO()):
        exec(compile(code,'<셀>','exec'), ns)
for l in L:
    ns = {'__name__':'__main__'}
    for b in l['blocks']:
        if b['t'] not in ('code','mission'): continue
        n += 1
        try:
            if b['t']=='code':
                try: run(b['code'], ns); ok_run = not b.get('expectError')
                except Exception as e:
                    if not b.get('expectError'): raise
                    ok_run = True
                assert ok_run, 'expectError 셀인데 오류가 나지 않음'
            else:
                code = b['starter']
                for a in BLANKS[b['id']]: code = code.replace('____', a, 1)
                assert '____' not in code, '빈칸 수 불일치'
                assert code.count('____') == 0
                run(code, ns); exec(b['check'], ns)
            print('OK  ', b['id'])
        except Exception as e:
            bad += 1; print('FAIL', b['id'], type(e).__name__, str(e)[:150])
    # 빈칸 개수 = BLANKS 개수 확인
    for b in l['blocks']:
        if b['t']=='mission': assert b['starter'].count('____')==len(BLANKS[b['id']]), b['id']
print('셀', n, '/ 실패', bad)
