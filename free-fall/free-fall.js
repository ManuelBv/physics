runExperiment();

const expButton = $(".input_data button");
const inputBtn = $(".input_data input");

inputBtn.on("keypress", function(e) {
  if (e.keyCode === 13) {
    let height = Number(inputBtn.val());
    runExperiment(height);
  }
});

expButton.on("click", function() {
  let height = Number(inputBtn.val());

  if (height !== "") {
    runExperiment(height);
  } else {
    let heightC = Number(prompt("Insert height!", 22));
    runExperiment(heightC);
  }
});

function runExperiment(initialHeight) {
  let height = 30;
  let g = 9.81;

  if (initialHeight) {
    height = initialHeight;
  }

  updateResult(height);

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
    let gradationDividerPixelsPerSegments = Math.ceil(
      coordSysHeightPixels / gradationDividers
    );

    let pixelsPerSegment = gradationDividerPixelsPerSegments / 10;
    let segments = Math.floor(coordSysHeightPixels / pixelsPerSegment);

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
      ctx.font = "14px Arial";
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
        segmentText = "";
      }

      ctx.font = "7px Arial";
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

  function updateResult(height) {
    let totalTime = Number(Math.sqrt(2 * height / g).toFixed(2));
    let maxVelocity = Number((g * totalTime).toFixed(2));
    let kmph = Number((maxVelocity * 3.6).toFixed(2));

    $(".drop_height").text(height + " m");
    $(".max_velocity").html(maxVelocity + " m/s or <br> " + kmph + " km/h");
    $(".total_time").text(totalTime + " s");
    $('.graph input[type="number"]').val(totalTime);
  }
}
