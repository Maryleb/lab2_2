function sortTableTextUp(data) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;

  data = Number(data);
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[data];
      y = rows[i + 1].getElementsByTagName("TD")[data];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortTableTextDown(data) {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;

  data = Number(data);
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[data];
      y = rows[i + 1].getElementsByTagName("TD")[data];
      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function filterTable(brade, year, weight) {
  let table, tr, tdBrade, i, tdYear, tdWeight;
  brade = brade.toLowerCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("TR");

  for (i = 1; i < tr.length; i++) {
    tdBrade = tr[i].getElementsByTagName("TD")[1];
    tdYear = tr[i].getElementsByTagName("TD")[2];
    tdWeight = tr[i].getElementsByTagName("TD")[4];
      if (tdBrade.innerHTML.toLowerCase().indexOf(brade) > -1 && tdYear.innerHTML.toLowerCase().indexOf(year) > -1 && Number(tdWeight.innerHTML)>weight) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
}

function showTable(tableId) {
  let table, tr, i;
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName("TR");
  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "";
  }
}

let catsData = [];

table = document.getElementById("table");

for (let i = 1; i < table.rows.length; i++) {
  let elementGroup = {};
  elementGroup.name = table.rows[i].cells[0].innerHTML;
  elementGroup.brade = table.rows[i].cells[1].innerHTML;
  elementGroup.year = table.rows[i].cells[2].innerHTML;
  elementGroup.color = table.rows[i].cells[3].innerHTML;
  elementGroup.weight = table.rows[i].cells[4].innerHTML;

  catsData.push(elementGroup);
}

function drawGraph(data, fieldX, fieldY1) {
  if (fieldY1 === "weight" || fieldY1 === "sum") {

  let fieldY = "weight";
  if (fieldX === "year") {
    catsData.sort((a, b) => a.year > b.year ? 1 : -1)
  }
  let groupObj = d3.group(catsData, d => d[fieldX]);
  
  arrGraph = [];
  for(let entry of groupObj) {
    //let minMax = d3.extent(entry[1].map(d => d[fieldY]));
    let avg = d3.mean(entry[1].map(d => d[fieldY]));
    //alert(avg)
    let sum = d3.sum(entry[1].map(d => d[fieldY]));
    let amount = Math.round((sum / avg)*1000)/1000;
    let minMax = d3.extent(entry[1].map(d => d[fieldY]));
    let elementGroup = {};
    elementGroup.labelX = entry[0];
    elementGroup.valueAvg = avg;
    elementGroup.valueAmount = amount;
    elementGroup.valueMin = minMax[0];
    elementGroup.valueMax = minMax[1];
    //alert(elementGroup.valueAvg)
    arrGraph.push(elementGroup);
  }

  let marginX = 50; 
  let marginY = 50;

  let height = 400; 
  let width = 800;

  svg = d3.select("svg") 
      .attr("height", height)
      .attr("width", width)
      //.style("border", "solid thin grey");
  svg.selectAll("*").remove();

  let min, max;
  if (fieldY1 === "weight") {
    min = d3.min(arrGraph.map(d => d.valueAvg)) * 0.95;
    max = d3.max(arrGraph.map(d => d.valueAvg)) * 1.05;
   } else {
      let minMax = d3.extent(arrGraph.map(d => d.valueAmount));
      min = minMax[0];
      max = minMax[1];
   }
  
  let xAxisLen = width - 2 * marginX;
  let yAxisLen = height - 2 * marginY;

  let scaleX = d3.scaleBand() 
  .domain(arrGraph.map(function(d) {
  return d.labelX;})
  )
  .range([0, xAxisLen],1);

  let scaleY = d3.scaleLinear() 
  .domain([0, max])
  .range([yAxisLen, 0]);

  let axisX = d3.axisBottom(scaleX); // горизонтальная 
  let axisY = d3.axisLeft(scaleY);// вертикальная

  svg.append("g")
      .attr("transform", `translate(${marginX}, ${height - marginY})`) 
      .call(axisX)
      .attr("class", "x-axis")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
      return "rotate(-45)"; });

    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`) 
    .attr("class", "y-axis")
    .call(axisY);

    d3.selectAll("g.x-axis g.tick") 
      .append("line") // добавляем линию .classed("grid-line", true) // добавляем класс .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", - (yAxisLen));

    d3.selectAll("g.y-axis g.tick") 
      .append("line") 
      .classed("grid-line", true) 
      .attr("x1", 0)
      .attr("y1", 0) 
      .attr("x2", xAxisLen)
      .attr("y2", 0);

if (fieldY1 === "weight") {
  svg.selectAll(".dot")
  .data(arrGraph)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return scaleX(d.labelX); }) 
  .attr("cy", function(d) { return scaleY(d.valueAvg); }) 
  .attr("transform",`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`) 
  .style("fill", "orange") 


} else if (fieldY1 === "sum") {
    svg.selectAll(".dot")
    .data(arrGraph)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return scaleX(d.labelX); }) 
    .attr("cy", function(d) { return scaleY(d.valueAmount); }) 
    .attr("transform",`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`) 
    .style("fill", "orange") 
}

} else {
  alert("Не выбрано значение по OY, попробуйте еще раз")
}
}



