console.log("Working")

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

const comminution = "static/data/comminution.json";
const tp_au = "static/data/tp_au.json";
const tp_ag = "static/data/tp_ag.json";
const tp_nacn = "static/data/tp_nacn.json";
const tp_lime = "static/data/tp_lime.json";
const grind_size_au = "static/data/grind_size_au.json";
const grind_size_ag = "static/data/grind_size_ag.json";
const grind_size_nacn = "static/data/grind_size_nacn.json";
const grind_size_lime = "static/data/grind_size_lime.json";
const k_au_recovery = "static/data/k_au_recovery.json";
const k_ag_recovery = "static/data/k_ag_recovery.json";
const tp_table = "static/data/test_procedures.json"
const tps = "static/data/tps.json"
const gs = "static/data/gs.json"
const compositeArray = []

function create_table(){
    d3.json(tp_table).then((data) => {
        let Data = Object.values(data)
        //console.log(newData)
        Data.forEach(x => delete x['index'])
        var tbody = d3.select("tbody")
        tbody.html("") //this is to clean up all in that tag
        Data.forEach((dataRow) => {
            let row = tbody.append("tr");
            Object.values(dataRow).forEach((val)=>{
                let cell = row.append('td');
                cell.text(val)
            })
            let lastCell = row.append('td')
            lastCell.text('ckbox')
        })
    })
}
function comPlot(){
    d3.json(comminution).then((data)=>{
        const RMWi = {}
        const BMWi = {}
        let comComps = Object.keys(data)
        comComps.forEach(c => {
            BMWi[c]=(data[c]["BMWi_kWh/st"])
            RMWi[c]=(data[c]["RMWi_kWh/st"])
        })
        let bTrace = {
            x:comComps,
            y:Object.values(BMWi),
            type:"bar",
            name:"BMWi"
        };
        let rTrace = {
            x:comComps,
            y:Object.values(RMWi),
            type:"bar",
            name:"RMWi"
        };
        barData = [bTrace,rTrace]
        let barLayout = {
            title:"Comminution Test Data",
            yaxis:{
                title:"Work Index (kWhr/st)"
            }
        }
        Plotly.newPlot('scatter-5',barData,barLayout) 
    })
}

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

