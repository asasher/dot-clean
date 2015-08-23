def updateFile(filename):
	f = open(filename,'r')
	numNodes = int(f.readline())
	toWrite = str(numNodes)+"\n"
	for i in range(numNodes):
		toWrite = toWrite + f.readline()
	positions = []
	for i in range(numNodes):
		x,y = [float(x) for x in f.readline().split() ]
		positions.append([x,y])
	toWrite = toWrite + centerGraph(positions)
	f.close()
	f = open(filename,'w')
	f.write(toWrite)
	f.close()


def centerGraph(positions):
	xCenter = 0
	yCenter = 0
	numPoints = len(positions)
	minX,minY = [float('inf'),float('inf')]
	maxX,maxY = [0,0]

	for x,y in positions:
		if(x < minX):
			minX = x
		if(x > maxX):
			maxX = x
		if (y < minY):
			minY = y
		if (y > maxY):
			maxY = y

		xCenter = xCenter + x/numPoints
		yCenter = yCenter + y/numPoints

	newCenterX = 0.5
	newCenterY = 0.5
	scaleX = 0.9/(abs(minX-maxX))
	scaleY = 0.9/(abs(minY-maxY))

	toRet = ""
	for i in range(numPoints):
		positions[i][0] = (positions[i][0]-xCenter)*scaleX+newCenterX
		toRet = toRet + str(positions[i][0]) + " "
		positions[i][1] = (positions[i][1]-yCenter)*scaleY+newCenterY
		toRet = toRet + str(positions[i][1]) + " "
		if(not i == numPoints-1):
			toRet = toRet + "\n"
	return toRet

from os import listdir
from os.path import isfile, join
files = [ f for f in listdir() if isfile(f) and f[len(f)-3:]== 'txt' ]	
for filename in files:
	print(filename)
	updateFile(filename)