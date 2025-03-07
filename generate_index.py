import tkinter.filedialog as fd
import os

root_dir = fd.askdirectory()
def walk_dir(dir):
    print('/'+dir)
    dir_list = os.listdir(root_dir+'/'+dir)
    try:
        dir_list.remove('.git')
        dir_list.remove('.idea')
    except:
        pass
    try:
        dir_list.remove('index.html')
    except:
        pass
    print(dir_list)
    index_html = '<!DOCTYPE html><head><meta charset="utf-8"><title>Meng Files @%s</title></head><html><body>'%(('/'+dir).replace('//','/'))
    try:
        index_html += '<a href=\"./\">./<a/><br><br>\n'
    except Exception as E:
        print(repr(E))
        index_html += 'now on /<br>\n'
    for i in dir_list:
        index_html += '<a href=./%s>%s:%s</a><br>'%(i,os.path.isdir(root_dir+dir+'/'+i),i)
    index_html += '</body></html>'
    open(root_dir+'/'+dir+'/index.html','w',encoding='utf-8').write(index_html)
    for i in dir_list:
        if os.path.isdir(root_dir+dir+'/'+i):
            print(root_dir + dir + '/'+i)
            walk_dir(dir+'/'+i)
        else:
            print('-'+dir + '/'+i)
walk_dir('')