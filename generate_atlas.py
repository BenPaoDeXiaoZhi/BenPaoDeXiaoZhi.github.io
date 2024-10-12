import json

import cv2
import numpy
import requests
import os

spr_name = input('spr_name:')
url = 'https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/%s/%s.%%s' % (spr_name, spr_name)
try:
    os.mkdir('spr/%s' % spr_name)
except:
    pass
img_req = requests.get(url % 'png')
open('spr/%s/%s.png' % (spr_name, spr_name), 'wb').write(img_req.content)
img_req.close()
atlas_req = requests.get(url % 'atlas')
atlas_data = atlas_req.content.decode()
open('spr/%s/%s.atlas' % (spr_name, spr_name), 'w').write(atlas_data)
atlas_req.close()
atlas_index = ''
atlas_value = {}
img = cv2.imread('spr/%s/%s.png' % (spr_name, spr_name), cv2.IMREAD_UNCHANGED)
for i in atlas_data.splitlines()[2:]:
    if ': ' in i:
        if atlas_index != '':
            atlas_value[atlas_index][i.split(': ')[0][2:]] = i.split(': ')[1]
    else:
        atlas_index = i
        atlas_value[atlas_index] = {}
print(json.dumps(atlas_value, ensure_ascii=0, indent=' '))
try:
    os.mkdir('spr/%s/atlas' % spr_name)
except:
    pass
for i in atlas_value:
    xy = atlas_value[i]['xy'].split(', ')
    size = atlas_value[i]['size'].split(', ')
    print(i, xy, size,atlas_value[i]['rotate'],(int(xy[0]) + int(size[1])),(int(xy[1]) + int(size[0])))
    if atlas_value[i]['rotate'] == 'true':
        a = img[int(xy[1]): (int(xy[1]) + int(size[0])), int(xy[0]): (int(xy[0]) + int(size[1]))]
        a = cv2.rotate(a,cv2.ROTATE_90_CLOCKWISE)
        cv2.imwrite('spr/%s/atlas/%s.png' % (spr_name, i), a)
        for j in range(int(xy[1]), (int(xy[1]) + int(size[0]))):
            for k in range(int(xy[0]), (int(xy[0]) + int(size[1]))):
                if img[j,k,3] != 0:
                    img[j,k] = (0,0,0,0)
    else:
        a = img[int(xy[1]): (int(xy[1])+int(size[1])), int(xy[0]): (int(xy[0])+int(size[0]))]
        cv2.imwrite('spr/%s/atlas/%s.png' % (spr_name, i), a)
        for j in range(int(xy[1]), (int(xy[1]) + int(size[1]))):
            for k in range(int(xy[0]), (int(xy[0]) + int(size[0]))):
                if img[j, k, 3] != 0:
                    img[j, k] = (0, 0, 0, 0)
    cv2.imwrite('a.png',img)
    print(a.shape,img.shape)
