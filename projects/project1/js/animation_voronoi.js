
class VoronoiDiagram_anim {

	constructor(points, width, height, ctx) {
		this.point_list = points;
		this.reset();
		this.box_x = width;
		this.box_y = height;
        this.ctx = ctx;
	}

	reset() {
		this.event_list = new SortedQueue();
		this.beachline_root = null;
		this.voronoi_vertex = [];
		this.edges = [];
	}

	update_start() {
		this.reset();
		let points = [];
		for (const p of this.point_list) points.push(new Event("point", p));
		this.event_list.points = points;
        return true;
	}

    update(){
		var e = null;
		if (this.event_list.length > 0) {
			e = this.event_list.extract_first();
			if (e.type == "point") this.point_event(e.position);
			else if (e.active) this.circle_event(e);
		}
        else if (e!= null){this.complete_segments(e.position); return false;}
        return true;
    }

	point_event(p) {
		drew_line(this.ctx, [new Point(0, p.y), new Point(this.box_x, p.y)], "grey");
		let q = this.beachline_root;
		let q_prev = null;
		if (q == null) {this.beachline_root = new Arc(null, null, p, null, null);}
		else {
			while (
				q.right != null &&
				this.parabola_intersection(p.y, q.focus, q.right.focus) <= p.x
			) {
				drew_left_arc(this.ctx, p.y, q, q_prev);
				q_prev = q;
				q = q.right;
				drew_arc(this.ctx, p.y, q, q_prev);
			}
			this.edges.forEach(edge=> {if (edge.start != null && edge.end != null){drew_segments(this.ctx, edge, "green");}})	

			// if(q === this.beachline_root && q.focus.y == p.y) xx = (q.focus.x + p.x)/2 // edge case when the two top sites have same y
			let e_qp = new Edge(q.focus, p, p.x);
			let e_pq = new Edge(p, q.focus, p.x);

			let arc_p = new Arc(q, null, p, e_qp, e_pq);
			let arc_qr = new Arc(arc_p, q.right, q.focus, e_pq, q.edge.right);
			if (q.right) q.right.left = arc_qr;
			arc_p.right = arc_qr;
			q.right = arc_p;
			q.edge.right = e_qp;

			// Disable old event
			if (q.event) q.event.active = false;

			// Check edges intersection
			this.add_circle_event(p, q);
			this.add_circle_event(p, arc_qr);

			this.edges.push(e_qp);
			this.edges.push(e_pq);
		}
	}

	/**
	 * Handles the circle event
	 * @param {Event} e - Event type object
	 */
	circle_event(e) {
		let arc = e.caller;
		let p = e.position;
		let edge_new = new Edge(arc.left.focus, arc.right.focus);

		// Disable events
		if (arc.left.event) arc.left.event.active = false;
		if (arc.right.event) arc.right.event.active = false;

		// Adjust beachline deleting the shrinking arc
		arc.left.edge.right = edge_new;
		arc.right.edge.left = edge_new;
		arc.left.right = arc.right;
		arc.right.left = arc.left;

		this.edges.push(edge_new);

		if (!this.point_outside(e.vertex)) this.voronoi_vertex.push(e.vertex); // Only add the vertex if inside canvas
		arc.edge.left.end = arc.edge.right.end = edge_new.start = e.vertex; // This needs to come before add_circle_event as it is used there

		this.add_circle_event(p, arc.left);
		this.add_circle_event(p, arc.right);
	}

