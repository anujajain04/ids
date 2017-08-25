import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from '@angular/http';
import { PostService } from './posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartMapping, Dimension, Measures, DashboardService, DashboardDto, DeletedashboardDto, GSAnalysisChart, DashboardStudioConfig, GlobalFilters, ChartWidgets, ChartTypeListDto, ChartVariable , LocalFilter, LocalFiltersChart} from '@shared/service-proxies/ids-dashboard-service-proxies';
import { DatasetService, DatasetListDto, DatasetDto, SubDatasetDto, PassService } from '@shared/service-proxies/ids-service-proxies';
import { GSDatasetDto, WorldCloudChart, GettingStartedService, LoadingService, DatasetType, DatasetState, AnalysisDto, AnalysisTypeDto, AnalysisService } from '@shared/service-proxies/ids-service-proxies';

declare var $: any;
import * as D3 from 'd3';
import * as d3Scale from "d3-scale";
declare let d3: any;
import { TokenService } from '@abp/auth/token.service';
//declare var $: any;

@Component({
    templateUrl: './dashboard-title-configuration.html',
    selector: 'dash-title-config',
    animations: [appModuleAnimation()]

})

export class DashboardTitleConfiguration {
    @Input() name1: number;
    @Input() dashboardData: any;
    @Input() isViewFlag:boolean;
    finalChart: GSAnalysisChart;
    name2: string;
    key: any;
    tilesCount: number = 0;
    curernIndex: number;
    //label: any;
    label: any[] = [];//umesh
    img: any[];
    pane: ChartWidgets = new ChartWidgets();
    dataset: DatasetDto[] = [];
    subdataset: SubDatasetDto[] = [];
    datasetKey: string;
    subdatasetKey: string;
    GlobalFilter: GlobalFilters;
    imgSrc: string;
    chartTypeList: ChartTypeListDto[];
    chartVariableList: ChartVariable[];
    currentChartVariableList: any = [];//umesh
    mymapping: any[] = [];
    measuremappingthis: any[] = [];
    dimensionmappingthis: any[] = [];
    umeshmeasure1: Measures[] = [];
    umeshdimension1: Dimension[] = [];
    umeshmeasure: any = [];
    umeshdimension: any = [];
    subDatasetListForWidget: any[] = [];
    umeshChartMapping: ChartMapping;
    currentUmeshChartMapping: any = [];
    chartVisualizationType: string[] = [];
    chartDataArray: any={};
    chartMetaDataArray: any=[];
    pieChartData: any;
    wordCloudData: any;
    chartWidgetLocation: any;
    chartWidgetLocationArray: any=[];
    chartWidgetLocation1: any;
    localFilter: LocalFilter[] = [];
    localFiltersChart: LocalFiltersChart;
    dashboardKey: any;
    globalFilterOperatorList = [{ id: 1, name: "<" },
        { id: 2, name: "in" },
        { id: 3, name: "between" },
        { id: 4, name: "not in" }];
    globalFilterRuleList = [{ id: 1, name: "AND" },
        { id: 2, name: "OR" }];
    globalFilterDimensionList: any =[];
    aggregations = [
        { id: 1, name: "Count" },
        { id: 2, name: "Sum" },
        { id: 3, name: "Max" },
        { id: 4, name: "Min" },
        { id: 5, name: "Average" }
    ];
    dashboardTitle:string;
    isFullScreen:boolean=false;
    isEdit:boolean=true;
    //mappingthis: Array[][]=[];a: any = {};
    //this.mappingthis['measure']="ab";
    //this.mappingthis["dimension"]: any[] = [];
    
