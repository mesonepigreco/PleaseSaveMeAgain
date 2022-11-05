export function norm(vector2) {
    return Math.sqrt(vector2.x* vector2.x + vector2.y*vector2.y);
}

export function distance(v1, v2) {
    return norm({x : v2.x - v1.x, y: v2.y - v1.y});
}

export function random_poisson(mean) {
    var L = Math.exp(-mean);
    var p = 1.0;
    var k = 0;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}


// Check clockwise order of points
function ccw(A, B, C) {
    return (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x);
}

// Check if two segments AB and CD intersect
export function segment_intersect(A, B, C, D) {
    return ccw(A,C,D) != ccw(B,C,D) && ccw(A,B,C) != ccw(A,B,D);
}


export function scalar_product(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
}

function inside_rect(bl, tr, p) {
    if (p.x > bl.x && p.x < tr.x && p.y > bl.y && p.y < tr.y)
        return true;
    return false;
}

// Check if the segment connecting A, B intersect with the rectangle
export function segment_rect_intersect(A, B, rect) {
    let rect_edges = [rect.topleft, rect.topright, rect.bottomright, rect.bottomleft];

    for (let i = 0; i < rect_edges.length; ++i) {
        let following = (i + 1) % rect_edges.length;

        if (segment_intersect(A, B, rect_edges[i], rect_edges[following])) return true;
    }
    return false;
}


export function point_rect_collision(point, rect) {
    return inside_rect(rect.bottomleft, rect.topright, point);
}