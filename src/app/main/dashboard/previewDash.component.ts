import { Component, Injector, Input, DoCheck } from '@angular/core';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig, CreateDashBoardDto, ChartWidgets, LocalFilter, LocalFiltersChart } from '@shared/service-proxies/ids-dashboard-service-proxies';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import {wordcloudComponent} from '@app/main/all-charts/word-chart';
import { ChartType, PieChartOptions, ChordChartOptions, WorldCloudOptions, ChordChart, Pie, Donut, AnalysisChart, AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
import * as Immutable from 'immutable';

@Component({
    templateUrl: './previewDash.component.html',
    animations: [appModuleAnimation()]
})
export class PreviewDashBoard {
    dashboard: CreateDashBoardDto;
    @Input() dashboardData: any;
    chartData: any[] = [];
    name1: number=0;
    key: any;
    isLoad: boolean = false;
    layname: any[] = [];
    dashtitle: any;
    tilesCount: number = 0;
    chartWidgetLocationArray: any=[];
    chartMetaDataArray: any=[];
    chartDataArray: any={};
    chartVisualizationType: string[] = [];
    localFilter: LocalFilter[] = [];
    localFiltersChart: LocalFiltersChart = new LocalFiltersChart();
    sampleChildData : string = '';
    dashboardKey : string;
    selectedChartName: any;
    wordData : any = [];

    constructor(private dashboardService: DashboardService, private config: DashboardStudioConfig, private _router: Router, private data: PassService, private load: LoadingService, route: ActivatedRoute) {
        debugger;
        this.key = route.snapshot.params['key'];
        this.dashboardKey = this.key;
        abp.ui.setBusy();
        this.dashboardService.viewDashboard(this.key).subscribe(result => {
            abp.ui.clearBusy();
            this.dashboard = result;
            if(this.config.createDashboard.dashboardType == "custom"){
                this.checkLayout(this.dashboard.layoutID);
            }
            else{
                let noOfCharts = this.dashboard.chartWidgets.length;
                if(noOfCharts<=2){this.checkLayout(7);}
                else if(noOfCharts > 2 && noOfCharts<=4){this.checkLayout(0);}
                else if(noOfCharts > 4 && noOfCharts <= 5){this.checkLayout(2);}
                else if(noOfCharts > 5 && noOfCharts <= 6){this.checkLayout(3);}
                else if(noOfCharts > 6 && noOfCharts <= 8){this.checkLayout(5);}
                else if(noOfCharts > 8 && noOfCharts <= 12){this.checkLayout(1);}
                else if(noOfCharts > 12 && noOfCharts <= 18){this.checkLayout(11);}
                else{
                    console.log("template not found");
                }
            }
            this.dashboard = result;           
            if(this.config.createDashboard.dashboardType == "custom"){
                this.checkLayout(this.dashboard.layoutID);
            }
            else{
                let noOfCharts = this.dashboard.chartWidgets.length;
                if(noOfCharts<=2){this.checkLayout(7);}
                else if(noOfCharts > 2 && noOfCharts<=4){this.checkLayout(0);}
                else if(noOfCharts > 4 && noOfCharts <= 5){this.checkLayout(2);}
                else if(noOfCharts > 5 && noOfCharts <= 6){this.checkLayout(3);}
                else if(noOfCharts > 6 && noOfCharts <= 8){this.checkLayout(5);}
                else if(noOfCharts > 8 && noOfCharts <= 12){this.checkLayout(1);}
                else if(noOfCharts > 12 && noOfCharts <= 18){this.checkLayout(11);}
                else{
                    console.log("template not found");
                }
            }
            this.name1 = this.config.createDashboard.layoutID;
            this.dashtitle = this.dashboard.entityName;
            for (let p of this.dashboard.chartWidgets) {
                this.layname.push(p.chartWidgetName);
            }
            this.isLoad = true;
            this.showChart();
        });
    }
    checkLayout(name: any) {
        if (name == 0) {
            this.tilesCount = 4;
        }
        else if (name == 1) {
            this.tilesCount = 12;
        }
        else if (name == 2) {
            this.tilesCount = 5;
        }
        else if (name == 3) {
            this.tilesCount = 6;
        }
        else if (name == 4) {
            this.tilesCount = 12;
        }
        else if (name == 5) {
            this.tilesCount = 8;
        }
        else if (name == 6) {
            this.tilesCount = 4;
        }
        else if (name == 7) {
            this.tilesCount = 2;
        }
        else if (name == 8) {
            this.tilesCount = 4;
        }
        else if (name == 9) {
            this.tilesCount = 4;
        }
        else if (name == 10) {
            this.tilesCount = 3;
        }
        else if (name == 11) {
            this.tilesCount = 18;
        }
        else if (name == 12) {
            this.tilesCount = 18;
        }
        else if (name == 13) {
            this.tilesCount = 18;
        }

    }
    showChart() {
        abp.ui.clearBusy();
        for(var i = 0; i < this.dashboard.chartWidgets.length; i++){
            if (this.dashboard.chartWidgets[i].chartSpecificOptions.chartVisualizationType == "Pie Chart") {
                this.chartVisualizationType[i] = "Pie Chart";
                //this.chartDataArray[i] = this.dashboard.chartWidgets[i].chartSpecificOptions;
               //this.chartDataArray[i] = this.dashboard.chartWidgets[i];
                //this.chartDataArray[i] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
                this.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
                this.chartMetaDataArray[i] =  this.dashboard.chartWidgets[i];
                if(this.config.createDashboard.dashboardType == "default"){
                    this.chartWidgetLocationArray[i] = (i+1);
                    this.dashboard.chartWidgets[i].chartWidgetLocation = i;
                }
                else{
                    this.chartWidgetLocationArray[i] = (this.dashboard.chartWidgets[i].chartWidgetLocation+1);
                }
            }
             else if(this.dashboard.chartWidgets[i].chartSpecificOptions.chartVisualizationType =="Donut Chart"){
               this.chartVisualizationType[i] = "Donut Chart";
               this.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
               this.chartMetaDataArray[i] =  this.dashboard.chartWidgets[i];
               if(this.config.createDashboard.dashboardType == "default"){
                   this.chartWidgetLocationArray[i] = (i+1);
                   this.dashboard.chartWidgets[i].chartWidgetLocation = i;
               }
               else{
                   this.chartWidgetLocationArray[i] = (this.dashboard.chartWidgets[i].chartWidgetLocation+1);
               }
             }
             else if(this.dashboard.chartWidgets[i].chartSpecificOptions.chartVisualizationType =="Word Cloud")
             {
               // debugger;
               this.chartVisualizationType[i] = "Word Cloud";
                this.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
                this.chartMetaDataArray[i] =  this.dashboard.chartWidgets[i];
                this.selectedChartName = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData[0]['word'] || '';
               if(this.config.createDashboard.dashboardType == "default"){
                   this.chartWidgetLocationArray[i] = (i+1);
                   this.dashboard.chartWidgets[i].chartWidgetLocation = i;
               }
               else{
                   this.chartWidgetLocationArray[i] = (this.dashboard.chartWidgets[i].chartWidgetLocation+1);
               }
             }
             else if(this.dashboard.chartWidgets[i].chartSpecificOptions.chartVisualizationType =="Chord Chart")
             {
               this.chartVisualizationType[i] = "Chord Chart";
               this.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
               this.chartMetaDataArray[i] =  this.dashboard.chartWidgets[i];
               if(this.config.createDashboard.dashboardType == "default"){
                   this.chartWidgetLocationArray[i] = (i+1);
                   this.dashboard.chartWidgets[i].chartWidgetLocation = i;
                }
                else{
                    this.chartWidgetLocationArray[i] = (this.dashboard.chartWidgets[i].chartWidgetLocation+1);
                }
             }
             else if(this.dashboard.chartWidgets[i].chartSpecificOptions.chartVisualizationType =="Bar Chart")
             {
               this.chartVisualizationType[i] = "Bar Chart";
               this.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = this.dashboard.chartWidgets[i].chartSpecificOptions.chartData;
               this.chartMetaDataArray[i] =  this.dashboard.chartWidgets[i];
               if(this.config.createDashboard.dashboardType == "default"){
                   this.chartWidgetLocationArray[i] = (i+1);
                   this.dashboard.chartWidgets[i].chartWidgetLocation = i;
                }
                else{
                    this.chartWidgetLocationArray[i] = (this.dashboard.chartWidgets[i].chartWidgetLocation+1);
                }
             }    
        }
    }
    goto() {
        alert("hi");
    }
    addLocalFilter(dim: string, operator: string, value: string, chartWidgetName: string){
        // debugger;
        let filter: any={};
        filter["dim"]=dim;
        filter["operator"]=operator;
        filter["value"]=value;
        this.localFilter[0]=(LocalFilter.fromJS(filter));
         // debugger;
        this.filterChart(chartWidgetName);
        }
    filterChart(chartWidgetName: string){
         // debugger;
        //abp.ui.clearBusy();
        debugger;
        this.localFiltersChart.localFilter = this.localFilter;
        this.localFiltersChart.dashboardKey = this.dashboardKey;
        var chartAssociationMatrix = this.dashboard.chartmatrix;
        debugger;
        for (var key in chartAssociationMatrix) {
            debugger
            var thisChartDimensions = chartAssociationMatrix[key];
            if(key == "confirmedDim"){
               console.log("this is confirm dim")
            }
            else{
                debugger
                for (let entry of thisChartDimensions) {
                    var dimHasValue = entry.indexOf(this.localFilter[0]["dim"]);
                    if(dimHasValue != -1){
                        this.localFiltersChart.chartWidgetName = key;
                        this.refreshChart(this.localFiltersChart);
                    }
                }
            }        
        }
    }
    refreshChart(localFilter: any){
        var that = this;
        this.dashboardService.filterLocal(localFilter).subscribe(result => {
                let data = result;
                debugger;
                //var newvar: any =  { name: 'micronyks'};
                //that.selectedChartName = Object.assign({}, newvar);
            //data.chartSpecificOptions.chartData = [{"size": "60","word": "no"},{"size": "70","word": "of"},{"size": "80","word": "on"}]
            //that.chartDataArray[this.dashboard.chartWidgets[0].chartWidgetName] = Object.assign([], data.chartSpecificOptions.chartData);
                for(var i = 0; i < that.dashboard.chartWidgets.length; i++){
                    if(that.dashboard.chartWidgets[i].chartWidgetName == data.chartWidgetName){
                        debugger;
                        that.chartDataArray[this.dashboard.chartWidgets[i].chartWidgetName] = data.chartSpecificOptions.chartData;//Object.assign([], chartData)//chartData;//data.chartSpecificOptions;
                        
                    }
                }
                
        });
        
    }
    public handleEvent(childData:any){
        debugger;
        this.addLocalFilter(childData.key, "=", childData.value, childData.chartWidgetName);
    }
    reset(){
        abp.ui.setBusy();
        this.dashboardService.viewDashboard(this.key).subscribe(result => {
            this.dashboard = result;
            this.showChart();
        });
    }
}