    constructor(private _router: Router, route: ActivatedRoute, private config: DashboardStudioConfig, private dataService: DatasetService, private dashService: DashboardService, private gService: GettingStartedService, private _session: TokenService, private pass: PassService) {
        debugger;
        this.name1 = route.snapshot.params['key'];
        this.dashboardTitle = route.snapshot.params['dashboardTitle'];
        this.dashboardData = route.snapshot.params;
        if(this.dashboardData["dashboardKey"] && this.pass.isUpdate == true){
            abp.ui.setBusy();
            this.dashboardKey = this.dashboardData["dashboardKey"];
            this.getDashboardDetails(this.dashboardData["dashboardKey"]);
            }else{
            this.pass.isUpdate == false;
        }
        this.GlobalFilter = new GlobalFilters;
        this.img = [];
        this.chartTypeList = [];
        this.config.createDashboard.globalFilter.push(this.GlobalFilter);
        //dashService.globalGSCharts = null;
        this.finalChart = null;
        // Layout Template Assignment

        if (this.name1 == 0) {
            this.tilesCount = 4;
        }
        else if (this.name1 == 1) {
            this.tilesCount = 12;
        }
        else if (this.name1 == 2) {
            this.tilesCount = 5;
        }
        else if (this.name1 == 3) {
            this.tilesCount = 6;
        }
        else if (this.name1 == 4) {
            this.tilesCount = 12;
        }
        else if (this.name1 == 5) {
            this.tilesCount = 8;
        }
        else if (this.name1 == 6) {
            this.tilesCount = 4;
        }
        else if (this.name1 == 7) {
            this.tilesCount = 2;
        }
        else if (this.name1 == 8) {
            this.tilesCount = 4;
        }
        else if (this.name1 == 9) {
            this.tilesCount = 4;
        }
        else if (this.name1 == 10) {
            this.tilesCount = 3;
        }
        else if (this.name1 == 11) {
            this.tilesCount = 18;
        }
        else if (this.name1 == 12) {
            this.tilesCount = 18;
        }
        else if (this.name1 == 13) {
            this.tilesCount = 18;
        }


        for (var i = 0; i < this.tilesCount; i++) {
            //this.config.createDashboard.chartWidgets.push(new ChartWidgets());
            //this.umeshmeasure.push(new Measures([]));
            //  this.umeshdimension.push(new Dimension([]));
            this.umeshmeasure.push(this.umeshmeasure1);
            this.umeshdimension.push(this.umeshdimension1);
            //this.currentChartVariableList.push(this.chartVariableList);
            //this.currentUmeshChartMapping.push(this.umeshChartMapping);
            this.currentChartVariableList[i]=this.chartVariableList;
            this.currentUmeshChartMapping[i]=this.umeshChartMapping;
        }
        //Add Dataset List to form
        this.getDatasetList();
    }
    name: string;
    getDashboardDetails(dashboardKey: any){
        var that = this;
        this.dashService.editDashboard(dashboardKey).subscribe(result => {
                    debugger;
                    abp.ui.clearBusy();
                    debugger;
                    let data = result;
                    let chartWidgetNow = data.chartWidgets;
                    /*for (var i = 0; i < chartWidgetNow.length; i++) {
                            this.config.createDashboard.chartWidgets.push(new ChartWidgets());
                        }*/
                    this.config.createDashboard = data;
                    for (var i = 0; i < chartWidgetNow.length; i++) {
                        debugger;
                        //chartWidgetNow[i].chartWidgetLocation = i;
                        that.umeshmeasure[chartWidgetNow[i].chartWidgetLocation] = chartWidgetNow[i].chartSpecificOptions.chartMapping.measures;
                        for(var k=0; k<chartWidgetNow[i].chartSpecificOptions.chartMapping.measures.length; k++){
                            that.mymapping[chartWidgetNow[i].chartSpecificOptions.chartMapping.measures[k].variableName + i] = chartWidgetNow[i].chartSpecificOptions.chartMapping.measures[k].mapping;
                        }
                        that.umeshdimension[chartWidgetNow[i].chartWidgetLocation] = chartWidgetNow[i].chartSpecificOptions.chartMapping.dimension;
                        for(var m=0; m<chartWidgetNow[i].chartSpecificOptions.chartMapping.dimension.length; m++){
                            that.mymapping[chartWidgetNow[i].chartSpecificOptions.chartMapping.dimension[m].variableName + i] = chartWidgetNow[i].chartSpecificOptions.chartMapping.dimension[m].mapping;
                        }
                        debugger;
                        var ChartVariableInput = { "chartType": chartWidgetNow[i].chartSpecificOptions.chartVisualizationType };
                        var idegetno = i;
                        debugger;
                        if (chartWidgetNow[i].chartSpecificOptions.chartVisualizationType == "Pie Chart") {
                            this.chartVisualizationType[i] = "Pie Chart";
                            this.pieChartData = chartWidgetNow[i].chartSpecificOptions;
                            //this.chartDataArray[i] = chartWidgetNow[i].chartSpecificOptions;
                            this.chartDataArray[chartWidgetNow[i].chartWidgetName] = chartWidgetNow[i].chartSpecificOptions.chartData;
                            this.chartMetaDataArray[i] = chartWidgetNow[i];
                            this.chartWidgetLocation = (chartWidgetNow[i].chartWidgetLocation+1)//(i+1);
                            this.chartWidgetLocationArray[i] = (chartWidgetNow[i].chartWidgetLocation+1);//(i+1);
        
                        }
                         else if(chartWidgetNow[i].chartSpecificOptions.chartVisualizationType =="Donut Chart"){
                            debugger;
                           this.chartVisualizationType[i] = "Donut Chart";
                           this.pieChartData = chartWidgetNow[i].chartSpecificOptions;
                           //this.chartDataArray[i] = chartWidgetNow[i].chartSpecificOptions;
                           this.chartDataArray[chartWidgetNow[i].chartWidgetName] = chartWidgetNow[i].chartSpecificOptions.chartData;
                           this.chartMetaDataArray[i] = chartWidgetNow[i];
                           this.chartWidgetLocation1 = (i+1);
                           this.chartWidgetLocationArray[i] = (chartWidgetNow[i].chartWidgetLocation+1);//(i+1);
                            debugger;
        
                         }
                         else if(chartWidgetNow[i].chartSpecificOptions.chartVisualizationType =="Word Cloud")
                         {
                            debugger;
                           this.chartVisualizationType[i] = "Word Cloud";
                           //this.wordCloudData = chartWidgetNow[i].chartSpecificOptions;
                           //this.chartDataArray[i] = chartWidgetNow[i].chartSpecificOptions; 
                           this.chartDataArray[chartWidgetNow[i].chartWidgetName] = chartWidgetNow[i].chartSpecificOptions.chartData;
                           this.chartMetaDataArray[i] = chartWidgetNow[i];
                           this.chartWidgetLocation = (i+1);
                           this.chartWidgetLocationArray[i] = (chartWidgetNow[i].chartWidgetLocation+1);//(i+1);
                            debugger;
                         }
                         else if(chartWidgetNow[i].chartSpecificOptions.chartVisualizationType =="Chord Chart")
                         {
                           this.chartVisualizationType[i] = "Chord Chart";
                           //this.pieChartData = chartWidgetNow[i].chartSpecificOptions;
                           //this.chartDataArray[i] = chartWidgetNow[i].chartSpecificOptions;
                           this.chartDataArray[chartWidgetNow[i].chartWidgetName] = chartWidgetNow[i].chartSpecificOptions.chartData;
                           this.chartMetaDataArray[i] = chartWidgetNow[i];
                           this.chartWidgetLocation = (i+1);
                            this.chartWidgetLocationArray[i] = (chartWidgetNow[i].chartWidgetLocation+1);//(i+1);
                         }
                         else if(chartWidgetNow[i].chartSpecificOptions.chartVisualizationType =="Bar Chart")
                         {
                           this.chartVisualizationType[i] = "Bar Chart";
                           this.pieChartData = chartWidgetNow[i].chartSpecificOptions;
                           //this.chartDataArray[i] = chartWidgetNow[i].chartSpecificOptions;
                           this.chartDataArray[chartWidgetNow[i].chartWidgetName] = chartWidgetNow[i].chartSpecificOptions.chartData;
                           this.chartMetaDataArray[i] = chartWidgetNow[i];
                           this.chartWidgetLocation = (i+1);
                            this.chartWidgetLocationArray[i] = (chartWidgetNow[i].chartWidgetLocation+1);//(i+1);
                         }
                        else { }
                        debugger;
                        if(chartWidgetNow[i].chartWidgetLocation==0){
                                    try {
                                            that.dashService.getChartVariableList(ChartVariableInput).subscribe(result => {
                                                debugger;
                                                that.currentChartVariableList[0] = result;
                                                //that.currentChartVariableList.push(result);
                                                //that.UpdateChartVariableList(result);
                                                debugger;
                                                });
                                            this.dataService.getDatasetFields(chartWidgetNow[0].chartSpecificOptions.subDatasetKey).subscribe(result => {
                                                //this.label = [];
                                                this.label[0] = result;
                                            });
                                        } catch (e) {
                                    debugger;
                                    console.error("init Error:" + e.message);
                                }
                            }
                    }
                    debugger;
                    console.log()
                });
                
        
    }
    
