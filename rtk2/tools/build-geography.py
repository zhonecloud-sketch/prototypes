import json,sys
from pathlib import Path
from shapely.geometry import shape,box
R=Path(sys.argv[1]) if len(sys.argv)>1 else Path('natural-earth');ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/('dist' if (ROOT/'dist').exists() else 'rtk2');bounds=box(90,16,133,47);lands=[]
for f in json.loads((R/'land.geojson').read_text())['features']:
 g=shape(f['geometry']).intersection(bounds).simplify(.06,preserve_topology=True)
 if g.is_empty:continue
 for p in g.geoms if g.geom_type=='MultiPolygon' else [g]:
  if p.geom_type=='Polygon' and p.area>.05:lands.append([[round(x,4),round(y,4)] for x,y in p.exterior.coords])
rivers=[]
for f in json.loads((R/'rivers.geojson').read_text())['features']:
 name=f['properties'].get('name_en') or f['properties'].get('name') or ''
 if name not in ['Huang','Yellow','Yangtze','Xi Jiang','Pearl','Han','Han Jiang']:continue
 g=shape(f['geometry']).intersection(bounds).simplify(.04)
 if g.is_empty:continue
 for l in g.geoms if g.geom_type=='MultiLineString' else [g]:
  if l.geom_type=='LineString' and l.length>1:rivers.append({'name':name,'points':[[round(x,4),round(y,4)] for x,y in l.coords]})
(OUT/'china-map.json').write_text(json.dumps({'source':'Natural Earth 1:50m physical land and rivers','bounds':[90,16,133,47],'land':lands,'rivers':rivers},separators=(',',':')))
anchors=[('Xiangping','襄平',123.17,41.27),('Yuyang','漁陽',117.12,40.14),('Zhuo','涿',115.98,39.48),('Jinyang','晉陽',112.55,37.87),('Shangdang','上黨',113.1,36.19),('Ye','鄴',114.62,36.34),('Anping','安平',115.53,38.21),('Linzi','臨淄',118.31,36.81),('Chenliu','陳留',114.51,34.79),('Luoyang','洛陽',112.45,34.68),('Hedong','河東',110.99,35.02),("Chang'an",'長安',108.94,34.26),('Longxi','隴西',104.63,35.0),('Jincheng','金城',103.82,36.06),('Wuwei','武威',102.64,37.93),('Xiapi','下邳',117.95,34.3),('Xuchang','許昌',113.85,34),('Runan','汝南',114.35,33),('Wan','宛',112.54,32.99),('Xiangyang','襄陽',112.14,32.04),('Changsha','長沙',113.02,28.19),('Jiangxia','江夏',114.3,30.59),('Wuling','武陵',111.69,29.04),('Wu','吳',120.58,31.3),('Moling','秣陵',118.78,32.04),('Kuaiji','會稽',120.58,30.0),('Yuzhang','豫章',115.89,28.68),('Shouchun','壽春',116.8,32.57),('Hanzhong','漢中',107.02,33.07),('Zitong','梓潼',105.16,31.64),('Ba','巴',106.55,29.56),('Chengdu','成都',104.07,30.67),('Jianwei','犍為',103.76,29.58),('Yuexi','越巂',102.27,27.9),('Dianchi','滇池',102.75,24.8),('Yongchang','永昌',99.16,25.11),('Nanhai','南海',113.27,23.13),('Cangwu','蒼梧',111.31,23.48),('Hepu','合浦',109.2,21.66),('Yulin','鬱林',110.14,22.64),('Jiaozhi','交趾',105.87,21.14)]
ss=json.loads((OUT/'scenarios.json').read_text())
for s in ss:
 for p,a in zip(s['provinces'],anchors):p['seat'],p['seatZh'],lon,lat=a;p['geo']=[lon,lat]
(OUT/'scenarios.json').write_text(json.dumps(ss,ensure_ascii=False,separators=(',',':')))
print('Coast polygons',len(lands),'river segments',len(rivers),'anchors',len(anchors))
