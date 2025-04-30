function toggleMenu(){
    window.dispatchEvent(new Event("toggleMenu"));
  }
  
function mouseHover (event){
    if(event.clientX < 30){
      window.dispatchEvent(new Event("showMenu"));
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "./images/art/sign here.png"; // make sure the path is correct

img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    init();
    resizeCanvas();
};

let flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

let color = "black",
    lineWidth = 5;

function init() {
    canvas.addEventListener("mousedown", (e) => {
        flag = true;
        [currX, currY] = getXY(e);
        [prevX, prevY] = [currX, currY];
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(currX, currY, lineWidth, lineWidth);
            ctx.closePath();
            dot_flag = false;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (flag) {
            [currX, currY] = getXY(e);
            draw();
            [prevX, prevY] = [currX, currY];
        }
    });

    canvas.addEventListener("mouseup", () => flag = false);
    canvas.addEventListener("mouseout", () => flag = false);
  }

function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);