    addMapping(aaa: any, bbb: any, ccc: any) {
        debugger;
        if (bbb == "measure") {
            debugger;
            if (this.umeshmeasure[this.curernIndex].length >= 1) {
                let entry = true;
                for (var i in this.umeshmeasure[this.curernIndex]) {
                    if (this.umeshmeasure[this.curernIndex][i]["variableName"] == aaa) {
                        this.umeshmeasure[this.curernIndex][i]["mapping"] = ccc;
                        entry = false;
                    }
                }
                if(entry){
                    let a: any = { "mapping": ccc, "variableName": aaa, "aggregation": "None" };
                    this.umeshmeasure[this.curernIndex].push(a)
                }
                
            }
            else {
                let a: any = { "mapping": ccc, "variableName": aaa, "aggregation": "None" };
                this.umeshmeasure[this.curernIndex].push(a);
            }
        }
        else if (bbb == "dimension") {
            debugger;
            if (this.umeshdimension[this.curernIndex].length >= 1) {
                let entry = true;
                for (var i in this.umeshdimension[this.curernIndex]) {
                    if (this.umeshdimension[this.curernIndex][i]["variableName"] == aaa) {
                        this.umeshdimension[this.curernIndex][i]["mapping"] = ccc;
                        entry = false;
                    }
                }
                if(entry){
                    let a: any = { "mapping": ccc, "variableName": aaa };
                    try {
                        this.umeshdimension[this.curernIndex].push(a);
                    } catch (Exception) {
                        console.log(Exception);
                    }
                }
                let dimentry = true;
                for (var i in this.globalFilterDimensionList){
                    if(this.globalFilterDimensionList[i]["variableName"] == aaa){
                        this.globalFilterDimensionList[i]["mapping"] = ccc;
                        dimentry = false;
                    }
                }
                if(dimentry){
                    let a: any = { "mapping": ccc, "variableName": aaa };
                    this.globalFilterDimensionList.push(a);
                    }
            }
            else {
                let a: any = { "mapping": ccc, "variableName": aaa };
                this.umeshdimension[this.curernIndex].push(a);
                this.globalFilterDimensionList.push(a);
            }
            debugger;
        }
        console.log(this.measuremappingthis);
        console.log(this.dimensionmappingthis);
        debugger;
    }

