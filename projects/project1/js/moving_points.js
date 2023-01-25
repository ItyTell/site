const canvas = document.getElementById("canvas_1");
const ctx = canvas.getContext("2d");
let xMax = canvas.width = window.innerWidth * 0.55;
let yMax = canvas.height = window.innerHeight * 0.65;
let edge_rad = 3 

class Edge{

    constructor(x, y){
        this.x = x
        this.y = y
    }

    drew(){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, edge_rad, 0, Math.PI * 2)
        ctx.stroke();
        ctx.fill();
    }
};
let edges = [];


function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

function check_cords(cords){
    if ((cords.x - edge_rad < 0) || (cords.y - edge_rad < 0)){return false;}
    if ((cords.x + edge_rad > xMax) || (cords.y + edge_rad > yMax)){return false;}

    for (let i = 0; i < edges.length; i++){
        if (Math.pow(cords.x - edges[i].x, 2) + Math.pow(cords.y - edges[i].y, 2) < 4 * edge_rad * edge_rad){
            return false;
        };
    };
    return true;
};

function new_edge(event) {
    mouse = getMousePos(canvas, event);
    if (check_cords(mouse)){
        edges.push(new Edge(mouse.x, mouse.y))
        edges[edges.length - 1].drew();
        console.log(mouse.x, mouse.y);
    };
};

function drew_edges(){
    for (let i = 0; i < edges.length; i++){
        edges[i].drew();
    };
};

function clear_edges(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    edges = [];
}

window.addEventListener('resize', function(){
    xMax = canvas.width = window.innerWidth * 0.55;
    yMax = canvas.height = window.innerHeight * 0.65;
    drew_edges();
});