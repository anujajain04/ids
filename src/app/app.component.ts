import { Component, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { SignalRHelper } from 'shared/helpers/SignalRHelper';
import { Router, NavigationEnd } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

    private viewContainerRef: ViewContainerRef;

    public constructor(private _router: Router,
        viewContainerRef: ViewContainerRef, private load: LoadingService
       ) {
      
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
    }


    ngOnInit() {
        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            var scrollToTop = window.setInterval(function () {
                var pos = window.pageYOffset;
                if (pos > 0) {
                    window.scrollTo(0,0); // how far to scroll on each step
                } else {
                    window.clearInterval(scrollToTop);
                }
            }, 16); // how fast to scroll (this equals roughly 60 fps)
        });
    }
 

    ngAfterViewInit(): void {
        
        App.init();
        App.initComponents();
        Layout.init();
    }
}

