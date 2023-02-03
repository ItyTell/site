var canvas_width_old;
var canvas_height_old;
var zoom_scale_x;
var zoom_scale_y;

var point_rad_standart;
var points_rad_max;

var points_rad_canvas_1;
var points_rad_canvas_2;
var points_rad_canvas_3;

var render;
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;


var engine;

var speed;
var voronoi_on;
var delone_on;

var tri;
var cash;
var then;
var now;
var anim_length;

var points_positions_canvas_1 = [];
var points_canvas_2 = [];
var points_canvas_3 = [];
var points_bodies_canvas_1 = [];
var walls = [];

var canvas_1 = document.getElementById("canvas_1");
var canvas_2 = document.getElementById("canvas_2");
var canvas_3 = document.getElementById("canvas_3");
var canvases = [canvas_1, canvas_2, canvas_3];
const ctx_1 = canvas_1.getContext("2d");
const ctx_2 = canvas_2.getContext("2d");
const ctx_3 = canvas_3.getContext("2d");


var anim_cooldown = 3000.0;
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
    point_rad_standart = 10;

    render = 1000.0/30.0; //fps
    engine = Engine.create();
    engine.world.gravity.y = 0; 
    
    
    speed = 10;
    voronoi_on = true;
    delone_on = false;
    canvases.forEach(canvas=> {resizeCanvas(canvas);})
    recordinate_points();
    spawn_walls();
    points_rad_canvas_1 = points_rad_max;
    points_rad_canvas_2 = points_rad_max;
    points_rad_canvas_3 = points_rad_max;

    animate();
}


function resizeCanvas(canvas)
{
    canvas_width_old = canvas.width;
    canvas_height_old = canvas.height;
    xMax = canvas.width  = window.innerWidth * 0.55 + 100;
    yMax = canvas.height = window.innerHeight * 0.75;
    zoom_scale_x = canvas.width / canvas_width_old;
    zoom_scale_y = canvas.height  / canvas_height_old; 
    points_rad_max = zoom_scale_x ** 0.5 * point_rad_standart;
}



window.addEventListener('resize', function(){
    canvases.forEach(canvas=> {resizeCanvas(canvas);})
    recordinate_points();
});

function recordinate_points(){
    engine = Engine.create();
    engine.world.gravity.y = 0; 
    let old_points_canvas_1 = [];
    points_bodies_canvas_1.forEach(body => {old_points_canvas_1.push(body);});
    points_positions_canvas_1 = [];
    points_bodies_canvas_1 = [];
    for (let i = 0; i < old_points_canvas_1.length; i++){
        old_body_canvas1({x: old_points_canvas_1[i].position.x * zoom_scale_x,
        y: old_points_canvas_1[i].position.y * zoom_scale_y,}, old_points_canvas_1[i].velocity)
    }
    spawn_walls();


    for (let i = 0; i < points_canvas_2.length; i++){
        points_canvas_2[i].x = points_canvas_2[i].x * zoom_scale_x;
        points_canvas_2[i].y = points_canvas_2[i].y * zoom_scale_y;
    }
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    drew_points(ctx_2, points_canvas_2, points_rad_canvas_2)

    for (let i = 0; i < points_canvas_3.length; i++){
        points_canvas_3[i].x = points_canvas_3[i].x * zoom_scale_x;
        points_canvas_3[i].y = points_canvas_3[i].y * zoom_scale_y;
    }
    ctx_3.clearRect(0, 0, canvas_3.width, canvas_3.height);
    drew_points(ctx_3, points_canvas_3, points_rad_canvas_3)
}


function spawn_walls(){
    Matter.World.remove(engine.world, walls);
    var ground = Bodies.rectangle(0, canvas_1.height + 10, 5000, 20, { isStatic: true });
    var wall1 = Bodies.rectangle(-10, 0, 20, 2000, { isStatic: true });
    var wall2 = Bodies.rectangle(0, -10, 5000, 20, { isStatic: true });
    var wall3 = Bodies.rectangle(canvas_1.width + 10, 0, 20, 2000, { isStatic: true });
    walls = [ground, wall1, wall2, wall3];
    Composite.add(engine.world, walls);
}


function drew_point(ctx, point, rad, color = "red"){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, rad, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}


function drew_segments(ctx, segm, color ="#0bceaf" ){
    ctx.beginPath();
    ctx.moveTo(segm.start.x, segm.start.y);
    ctx.lineTo(segm.end.x, segm.end.y);
    ctx.strokeStyle = color; 
    ctx.stroke();
}

function drew_triangle(ctx, triangle, color = "#0bceaf"){
    ctx.beginPath();
    ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
    ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
    ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
    ctx.lineTo(triangle.points[0].x, triangle.points[0].y);
    ctx.strokeStyle = color; 
    ctx.stroke();
}

