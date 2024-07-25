class Canvas {
    constructor(id){
        this.cnv = document.getElementById(id);
        this.ctx  = this.cnv.getContext("2d");
        if (id > 1) {this.rad = document.getElementById(id + "_rad").valueAsNumber;}
        else {this.rad = 10;}
        this.points = [];
        this.zoom_scale_x = 1; this.zoom_scale_y = 1; 
        this.now = 0; this.then = 0;
    }

    clear(){this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);}

    drew_points(){
        this.points.forEach(point=>{drew_point(this.ctx, point, this.rad);})
    }

    in_canvas(cords){
        let flag = true;
        if ((cords.x - this.rad < 0) || (cords.y - this.rad < 0)){return false;}
        if ((cords.x + this.rad > this.cnv.width) || (cords.y + this.rad > this.cnv.height)){return false;}
        this.points.forEach(point=> {if (point.distance(cords) < 2 * this.rad){flag = false}})
        return flag;
};
}


var canvas_width_old, canvas_height_old;
var zoom_scale_x, zoom_scale_y;

var Engine = Matter.Engine, 
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    render, engine;


var vor_anim;
var tri, cash;
var anim_length;

var canvas_1 = new Canvas("canvas_1"),
    canvas_2 = new Canvas("canvas_2"),
    canvas_3 = new Canvas("canvas_3"), 
    canvas_4 = new Canvas("canvas_4");
var canvases = [canvas_1, canvas_2, canvas_3, canvas_4];
var anime_on = false, anim_cooldown;

function min(x, y){if (x < y){return x;}else{return y;}}


var speed, voronoi_on, delone_on;
walls = [];


window.onload = function()
{
    canvas_width_old = 944;
    canvas_height_old = 527;
    anim_cooldown = document.getElementById("canvas_3_anim_speed").valueAsNumber;
    voronoi_on = true; delone_on = false;
    canvases.forEach(canvas=> {resizeCanvas(canvas);})
    //recordinate_points();

    engine = Engine.create(); engine.world.gravity.y = 0; 
    spawn_walls();
    canvas_1.speed = document.getElementById("canvas_1_speed").valueAsNumber; render = 1;
    animate();

    canvas_4.points.push(new Point(100000, 10000));
    canvas_4.points.push(new Point(100200, 10000));
    canvas_4.points.push(new Point(100400, 10400));
}


function resizeCanvas(canvas)
{
    canvas_width_old = canvas.cnv.width; canvas_height_old = canvas.cnv.height;
    canvas.cnv.width  = window.innerWidth * 0.45 + 150; canvas.cnv.height = window.innerHeight * 0.75;
    this.zoom_scale_x = canvas.width / canvas_width_old; this.zoom_scale_y = canvas.height  / canvas_height_old; 
}
window.addEventListener('resize', function(){canvases.forEach(canvas=> {resizeCanvas(canvas);});recordinate_points();});

// canvas_1

function new_point_canvas_1(event) {mouse = getMousePos(canvas_1.cnv, event); canvas_1.points.push(new_body(mouse));}

function spawn_walls(){
    var ground = Bodies.rectangle(0, canvas_1.cnv.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas_1.cnv.width + 10, 0, 20, 2000, { isStatic: true });
    walls = [ground, wall1, wall2, wall3];
    Composite.add(engine.world, walls);
}

function new_body(mouse){
    let body =  _new_body(mouse);
    let angel = Math.random() * 2 * Math.PI;
    Matter.Body.setVelocity(body, {x: canvas_1.speed * Math.cos(angel), y: canvas_1.speed * Math.sin(angel),});
    Composite.add(engine.world, body);
    return body;
}

function _new_body(mouse){
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
    return body;
}

function change_vel(cords, old_vel, new_vel, x_vel, y_vel){
    let body =  _new_body(cords);
    Matter.Body.setVelocity(body, {x: x_vel * new_vel / old_vel / 5, y: y_vel * new_vel / old_vel / 5});
    Composite.add(engine.world, body);
    return body;
}

