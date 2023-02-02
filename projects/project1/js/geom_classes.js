
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(point){
		return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
	}
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