

class Triangulation_anim{
    constructor (xMax, yMax, rad){
        this.triangles = [];
        this.triangles.push(new Triangle(new Point(20, 20), new Point(xMax - 20, 20), new Point(xMax / 2, yMax - 20)));
        this.etap = 0;
        this.bed_triangles = [];
        this.step = 0;
        this.point;
        this.rad = rad;
    }

    add_point(points){
        this.point = points.pop();
        this.bed_triangles = [];
        this.triangles.forEach(triangle=> {if (triangle.circle.is_inside(this.point)){this.bed_triangles.push(triangle);}; });
        this.poligon = [];
        this.bed_triangles.forEach(triangle1=> {       
            triangle1.edges.forEach(edge1=> {
                let is_shared = false; 
                this.bed_triangles.forEach(triangle2=> {
                    if (triangle1 != triangle2){
                        triangle2.edges.forEach(edge2=> {
                            if ((edge1[0] == edge2[0] && edge1[1] == edge2[1]) || (edge1[0] == edge2[1] && edge1[1] == edge2[0])){is_shared = true;}
                    })}
                })
                if (!is_shared){this.poligon.push(edge1);}
            })
        })
        let cash = [];
        this.triangles.forEach(triangle => {
                            let flag = true;
                            this.bed_triangles.forEach(triangle2 => {
                                if (triangle === triangle2){flag = false;}
                            });
                            if (flag){cash.push(triangle);}})
        this.triangles = cash;
    }

    anim(ctx, points, all_points, xMax, yMax){
        ctx.clearRect(0, 0, xMax, yMax)
        this.triangles.forEach(triangle=> {drew_triangle(ctx, triangle);})
        this.bed_triangles.forEach(triangle=> {drew_triangle(ctx, triangle);})
        if (this.etap == 0){
            if (points.length < 1){
                this.etap = 3;
                drew_points(ctx, all_points, this.rad);
                drew_point(ctx, this.point, this.rad, "green");
                return true;
            }
            this.add_point(points);
            this.etap = 1;
            drew_points(ctx, all_points, this.rad);
            drew_point(ctx, this.point, this.rad, "green");
            return true;
        }
        if (this.etap == 1){
            let index = this.triangles.length - this.step; 
            if (index > 0){drew_circle(ctx, this.triangles[this.step].circle);}
            else {if (this.bed_triangles.length + index > 0){drew_triangle(ctx, this.bed_triangles[-index], "red");drew_circle(ctx, this.bed_triangles[-index].circle);} else {this.etap = 2;}}
            this.step += 1;
            console.log("step =", this.step);
            drew_points(ctx, all_points, this.rad);
            drew_point(ctx, this.point, this.rad, "green");
            return true;
        }
        if (this.etap == 2){
            this.step = 0;
            this.poligon.forEach(edge => {
                this.triangles.push(new Triangle(edge[0], this.point, edge[1]));
            })
            this.etap = 0;
            drew_points(ctx, all_points, this.rad);
            drew_point(ctx, this.point, this.rad, "green");
        }
        if (this.etap == 3){
            this.chop(xMax, yMax, ctx);
            drew_points(ctx, all_points, this.rad);
            drew_point(ctx, this.point, this.rad, "green");
            return false;
        }
        console.log(this.etap);
        return true;
    }


    chop(xMax, yMax, ctx){
        let cash = [];
        let flag;
        this.triangles.forEach(triangle=> {
            flag = true;
            triangle.points.forEach(point=> {
                if (point.x == 20 || point.x == xMax - 20 || point.y == yMax - 20){flag = false;}
            })
            if (flag){cash.push(triangle);}
            else {drew_triangle(ctx, triangle, "red");}
        })
        this.triangles = cash;
    }

}