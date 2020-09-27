// Create function for plots (Bar, Bubble, Gauge)
function dataPlot(id) {
  // read in data from the json file
  d3.json("samples.json").then((data)=> {
      //console.log(data)

      // Filter samples by id 
      var samples = data.samples.filter(samp => samp.id === id)[0];     
      //console.log(samples);

      // Get the top 10 sample values for id by slicing
      var samplevalues = samples.sample_values.slice(0, 10).reverse();
      //console.log(samplevalues)

      // get top 10 otu numbers for horizontal bar chart; reverse order 
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      //console.log(OTU_top)
      
      // concactanate otu for horizontal plot y-label
      var OTU_id = OTU_top.map(d => "OTU " + d)
      //console.log(`OTU IDS: ${OTU_id}`)

      // get the top 10 labels for the hovertext. reverse order
      var labels = samples.otu_labels.slice(0, 10).reverse();
      //console.log(labels)
      
      // The guage chart; TODO not dynamically changing
      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
        
      // create trace variable for the h plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: 'rgb'},
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var data = [trace];

      // create layout variable to set plots layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 150,
              t: 50,
          }
      };

      // Create the bar plot
      Plotly.newPlot("bar", data, layout);
    
      // Create bubble chart that displays each sample
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };

      // set the layout for the bubble plot
      var layout_b = {
          xaxis:{title: "OTU ID"},
          height: 800,
          width: 1000
      };

      // create data variable 
      var data1 = [trace1];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout_b); 

      // create Gauge
      var data_gauge = [

        {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseInt(wfreq),
          title: { text: "Belly Button Scrubs Per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 2], color: "lightgray" },
              { range: [2, 4], color: "gray" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "orange" },
              { range: [8, 9], color: "green" }

            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 490
            }
          }
        }
      ];

      var layout_g = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot("gauge", data_gauge, layout_g);
    });
}  

// create the function to fill in individuals demographic info (metadata) on table
function demogrInfo(id) {
  // read the json file to get data
  d3.json("samples.json").then((data)=> {
      
      // get the metadata info for the demographic panel
      var metadata = data.metadata;      
      //console.log(metadata)

      // filter meta data info by id
      var id_dinfo = metadata.filter(meta => meta.id.toString() === id)[0];
      console.log(id_dinfo)

      // select metadata panel to input data
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // iterate over the demographic data by id; append to the panel
      Object.entries(id_dinfo).forEach(([key, value]) => {
        demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}`);
      });
  
  });
}

// create the function for the change event
function optionChanged(id) {
  dataPlot(id);
  demogrInfo(id);
}

// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      //console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      dataPlot(data.names[0]);
      demogrInfo(data.names[0]);
  });
}

init();