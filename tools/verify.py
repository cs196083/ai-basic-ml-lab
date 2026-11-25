"""모든 레슨 코드(미션은 정답으로 치환)를 순서대로 실행하고 채점 로직을 검증한다."""
import json, sys, os, io, contextlib, warnings
warnings.filterwarnings('ignore')
import matplotlib; matplotlib.use('agg')
L = json.load(open(sys.argv[1], encoding='utf-8'))
bad = 0
BLANKS = {'l1-m1':['2100'],'l2-m1':['df1','df2'],'l3-m1':['dropna'],'l3-m2':['10','0'],
          'l3-m3':['idxmax'],'l4-m1':['2'],'l5-m1':['predict'],'l6-m1':['argmax'],'l7-m1':['get'],'l7-m2':[]}
for l in L:
    ns = {'__name__':'__main__'}
    for b in l['blocks']:
        if b['t'] == 'code': code = b['code']
        elif b['t'] == 'mission':
            code = b['starter']
            for a in BLANKS.get(b['id'], []):
                code = code.replace('____', a, 1)
            assert '____' not in code, b['id']
        else: continue
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                exec(code, ns)
            if b['t'] == 'mission':
                # 빈칸 그대로이면 실패해야 함
                exec(b['check'], ns)
            print('OK  ', b['id'])
        except Exception as e:
            bad += 1; print('FAIL', b['id'], type(e).__name__, e)
        # 미션: 빈칸 상태는 SyntaxError여야 함(앱이 사전 차단)
print('실패:', bad)
