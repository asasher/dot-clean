
class GameState {
	nodeStates : number[];
    adjacencyMatrix : number[][];
    agentPos : number;
    //final static int CHECK_LATER = -2;
    immunity : number;
    numDirtyNodes : number;

	constructor(adjacencyMatrix: number[][], immunity: number) {
        this.adjacencyMatrix = adjacencyMatrix;
		this.nodeStates = new Array(adjacencyMatrix.length);
        this.agentPos = -1;
        this.immunity = immunity;        
        this.setInitNodeState();
	}

	setInitNodeState()
    {
        for (var i = 0; i < this.nodeStates.length; i++)
        {
            this.nodeStates[i] = -1;
        }
        this.numDirtyNodes = this.nodeStates.length;
    }

    hasContaminatedNeighbour(node : number, toExclude : number)
    {
        for (var i = 0; i < this.adjacencyMatrix[node].length; i++)
        {   
            if(i == toExclude || this.adjacencyMatrix[node][i] == 0 ) continue;
            else if (this.nodeStates[i] == -1) 
            {

           //     console.log(node + " has contaminated neighbour " + i)
                return true;
            }
        }
        return false;
    }

	getUpdatedState(node : number, move : number)
    {
        var nodeState = this.nodeStates[node];

		var toRet = nodeState
        if (node == move || node == this.agentPos)
        {
            if(nodeState == -1) this.numDirtyNodes--;
		// 	if(node == move)
		// 	{
		// //		console.log("move == " + node + " so setting exposure to 0")
		// 	}
		// 	else 
		// 	{
		// //		console.log("agentPos ==" + node + " so setting exposure to 0")
		// 	}
			toRet = 0
        }
        // else if (toContaminate.get(nodeState[0], False)) return (nodeState[0],-1)
        else if (nodeState > -1 && this.hasContaminatedNeighbour(node, -1))
        {
            if (nodeState + 1 >= this.immunity)
            {
                this.numDirtyNodes++;
                toRet = -1;
            }
           else if (this.hasContaminatedNeighbour(node, move)) toRet= nodeState + 1;
           else toRet = -2;
        }
		//console.log("setting state of node " + node + " to " + toRet )
        return toRet
    }
	
	updateNodeStates(move : number)
    {
        //console.log("Going from " + this.agentPos + " to " + move)
        var toCheckLater : number[] = new Array()
        for (var i = 0; i < this.nodeStates.length; i++)
        {
            var temp = this.getUpdatedState(i,move);

            if(temp == -2) toCheckLater.push(i);
            else this.nodeStates[i] = temp;
        }
		//console.log(toCheckLater)
        for (var i = 0; i < toCheckLater.length; i++)
        {
			var node = toCheckLater[i]
		//	console.log("checking later " + node )
            if(this.hasContaminatedNeighbour(node,-1)) 
            {
                this.nodeStates[node] += 1;
            }
            else
            {
				//console.log(node + " has no contaminated neighbour so setting exposure to 0")
                this.nodeStates[node] = 0;
            }
        }
        this.agentPos = move
       // console.log("numDirtyNodes = " + this.numDirtyNodes)
        //console.log(this.nodeStates)
    }

    existsContaminatedNode()
    {
        return  (this.numDirtyNodes > 0);
    }

    
}

export = GameState;