function Deactivate(ele){
    ele.classList.add("hidden");
}
function Activate(ele){
    ele.classList.remove("hidden");
}
function RandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
function GoToEle(id, parent){
    for(let i = 0, max = parent.children.length; i < max; i++){
        let child = parent.children[i];
        if(child.id == id){
            Activate(child);
        }else{
            Deactivate(child);
        }
    }
}
function GoToIntEle(index, parent){
    for(let i = 0, max = parent.children.length; i < max; i++){
        let child = parent.children[i];
        if(i == index){
            Activate(child);
        }else{
            Deactivate(child);
        }
    }
}