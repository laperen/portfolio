
let bannerimgcount = fadercover.children.length
let bannerindex = 0;
let toggler = false;
GoToIntEle(bannerindex, fadercover);
function AnimEndCallback(){
    if(bannerindex >= bannerimgcount){bannerindex = 0;}
    GoToIntEle(bannerindex, fadercover);
    bannerindex++
}
fadercover.addEventListener("animationiteration", AnimEndCallback, false);