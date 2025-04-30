function toggleMenu(){
    window.dispatchEvent(new Event("toggleMenu"));
  }
  
function mouseHover (event){
    if(event.clientX < 30){
      window.dispatchEvent(new Event("showMenu"));
    }
}

//game
const columns = 7;
const rows = 15;

let moveBar;
let previousBar = [];
const currentBar = [];
let currentColumn = 0;
let currentRow = rows - 1;
let interval = 300;
let length = 3;

let container = document.getElementById("game");
const button = document.getElementById("gameBtn");
const gameStatus = document.getElementById("gameStatus");
const text = document.getElementById("text");
const prize = document.getElementById("prize");

function init(){
    previousBar.length = 0;
    currentBar.length = 0;
    currentColumn = 0;
    currentRow = rows - 1;
    interval = 300;
    length = 3;
    container.style.minWidth = (container.offsetHeight * (columns/rows)) + "px";
    container.style.opacity = 1;
    gameStatus.style.width = container.offsetWidth + "px";
    gameStatus.style.display = "none";
    text.style.visibility = "hidden";

    container.innerHTML = "";
    for (let y = 0; y < rows; y++){
        const row = document.createElement("div");
        row.classList.add("row");
        
        for (let x = 0; x < columns; x++){
            const box = document.createElement("div");
            box.id = "box_" + x + "," + y;
            y == 0 ? box.classList.add("finalRow") : box.classList.add("box");
            row.appendChild(box);
        }
    
        container.appendChild(row);
    }
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        button.click();
    }
});

container.addEventListener('click', () => {
    button.click();
})

button.addEventListener("click", () => {
    if (button.innerHTML === "Start"){
        button.innerHTML = "Drop"
        button.disabled = true;
        begin();

        setTimeout(() => {
            button.disabled = false;
        }, interval);

    } else if (button.innerHTML === "Drop") {
        clearInterval(moveBar);
        
        if(checkBar()){
            if(currentRow == 0){
                gameStatus.innerHTML = "You Win !!!"
                gameStatus.style.display = "block";
                gameStatus.style.color = "green";
                text.style.color = "green";
                text.innerHTML = "Claim your prize !";
                prize.style.display = "block";
                
                confetti({
                    particleCount: 200,
                    spread: 150,
                    origin: { y: 0.6 }
                  });

                button.innerHTML = "Claim Prize";
                container.style.opacity = 0.5;
                return;
            }
            
            button.disabled = true;
            currentRow--;
            interval -= 17;
            
            if(currentRow < 10 && length == 3){
                length--;
            } else if (currentRow < 5 && length == 2) {
                length--;
            }
            begin();
            
            setTimeout(() => {
                button.disabled = false;
            }, interval);

        } else {
            button.innerHTML = "Try Again";
            text.style.visibility = "hidden";
        }
    } else if (button.innerHTML === "Claim Prize") {
        window.scrollTo({top:document.body.scrollHeight});
        text.style.visibility = "hidden";
        button.innerHTML = "Play Again";

    } else if (button.innerHTML === "Try Again" || button.innerHTML === "Play Again") {
        button.innerHTML = "Drop"
        init();
        begin();
    }
});


function begin(){
    let direction = "right";
    text.style.visibility = "visible";
    text.style.color = "black";
    text.innerHTML = "use spacebar or click on the stacker";
    moveBar = setInterval(() => {
        currentBar.length = 0;
        for (let col = 0; col < columns; col++){
            if(currentRow == 0){
                document.getElementById(`box_${col},${currentRow}`).style.backgroundColor 
                    = "rgb(208, 241, 208)";
            } else {
                document.getElementById(`box_${col},${currentRow}`).style.backgroundColor 
                    = "rgb(245, 245, 245)";
            }
        }

        for (let count = 0; count < length; count++){
            let col = currentColumn + count;
            document.getElementById(`box_${col},${currentRow}`).style.backgroundColor 
                = "rgb(17, 17, 17)";
            currentBar.push(col);
        }
            
        if (currentColumn === 0) {
            direction = "right";
        } else if (currentColumn + length === columns) {
            direction = "left";
        }
            
        direction === "right" ? currentColumn++ : currentColumn--;
            
    }, interval);
}

function checkBar(){
    const newBar = [];
    if(previousBar.length == 0){
        previousBar = [...currentBar];
        return true;
    }
    
    for(let count = 0; count < currentBar.length; count++){
        if(!previousBar.includes(currentBar[count])){
           document.getElementById(`box_${currentBar[count]},${currentRow}`).classList.add("blink");
           length--;
        } else {
           newBar.push(currentBar[count]);
        }
    }

    if(length == 0){
        gameStatus.innerHTML = "Game Over"
        gameStatus.style.display = "block";
        gameStatus.style.color = "red";
        container.style.opacity = 0.5;
        return false;  
    } else {
        previousBar = [...newBar];
        return true;
    }
}