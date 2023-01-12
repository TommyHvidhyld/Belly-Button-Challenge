// Use the D3 library to read in samples.json from the URL
const sample_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    let dropdown = d3.select("#selDataset");
    // Create dropdown
    d3.json(sample_url).then((data) =>{
        // create list of names
        let names = data.names
        names.forEach(element => {
            dropdown.append("option").text(element)
                .property("value", element);
            });
        const nameOne = names[0];
            charts(nameOne);
            meta(nameOne);
    });
};
// Call in data and create bar and bubble charts
function charts(name) {
    d3.json(sample_url).then((data) =>{
        let dataset = data.samples;
        let results = dataset.filter(object => object.id === name);
        let result = results[0];
        let ids = result.otu_ids;
        let labels = result.otu_labels;
        let values = result.sample_values;

        let bar = [{
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0, 10).reverse(),
            text:labels.slice(0,10).reverse(),
            type:"bar",
            orientation:"h"
        }];
        let barLayout = {
            margin: {t: 30, l: 150}
          };
        Plotly.newPlot("bar", bar, barLayout);

        let bubble = [{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                size: values
            }
        }];
        Plotly.newPlot("bubble", bubble);
    });
};
// Display the sample metadata, i.e., an individual's demographic information.
// Display each key-value pair from the metadata JSON object somewhere on the page.
function meta(name) {
    d3.json(sample_url).then((data) => {
        let meta = data.metadata;
        let results = meta.filter(element => element.id == name);
        let result = results[0];
        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
            }); 
        });
};
// Update all the plots when a new sample is selected
function optionChanged(newName) {
    charts(newName);
    meta(newName);
};

init();