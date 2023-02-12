
class Canvas {
    constructor(id){
        this.cnv = document.getElementById(id);
        this.ctx  = this.cnv.getContext("2d");
        this.rad = document.getElementById(id + "_rad").valueAsNumber;
        this.points = [];
        this.zoom_scale_x = 1; this.zoom_scale_y = 1; 
        this.now = 0; this.then = 0;
    }

    clear(){this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);}

    drew_points(){this.points.forEach(point=>{drew_point(this.ctx, point, this.rad);})}

    check_cords(cords){
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

var speed, voronoi_on, delone_on;
var points_bodies_canvas_1 = [];
var walls = [];

var vor_anim;
var tri, cash;
var anim_length;

var canvas_1 = new Canvas("canvas_1"),
    canvas_2 = new Canvas("canvas_2"),
    canvas_3 = new Canvas("canvas_3"),
    canvas_4 = new Canvas("canvas_4"), 
    canvas_5 = new Canvas("canvas_5");
var canvases = [canvas_1, canvas_2, canvas_3, canvas_4, canvas_5];
var anim_cooldown = 10.0, anime_on = false;

function min(x, y){if (x < y){return x;}else{return y;}}

window.onload = function()
{
    canvas_width_old = 944;
    canvas_height_old = 527;
    engine = Engine.create(); engine.world.gravity.y = 0; 
    speed = 10; render = 1;
    voronoi_on = true; delone_on = false;
    canvases.forEach(canvas=> {resizeCanvas(canvas);})
    recordinate_points();
    animate();
    
    canvas_5.points.push({x:150, y: 200});drew_point(canvas_5.ctx, new Point(150, 200), canvas_5.rad);
    canvas_5.points.push({x: 300,y: 250});drew_point(canvas_5.ctx, new Point(300, 250), canvas_5.rad);
}


function resizeCanvas(canvas)
{
    canvas_width_old = canvas.cnv.width; canvas_height_old = canvas.cnv.height;
    canvas.cnv.width  = window.innerWidth * 0.45 + 150; canvas.cnv.height = window.innerHeight * 0.75;
    this.zoom_scale_x = canvas.width / canvas_width_old; this.zoom_scale_y = canvas.height  / canvas_height_old; 
}

window.addEventListener('resize', function(){canvases.forEach(canvas=> {resizeCanvas(canvas.cnv);});recordinate_points();});

function recordinate_points()
{
    engine = Engine.create(); engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [...points_bodies_canvas_1];
    canvas_1.points= []; points_bodies_canvas_1 = [];
    old_points_canvas_1.forEach(point=>{
        old_body_canvas_1({x: point.position.x * canvas_1.zoom_scale_x,
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

function new_rad_points(rad){
    engine = Engine.create(); engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [...points_bodies_canvas_1];
    canvas_1.points= []; points_bodies_canvas_1 = [];
    canvas_1.rad = rad;
    old_points_canvas_1.forEach(point=>{
        old_body_canvas_1({x: point.position.x,
                           y: point.position.y}, 
                           point.velocity)
    })
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
  return {x: event.clientX - rect.left, y: event.clientY - rect.top};
};

function new_point_canvas_1(event) {mouse = getMousePos(canvas_1.cnv, event); new_body_canvas_1(mouse);};

function new_body_canvas_1(mouse){
    let body = create_body_canvas_1(mouse);
    let angel = Math.random() * 2 * Math.PI;
    Matter.Body.setVelocity(body, {x: speed * Math.cos(angel), y: speed * Math.sin(angel),});
    canvas_1.points.push(body.position);
    canvas_1.drew_points();
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
    if (canvas.check_cords(mouse)){canvas.points.push(new Point(mouse.x, mouse.y)); drew_point(canvas.ctx, mouse, canvas.rad);};
};

function clear_points_canvas_1(){
    engine = Engine.create(); engine.world.gravity.y = 0; spawn_walls();
    canvas_1.clear(); canvas_1.points = []; points_bodies_canvas_1 = [];
}

function redrew_points(canvas){canvas.clear(); canvas.drew_points();}

function clear_points(canvas){canvas.clear();canvas.points = [];}

function animate(){
    canvas_1.now = Date.now();
    if (canvas_1.now - canvas_1.then > render){
        canvas_1.then = canvas_1.now;
        canvas_1.clear();
        if (voronoi_on){voronoi(canvas_1);}; if (delone_on){delone(canvas_1);};
        canvas_1.drew_points();
        Engine.update(engine, render); 
    }
    requestAnimationFrame(animate);
}

function turn_voronoi(){voronoi_on = !voronoi_on;}
function turn_delone(){delone_on = !delone_on;}
function clear_edges(canvas){canvas.clear(); canvas.drew_points();}

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

function start_delone_animation(){
    cashe = [...canvas_3.points]; anim_length = cashe.length + 1;
    tri = new Triangulation_anim(canvas_3.cnv.width, canvas_3.cnv.height, canvas_3.rad);
    then = Date.now(); anime_on = true;
    delone_anim();
}

function delone_anim(){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        anime_on = tri.anim(canvas_3.ctx, cashe, canvas_3.points, canvas_3.cnv.width, canvas_3.cnv.height);
        then = now;
    }
    if (anime_on){requestAnimationFrame(delone_anim);}
    else{canvas_3.clear(); tri.triangles.forEach(triangle=> {drew_triangle(canvas_3.ctx, triangle, "green");}); canvas_3.drew_points();}
}

function start_voronoi(){
    then = Date.now();
    vor_anim = new VoronoiDiagram_anim(canvas_4.points, canvas_4.cnv.width, canvas_4.cnv.height, canvas_4.ctx);
    vor_anim.update_start();
    anime_on = true; voronoi_anim();
}

function voronoi_anim(){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        canvas_4.clear();
        anime_on = vor_anim.update();
        canvas_4.drew_points();
        then = now;
    }
    if (anime_on){requestAnimationFrame(voronoi_anim);}
    else{canvas_4.clear();canvas_4.drew_points(); 
		vor_anim.edges.forEach(edge=> {if (edge != null){drew_segments(canvas_4.ctx, edge, "green");}})}	
}


function arcs_move(event){
    canvas_5.clear();
    mouse = getMousePos(canvas_5.cnv, event);
    let y = mouse.y;
    let k = 10000;
    let point_1 = canvas_5.points[0];
    let ctx = canvas_5.ctx;
    let d = (-point_1.y + y) / 2;
    let point_2 = canvas_5.points[1];
    let d_2 = (-point_2.y + y) / 2;
    let x = parab_intersect(y, point_1, point_2);

    drew_line(ctx, [new Point(0, y), new Point(canvas_5.cnv.width, y)], "grey");
    
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

