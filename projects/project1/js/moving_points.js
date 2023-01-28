var canvas_width = 1536;
var canvas_height = 1000;
var zoom_scale_x = 1;
var zoom_scale_y = 1;

var edge_rad_standart = 40;
var edges_rad_max;

var edges_rad_canvas_1;
var edges_rad_canvas_2;

var render = 1000.0/30.0; //fps
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;


var engine = Engine.create();
engine.world.gravity.y = 0; 

let speed = 5;
let voronoi_on = true;


var edges_positions_canvas_1 = [];
var edges_canvas_2 = [];
var edges_bodies_canvas_1 = [];

var canvas_1 = document.getElementById("canvas_1");
var canvas_2 = document.getElementById("canvas_2");
const ctx_1 = canvas_1.getContext("2d");
const ctx_2 = canvas_2.getContext("2d");

var xMax;
var yMax;

function min(x, y){
    if (x < y){return x;}
    else{return y;}
}

window.onload = function(){

    resizeCanvas(canvas_1);
    resizeCanvas(canvas_2);
    
    spawn_walls();
    
    //canvas.onmousedown = function(e) { onCanvasMouseDown(canvas, e); };
    //canvas.onmousemove = function(e) { onCanvasMouseMove(canvas, e); };
    //canvas.onmouseup = function(e) { onCanvasMouseUp(canvas, e); };
    //canvas.onwheel = function(e) { onCanvasMouseWheel(canvas, e); };

    edges_rad_canvas_1 = edges_rad_max;
    edges_rad_canvas_2 = edges_rad_max;
    animate();
}


function resizeCanvas(canvas)
{
    xMax = canvas.width  = window.outerWidth / 2.1 + 100;
    yMax = canvas.height = canvas.offsetHeight * 3;
    zoom_scale_x = zoom_scale_x * canvas.width / canvas_width;
    zoom_scale_y = zoom_scale_y * canvas.height  / canvas_height; 
    edges_rad_max = min(zoom_scale_x, zoom_scale_y) * edge_rad_standart;
    recordinate_edges();
}
window.addEventListener('resize', function(){
    resizeCanvas(canvas_1);
    resizeCanvas(canvas_2);
});

function recordinate_edges(){
    for (let i = 0; i < edges_positions_canvas_1.length; i++){
        edges_positions_canvas_1[i].x = edges_positions_canvas_1[i].x * zoom_scale_x;
        edges_positions_canvas_1[i].y = edges_positions_canvas_1[i].y * zoom_scale_y;
    }
    for (let i = 0; i < edges_canvas_2.length; i++){
        edges_canvas_2[i].x = edges_canvas_2[i].x * zoom_scale_x;
        edges_canvas_2[i].y = edges_canvas_2[i].y * zoom_scale_y;
    }
}


function spawn_walls(){
    var ground = Bodies.rectangle(0, canvas_1.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas_1.width + 10, 0, 20, 2000, { isStatic: true });
    Composite.add(engine.world, [ground, wall1, wall2, wall3]);
}

function drew(ctx, point, rad){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(point.x, point.y, rad, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}

function drew_segments(ctx, segm){
    ctx.beginPath();
    ctx.moveTo(segm.start.x, segm.start.y);
    ctx.lineTo(segm.end.x, segm.end.y);
    ctx.strokeStyle = "#0bceaf"; 
    ctx.stroke();
}



function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};


function check_cords(cords, edges, rad){
    if ((cords.x - rad < 0) || (cords.y - rad < 0)){return false;}
    if ((cords.x + rad > xMax) || (cords.y + rad > yMax)){return false;}

    for (let i = 0; i < edges.length; i++){
        if (Math.pow(cords.x - edges[i].x, 2) + Math.pow(cords.y - edges[i].y, 2) < 4 * rad * rad){
            return false;
        };
    };
    return true;
};

function new_edge_canvas1(event) {
    mouse = getMousePos(canvas_1, event);
    if (check_cords(mouse, edges_positions_canvas_1, edges_rad_canvas_1)){
        let body =  Bodies.circle(mouse.x, 
                                mouse.y, 
                                edges_rad_canvas_1, 
                                {
                                    inertia: Infinity,
                                    frictionStatic: 1,
                                    restitution: 1,
                                    frictionAir: 0,
                                    friction: 0,
                                });
        edges_bodies_canvas_1.push(body);
        Composite.add(engine.world, body);
        let angel = Math.random() * 2 * Math.PI;
        Matter.Body.setVelocity(body, {x: speed * Math.cos(angel), y: speed * Math.sin(angel),});
        edges_positions_canvas_1.push(body.position);
    };
};

function new_edge_canvas2(event) {
    mouse = getMousePos(canvas_2, event);
    if (check_cords(mouse, edges_canvas_2, edges_rad_canvas_2)){
        edges_canvas_2.push({x:mouse.x, y:mouse.y});
        drew(ctx_2, mouse, edges_rad_canvas_2)
    };
};


function drew_edges(ctx, edges, rad){
    for (let i = 0; i < edges.length; i++){
        drew(ctx, edges[i], rad);
    };
};

function clear_edges_canvas1(){
    ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
    engine = Engine.create();
    spawn_walls()
    engine.world.gravity.y = 0; 
    edges_positions_canvas_1 = [];
    edges_bodies_canvas_1 = [];
}

function clear_edges_canvas_2(){
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    edges_canvas_2 = [];
}

function voronoi_canvas_1(){
    if (edges_positions_canvas_1.length < 2){return;}
    let vor = new VoronoiDiagram(edges_positions_canvas_1, canvas_1.width, canvas_1.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx_1, segments[i]);
        }
    }
}

function animate(){
    ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
    drew_edges(ctx_1, edges_positions_canvas_1, edges_rad_canvas_1);
    if (voronoi_on){
        voronoi_canvas_1();
    }
    requestAnimationFrame(animate);
    Engine.update(engine, render);
}


function turn_voronoi(){
    voronoi_on = !voronoi_on;
}


function voronoi(){
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    drew_edges(ctx_2, edges_canvas_2, edges_rad_canvas_2);
    if (edges_canvas_2.length < 2){return;}
    let vor = new VoronoiDiagram(edges_canvas_2, canvas_2.width, canvas_2.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx_2, segments[i]);
        }
    }

}
