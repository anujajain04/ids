import { Component, Input, OnInit, Directive, Injector, CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertModule } from 'ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { GSDatasetDto, GSAnalysisChart, AnalysisDto, TempBaseUrl, MappingDto, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies';
import * as D3 from 'd3/index';

//import * as c3 from 'c3/index';
declare var c3: any;
declare var d3: any;
declare var result: any;
declare var angular: any;
declare var vm: any;
//declare var chart:any;
@Component({
    moduleId: module.id,
    selector: 'chart-root',
    templateUrl: './chart.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./abc.css']
})

@Directive({
    selector: '[app-root]'
})
// class NgInit { 
//   @Input() ngInit;
//   ngOnInit() {
//     if(this.ngInit) { this.ngInit(); }
//   }
// }

@Injectable()
export class chartComponent extends AppComponentBase {
    @Input() gsDataset: GSDatasetDto;
    @Input() gsAnalysis: AnalysisDto;
    @Input() finalChart: GSAnalysisChart;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }


    ngOnInit() {
        debugger;
        //var c3=D3;
        var chart = c3.generate({
            bindto: '#donutChart',
            data: {
                columns: [
                    ['data1', 45],
                    ['data2', 25],
                    ['data3', 25],
                    ['data4', 5]
                ],
                type: 'donut',
            },
            donut: {
                title: "Demo Chart"
            },
            color: {
                pattern: ['#B7D245', '#9CC3AE', '#EBAE44', '#DE3645']
            }

        });

    }
}