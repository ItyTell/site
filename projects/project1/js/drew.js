

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

function drew_left_arc(ctx, y, arc, q_prev){
    if (arc.event == false){return;}
    let d = (-arc.focus.y + y) / 2;
    if (q_prev == null){ctx.moveTo(arc.focus.x - 10000, arc.focus.y + d - 100000000); ctx.quadraticCurveTo(arc.focus.x - 5000, arc.focus.y + d, arc.focus.x, arc.focus.y + d); ctx.strokeStyle = 'red'; ctx.stroke(); return;}
    let x_col = parab_intersect(y, arc, q_prev);
    ctx.moveTo(x_col, arc.focus.y + d - ((-x_col + arc.focus.x)/(2 * d))**2);
    ctx.quadraticCurveTo(arc.focus.x / 2 + x_col / 2, arc.focus.y + d, arc.focus.x, arc.focus.y + d);
    ctx.strokeStyle = "red";
    ctx.stroke();
}


function drew_arc(ctx, y, arc, q_prev, color = "red"){
    if (arc.event == false){return;}
    let d_prev = (-q_prev.focus.y + y) / 2;
    let d = (-arc.focus.y + y) / 2;
    let x_col = parab_intersect(y, arc, q_prev);
    ctx.moveTo(q_prev.focus.x, q_prev.focus.y + d_prev)
    ctx.quadraticCurveTo(x_col / 2 + q_prev.focus.x / 2, q_prev.focus.y + d_prev, x_col, q_prev.focus.y + d_prev - ((x_col - q_prev.focus.x)/(2 * d_prev)) ** 2);
    ctx.quadraticCurveTo(arc.focus.x / 2 + x_col / 2, arc.focus.y + d, arc.focus.x, arc.focus.y + d_prev);
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