	/**
	 * Tests if the arc event is valid and adds it into the queue
	 * @param {Point} p - Current position of the sweepline
	 * @param {Arc} arc - The Arc tested
	 */
	add_circle_event(p, arc) {
		if (arc.left && arc.right) {
			let a = arc.left.focus;
			let b = arc.focus;
			let c = arc.right.focus;

			//Compute sine of angle between focuses. if positive then edges intersect
			if ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y) > 0) {
				let new_inters = this.edge_intersection(
					arc.edge.left,
					arc.edge.right
				);
				let circle_radius = Math.sqrt(
					(new_inters.x - arc.focus.x) ** 2 +
						(new_inters.y - arc.focus.y) ** 2
				);
				let event_pos = circle_radius + new_inters.y;
				if (event_pos > p.y && new_inters.y < this.box_y) {
					// This is important new_inters.y < this.box_y
					let e = new Event(
						"circle",
						new Point(new_inters.x, event_pos),
						arc,
						new_inters
					);
					arc.event = e;
					this.event_list.insert(e);
				}
			}
		}
	}

	parabola_intersection(y, f1, f2) {
		let fyDiff = f1.y - f2.y;
		if (fyDiff == 0) return (f1.x + f2.x) / 2;
		let fxDiff = f1.x - f2.x;
		let b1md = f1.y - y; //Difference btw parabola 1 fy and directrix
		let b2md = f2.y - y; //Difference btw parabola 2 fy and directrix
		let h1 = (-f1.x * b2md + f2.x * b1md) / fyDiff;
		let h2 = Math.sqrt(b1md * b2md * (fxDiff ** 2 + fyDiff ** 2)) / fyDiff;

		return h1 + h2; //Returning the left x coord of intersection. Remember top of canvas is 0 hence parabolas are facing down
	}

	/**
	 * Computes the intersection point of two edges
	 * @param {Edge} e1 - First edge
	 * @param {Edge} e2 - Second edge
	 * @returns {Point} Intersection point
	 */
	edge_intersection(e1, e2) {
		if (e1.m == Infinity) return new Point(e1.start.x, e2.getY(e1.start.x));
		else if (e2.m == Infinity)
			return new Point(e2.start.x, e1.getY(e2.start.x));
		else {
			let mdif = e1.m - e2.m;
			if (mdif == 0) return null;
			let x = (e2.q - e1.q) / mdif;
			let y = e1.getY(x);
			return new Point(x, y);
		}
	}

	/**
	 * Completes the Voronoi edges taking into account the canvas sizes
	 * @param {Point} last - last point extracted from the queue
	 */
	complete_segments(last) {
		let r = this.beachline_root;
		let e, x, y;
		// Complete edges attached to beachline
		while (r.right) {
			e = r.edge.right;
			x = this.parabola_intersection(
				last.y * 1.1,
				e.arc.left,
				e.arc.right
			); // Check parabola intersection assuming sweepline position equal to last event increased by 10%
			y = e.getY(x);

			// Find end point
			if (
				(e.start.y < 0 && y < e.start.y) ||
				(e.start.x < 0 && x < e.start.x) ||
				(e.start.x > this.box_x && x > e.start.x)
			) {
				e.end = e.start; //If invalid make start = end so it will be deleted later
			} else {
				// If slope has same sign of the difference between start point x coord
				// and parabola intersection then will intersect the top border (y = 0)
				if (e.m == 0) {
					x - e.start.x <= 0 ? (x = 0) : (x = this.box_x);
					e.end = new Point(x, e.start.y);
					this.voronoi_vertex.push(e.end);
				} else {
					// If edge is vertical and is connected to the beachline will end on the bottom border
					if (e.m == Infinity) y = this.box_y;
					else
						e.m * (x - e.start.x) <= 0 ? (y = 0) : (y = this.box_y);
					e.end = this.edge_end(e, y);
				}
			}
			r = r.right;
		}

		let option;

		for (let i = 0; i < this.edges.length; i++) {
			e = this.edges[i];
			option =
				1 * this.point_outside(e.start) + 2 * this.point_outside(e.end);

			switch (option) {
				case 3: // Both endpoints outside the canvas
					this.edges[i] = null;
					break;
				case 1: // Start is outside
					e.start.y < e.end.y ? (y = 0) : (y = this.box_y);
					e.start = this.edge_end(e, y);
					break;
				case 2: // End is outside
					e.end.y <= e.start.y ? (y = 0) : (y = this.box_y);

					e.end = this.edge_end(e, y);
					break;
				default:
					break;
			}
		}
	}

	edge_end(e, y_lim) {
		let x = Math.min(this.box_x, Math.max(0, e.getX(y_lim)));
		let y = e.getY(x);
		if (!y) y = y_lim; 
		let p = new Point(x, y);
		this.voronoi_vertex.push(p);
		return p;
	}

	point_outside(p) {
		return p.x < 0 || p.x > this.box_x || p.y < 0 || p.y > this.box_y;
	}
}

function parab_intersect(y, f1, f2) {
	let fyDiff = f1.y - f2.y;
	if (fyDiff == 0) return (f1.x + f2.x) / 2;
	let fxDiff = f1.x - f2.x;
	let b1md = f1.y - y; //Difference btw parabola 1 fy and directrix
	let b2md = f2.y - y; //Difference btw parabola 2 fy and directrix
	let h1 = (-f1.x * b2md + f2.x * b1md) / fyDiff;
	let h2 = Math.sqrt(b1md * b2md * (fxDiff ** 2 + fyDiff ** 2)) / fyDiff;
	return h1 + h2; //Returning the left x coord of intersection. Remember top of canvas is 0 hence parabolas are facing down
}