import re, json, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(root)
s = open('js/app.js', encoding='utf-8').read()
py = re.search(r"const PY_HARNESS = `(.*?)\n`;", s, re.S).group(1)
py = py.replace('/home/pyodide/NanumGothic.ttf', root.replace(chr(92),'/') + '/assets/NanumGothic.ttf')
exec(py)
r = json.loads(_run("import pandas as pd\nimport matplotlib.pyplot as plt\ndf=pd.read_csv('data/Iris1.csv')\nplt.plot([1,2]); plt.title('한글')\nprint('hi')\ndf.head(2)"))
print(r['stdout'].strip(), [i[0] for i in r['items']], len(r['figs']), r['err'])
for c in ['x = undefined_var', "df['없음']", 'if True print(1)']:
    print(json.loads(_run(c))['err'])
print(_check("assert 1==2, '메시지'"))
