import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    AnalysisService, TaskDto, TaskType, PaneTreeDto, CreateAnalysisDto, TaskProperties, Variables, AnalysisResult, AnalysisRunLogDetails
} from '@shared/service-proxies/ids-analysis-service-proxies';
import { gojscontextComponent } from '../analysis/gojscontext.component';
import { TempBaseUrl, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { QuickTree, TaskModel, Writer, Reader, AnalysisStudioConfig, Task, Mapping } from '@shared/service-proxies/ids-analysis-service-proxies';
import { TokenService } from '@abp/auth/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { customDashboardParameters } from '@shared/service-proxies/ids-dashboard-service-proxies';
declare var $: any;
declare var go: any;
declare var diagramDivContext: any;
declare var nativeElement: any;
declare var d: any;

@Component({
    selector: 'configure-analysis-app',
    templateUrl: './create-analysis-studio.html',
    animations: [appModuleAnimation()]
})
export class CreateAnalysisComponent {
    private height: number;
    tree: PaneTreeDto[] = [];
    temp: any[] = [];// it keeps all dragged task objects
    key: string;
    chartAnalysis: CreateAnalysisDto;
    parentKey: string;
    isEdit: boolean = false;
    canRun: boolean = false;
    canAbort: boolean = false;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;

    constructor(private aService: AnalysisService, private _session: TokenService, private _route: Router,
        private _load: LoadingService, private config: AnalysisStudioConfig, private route: ActivatedRoute, private customDashConfig: customDashboardParameters) {
        debugger;
        AnalysisService.isAnalysisPage = true;
        try {
            if (this.config.finalAnalysis === undefined)
                this.config.finalAnalysis = new CreateAnalysisDto();
            this.key = route.snapshot.params['key'];
            this.config.datasetkeyForAnalysis = this.parentKey = route.snapshot.params['parent'];
            if (this.config.isEdit) {
                //this.editAnalysis();
                this.canRun = true;
                this.canAbort = false;
            } else {
                if (this.key !== "" && this.key !== undefined && this.key !== null) {
                    this.config.isEdit = true;
                    this.canRun = true;
                    this.canAbort = false;
                    // this.editAnalysis();
                }
            }
        } catch (e) {
            console.error("UpdateTask");
        }
        this.runString = "Run not started.";
    }
    TableAnalysis() {
        debugger;
        try {
            let a: string = "";
            let b: string = "";
            let tSdk: string = "";
            let tDsk: string = "";
            if (this.config.createResult.status_code === 1)
                a = this.config.createResult.detail.chartWidgetKey;
            if (this.config.isEdit)
                a = this.config.updateFinalAnalysis.chartWidgetKey;
            tSdk = this.config.updateFinalAnalysis.trgSubDatasetId;
            tDsk = this.config.updateFinalAnalysis.trgDatasetId;
            this.customDashConfig.trgSubDatasetKey = tSdk;
            this.customDashConfig.targetDatasetKey = tDsk;
            this.customDashConfig.analysisName = this.config.updateFinalAnalysis.entityName;
            this._route.navigate(['explore_dataset', tSdk]);
        } catch (e) {
            console.error(e.message);
        }
    }
    updateTaskType(value: any) {
        debugger;
        try {
            this.config.taskType = TaskType.BLANK;
            setTimeout(() => {
                if (value instanceof TaskDto) {
                    if (value.taskType == TaskType.CLEANSER)
                        this.config.currentCleanser = value;
                    else if (value.taskType == TaskType.SAMPLER)
                        this.config.currentSampler = value;
                    else if (value.taskType == TaskType.FUNCTION)
                        this.config.currentFunction = value;
                    this.config.taskType = value.taskType;
                }
                else if (value instanceof TaskModel) {
                    this.config.currentModel = value;
                    this.config.taskType = TaskType.MODEL;
                }
                else if (value instanceof Writer) {
                    this.config.currentWriter = value;
                    this.config.taskType = TaskType.WRITER;
                }
                else if (value instanceof Reader) {
                    this.config.currentReader = value;
                    this.config.taskType = TaskType.READER;
                }
            }, 1);
        } catch (e) {
            console.error("UpdateTask");
        }
    }
    search(id: any): any {
        try {
            //Object.assign(Object.create(p),p) will create new fresh copy of an object i.e it get clone of an object
            if (this.tree.length > 0)
                for (let s of this.tree)
                    for (let p of s.taskData)
                        if (p instanceof TaskDto) {
                            if (id === p.entityKey)
                                return Object.assign(Object.create(p), p);//.taskDisplayName;
                        } else if (p instanceof TaskModel) {
                            if (id === p.entityKey)
                                return Object.assign(Object.create(p), p);//.entityName;
                        } else if (p instanceof Writer) {
                            if (id === p.entityKey)
                                return Object.assign(Object.create(p), p);
                            if (p.subDatasets.length > 0)
                                for (let x of p.subDatasets) {
                                    if (id === x.entityKey) {
                                        let r: Writer = p;
                                        r.subDatasets = [];
                                        r.subDatasets.push(x);
                                        return Object.assign(Object.create(r), r);//.entityName;
                                    }
                                }
                        } else if (p instanceof Reader) {
                            for (let x of p.subDatasets) {
                                if (id === x.entityKey) {
                                    let r: Reader = p;
                                    r.subDatasets = [];
                                    r.subDatasets.push(x);
                                    return Object.assign(Object.create(r), r);//entityName;
                                }
                            }
                        }
        } catch (e) {
            console.error(e.message);
        }
        return null;
    }
    getType(p: any): string {
        try {
            if (p instanceof TaskDto) {
                if (p.taskType === TaskType.CLEANSER)
                    return "Cleanser";//.taskDisplayName;
                if (p.taskType === TaskType.SAMPLER)
                    return "Sampler";
                if (p.taskType === TaskType.FUNCTION)
                    return "Function";
            } else if (p instanceof TaskModel)
                return "Model";//.entityName;
            else if (p instanceof Writer)
                return "Writer";
            else if (p instanceof Reader)
                return "Reader";
        } catch (e) {
            console.error(e.message);
        }
        return null;
    }
    getElement(id: any): any {
        try {
            if (this.config.taskElements.length > 0) {
                for (let p of this.config.taskElements) {
                    if (p instanceof TaskDto) {
                        if (id === p.compare)
                            return p;//.taskDisplayName;
                    } else if (p instanceof TaskModel) {
                        if (id === p.compare)
                            return p;//.entityName;
                    } else if (p instanceof Writer) {
                        if (id === p.compare)
                            return p;
                        if (p.subDatasets.length > 0)
                            for (let x of p.subDatasets) {
                                if (id === x.compare) {
                                    let r: Writer = p;
                                    r.subDatasets = [];
                                    r.subDatasets.push(x);
                                    return r;//.entityName;
                                }
                            }
                    } else if (p instanceof Reader) {
                        if (id === p.compare)
                            return p;
                        if (p.subDatasets.length > 0)
                            for (let x of p.subDatasets) {
                                if (id === x.compare) {
                                    let r: Reader = p;
                                    r.subDatasets = [];
                                    r.subDatasets.push(x);
                                    return r;//.entityName;
                                }
                            }
                    }
                }
            }
        } catch (e) {
            console.error(e.message);
        }
        return null
    }
    getPos(id: any): number {
        try {
            let index: number = 0;
            if (id === "TemplateTableWriter" || id === "TemplateFileWriter")
                for (let x of this.config.taskElements) {
                    if (x instanceof Writer)
                        return index;
                    index++;
                }
            index = 0;
            for (let p of this.config.taskElements) {
                if (p instanceof TaskDto) {
                    if (id === p.compare)
                        return index;//.taskDisplayName;
                } else if (p instanceof TaskModel) {
                    if (id === p.compare)
                        return index;//.entityName;
                } else if (p instanceof Writer) {
                    if (id === p.compare)
                        return index;
                    if (p.subDatasets.length > 0)
                        for (let x of p.subDatasets) {
                            if (id === x.compare) {

                                return index;//.entityName;
                            }
                        }
                } else if (p instanceof Reader) {
                    for (let x of p.subDatasets) {
                        if (id === x.compare) {

                            return index;//.entityName;
                        }
                    }
                }
                ++index;
            }
        } catch (e) {
            console.error(e.message);
        }
        return -1;
    }
    ngOnInit() {
        try {
            this.getSide();
        } catch (e) {
            console.error(e.message);
        }
        this.height = window.innerHeight;

        $(function () {
            // settings
            var minWidth = 50;
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
    ChartAnalysis() {
        debugger;
        try {
            let a: string = "";
            let b: string = "";
            if (this.config.createResult.status_code === 1)
                a = this.config.createResult.detail.chartWidgetKey;
            //   b = this.config.createResult.detail.dashboardKey;
            if (this.config.isEdit)
                a = this.config.updateFinalAnalysis.chartWidgetKey;
            /// b = this.config.createResult.detail.dashboardKey;
            this._route.navigate(['chart-result', a]);
        } catch (e) {
            console.error(e.message);
        }
    }
    findPath = key => {
        debugger
        if (this.myDiagramContext.findNodeForKey(key).data.type === "Dataset")
            return "assets/img/img/Reader task 72x-8.PNG";
        else if (this.myDiagramContext.findNodeForKey(key).data.type === "Sampler")
            return "assets/img/img/Sampler 72x-8.PNG";
        else if (this.myDiagramContext.findNodeForKey(key).data.type === "Cleanser")
            return "assets/img/img/cleanser 72x-8.PNG";
        else if (this.myDiagramContext.findNodeForKey(key).data.type === "Function")
            return "assets/img/img/Function 72x-8.PNG";
        else if (this.myDiagramContext.findNodeForKey(key).data.type === "Model")
            return "assets/img/img/Model 72x-8.PNG";
        else return "assets/img/img/Writer 72x-8.PNG";
    };
    getSide() {
        try {
            const _content = JSON.stringify({
                datasetKey: this.config.datasetkeyForAnalysis
            });
            abp.ui.setBusy();
            this.aService.getSidePane1(_content).subscribe(res => {
                //get side pane list
                abp.ui.clearBusy();
                let cl: TaskDto[] = [];
                let fun: TaskDto[] = [];
                let sam: TaskDto[] = [];
                let tas: TaskModel[] = [];
                let war: Writer[] = [];
                let red: Reader[] = [];
                //filter and separate all kinds of tasks
                for (let r of res) {
                    if (r instanceof TaskDto) {
                        if (r.taskType === TaskType.CLEANSER)
                            cl.push(r);
                        else if (r.taskType === TaskType.FUNCTION)
                            fun.push(r);
                        else if (r.taskType === TaskType.SAMPLER)
                            sam.push(r);
                    } else if (r instanceof TaskModel)
                        tas.push(r);
                    else if (r instanceof Writer)
                        war.push(r);
                    else if (r instanceof Reader)
                        red.push(r);
                }
                this.tree.push(new PaneTreeDto("Reader", red));
                this.tree.push(new PaneTreeDto("Sampler", sam));
                this.tree.push(new PaneTreeDto("Cleanser", cl));
                this.tree.push(new PaneTreeDto("Function", fun));
                this.tree.push(new PaneTreeDto("Models", tas));
                this.tree.push(new PaneTreeDto("Writer", war));
                //create a json required for right pane
                let d: any = [];
                for (let t of this.tree) {
                    if (t.title == "Reader") {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Reader dataset 16x17.svg"));
                    }
                    else if (t.title == "Cleanser") {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Cleanser_1.svg"));
                    }
                    else if (t.title == "Sampler") {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Sampler_1.svg"));
                    }
                    else if (t.title == "Function") {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Function_1.svg"));
                    }
                    else if (t.title == "Models") {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Model2.svg"));
                    }
                    else {
                        d.push(new QuickTree(t.title, "#", t.title, "assets/img/img/Writer_1.svg"));
                    }
                    for (let t1 of t.taskData) {
                        if (t1 instanceof TaskDto) {
                            let str: string = "";
                            if (t1.taskType === TaskType.CLEANSER)
                                str = "assets/img/img/Cleanser_1.svg";
                            else if (t1.taskType === TaskType.SAMPLER)
                                str = "assets/img/img/Sampler_1.svg";
                            else if (t1.taskType === TaskType.FUNCTION)
                                str = "assets/img/img/Function_1.svg";
                            d.push(new QuickTree(t1.entityKey, t.title, t1.entityName, str));
                        }
                        else if (t1 instanceof TaskModel)
                            d.push(new QuickTree(t1.entityKey, t.title, t1.entityName, "assets/img/img/Model2.svg"));
                        else if (t1 instanceof Writer) {
                            d.push(new QuickTree(t1.entityKey, t.title, t1.entityName, "assets/img/img/Writer_1.svg"));
                            if (t1.subDatasets.length > 0)
                                for (let t2 of t1.subDatasets)
                                    d.push(new QuickTree(t2.entityKey, t1.entityKey, t2.entityName, "assets/img/img/Writer_1.svg"));
                        }
                        else if (t1 instanceof Reader) {
                            d.push(new QuickTree(t1.entityKey, t.title, t1.entityName, "assets/img/img/Reader dataset 16x17.svg"));
                            for (let t2 of t1.subDatasets)
                                d.push(new QuickTree(t2.entityKey, t1.entityKey, t2.entityName, "assets/img/img/Reader dataset 16x17.svg"));
                        }
                    }
                }
                //  this.generateLeftSidePane(d, myDiagramContext);
                this.ViewInit(d);
                if (this.config.isEdit) {
                    this.editAnalysis();
                }
                //else {
                //    if (this.key !== "" && this.key !== undefined && this.key !== null) {
                //        this.config.isEdit = true;
                //        this.editAnalysis();
                //    }
                //}
                //if (this.config.isEdit)
                //this.fillStudio();
            });
        } catch (e) {
            console.error("UpdateTask");
        }
    }
    myDiagramContext: any;
    ViewInit(d: any) {
        $('#jstree').jstree({
            "core": {
                "data": d
            },
            // "plugins": ["dnd"]
        });
        $('#custom_image_content').hide();
        // create a make type from go namespace and assign it to MAKE
        const MAKE = go.GraphObject.make;
        // get the div in the HTML file
        const diagramDivContext = window.document.getElementById("myDiagramDivContext");
        //instantiate MAKE with Diagram type and the mydiagramDivContext
        this.myDiagramContext = MAKE(go.Diagram, diagramDivContext,  // create a Diagram for the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,  // center the content
                "linkingTool.isEnabled": false,  // invoked explicitly by drawLink function, below
                "linkingTool.direction": go.LinkingTool.ForwardsOnly,  // only draw "from" towards "to"
                "undoManager.isEnabled": true,  // enable undo & redo
                "allowDelete": true,
                //"grid.visible": true
            });
        var dragged = null;
        function highlight(node) {  // may be null
            var oldskips = this.myDiagramContext.skipsUndoManager;
            this.myDiagramContext.skipsUndoManager = true;
            this.myDiagramContext.startTransaction("highlight");
            if (node !== null) {
                this.myDiagramContext.highlight(node);
            } else {
                this.myDiagramContext.clearHighlighteds();
            }
            this.myDiagramContext.commitTransaction("highlight");
            this.myDiagramContext.skipsUndoManager = oldskips;
        }
        document.addEventListener("dragstart", function (event) {
            // if (event.target.className !== "draggable") return;
            // Some data must be set to allow drag
            event.dataTransfer.setData("text", "");
            // store a reference to the dragged element
            dragged = event.target;
            // Objects during drag will have a red border
            //event.target.style.border = "2px solid red";
        }, false);
        // This event resets styles after a drag has completed (successfully or not)
        document.addEventListener("dragend", function (event) {
            // reset the border of the dragged element
            dragged.style.border = "";
            highlight(null);
        }, false);
        // Next, events intended for the drop target - the Diagram div
        var div = document.getElementById("myDiagramDivContext");
        div.addEventListener("dragenter", function (event) {
            // Here you could also set effects on the Diagram,
            // such as changing the background color to indicate an acceptable drop zone
            // Requirement in some browsers, such as Internet Explorer
            event.preventDefault();
        }, false);
        div.addEventListener("dragover", event => {
            // We call preventDefault to allow a drop
            // But on divs that already contain an element,
            // we want to disallow dropping
            if (this === this.myDiagramContext.div) {
                var can = event.target;
                var pixelratio = 1;
                // if the target is not the canvas, we may have trouble, so just quit:
                if (!(can instanceof HTMLCanvasElement)) return;
                var bbox = can.getBoundingClientRect();
                var bbw = bbox.width;
                if (bbw === 0) bbw = 0.001;
                var bbh = bbox.height;
                if (bbh === 0) bbh = 0.001;
                var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
                var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
                var point = this.myDiagramContext.transformViewToDoc(new go.Point(mx, my));
                var curnode = this.myDiagramContext.findPartAt(point, true);
                //   debugger;
                if (curnode instanceof go.Node) {
                    highlight(curnode);
                } else {
                    highlight(null);
                }
            }
            // Allow a drop on everything else
            event.preventDefault();
        }, false);
        div.addEventListener("dragleave", (event) => {
            // reset background of potential drop target
            // if (event.target.className == "dropzone") {
            //   event.target.style.background = "";
            // }
            highlight(null);
        }, false);
        // handle the user option for removing dragged items from the Palette
        var remove = document.getElementById('remove');
        div.addEventListener("drop", (event: any) => {
            // prevent default action
            debugger;
            // (open as link for some elements in some browsers)
            event.preventDefault();
            // Dragging onto a Diagram
            var can = event.target;
            var pixelratio = 1;
            // if the target is not the canvas, we may have trouble, so just quit:
            if (!(can instanceof HTMLCanvasElement)) return;
            var bbox = can.getBoundingClientRect();
            var bbw = bbox.width;
            if (bbw === 0) bbw = 0.001;
            var bbh = bbox.height;
            if (bbh === 0) bbh = 0.001;
            var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
            var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
            var point = this.myDiagramContext.transformViewToDoc(new go.Point(mx, my));
            this.myDiagramContext.startTransaction('new node');
            let s: any = this.search($('#jstree').jstree()._data.core.focused);
            if (s !== null) {
                let typ: string = this.getType(s);
                s.id = this.config.taskElements.length;
                let k: string = s instanceof Reader ? s.subDatasets[0].compare : s.compare;
                //extra condition repeate
                //if (s instanceof Reader) {
                //    k = s.subDatasets[0].compare;
                //} else {
                //    if (s instanceof Writer) {
                //        k = s.compare;
                //    }
                //}
                this.myDiagramContext.model.addNodeData({
                    key: this.config.taskElements.length,
                    location: point,
                    text: dragged.textContent + "_" + this.config.taskElements.length,
                    color: "white",
                    global: k,
                    type: s.entityType,
                    entityKey: s.entityKey
                });
                this.myDiagramContext.commitTransaction('new node');
                if (s instanceof Reader)
                    s.subDatasets[0].entityName = s.subDatasets[0].entityName + "_" + this.config.taskElements.length;
                else
                    s.opEntityName = s.entityName;
                    s.entityName = s.entityName + "_" + this.config.taskElements.length;
                //extra list
                this.temp.push(s);

                if (this.config.taskElements.length === 0 && !this.isEdit) {
                    this.updateTaskType(s);
                    this.config.taskElements.push(s);
                }
            }
            //if (remove.checked) dragged.parentNode.removeChild(dragged);
            // If we were using drag data, we could get it here, ie:
            // var data = event.dataTransfer.getData('text');
        }, false);

        // the template we defined earlier
        // Div nodeTemplate code starts here
        this.myDiagramContext.nodeTemplate =
            MAKE(go.Node, "Auto",
                {
                    //desiredSize: new go.Size(160, 40),
                    // rearrange the link points evenly along the sides of the nodes as links are
                    // drawn or reconnected -- these event handlers only make sense when the fromSpot
                    // and toSpot are Spot.xxxSides
                    linkConnected: (node: any, link: any, port: any) => {
                        debugger;
                        let fromPos: number = -1;
                        let fromObject: any;
                        //it will appent to task name
                        let fromKey: any;
                        if (link.fromNode !== null) {
                            link.fromNode.invalidateConnectedLinks();
                            fromPos = this.getPos(link.fromNode.data.global);
                            if (fromPos < 0)
                                fromObject == this.search(link.fromNode.data.entityKey);
                            if (fromObject !== undefined && fromObject !== null) {
                                fromObject.id = fromKey = link.fromNode.data.key;
                            }
                            //  alert(this.searchByName(link.fromNode.data.text).entityName);
                        }
                        if (link.toNode !== null) {
                            link.toNode.invalidateConnectedLinks();
                            let toPos: number = this.getPos(link.toNode.data.global);
                            if (!this.isEdit)
                                if (toPos < 0) {
                                    //if next is not present
                                    let a: any = this.search(link.toNode.data.entityKey);

                                    if (a !== undefined && a !== null)
                                        a.id = link.toNode.data.key;
                                    if (a !== undefined) {
                                        if (fromPos >= 0) {
                                            //add next to the from node.
                                            a.opEntityName = a.entityName;
                                            a.entityName += "_" + link.toNode.data.key;
                                            this.config.taskElements.splice(fromPos + 1, 0, a);
                                        } else {

                                        }
                                        // this.config.taskElements.push(a);
                                        this.config.currentPosition = this.getPos(a.compare);
                                        this.updateTaskType(a);
                                    }
                                } else {
                                    // add new before the node
                                    if (fromPos < 0) {
                                        let p: number = -1;
                                        if (toPos - 1 < 0)
                                            p = 0;
                                        else p = toPos - 1;
                                        fromObject.entityName += "_" + fromKey;
                                        this.config.taskElements.splice(p, 0, fromObject);
                                        if (p !== -1) {
                                            this.config.currentPosition = this.config.taskElements[p];
                                            this.updateTaskType(fromObject);
                                        }
                                    }
                                }
                            //  alert(this.searchByName(link.toNode.data.text).entityName);
                        }
                    },
                    linkDisconnected: function (node, link, port) {
                        if (link.fromNode !== null) link.fromNode.invalidateConnectedLinks();
                        if (link.toNode !== null) link.toNode.invalidateConnectedLinks();
                    },
                    locationSpot: go.Spot.Center
                },
                new go.Binding("location"),
                MAKE(go.Shape,
                    {
                        name: "SHAPE",  // named so that changeColor can modify it
                        strokeWidth: 0,  // no border
                        fill: "lightgray",  // default fill color
                        portId: "",
                        // use the following property if you want users to draw new links
                        // interactively by dragging from the Shape, and re-enable the LinkingTool
                        // in the initialization of the Diagram
                        //cursor: "pointer",
                        fromSpot: go.Spot.AllSides,
                        fromLinkable: true,
                        fromLinkableDuplicates: true,
                        fromLinkableSelfNode: false,
                        toSpot: go.Spot.AllSides,
                        toLinkable: true,
                        toLinkableDuplicates: true,
                        toLinkableSelfNode: true
                    },
                    new go.Binding("fill", "color").makeTwoWay()),
                MAKE(go.Panel, "Horizontal",
                    MAKE(go.Picture,
                        {
                            name: "Picture",
                            desiredSize: new go.Size(40, 40),
                            //background: new go.background("black"),
                            margin: new go.Margin(6, 8, 6, 0),
                        },
                        new go.Binding("source", "key", this.findPath)),
                    MAKE(go.TextBlock,
                        {
                            name: "TEXTBLOCK",  // named so that editText can start editing it
                            margin: 3,
                            // use the following property if you want users to interactively start
                            // editing the text by clicking on it or by F2 if the node is selected:
                            //editable: true,
                            overflow: go.TextBlock.OverflowEllipsis,
                            maxLines: 5
                        },
                        new go.Binding("text").makeTwoWay())
                ));
        // a selected node shows an Adornment that includes both a blue border
        // and a row of Buttons above the node
        //debugger;
        this.myDiagramContext.nodeTemplate.selectionAdornmentTemplate =
            MAKE(go.Adornment, "Spot",
                MAKE(go.Panel, "Auto",
                    MAKE(go.Shape, { stroke: "white", strokeWidth: 0, fill: null }),
                    MAKE(go.Placeholder)
                ),
                MAKE(go.Panel, "Horizontal",
                    { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom },
                    MAKE("Button",
                        {
                            click: ((e, button) => {

                                //delete a perticular node and remove with respected object form list
                                var fromNode = button.part.adornedPart;
                                var fromData = fromNode.data;
                                //this.blank();
                                let id: number = this.getPos(fromData.global);
                                debugger;
                                //var model =this.myDiagramContext.model;
                                var model = e.diagram.model;
                                var linkdata = model.copyLinkData({});
                                model.removeNodeData(fromData);
                                if (id >= 0) {
                                    let task: any = this.config.taskElements[id];
                                    this.config.taskElements.splice(id, 1);
                                    if (task instanceof Reader)
                                        this.config.currentReader = null;
                                    else if (task instanceof TaskDto) {
                                        if (task.taskType === TaskType.CLEANSER)
                                            this.config.currentCleanser = null;
                                        else if (task.taskType === TaskType.FUNCTION)
                                            this.config.currentFunction = null;
                                        else if (task.taskType === TaskType.SAMPLER)
                                            this.config.currentSampler = null;
                                    } else if (task instanceof model)
                                        this.config.currentModel = null;
                                    else if (task instanceof Writer)
                                        this.config.currentWriter = null;
                                    this.config.taskType = null;
                                    // this.blank();
                                }
                                var it = fromNode.linksConnected;
                                try {
                                    while (it.next()) {
                                        var item = it.value;
                                        model.removeLinkData(item.data);
                                    }
                                } catch (e) { }
                            })
                        },
                        MAKE(go.Shape,
                            { figure: "ThinX", width: 7, height: 7, margin: 4 })

                    ),
                    MAKE("Button",
                        { // drawLink is defined below, to support interactively drawing new links
                            click: drawLink,// click on Button and then click on target node
                            actionMove: drawLink  // drag from Button to the target node

                        },
                        MAKE(go.Shape,
                            { geometryString: "M0 0 L8 0 8 12 14 12 M12 10 L14 12 12 14" })
                    )
                )
            );

        this.myDiagramContext.addDiagramListener("ObjectSingleClicked",
            (e) => {
                var part = e.subject.part;
                if (!(part instanceof go.Link))
                    if (this.config.taskElements.length > 0) {
                        let n: number = this.getPos(part.data.global);
                        if (n >= 0) {
                            //update current object to main object
                            this.storeTask();
                            let s: any = this.config.taskElements[n];// this.getElement(part.data.global);
                            if (s == null && s == undefined) {
                            } else {
                                this.config.currentPosition = n;
                                this.updateTaskType(s);
                            }

                        }
                    }
            });

        this.myDiagramContext.addDiagramListener("SelectionDeleting",
            (e) => {
                debugger;
                //var part = this.myDiagramContext.selection.iterator.first();
                //alert(part.data.key)
                // if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
            });
        function editText(e, button) {
            var node = button.part.adornedPart;
            e.diagram.commandHandler.editTextBlock(node.findObject("TEXTBLOCK"));
        }

        // This converter is used by the Picture.
        function findImage(key) {
            //if (key < 0 || key > 5)
            return "assets/img/img/Function 72x-8.PNG";
        }
        //function changeColor(e, button) {
        //    var node = button.part.adornedPart;
        //    var shape = node.findObject("SHAPE");
        //    if (shape === null) return;
        //    node.diagram.startTransaction("Change color");
        //    shape.fill = nextColor(shape.fill);
        //    button["_buttonFillNormal"] = nextColor(shape.fill);  // update the button too
        //    node.diagram.commitTransaction("Change color");
        //}
        function drawLink(e, button) {
            var node = button.part.adornedPart;
            var tool = e.diagram.toolManager.linkingTool;
            tool.startObject = node.port;
            e.diagram.currentTool = tool;
            tool.doActivate();
        }
        // used by both clickNewNode and dragNewNode to create a node and a link
        // from a given node to the new node
        function createNodeAndLink(data, fromnode) {
            debugger;
            var diagram = fromnode.diagram;
            var model = diagram.model;
            var nodedata = model.copyNodeData(data);
            model.addNodeData(nodedata);
            var newnode = diagram.findNodeForData(nodedata);
            var linkdata = model.copyLinkData({});
            model.setFromKeyForLinkData(linkdata, model.getKeyForNodeData(fromnode.data));
            model.setToKeyForLinkData(linkdata, model.getKeyForNodeData(newnode.data));
            model.addLinkData(linkdata);
            diagram.select(newnode);
            return newnode;
        }
        // the Button.click event handler, called when the user clicks the "N" button
        function clickNewNode(e, button) {
            var data = button._dragData;
            if (!data) return;
            e.diagram.startTransaction("Create Node and Link");
            var fromnode = button.part.adornedPart;
            var newnode = createNodeAndLink(button._dragData, fromnode);
            // newnode.location = new go.Point(fromnode.location.x + 200, fromnode.location.y);
            e.diagram.commitTransaction("Create Node and Link");
        }
        // the Button.actionMove event handler, called when the user drags within the "N" button
        function dragNewNode(e, button) {
            var tool = e.diagram.toolManager.draggingTool;
            if (tool.isBeyondDragSize()) {
                var data = button._dragData;
                if (!data) return;
                e.diagram.startTransaction("button drag");  // see doDeactivate, below
                var newnode = createNodeAndLink(data, button.part.adornedPart);
                //newnode.location = e.diagram.lastInput.documentPoint;
                // don't commitTransaction here, but in tool.doDeactivate, after drag operation finished
                // set tool.currentPart to a selected movable Part and then activate the DraggingTool
                tool.currentPart = newnode;
                e.diagram.currentTool = tool;
                tool.doActivate();
            }
        }
        // using dragNewNode also requires modifying the standard DraggingTool so that it
        // only calls commitTransaction when dragNewNode started a "button drag" transaction;
        // do this by overriding DraggingTool.doDeactivate:
        var tool = this.myDiagramContext.toolManager.draggingTool;
        tool.doDeactivate = function () {
            // commit "button drag" transaction, if it is ongoing; see dragNewNode, above
            if (tool.diagram.undoManager.nestedTransactionNames.elt(0) === "button drag") {
                tool.diagram.commitTransaction();
            }
            go.DraggingTool.prototype.doDeactivate.call(tool);  // call the base method
        };
        this.myDiagramContext.model = new go.GraphLinksModel([]);
    }

    /**
     *  create and validate the analysis,
     *  check mandetory tasks
     *  generate json for create analysis if valid.
     */
    validateCreate() {
        debugger;
       // if (!this.config.analysisRunningStatus) {
            //  if (this.config.createResult.status_code === -1) {
            if (this.config.taskElements.length > 2) {
                if (this.config.taskElements[0] instanceof Reader) {
                    if (this.config.taskElements[this.config.taskElements.length - 1] instanceof Writer) {
                        try {
                            this.generateAnalysisJson();
                        } catch (e) {
                            console.error(e.message);
                        }
                        //abp.notify.success("Analysis valid.");
                    } else abp.notify.error("Required Writer missing.");
                } else abp.notify.error("Required Reader missing.");
            } else abp.notify.error("Analysis is invalid.");
            //} else abp.notify.error("Analysis is already created.");
        //} else abp.notify.error("Analysis is already running.");
    }
    blank() {
        debugger;
    }
    /**
     * keeps task array updated.
     */
    storeTask() {
        try {
            if (this.config.taskType === TaskType.CLEANSER)
                this.config.taskElements[this.config.currentPosition] = this.config.currentCleanser;
            else if (this.config.taskType === TaskType.FUNCTION)
                this.config.taskElements[this.config.currentPosition] = this.config.currentFunction;
            else if (this.config.taskType === TaskType.MODEL)
                this.config.taskElements[this.config.currentPosition] = this.config.currentModel;
            else if (this.config.taskType === TaskType.READER)
                this.config.taskElements[this.config.currentPosition] = this.config.currentReader;
            else if (this.config.taskType === TaskType.SAMPLER)
                this.config.taskElements[this.config.currentPosition] = this.config.currentSampler;
            else if (this.config.taskType === TaskType.WRITER)
                this.config.taskElements[this.config.currentPosition] = this.config.currentWriter;
        } catch (e) {
            console.error(e.message);
        }
    }
    generateAnalysisJson() {
        debugger;
        try {
            this.config.finalAnalysis.tasks = [];
            let last: Writer = (<Writer>this.config.taskElements[this.config.taskElements.length - 1]);
            this.config.finalAnalysis.srcDatasetName = (<Reader>this.config.taskElements[0]).entityName;
            this.config.finalAnalysis.srcDatasetId = (<Reader>this.config.taskElements[0]).entityKey;
            this.config.finalAnalysis.trgDatasetName = last.entityName;
            this.config.finalAnalysis.trgDatasetId = last.entityType == undefined || last.entityType == null ? last.template.entityKey : last.entityKey;
            this.config.finalAnalysis.AnalysisType = "";
            //this.config.finalAnalysis.trgSubDatasetId = this.config.updateFinalAnalysis.trgSubdatasetId;
            let index: number = 0;
            for (let task of this.config.taskElements) {
                let t: Task = new Task();
                //basic details
                t.entityName = task.entityName;
                t.taskType = this.getType(task);
                t.taskId = "taskID" + (index + 1);
                //create operation dict for each
                t.operationDict = task;
                t.operationDict.entityName = task.opEntityName;
                //create predessor and successor
                if (index === 0) { //bind predecessor
                    t.predecessorID = [];
                    t.predecessorName = [];
                } else {
                    t.predecessorID.push("taskID" + (index));
                    if (this.config.taskElements[index - 1] instanceof Writer || this.config.taskElements[index - 1] instanceof Reader)
                        t.predecessorName.push(this.config.taskElements[index - 1].subDatasets[0].entityName);
                    else
                        t.predecessorName.push(this.config.taskElements[index - 1].entityName);
                }
                if (index + 1 < this.config.taskElements.length) {//bind successor
                    t.successorID.push("taskID" + (index + 2));
                    if (this.config.taskElements[index + 1] instanceof Writer || this.config.taskElements[index + 1] instanceof Reader) {
                        if (this.config.taskElements[index + 1] instanceof Writer) {
                            if (this.config.taskElements[index + 1].entityType === undefined || this.config.taskElements[index + 1].entityType === null)
                                t.successorName.push(this.config.taskElements[index + 1].entityName);
                            t.successorName.push(this.config.taskElements[index + 1].entityName);
                        }
                        else
                            t.successorName.push(this.config.taskElements[index + 1].entityName);
                    }
                    else
                        t.successorName.push(this.config.taskElements[index + 1].entityName);
                } else {
                    t.successorID.push("Null");
                    t.successorName = [];
                }
                //task properties
                t.taskProperties = new TaskProperties(task.definateOprVar,
                    task.inputOprVarSameAsOutputOprVarFlag,
                    task.inputVarCarryFwdFlag,
                    task.reqOprInputVarNumSelection
                );
                // variables
                if (task instanceof Writer) {
                    for (let x of task.selectedVariable)
                        if (x.checked)
                            t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                } else if (!(task instanceof Reader))
                    for (let x of task.selectedVariable)
                        t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                if (task instanceof Reader) {
                    for (let x of task.allVariables)
                        t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                    for (let x of task.selectedVariable)
                        t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                }

                //mappings
                t.mapping = task.mapping;
                this.config.finalAnalysis.tasks.push(t);
                ++index;
            }
            debugger;
            console.log(this.config.finalAnalysis.toJSON());
            //call create analysis api
            if (this.config.isEdit)
                this.updateAnalysis(this.config.finalAnalysis.toUpdateJS());
            else
                this.createAnalysis(this.config.finalAnalysis.toJSON());
        } catch (e) {
            console.error("GenerateJSon");
        }
    }
    createAnalysis(input: any) {
        debugger;
        abp.ui.setBusy();
        this.aService.create(input).subscribe(res => {
            debugger;
            abp.ui.clearBusy();
            this.config.createResult = res;
            if (res.status_code === 1) {
                abp.notify.success(res.string_message);
                this.config.isEdit = true;
                this.key = res.detail.analysisKey;
                this.myDiagramContext.clear();
                this.editAnalysis();
                //  this.ngOnInit();
                //try {
                //    this._route.navigateByUrl('/DummyComponent', true);
                //    this._route.navigate(["create_analysis", this.parentKey, this.key]);
                //} catch (e) {
                //    console.error("Error in routing:", e.message);
                //}
                ////this.route.params.subscribe(param => {
                //    param['parent'] = this.parentKey;
                //    param['key'] = this.key;

                //})


            } else
                abp.notify.error(res.string_message);
        });
    }
    updateAnalysis(input: any) {
        debugger;
        abp.ui.setBusy();
        this.aService.update(this.key, input).subscribe(res => {
            debugger;
            abp.ui.clearBusy();
            this.config.createResult = res;
            if (res.status_code === 1)
                abp.notify.success(res.string_message);
            else
                abp.notify.error(res.string_message);
        });
    }

    runAnalysis() {
        try {
            if (this.config.createResult.status_code === 1 || this.config.isEdit) {
                this.percetage = 0;
                this.completeTask = [];
                this.isProShow = true;
                this.isAbort = false;
                this.config.analysisRunningStatus = true;
                if (this.config.taskElements.length > 0) {
                    this.durationGap = Math.round(100 / this.config.taskElements.length);
                }
                let a: string = "";
                if (this.config.createResult.status_code === 1)
                    a = this.config.createResult.detail.analysisKey;
                if (this.config.isEdit)
                    a = this.key;
                this.interval = setInterval(() => this.pollingAnalysis(), 2000);
                abp.notify.success("Run started.");
                this.aService.runAnalysis(a).subscribe(res => {
                    clearInterval(this.interval);
                    if (!this.isAbort) {
                        this.percetage = 100;
                        this.progressBar();
                        this.runString = "Completed";
                        if (res.statusCode === 1) {
                            abp.notify.success(res.statusMessage);
                        } else
                            abp.notify.error(res.statusMessage);
                    }
                    this.config.analysisRunningStatus = false;
                });
            } else {
                abp.notify.error("Analysis not yet created.");
            }
        } catch (e) {
            console.error("Run Analysis");
        }
    }
    isAbort: boolean = false;
    call() {
        debugger;
        if (this.percetage == 5) {
            $('.poll-vote-list').fadeOut(500);
            $('.poll-results-list').delay(500).fadeIn(500);
        }
        this.percetage += 5;
        this.progressBar();
    }
    abortAnalysis() {
        debugger;
        if (this.config.analysisRunningStatus) {
            if (this.config.createResult.status_code === 1 || this.config.isEdit) {
                clearInterval(this.interval);
                this.config.analysisRunningStatus = false;
                let a: string = "";
                if (this.config.createResult.status_code === 1)
                    a = this.config.createResult.detail.analysisKey;
                if (this.config.isEdit)
                    a = this.key;
                this.aService.abortAnalysis(a).subscribe(res => {
                    debugger;
                    if (res.status_code == 1) {
                        this.isAbort = true;
                        this.runString = "Aborted";
                        abp.notify.success(res.string_message);
                        // abp.message.error(res.string_message);
                    }
                    else
                        abp.notify.warn(res.string_message);
                });
            } else abp.notify.warn("Analysis is not Created.");

        } else {
            abp.notify.warn("Analysis is not Running.");
        }
    }
    percetage: number = 0;
    isProShow: boolean = false;
    interval: any = null;
    completeTask: string[] = [];
    pollingAnalysis() {

        let a: string = "";
        if (this.config.createResult.status_code === 1)
            a = this.config.createResult.detail.analysisKey;
        if (this.config.isEdit)
            a = this.key;
        this.aService.getPollingfunctionality(a).subscribe(res => {
            debugger;
            //this.runString += "," + JSON.stringify(res);
            let ind: number = 0;
            let pro: number = 0;
            for (let x of res.stringMessage) {
                if (x.status == "Completed")
                    if (this.completeTask.indexOf(x.taskName) < 0)
                        if (this.percetage < 100) {
                            this.completeTask.push(x.taskName);
                            this.percetage += this.durationGap;
                            this.progressBar();
                        } else {
                            clearInterval(this.interval);
                            this.config.analysisRunningStatus = false;
                            this.percetage = 100;
                            this.progressBar();
                            this.runString = "Completed";
                        }
            }
            if (this.config.taskElements.length === this.completeTask.length) {
                clearInterval(this.interval);
                this.config.analysisRunningStatus = false;
                this.percetage = 100;
                this.runString = "Completed";
                this.progressBar();
            }
        });

    }
    runString: string = "Running..";
    durationGap: number = 10;
    progressBar() {
        var v = window.document.getElementById("myBar");
        v.style.width = this.percetage + '%';
    }
    logDetails: AnalysisRunLogDetails[] = [];

    viewlogdetails() {
        debugger;
        let a: string = "";
        if (this.config.createResult.status_code === 1)
            a = this.config.createResult.detail.analysisKey;
        if (this.config.isEdit)
            a = this.key;
        this.aService.analysisRunLog(a).subscribe(res => {
            debugger;
            this.logDetails = res;
        });

    }
    /**
     * FOLLOWING TASK ARE FOR THE EDIT ANALYSIS
     */
    editAnalysis() {
        this.aService.editAnalysis(this.key).subscribe(res => {
            debugger;
            let a: CreateAnalysisDto;
            this.config.updateFinalAnalysis = res;
            this.fillStudio();

        });
    }

    fillStudio() {
        try {
            if (this.tree.length > 0) {
                if (this.config.updateFinalAnalysis !== null && this.config.updateFinalAnalysis !== undefined) {
                    this.config.finalAnalysis = this.config.updateFinalAnalysis;
                    debugger;
                    let mx: number = 10;
                    let index: number = 0;
                    this.config.taskElements = this.config.updateFinalAnalysis.taskElements;
                    let json: any[] = [];
                    let d: any[] = [];
                    let l: any[] = [];
                    index = 1;
                    for (let a of this.config.taskElements) {
                        let typ: any;
                        let k: string = a instanceof Reader ? a.subDatasets[0].compare : a.compare;
                        let ky: string = a instanceof Reader ? a.subDatasets[0].entityKey : a.entityKey;
                        if (a instanceof Reader) {
                            k = a.subDatasets[0].compare;
                            ky = a.subDatasets[0].entityKey;
                            typ = TaskType.READER;
                        } else {
                            if (a instanceof Writer) {
                                //  if (a.entityType === undefined || a.entityType === null) {
                                k = a.compare;
                                ky = a.entityKey;
                                // } else {
                                //     k = a.subDatasets[0].compare;
                                // }
                                typ = TaskType.WRITER;
                            }
                        }
                        if (a instanceof TaskDto) {
                            let t: TaskDto = this.search(a.entityKey);
                            if (t !== null && t !== undefined) {
                                a.tType = t.tType;
                                a.definateOprVar = t.definateOprVar;
                                a.inputOprVarSameAsOutputOprVarFlag = t.inputOprVarSameAsOutputOprVarFlag;
                                a.reqOprInputVarNumSelection = t.reqOprInputVarNumSelection;
                                a.inputVarCarryFwdFlag = t.inputVarCarryFwdFlag;
                                a.functionCategory1 = t.functionCategory1;
                                a.functionCategory2 = t.functionCategory2;
                                a.functionCategory3 = t.functionCategory3;
                                a.functionCategory4 = t.functionCategory4;
                                a.className = t.className;
                                a.entityType = t.entityType;
                            }
                            typ = a.taskType;
                        } else if (a instanceof TaskModel) {
                            typ = TaskType.MODEL;
                        }
                        var point = this.myDiagramContext.transformViewToDoc(new go.Point(140, 140 + mx));
                        let c: D = { key: index, text: a.entityName, location: point, color: 'white', global: k, type: typ, entityKey: ky };
                        d.push(c);
                        if (index !== this.config.taskElements.length) {
                            let c: L = { from: index, to: index + 1 };
                            l.push(c);
                        }
                        ++index;
                        mx += 70;
                    }
                    json.push(d);
                    json.push(l);
                    debugger;
                    this.isEdit = true;
                    this.myDiagramContext.model.addNodeDataCollection(d);
                    this.myDiagramContext.model.addLinkDataCollection(l);// = new go.GraphLinksModel(d,l);
                    this.isEdit = false;

                }

            }
        } catch (e) {
            console.error("Fill Studio");
        }
    }

    searchFromTree(input: string, input1: string): any {
        debugger;
        for (let item of this.tree) {
            for (let i of item.taskData) {
                if (i instanceof TaskDto)
                    if (i.tType.toLowerCase() === input1.toLowerCase() || i.tType.toLowerCase() === input.toLowerCase()
                        || i.functionCategory3.toLowerCase() === input1.toLowerCase() || i.functionCategory3.toLowerCase() === input.toLowerCase()
                        || i.functionCategory4.toLowerCase() === input1.toLowerCase() || i.functionCategory4.toLowerCase() === input.toLowerCase()) {
                        return i;
                    }
            }
        }
    }
}
interface D {
    key: number;
    text: string;
    color: string;
    location: any;
    global: string;
    type: string;
    entityKey: string;
}
interface L {
    from: number;
    to: number;
}
