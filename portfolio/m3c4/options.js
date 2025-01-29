/*
This script solely contains the logic for displaying token options
*/
let showOptions = [];

function GenerateOption(isplayer){
    return Math.ceil(Math.random() * symbols.length) * (isplayer?1:-1);
}
function AddOptionTo(options, isplayer){
    options.push(GenerateOption(isplayer));
}
function NewOptionIn(options, index, isplayer){
    options[index] = GenerateOption(isplayer);
}
function RenderOptions(options){
    for(let i = 0, max = options.length; i < max; i++){
        RenderToken(showOptions[i], options[i]);
    }
}
function InitOptions(numofoptions){
    let optionspace = document.getElementById("options");
    showOptions = [];
    ClearElement(optionspace);
    for(let i = 0; i < numofoptions; i++){
        let tok = CreateToken(`${unitsize * 0.9}vmin`, `${unitmargin}vmin`, true);
        tok.token.setAttribute("index", i);
        tok.token.onclick = SelectToken;
        showOptions.push(tok);
        optionspace.appendChild(tok.token);
    }
}