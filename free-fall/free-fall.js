/* INITIAL */
const inputBtn = $('.input_data input');
const expButton = $('.input_data button');

runExperiment();


/* BUTTONS */
inputBtn.on('keypress', function (e) {
  if (e.keyCode === 13) {
    disableButtons();
    let height = Number(inputBtn.val());
    runExperiment(height);
  }
});

expButton.on('click', function () {
  let height = Number(inputBtn.val());

  if (height !== '') {
    runExperiment(height);
  } else {
    let heightC = Number(prompt('Insert height!', 22));
    runExperiment(heightC);
  }

  disableButtons();

});


/* FUNCTIONS */
/* 
@disableButtons =disable buttons when experiment runs
*/
function disableButtons() {
  inputBtn.attr('disabled', '');
  expButton.attr('disabled', '');
}


/* 
@enableButtons = re-enable buttons when experiment finishes
*/
function enableButtons() {
  inputBtn.removeAttr('disabled');
  expButton.removeAttr('disabled');
}


/* 
@runAnimation = animation control center
*/
function runAnimation(ctx, canvas, height, coordSys) {
  console.clear();
  console.log('Animation running!');

  let timer;
  let time = 0;
  let newHeight = height;
  let velocity = 0;
  let g = 9.81;
  let totalTime = Number(Math.sqrt(2 * height / g).toFixed(2));
  let maxVelocity = Number((g * totalTime).toFixed(2));

  let scalePixelInfo = window.scalePixelInfo;

  let ballX = 150;
  let ballY = convY(coordSys.origY + scalePixelInfo.pixelsPerSegment * correctedHeight(height), canvas);
  let stats = [time, velocity, height];
  console.log('scalePixelInfo', scalePixelInfo, 'ball y is', coordSys.origY + scalePixelInfo.pixelsPerSegment * correctedHeight(height));

  drawBallAndStats(ballX, ballY, ctx, canvas);

  var startTime;
  var totalTimeMS = totalTime * 1000;
  var globalAnimID = requestAnimationFrame(timeStamp => {
    startTime = timeStamp;
    drawBallStep(timeStamp, totalTime);
  })


  function drawBallStep(timeStamp, totalTime) {
    
    ballY = convY(coordSys.origY + scalePixelInfo.pixelsPerSegment * correctedHeight(height, newHeight), canvas);
    stats = [time, velocity, newHeight];
    console.log('ballY', ballY, 'time', time, 'velocity', velocity, 'height', newHeight, 'maxtime', totalTime);

    drawBallAndStats(ballX, ballY, ctx, canvas, stats);

    var runTime = timeStamp - startTime;

    time = Number((runTime / 1000 ).toFixed(2));
    velocity = Number((g * time).toFixed(2));
    newHeight = Number((height - (0.5 * g * time * time)).toFixed(2));

    if (runTime <= totalTimeMS ) {
      requestAnimationFrame(timeStamp => drawBallStep(timeStamp, totalTime));
    } else {
      cancelAnimationFrame(globalAnimID);
      enableButtons();
    }
  }
}


/* 
@correctedHeight = adjusting height as per canvas height, not actual height
*/
function correctedHeight(height, newHeight) {
  if (height > 99) {
    height = parseInt(height, 10);
    var division = height.toString().length;
    height = height / Math.pow(10, (division - 2));
    
    if (newHeight) {
      newHeight = newHeight / Math.pow(10, (division - 2));
      return newHeight;
    }
  } else {
    if (newHeight) {
      return newHeight;
    }
  }

  return height;
}

/* 
@drawBallAndStats = draws the ball and animates it
*/

function drawBallAndStats(x, y, ctx, canvas, stats) {

  if (stats) {
    var time = Number(stats[0].toFixed(2));
    var velocity = Number(stats[1].toFixed(2));
    var height = Number(stats[2].toFixed(2));
  }


  clearBallArea(ctx, canvas);
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x, y);

  // draw ball
  ctx.arc(x - 5, y, 5, 0, Math.PI * 2, true);


  // draw stat lines
  ctx.moveTo(x + 5, y - 7);
  ctx.lineTo(x + 30, y - 30);
  ctx.lineTo(x + 250, y - 30);


  // draw text
  var veloText = ' VELOCITY ' + velocity + ' m/s';
  ctx.font = '14px Arial';
  ctx.fillText(veloText, x  + 30, y - 35);

  var timeText = ' | TIME ' + time + ' s';
  ctx.font = '14px Arial';
  ctx.fillText(timeText, x  + 170, y - 35);

  var heightText = ' HEIGHT ' + height + ' m';
  ctx.font = '17px Arial';
  ctx.fillText(heightText, x  + 60, y - 10);

  ctx.stroke();
}


