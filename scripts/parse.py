import fileinput
import json
import sys
from glob import glob

lines = [line.strip() for line in fileinput.input(glob(sys.argv[1]))]

at = 0
data = []
while at < len(lines):
	n = int(lines[at])
	at = at + 1
	
	matrix = [[int(x) for x in lines[i].split()] for i in range(at, at + n)]	
	at = at + n
	
	nodes = [[float(x) for x in lines[i].split()] for i in range(at, at + n)]
	at = at + n
	
	immunity = int(lines[at])	
	at = at + 1

	datum = {
		'nodes' : nodes,
		'adjMatrix' : matrix,
		'immunityNumber' : immunity
	}
	
	data.append(datum)
	
print json.dumps(data, indent=4, sort_keys=False)
	