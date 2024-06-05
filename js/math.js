function drawScaleMeter() {
  const canvas = document.getElementById('scaleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.width;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 20;
  const effectiveHeight = canvas.height - (2 * padding);
  ctx.font = `${meterParameters.numberSize}px 'Roboto Condensed', sans-serif`;

  function getYPosition(value) {
      return padding + (1 - (value - meterParameters.minValue) / (meterParameters.maxValue - meterParameters.minValue)) * effectiveHeight;
  }

  let editableTicks = [];

  for (let i = 0; i <= meterParameters.ticks; i++) {
      let value = meterParameters.minValue + i * (meterParameters.maxValue - meterParameters.minValue) / meterParameters.ticks;
      const y = getYPosition(value);

      editableTicks.push({ y, value, label: (value === meterParameters.specialNumber) ? meterParameters.specialCharacter : (meterParameters.showDecimals ? value.toFixed(2) : Math.round(value).toString()) });

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(canvas.width - meterParameters.tickLength, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(editableTicks[i].label, canvas.width - meterParameters.tickLength - 5, y);
  }

  if (meterParameters.subTicks > 0) {
      for (let i = 0; i < meterParameters.ticks; i++) {
          const interval = (meterParameters.maxValue - meterParameters.minValue) / meterParameters.ticks;
          for (let j = 1; j <= meterParameters.subTicks; j++) {
              const subValue = meterParameters.minValue + i * interval + j * interval / (meterParameters.subTicks + 1);
              const y = getYPosition(subValue);

              ctx.beginPath();
              ctx.moveTo(canvas.width - meterParameters.tickLength / 2, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
          }
      }
  }

  meterParameters.colorZones.forEach(zone => {
      const startY = getYPosition(zone.start);
      const endY = getYPosition(zone.end);
      ctx.fillStyle = zone.color;
      ctx.fillRect(canvas.width - meterParameters.tickLength, Math.min(startY, endY), meterParameters.tickLength, Math.abs(endY - startY));
  });
}

function downloadPNG() {
  const canvas = document.getElementById('scaleCanvas');
  const link = document.createElement('a');
  link.download = 'Meter_Generator.png';
  link.href = canvas.toDataURL("image/png");
  link.click();
}
