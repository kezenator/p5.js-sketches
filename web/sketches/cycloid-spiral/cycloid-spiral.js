function DrawPoint(radius, angleOffset, angleInc)
{
    this.radius = radius;
    this.angleOffset = angleOffset;
    this.angleInc = angleInc;
}

var points = [];
var cycloidOmega = 0.05;
var cycloidSize = 0.65;
var cycloidAngle = 0;
var offsetAngle = 0;

function setup()
{
    createCanvas(500, 500);
    background(0);
}

function draw()
{
    cycloidAngle = (cycloidAngle + cycloidOmega) % TWO_PI;
    
    var angleInc = (cycloidOmega * 0.5 * cycloidSize);
    offsetAngle = (offsetAngle + angleInc) % TWO_PI;
    
    var scale = width > height ? height : width;
    
    background(0);
    stroke(255);
    noFill();
    ellipseMode(CORNER);
    ellipse(0, 0, scale, scale);
    
    // Draw the cycloid circle
    {
        var circlex = scale * 0.25 * cycloidSize;
        var circley = scale * 0.5;
        var circlesize = scale * 0.5 * cycloidSize;
        
        ellipseMode(CENTER);
        ellipse(circlex, circley, circlesize, circlesize);
        line(
            circlex,
            circley,
            circlex + 0.5 * circlesize * cos(cycloidAngle),
            circley + 0.5 * circlesize * sin(cycloidAngle));
    }
    
    // Add a new point into the array
    {
        var x = -1.0 + (0.5 * cycloidSize) + (0.5 * cycloidSize * cos(cycloidAngle));
        var y = 0.5 * cycloidSize * sin(cycloidAngle);
        
        var vector = createVector(x, y);
        
        var radius = vector.mag();
        var angle = vector.heading();
        
        points.unshift(new DrawPoint(radius, angle, angleInc));
    }
    
    // Clear old points
    while (points.length > 2000)
    {
        points.pop();
    }
    
    // Now, draw all the points
    var curAngle = PI;
    var lastLocation;
    for (i = 0; i < points.length; ++i)
    {
        var point = points[i];
        
        var location = createVector(-point.radius, 0);
        location.rotate(point.angleOffset);
        location.rotate(curAngle);
        
        curAngle = (curAngle + TWO_PI - point.angleInc) % TWO_PI;
        
        if (i > 0)
        {
            line(
                map(lastLocation.x, -1, 1, 0, width),
                map(lastLocation.y, -1, 1, 0, height),
                map(location.x, -1, 1, 0, width),
                map(location.y, -1, 1, 0, height));
        }
        
        lastLocation = location;
    }
}