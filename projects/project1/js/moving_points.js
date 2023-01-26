var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const canvas = document.getElementById("canvas_1");
const ctx = canvas.getContext("2d");
let xMax = canvas.width = window.innerWidth * 0.55;
let yMax = canvas.height = window.innerHeight * 0.65;
let edge_rad = 10; 
let speed = 10;


var engine = Engine.create();

function start(){
    var ground = Bodies.rectangle(0, canvas.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas.width + 10, 0, 20, 2000, { isStatic: true });
    Composite.add(engine.world, [ground, wall1, wall2, wall3]);
}
start();

function drew(edge){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(edge.position.x, edge.position.y, edge_rad, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}

let edges = [];
engine.world.gravity.y = 0; 


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
        if (Math.pow(cords.x - edges[i].position.x, 2) + Math.pow(cords.y - edges[i].position.y, 2) < 4 * edge_rad * edge_rad){
            return false;
        };
    };
    return true;
};

function new_edge(event) {
    mouse = getMousePos(canvas, event);
    if (check_cords(mouse)){
        edges.push(Bodies.circle(mouse.x, mouse.y, edge_rad, {
        inertia: Infinity,
        frictionStatic: 1,
        restitution: 1,
        friction: 0,
        frictionAir: 0
    }));
        Composite.add(engine.world, edges[edges.length - 1]);
        let angel = Math.random() * 2 * Math.PI;
        Matter.Body.setVelocity(edges[edges.length - 1], {x: speed * Math.cos(angel), y: speed * Math.sin(angel),})
    };
};

function drew_edges(){
    for (let i = 0; i < edges.length; i++){
        drew(edges[i]);
    };
};

function clear_edges(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine = Engine.create();
    start()
    engine.world.gravity.y = 0; 
    edges = [];
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drew_edges();
    requestAnimationFrame(animate);
    Engine.update(engine, 1000 / 60);
}

animate()



window.addEventListener('resize', function(){
    xMax = canvas.width = window.innerWidth * 0.55;
    yMax = canvas.height = window.innerHeight * 0.65;
    drew_edges();
});