function drew_circle(ctx, circle, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(circle.center.x, circle.center.y, circle.rad, 0, Math.PI * 2)
    ctx.stroke();
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

function new_point_canvas1(event) {
    mouse = getMousePos(canvas_1, event);
    if (check_cords(mouse, points_positions_canvas_1, points_rad_canvas_1)){
        new_body_canvas1(mouse);
    }
};

function new_body_canvas1(mouse){
    let body = create_body_canvas_1(mouse);
    let angel = Math.random() * 2 * Math.PI;
    Matter.Body.setVelocity(body, {x: speed * Math.cos(angel), y: speed * Math.sin(angel),});
    points_positions_canvas_1.push(body.position);
}

function old_body_canvas1(mouse, velocity){
    let body = create_body_canvas_1(mouse);
    Matter.Body.setVelocity(body, velocity);
    points_positions_canvas_1.push(body.position);
}

function create_body_canvas_1(mouse){
    let body =  Bodies.circle(mouse.x, 
                            mouse.y, 
                            points_rad_canvas_1, 
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

function new_point_canvas_static(event, canvas, ctx, points, rad) {
    mouse = getMousePos(canvas, event);
    if (check_cords(mouse, points, rad)){
        points.push({x:mouse.x, y:mouse.y});
        drew_point(ctx, mouse, rad);
    };
};


function drew_points(ctx, points, rad){
    for (let i = 0; i < points.length; i++){
        drew_point(ctx, points[i], rad);
    };
};

function clear_points_canvas1(){
    ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
    engine = Engine.create();
    spawn_walls()
    engine.world.gravity.y = 0; 
    points_positions_canvas_1 = [];
    points_bodies_canvas_1 = [];
}

function clear_points_canvas_2(){
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    points_canvas_2 = [];
}

function voronoi_canvas_1(){
    if (points_positions_canvas_1.length < 2){return;}
    let vor = new VoronoiDiagram(points_positions_canvas_1, canvas_1.width, canvas_1.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx_1, segments[i]);
        }
    }
}
function delone_canvas_1(){
    tri = new Triangulation(xMax, yMax);
    points_positions_canvas_1.forEach(point =>{
        tri.add_point(point);
    })
    tri.chop(xMax, yMax);
    tri.triangles.forEach(triangle=> {
        drew_triangle(ctx_1, triangle);
    })
}


function animate(){
    ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
    if (voronoi_on){
        voronoi_canvas_1();
    };
    if (delone_on){
        delone_canvas_1();
    };
    drew_points(ctx_1, points_positions_canvas_1, points_rad_canvas_1);
    requestAnimationFrame(animate);
    Engine.update(engine, render);
}


function turn_voronoi(){
    voronoi_on = !voronoi_on;
}

function turn_delone(){
    delone_on = !delone_on;
}


function voronoi(){
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    drew_points(ctx_2, points_canvas_2, points_rad_canvas_2);
    if (points_canvas_2.length < 2){return;}
    let vor = new VoronoiDiagram(points_canvas_2, canvas_2.width, canvas_2.height); 
    vor.update();
    let segments = vor.edges;
    for (let i = 0; i < segments.length; i++){
        if (segments[i] != null){
            drew_segments(ctx_2, segments[i]);
        }
    }
}

function delone(){
    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    drew_points(ctx_2, points_canvas_2, points_rad_canvas_2);
    tri = new Triangulation(xMax, yMax);
    points_canvas_2.forEach(point =>{
        tri.add_point(point);
    })
    tri.chop(xMax, yMax);
    tri.triangles.forEach(triangle=> {
        drew_triangle(ctx_2, triangle);
    })
    drew_points(ctx_2, points_canvas_2, points_rad_canvas_2);
}

function start_delone_animation(){
    cashe = [...points_canvas_3];
    anim_length = cashe.length + 1;
    tri = new Triangulation_anim(xMax, yMax, points_rad_canvas_3);
    then = Date.now();
    anime_on = true;
    delone_anim();
}

function delone_anim(){
    now = Date.now();
    let elapsed = now - then;
    if (elapsed > anim_cooldown){
        anime_on = tri.anim(ctx_3, cashe, points_canvas_3, xMax, yMax);
        then = now;
    }
    if (anime_on){requestAnimationFrame(delone_anim);}
    else{ctx_3.clearRect(0, 0, xMax, yMax) ;tri.triangles.forEach(triangle=> {drew_triangle(ctx_3, triangle, "green");}) ;drew_points(ctx_3, points_canvas_3, points_rad_canvas_3);}
}

