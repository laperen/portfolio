let intros = [
    {
        width:7,height:6,
        steps:[
            {x:3,item:-3},{x:2,item:2},{x:1,item:-2},{x:3,item:1},
            {x:2,item:-1},{x:2,item:3},{x:4,item:-2},{x:2,item:1},
            {x:3,item:-3},{x:2,item:2},{x:2,item:-2},{x:1,item:1}
        ]
    },
    {
        width:7,height:6,
        steps:[
            {x:3,item:3},{x:2,item:-2},{x:4,item:1},{x:5,item:-2},
            {x:4,item:3},{x:3,item:-3},{x:4,item:1},{x:4,item:-3},
            {x:3,item:1},{x:5,item:-2},{x:4,item:3},{x:5,item:-3},
            {x:5,item:1},{x:3,item:-2},{x:3,item:2},{x:3,item:-2},
            {x:3,item:3},{x:3,item:-2},{x:5,item:2},{x:5,item:-3},
            {x:1,item:1},{x:2,item:-2},{x:2,item:2},{x:2,item:-3},
            {x:2,item:3},{x:4,item:-3},{x:2,item:2},{x:1,item:-1},
            {x:2,item:2},{x:1,item:-2},{x:3,item:1},{x:2,item:-3},
            {x:3,item:2}
        ]
    },
    {
        width:7,height:6,
        steps:[
            {x:4,item:2},{x:3,item:-3},{x:4,item:3},{x:4,item:-3},
            {x:3,item:3},{x:3,item:-3},{x:3,item:2},{x:5,item:-3},
            {x:2,item:3},{x:1,item:-2},{x:3,item:2},{x:2,item:-3},
            {x:5,item:2},{x:3,item:-3},{x:2,item:3},{x:2,item:-2},
            {x:4,item:1},{x:4,item:-1},{x:6,item:3},{x:3,item:-2},
            {x:6,item:1},{x:6,item:-2},{x:5,item:3},{x:3,item:-2},
            {x:3,item:2}
        ]
    }
];

async function PlayIntro(intro){
    board = InitBoard(intro.width, intro.height,60, false);
    await delay(0.5);
    for(let i = 0, max = intro.steps.length; i < max; i++){
        let step = intro.steps[i];
        PlaceToken(board,step.x,step.item);
        RenderBoard(board);
        await delay(0.5);
        await ResolveBoard(board);
        await delay(0.5);
    }
    await delay(1);
    PlayIntro(intros[Math.floor(Math.random()*intros.length)])
}