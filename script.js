const canvas=document.getElementById('myCanvas');
const ctx=canvas.getContext('2d');
ctx.fillStyle="black";

canvas.height="300";
canvas.width="600";

let interval;

//function to draw a rectangle
function drawRectangle(x,y,width,height,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}

//function to draw a circle
function drawCircle(x,y,r,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI,false);
    ctx.closePath();
    ctx.fill();
}

//function to write text
function drawText(x,y,text,color){
    ctx.fillStyle = color;
    ctx.font="50px arial";
    ctx.fillText(text,x,y);
}

//user
const user={
    x:0,
    y:(canvas.height/2)-50,
    width:10,
    height:100,
    color:"white",
    score:0
};

//AI or the computer
const AI={
    x:canvas.width-10,
    y:(canvas.height/2) -50 ,
    width:10,
    height:100,
    color:"white",
    score:0
}

//net 
const net={
    x:(canvas.width/2)-1,
    y:0,
    width:2,
    height:10,
    color:"white"
};

function drawNet(){
    
    for(let i=0;i<canvas.height;i+=15){
        drawRectangle(net.x,net.y+i,net.width,net.height,net.color);
    }
}


const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    radius:10,
    color:"white",
    speed:5,
    velocityX:5,
    velocityY:5
};

function render(){
    //creating the canvas
    drawRectangle(0,0,canvas.width,canvas.height,"black");

    //drawing the net
    drawNet();

    //creating the score card
    drawText(canvas.width/4,canvas.height/5, user.score, "white");
    drawText(3*canvas.width/4,canvas.height/5, AI.score, "white");

    //creating the pedal
    drawRectangle(user.x, user.y, user.width, user.height,user.color);
    drawRectangle(AI.x, AI.y, AI.width, AI.height,AI.color);
   
    //the Ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);

}
render();
//collision function 
function collision(b,p){
    p.top=p.y;
    p.bottom=p.y+p.height;
    p.left=p.x;
    p.right=p.x+p.width;

    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;

    return (b.right>p.left&&b.left<p.right&&b.top<p.bottom&&b.bottom>p.top)
}

//handling the user's paddles
canvas.addEventListener("mousemove",moveUser);
function moveUser(e){
    let cordi=canvas.getBoundingClientRect();
    user.y =e.clientY-cordi.top-user.height/2;
}


//reset ball
function resetBall(){
    ball.x=canvas.width/2;
    ball.y=canvas.height/2;
    ball.speed=5;
    ball.velocityX=-ball.velocityX;
}

//update function i.e updating the movement of ball,score
function update(){

    //winning or losing result and restarting the game option
    if(user.score>=5||AI.score>=5){
        clearInterval(interval);
        if(user.score>=5||AI.score>=5)
        window.alert((user.score>AI.score)?"yeyyy! You won":"Ooops, You lose");
        user.score=0;
        AI.score=0;
        

       
    }

    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;

    //AI to control the other user's paddles
    let qFactor=0.1;
    AI.y+=(ball.y-(AI.y+AI.height/2))*qFactor;

    if(ball.y+ball.radius>canvas.height||ball.y-ball.radius<0){
        ball.velocityY=-ball.velocityY;
    }

    let player=(ball.x<canvas.width/2)?user:AI;
    if(collision(ball,player)){
        let collidePt=(ball.y-(user.y+user.height/2));
        collidePt/=(player.height/2);

        //ANGLE OF COLLISION
        let angleOfRef=(Math.PI/4)*collidePt;

        //direction of ball to change on hit
        let dirn=(ball.x<canvas.width/2)?1:-1;

        ball.velocityX=dirn*ball.speed*Math.cos(angleOfRef);
        ball.velocityY=ball.speed*Math.sin(angleOfRef);
        ball.speed+=0.5;

    }

    //score update
    if(ball.x-ball.radius<0){
        AI.score+=1;
        resetBall();
    }
    else if(ball.x+ball.radius>canvas.width){
        user.score+=1;
        resetBall();
    }

}

function game(){
    update();
    render();
}
const fps=50;



let startBtn=document.getElementById("start");
startBtn.addEventListener("click",function(){
    clearInterval(interval);
     interval=setInterval(game,20);
})

