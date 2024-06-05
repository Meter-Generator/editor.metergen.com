let meterParameters = {
  minValue: 0,
  maxValue: 100,
  increments: 10,
  ticks: 10,
  subTicks: 5,
  showDecimals: false,
  numberSize: 18,
  tickLength: 20,
  specialNumber: null,
  specialCharacter: "∞",
  colorZones: []
};

function updateParameters() {
  meterParameters.minValue = parseInt(document.getElementById('minValue').value, 10);
  meterParameters.maxValue = parseInt(document.getElementById('maxValue').value, 10);
  meterParameters.increments = parseInt(document.getElementById('increments').value, 10);
  meterParameters.ticks = parseInt(document.getElementById('ticks').value, 10);
  meterParameters.subTicks = parseInt(document.getElementById('subTicks').value, 10);
  meterParameters.showDecimals = document.getElementById('showDecimals').checked;
  meterParameters.numberSize = parseInt(document.getElementById('numberSize').value, 10);
  meterParameters.tickLength = parseInt(document.getElementById('tickLength').value, 10);
  meterParameters.specialNumber = parseFloat(document.getElementById('specialNumber').value);
  meterParameters.specialCharacter = document.getElementById('specialCharacter').value;
  meterParameters.colorZones = collectColorZones();

  drawScaleMeter();
}

function collectColorZones() {
  return Array.from(document.querySelectorAll('.color-zone')).map(zone => ({
      color: zone.querySelector('.zone-color').value,
      start: parseFloat(zone.querySelector('.zone-start').value),
      end: parseFloat(zone.querySelector('.zone-end').value)
  }));
}

function addColorZone() {
  const container = document.getElementById('colorZonesContainer');
  const newZoneDiv = document.createElement('div');
  newZoneDiv.classList.add('color-zone');
  newZoneDiv.innerHTML = `
      <select class="zone-color">
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
      </select>
      <input type="number" class="zone-start" placeholder="Start Value">
      <input type="number" class="zone-end" placeholder="End Value">
      <button onclick="removeColorZone(this)">Remove</button>
  `;
  container.appendChild(newZoneDiv);
  newZoneDiv.querySelectorAll('input, select').forEach(element => {
      element.addEventListener('change', updateParameters);
  });
}

function removeColorZone(button) {
  button.parentElement.remove();
  updateParameters();
}
