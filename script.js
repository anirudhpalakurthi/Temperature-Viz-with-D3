// labels
const x_label = "Time";
const y_label = "Rainfall Probability";
const location_name = "San Diego, CA, United States";

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

const lat = 32.7157; // latitude of San Diego, CA
const long = 117.1611; // Longitude of San Diego, CA

const api_key = "PwHvDomIqy2pwSOOt6fRe55Vj53jZ66a";

const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=snowAccumulation,precipitationProbability,precipitationType&timesteps=1h&units=metric&apikey=${api_key}`;

d3.json(url).then(({ data }) => {
  const d = data.timelines[0].intervals;
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