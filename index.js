const margin = { left: 120, right: 30, top: 60, bottom: 30 }

const width = document.querySelector("body").clientWidth,
    height = 500;

const svg = d3.select("svg").attr("viewBox", [0,0,width,height]);

const x_scale = d3.scaleTime().range([margin.left, width - margin.right]);
const y_scale = d3.scaleLinear().range([height - margin.bottom - margin.top, margin.top]);

const ticks = 10;
const x_axis = d3.axisBottom()
  .scale(x_scale)
  .tickPadding(10)
  .ticks(ticks)
  .tickSize(-height + margin.top * 2 + margin.bottom);
const y_axis = d3.axisLeft()
  .scale(y_scale)
  .tickPadding(5)
  .ticks(ticks, ".1")
  .tickSize(-width + margin.left + margin.right);

// Define decimalFormatter function
const decimalFormatter = d3.format(".2f"); // Adjust the format specifier as needed

// format our ticks to get accurate %
y_axis.tickFormat((d) => {
  if (!Number.isInteger(d)) {
    d = decimalFormatter(d);
  }
  return d + "%";
});

// labels
const x_label = "Time";
const y_label = "Rainfall Probability";
const location_name = "San Diego CA";

// add title
svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text(`${y_label} of ${location_name}`);
// add y label
svg
  .append("text")
  .attr("text-ancho", "middle")
  .attr(
    "transform",
    `translate(${margin.left - 70}, ${
      (height - margin.top - margin.bottom + 180) / 2
    }) rotate(-90)`
  )
  .style("font-size", "26px")
  .text(y_label);
// add x label
svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", height - margin.bottom - margin.top + 60)
  .attr("text-anchor", "middle")
  .style("font-size", "26px")
  .text(x_label);

// append x axis
svg
.append("g")
.attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
.call(x_axis);

// add y axis
svg
.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(y_axis);

const start_time = (d) => new Date(d.startTime);
const temperature = (d) => +d.values.precipitationProbability;
  
const line_generator = d3.line()
   .x((d) => x_scale(start_time(d)))
   .y((d) => y_scale(temperature(d)))
   .curve(d3.curveBasis);

const lat = 32.7157; // latitude of San Diego, CA
const long = 117.1611; // Longitude of San Diego, CA, USA

const api_key = "PwHvDomIqy2pwSOOt6fRe55Vj53jZ66a";

const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=snowAccumulation,precipitationProbability,precipitationType&timesteps=1h&units=imperial&apikey=${api_key}`;

d3.json(url).then(({ data }) => {
  const d = data.timelines[0].intervals;
  console.log(d)
  // set the domain 
  x_scale.domain(d3.extent(d, start_time)).nice(ticks);
  y_scale.domain(d3.extent(d, temperature)).nice(ticks);
  // add the line path
  svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 4)
    .attr("d", line_generator(d)); // generate the path
});