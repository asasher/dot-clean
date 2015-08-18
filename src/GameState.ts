
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

                console.log(node + " has contaminated neighbour " + i)
                return true;
            }
        }
        return false;
    }

	getUpdatedState(node : number, move : number)
    {
        var nodeState = this.nodeStates[node];
        if (node == move || node == this.agentPos)
        {
            if(nodeState == -1) this.numDirtyNodes--;
            return 0;
        }
        // else if (toContaminate.get(nodeState[0], False)) return (nodeState[0],-1)
        else if (nodeState > -1 && this.hasContaminatedNeighbour(node, -1))
        {
            if (nodeState + 1 >= this.immunity)
            {
                this.numDirtyNodes++;
                return -1;
            }
           else if (this.hasContaminatedNeighbour(node, move)) return nodeState + 1;
           else return -2;
        }
        else return nodeState;
    }
	
	updateNodeStates(move : number)
    {
        console.log("Herre")
        var toCheckLater : number[] = new Array()
        for (var i = 0; i < this.nodeStates.length; i++)
        {
            var temp = this.getUpdatedState(i,move);
            if(temp == -2) toCheckLater.push(i);
            else this.nodeStates[i] = temp;
        }
        for (var node in toCheckLater)
        {
            if(this.hasContaminatedNeighbour(node,-1)) 
            {
                this.nodeStates[node] += 1;
            }
            else
            {
                this.nodeStates[node] = 0;
            }
        }
        this.agentPos = move
        console.log("numDirtyNodes = " + this.numDirtyNodes)
    }

    existsContaminatedNode()
    {
        return  (this.numDirtyNodes > 0);
    }

    
}

export = GameState;