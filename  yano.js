import Protobject from './js/protobject.js';
import TextToSpeech from './js/textToSpeech.js';

document.body.innerHTML = `
<style>
    #triangle {
      width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; 
      border-bottom: 20px solid #333; transform: rotate(-45deg); position: absolute;  top: 0px; left: 0px; z-index: 10;
    }
  </style>

<div class="my_dataviz-flex">
<div id="triangle"></div>
  <!-- Load d3.js -->
  <script src="https://d3js.org/d3.v4.js"></script>
  <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
  <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.js"></script>

  <link rel="stylesheet" href="chart.css">

  <!-- Map container -->
  
  <svg id="my_dataviz" width="1000" height="600"></svg>
  <div class="footer">
    
</div>


`;

let triangle = document.getElementById("triangle");

function mapValue(inValue, minIn, maxIn, minOut, maxOut) {
    return ((inValue - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
}


// Función que recibe datos (coordenadas x, y) y actualiza la posición del triángulo en el mapa
Protobject.onReceived((data) => {
    // Mapea el valor de data.y, que va de 0.2 a 0.8, al rango de 0 a 600 píxeles para el movimiento vertical
    let cursorTop = mapValue(data.y, 0.2, 0.8, 0, 600);
    triangle.style.top = cursorTop + 'px'; // Actualiza la posición vertical del triángulo

    // Mapea el valor de data.x, que va de 0.2 a 0.8, al rango de 0 a 800 píxeles para el movimiento horizontal
    let cursorLeft = mapValue(data.x, 0.2, 0.8, 0, 800);
    triangle.style.left = cursorLeft + 'px'; // Actualiza la posición horizontal del triángulo

    // Llama a la función para activar la detección de hover en base a las coordenadas del cursor
    activateHover(cursorLeft, cursorTop);
});


function activateHover(x, y) {
  // Obtiene el elemento en las coordenadas (x, y)
  var state = document.elementFromPoint(x, y);

  // Si el elemento es un <path> (que representa un estado en el SVG), obtenemos su id
  if (state && state.tagName === 'path') {
      stateName = state.getAttribute('id');
  }

  // Si el estado detectado es diferente al anterior y no es undefined, procesa el nuevo estado
  if (stateName != oldStateName && stateName != undefined) {
      console.log("Estado seleccionado:", stateName); // Muestra en consola el estado seleccionado
      oldStateName = stateName; // Actualiza el estado anterior con el nuevo

      // Recorre los datos para encontrar el estado por su código y reproduce una descripción por audio
      data.forEach(function(el) {
          if (el.code == stateName) {
              TextToSpeech.play("es-CL", el.state + " exporta " + parseInt(el["total exports"]) + " millones de dólares por año en fruta");
          }
      });
  }
}


  
// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3.geoNaturalEarth1()
  .scale(width / 1.6 / Math.PI)
  .translate([width / 2, height / 1.8]);  

var path = d3.geoPath().projection(projection);


// Map country name differences
var countryNameMap = {
  "USA": "United States",
  "Democratic Republic of the Congo": "Democratic Republic of Congo",
  "Republic of the Congo": "Congo",
  "Republic of Serbia": "Serbia",
  "Greenland" : "Denmark",
  "United Republic of Tanzania": "Tanzania",
  "England": "United Kingdom",
  "Macedonia": "North Macedonia",
  "Czech Republic":"Czechia",
  "Ivory Coast":"Cote d'Ivoire"
};

// Function to normalize country name
function normalizeCountryName(geoJsonName) {
  return countryNameMap[geoJsonName] || geoJsonName;
}

// GHG emissions data
var ghgData = {
  "ghg_per_capita": {
    "Afghanistan": 0.762,
    "Africa": 2.821,
    "Albania": 3.052,
    "Algeria": 6.609,
    "Andorra": 8.25,
    "Angola": 3.965,
    "Antigua and Barbuda": 13.243,
    "Argentina": 8.915,
    "Armenia": 3.545,
    "Asia": 5.629,
    "Australia": 23.997,
    "Austria": 7.86,
    "Azerbaijan": 5.169,
    "Bahamas": 7.86,
    "Bahrain": 36.414,
    "Bangladesh": 1.436,
    "Barbados": 13.526,
    "Belarus": 6.753,
    "Belgium": 9.402,
    "Belize": 17.605,
    "Benin": 2.098,
    "Bhutan": 0.469,
    "Bolivia": 11.779,
    "Bosnia and Herzegovina": 7.29,
    "Botswana": 20.938,
    "Brazil": 6.854,
    "Brunei": 21.983,
    "Bulgaria": 2.479,
    "Burkina Faso": 2.688,
    "Burundi": 0.677,
    "Cambodia": 4.428,
    "Cameroon": 4.84,
    "Canada": 20.635,
    "Cape Verde": 1.3,
    "Central African Republic": 8.942,
    "Chad": 6.553,
    "Chile": 2.906,
    "China": 8.479,
    "Colombia": 5.39,
    "Comoros": 0.885,
    "Congo": 5.398,
    "Cook Islands": 5.837,
    "Costa Rica": 1.668,
    "Cote d'Ivoire": 1.97,
    "Croatia": 4.339,
    "Cuba": 3.375,
    "Cyprus": 6.746,
    "Czechia": 10.513,
    "Democratic Republic of Congo": 7.559,
    "Denmark": 7.602,
    "Djibouti": 1.285,
    "Dominica": 3.079,
    "Dominican Republic": 3.654,
    "East Timor": 4.983,
    "Ecuador": 5.691,
    "Egypt": 3.332,
    "El Salvador": 2.216,
    "Equatorial Guinea": 9.813,
    "Eritrea": 1.938,
    "Estonia": 11.175,
    "Eswatini": 2.3,
    "Ethiopia": 1.607,
    "Europe": 7.849,
    "European Union (27)": 7.077,
    "Fiji": -0.174,
    "Finland": 10.58,
    "France": 5.467,
    "Gabon": 8.775,
    "Gambia": 1.14,
    "Georgia": 4.678,
    "Germany": 8.662,
    "Ghana": 0.404,
    "Greece": 7.557,
    "Grenada": 19.473,
    "Guatemala": 2.25,
    "Guinea": 3.154,
    "Guinea-Bissau": 2.137,
    "Guyana": 24.788,
    "Haiti": 0.997,
    "High-income countries": 11.627,
    "Honduras": 2.826,
    "Hungary": 6.394,
    "Iceland": 7.678,
    "India": 2.432,
    "Indonesia": 7.269,
    "Iran": 10.325,
    "Iraq": 7.731,
    "Ireland": 11.985,
    "Israel": 10.137,
    "Italy": 6.298,
    "Jamaica": 3.607,
    "Japan": 9.018,
    "Jordan": 3.418,
    "Kazakhstan": 14.486,
    "Kenya": 1.441,
    "Kiribati": 0.966,
    "Kuwait": 30.778,
    "Kyrgyzstan": 2.157,
    "Laos": 5.466,
    "Latvia": 4.659,
    "Lebanon": 6.076,
    "Lesotho": 1.137,
    "Liberia": 3.183,
    "Libya": 19.286,
    "Liechtenstein": 4.156,
    "Lithuania": 6.423,
    "Low-income countries": 1.85,
    "Lower-middle-income countries": 3.234,
    "Luxembourg": 16.452,
    "Madagascar": 1.461,
    "Malawi": 1.025,
    "Malaysia": 12.075,
    "Maldives": 5.153,
    "Mali": 2.147,
    "Malta": 4.229,
    "Marshall Islands": 5.14,
    "Mauritania": 3.013,
    "Mauritius": 5.269,
    "Mexico": 5.363,
    "Micronesia (country)": 2.065,
    "Moldova": 4.342,
    "Mongolia": 18.299,
    "Montenegro": 6.123,
    "Morocco": 2.511,
    "Mozambique": 3.524,
    "Myanmar": 4.58,
    "Namibia": 8.673,
    "Nauru": 5.758,
    "Nepal": 1.678,
    "Netherlands": 9.998,
    "New Zealand": 14.638,
    "Nicaragua": 5.764,
    "Niger": 1.875,
    "Nigeria": 1.743,
    "Niue": 5.147,
    "North America": 12.728,
    "North Korea": 3.211,
    "North Macedonia": 5.326,
    "Norway": 5.045,
    "Oceania": 18.336,
    "Oman": 21.787,
    "Pakistan": 1.968,
    "Palau": 16.166,
    "Panama": 5.978,
    "Papua New Guinea": 6.651,
    "Paraguay": 14.793,
    "Peru": 5.808,
    "Philippines": 2.145,
    "Poland": 8.319,
    "Portugal": 5.996,
    "Qatar": 40.88,
    "Romania": 4.013,
    "Russia": 13.207,
    "Rwanda": 0.545,
    "Saint Kitts and Nevis": 7.332,
    "Saint Lucia": 4.143,
    "Saint Vincent and the Grenadines": 3.24,
    "Samoa": 3.728,
    "Sao Tome and Principe": 1.864,
    "Saudi Arabia": 20.184,
    "Senegal": 2.1,
    "Serbia": 8.358,
    "Seychelles": 7.472,
    "Sierra Leone": 1.174,
    "Singapore": 11.465,
    "Slovakia": 6.784,
    "Slovenia": 7.956,
    "Solomon Islands": 68.681,
    "Somalia": 2.66,
    "South Africa": 9.678,
    "South America": 7.164,
    "South Korea": 12.599,
    "South Sudan": 5.774,
    "Spain": 6.218,
    "Sri Lanka": 1.751,
    "Sudan": 2.939,
    "Suriname": 23.038,
    "Sweden": 2.909,
    "Switzerland": 5.161,
    "Syria": 2.412,
    "Tajikistan": 1.861,
    "Tanzania": 2.587,
    "Thailand": 6.131,
    "Togo": 1.057,
    "Tonga": 2.953,
    "Trinidad and Tobago": 18.731,
    "Tunisia": 3.138,
    "Turkey": 5.509,
    "Turkmenistan": 25.547,
    "Tuvalu": 2.731,
    "Uganda": 1.377,
    "Ukraine": 5.005,
    "United Arab Emirates": 26.439,
    "United Kingdom": 6.426,
    "United States": 17.262,
    "Upper-middle-income countries": 8.153,
    "Uruguay": 10.022,
    "Uzbekistan": 5.622,
    "Vanuatu": 2.858,
    "Venezuela": 10.341,
    "Vietnam": 4.574,
    "World": 6.408,
    "Yemen": 0.801,
    "Zambia": 4.97,
    "Zimbabwe": 7.682
  }
};

// Load world map data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(worldData) {
  // Filter out Antarctica
  worldData.features = worldData.features.filter(function(d) {
  return d.properties.name !== "Antarctica";
  });

  // Draw the map
  svg.append("g")
  .selectAll("path")
  .data(worldData.features)
  .enter().append("path")
  .attr("d", path)
  .style("fill", "#fff") // Relleno blanco
  .style("stroke", "#000") // Bordes negros
  .style("cursor", "pointer") // Cambiar el cursor a puntero
  .on("mouseover", function(d) {  // Evento de hover
    var countryName = normalizeCountryName(d.properties.name);
    var ghgPerCapita = ghgData["ghg_per_capita"][countryName];
    const texto = countryName + ": " + (ghgPerCapita ? ghgPerCapita + " Toneladas de gases de efecto invernadero per cápita" : "No data")
    TextToSpeech.play(texto)
  })
  .append("title")
  .text(function(d) {
    var countryName = normalizeCountryName(d.properties.name);
    var ghgPerCapita = ghgData["ghg_per_capita"][countryName];
    return countryName + ": " + (ghgPerCapita ? ghgPerCapita + " Toneladas de gases de efecto invernadero per cápita" : "No data");
  });
});

