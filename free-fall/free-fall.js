let height = 34 ;
let coordSys = {
  origX: 70,
  origY: 30,
  endX: 400,
  endY: 380
};

let canvas = $("#falling_object")[0];
let ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "rgba(0,0,0,1)";
ctx.beginPath();

xyLines(coordSys, canvas, ctx);
drawScale(height, coordSys, ctx);

ctx.stroke();




function drawScale(height, coordSys, ctx) {
    let gradationLevels = height.toString().length - 1;
    let multiplier = Math.pow(10, gradationLevels);
    let maxY = Math.ceil(height / multiplier) * multiplier;
    let gradationDividers = maxY / multiplier;
    
    let coordSysHeightPixels = coordSys.endY - coordSys.origY;
    let gradationDividerPixelsPerSegments = Math.ceil(coordSysHeightPixels / gradationDividers);

    let pixelsPerSegment = gradationDividerPixelsPerSegments / 10;
    let segments = Math.floor(coordSysHeightPixels / pixelsPerSegment);
    
    for(let j = 1; j < gradationDividers + 1; j++) {
        ctx.moveTo(coordSys.origX + 5, convY(coordSys.origY + gradationDividerPixelsPerSegments * j, canvas));
        ctx.lineTo(coordSys.origX - 20, convY(coordSys.origY + gradationDividerPixelsPerSegments * j, canvas));
        let text = multiplier * j;
        ctx.font="14px Arial";        
        ctx.fillText(text, coordSys.origX + 10, convY(coordSys.origY + gradationDividerPixelsPerSegments * j - 4, canvas));
    }

    for(let i = 1; i < segments + 1; i++) {
        let segmentText = i * ( multiplier / 10 );
        if ( gradationDividers > 4  || i % 10 === 0 ) {
            segmentText = "";
        } 

        ctx.font= "7px Arial"; 
        ctx.fillText(segmentText, coordSys.origX + 5, convY(coordSys.origY + pixelsPerSegment * i - 2, canvas));

        if (i % 10 === 5) {
            ctx.moveTo(coordSys.origX, convY(coordSys.origY + pixelsPerSegment * i, canvas));
            ctx.lineTo(coordSys.origX - 15, convY(coordSys.origY + pixelsPerSegment * i, canvas));
        } else {
            ctx.moveTo(coordSys.origX, convY(coordSys.origY + pixelsPerSegment * i, canvas));
            ctx.lineTo(coordSys.origX - 5, convY(coordSys.origY + pixelsPerSegment * i, canvas));
        }


    }



}


function xyLines(coordSys, canvas, ctx) {
  // x axis
  ctx.moveTo(coordSys.origX, convY(coordSys.origY, canvas));
  ctx.lineTo(coordSys.origX, convY(coordSys.endY, canvas));

  // y axis
  ctx.moveTo(coordSys.origX, convY(coordSys.origY, canvas));
  ctx.lineTo(coordSys.endX, convY(coordSys.origY, canvas));
}






function convY(y, canvas) {
    let height = canvas.height;
    return height - y;
  }


// let canvas = $('#falling_object')[0];
// let canvas = $('#fall_graph')[0];

// ctx.fillStyle = 'rgba(0,0,200,1)';
// ctx.beginPath();
// ctx.arc(150, 75, 55, 0, Math.PI * 2, true);
// ctx.fill();

// ctx.strokeStyle= 'rgba(0,200,0,1)';
// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(225, 225);
// ctx.stroke();
