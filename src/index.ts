// Enum representing the possible states of a cell in the forest
enum CellState { INTACT = 'INTACT', BURNING = 'BURNING', ASH = 'ASH' }

// Interface defining the structure of a simulation step
interface SimulationStep {
    step: number;
    grid: CellState[][];
}

// Function to fetch simulation data from the backend server
async function fetchSimulation(config: any): Promise<SimulationStep[]> {
    const response = await fetch('http://localhost:8080/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
    });
    return await response.json();
}

// Function to render the grid state in the DOM
function renderGrid(step: SimulationStep) {
    const container = document.getElementById('grid-container');
    if (!container) return;

    // Clear previous grid
    container.innerHTML = '';
    
    // Create grid cells and rows
    step.grid.forEach((row, i) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        row.forEach((cell, j) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'grid-cell ' + cell.toLowerCase();
            rowDiv.appendChild(cellDiv);
        });
        container.appendChild(rowDiv);
        
        // Update configuration information display
        const configInfo = document.getElementById('init-config-info');
        if (configInfo) {
            configInfo.innerHTML = `Grid Size : ${config.height}x${config.height} | Probability: ${config.probability*100}%`;
        }
    });
}

// Initial configuration for the forest fire simulation
const config = {
    height: 30,
    width: 30,
    initialFires: [[1, 1], [2, 3]], // Starting fire positions
    probability: 0.7 // Probability of fire spreading
};

// Start simulation and handle step navigation
fetchSimulation(config).then(steps => {
    let currentStep = 0;
    const maxStep = steps.length - 1;
    
    // Function to update the grid display for a given step
    function updateStep(step: number) {
        if (step >= 0 && step <= maxStep) {
            renderGrid(steps[step]);
            currentStep = step;
        }
        // Update step counter display
        const stepInfo = document.getElementById('step-info');
        if (stepInfo) {
            stepInfo.innerHTML = `Step ${currentStep + 1} `;
        }
    }

    // Add event listeners for navigation buttons
    document.getElementById('prev')?.addEventListener('click', () => updateStep(currentStep - 1));
    document.getElementById('next')?.addEventListener('click', () => updateStep(currentStep + 1));
    document.getElementById('reset')?.addEventListener('click', () => updateStep(0));
    
    // Initialize with first step
    updateStep(0);
});