tpBars(tp_au,"box-1","Au Recovery %","Recovery %")
tpBars(tp_ag,"box-2","Ag Recovery %","Recovery %")
tpBars(tp_nacn,"box-3","NaCN Consumption lb/st","Consumption lb/st")
tpBars(tp_lime,"box-4","Lime Consumption lb/st","Consumption lb/st")
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
    d3.json("static/data/k_au_recovery.json").then((data)=>{
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
    comPlot()
    var selector_1 = d3.select("#select-1");
    var selector_1_0 = d3.select("#select-1-0");
    create_table()
    inputValues()
    pvPlot()
    szPlot()
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
        selected_items.append('li').text(testID[n] + "/")
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
    var powerPrice = d3.select("#power_price").property("value")
    if (powerPrice == ""){powerPrice = d3.select("#power_price").property("placeholder")}
    
    var mpsxTon = d3.select("#mpsx_ton").property("value")
    if (mpsxTon == ""){mpsxTon = d3.select("#mpsx_ton").property("placeholder")}
    var mpoxTon = d3.select("#mpox_ton").property("value")
    if (mpoxTon == ""){mpoxTon = d3.select("#mpox_ton").property("placeholder")}
    var npsxTon = d3.select("#npsx_ton").property("value")
    if (npsxTon == ""){npsxTon = d3.select("#npsx_ton").property("placeholder")}
    var npoxTon = d3.select("#npox_ton").property("value")
    if (npoxTon == ""){npoxTon = d3.select("#npox_ton").property("placeholder")}

    var mpsxOz = d3.select("#mpsx_oz").property("value")
    if (mpsxOz == ""){mpsxOz = d3.select("#mpsx_oz").property("placeholder")}
    var mpoxOz = d3.select("#mpox_oz").property("value")
    if (mpoxOz == ""){mpoxOz = d3.select("#mpox_oz").property("placeholder")}
    var npsxOz = d3.select("#mpsx_oz").property("value")
    if (npsxOz == ""){npsxOz = d3.select("#npsx_oz").property("placeholder")}
    var npoxOz = d3.select("#npox_oz").property("value")
    if (npoxOz == ""){npoxOz = d3.select("#npox_oz").property("placeholder")}

    var mpsxSoz = d3.select("#mpsx_soz").property("value")
    if (mpsxSoz == ""){mpsxSoz = d3.select("#mpsx_soz").property("placeholder")}
    var mpoxSoz = d3.select("#mpox_soz").property("value")
    if (mpoxSoz == ""){mpoxSoz = d3.select("#mpox_soz").property("placeholder")}
    var npsxSoz = d3.select("#mpsx_soz").property("value")
    if (npsxSoz == ""){npsxSoz = d3.select("#npsx_soz").property("placeholder")}
    var npoxSoz = d3.select("#npox_soz").property("value")
    if (npoxSoz == ""){npoxSoz = d3.select("#npox_soz").property("placeholder")}
    
    inputs['Price'] = {}
    inputs['Price']['goldPrice']=goldPrice;
    inputs['Price']['silverPrice']=silverPrice;
    inputs['Price']['nacnPrice']=nacnPrice;
    inputs['Price']['limePrice']=limePrice;
    inputs['Price']['cementPrice']=cementPrice;
    inputs['Price']['pbnPrice']=pbnPrice;
    inputs['Price']['powerPrice']=powerPrice

    inputs['Ton']={}
    inputs['Ton']['MPSxC'] = mpsxTon
    inputs['Ton']['MPOxC'] = mpoxTon
    inputs['Ton']['NPSxC'] = npsxTon
    inputs['Ton']['NPOxC'] = npoxTon

    inputs['Oz']={}
    inputs['Oz']['MPSxC'] = mpsxOz
    inputs['Oz']['MPOxC'] = mpoxOz
    inputs['Oz']['NPSxC'] = npsxOz
    inputs['Oz']['NPOxC'] = npoxOz

    inputs['Soz']={}
    inputs['Soz']['MPSxC'] = mpsxSoz
    inputs['Soz']['MPOxC'] = mpoxSoz
    inputs['Soz']['NPSxC'] = npsxSoz
    inputs['Soz']['NPOxC'] = npoxSoz

}

function barClick(){
    inputValues()
    pvPlot()
    szPlot()
    //console.log(inputs)

}

function scatterClick(){}
let BMWi = init()
d3.selectAll("#kApply").on("click",kClick)
d3.selectAll('#barApply').on("click",barClick)
d3.selectAll('#scatterApply').on('click',barClick)

const disR = 0//set discount rate as 0 for now. This will be used as
// NPV = (total value/4)/[(1+disR)^t]

compositeArray.push('MPOxC','MPSxC','NPOxC')

firstThing = 'au'
secondThing = 'MPOxC'

function stringThing(firstThing,secondThing){
    let string = "('" + firstThing + "', '" + secondThing + "')";
    return string
}

const tpArray = []
function pvPlot(){
    
    d3.json(tps).then((data)=>{
        let valueArray = {}
        compositeArray.forEach(x => {       //this is for each composite
            valueArray[x]=[]
            let auRecoveries = Object.values(data[stringThing('au',x)])
            let agRecoveries = Object.values(data[stringThing('ag',x)])
            let nacnCons = Object.values(data[stringThing('nacn',x)])
            let limeCons = Object.values(data[stringThing('lime',x)])
            let cementCons = Object.values(data[stringThing('cement',x)])
            let pbnCons = Object.values(data[stringThing('pbn',x)])

            let procedures = Object.keys(data[stringThing('au',x)])
            //auRecoveries.forEach(r => console.log(r))
            procedures.forEach(p => {
                if (tpArray.includes(p) == false){
                tpArray.push(p)
            }})
            for (tp = 0; tp < procedures.length ; tp++){
                let Ozvalue = inputs['Oz'][x]*auRecoveries[tp]/100*inputs['Price']['goldPrice']
                let Sozvalue = inputs['Soz'][x]*agRecoveries[tp]/100*inputs['Price']['silverPrice']
                let nacnCost = inputs['Ton'][x]*1000000*nacnCons[tp]*inputs['Price']['nacnPrice']
                let limeCost = inputs['Ton'][x]*1000000*limeCons[tp]*inputs['Price']['limePrice']
                let cementCost = inputs['Ton'][x]*1000000*cementCons[tp]*inputs['Price']['cementPrice']
                let pbnCost = inputs['Ton'][x]*1000000*pbnCons[tp]*inputs['Price']['pbnPrice']
                
                //valueArray[x].push(Ozvalue + Sozvalue - nacnCost - limeCost)
                let totalValue = Ozvalue+Sozvalue-nacnCost-limeCost-cementCost-pbnCost
                valueArray[x].push(totalValue)
            }   
        //console.log(data[stringThing('au',x)])
        })
        let projectValue = {}
        for (tp = 0; tp < tpArray.length ; tp++){
            projectValue[tpArray[tp]] = 0
            compositeArray.forEach(cp => {
                projectValue[tpArray[tp]] += parseInt(valueArray[cp][tp])/1000000
            })
        }

        let tps = Object.keys(projectValue)
        let val = Object.values(projectValue)
        let barTrace = {
            x: tps,
            y: val,
            type:"bar",
            marker:{
                color:'rgb(260, 180, 0)'
            },
        }

        let barData = [barTrace]

        let barLayout = {
        title:"Test Procedure Value (million USD)",
        yaxis:{
            title:'million USD'
        }
        }
        Plotly.newPlot("box-5", barData, barLayout)

    })
}

function formulaCalc(array,size){
    let result = array[0]-Math.E**(array[1]*size)
    return result
}
function energyCalc(bmwi,size){
    let energy = 10*bmwi*(1/(size**0.5)-1/(19050**0.5))
    //console.log(energy)
    return energy
}

function szPlot(){  
    d3.json(gs).then((data)=>{
        let valueArray = {}
        compositeArray.forEach(x => {       //this is for each composite
            
            let auRecoveries = Object.values(data[stringThing('au',x)]).slice(5,7)
            let agRecoveries = Object.values(data[stringThing('ag',x)]).slice(5,7)
            let nacnCons = Object.values(data[stringThing('nacn',x)]).slice(5,7)
            let limeCons = Object.values(data[stringThing('lime',x)]).slice(5,7)
            let bmwi = Object.values(data[stringThing('comminution',x)])[7]
            let sizes = Object.keys(data[stringThing('au',x)]).slice(0,5)
            //console.log(sizes)
            valueArray[x]={}

            for (sz = 0; sz < sizes.length ; sz++){
                let Ozvalue = inputs['Oz'][x]*inputs['Price']['goldPrice']*formulaCalc(auRecoveries,sizes[sz])/100
                let Sozvalue = inputs['Soz'][x]*inputs['Price']['silverPrice']*formulaCalc(agRecoveries,sizes[sz])/100
                let nacnCost = inputs['Ton'][x]*1000000*inputs['Price']['nacnPrice']*formulaCalc(nacnCons,sizes[sz])
                let limeCost = inputs['Ton'][x]*1000000*inputs['Price']['limePrice']*formulaCalc(limeCons,sizes[sz])
                let grindCost = inputs['Ton'][x]*1000000*inputs['Price']['powerPrice']*energyCalc(bmwi,sizes[sz])
                //valueArray[x].push(Ozvalue + Sozvalue - nacnCost - limeCost)
                let totalValue = Ozvalue+Sozvalue-nacnCost-limeCost-grindCost
                valueArray[x][sizes[sz]]=(totalValue)
            }
            
        })
        console.log(valueArray)
        let projectValue = {}
        let sizes = Object.keys(Object.values(valueArray)[0])
        for (sz = 0; sz < sizes.length ; sz++){
            //console.log(sizes[sz])
            projectValue[sizes[sz]] = 0
            compositeArray.forEach(cp => {
                projectValue[sizes[sz]] += parseInt(valueArray[cp][sizes[sz]])/1000000
            })
        }
        console.log(projectValue)

        let val = Object.values(projectValue)
        
        let barTrace = {
            x: sizes.map(s => s + ' microns'),
            y: val,
            type:"bar",
            marker:{
                color:'rgb(260, 180, 0)'
            },
        }

        let barData = [barTrace]

        let barLayout = {
        title:"Test Procedure Value (million USD)",
        yaxis:{
            title:'million USD',
            range: [1050,1120]
        }
        }
        Plotly.newPlot("scatter-6", barData, barLayout)

    })
}
