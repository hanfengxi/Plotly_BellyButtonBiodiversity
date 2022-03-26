function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var allSamples = data.samples;

    //Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = allSamples.filter(sampleObj => sampleObj.id === sample);

    // Create a variable that holds the first sample in the array.
    var firstSample = sampleResult[0];

    // Create a variable that holds the washing frequency.
    var washFreq = result.wfreq

 
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

// Create the trace for the gauge chart.
var gaugeData = [
  {
   domain: { x: [0, 1], y: [0, 1] },
   value:washFreq,
    title: { text: "Scrubs per Week" },
    type:"indicator",
    mode: "gauge+number",
    gauge: {
      bar:{color:'black'},
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lime" },
        { range: [8, 10], color: "darkgreen" }],
    },
}
    ];


//Create the layout for the gauge chart.
var gaugeLayout = { 
  title:"Belly Button Washing Frequency",
  width: 500, 
  height: 500, 
 
};

//Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  // Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0, 10).map(otuInt => "OTU" + otuInt.toString()).reverse()

    // Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text : otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"

    };

    var barData = [trace]
    // Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);




    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text : otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuID,
        colorscale: "Blackbody"
      }
    }]

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
      hovermode:"closet",

      
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}


  

    
 