/* 
@clearBallArea = clears the area the ball was in
*/
function clearBallArea(ctx, canvas) {
  ctx.clearRect(130, 0, canvas.width, canvas.height - 31);
}

/* 
@runExperiment = main actions are referred to in here
*/
function runExperiment(initialHeight) {
  let height = 30;
  let g = 9.81;
  let animate = false;
  let canvas = $('#falling_object')[0];
  let ctx = canvas.getContext('2d');
  let coordSys = {
    origX: 70,
    origY: 30,
    endX: 400,
    endY: 380
  };

  if (initialHeight) {
    height = initialHeight;
    animate = true;
  }

  updateResult(height, g);

  clearScreen(ctx, canvas);
  xyLines(coordSys, canvas, ctx);
  drawScale(height, coordSys, ctx, canvas);

  if (animate) {
    runAnimation(ctx, canvas, height, coordSys);
  }

}


/* 
@clearScreen = empty the entire canvas for a new draw
*/
function clearScreen(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* 
@drawScale = draw the scale based on the height inserted; sometimes display the intermediate values of segments in the Y scale
*/
function drawScale(height, coordSys, ctx, canvas) {
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();

  let gradationLevels = height.toString().length - 1;
  let multiplier = Math.pow(10, gradationLevels);
  let maxY = Math.ceil(height / multiplier) * multiplier;
  let gradationDividers = maxY / multiplier;

  let coordSysHeightPixels = coordSys.endY - coordSys.origY;
  let gradationDividerPixelsPerSegments = Math.ceil(
    coordSysHeightPixels / gradationDividers
  );

  let pixelsPerSegment = gradationDividerPixelsPerSegments / 10;
  let segments = Math.floor(coordSysHeightPixels / pixelsPerSegment);
  let scalePixelInfo = {
    pixelsPerSegment,
    segments
  }

  for (let j = 1; j < gradationDividers + 1; j++) {
    ctx.moveTo(
      coordSys.origX + 5,
      convY(coordSys.origY + gradationDividerPixelsPerSegments * j, canvas)
    );
    ctx.lineTo(
      coordSys.origX - 20,
      convY(coordSys.origY + gradationDividerPixelsPerSegments * j, canvas)
    );
    let text = multiplier * j;
    ctx.font = '14px Arial';
    ctx.fillText(
      text,
      coordSys.origX + 10,
      convY(
        coordSys.origY + gradationDividerPixelsPerSegments * j - 4,
        canvas
      )
    );
  }

  for (let i = 1; i < segments + 1; i++) {
    let segmentText = i * (multiplier / 10);
    if (gradationDividers > 4 || i % 10 === 0 || height < 5) {
      segmentText = '';
    }

    ctx.font = '7px Arial';
    ctx.fillText(
      segmentText,
      coordSys.origX + 5,
      convY(coordSys.origY + pixelsPerSegment * i - 2, canvas)
    );

    if (i % 10 === 5) {
      ctx.moveTo(
        coordSys.origX,
        convY(coordSys.origY + pixelsPerSegment * i, canvas)
      );
      ctx.lineTo(
        coordSys.origX - 15,
        convY(coordSys.origY + pixelsPerSegment * i, canvas)
      );
    } else {
      ctx.moveTo(
        coordSys.origX,
        convY(coordSys.origY + pixelsPerSegment * i, canvas)
      );
      ctx.lineTo(
        coordSys.origX - 5,
        convY(coordSys.origY + pixelsPerSegment * i, canvas)
      );
    }
  }

  ctx.stroke();

  window.scalePixelInfo = scalePixelInfo;

}


/* 
@xyLines = the X and Y lines of the coord sys
*/
function xyLines(coordSys, canvas, ctx) {
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();

  // x axis
  ctx.moveTo(coordSys.origX, convY(coordSys.origY, canvas));
  ctx.lineTo(coordSys.origX, convY(coordSys.endY, canvas));

  // y axis
  ctx.moveTo(coordSys.origX, convY(coordSys.origY, canvas));
  ctx.lineTo(coordSys.endX, convY(coordSys.origY, canvas));

  ctx.stroke();
}


/* 
@convY = inverting Y so that the coord system is placed in bottom left, not top left
*/
function convY(y, canvas) {
  let height = canvas.height;
  return height - y;
}


/* 
@updateResult = display max velocity and time based on height
*/
function updateResult(height, g) {
  let totalTime = Number(Math.sqrt(2 * height / g).toFixed(2));
  let maxVelocity = Number((g * totalTime).toFixed(2));
  let kmph = Number((maxVelocity * 3.6).toFixed(2));

  $('.drop_height').text(height + ' m');
  $('.max_velocity').html(maxVelocity + ' m/s or <br> ' + kmph + ' km/h');
  $('.total_time').text(totalTime + ' s');
  $('.graph input[type="number"]').val(totalTime);
}