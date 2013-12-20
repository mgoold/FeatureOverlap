
import os, traceback, csv, codecs, decimal, datetime, string,time, json
import operator
from datetime import *

class autoviv(dict):
    """Implementation of perl's autovivification feature."""
    def __getitem__(self, item):
        try:
            return dict.__getitem__(self, item)
        except KeyError:
            value = self[item] = type(self)()
            return value

leg_dict=autoviv()

filepath='FeatureOverlapDistinctPatternJanJulNov2013.txt'
mtrx=autoviv()
mtrx['column_totals']=autoviv()

csvfile=open(filepath,'rU')

f = csv.reader(csvfile, delimiter='\t', quotechar="'")
f.next()


def count_col_totals(rowstr_obj,rowct):
	for obj in rowstr_obj.split('--'):
		if obj in mtrx['column_totals'].keys():
			mtrx['column_totals'][obj]=int(mtrx['column_totals'][obj])+int(rowct)
		else:
			mtrx['column_totals'][obj]=int(rowct)

def legend_dict(rowstr_obj2):
	for obj in rowstr_obj2.split('--'):
		if obj.split('-')[0] not in leg_dict.keys():
			leg_dict[obj.split('-')[0]]=obj.split('-')[1]

def find_best_row_match(mtrx_obj,gb_val,rowstr_obj,rowct):

	print 'in function', gb_val,rowstr_obj,rowct

	rowstr_obj2=rowstr_obj
	rowstr_obj='--'.join(sorted(subobj.split('-')[1] for subobj in rowstr_obj.split('--')))
# 	print 'rowstr_obj',rowstr_obj
	
# 	for subobj in rowstr_obj2.split('--'):
# 		if subobj.split('-')[0] not in leg_dict.keys():
# 			leg_dict[subobj.split('-')[0]]=subobj.split('-')[1]
	
	templen=len(rowstr_obj2.split('--'))
	newcount=rowct
	
	count_col_totals(rowstr_obj,rowct)
	legend_dict(rowstr_obj2)
	
	if gb_val not in mtrx_obj['groups'].keys():
# 		print 'didn\'t find group key'
		mtrx_obj['groups'][gb_val]['grplist']=autoviv()
			
	if rowstr_obj in mtrx_obj['groups'][gb_val]['grplist'].keys():
		mtrx_obj['groups'][gb_val]['grplist'][rowstr_obj]=int(mtrx_obj['groups'][gb_val]['grplist'][rowstr_obj])+int(rowct)
	
	else:
# 		print 'didnt find in keys'
		mtrx_obj['groups'][gb_val]['grplist'][rowstr_obj]=int(rowct)
											
	
	return
		
#	ELSE FIND THE ROW THAT HAS THE MOST ELEMENTS IN COMMON

grpbycol=3
featcol=4
countcol=5
rowct=0
mtrx['max']=0


for row in f:
# 	print 'row', rowct, row[grpbycol],row[featcol],row[countcol]
	
	find_best_row_match(mtrx,row[grpbycol],row[featcol],row[countcol])
	
# 	print 'row[grpbycol]',grpbycol,row[grpbycol]
# 	print 'row[featcol]',featcol,row[featcol]
# 	print 'row[countcol]',countcol,row[countcol]

	rowct=rowct+1

csvfile.close()


print 'column_totals before sort', mtrx['column_totals']	

totlist=[]

for k in mtrx['column_totals'].keys():
 obj=[]
 obj.append(k)
 obj.append(mtrx['column_totals'][k])
# 		 print 'k', k, mtrx['column_totals'][k]
 totlist.append(obj)

sorted = False  # We haven't started sorting yet

while not sorted:
	sorted = True  # Assume the list is now sorted
	for i in range(0, len(totlist)-1):
# 			print 'totlist comp', totlist[i][1], totlist[i+1][1]
		if totlist[i][1]<totlist[i+1][1]:
			'switching'
			sorted = False  # We found two elements in the wrong order
# 				print 'templist obj', sorted, len(templist[i][0]), len(templist[i+1][0])
			hold = totlist[i]
			totlist[i] = totlist[i+1]
			totlist[i+1] = hold

