/*
This script encompasses the behavior of the game board.
It does not lean into player controls, or UI displays of win or loss.
This script's only job is to display the board based on the current board state.
*/
let showboard = [];
let symbols = ["circle", "square", "triangle"];
const matchestoremove = 3;
const connectstowin = 4;
let uitok;
let unitsize;
let unitmargin;

let clickaction;

function CreateToken(t,tm, clickable){
    let tok = document.createElement("div");
    tok.className = "token";
    tok.style.width = t;
    tok.style.height = t;
    tok.style.margin = tm;
    if(clickable){
        tok.style.pointerEvents = "auto";
    }
    let sym = document.createElement("div");
    sym.className= "shape";
    tok.appendChild(sym);
    return { token: tok, symbol: sym };
}
function CloneBoard(source){
    let boardclone = new Array(source.length);
    for(let x = 0, xmax = source.length; x < xmax;x++){
        let temp = new Array();
        for(let y = 0, ymax = source[x].length; y < ymax; y++){
            temp.push(source[x][y]);
        }
        boardclone[x] = temp;
    }
    return boardclone;
}
function InitBoard(w, h, percent, interactable){
    uitok = { token: document.getElementById("uitoken"), symbol: document.getElementById("uisymbol") };
    let board = [];
    showboard = [];
    let b = document.getElementById("board");
    ClearElement(b);
    unitsize = percent/w;
    unitmargin = percent/w * 0.05; 
    let t = `${unitsize * 0.9}vmin`;
    let tm = `${unitmargin}vmin`;
    if(uitok.token){
        uitok.token.style.width = t;
        uitok.token.style.height = t;
    }

    for(c=0; c < w; c++){
        let col = document.createElement("div");
        col.setAttribute("column", c);
        if(interactable){
            col.onpointerenter = OnColumn;
            col.onpointerup = OnClick;
        }else{
            col.pointerEvents = "none";
        }
        let temp = []
        let showtemp = [];
        for(let r=0; r<h; r++){
            let tok = CreateToken(t,tm,false);
            col.appendChild(tok.token);
            showtemp.unshift(tok);
        }
        b.appendChild(col);
        board.push(temp);
        showboard.push(showtemp);
    }
    return board;
}
function OnColumn(evt){
    let column = Number(evt.target.getAttribute("column"));
    uitok.token.style.left = `${(unitsize * column)+unitmargin}vmin`;
}
async function OnClick(evt){
    let column = Number(evt.target.getAttribute("column"));
    clickaction(column);
}
function PlaceToken(sourceboard, x, item){
    if(x < 0 || x >= sourceboard.length || sourceboard[x].length >= showboard[x].length){return false;}
    sourceboard[x].push(item);
    return true;
}
function RenderToken(ele, item){
    ele.token.className = item==0? "token":`token ${item > 0?"yellow":"red"}`;
    ele.symbol.className = item==0?"shape":`shape ${symbols[Math.abs(item)-1]}`;    
}
function RenderBoardToken(x, y, item){
    let ele = showboard[x][y];
    RenderToken(ele, item);
}
function RenderBoard(sourceboard){
    for(let x = 0, xmax = showboard.length; x < xmax; x++){
        for(let y = 0, ymax = showboard[x].length; y < ymax; y++){
            if(y >= sourceboard[x].length){
                RenderBoardToken(x,y,0);
            }else{
                RenderBoardToken(x,y,sourceboard[x][y]);
            }
        }
    }
}
function FreshBoard(source){
    let newboard = new Array(source.length)
    for(let x = 0, xmax = source.length; x < xmax;x++){
        let tempx = new Array(source[x].length);
        for(let y = 0, ymax = source[y].length; y < ymax; y++){
            tempx[y] = 0;
        }
        newboard[x] = tempx;
    }
    return newboard;
}
function outbounds(coord, sourceboard){
    return coord[0]<0||coord[1]<0||coord[0]>=sourceboard.length||coord[1] >= sourceboard[coord[0]].length;
}
function CheckRemoval(sourceboard, removeThreshold){
    let horizontal = FreshBoard(showboard);
    let vertical = FreshBoard(showboard);
    function cyclescore(pos,dir,affectBoard){
        if(outbounds(pos, sourceboard)){ return; }
        function reflectconnections(affectcoord, checkedcoord){
            if(outbounds(checkedcoord, sourceboard)){return;}
            let current = Math.abs(sourceboard[checkedcoord[0]][checkedcoord[1]]);
            affectBoard[affectcoord[0]][affectcoord[1]]++;
            let progress = [checkedcoord[0] + dir[0], checkedcoord[1] + dir[1]];
            if(outbounds(progress, sourceboard)){return;}
            let next = Math.abs(sourceboard[progress[0]][progress[1]]);
            if(current != next){return;}
            reflectconnections(affectcoord, progress);
        }
        reflectconnections(pos, pos);
    }
    for(let x = 0, xmax = sourceboard.length; x < xmax; x++){
        for(let y = 0, ymax = sourceboard[x].length; y < ymax; y++){
            cyclescore([x,y],[1,0], horizontal);
            cyclescore([x,y],[-1,0], horizontal);
            cyclescore([x,y],[0,1], vertical);
            cyclescore([x,y],[0,-1], vertical);
        }
    }
    let hwin = [], vwin = [];
    for(let x = 0, xmax = horizontal.length; x < xmax; x++){
        for(let y = 0, ymax = horizontal[x].length; y < ymax; y++){
            let h = horizontal[x][y] > removeThreshold;
            let v = vertical[x][y] > removeThreshold;
            if(h){hwin.push([x,y]);}
            if(v){vwin.push([x,y]);}
        }
    }
    let wins = [];
    function AddToWins(xwin){
        for(let x = 0, xmax = xwin.length; x < xmax; x++){
            let skip = false;
            for(let i = 0, imax = wins.length; i < imax; i++){
                if(wins[i][0] == xwin[x][0] && wins[i][1] == xwin[x][1]){
                    skip = true;
                    break;
                }
            }
            if(!skip){
                wins.unshift(xwin[x]);
            }
        }
    }
    if(hwin.length >= removeThreshold){ AddToWins(hwin); }
    if(vwin.length >= removeThreshold ){ AddToWins(vwin); }
    if(wins.length > 0){ return wins;}
    return[];
}
async function MatchRemoval(sourceboard){
    let toremove = CheckRemoval(sourceboard, matchestoremove);
    if(toremove.length>0){ 
        for(let i = 0, max = toremove.length; i < max;i++){
            let pos = toremove[i];
            let tok = showboard[pos[0]][pos[1]].token;
            let val = sourceboard[pos[0]][pos[1]];
            tok.className = `token ${val < 0?"desaturate_red":"desaturate_yellow"}`;
            sourceboard[toremove[i][0]].splice(toremove[i][1], 1);
        }
        await delay(0.5);
        RenderBoard(sourceboard);
        await delay(0.5);
        await MatchRemoval(sourceboard);
    }
}
function CheckWin(sourceboard, isplayer, winThreshold){
    let horizontal = FreshBoard(showboard);
    let vertical = FreshBoard(showboard);
    let diagonalR = FreshBoard(showboard);
    let diagonalL = FreshBoard(showboard);
    function cyclescore(pos, dir, affectBoard){
        if(outbounds(pos, sourceboard)){return;}
        function reflectconnections(affectcoord, checkedcoord){
            if(outbounds(checkedcoord, sourceboard)){return;}
            let current = sourceboard[checkedcoord[0]][checkedcoord[1]];
            if((isplayer && current > 0) || (!isplayer && current < 0)){
                affectBoard[affectcoord[0]][affectcoord[1]]++;
                let progress = [checkedcoord[0]+dir[0],checkedcoord[1]+dir[1]];
                if(!outbounds(progress, sourceboard)){
                    reflectconnections(affectcoord, progress);
                }
            }
        }
        reflectconnections(pos, pos);
    }
    for(let x = 0, xmax = sourceboard.length; x < xmax; x++){
        for(let y = 0, ymax = sourceboard[x].length; y < ymax; y++){
            if(sourceboard[x][y] != 0){
                cyclescore([x,y],[1,0], horizontal);
                cyclescore([x,y],[-1,0], horizontal);
                cyclescore([x,y],[0,1], vertical);
                cyclescore([x,y],[0,-1], vertical);
                cyclescore([x,y],[1,1], diagonalR);
                cyclescore([x,y],[-1,-1], diagonalR);
                cyclescore([x,y],[1,-1], diagonalL);
                cyclescore([x,y],[-1,1], diagonalL);
            }
        }
    }
    let hwin = [], vwin = [], dlwin = [], drwin = [];
    for(let x = 0, xmax = horizontal.length; x < xmax; x++){
        for(let y = 0, ymax = horizontal[x].length; y < ymax; y++){
            let h = horizontal[x][y] > winThreshold;
            let v = vertical[x][y] > winThreshold;
            let dl = diagonalL[x][y] > winThreshold;
            let dr = diagonalR[x][y] > winThreshold;
            if(h){ hwin.push([x,y]); }
            if(v){ vwin.push([x,y]); }
            if(dl){ dlwin.push([x,y]); }
            if(dr){ drwin.push([x,y]); }
        }
    }
    let wins = [];
    if(hwin.length >= winThreshold){ wins.push(...hwin); }
    if(vwin.length >= winThreshold ){ wins.push(...vwin); }
    if(dlwin.length >= winThreshold){ wins.push(...dlwin); }
    if(drwin.length >= winThreshold){ wins.push(...drwin); }
    if(wins.length > 0){ return wins;}
    return[];
}
function ReflectWin(sourceboard, isplayer){
    let check = CheckWin(sourceboard, isplayer, connectstowin);
    if(check.length <= 0){return false;}
    for(let i = 0, max = check.length; i< max; i++){
        let pos = check[i];
        let tok = showboard[pos[0]][pos[1]];
        tok.token.className = isplayer?"token highlight_yellow":"token highlight_red";
    }
    return true;
}
async function ResolveBoard(sourceboard, continueaction, finishaction){
    await MatchRemoval(sourceboard);
    let pwin = ReflectWin(sourceboard, true);
    let owin = ReflectWin(sourceboard, false);
    if(pwin || owin){
        if(finishaction){
            finishaction(pwin&&owin?0:pwin?1:-1);
        }
    }else{
        for(let  i =0, max = sourceboard.length; i < max; i++){
            if(sourceboard[i].length < showboard[0].length){
                if(continueaction){
                    continueaction();
                }
                return;
            }
        }
        if(finishaction){
            finishaction(0);
        }
    }
}
const delay = (n) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, n * 1000);
    });
}
function ClearElement(ele){
    while(ele.firstChild){
        ele.removeChild(ele.firstChild);
    }
}