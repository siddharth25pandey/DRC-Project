import React, { useState, useEffect, PureComponent } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

import proj4 from "proj4";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
import axios from 'axios';
import { MultiSelect } from "react-multi-select-component";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON,layer} from 'react-leaflet';
import {features} from '../data/data.json';
import './Map.css';

import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsReact from "highcharts-react-official";
require('highcharts-more')
require("highcharts/modules/exporting.js")(Highcharts);
require("highcharts/modules/export-data.js")(Highcharts);
const ReactHighcharts = require("react-highcharts");

HighchartsHeatmap(Highcharts);


const Dashboard = (props) => {
    if (typeof window !== "undefined") {
        window.proj4 = window.proj4 || proj4;
    }

    const [ mapCountry, setMapCountry] = useState();
    const [ selectedMapCountry, setSelectedMapCountry] = useState();
    const [ mapIndicator, setMapIndicator] = useState();
    const [ selectedMapIndicator, setSelectedMapIndicator] = useState();
    const [ selectedMapDate, setSelectedMapDate] = useState('2019-01-01');

    const [countryProjection, setCountryProjection] = useState();
    const [selectedCountryProjection, setSelectedCountryProjection] = useState();
    const [areaProjection, setAreaProjection] = useState();
    const [selectedAreaProjection, setSelectedAreaProjection] = useState();
    const [forecastData, setForecastData] = useState();
    const [projectionStartDate, setSelectedProjectionStartDate] = useState('2019-01-01');
    const [projectionEndDate, setSelectedProjectionEndDate] = useState('2021-10-01');
    const scenarioOptions = ['Scenario 1', 'Scenario 2']
    const [scenarioText, setScenarioText] = useState("scenario 1 example")

    const [comparison, setComparison] = useState(['2 Variables', 'Multiple Regions']);
    const [selectedComparison, setSelectedComparison] = useState('2 Variables');
    const [whatIfCountry, setWhatIfCountry] = useState();
    const [selectedWhatIfCountry, setSelectedWhatIfCountry] = useState();
    const [whatIfArea, setWhatIfArea] = useState();
    const [selectedWhatIfArea, setSelectedWhatIfArea] = useState();
    const [whatIfStartDate, setWhatIfStartDate] = useState('2019-01-01');
    const [whatIfEndDate, setWhatIfEndDate] = useState('2021-10-01');
    const [whatIfIndicator1, setWhatIfIndicator1] = useState();
    const [selectedWhatIfIndicator1, setSelectedWhatIfIndicator1] = useState();
    const [whatIfIndicator2, setWhatIfIndicator2] = useState();
    const [selectedWhatIfIndicator2, setSelectedWhatIfIndicator2] = useState();
    const [whatIfIndicatorData1, setWhatIfIndicatorData1] = useState();
    const [whatIfIndicatorData2, setWhatIfIndicatorData2] = useState();

    const [whatIfCountry2, setWhatIfCountry2] = useState([]);
    const [selectedWhatIfCountry2, setSelectedWhatIfCountry2] = useState([]);
    const [whatIfIndicatorMultiple, setWhatIfIndicatorMultiple] = useState();
    const [selectedWhatIfIndicatorMultiple, setSelectedWhatIfIndicatorMultiple] = useState();
    const [whatIfMultipleData, setWhatIfMultipleData] = useState();
    const [whatIfMultipleStartDate, setWhatIfMultipleStartDate] = useState('2019-01-01');
    const [whatIfMultipleEndDate, setWhatIfMultipleEndDate] = useState('2021-10-01');

    const [ correlationCountry, setCorrelationCountry ] = useState(['All']);
    const [ selectedCorrelationCountry, setSelectedCorrelationCountry ] = useState();
    const [ correlationCategories, setCorrelationCategories ] = useState([]);
    const [ selectedCorrelationCategories, setSelectedCorrelationCategories ] = useState([]);
    const [ correlationData, setCorrelationData] = useState([]);
    
    

    const [ insights, setInsights ] = useState();
    const insightColumns = [{ 
        Header: 'Date Created',  
        accessor: 'date_created' ,
        width: 200, 
    },{ 
        Header: 'Added By',  
        accessor: 'added_by' ,
        width: 100, 
    },{  
        Header: 'Description',  
        accessor: 'description'  ,
        width: 450,
    },{  
        Header: "Action",
        width: 100, 
        Cell: ({ original }) => (
            <div>
                <button  className='btn btn-primary'>
                    <a href={original.cover} download style={{color: 'white', textDecoration:'none'}}> 
                    Download</a>
                </button>
                
            </div>

          )
    }]

    useEffect(() => {
        axios.get('http://localhost:8000/dataset/api/v1/country')
        .then(res => {
            setMapCountry(res.data.result)
            setSelectedMapCountry(res.data.result[0])

            setCountryProjection(res.data.result)
            setSelectedCountryProjection(res.data.result[0])

            setWhatIfCountry(res.data.result)
            setSelectedWhatIfCountry(res.data.result[0])

            res.data.result.push('All')
            setCorrelationCountry(res.data.result)
            setSelectedCorrelationCountry('All')

            axios.get('http://localhost:8000/dataset/api/v1/region?country='+res.data.result[0])
            .then(res_1 => {
                setAreaProjection(res_1.data.result)
                setSelectedAreaProjection(res_1.data.result[0])

                setWhatIfArea(res_1.data.result)
                setSelectedWhatIfArea(res_1.data.result[0])

                axios.get('http://localhost:8000/dataset/api/v1/projection?region='+res_1.data.result[0]+"&start_date=2017-01-01&end_date=2021-09-01")
                .then(res => {
                    setForecastData(res.data.result)
                })

                axios.get('http://localhost:8000/dataset/api/v1/indicator')
                .then(res_2 => {
                    setMapIndicator(res_2.data.result)
                    setSelectedMapIndicator(res_2.data.result[0])
                    setWhatIfIndicator1(res_2.data.result)
                    setSelectedWhatIfIndicator1(res_2.data.result[0])
                    setWhatIfIndicator2(res_2.data.result)
                    setSelectedWhatIfIndicator2(res_2.data.result[1])

                    setWhatIfIndicatorMultiple(res_2.data.result)
                    setSelectedWhatIfIndicatorMultiple(res_2.data.result[0])

                    axios.get('http://localhost:8000/dataset/api/v1/country-stats?start_date=2021-01-01&variable='+res_2.data.result[0])
                    .then(res => {
                        let CountySelected = ''
                        let ValueSelected = ''
                        feature = features.map(feature=>{
                            CountySelected = feature['properties']['County']
                            ValueSelected = feature['properties']['Value']

                            if(Object.keys(res.data.result).includes(CountySelected)){
                                feature['properties']['Value'] = res.data.result[CountySelected]   
                            } else{
                                feature['properties']['Value'] = 0
                            }

                            return(feature);
                        })

                        setOnselect({
                            county:CountySelected,
                            value:ValueSelected,
                        });

                        style = (feature => {
                            return ({
                                fillColor: mapPolygonColorToDensity(feature.properties.Value),
                                weight: 1,
                                opacity: 1,
                                color: 'white',
                                dashArray: '2',
                                fillOpacity: 0.7
                            });
                        });

                        onEachFeature= (feature, layer)=> {
                            layer.on({
                                mouseover: highlightFeature,
                                mouseout: resetHighlight,
                            });
                        }
                    })

                    axios.get('http://localhost:8000/dataset/api/v1/what-if?country='+res.data.result[0]+'&area='+res_1.data.result[0]+'&start_date='+whatIfStartDate+'&end_date='+whatIfEndDate+'&variables='+res_2.data.result[0])
                    .then(res => {
                        setWhatIfIndicatorData1(res.data.result)
                    })

                    axios.get('http://localhost:8000/dataset/api/v1/what-if?country='+res.data.result[0]+'&area='+res_1.data.result[0]+'&start_date='+whatIfStartDate+'&end_date='+whatIfEndDate+'&variables='+res_2.data.result[1])
                    .then(res => {
                        setWhatIfIndicatorData2(res.data.result)
                    })
                })

                axios.get('http://localhost:8000/dataset/api/v1/indicator?multiple=1')
                .then(res_2 => {
                    setCorrelationCategories(res_2.data.result)
                    setSelectedCorrelationCategories(res_2.data.result)

                    const variables2 = []
        
                    for (const variable in res_2.data.result) {
                        variables2.push(res_2.data.result[variable]['value'])
                    }

                    axios.get('http://localhost:8000/dataset/api/v1/correlation?indicators='+variables2)
                    .then(res => {
                        setCorrelationData(res.data.result)
                    })
                })
            })

           

            
        })        

        axios.get('http://localhost:8000/dataset/api/v1/upload/all?data_type=3')
        .then(res => {
            setInsights(res.data.result)
        })

        axios.get('http://localhost:8000/dataset/api/v1/country?region=1')
        .then(res => {
            setWhatIfCountry2(res.data.result)
        })
        
    }, [])

    const onchangeMapIndicator = (event) => {
        setSelectedMapIndicator(event.value)
    }

    

    const [onselect, setOnselect] = useState({});

    const highlightFeature = (e=> {
        var layer = e.target;
        const { County, Value} = e.target.feature.properties;
        setOnselect({
            county:County,
            value:Value,
        });
        layer.setStyle({
            weight: 1,
            color: "black",
            fillOpacity: 1
        });
    });
    const resetHighlight= (e =>{
        setOnselect({});
        e.target.setStyle(style(e.target.feature));
    })

    let onEachFeature= (feature, layer)=> {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    let feature =features.map(feature=>{
        return(feature);
    })

    const mapPolygonColorToDensity=(density => {
        return density > 1000
            ? '#a50f15'
            : density > 700
            ? '#de2d26'
            : density > 500
            ? '#fb6a4a'
            : density > 250
            ? '#fc9272'
            : density > 100
            ? '#fcbba1'
            : '#fee5d9';
    })
    let style = (feature => {
        return ({
            fillColor: mapPolygonColorToDensity(feature.properties.Value),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '2',
            fillOpacity: 0.7
        });
    });
    const mapStyle = {
        height: '55vh',
        width: '100%',
        margin: '0 auto',
    }

    const searchMapIndicator = () => {
        axios.get('http://localhost:8000/dataset/api/v1/country-stats?start_date='+selectedMapDate+'&variable='+selectedMapIndicator)
        .then(res => {
            let CountySelected = ''
            let ValueSelected = ''
            feature = features.map(feature=>{
                CountySelected = feature['properties']['County']
                ValueSelected = feature['properties']['Value']

                if(Object.keys(res.data.result).includes(CountySelected)){
                    feature['properties']['Value'] = res.data.result[CountySelected]
                } else{
                    feature['properties']['Value'] = 0
                }

                return(feature)
            })

            setOnselect({
                county:CountySelected,
                value:ValueSelected,
            });

            style = (feature => {
                return ({
                    fillColor: mapPolygonColorToDensity(feature.properties.Value),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '2',
                    fillOpacity: 0.7
                });
            });

            onEachFeature= (feature, layer)=> {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                });
            }
        })
    }

    const selectedProjectionCountryOnChange = (event) => {
        setSelectedCountryProjection(event.value)

        axios.get('http://localhost:8000/dataset/api/v1/region?country='+event.value)
        .then(res => {
            setAreaProjection(res.data.result)
            setSelectedAreaProjection(res.data.result[0])
        })
        
    }

    const selectedProjectionAreaOnChange = (event) => {
        setSelectedCountryProjection(event.value)
    }

    const searchProjection = () => {
        axios.get('http://localhost:8000/dataset/api/v1/projection?region='+selectedAreaProjection+"&start_date="+projectionStartDate+"&end_date="+projectionEndDate)
        .then(res => {
            setForecastData(res.data.result)
        })
    }

    const config = {
        title: {
            text: selectedAreaProjection+", "+selectedCountryProjection+" Current Displacement and Projection Data"
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: '+projectionStartDate+" to "+projectionEndDate
            }
        },
    
        yAxis: {
            title: {
                text: null
            }
        },
    
        tooltip: {
            crosshairs: true,
            shared: true,
        },

        credits: {
            enabled: false
        },
    
        series: forecastData
    }

    const selectedScenarioOnChange = (event) => {
        if(event.value == 'Scenario 1'){
            setScenarioText("scenario 1 example")
        }else{
            setScenarioText("sample description testing again")
        }
    }

    const selectedProjectionStartDateOnChange = (event) => {
        setSelectedProjectionStartDate(event.format("YYYY-DD-MM"))
    }

    const selectedProjectionEndDateOnChange = (event) => {
        setSelectedProjectionEndDate(event.format("YYYY-DD-MM"))
    }

    const selectedComparisonOnChange = (event) => {
        setSelectedComparison(event.value)
    }

    const selectedWhatIfCountryOnChange = (event) => {
        setWhatIfCountry(event.value)

        axios.get('http://localhost:8000/dataset/api/v1/region?country='+event.value)
        .then(res => {
            setWhatIfArea(res.data.result)
            setSelectedWhatIfArea(res.data.result[0])
        })
    }

    const selectedWhatIfAreaOnChange = (event) => {
        setSelectedWhatIfArea(event.value)
    }

    const selectedWhatIfStartDateOnChange = (event) => {
        setWhatIfStartDate(event.format("YYYY-DD-MM"))
    }

    const selectedWhatIfEndDateOnChange = (event) => {
        setWhatIfEndDate(event.format("YYYY-DD-MM"))
    }

    const selectedWhatIfVariable1OnChange = (event) => {
        setSelectedWhatIfIndicator1(event.value)
    }

    const selectedWhatIfVariable2OnChange = (event) => {
        setSelectedWhatIfIndicator2(event.value)
    }

    const searchWhatIfScenario1 = (event) => {        
        axios.get('http://localhost:8000/dataset/api/v1/what-if?country='+selectedWhatIfCountry+'&area='+selectedWhatIfArea+'&start_date='+whatIfStartDate+'&end_date='+whatIfEndDate+'&variables='+selectedWhatIfIndicator1)
        .then(res => {
            setWhatIfIndicatorData1(res.data.result)
        })

        axios.get('http://localhost:8000/dataset/api/v1/what-if?country='+selectedWhatIfCountry+'&area='+selectedWhatIfArea+'&start_date='+whatIfStartDate+'&end_date='+whatIfEndDate+'&variables='+selectedWhatIfIndicator2)
        .then(res => {
            setWhatIfIndicatorData2(res.data.result)
        })
        
    }

    const whatIfConfig_A = {
        title: {
            text: selectedWhatIfArea+", "+selectedWhatIfCountry+" "+selectedWhatIfIndicator1+" Data"
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: '+whatIfStartDate+" to "+whatIfEndDate
            }
        },
    
        yAxis: {
            title: {
                text: null
            }
        },
    
        tooltip: {
            crosshairs: true,
            shared: true,
        },

        credits: {
            enabled: false
        },
    
        series: whatIfIndicatorData1,

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter: function () {
                    return this.value.charAt(0);
                  }
                }
              }
            }
          }]
        }
    }

    const whatIfConfig_B = {
        title: {
            text: selectedWhatIfArea+", "+selectedWhatIfCountry+" "+selectedWhatIfIndicator2+" Data"
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: '+whatIfStartDate+" to "+whatIfEndDate
            }
        },
    
        yAxis: {
            title: {
                text: null
            }
        },
    
        tooltip: {
            crosshairs: true,
            shared: true,
        },

        credits: {
            enabled: false
        },
    
        series: whatIfIndicatorData2,

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter: function () {
                    return this.value.charAt(0);
                  }
                }
              }
            }
          }]
        }
    }

    function getPointCategoryName(point, dimension) {
        var series = point.series,
          isY = dimension === 'y',
          axis = series[isY ? 'yAxis' : 'xAxis'];
        return axis.categories[point[isY ? 'y' : 'x']];
    }

    const charts2 = {

        chart: {
          type: 'heatmap',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
        },
      
      
        title: {
          text: 'Correlation'
        },
      
        xAxis: {
          categories: ['Area', 'Population', 'Number of internally displaced people', 'Fatalities from conflict', 'Civilian fatalities from conflict', 'Highest number of fatalities from a single event', 'Events with violence against civilians', 'Battles', 'Events involving military', 'Events involving islamists', 'Rolling sum of fatalities going back 1 year', 'Violent events per area of administrativ region', 'Population in food insecurity phases 3-5', 'Prevalence of underweight in children', 'Mortality rate among children under 5', 'Gini coefficient in income', '3 month mean of the vegetation health index']
        },
      
        yAxis: {
          categories: ['Area', 'Population', 'Number of internally displaced people', 'Fatalities from conflict', 'Civilian fatalities from conflict', 'Highest number of fatalities from a single event', 'Events with violence against civilians', 'Battles', 'Events involving military', 'Events involving islamists', 'Rolling sum of fatalities going back 1 year', 'Violent events per area of administrativ region', 'Population in food insecurity phases 3-5', 'Prevalence of underweight in children', 'Mortality rate among children under 5', 'Gini coefficient in income', '3 month mean of the vegetation health index'],
          title: null,
          reversed: true
        },
      
        accessibility: {
          point: {
            descriptionFormatter: function (point) {
              var ix = point.index + 1,
                xName = getPointCategoryName(point, 'x'),
                yName = getPointCategoryName(point, 'y'),
                val = point.value;
              return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
            }
          }
        },

        credits: {
            enabled: false
        },

        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
        },
      
        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
        },
      
        tooltip: {
          formatter: function () {
            return '<b>' + getPointCategoryName(this.point, 'x') + '</b> Correlation <br><b>' +
              this.point.value + '</b> on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
          }
        },
      
        series: [{
          name: 'Sales per employee',
          borderWidth: 1,
          data: correlationData,
          dataLabels: {
            enabled: true,
            color: '#000000'
          }
        }],
      
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter: function () {
                    return this.value.charAt(0);
                  }
                }
              }
            }
          }]
        }
      
      }

    const correlationCountryOnChange = (event) => { 
        setCorrelationCountry(event.value)
    }

    const selectedWhatIfMultipleOnChange = (event) => { 
        setSelectedWhatIfIndicatorMultiple(event.value)
    }

    const searchWhatIfMultiple = (event) => { 
        const variables = []
        
        for (const variable in selectedWhatIfCountry2) {
            variables.push(selectedWhatIfCountry2[variable]['value'])
        }

        axios.get('http://localhost:8000/dataset/api/v1/what-if-2?country='+variables+'&start_date='+whatIfMultipleStartDate+'&end_date='+whatIfMultipleEndDate+'&variables='+selectedWhatIfIndicatorMultiple)
        .then(res => {
            setWhatIfMultipleData(res.data.result)
        })
    }

    const whatIfConfig_C = {
        title: {
            text: selectedWhatIfIndicatorMultiple+" Data"
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                rangeDescription: 'Range: '+whatIfStartDate+" to "+whatIfEndDate
            }
        },
    
        yAxis: {
            title: {
                text: null
            }
        },
    
        tooltip: {
            crosshairs: true,
            shared: true,
        },

        credits: {
            enabled: false
        },
    
        series: whatIfMultipleData,

        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              yAxis: {
                labels: {
                  formatter: function () {
                    return this.value.charAt(0);
                  }
                }
              }
            }
          }]
        }
    }

    const onchangeSelectedMapDate  = (event) => {
        setSelectedMapDate(event.format("YYYY-MM-DD"))
    }

    const selectedWhatIfMutipleStartDate = (event) => {
        setWhatIfMultipleStartDate(event.format("YYYY-MM-DD"))
    }

    const selectedWhatIfMutipleEndDate = (event) => {
        setWhatIfMultipleEndDate(event.format("YYYY-MM-DD"))
    }

    const searchCorrelationData = (event) => {
        const variables2 = []
        
        for (const variable in selectedCorrelationCategories) {
            variables2.push(selectedCorrelationCategories[variable]['value'])
        }

        axios.get('http://localhost:8000/dataset/api/v1/correlation?region='+correlationCountry+'&indicators='+variables2)
        .then(res => {
            setCorrelationData(res.data.result)
        })
    }

    
    return (
        <div className='container-fluid'>
            <div className="row" style={{marginLeft:'.75%', marginRight:'.25%', marginTop:'3%', paddingTop:'1.5%', paddingBottom:'1.5%', 
            paddingLeft:'2%',  marginTop:'2%', backgroundColor:'#fdfefe'}} >
                <div className="col-3">
                    <label for="exampleInputEmail1" class="form-label">Date</label>
                    <Datetime value={selectedMapDate} onChange={onchangeSelectedMapDate}/>
                </div>
                <div className="col-4">
                    <label for="exampleInputEmail1" class="form-label">Indicator:</label>
                    <Dropdown options={mapIndicator} value={selectedMapIndicator} onChange={onchangeMapIndicator} placeholder="Select an option" />
                </div>
                <div className="col-4 pt-2">
                    <button type="button" className='btn btn-primary mt-4' onClick={() => searchMapIndicator()}>Plot</button>
                </div>
                 <div className="col-12 mt-4" id='overall-map-div'>
                    <div className="map" id="map-div">
                        <div className="hover">
                            {!onselect.county && (
                            <div className="census-info-hover">
                                <p>Hover on each region for more details</p>
                            </div>
                            )}
                            {onselect.county && (
                                <ul className="census-info">
                                    <li><strong>{onselect.county}</strong></li><br/>
                                    <li><strong><b>{selectedMapIndicator}</b>:{onselect.value}</strong></li><br/>
                                </ul>
                            )}
                        </div>
                        <MapContainer center={[11.6424, 2.1801]}
                        zoom={4} scrollWheelZoom={true} style={mapStyle}>
                            <TileLayer
                                attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
                                    url="http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                            />
                            {feature && (
                            <GeoJSON data={feature} 
                            style={style} 
                            onEachFeature={onEachFeature}/>
                            )}
                        </MapContainer>
                        
                        <div className="legend">
                            <div style={{ "--color": '#a50f15' }}>1000 and up</div>
                            <div style={{ "--color": '#de2d26' }}>700-9999</div>
                            <div style={{ "--color": '#fb6a4a' }}>400-699</div>
                            <div style={{ "--color": '#fc9272' }}>250-499</div>
                            <div style={{ "--color": '#fcbba1'}}>100-249</div>
                            <div style={{ "--color": '#fee5d9' }}>0-99</div>
                        </div>
                       
                    </div>
                </div>
            </div>


            <div className="row" style={{marginLeft:'.75%', marginRight:'.25%', marginTop:'3%', paddingTop:'1.5%', paddingBottom:'1.5%', 
            paddingLeft:'2%',  marginTop:'2%', backgroundColor:'#fdfefe'}} >
                <h4>Projection</h4>
                <hr/>
                
                <div className="row mt-2">
                    <div className="col-2">
                            <label for="exampleInputEmail1" class="form-label">Region:</label>
                            <Dropdown options={countryProjection} value={selectedCountryProjection} onChange={selectedProjectionCountryOnChange} placeholder="Select an option" />
                    </div>
                    <div className="col-3">
                            <label for="exampleInputEmail1" class="form-label">Area:</label>
                            <Dropdown options={areaProjection} value={selectedAreaProjection}  onChange={selectedProjectionAreaOnChange}  placeholder="Select an option" />
                    </div>
                    <div className="col-2">
                        <label for="exampleInputEmail1" class="form-label">Start Date</label>
                        <Datetime value={projectionStartDate}  onChange={selectedProjectionStartDateOnChange} />
                    </div>
                    <div className="col-2">
                        <label for="exampleInputEmail1" class="form-label">End Date</label>
                        <Datetime value={projectionEndDate}   onChange={selectedProjectionEndDateOnChange}/>
                    </div>
                    <div className="col-3 mt-2">
                        <button className='btn btn-primary mt-4 mb-4 mr-4' onClick={() => searchProjection()}>
                            Plot
                        </button>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-2">
                        <label for="exampleInputEmail1" class="form-label">Projection Scenario:</label>
                        <Dropdown options={scenarioOptions} value='Scenario 1' onChange={selectedScenarioOnChange} placeholder="Select an option" />
                        <textarea class="form-control mt-4" rows="5" value={scenarioText} disabled></textarea>
                    </div>
                    <div className="col-8" style={{backgroundColor:'#fdfefe'}}>
                        <ReactHighcharts config={config} />
                    </div>
                </div>  
            </div>

            <div className="row" style={{marginLeft:'.75%', marginRight:'.25%', marginTop:'3%', paddingTop:'1.5%', paddingBottom:'1.5%', 
            paddingLeft:'2%',  marginTop:'2%', backgroundColor:'#fdfefe'}} >
                <h3>What if Scenario</h3>
                <hr/>
                <div className="col-12 mt-4">
                    <div className="row">
                        <div className="col-3 mt-2">
                                <label for="exampleInputEmail1" class="form-label">Comparison:</label>
                                <Dropdown options={comparison} value="2 Variables" onChange={selectedComparisonOnChange} placeholder="Select an option" />
                        </div>
                    </div>
                    {(() => {
                        if (selectedComparison == '2 Variables') {
                            return (
                                <div>
                                    <div className="row mt-2">
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Region:</label>
                                            <Dropdown options={whatIfCountry} value={selectedWhatIfCountry} onChange={selectedWhatIfCountryOnChange} placeholder="Select an option" />
                                        </div>
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Area:</label>
                                            <Dropdown options={whatIfArea} value={selectedWhatIfArea}  onChange={selectedWhatIfAreaOnChange}  placeholder="Select an option" />
                                        </div>
                                        <div className="col-2">
                                            <label for="exampleInputEmail1" class="form-label">Start Date</label>
                                            <Datetime value={whatIfStartDate}  onChange={selectedWhatIfStartDateOnChange} />
                                        </div>
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">End Date</label>
                                            <Datetime value={whatIfEndDate}   onChange={selectedWhatIfMutipleEndDate}/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Indicator 1:</label>
                                            <Dropdown options={whatIfIndicator1} value={selectedWhatIfIndicator1} onChange={selectedWhatIfVariable1OnChange} placeholder="Select an option" />
                                        </div>

                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Indicator 2:</label>
                                            <Dropdown options={whatIfIndicator2} value={selectedWhatIfIndicator2} onChange={selectedWhatIfVariable2OnChange} placeholder="Select an option" />
                                        </div>

                                        <div className="col-2 mt-2">
                                            <button type="button" className='btn btn-primary mt-4' onClick={() => searchWhatIfScenario1()}>Plot</button>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 mt-2">
                                            <ReactHighcharts config={whatIfConfig_A} />
                                        </div>
                                        <div className="col-12 mt-2">
                                            <ReactHighcharts config={whatIfConfig_B} />
                                        </div>
                                    </div>
                                </div>
                            )
                        } else if (selectedComparison == 'Multiple Regions') {
                            return (
                                <div>
                                    <div className="row mt-2">
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Region/s</label>
                                            <MultiSelect
                                                    options={whatIfCountry2}
                                                    value={selectedWhatIfCountry2}
                                                    onChange={setSelectedWhatIfCountry2}
                                                    labelledBy="Select"
                                                />
                                        </div>
                                        <div className="col-2">
                                            <label for="exampleInputEmail1" class="form-label">Start Date</label>
                                            <Datetime value={whatIfMultipleStartDate}  onChange={selectedWhatIfMutipleStartDate} />
                                        </div>
                                        <div className="col-2">
                                            <label for="exampleInputEmail1" class="form-label">End Date</label>
                                            <Datetime value={whatIfMultipleEndDate}   onChange={selectedWhatIfMutipleEndDate}/>
                                        </div>
                                        <div className="col-3">
                                            <label for="exampleInputEmail1" class="form-label">Indicator 2:</label>
                                            <Dropdown options={whatIfIndicatorMultiple} value={selectedWhatIfIndicatorMultiple} onChange={selectedWhatIfMultipleOnChange} placeholder="Select an option" />
                                        </div>
                                        <div className="col-3 mt-2">
                                            <button className='btn btn-primary mt-4 mb-4 mr-4' onClick={() => searchWhatIfMultiple()}>
                                                Plot
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-12 mt-2">
                                            <ReactHighcharts config={whatIfConfig_C} />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>
            </div>
            <div className="row" style={{marginLeft:'.75%', marginRight:'.25%', marginTop:'3%', paddingTop:'1.5%', paddingBottom:'1.5%', 
            paddingLeft:'2%',  marginTop:'2%', backgroundColor:'#fdfefe'}} >
                <h3>Indicator Correlation</h3>
                <hr/>
                <div className="row mt-2">
                    <div className="col-4">
                    <label for="exampleInputEmail1" class="form-label">Country:</label>
                        <Dropdown options={correlationCountry} value={selectedCorrelationCountry} onChange={correlationCountryOnChange} placeholder="Select an option" />
                    </div>

                    <div className="col-4">
                        <label for="exampleInputEmail1" class="form-label">Indicators:</label>
                        <MultiSelect
                            options={correlationCategories}
                            value={selectedCorrelationCategories}
                            onChange={setSelectedCorrelationCategories}
                            labelledBy="Select"
                        />
                    </div>
                    <div className="col-3 mt-2">
                            <button className='btn btn-primary mt-4 mb-4 mr-4' onClick={() => searchCorrelationData()}>
                                Plot
                            </button>
                        </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <HighchartsReact highcharts={Highcharts} options={charts2} ></HighchartsReact>
                    </div>
                </div>
                
            </div>

            <div className="row" style={{marginLeft:'.75%', marginRight:'.25%', marginTop:'3%', paddingTop:'1.5%', paddingBottom:'1.5%', 
            paddingLeft:'2%',  marginTop:'2%', backgroundColor:'#fdfefe'}} >
                <h3>Insights</h3>
                <hr/>

                <div className="col-12">
                    <div style={{marginTop:'2%', backgroundColor: 'white'}}>  
                        <ReactTable  
                            data={insights}  
                            columns={insightColumns}  
                            defaultPageSize = {5}  
                            pageSizeOptions = {[2, 5, 10]}  
                        />  
                    </div>  
                </div>
            </div>
        </div>

        
    )
}

 export default Dashboard;  
