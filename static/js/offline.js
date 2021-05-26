console.log("Working")

// var unitConvert = false

// function unit(u){
//     if (u == "Doesn't Make Sense Units"){
//         unitConvert = true
//     }
//     else {unitConvert = false}
// }

function compColor(comp){
    switch(comp){
        case "MPSxC":
            return 'olive';
        case "MPOxC":
            return 'brown';
        case "NPSxC":
            return 'orange';
        case 'NPOxC':
            return 'darkcyan';
        default:
            return 'black';
    }
}

const tp_au = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/tp_au.json";
const tp_ag = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/tp_ag.json";
const tp_nacn = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/tp_nacn.json";
const tp_lime = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/tp_lime.json";
const grind_size_au = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/grind_size_au.json";
const grind_size_ag = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/grind_size_ag.json";
const grind_size_nacn = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/grind_size_nacn.json";
const grind_size_lime = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/grind_size_lime.json";
const k_au_recovery = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/k_au_recovery.json";
const k_ag_recovery = "https://raw.githubusercontent.com/ChiefMetDing/MC/main/static/data/k_ag_recovery.json";

function tpBars(dataSet,chartID,title,ytitle){
    d3.json(dataSet).then((data)=>{
        let composites = Object.keys(data)
        let barData = []
        composites.forEach(comp => {
            let tps = Object.keys(data[comp])
            let val = Object.values(data[comp])
            let barTrace = {
                x: tps,
                y: val,
                type:"bar",
                marker:{
                    color:compColor(comp)
                },
                name: comp
            }
            barData.push(barTrace)
        })
        let barLayout = {
            title:title,
            yaxis:{
                title:ytitle
            }
        }
        Plotly.newPlot(chartID, barData, barLayout)
    });
}

tpBars(tp_au,"box-1","Au Recovery %","Recovery %")
tpBars(tp_ag,"box-2","Ag Recovery %","Recovery %")
tpBars(tp_nacn,"box-3","NaCN Consumption lb/st","Consumption lb/st")
tpBars(tp_lime,"box-4","Lime Consumption lb/st","Consumption lb/st")

function grindScatter(dataSet,chartID,title,ytitle){
d3.json(dataSet).then((data)=>{
    let composites = Object.keys(data)
        let scatterData = []
            composites.forEach(comp => {
            let p80 = Object.keys(data[comp])
            let val = Object.values(data[comp])
            let sizeRange = p80.slice(0,p80.length - 2)
            let valueRange = val.slice(0,p80.length - 2)
            let a = data[comp].a
            let b = data[comp].b
            let scatterTrace = {
                x: sizeRange,
                y: valueRange,
                type:"scatter",
                mode:"markers",
                marker: {
                    color: compColor(comp),
                    size: 5
                  },
                name: comp
            }
            let lineTrace = {
                x: sizeRange,
                y: sizeRange.map(x => a - Math.E**(b*x)),
                mode:"lines",
                line:{
                    dash:'dot',
                    color: compColor(comp)
                },
                name: comp
            }
            scatterData.push(scatterTrace,lineTrace)
        })
        let barLayout = {
            title:title,
            yaxis:{
                title:ytitle
            }
        }
        Plotly.newPlot(chartID, scatterData, barLayout)
    });}

grindScatter(grind_size_au,"scatter-1","Au Recovery %","Recovery %")
grindScatter(grind_size_ag,"scatter-2","Ag Recovery %","Recovery %")
grindScatter(grind_size_nacn,"scatter-3","NaCN Consumption kg/mt","Consumption kg/mt")
grindScatter(grind_size_lime,"scatter-4","Lime Consumption kg/mt","Consumption kg/mt")

function kPlot(selected){
    selected.forEach(select => {
        console.log(select)
        //kPlot(x)
        //})
    })
    d3.json(k_au_recovery).then((data)=>{
        let kData = [];
        selected.forEach(n => {
            let selectedData = data[n]
            let selectedDataValue = Object.values(selectedData)
            let yvalues = selectedDataValue.slice(selectedDataValue.length-12,selectedDataValue.length).filter(x => x != null)
            let xvalues = selectedDataValue.slice(selectedDataValue.length-24,selectedDataValue.length-12).filter(x => x != null)
            let kTrace = {
                x:xvalues,
                y:yvalues,
                mode:"lines",
                name: selectedDataValue[1]
            }
            kData.push(kTrace)
        })
        let kLayout = {
            title:"Au Leach Kinetics",
            yaxis:{
                title:"Recovery %"
            },
            xaxis:{
                title:"Time hours"
            }
        }
        Plotly.newPlot("kinetics-1", kData, kLayout)
    })
}


