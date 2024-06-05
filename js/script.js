document.querySelectorAll('.input-group input, .input-group select').forEach(element => {
    element.addEventListener('change', updateParameters);
});

window.onload = () => {
    document.querySelectorAll('.input-group input, .input-group select').forEach(element => {
        element.addEventListener('change', updateParameters);
    });
    setupCanvas();
};

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
