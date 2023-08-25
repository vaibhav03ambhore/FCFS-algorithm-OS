const inputTable = document.getElementById('input-table');
const addRowButton = document.getElementById('add-row');
const generateGanttButton = document.getElementById('generate-gantt');
const generateAnswerButton = document.getElementById('generate-answer');
const ganttChart = document.getElementById('gantt-chart');
const answerTableContainer = document.getElementById('answer-table');

addRowButton.addEventListener('click', () => {
  const newRow = createRow();
  inputTable.appendChild(newRow);
});

inputTable.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-row')) {
    event.target.closest('tr').remove();
  }
});




generateGanttButton.addEventListener('click', () => {
  const answerData = generateAnswerData();
  const sortedAnswerData = answerData.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChartRowHTML = generateGanttChartRow(sortedAnswerData);
  displayGanttChartRow(ganttChartRowHTML);
});

function generateGanttChartRow(answerData) {
  let ganttChartRowHTML = '<div class="gantt-row">';

  answerData.forEach((data) => {
    ganttChartRowHTML += `
      <div class="gantt-block" style="width: ${(data.endTime - data.startTime) * 20}px;">
        P${data.processId} (${data.startTime} - ${data.endTime})
      </div>
    `;
  });

  ganttChartRowHTML += '</div>';
  return ganttChartRowHTML;
}

function displayGanttChartRow(ganttChartRowHTML) {
  const ganttChartRow = document.getElementById('gantt-chart-row');
  ganttChartRow.innerHTML = ganttChartRowHTML;
}





generateAnswerButton.addEventListener('click', () => {
  const answerData = generateAnswerData();
  const sortedAnswerData = answerData.map((data, index) => ({ ...data, processId: index + 1 }))
                                      .slice().sort((a, b) => a.arrivalTime - b.arrivalTime);
  const answerTable = createAnswerTable(sortedAnswerData);
  displayAnswerTable(answerTable);
});

function createRow() {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>P${inputTable.children.length + 1}</td>
    <td><input type="number" class="arrival-time"></td>
    <td><input type="number" class="burst-time"></td>
    <td><button type="button" class="delete-row">Delete</button></td>
  `;
  return newRow;
}

function generateAnswerData() {
  const answerData = [];
  const rows = inputTable.querySelectorAll('tr');
  
  rows.forEach((row) => {
    const arrivalTime = parseInt(row.querySelector('.arrival-time').value);
    const burstTime = parseInt(row.querySelector('.burst-time').value);
    answerData.push({
      arrivalTime,
      burstTime,
    });
  });
  
  return answerData;
}

function calculateAnswerData(answerData) {
  let currentTime = 0;
  const calculatedData = [];
  
  answerData.forEach((data) => {
    const startTime = Math.max(currentTime, data.arrivalTime);
    const endTime = startTime + data.burstTime;
    const waitingTime = startTime - data.arrivalTime;
    const turnaroundTime = endTime - data.arrivalTime;
    currentTime = endTime;
    
    calculatedData.push({
      processId: data.processId,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
    });
  });
  
  return calculatedData;
}

function createAnswerTable(answerData) {
  const calculatedData = calculateAnswerData(answerData);
  const sortedAnswerData = answerData.slice().sort((a, b) => a.arrivalTime - b.arrivalTime);

  const table = document.createElement('table');
  
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>Process</th>
    <th>Arrival Time</th>
    <th>Burst Time</th>
    <th>Start Time</th>
    <th>End Time</th>
    <th>Waiting Time</th>
    <th>Turnaround Time</th>
  `;
  table.appendChild(headerRow);

  sortedAnswerData.forEach((data) => {
    const correspondingCalculatedData = calculatedData.find(calcData => calcData.processId === data.processId);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>P${data.processId}</td>
      <td>${data.arrivalTime}</td>
      <td>${data.burstTime}</td>
      <td>${correspondingCalculatedData.startTime}</td>
      <td>${correspondingCalculatedData.endTime}</td>
      <td>${correspondingCalculatedData.waitingTime}</td>
      <td>${correspondingCalculatedData.turnaroundTime}</td>
    `;
    table.appendChild(row);
  });
  
  return table;
}

function displayAnswerTable(answerTable) {
  answerTableContainer.innerHTML = ''; // Clear any existing content
  answerTableContainer.appendChild(answerTable);
}