mtrx['column_totals']=totlist	

mtrx['maxcats']='--'.join(subobj[0] for subobj in mtrx['column_totals'])


totlist=[]	

for gb_val in mtrx['groups']:
# 	print mtrx['groups'][gb_val]['grplist']
# 	mtrx['groups'][gb_val]['grplist']=sorted(mtrx['groups'][gb_val]['grplist'].iteritems(), key=operator.itemgetter(1),reverse=True)[0:100]

	templist=mtrx['groups'][gb_val]['grplist']
	totlist=[]
	
	
	for k in templist.keys():
		 obj=[]
		 obj.append(k)
		 obj.append(templist[k])
# 		 print 'k', k, mtrx['column_totals'][k]
		 totlist.append(obj)
	
	templist=totlist
	
	sorted = False  # We haven't started sorting yet
	
	while not sorted:
		sorted = True  # Assume the list is now sorted
		for i in range(0, len(templist)-1):
			if templist[i][1]<templist[i+1][1]:
				sorted = False  # We found two elements in the wrong order
# 				print 'templist obj', sorted, len(templist[i][0]), len(templist[i+1][0])
				hold = templist[i]
				templist[i] = templist[i+1]
				templist[i+1] = hold	
	
# 	GET TOP 100 items in group.
	
	templist=templist[0:100]

	sorted = False  # We haven't started sorting yet
	
	while not sorted:
		sorted = True  # Assume the list is now sorted
		for i in range(0, len(templist)-1):
			if len(templist[i][0])<len(templist[i+1][0]):
				sorted = False  # We found two elements in the wrong order
# 				print 'templist obj', sorted, len(templist[i][0]), len(templist[i+1][0])
				hold = templist[i]
				templist[i] = templist[i+1]
				templist[i+1] = hold
	
	mtrx['groups'][gb_val]['grplist']=templist
	
	templist=[];
	mtrx['groups'][gb_val]['sublegend']=[];
	mtrx['groups'][gb_val]['subtotals']=autoviv();
	tempsublegend=''
	tempmax=0;
		
	for obj in mtrx['groups'][gb_val]['grplist']:
# 		print 'obj', obj
		tempmax=int(tempmax)+int(obj[1])				
		
		for item in obj[0].split('--'):
			if item not in mtrx['groups'][gb_val]['sublegend']:
				mtrx['groups'][gb_val]['sublegend'].append(item)
				mtrx['groups'][gb_val]['subtotals'][item]=0
		for i in obj:
			templist.append(i)

		mtrx['groups'][gb_val]['subtotals'][item]=int(mtrx['groups'][gb_val]['subtotals'][item])+int(obj[1])
		
	mtrx['groups'][gb_val]['grplist']=templist

	templist=[]
	
	sublegend=''
	
	for obj in mtrx['column_totals']:
# 		print 'obj', obj
		if obj[0] in mtrx['groups'][gb_val]['sublegend']:
			if sublegend=='':
				sublegend=obj[0]
			else:
				sublegend=sublegend+'--'+obj[0]
	
# 	print 'sublegend', mtrx['groups'][gb_val]['sublegend'],sublegend
				
	mtrx['groups'][gb_val]['sublegend']=sublegend

	mtrx['groups'][gb_val]['grand_total']=tempmax
	
	if int(tempmax)>int(mtrx['max']):
		mtrx['max']=int(tempmax)

mtrx['legend_dict']=leg_dict
# mtrx['final_legend']='--'.join(mtrx['legend_dict'][k] for k in mtrx['maxcats'].split('--'))

# for k in mtrx['legend_dict'].keys():
# 	if mtrx['maxcats']=='':
# 		mtrx['maxcats']=k
# 	else:
# 		mtrx['maxcats']=mtrx['maxcats']+'--'+k	


# print 'mtrx', mtrx

# print 'printing mtrx'
with open('FeatureOverlapDistinctPatternFTRegSub2013.json', 'wb') as fp:
    json.dump(mtrx, fp)

fp.close()






