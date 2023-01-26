var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const canvas = document.getElementById("canvas_1");
const ctx = canvas.getContext("2d");
let edge_rad = 10; 
let speed = 5;
let xMax = canvas.width = window.innerWidth * 0.55;
let yMax = canvas.height = window.innerHeight * 0.65;
let voronoi_on = true;

var engine = Engine.create();

function start(){
    var ground = Bodies.rectangle(0, canvas.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas.width + 10, 0, 20, 2000, { isStatic: true });
    Composite.add(engine.world, [ground, wall1, wall2, wall3]);
}
start();

function drew(ctx_0, x, y){
    ctx_0.fillStyle = "red";
    ctx_0.beginPath();
    ctx_0.arc(x, y, edge_rad, 0, Math.PI * 2)
    ctx_0.stroke();
    ctx_0.fill();
}

function drew_segments(ctx_0, segm){
    ctx_0.beginPath();
    ctx_0.moveTo(segm.start.x, segm.start.y);
    ctx_0.lineTo(segm.end.x, segm.end.y);
    ctx_0.strokeStyle = "#0bceaf"; 
    ctx_0.stroke();
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

function check_cords_canvas1(cords){
    if ((cords.x - edge_rad < 0) || (cords.y - edge_rad < 0)){return false;}
    if ((cords.x + edge_rad > xMax) || (cords.y + edge_rad > yMax)){return false;}

    for (let i = 0; i < edges.length; i++){
        if (Math.pow(cords.x - edges[i].position.x, 2) + Math.pow(cords.y - edges[i].position.y, 2) < 4 * edge_rad * edge_rad){
            return false;
        };
    };
    return true;
};

function new_edge_canvas1(event) {
    mouse = getMousePos(canvas, event);
    if (check_cords_canvas1(mouse)){
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

function drew_edges_canvas1(){
    for (let i = 0; i < edges.length; i++){
        drew(ctx, edges[i].position.x, edges[i].position.y);
    };
};

function clear_edges_canvas1(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine = Engine.create();
    start()
    engine.world.gravity.y = 0; 
    edges = [];
}

function voronoi_canvas_1(){
    if (edges.length < 2){return;}
    let points =[]
    for (let i = 0; i < edges.length; i++){points.push(edges[i].position);}
    let vor = new VoronoiDiagram(points, canvas.width, canvas.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx, segments[i]);
        }
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drew_edges_canvas1();
    if (voronoi_on){
        voronoi_canvas_1();
    }
    requestAnimationFrame(animate);
    Engine.update(engine, 1000 / 60);
}
animate();


function turn_voronoi(){
    voronoi_on = !voronoi_on;
}

//canvas 2

const canvas_2 = document.getElementById("canvas_2");
const ctx_2 = canvas_2.getContext("2d");
let edge_rad_canvas2 = 10; 
canvas_2.width = window.innerWidth * 0.55;
canvas_2.height = window.innerHeight * 0.65;

let edges_2 = [] 

function check_cords_canvas_2(cords){
    if ((cords.x - edge_rad_canvas2 < 0) || (cords.y - edge_rad_canvas2 < 0)){return false;}
    if ((cords.x + edge_rad_canvas2 > xMax) || (cords.y + edge_rad_canvas2 > yMax)){return false;}

    for (let i = 0; i < edges_2.length; i++){
        if (Math.pow(cords.x - edges_2[i].x, 2) + Math.pow(cords.y - edges_2[i].y, 2) < 4 * edge_rad * edge_rad){
            return false;
        };
    };
    return true;
};


function new_edge_canvas2(event) {
    mouse = getMousePos(canvas_2, event);
    if (check_cords_canvas_2(mouse)){
        edges_2.push({x:mouse.x, y:mouse.y});
        drew(ctx_2, mouse.x, mouse.y)
    };
};

function drew_edges_canvas_2(){
    for (let i = 0; i < edges_2.length; i++){
        drew(ctx_2, edges_2[i].x, edges_2[i].y);
    };
}


function clear_edges_canvas_2(){
    ctx_2.clearRect(0, 0, canvas.width, canvas.height);
    edges_2 = [];
}

function voronoi(){
    ctx_2.clearRect(0, 0, canvas.width, canvas.height);
    drew_edges_canvas_2();
    if (edges_2.length < 2){return;}
    let vor = new VoronoiDiagram(edges_2, canvas_2.width, canvas_2.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx_2, segments[i]);
        }
    }

}

window.addEventListener('resize', function(){
    xMax = canvas.width = canvas_2.width = window.innerWidth * 0.55;
    yMax = canvas.height = canvas_2.height = window.innerHeight * 0.65;
    drew_edges_canvas1();
    drew_edges_canvas_2();
});