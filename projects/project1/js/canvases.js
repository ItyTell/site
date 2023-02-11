
class Canvas {
    constructor(id){
        this.cnv = document.getElementById(id);
        const ctx = this.cnv.getContext("2d");
        this.ctx = ctx;
        this.rad = 3;
        this.points = [];
    }

    drew_points(){this.points.forEach(point=>{drew_point(this.ctx, point, this.rad);})}


}

var canvas_width_old;
var canvas_height_old;
var zoom_scale_x;
var zoom_scale_y;
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
var render;
var engine;
var speed;
var voronoi_on;
var delone_on;
var vor_anim;
var tri;
var cash;
var then;
var now;
var anim_length;
var points_bodies_canvas_1 = [];
var walls = [];
var canvas_1 = new Canvas("canvas_1");
var canvas_2 = new Canvas("canvas_2");
var canvas_3 = new Canvas("canvas_3");
var canvas_4 = new Canvas("canvas_4");
var canvas_5 = new Canvas("canvas_5")
var canvases = [canvas_1, canvas_2, canvas_3, canvas_4, canvas_5];
var anim_cooldown = 10.0;
var anime_on = false;
var xMax;
var yMax;

function min(x, y){
    if (x < y){return x;}
    else{return y;}
}

window.onload = function(){
    canvas_width_old = 944;
    canvas_height_old = 527;
    zoom_scale_x = 1;
    zoom_scale_y = 1;
    engine = Engine.create();
    engine.world.gravity.y = 0; 
    speed = 10;
    render = 1000 / 30
    voronoi_on = true;
    delone_on = false;
    canvases.forEach(canvas=> {resizeCanvas(canvas.cnv);})
    recordinate_points();
    animate();
    
    canvas_5.points.push({x:150, y: 200});drew_point(canvas_5.ctx, new Point(150, 200), canvas_5.rad);
    canvas_5.points.push({x: 300,y: 250});drew_point(canvas_5.ctx, new Point(300, 250), canvas_5.rad);
    
}


function resizeCanvas(canvas)
{
    canvas_width_old = canvas.width;
    canvas_height_old = canvas.height;
    xMax = canvas.width  = window.innerWidth * 0.5 + 100;
    yMax = canvas.height = window.innerHeight * 0.75;
    zoom_scale_x = canvas.width / canvas_width_old;
    zoom_scale_y = canvas.height  / canvas_height_old; 
}

window.addEventListener('resize', function(){canvases.forEach(canvas=> {resizeCanvas(canvas.cnv);});recordinate_points();});

function recordinate_points(){
    engine = Engine.create();
    engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [...points_bodies_canvas_1];
    canvas_1.points= [];
    points_bodies_canvas_1 = [];
    for (let i = 0; i < old_points_canvas_1.length; i++){
        old_body_canvas_1({x: old_points_canvas_1[i].position.x * zoom_scale_x,
        y: old_points_canvas_1[i].position.y * zoom_scale_y,}, old_points_canvas_1[i].velocity)
    }
    spawn_walls();

    canvases.slice(1, 4).forEach(canvas=>{
        canvas.points.forEach(point=>{
            point.x = point.x * zoom_scale_x;
            point.y = point.y * zoom_scale_y;
        })
        canvas.ctx.clearRect(0, 0, canvas.cnv.width, canvas.cnv.height);
        drew_points(canvas.ctx, canvas.points, canvas.rad);
    })
}

function new_rad_points(rad){
    engine = Engine.create();
    engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [...points_bodies_canvas_1];
    canvas_1.points= [];
    points_bodies_canvas_1 = [];
    canvas_1.rad = rad;
    for (let i = 0; i < old_points_canvas_1.length; i++){
        old_body_canvas_1({x: old_points_canvas_1[i].position.x,
        y: old_points_canvas_1[i].position.y}, old_points_canvas_1[i].velocity)
    }
    spawn_walls();
}


function spawn_walls(){
    Matter.World.remove(engine.world, walls);
    var ground = Bodies.rectangle(0, canvas_1.cnv.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas_1.cnv.width + 10, 0, 20, 2000, { isStatic: true });
    walls = [ground, wall1, wall2, wall3];
    Composite.add(engine.world, walls);
}

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

