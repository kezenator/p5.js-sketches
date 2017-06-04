//
// This file is a p5.js sketch that draws a rotating spiral of
// cycloids sprialing into the center of the screen.
//
// All math is done with the screen containing the unit circle -
// i.e. (-1, -1) to (1, 1), with the origin (0, 0) in the
// center of the screen. All coordinates are then mapped to
// window coordinates when drawn.
//
// The cycloid runs inside the outer circle, touching the outer
// circle at (-1, 0).
//

function cycloidSpiralFunction(p)
{
    function toScreenX(x)
    {
        return p.map(x, -1, 1, 0, p.width);
    }

    function toScreenY(y)
    {
        return p.map(-y, -1, 1, 0, p.height);
    }

    function scaleScreenX(distance)
    {
        return distance * p.width / 2;
    }

    function scaleScreenY(distance)
    {
        return distance * p.height / 2;
    }

    function DrawPoint(radius, angleOffset, angleInc)
    {
        this.radius = radius;
        this.angleOffset = angleOffset;
        this.angleInc = angleInc;
    }

    var points = [];
    var cycloidOmega = 0.05;
    var cycloidAngle = 0;
    var spiralAngle = 0;
    
    var showGuidesCheckbox;
    var invertSpiralDirCheckbox;
    var numPointsSlider;
    var cycloidRadiusSlider;
    var spiralFactorSlider;

    p.setup = function()
    {
        p.createCanvas(500, 500);
        p.background(0);
        
        var clearBtn = p.createButton("Clear");
        clearBtn.mousePressed(function() {points = [];});
        
        showGuidesCheckbox = p.createCheckbox("Show guides", true);
        invertSpiralDirCheckbox = p.createCheckbox("Invert spiral direction", false);

        p.createP("Number of points:");
        numPointsSlider = p.createSlider(100, 20000, 2000, 100);
    
        p.createP("Cycloid Size:");
        cycloidRadiusSlider = p.createSlider(0.05, 0.95, 0.25, 0.0005);
    
        p.createP("Spiral Size:");
        spiralFactorSlider = p.createSlider(0.995, 1.0, 0.9995, 0.00005);
    }

    p.draw = function()
    {
        // Get the current values from the sliders
        
        var cycloidRadius = cycloidRadiusSlider.value();
        console.log(cycloidRadius);
        
        // First, update the cycloid and spiral angles
        // now that we've drawn a new frame.

        cycloidAngle = (cycloidAngle + cycloidOmega) % p.TWO_PI;

        var spiralOmega = (cycloidOmega * cycloidRadius);
        
        if (invertSpiralDirCheckbox.checked())
            spiralOmega = -spiralOmega;
        
        spiralAngle = (spiralAngle + spiralOmega) % p.TWO_PI;

        // Calculate the current position of
        // the cycloid

        var cycloidCenter = p.createVector(-1 + cycloidRadius, 0);

        var cycloidOffset = p.createVector(cycloidRadius, 0);
        cycloidOffset.rotate(cycloidAngle);

        var cycloidPoint = p5.Vector.add(cycloidCenter, cycloidOffset);

        // Start with a fresh background
        
        p.background(0);

        // Draw the outside circle
        
        if (showGuidesCheckbox.checked())
        {
            p.stroke(255);
            p.noFill();
            p.ellipseMode(p.CORNER);
            p.ellipse(toScreenX(-1), toScreenY(1),
                      toScreenX(1), toScreenY(-1));
        }

        // Draw the cycloid

        if (showGuidesCheckbox.checked())
        {
            p.ellipseMode(p.RADIUS);
            p.ellipse(toScreenX(cycloidCenter.x), toScreenY(cycloidCenter.y),
                      scaleScreenX(cycloidRadius), scaleScreenY(cycloidRadius));

            p.line(toScreenX(cycloidCenter.x), toScreenY(cycloidCenter.y),
                   toScreenX(cycloidPoint.x), toScreenY(cycloidPoint.y));
        }

        // Conver the cycloid point to a radius and angle and add
        // it as a new point into the points array. Also clear down any remaining points.

        var newPoint = new DrawPoint(cycloidPoint.mag(), cycloidPoint.heading(), spiralOmega);

        points.unshift(newPoint);

        while (points.length > numPointsSlider.value())
        {
            points.pop();
        }

        // Now, draw all of the points, incrementing
        // their offset by the increment of each point

        var curAngle = 0;
        var lastLocation;

        for (i = 0; i < points.length; ++i)
        {
            var point = points[i];
            
            var radiusFactor = Math.pow(spiralFactorSlider.value(), i);

            var location = p.createVector(point.radius * radiusFactor, 0);
            location.rotate(point.angleOffset);
            location.rotate(curAngle);

            curAngle = (curAngle + point.angleInc) % p.TWO_PI;

            if (i > 0)
            {
                p.stroke(255, 255, 255, 255 - (255 * i / points.length));
                p.line(
                    toScreenX(lastLocation.x), toScreenY(lastLocation.y),
                    toScreenX(location.x), toScreenY(location.y));
            }

            lastLocation = location;
        }
    }
}

var cycloidSpiral = new p5(cycloidSpiralFunction);