    //Kanchan--------------------------------------------
    previewChart() {
        debugger;
        console.log(this.config.createDashboard.globalFilter);
        debugger;
        let abm: any = { "measures": this.umeshmeasure[this.curernIndex], "dimension": this.umeshdimension[this.curernIndex] };
        this.currentUmeshChartMapping[this.curernIndex] = abm;
        this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartMapping = this.currentUmeshChartMapping[this.curernIndex];//this.umeshChartMapping;
        debugger;
        this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartVariable  = this.currentChartVariableList[this.curernIndex]
        this.config.createDashboard.chartWidgets[this.curernIndex].dashboardLayoutID = this.name1;//
        this.config.createDashboard.chartWidgets[this.curernIndex].chartWidgetLocation = this.curernIndex;
        try {
            let newvar = this.config.createDashboard.chartWidgets[this.curernIndex];
            debugger;
            abp.ui.setBusy();
            this.dashService.previewChart(newvar).subscribe(result => {
                debugger;
                abp.ui.clearBusy();
                let data = result;
                let data1 = new GSAnalysisChart(data.chartSpecificOptions.chartData)

                if (data.chartSpecificOptions.chartVisualizationType == "Pie Chart") {
                    this.chartVisualizationType[this.curernIndex] = "Pie Chart";
                    this.pieChartData = data.chartSpecificOptions;
                    //this.chartDataArray[this.curernIndex] = data.chartSpecificOptions;
                    //this.chartDataArray[this.curernIndex] = data;
                    this.chartDataArray[data.chartWidgetName] = data.chartSpecificOptions.chartData;
                    this.chartMetaDataArray[this.curernIndex] = data;
                    this.chartWidgetLocation = (this.curernIndex + 1);
                    this.chartWidgetLocationArray[this.curernIndex] = (this.curernIndex + 1);

                }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Donut Chart"){
                   this.chartVisualizationType[this.curernIndex] = "Donut Chart";
                   this.pieChartData = data.chartSpecificOptions;
                    //this.chartDataArray[this.curernIndex] = data.chartSpecificOptions;
                   //this.chartDataArray[this.curernIndex] = data;
                    this.chartDataArray[data.chartWidgetName] = data.chartSpecificOptions.chartData;
                    this.chartMetaDataArray[this.curernIndex] = data;
                   this.chartWidgetLocation1 = (this.curernIndex + 1);
                    this.chartWidgetLocationArray[this.curernIndex] = (this.curernIndex + 1);

                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Word Cloud")
                 {
                    debugger;
                           this.chartVisualizationType[this.curernIndex] = "Word Cloud";
                           this.wordCloudData = data.chartSpecificOptions;
                        //this.chartDataArray[this.curernIndex] = data.chartSpecificOptions;
                        //this.chartDataArray[this.curernIndex] = data;
                           this.chartDataArray[data.chartWidgetName] = data.chartSpecificOptions.chartData;
                           this.chartMetaDataArray[this.curernIndex] = data;
                           this.chartWidgetLocation = (this.curernIndex + 1);//(data.chartWidgetLocation);
                    this.chartWidgetLocationArray[this.curernIndex] = (this.curernIndex + 1);
                           debugger;
                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Chord Chart")
                 {
                   this.chartVisualizationType[this.curernIndex] = "Chord Chart";
                   this.pieChartData = data.chartSpecificOptions;
                    //this.chartDataArray[this.curernIndex] = data.chartSpecificOptions;
                    this.chartDataArray[data.chartWidgetName] = data.chartSpecificOptions.chartData;
                    this.chartMetaDataArray[this.curernIndex] = data;
                   this.chartWidgetLocation = (this.curernIndex + 1);
                    this.chartWidgetLocationArray[this.curernIndex] = (this.curernIndex + 1);
                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Bar Chart")
                 {
                   this.chartVisualizationType[this.curernIndex] = "Bar Chart";
                   this.pieChartData = data.chartSpecificOptions;
                    //this.chartDataArray[this.curernIndex] = data.chartSpecificOptions;
                    this.chartDataArray[data.chartWidgetName] = data.chartSpecificOptions.chartData;
                    this.chartMetaDataArray[this.curernIndex] = data;
                   this.chartWidgetLocation = (this.curernIndex + 1);
                    this.chartWidgetLocationArray[this.curernIndex] = (this.curernIndex + 1);
                 }
                else { }
                // this.config.createDashboard.chartWidgets[this.curernIndex] = result;
            });
        } catch (Exception) {
            console.log(Exception);

        }
    }
    addLocalFilter(dim: string, operator: string,value: string){
        let filter: any;
        filter["dim"]=dim;
        filter["operator"]=operator;
        filter["value"]=value;
        this.localFilter.push(LocalFilter.fromJS(filter));
        }
    filterChart(chartWidgetName: string){
        abp.ui.clearBusy();
        this.localFiltersChart.localFilter = this.localFilter;
        this.localFiltersChart.dashboardKey = this.dashboardKey;
        this.localFiltersChart.chartWidgetName = chartWidgetName;
        this.dashService.filterLocal(this.localFiltersChart).subscribe(result => {
                debugger;
                abp.ui.clearBusy();
                let data = result;
        });
    }
    
    

    saveDashboard() {
        abp.ui.setBusy();
        debugger;
        console.log(this.config.createDashboard.globalFilter);
        debugger;
        let data1: any;
        this.config.createDashboard.layoutID = this.name1;
        debugger;
        let that = this;
        if(this.dashboardData["dashboardKey"] || this.pass.isUpdate == true){
            try{
                this.config.createDashboard.changeFlag = "true";
                let data2: any = this.config.createDashboard.toJS(data1);
                debugger;
                this.dashService.updateDashBoard(data2, this.dashboardData["dashboardKey"]).subscribe(dashbaordResult => {
                    //this.config.createDashboard.chartWidgets[this.curernIndex] = result;
                    debugger;
                    if (dashbaordResult.statusCode == 1){
                        abp.ui.clearBusy();
                        abp.notify.success(dashbaordResult.statusMessage);
                    } else {
                        abp.ui.clearBusy();
                        abp.notify.error(dashbaordResult.statusMessage);
                    }
                });
            } catch (Exception) {
                console.log(Exception);
                }
            
        }else{
            try{
                let data2: any = this.config.createDashboard.toJS(data1);
                this.dashService.createDashboard(data2).subscribe(dashbaordResult => {
                    //this.config.createDashboard.chartWidgets[this.curernIndex] = result;
                    debugger;
                    if (dashbaordResult.statusCode == 1) {
                        //that.dashboardData["dashboardKey"] = dashbaordResult.Dashboard.entityKey;
                        that.config.createDashboard.entityKey = dashbaordResult.Dashboard.entityKey;
                        that.pass.isUpdate = true;
                        abp.ui.clearBusy();
                        abp.notify.success(dashbaordResult.statusMessage);
                    } else {
                        abp.ui.clearBusy();
                        abp.notify.error(dashbaordResult.statusMessage);
                    }
                });
            } catch (Exception) {
                console.log(Exception);
                }
        }
        
    }


    //-------------------------------------------------------------

    // Full Screen --------------------------------------------------------------
    viewChartFullScreen() { 
     debugger;
        let abm: any = { "measures": this.umeshmeasure[this.curernIndex], "dimension": this.umeshdimension[this.curernIndex] };
        this.currentUmeshChartMapping[this.curernIndex] = abm;
        this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartMapping = this.currentUmeshChartMapping[this.curernIndex];//this.umeshChartMapping;
        this.config.createDashboard.chartWidgets[this.curernIndex].dashboardLayoutID = this.name1;//
        this.config.createDashboard.chartWidgets[this.curernIndex].chartWidgetLocation = this.curernIndex;
       
        
        try {
            let newvar = this.config.createDashboard.chartWidgets[this.curernIndex];
            debugger;
            abp.ui.setBusy();
            this.dashService.previewChart(newvar).subscribe(result => {
                debugger;
                abp.ui.clearBusy();
                let data = result;
                let data1 = new GSAnalysisChart(data.chartSpecificOptions.chartData)

                /*if (data.chartSpecificOptions.chartVisualizationType == "Pie Chart") {
                    this.chartVisualizationType = "Pie Chart";
                    this.pieChartData = data.chartSpecificOptions.chartData;
                    this.chartWidgetLocation = "_fullscreen";

                }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Donut Chart"){
                   this.chartVisualizationType = "Donut Chart";
                   this.pieChartData = data.chartSpecificOptions.chartData;
                   this.chartWidgetLocation = "_fullscreen";

                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Word Cloud")
                 {

                   this.chartVisualizationType = "Word Cloud";
                   this.pieChartData = data.chartSpecificOptions.chartData;
                  this.chartWidgetLocation = "_fullscreen";
                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Chord Chart")
                 {
                   this.chartVisualizationType = "Chord Chart";
                   this.pieChartData = data.chartSpecificOptions.chartData;
                   this.chartWidgetLocation = "_fullscreen";
                 }
                 else if(data.chartSpecificOptions.chartVisualizationType =="Bar Chart")
                 {
                   this.chartVisualizationType = "Bar Chart";
                   this.pieChartData = data.chartSpecificOptions.chartData;
                   this.chartWidgetLocation = "_fullscreen";
                 }
                else { }*/
                // this.config.createDashboard.chartWidgets[this.curernIndex] = result;
            });
        } catch (Exception) {
            console.log(Exception);

        }
    
    }
    
    gotoChartType() {
        this._router.navigate(['dash-title-config1']);
    }
    addFilter(event) {
        this.GlobalFilter = new GlobalFilters;
        this.config.createDashboard.globalFilter.push(this.GlobalFilter);
    }
    deleteFilter(id: any) {
        debugger
        this.config.createDashboard.globalFilter.splice(id, 1);
    }
    updateChartList(list: any) {
        debugger;
        this.chartTypeList = list;
    }

    UpdateChartVariableList(list: any) {

        this.currentChartVariableList[this.curernIndex] = list;

    }

    onclick(event, index: any) {
        debugger;
        if(!this.config.createDashboard.chartWidgets[index]){
                this.config.createDashboard.chartWidgets.push(new ChartWidgets());
                //this.config.createDashboard.chartWidgets.push[index] = new ChartWidgets();
            }
        this.config.createDashboard.chartWidgets[index].chartType = "custom";
        var that = this;
        //Step 1 : Get Chart Type List
        try {
            this.dashService.getChartTypeList().subscribe(result => {
                debugger;
                that.updateChartList(result)
            });
        } catch (e) {
            console.error("Chart Type List:" + e.message);
        }

        var totalDiv = event.target.parentElement.getElementsByClassName("ttlconfigdivlayout").length;
        for (var i = 0; i < totalDiv; i++) {
            event.target.parentElement.getElementsByClassName("ttlconfigdivlayout")[i].id = "draggable" + (i + 1);
            $("#draggable" + (i + 1)).draggable({ cursor: "move", cursorAt: { top: 6, left: 6 } });
        }
        
        //event.currentTarget.id = "sel";

        //this.curernIndex = index+1; 
        this.curernIndex = index;//umesh
        if (this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.datasetKey !== undefined) {
            this.getSubdataset();
        }
        if (this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartVisualizationType !== undefined) {
            this.getChartVariableList(this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartVisualizationType);
        }
        if (this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.subDatasetKey !== undefined) {
            this.getDatasetFields(this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.subDatasetKey);
        }
    }

    setChartVisualizationType(input: string) {
        debugger;
        this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.chartVisualizationType = input;
        debugger;
        this.getChartVariableList(input);
        //Step 2 : Get Chart Variable List
        /*var that = this;
        var ChartVariableInput = { "chartType": input };
        try {
            this.dashService.getChartVariableList(ChartVariableInput).subscribe(result => {
                debugger;
                that.UpdateChartVariableList(result);
            });
        } catch (e) {
            console.error("Chart Variable List Error:" + e.message);
        }*/

    }
    
    getChartVariableList(input: string){
        var that = this;
        var ChartVariableInput = { "chartType": input };
        try {
            this.dashService.getChartVariableList(ChartVariableInput).subscribe(result => {
                debugger;
                that.UpdateChartVariableList(result);
            });
        } catch (e) {
            console.error("Chart Variable List Error:" + e.message);
        }
        }


    onChange() {
        debugger;
        this.getSubdataset();
    }
    onChange1() {
        debugger;
        var subDatasetKey = this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.subDatasetKey;
        this.getDatasetFields(subDatasetKey);
        /*if (this.curernIndex !== undefined)
            this.subdataset.forEach((obj, index) => {
                if (this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.subDatasetKey == obj.entityKey) {
                    this.label = [];
                      this.label = obj.datasetFields;
                }
            });
      */
    }
    getDatasetFields(subDatasetKey: any) {
        debugger;
        try {
            this.dataService.getDatasetFields(subDatasetKey).subscribe(result => {
                //this.label = [];
                this.label[this.curernIndex] = result;
            });
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }
    getSubdataset() {
        abp.ui.setBusy();
        try {
            this.dataService.getSubDataset(this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.datasetKey).subscribe(result => {
                debugger;
                abp.ui.clearBusy();
                this.subdataset = result;
                this.subDatasetListForWidget[this.curernIndex] = this.subdataset;
                debugger;
                //this.onChange1();
                if (result.length > 0) {

                }

            });
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }
    getDatasetList() {
        debugger;
        try {
            this.dataService.getDatasetList().subscribe(result => {
                debugger;
                this.dataset = result;
                if (result.length > 0) {

                }
                if (this.curernIndex !== undefined)
                    if (this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.datasetKey != undefined && this.config.createDashboard.chartWidgets[this.curernIndex].chartSpecificOptions.datasetKey != "") {
                        this.getSubdataset();
                    }

            });
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }

    ngOnInit() {

        $(function () {
            // settings
            var minWidth = 15;
            var splitterWidth = 2;  // this should match the css value

            var splitter = $('.ui-resizable-e');
            var container = $('.wrap');
            var boxes = $('.resizable');

            var subBoxWidth = 0;
            $(".resizable:not(:last)").resizable({
                autoHide: false,
                handles: 'e',
                minWidth: minWidth,

                start: function (event, ui) {
                    // We will take/give width from/to the next element; leaving all other divs alone.
                    subBoxWidth = ui.element.width() + ui.element.next().width();
                    // set maximum width
                    ui.element.resizable({
                        maxWidth: subBoxWidth - splitterWidth - minWidth
                    });
                },

                resize: function (e, ui) {
                    var index = $('.wrap').index(ui.element);
                    ui.element.next().width(
                        subBoxWidth - ui.element.width()
                    );
                },

            });
        });
    }


    /*renderWordCloud(result_json:any,currentWidget:any){
      var width = 480;
      var height = 480;
      var radius = Math.min(width, height) / 2;

      var data = result_json.chartData.chartSpecificOptions.chartData ;
      var svg = d3.select("#draggable"+currentWidget),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = svg.append("svg").append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.measure; });

      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

      var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.label); });

      arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.label; });

    }*/

}
