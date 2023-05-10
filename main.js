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