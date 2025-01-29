/*
This script solely handles the player toggling logic for a local player match, and feedback for the winning color.
*/
let canplay = true;
let gamedat;

function SelectToken(evt){
    gamedat.selectedoption = evt.target.getAttribute("index");
    RenderToken(uitok, (gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions)[gamedat.selectedoption]);
}
function GameStart(){
    gamedat = {
        width: 7,
        height: 6,
        optionamt: 4,
        playerOptions: [],
        oppOptions: [],
        board: [],
        selectedoption: -1,
        playertoggle: true
    }
    clickaction = PlayToken;
    gamedat.board = InitBoard(gamedat.width,gamedat.height,75,true);
    for(let i = 0; i < gamedat.optionamt; i++){
        AddOptionTo(gamedat.playerOptions, true);
        AddOptionTo(gamedat.oppOptions, false);
    }
    InitOptions(gamedat.optionamt);
    RenderOptions(gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions);
}
async function PlayToken(x){
    if(!canplay || gamedat.selectedoption < 0){return;}
    let choice = (gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions)[gamedat.selectedoption];
    if(PlaceToken(gamedat.board, x, choice)){
        canplay = false;
        NewOptionIn(gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions, gamedat.selectedoption, gamedat.playertoggle);
        RenderOptions(gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions);
        RenderToken(uitok, (gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions)[gamedat.selectedoption]);
        RenderBoard(gamedat.board);
        await ResolveBoard(gamedat.board, OnContinue, OnFinish);
    }
}
async function OnContinue(){
    canplay = true;
    gamedat.playertoggle = !gamedat.playertoggle;
    gamedat.selectedoption = -1;
    RenderToken(uitok, 0);
    RenderOptions(gamedat.playertoggle?gamedat.playerOptions:gamedat.oppOptions);
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
}