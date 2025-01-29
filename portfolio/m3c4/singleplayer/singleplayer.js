/*
This script solely handles the logic, and win/loss feedback, for a single player game.
Since the player is playing against an AI, the AI logic is also within this script.
*/
let canplay;
let gamedat;

let record=[];

function SelectToken(evt){
    gamedat.selectedoption = evt.target.getAttribute("index");
    RenderToken(uitok, gamedat.playerOptions[gamedat.selectedoption]);
}
function GameStart(){
    gamedat = {
        width: 7,
        height: 6,
        optionamt:4,
        playerOptions: [],
        oppOptions: [],
        board: [],
        selectedoption: -1,
        playertoggle: Math.random() > 0.5
    }
    clickaction = PlayToken;
    gamedat.board = InitBoard(gamedat.width,gamedat.height,75, true);
    for(let i = 0; i < gamedat.optionamt; i++){
        AddOptionTo(gamedat.playerOptions, true);
        AddOptionTo(gamedat.oppOptions, false);
    }
    InitOptions(gamedat.optionamt);
    RenderOptions(gamedat.playerOptions);
    canplay = gamedat.playertoggle;
    if(!canplay){
        OpponentAI();
    }
}
async function PlayToken(column){
    if(!canplay || gamedat.selectedoption < 0){return;}
    record.push({x:column,item:gamedat.playerOptions[gamedat.selectedoption]});
    await PlayerPlayToken(column, gamedat.playerOptions, gamedat.selectedoption);
}
async function PlayerPlayToken(x, options, selectindex){
    let choice = options[selectindex];
    if(PlaceToken(gamedat.board, x, choice)){
        canplay = false;
        NewOptionIn(options, selectindex, true);
        RenderOptions(options);
        RenderToken(uitok, options[selectindex]);
        RenderBoard(gamedat.board);
        await ResolveBoard(gamedat.board, OnContinue, OnFinish);
    }
}
async function OnContinue(){
    gamedat.playertoggle = !gamedat.playertoggle;
    if(gamedat.playertoggle){
        canplay = true;
        return;
    }
    await OpponentAI();
}
function OnFinish(state){
    ClearElement(document.getElementById("options"));
    document.getElementById("finish").style.display="block";
    switch(state){
        case -1://lose
            document.getElementById("red_win").style.display="block"
            break;
        case 0://draw
            document.getElementById("draw").style.display="block";
            break;
        case 1://win
            document.getElementById("yellow_win").style.display="block";
            break;
    }
    console.log(JSON.stringify(record));
}
function TestInBoard(symbol, columnnum, setboard){
    let newboard = CloneBoard(setboard);
    newboard[columnnum].push(symbol);
    return newboard;
}
function TestPlay(startX, boardstate, isstart){
    let otest = TestInBoard(-1, startX, boardstate);
    let maximum = showboard.length * showboard[0].length;
    let score = isstart?Math.abs(startX-Math.floor(boardstate.length/2)):0;
    if(CheckWin(otest, false, connectstowin).length > 0){
        return -(10 * maximum);
    }
    let ptest = TestInBoard(1, startX, boardstate);
    if(CheckWin(ptest, true, connectstowin).length > 0){
        return -(9*maximum);
    }
    for(let i = 2; i < connectstowin; i++){
        let ptest2 = CheckWin(ptest, true, i);
        if(ptest2.length > 0){
            if(score>0){score=0;}
            score-=ptest2.length * i;
        }
    }
    for(let i = 0, max = showboard.length; i < max; i++){
        if(i >=otest.length){
            let ptest2 = TestInBoard(1,i,otest);
            if(CheckWin(ptest2, true, connectstowin)){
                score+1;
            }
        }
    }
    return score;
}
async function OpponentAI(){
    let scores = new Array();
    let isstart = true;
    for(let x = 0, max = gamedat.board.length; x < max; x++){
        if(gamedat.board[x].length > 0){
            isstart = false;
            break;
        }
    }
    for(let x = 0, max = gamedat.board.length; x < max; x++){
        if(gamedat.board[x].length < showboard[x].length){
            scores.push(TestPlay(x, gamedat.board, isstart));
        } else{
            scores.push(10);
        }
    }
    let temp = scores[0];
    let column = 0;
    for(let  i = 0, max = scores.length; i < max; i++){
        if(scores[i] < temp){
            temp = scores[i];
            column = i;
        }
    }
    let chosen = 0;
    for(let i = 0, max = gamedat.oppOptions.length; i < max; i++){
        let removal = CheckRemoval(gamedat.board, matchestoremove);
        if(removal.length <= 0){
            chosen = i;
            break;
        }
    }
    await delay(0.5);
    PlaceToken(gamedat.board, column,gamedat.oppOptions[chosen]);
    record.push({x:column,item:gamedat.oppOptions[chosen]});
    RenderBoard(gamedat.board);
    NewOptionIn(gamedat.oppOptions, chosen, false);
    await ResolveBoard(gamedat.board, OnContinue, OnFinish);
}