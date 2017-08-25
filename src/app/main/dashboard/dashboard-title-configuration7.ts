import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from '@angular/http';
import { PostService } from './posts.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    templateUrl: './dashboard-title-configuration7.html',
    selector: 'dash-title-config7',
    animations: [appModuleAnimation()]

})

export class DashboardTitleConfiguration7 {

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

    save() {
        alert("hiii");
    }


}