function animate(){
    canvas_1.now = Date.now();
    if (canvas_1.now - canvas_1.then > render){
        canvas_1.then = canvas_1.now;
        canvas_1.clear();
        if (voronoi_on){voronoi_bodies(canvas_1);}; if (delone_on){delone_bodies(canvas_1);};
        canvas_1.points.forEach(body=>{drew_point(canvas_1.ctx, new Point(body.position.x, body.position.y), canvas_1.rad); })
        Engine.update(engine, render); 
    }
    requestAnimationFrame(animate);
}

function old_body(mouse, velocity){
    let body = new_body(mouse);
    Matter.Body.setVelocity(body, velocity);
    canvas_1.points.push(body);
}

function recordinate_points()
{
    engine = Engine.create(); engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [...canvas_1.points];
    canvas_1.points= [];
    old_points_canvas_1.forEach(point=>{
        old_body({x: point.position.x * canvas_1.zoom_scale_x,
                           y: point.position.y * canvas_1.zoom_scale_y,}, 
                           point.velocity)
    })
    spawn_walls();

    canvases.slice(1, 4).forEach(canvas=>{
        canvas.points.forEach(point=>{
            point.x = point.x * canvas.zoom_scale_x;
            point.y = point.y * canvas.zoom_scale_y;
        })
        canvas.clear();
        canvas.drew_points();
    })
}

function new_vel_points(vel){
    return;
    velocity = [];
    canvas_1.points.forEach(point=>{velocity.push({x: point.velocity.x, y: point.velocity.y, pos: point.position})})
    engine = Engine.create(); engine.world.gravity.y = 0;
    canvas_1.points= [];
    let old_speed = canvas_1.speed;
    canvas_1.speed = vel;
    velocity.forEach(point=>{
        let body = change_vel(point.pos, old_speed, vel, point.x, point.y);
        canvas_1.points.push(body.position);
    })
    spawn_walls();
}




// canvas_2-4

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {x: event.clientX - rect.left, y: event.clientY - rect.top};
};


function new_point_canvas_static(event, canvas) {mouse = getMousePos(canvas.cnv, event); new_point(mouse, canvas);};
function new_point(mouse, canvas){if (canvas.in_canvas(mouse)){canvas.points.push(new Point(mouse.x, mouse.y)); drew_point(canvas.ctx, mouse, canvas.rad);};}

function clear_points_canvas_1(){
    engine = Engine.create(); engine.world.gravity.y = 0; spawn_walls();
    canvas_1.clear(); canvas_1.points = []; canvas_1.points= [];
}

function redrew_points(canvas){canvas.clear(); canvas.drew_points();}

function clear_points(canvas){canvas.clear();canvas.points = [];}

function voronoi_bodies(canvas){
    if (canvas.points.length < 2){return;}
    points = []
    for (let i = 0; i < canvas.points.length; i++){points.push(canvas.points[i].position)};
    let vor = new VoronoiDiagram(points, canvas.cnv.width, canvas.cnv.height); 
    vor.update(); let segments = vor.edges;
    segments.forEach(segm=>{if (segm != null){drew_segments(canvas.ctx, segm);}}) 
}

function delone_bodies(canvas){
    tri = new Triangulation(canvas.cnv.width, canvas.cnv.height); canvas.points.forEach(point =>{tri.add_point(point.position);})
    tri.chop(canvas.cnv.width, canvas.cnv.height);
    tri.triangles.forEach(triangle=> {drew_triangle(canvas.ctx, triangle, "red");})
}

function voronoi(canvas){
    if (canvas.points.length < 2){return;}
    let vor = new VoronoiDiagram(canvas.points, canvas.cnv.width, canvas.cnv.height); 
    vor.update(); let segments = vor.edges;
    segments.forEach(segm=>{if (segm != null){drew_segments(canvas.ctx, segm);}}) 
}

function delone(canvas){
    tri = new Triangulation(canvas.cnv.width, canvas.cnv.height); canvas.points.forEach(point =>{tri.add_point(point);})
    tri.chop(canvas.cnv.width, canvas.cnv.height);
    tri.triangles.forEach(triangle=> {drew_triangle(canvas.ctx, triangle, "red");})
}

