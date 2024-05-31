let colorZones = [];
let editableTicks = [];

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
    `;
    container.appendChild(newZoneDiv);
}

function setupCanvas() {
    const canvas = document.getElementById('scaleCanvas');
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const y = event.clientY - rect.top; 
        editableTicks.forEach((tick, index) => {
            if (Math.abs(tick.y - y) < 10) { 
                const newValue = prompt('Edit Tick Value:', tick.value.toString());
                if (newValue !== null && !isNaN(newValue) && newValue !== '') {
                    editableTicks[index].value = parseFloat(newValue);
                    drawScaleMeter(); 
                }
            }
        });
    });
}

function collectColorZones() {
    colorZones = Array.from(document.querySelectorAll('.color-zone')).map(zone => ({
        color: zone.querySelector('.zone-color').value,
        start: parseFloat(zone.querySelector('.zone-start').value),
        end: parseFloat(zone.querySelector('.zone-end').value)
    }));
}

function drawScaleMeter() {
    const canvas = document.getElementById('scaleCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    collectColorZones();

    const minValue = parseInt(document.getElementById('minValue').value, 10);
    const maxValue = parseInt(document.getElementById('maxValue').value, 10);
    const ticks = parseInt(document.getElementById('ticks').value, 10);
    const subTicks = parseInt(document.getElementById('subTicks').value, 10);
    const showDecimals = document.getElementById('showDecimals').checked;
    const numberSize = parseInt(document.getElementById('numberSize').value, 10);
    const tickLength = parseInt(document.getElementById('tickLength').value, 10);
    const specialNumber = parseFloat(document.getElementById('specialNumber').value);
    const specialCharacter = document.getElementById('specialCharacter').value;

    const padding = 20;
    const effectiveHeight = canvas.height - (2 * padding);
    ctx.font = `${numberSize}px 'Roboto Condensed', sans-serif`;

    function getYPosition(value) {
        return padding + (1 - (value - minValue) / (maxValue - minValue)) * effectiveHeight;
    }

    editableTicks = []; 

    for (let i = 0; i <= ticks; i++) {
        let value = minValue + i * (maxValue - minValue) / ticks;
        const y = getYPosition(value);

       
        editableTicks.push({y, value, label: (value === specialNumber) ? specialCharacter : (showDecimals ? value.toFixed(2) : Math.round(value).toString())});

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(canvas.width - tickLength, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(editableTicks[i].label, canvas.width - tickLength - 5, y);
    }

    if (subTicks > 0) {
        for (let i = 0; i < ticks; i++) {
            const interval = (maxValue - minValue) / ticks;
            for (let j = 1; j <= subTicks; j++) {
                const subValue = minValue + i * interval + j * interval / (subTicks + 1);
                const y = getYPosition(subValue);

                ctx.beginPath();
                ctx.moveTo(canvas.width - tickLength / 2, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
    }

    colorZones.forEach(zone => {
        const startY = getYPosition(zone.start);
        const endY = getYPosition(zone.end);
        ctx.fillStyle = zone.color;
        ctx.fillRect(canvas.width - tickLength, Math.min(startY, endY), tickLength, Math.abs(endY - startY));
    });
}

function downloadPNG() {
    const canvas = document.getElementById('scaleCanvas');
    const link = document.createElement('a');
    link.download = 'Meter_Generator.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
}


window.onload = setupCanvas;
