import { html, render } from "lit-html";

let myData = {
  features: []
};
let newData = { features: [] };
// let lastData = { features: [] };
let oldName = "";
let newName = "";

const el = document.querySelector("#container");

function getStations() {
  fetch(`https://api.weather.gov/stations`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      myData = myJson;
      render(todo(myData), el);
    });
}

const todo = items => {
  return html`
    <button @click=${getStations}>Click Me!</button>
    <input @keyup=${e => filterStations(e.target.value)}></input><h1>Records:${
    items.features.length
  }</h1>
    <div>${buildStationTable(items)}</div>
  `;
};

function createStationRow(item) {
  return html`
    <tr>
      <td>${item.properties.name}</td>
      <td>${item.properties.stationIdentifier}</td>
      <td>
        ${Math.floor(
          item.properties.elevation.value
        )}${item.properties.elevation.unitCode.split(":")[1]}
      </td>
    </tr>
  `;
}

function buildStationTable(stationData) {
  return html`
    <table>
      <tr>
        <td>Station</td>
        <td>Identifier</td>
        <td>Elevation</td>
      </tr>
      ${stationData.features.map(createStationRow)}
    </table>
  `;
}

function filterStations(name) {
  newName = name;
  if (newName > oldName) {
    newData.features = newData.features.filter(item => {
      return returnValid(item, name);
    });
  } else {
    newData.features = myData.features.filter(item => {
      return returnValid(item, name);
    });
  }
  oldName = newName;
  render(todo(newData), el);
}

function returnValid(item, name) {
  return item.properties.name.includes(name);
}

render(todo(myData), el);