var testID = [];
function init(){
    var selector_1 = d3.select("#select-1");
    var selector_1_0 = d3.select("#select-1-0");
    d3.json(k_au_recovery).then((data)=>{
        //console.log(data);
        let compOptions = [];
        let sampleNames = Object.keys(data);
        sampleNames.forEach((n)=>{
            if (compOptions.includes(data[n]["Composite ID"]) == false){
                compOptions.push(data[n]["Composite ID"])
                selector_1_0
                    .append('option')
                    .text(data[n]["Composite ID"])
                    .property('value',n)
            }
            selector_1
                .append('option')
                .text(data[n]["Test ID"])
                .property('value',n);
            testID.push(data[n]["Test ID"])
        });
    })
}

var selected = []

function optionChanged_1(n){
    if (selected.includes(n) == false){
        selected.push(n)
    }
    // else {}
    return selected
}

function optionChanged_2(n){
    //console.log(n)
    let selected_items = d3.select("#selected_items")
    if (selected.includes(n) == false){
        selected.push(n)
        selected_items.append('li').text(testID[n])
    }
    // display updated array on html.
    
    // else {}
    //return selected
}

function kClick(){
    kPlot(selected)
    var selected_items = document.getElementById("selected_items")
    while (selected_items.hasChildNodes()) {  
        selected_items.removeChild(selected_items.firstChild);
    }
    selected = []
}

const inputs = {};

function inputValues(){
    var goldPrice = d3.select("#gold_price").property("value")
    if (goldPrice == ""){goldPrice = d3.select("#gold_price").property("placeholder")}
    var silverPrice = d3.select("#silver_price").property("value")
    if (silverPrice == ""){silverPrice = d3.select("#silver_price").property("placeholder")}
    var nacnPrice = d3.select("#nacn_price").property("value")
    if (nacnPrice == ""){nacnPrice = d3.select("#nacn_price").property("placeholder")}
    var limePrice = d3.select("#lime_price").property("value")
    if (limePrice == ""){limePrice = d3.select("#lime_price").property("placeholder")}
    var cementPrice = d3.select("#cement_price").property("value")
    if (cementPrice == ""){cementPrice = d3.select("#cement_price").property("placeholder")}
    var pbnPrice = d3.select("#pbn_price").property("value")
    if (pbnPrice == ""){pbnPrice = d3.select("#pbn_price").property("placeholder")}
    var mpsxTon = d3.select("#mpsx_ton").property("value")
    if (mpsxTon == ""){mpsxTon = d3.select("#mpsx_ton").property("placeholder")}
    var mpoxTon = d3.select("#mpox_ton").property("value")
    if (mpoxTon == ""){mpoxTon = d3.select("#mpox_ton").property("placeholder")}
    var npsxTon = d3.select("#npsx_ton").property("value")
    if (npsxTon == ""){npsxTon = d3.select("#npsx_ton").property("placeholder")}
    var npoxTon = d3.select("#npox_ton").property("value")
    if (npoxTon == ""){npoxTon = d3.select("#npox_ton").property("placeholder")}

    inputs['goldPrice']=goldPrice;
    inputs['silverPrice']=silverPrice;
    inputs['nacnPrice']=nacnPrice;
    inputs['limePrice']=limePrice;
    inputs['cementPrice']=cementPrice;
    inputs['pbnPrice']=pbnPrice;
    inputs['mpsxTon']=mpsxTon;
    inputs['mpoxTon']=mpoxTon;
    inputs['npsxTon']=npsxTon;
    inputs['npoxTon']=npoxTon;
}

function barClick(){
    inputValues()
    console.log(inputs)

}

function scatterClick(){}
init()
d3.selectAll("#kApply").on("click",kClick)
d3.selectAll('#barApply').on("click",barClick)
d3.selectAll('#scatterApply').on('click',scatterClick)
// d3.json("static/data/k_ag_recovery.json").then((data)=>{
//     console.log(data);
// });
// d3.json("static/data/k_nacn_consumption.json").then((data)=>{
//     console.log(data);
// });
// d3.json("static/data/k_lime_consumption.json").then((data)=>{
//     console.log(data);
// });