function check_cords(cords, points, rad){
    if ((cords.x - rad < 0) || (cords.y - rad < 0)){return false;}
    if ((cords.x + rad > xMax) || (cords.y + rad > yMax)){return false;}
    for (let i = 0; i < points.length; i++){
        if (Math.pow(cords.x - points[i].x, 2) + Math.pow(cords.y - points[i].y, 2) < 4 * rad * rad){
            return false;
        };
    };
    return true;
};

function new_point_canvas_1(event) {
    mouse = getMousePos(canvas_1.cnv, event);
    if (check_cords(mouse, canvas_1.points, canvas_1.rad)){new_body_canvas_1(mouse);}
};

function new_body_canvas_1(mouse){
    let body = create_body_canvas_1(mouse);
    let angel = Math.random() * 2 * Math.PI;
    Matter.Body.setVelocity(body, {x: speed * Math.cos(angel), y: speed * Math.sin(angel),});
    canvas_1.points.push(body.position);
}

function old_body_canvas_1(mouse, velocity){
    let body = create_body_canvas_1(mouse);
    Matter.Body.setVelocity(body, velocity);
    canvas_1.points.push(body.position);
}

function create_body_canvas_1(mouse){
    let body =  Bodies.circle(mouse.x, 
                            mouse.y, 
                            canvas_1.rad, 
                            {
                            inertia: Infinity,
                            frictionStatic: 1,
                            restitution: 1,
                            frictionAir: 0,
                            friction: 0,
                        });
    points_bodies_canvas_1.push(body);
    Composite.add(engine.world, body);
    return body;
}

function new_point_canvas_static(event, canvas) {
    mouse = getMousePos(canvas.cnv, event);
    if (check_cords(mouse, canvas.points, canvas.rad)){
        canvas.points.push({x:mouse.x, y:mouse.y});drew_point(canvas.ctx, mouse, canvas.rad);
    };
};

function clear_points_canvas_1(){
    canvas_1.ctx.clearRect(0, 0, canvas_1.cnv.width, canvas_1.cnv.height);
    engine = Engine.create();
    spawn_walls()
    engine.world.gravity.y = 0; 
    canvas_1.points = [];
    points_bodies_canvas_1 = [];
}

function redrew_points(canvas){canvas.ctx.clearRect(0, 0, canvas.cnv.width, canvas.cnv.height); canvas.drew_points();}

function clear_points(canvas){canvas.ctx.clearRect(0, 0, canvas.cnv.width, canvas.cnv.height);canvas.points = [];}

function animate(){
    canvas_1.ctx.clearRect(0, 0, canvas_1.cnv.width, canvas_1.cnv.height);
    if (voronoi_on){voronoi(canvas_1);};
    if (delone_on){delone(canvas_1);};
    canvas_1.drew_points();
    requestAnimationFrame(animate);
    Engine.update(engine, render);
}

function turn_voronoi(){voronoi_on = !voronoi_on;}
function turn_delone(){delone_on = !delone_on;}
function clear_edges(canvas){canvas.ctx.clearRect(0, 0, canvas.cnv.width, canvas.cnv.height); canvas.drew_points();}

function voronoi(canvas){
    if (canvas.points.length < 2){return;}
    let vor = new VoronoiDiagram(canvas.points, canvas.cnv.width, canvas.cnv.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(canvas.ctx, segments[i]);
        }
    }
}

function delone(canvas){
    tri = new Triangulation(xMax, yMax);
    canvas.points.forEach(point =>{
        tri.add_point(point);
    })
    tri.chop(xMax, yMax);
    tri.triangles.forEach(triangle=> {
        drew_triangle(canvas.ctx, triangle);
    })
    canvas.drew_points();
}

function start_delone_animation(){
    cashe = [...canvas_3.points];
    anim_length = cashe.length + 1;
    tri = new Triangulation_anim(xMax, yMax, canvas_3.rad);
    then = Date.now();
    anime_on = true;
    delone_anim();
}

