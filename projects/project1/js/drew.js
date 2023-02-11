

function drew_point(ctx, point, rad, color = "red"){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, rad, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}


function drew_points(ctx, points, rad){
    for (let i = 0; i < points.length; i++){
        drew_point(ctx, points[i], rad);
    };
};

function drew_line(ctx, segm, color ="#0bceaf" ){
    ctx.beginPath();
    ctx.moveTo(segm[0].x, segm[0].y);
    ctx.lineTo(segm[1].x, segm[1].y);
    ctx.strokeStyle = color; 
    ctx.stroke();
}


function drew_segments(ctx, segm, color ="#0bceaf" ){
    ctx.beginPath();
    ctx.moveTo(segm.start.x, segm.start.y);
    ctx.lineTo(segm.end.x, segm.end.y);
    ctx.strokeStyle = color; 
    ctx.stroke();
}


function drew_arc(ctx, y, arc, color = "red"){
    let k = 10000;    
    let d = (y - arc.focus.y) / 2;    
    let x1; let x2; let y1; let y2;
    let x3; let x4; let y3; let y4;

    if (arc.left == null){x1 = k;}
    else {x1 = arc.focus.x - parab_intersect(y, arc.left.focus, arc.focus);
        drew_line(ctx, [arc.edge.left.start, new Point(arc.focus.x - x1, y - d - (x1 * x1) / (4 * d))], "black");}
    
    ctx.beginPath();
    y1 = (x1 * x1) / (4 * d);
    ctx.moveTo(arc.focus.x - x1, y - d - y1);
    ctx.quadraticCurveTo(arc.focus.x - x1 / 2, y - d, arc.focus.x, y - d);
    
    if (arc.right == null){ctx.quadraticCurveTo(arc.focus.x + k / 2, y - d, arc.focus.x + k, y - d - (k**2) / (4 * d));}
    else {let x = parab_intersect(y, arc.focus, arc.right.focus);
        ctx.quadraticCurveTo(arc.focus.x / 2 + x / 2, y - d, x, y - d - ((x - arc.focus.x) ** 2) / (4 * d));}
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
