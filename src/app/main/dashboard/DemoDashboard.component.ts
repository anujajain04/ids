import { Component, Injector, Input } from '@angular/core';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig, CreateDashBoardDto, ChartWidgets, LocalFilter, LocalFiltersChart } from '@shared/service-proxies/ids-dashboard-service-proxies';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartType, PieChartOptions, ChordChartOptions, WorldCloudOptions, ChordChart, Pie, Donut, AnalysisChart, AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';

@Component({
    templateUrl: './DemoDashboard.component.html',
     animations: [appModuleAnimation()]
   
})
export class DemoDashboard{
    @Input() dashboardData: any;
   dashboardKey:any;
   dashboardTitle:string;
   demoDashboardData:any[]=[];

    constructor(private dashboardService:DashboardService,private _router: Router, private data: PassService, private load: LoadingService, route: ActivatedRoute) {
        debugger;
     this.dashboardKey ="9b2841a1-a352-4f13-b8e2-48d8c5c9f638" //route.snapshot.params['key'];  
     this.dashboardTitle = "DemoDashboard title"
     this.getDashboardDetails(this.dashboardKey); 
        
    }

      getDashboardDetails(dashboardKey: any){
        debugger;
       var that = this;
       var demoDashboardDataJSON = {"DashboardDetails":{"entityType":"Dashboard","dashboardTitle":"Umesh Twitter Dataset2Dashboard","entityName":"Umesh Twitter Dataset2Dashboard","chartWidgets":[{"gridStackWidth":"","chartPositionTop":"","chartWidgetName":"Twitter Analysis111Chart","gridStackHeight":"","chartWidgetWidth":"","chartSpecificOptions":{"pieChartLabel":"Sentiment","pieChartLabelFontColour":"","pieChartTitle":"","datasetKey":"8b79d964-fe80-4150-8754-e78ac22a25c9","chartData":[{"measure":"12","label":"Negative"},{"measure":"59","label":"Neutral"}],"chartVisualizationType":"Pie Chart","subDatasetKey":"48550bb8-2a61-4478-a990-e7266bc950ba","pieChartLegendFlag":"","pieChartWidth":"","ChartVariable":[{"type":"dimension","variableName":"dimension"},{"type":"measure","variableName":"measure"}],"pieChartLabelFontType":"","AnalysisDatasetFlag":"","AnalysisKey":"","pieChartHeight":"","pieChartRadius":"","ChartMapping":{"measures":[{"mapping":"tweet","aggregation":"Count","variableName":"measure"}],"dimension":[{"legendRule":{"legendFlag":"","legendName":"","legendFont":"","rule":"","legendColour":""},"mapping":"Sentiment","variableName":"dimension"}]},"pieChartLabelFontSize":""},"chartWidgetTitle":"Twitter Analysis111Chart","chartPositionLeft":"","chartWidgetIdentifier":"","chartType":"default","chartWidgetHeight":""},{"gridStackWidth":"","chartPositionTop":"","chartWidgetName":"Umesh Twitter Frequency AnalysisChart","gridStackHeight":"","chartWidgetWidth":"","chartSpecificOptions":{"wordCloudChartLabelFontColour":"","wordCloudChartTitle":"","wordCloudChartLabelFontSize":"","datasetKey":"8b79d964-fe80-4150-8754-e78ac22a25c9","chartData":[{"word":"account","size":"40"},{"word":"data","size":"40"},{"word":"equiti","size":"40"},{"word":"gt","size":"40"},{"word":"india","size":"40"},{"word":"never","size":"40"},{"word":"thrgh","size":"40"},{"word":"worst","size":"40"},{"word":"yesbank","size":"40"},{"word":"atm","size":"40"},{"word":"creditcard","size":"40"},{"word":"fund","size":"40"},{"word":"hdfc","size":"40"},{"word":"hdfcbank","size":"40"},{"word":"iciciprulif","size":"40"},{"word":"ltd","size":"40"},{"word":"make","size":"40"},{"word":"outsid","size":"40"},{"word":"payment","size":"40"},{"word":"rbi","size":"40"},{"word":"sbi","size":"40"},{"word":"shame","size":"40"},{"word":"tell","size":"40"},{"word":"that","size":"40"},{"word":"advertis","size":"41"},{"word":"call","size":"41"},{"word":"care","size":"41"},{"word":"insur","size":"41"},{"word":"past","size":"41"},{"word":"pedestrian","size":"41"},{"word":"walk","size":"41"},{"word":"amex","size":"41"},{"word":"branch","size":"41"},{"word":"dscjpmile","size":"41"},{"word":"earn","size":"41"},{"word":"easiest","size":"41"},{"word":"jetairway","size":"41"},{"word":"jpmile","size":"41"},{"word":"upgrad","size":"41"},{"word":"use","size":"41"},{"word":"way","size":"41"},{"word":"custom","size":"42"},{"word":"digit","size":"42"},{"word":"flywithsid","size":"42"},{"word":"credit","size":"44"},{"word":"card","size":"45"},{"word":"icicibankcar","size":"50"},{"word":"icicibank","size":"51"},{"word":"bank","size":"59"},{"word":"icici","size":"90"}],"chartVisualizationType":"Word Cloud","subDatasetKey":"ec0a2ad4-5452-481d-a9de-d37e8ada36d0","ChartVariable":[{"type":"dimension","variableName":"text"},{"type":"measure","variableName":"size"},{"type":"measure","variableName":"colour"},{"type":"dimension","variableName":"text"},{"type":"measure","variableName":"measure"},{"type":"dimension","variableName":"xAxis"},{"type":"measure","variableName":"yAxis"}],"AnalysisDatasetFlag":"","AnalysisKey":"","wordCloudChartLabelFontType":"","ChartMapping":{"measures":[{"mapping":"Frequency","aggregation":"None","variableName":"size"}],"dimension":[{"legendRule":{"legendFlag":"","legendName":"","legendFont":"","rule":"","legendColour":""},"mapping":"Word","variableName":"text"}]},"wordCloudChartRotation":""},"chartWidgetTitle":"Umesh Twitter Frequency AnalysisChart","chartPositionLeft":"","chartWidgetIdentifier":"","chartType":"default","chartWidgetHeight":""}],"entityKey":"9b2841a1-a352-4f13-b8e2-48d8c5c9f638","chartAssociationMatrix":{"Umesh Twitter Frequency Analysis1Chart":["null","null","Word","null"],"Umesh Twitter Analysis SentimentChart":["null","null","null","Sentiment"],"Twitter Analysis cococ3Chart":["Text2","Text1","null","null"],"Umesh Twitter Frequency AnalysisChart":["null","null","Word","null"],"Twitter correlation By UmeshChart":["Text2","Text1","null","null"],"confirmedDim":["Text2","Text1","Word","Sentiment"],"Twitter Analysis111Chart":["null","null","null","Sentiment"],"Twitter Analysis cococ2Chart":["Text2","Text1","null","null"]},"entityDescription":"Default Dashboard For Umesh Twitter Dataset2","dashboardType":"default","parentKey":"6ab6344c-a5f0-4a70-864d-6d37c1d6d7b7"},"statusMessage":"Dashboard retrieved","statusCode":1} 
       this.dashboardTitle = demoDashboardDataJSON.DashboardDetails.dashboardTitle;
       this.demoDashboardData = demoDashboardDataJSON.DashboardDetails.chartWidgets;
      /* this.dashboardService.editDashboard(dashboardKey).subscribe(result => {
            
        debugger;
        
        
        });*/

    
    

     }

}