function start_voronoi(canvas=canvas_3){
    then = Date.now();
    vor_anim = new VoronoiDiagram_anim(canvas_3.points, canvas_3.cnv.width, canvas_3.cnv.height, canvas_3.ctx);
    vor_anim.update_start();
    anime_on = true; voronoi_anim();
}


function voronoi_anim(canvas=canvas_3){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        canvas_3.clear();
        anime_on = vor_anim.update();
        canvas_3.drew_points();
        then = now;
    }
    if (anime_on){requestAnimationFrame(voronoi_anim);}
    else{canvas_3.clear();canvas_3.drew_points(); 
		vor_anim.edges.forEach(edge=> {if (edge != null){drew_segments(canvas_3.ctx, edge, "green");}})}	
}

function arcs_move(event, canvas=canvas_4){
    canvas.clear();
    mouse = getMousePos(canvas.cnv, event);
    let vor_dem = new VoronoiDiagram_demo(canvas.points, canvas.cnv.width, canvas.cnv.height, canvas.ctx);
    let y = mouse.y;
    vor_dem.update_start();
    vor_dem.update(y);
    canvas.clear();
    vor_dem.end(y);
    canvas.drew_points();
}


function turn_voronoi(){voronoi_on = !voronoi_on;}
function turn_delone(){delone_on = !delone_on;}
function clear_edges(canvas){canvas.clear(); canvas.drew_points();}



function rand_points(canvas){for (let i = 0; i < 10; i++){new_point({x: Math.random() * canvas.cnv.width, y: Math.random() * canvas.cnv.height}, canvas)}}

document.getElementById("canvas_1_clear").onclick = function(){clear_points_canvas_1();}
document.getElementById("canvas_1_rand").onclick = function(){for (let i = 0; i < 10; i++){canvas_1.points.push(new_body({x: Math.random() * canvas_1.cnv.width, y: Math.random() * canvas_1.cnv.height}))}}
document.getElementById("canvas_1_voronoi").onclick = function(){turn_voronoi();}
document.getElementById("canvas_1_delone").onclick = function(){turn_delone();}
document.getElementById("canvas_1").onclick = function(){new_point_canvas_1(event)}

document.getElementById("canvas_1_speed").oninput = function(){new_vel_points(this.valueAsNumber);}

document.getElementById("canvas_2_clear").onclick = function(){clear_points(canvas_2);}
document.getElementById("canvas_2_rand").onclick = function(){rand_points(canvas_2)}
document.getElementById("canvas_2_voronoi").onclick = function(){clear_edges(canvas_2); voronoi(canvas_2)}
document.getElementById("canvas_2_delone").onclick = function(){clear_edges(canvas_2); delone(canvas_2)}
document.getElementById("canvas_2").onclick = function(){new_point_canvas_static(event, canvas_2);}

document.getElementById("canvas_2_rad").oninput = function(){canvas_2.rad = this.valueAsNumber; redrew_points(canvas_2);}

document.getElementById("canvas_3_clear").onclick = function(){clear_points(canvas_3);}
document.getElementById("canvas_3_rand").onclick = function(){rand_points(canvas_3)}
document.getElementById("canvas_3_voronoi").onclick = function(){start_voronoi();}
document.getElementById("canvas_3").onclick = function(){new_point_canvas_static(event, canvas_3);}

document.getElementById("canvas_3_rad").oninput = function(){canvas_3.rad = this.valueAsNumber; redrew_points(canvas_4);}
document.getElementById("canvas_3_anim_speed").oninput = function(){anim_cooldown = (20 - this.valueAsNumber) / 100; vor_anim.speed = 1 / 4 + (this.valueAsNumber - 1) / 5;}

canvas_4.cnv.addEventListener('mousemove', (event) => {arcs_move(event);});
document.getElementById("canvas_4").onclick = function(){new_point_canvas_static(event, canvas_4)}
document.getElementById("canvas_4_rad").oninput = function(){canvas_4.rad = this.valueAsNumber; redrew_points(canvas_4);}