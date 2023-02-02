
function culc_x(a, b, c){
    return (a.x ** 2 + a.y ** 2) * (b.y - c.y);
}

function culc_y(a, b, c){
    return (a.x ** 2 + a.y ** 2) * (c.x - b.x);
}

class Triangle{
    constructor(a, b, c){
        this.points = [a, b, c];
        let d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
        let x = (culc_x(a, b, c) + culc_x(b, c, a) + culc_x(c, a, b)) / d;
        let y = (culc_y(a, b, c) + culc_y(b, c, a) + culc_y(c, a, b)) / d;
        let rad = Math.sqrt((x - a.x) ** 2 + (y - a.y) ** 2);
        this.circle = new Circle(new Point(x, y), rad);
        this.edges = [[a, b], [b, c], [c, a]];
    }
}

class Circle{
    constructor(center, rad){
        this.center = center;
        this.rad = rad;
    }

    is_inside(point){return (this.center.distance(point) < this.rad);}
}


class Triangulation{
    constructor (xMax, yMax){
        this.triangles = [];
        this.triangles.push(new Triangle(new Point(-xMax / 2, 0), new Point(3 * xMax / 2, 0), new Point(xMax / 2, 2 * yMax)));
    }

    add_point(point){
        var bed_triangles = [];
        this.triangles.forEach(triangle=> {
            if (triangle.circle.is_inside(point)){bed_triangles.push(triangle);}
        });
        let poligon = [];
        bed_triangles.forEach(triangle1=> {       
            triangle1.edges.forEach(edge1=> {
                let is_shared = false; 
                bed_triangles.forEach(triangle2=> {
                    if (triangle1 != triangle2){
                        triangle2.edges.forEach(edge2=> {
                            if ((edge1[0] == edge2[0] && edge1[1] == edge2[1]) || (edge1[0] == edge2[1] && edge1[1] == edge2[0])){is_shared = true;}
                    })}
                })
                if (!is_shared){poligon.push(edge1);}
            })
        })
        let cash = [];
        this.triangles.forEach(triangle => {
                            let flag = true;
                            bed_triangles.forEach(triangle2 => {
                                if (triangle === triangle2){flag = false;}
                            });
                            if (flag){cash.push(triangle);}

        })
        this.triangles = cash;
        poligon.forEach(edge => {
            this.triangles.push(new Triangle(edge[0], point, edge[1]));
        })
    }

    chop(xMax, yMax){
        let cash = [];
        let flag;
        this.triangles.forEach(triangle=> {
            flag = true;
            triangle.points.forEach(point=> {
                if (point.x < 0 || point.x > xMax || point.y > yMax){flag = false;}
            })
            if (flag){cash.push(triangle);}
        })
        this.triangles = cash;
    }

}