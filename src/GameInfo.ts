class GameInfo {
 
    private static instance:GameInfo = new GameInfo();
 
    private level:number = 0;
 
    constructor() {
        if(GameInfo.instance){
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        GameInfo.instance = this;
    }
 
    public static getInstance(): GameInfo
    {
        return GameInfo.instance;
    }
 
    public setLevel(value:number):void
    {
        this.level = value;
    }
 
    public getLevel():number
    {
        return this.level;
    } 
}

export = GameInfo;