function delone_anim(){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        anime_on = tri.anim(canvas_3.ctx, cashe, canvas_3.points, xMax, yMax);
        then = now;
    }
    if (anime_on){requestAnimationFrame(delone_anim);}
    else{canvas_3.ctx.clearRect(0, 0, xMax, yMax) ;tri.triangles.forEach(triangle=> {drew_triangle(canvas_3.ctx, triangle, "green");}) ;canvas_3.drew_points();}
}

function start_voronoi(){
    then = Date.now();
    vor_anim = new VoronoiDiagram_anim(canvas_4.points, canvas_4.cnv.width, canvas_4.cnv.height, canvas_4.ctx);
    vor_anim.update_start();
    anime_on = true;
    voronoi_anim();
}

function voronoi_anim(){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        canvas_4.ctx.clearRect(0, 0, xMax, yMax);
        anime_on = vor_anim.update();
        canvas_4.drew_points();
        then = now;
    }
    if (anime_on){requestAnimationFrame(voronoi_anim);}
    else{canvas_4.ctx.clearRect(0, 0, xMax, yMax);canvas_4.drew_points(); 
		vor_anim.edges.forEach(edge=> {if (edge != null){drew_segments(canvas_4.ctx, edge, "green");}})}	
}


function arcs_move(event){
    canvas_5.ctx.clearRect(0, 0, canvas_5.cnv.width, canvas_5.cnv.height);
    mouse = getMousePos(canvas_5.cnv, event);
    let y = mouse.y;
    let k = 10000;
    let point_1 = canvas_5.points[0];
    let ctx = canvas_5.ctx;
    let d = (-point_1.y + y) / 2;
    let point_2 = canvas_5.points[1];
    let d_2 = (-point_2.y + y) / 2;
    let x = parab_intersect(y, point_1, point_2);

    drew_line(ctx, [new Point(0, y), new Point(xMax, y)], "grey");
    
    ctx.beginPath();
    ctx.moveTo(point_1.x - k, y - d - (k**2) / (2 * d));
    ctx.quadraticCurveTo(point_1.x - k / 2, y - d, point_1.x, y - d);
    ctx.quadraticCurveTo(point_1.x / 2 + x / 2, y - d, x, y - d - ((x - point_1.x)**2) / (2 * d));


    ctx.quadraticCurveTo(point_2.x / 2 + x / 2, y - d_2, point_2.x, y - d_2);
    ctx.quadraticCurveTo(point_2.x + k / 2, y - d_2, point_2.x + k, y - d_2 - (k**2) / (2 * d));
    
    ctx.strokeStyle = "red";
    ctx.stroke();
    canvas_5.drew_points();
}


document.getElementById("canvas_1_clear").onclick = function(){clear_points_canvas_1();}
document.getElementById("canvas_1_voronoi").onclick = function(){turn_voronoi();}
document.getElementById("canvas_1_delone").onclick = function(){turn_delone();}

document.getElementById("canvas_1_rad").oninput = function(){new_rad_points(this.valueAsNumber);}

document.getElementById("canvas_2_clear").onclick = function(){clear_points(canvas_2);}
document.getElementById("canvas_2_voronoi").onclick = function(){clear_edges(canvas_2); voronoi(canvas_2)}
document.getElementById("canvas_2_delone").onclick = function(){clear_edges(canvas_2); delone(canvas_2)}

document.getElementById("canvas_2_rad").oninput = function(){canvas_2.rad = this.valueAsNumber; redrew_points(canvas_2);}

document.getElementById("canvas_3_delone").onclick = function(){start_delone_animation();}

document.getElementById("canvas_3_rad").oninput = function(){canvas_3.rad = this.valueAsNumber; redrew_points(canvas_3);}

document.getElementById("canvas_4_voronoi").onclick = function(){start_voronoi();}

document.getElementById("canvas_4_rad").oninput = function(){canvas_4.rad = this.valueAsNumber; redrew_points(canvas_4);}

canvas_5.cnv.addEventListener('mousemove', (event) => {arcs_move(event);});

