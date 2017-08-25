import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModelService, TaskModel, ModelListDto, TaskDto, ModelResult, ModelAccuracy, CreatemodelDto, Variables, TaskProperties, TaskType, PaneTreeDto, Reader, ModelStudioConfig, QuickTree, ModelTask, ModelTaskProperties, ModelRunLogDetails, ModelVariables, Mapping } from
    '@shared/service-proxies/ids-model-service-proxies';
import { AnalysisResult, AnalysisRunLogDetails } from '@shared/service-proxies/ids-analysis-service-proxies';
import { gojscontextComponent } from '../analysis/gojscontext.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TempBaseUrl, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { TokenService } from '@abp/auth/token.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare var go: any;
declare var diagramDivContext: any;
declare var nativeElement: any;
declare var d: any;
@Component({
    selector: 'configure-model-analysis-app',
    templateUrl: './create-model-analysis-studio.html',
    animations: [appModuleAnimation()]
})

export class CreateModelAnalysisComponent {
    temp: any[] = [];
    filterModel: ModelListDto;
    tree: PaneTreeDto[] = [];
    maccuracy: ModelAccuracy = new ModelAccuracy();
    num: number = 0;
    //removeData: boolean;
    isTrainTest: string;
    enableRun: boolean = false;
    canAbort: boolean = false;
    key: string;
    isEdit: boolean = false;
    constructor(private mService: ModelService, private _session: TokenService,
        private config: ModelStudioConfig, route: ActivatedRoute, private load: LoadingService) {
        debugger;
        //get the model key if it is in edit mode
        this.key = route.snapshot.params['key'];
        if (this.config.finalModel === undefined)
            this.config.finalModel = new CreatemodelDto();
        if (this.config.isEdit) {
            //this.key = "db287e23-8f39-4dda-ad87-0b136d66d30a";
            this.enableRun = true;
            this.editModel();
        } else {
            if (this.key !== "" && this.key !== undefined && this.key !== null) {
                //this.key = "db287e23-8f39-4dda-ad87-0b136d66d30a";
                this.config.isEdit = true;
                this.enableRun = true;
                this.editModel();
            }
        }
        this.runString = "Run not started.";
    }
    /**
     * it update the last changes done in the property pane. And opens new pane that is to be shown. 
     * @param value

     */
    updateTaskType(value: any) {
        debugger
        try {
            this.config.taskType = null;
            // wait for the updating tasks
            setTimeout(() => {
                if (value instanceof TaskDto) {
                    debugger
                    if (value.taskType == TaskType.CLEANSER)
                        this.config.currentCleanser = value;
                    else if (value.taskType == TaskType.SAMPLER)
                        this.config.currentSampler = value;
                    else if (value.taskType == TaskType.FUNCTION)
                        this.config.currentFunction = value;
                    else if (value.taskType == TaskType.TRAINTEST || value.taskType == TaskType.VALIDATE)
                        this.config.currentTrainValidate = value;
                    this.config.taskType = value.taskType;
                }
                else if (value instanceof TaskModel) {
                    debugger
                    this.config.currentModel = value;
                    this.config.taskType = TaskType.MODEL;
                }
                else if (value instanceof Reader) {
                    debugger
                    this.config.currentReader = value;
                    this.config.taskType = TaskType.READER;
                }
            }, 1);
        } catch (e) {
            console.error("Error in Updatetask");
        }
    }
    search(id: any): any {
        debugger;
        try {
            if (id === "TrainTestModel") {
                let a: TaskDto = new TaskDto();
                a.entityKey = "TrainTest";
                a.taskType = TaskType.TRAINTEST;
                a.tType = "TrainTest";
                return a;
            }
            if (this.tree.length > 0)
                for (let s of this.tree)
                    for (let p of s.taskData)
                        if (p instanceof TaskDto) {
                            if (id === p.entityKey)
                                return Object.assign(Object.create(p), p);//.taskDisplayName;
                        } else if (p instanceof TaskModel) {
                            if (id === p.entityKey)
                                return Object.assign(Object.create(p), p);//.entityName;
                        } else if (p instanceof Reader) {
                            for (let x of p.subDatasets) {
                                if (id === x.entityKey) {
                                    let r: Reader = p;
                                    r.subDatasets = [];
                                    r.subDatasets.push(x);
                                    return Object.assign(Object.create(r), r);//.entityName;
                                }
                            }
                        }
        } catch (e) {
            console.error("Error in search");
        }
        return null;
    }
    getType(p: any): string {
        debugger
        if (p instanceof TaskDto) {
            if (p.functionCategory1 === "Algorithm")
                return "Algorithm";
            if (p.taskType === TaskType.CLEANSER)
                return "Cleanser";//.taskDisplayName;
            if (p.taskType === TaskType.SAMPLER)
                return "Sampler";
            if (p.taskType === TaskType.FUNCTION)
                return "Function";
            if (p.taskType === TaskType.TRAINTEST)
                return "TrainTest";
            if (p.taskType === TaskType.VALIDATE)
                return "Validate";
        } else if (p instanceof TaskModel)
            return "Model";//.entityName;
        else if (p instanceof Reader)
            return "Reader";
        return null;
    }
    getElement(id: any): any {
        debugger
        if (this.config.taskElements.length > 0) {
            for (let p of this.config.taskElements) {
                if (p instanceof TaskDto) {
                    if (id === p.compare)
                        return p;//.taskDisplayName;
                } else if (p instanceof TaskModel) {
                    if (id === p.compare)
                        return p;//.entityName;
                } else if (p instanceof Reader) {
                    if (id === p.compare)
                        return p;
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
    }
    getElement1(id: any): any {
        debugger
        if (this.config.taskElements1.length > 0) {
            for (let p of this.config.taskElements1) {
                if (p instanceof TaskDto) {
                    if (id === p.compare)
                        return p;//.taskDisplayName;
                } else if (p instanceof TaskModel) {
                    if (id === p.compare)
                        return p;//.entityName;
                } else if (p instanceof Reader) {
                    if (id === p.compare)
                        return p;
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
    }
    getPos(id: any): number {
        debugger;
        let index: number = 0;
        for (let p of this.config.taskElements) {
            if (p instanceof TaskDto) {
                if (id === p.compare)
                    return index;//.taskDisplayName;
            } else if (p instanceof TaskModel) {
                if (id === p.compare)
                    return index;//.entityName;
            } else if (p instanceof Reader) {
                for (let x of p.subDatasets) {
                    if (id === x.compare) {
                        return index;//.entityName;
                    }
                }
            }
            ++index;
        }
        return -1;
    }
    getPos1(id: any): number {
        debugger;
        let index: number = 0;
        for (let p of this.config.taskElements1) {
            if (p instanceof TaskDto) {
                if (id === p.compare)
                    return index;//.taskDisplayName;
            } else if (p instanceof TaskModel) {
                if (id === p.compare)
                    return index;//.entityName;
            } else if (p instanceof Reader) {
                for (let x of p.subDatasets) {
                    if (id === x.compare) {
                        return index;//.entityName;
                    }
                }
            }
            ++index;
        }
        return -1;
    }
    ngOnInit() {
        debugger
        this.getSide();
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
    getSide() {
        debugger
      this.load.start()
        this.mService.getSidePane1().subscribe(res => {
            //get side pane list
            this.load.stop()
            let cl: TaskDto[] = [];
            let fun: TaskDto[] = [];
            let sam: TaskDto[] = [];
            let tas: TaskModel[] = [];
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
                else if (r instanceof Reader)
                    red.push(r);
            }
            this.tree.push(new PaneTreeDto("Datasets", red));
            this.tree.push(new PaneTreeDto("Sampler", sam));
            this.tree.push(new PaneTreeDto("Cleanser", cl));
            this.tree.push(new PaneTreeDto("Function", fun));
            this.tree.push(new PaneTreeDto("Models", tas));
            //create a json required for right pane
            let d: any = [];
            for (let t of this.tree) {
                if (t.title == "Datasets") {
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
                    else if (t1 instanceof Reader) {
                        d.push(new QuickTree(t1.entityKey, t.title, t1.entityName, "assets/img/img/Reader dataset 16x17.svg"));
                        for (let t2 of t1.subDatasets)
                            d.push(new QuickTree(t2.entityKey, t1.entityKey, t2.entityName, "assets/img/img/Reader dataset 16x17.svg"));
                    }
                }
            }
            //  this.generateLeftSidePane(d, myDiagramContext);
            debugger
            this.ViewInit(d);
            if (this.config.isEdit)
                this.fillStudio();
        });
    }
    myDiagramContext: any;
    myDiagramContext1: any;

    storeTask() {
        debugger
        if (this.config.isPreProcessor) {
            if (this.config.isValidate) {
                if (this.config.taskType === TaskType.READER)
                    this.config.validateElements[this.config.currentPosition] = this.config.currentReader;
            } else {
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
            }
        } else if (!this.config.isPreProcessor) {
            if (this.config.taskType === TaskType.CLEANSER)
                this.config.taskElements1[this.config.currentPosition] = this.config.currentCleanser;
            else if (this.config.taskType === TaskType.FUNCTION)
                this.config.taskElements1[this.config.currentPosition] = this.config.currentFunction;
            else if (this.config.taskType === TaskType.MODEL)
                this.config.taskElements1[this.config.currentPosition] = this.config.currentModel;
            else if (this.config.taskType === TaskType.READER)
                this.config.taskElements1[this.config.currentPosition] = this.config.currentReader;
            else if (this.config.taskType === TaskType.SAMPLER)
                this.config.taskElements1[this.config.currentPosition] = this.config.currentSampler;
        }

    }
    ViewInit(d: any) {
        debugger
        $('#jstree').jstree({
            "core": {
                "data": d
            },
            // "plugins": ["dnd"]
        });
        // create a make type from go namespace and assign it to MAKE
        // create a make type from go namespace and assign it to MAKE
        this.preProcessor();
        this.proccessing();
        /**
         *  create and validate the analysis,
         *  check mandetory tasks
         *  generate json for create analysis if valid.
         */

    }
    preProcessor() {
        debugger
        const MAKE = go.GraphObject.make;
        // get the div in the HTML file
        const diagramDivContext = window.document.getElementById("myDiagramDivContext");
        //instantiate MAKE with Diagram type and the mydiagramDivContext
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
        debugger
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
            //this.removeData = false;
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
                this.config.isValidate = false;
                if (this.config.taskElements.length > 0)
                    if (s instanceof Reader) {
                        this.storeTask();
                        this.config.validateElements.push(s);
                        typ = "ValidateReader";
                        this.config.isValidate = true;
                        this.config.isPreProcessor = true;
                        this.config.currentPosition = 0;
                        this.updateTaskType(s);
                    }

                this.myDiagramContext.model.addNodeData({
                    key: this.config.taskElements.length,
                    location: point,
                    text: dragged.textContent + "_" + this.config.taskElements.length,
                    color: "white",
                    global: k,
                    type: typ,
                    entityKey: s.entityKey
                });
                if (s instanceof Reader)
                    s.subDatasets[0].entityName = s.subDatasets[0].entityName + "_" + this.config.taskElements.length;
                else
                    s.entityName = s.entityName + "_" + this.config.taskElements.length;
                this.myDiagramContext.commitTransaction('new node');
                this.temp.push(s);
                if (!this.config.isValidate)///add if it is not validate task
                    if (this.config.taskElements.length === 0) {
                        this.config.isPreProcessor = true;
                        this.config.currentPosition = 0;
                        this.config.taskElements.push(s);
                        this.updateTaskType(s);
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
                    //desiredSize: new go.Size(120, 40),
                    // rearrange the link points evenly along the sides of the nodes as links are
                    // drawn or reconnected -- these event handlers only make sense when the fromSpot
                    // and toSpot are Spot.xxxSides
                    linkConnected: (node: any, link: any, port: any) => {
                        debugger;
                        let fromPos: number = -1;
                        let fromObject: any;
                        let fromKey: any;
                        if (link.fromNode !== null) {
                            link.fromNode.invalidateConnectedLinks();
                            fromPos = this.getPos(link.fromNode.data.global);
                            if (fromPos < 0)
                                fromObject = this.search(link.fromNode.data.entityKey);
                            if (fromObject !== undefined && fromObject !== null) {
                                fromObject.id = fromKey = link.fromNode.data.key;
                            }
                            //  alert(this.searchByName(link.fromNode.data.text).entityName);
                        }
                        if (link.toNode !== null) {
                            link.toNode.invalidateConnectedLinks();
                            if (!this.isEdit) {
                                let toPos: number = this.getPos(link.toNode.data.global);
                                let a: any;
                                let v: any;
                                if (link.toNode.data.global === "TrainTestModel") {
                                    this.config.isValidate = false;
                                    a = new TaskDto();
                                    a.entityKey = "TrainTest";
                                    a.entityName = "TrainTest";
                                    a.taskType = TaskType.TRAINTEST;
                                    a.tType = "TrainTest";
                                } else if (link.toNode.data.global === "ValidateModel") {
                                    v = new TaskDto();
                                    v.entityKey = "Validate";
                                    v.taskType = TaskType.VALIDATE;
                                    v.tType = "Validate";
                                    this.config.isValidate = true;
                                } else {
                                    a = this.search(link.toNode.data.entityKey);
                                    a.id = link.toNode.data.key;
                                    this.config.isValidate = false;
                                }

                                if (toPos < 0) {
                                    //if next is not present
                                    if (a !== undefined && !this.isEdit) {
                                        if (fromPos >= 0) {
                                            //add next to the from node.
                                            this.storeTask();
                                            this.config.isValidate = false;
                                            this.config.isPreProcessor = true;
                                            a.entityName += "_" + link.toNode.data.key;
                                            this.config.taskElements.splice(fromPos + 1, 0, a);
                                        } else {

                                        }
                                        // this.config.taskElements.push(a);
                                        this.config.currentPosition = this.getPos(link.toNode.data.global);
                                        this.updateTaskType(a);
                                    }
                                } else {
                                    // add new before the node
                                    if (!this.isEdit)
                                        if (fromPos < 0) {
                                            let p: number = -1;
                                            if (toPos - 1 < 0)
                                                p = 0;
                                            else p = toPos - 1;
                                            a.entityName += "_" + fromKey;
                                            this.config.taskElements.splice(p, 0, fromObject);
                                            if (p !== -1) {
                                                this.storeTask();
                                                this.config.isValidate = false;
                                                this.config.isPreProcessor = true;
                                                this.config.currentPosition = this.config.taskElements[p];
                                                this.updateTaskType(fromObject);
                                            }
                                        } else {
                                            /// if both are present

                                        }
                                }
                                if (v !== undefined) {
                                    this.config.isValidate = true;
                                    this.config.validateElements.push(v);
                                }

                                //if (a !== undefined) {
                                //    this.storeTask();
                                //    this.config.isValidate = false;
                                //    this.config.isPreProcessor = true;
                                //    this.config.taskElements.push(a);
                                //    this.config.currentPosition = this.config.taskElements.length - 1;// this.getPos(link.toNode.data.global);
                                //    this.updateTaskType(a);
                                //}
                                //  alert(this.searchByName(link.toNode.data.text).entityName);
                            }
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
                        toLinkableSelfNode: false
                    },
                    new go.Binding("fill", "color").makeTwoWay()),
                MAKE(go.Panel, "Horizontal",
                    MAKE(go.Picture,
                        {
                            name: "Picture",
                            desiredSize: new go.Size(40, 40),
                            //background: new go.background("black"),
                            margin: new go.Margin(8, 8, 8, 8),
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
                                if (fromData.global !== "TrainTestModel") {
                                    let id: number = this.getPos(fromData.global);
                                    debugger;
                                    //var model =this.myDiagramContext.model;
                                    var model = e.diagram.model;
                                    var linkdata = model.copyLinkData({});
                                    //this.removeData = true;
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
                                }
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
                debugger;
                var part = e.subject.part;
                if (!(part instanceof go.Link)) {
                    if (part.data.typ === "ValidateReader") {
                        this.config.isValidate = true;
                        let s: any = this.config.validateElements[0];
                        //s.entityName = "Train Test"
                        this.config.currentPosition = 0;
                        this.updateTaskType(s);
                    } else if (part.data.typ === "Validate") {
                        this.config.isValidate = true;
                        let s: any = this.config.validateElements[1];
                        this.config.currentPosition = 1;
                        this.updateTaskType(s);
                    } else
                        if (this.config.taskElements.length > 0) {
                            debugger
                            let n: number = this.getPos(part.data.global);
                            if (n >= 0) {
                                this.storeTask();
                                this.config.isValidate = false;
                                this.config.isPreProcessor = true;
                                let s: any = this.config.taskElements[n];
                                this.config.currentPosition = n;
                                this.updateTaskType(s);
                            }
                        }
                }
            });

        this.myDiagramContext.addDiagramListener("SelectionDeleting",
            e => {
                debugger;
                //if (e.key === "Delete") {
  
                //}
                //var part = this.myDiagramContext.selection.iterator.first();
                //alert(part.data.key)
                // if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
            });
        function editText(e, button) {
            var node = button.part.adornedPart;
            e.diagram.commandHandler.editTextBlock(node.findObject("TEXTBLOCK"));
        }
        // used by nextColor as the list of colors through which we rotate
        var myColors = ["lightgray", "lightblue", "lightgreen", "yellow", "orange", "pink", "Red", "#A6E3EC",
            "#F53546", "#F0F8FF", "#36393E", "#B0D4EA", "#C79BBF", "#263238", "#FF8247", "#D8E3EC", "#EAEAEA", "#E8E8E8", "#F0F8FF"];

        // used by both the Button Binding and by the changeColor click function
        function nextColor(c) {
            var idx = myColors.indexOf(c);
            if (idx < 0) return "lightgray";
            if (idx >= myColors.length - 1) idx = 0;
            return myColors[idx + 1];
        }
        // This converter is used by the Picture.
        function findImage(key) {
            //if (key < 0 || key > 5)
            return "assets/img/img/cleanser PNG2@72.PNG";
        }

        function deletenode(e, button) {
            var fromNode = button.part.adornedPart;
            var fromData = fromNode.data;
            //var model =this.myDiagramContext.model;
            var model = e.diagram.model;
            var linkdata = model.copyLinkData({});
            model.removeNodeData(fromData);

            var it = fromNode.linksConnected;
            while (it.next()) {
                var item = it.value;
                model.removeLinkData(item.data);
            }
        }

        function changeColor(e, button) {
            var node = button.part.adornedPart;
            var shape = node.findObject("SHAPE");
            if (shape === null) return;
            node.diagram.startTransaction("Change color");
            shape.fill = nextColor(shape.fill);
            button["_buttonFillNormal"] = nextColor(shape.fill);  // update the button too
            node.diagram.commitTransaction("Change color");
        }

        function drawLink(e, button) {
            var node = button.part.adornedPart;
            var tool = e.diagram.toolManager.linkingTool;
            tool.startObject = node.port;
            e.diagram.currentTool = tool;
            tool.doActivate();
        }
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

        var tool = this.myDiagramContext.toolManager.draggingTool;
        tool.doDeactivate = function () {
            // commit "button drag" transaction, if it is ongoing; see dragNewNode, above
            if (tool.diagram.undoManager.nestedTransactionNames.elt(0) === "button drag") {
                tool.diagram.commitTransaction();
            }
            go.DraggingTool.prototype.doDeactivate.call(tool);  // call the base method
        };
        this.myDiagramContext.model = new go.GraphLinksModel([]);
        //initially adding traintest and validate blockes.
        if (!this.config.isEdit) {
            this.myDiagramContext.model.addNodeData({
                key: -1,
                location: this.myDiagramContext.transformViewToDoc(new go.Point(50, 50)),
                text: "TrainTest",
                color: "#2b72ab",
                global: "TrainTestModel",
                type: TaskType.TRAINTEST
            });
            this.myDiagramContext.model.addNodeData({
                key: -1,
                location: this.myDiagramContext.transformViewToDoc(new go.Point(50, 120)),
                text: "Validate",
                color: "#2b72ab",
                global: "ValidateModel",
                type: TaskType.VALIDATE
            });
        }
    }
    proccessing() {
        debugger
        const MAKE = go.GraphObject.make;
        // get the div in the HTML file
        const diagramDivContext = window.document.getElementById("myDiagramDivContext1");
        //instantiate MAKE with Diagram type and the mydiagramDivContext
        //instantiate MAKE with Diagram type and the mydiagramDivContext
        this.myDiagramContext1 = MAKE(go.Diagram, diagramDivContext,  // create a Diagram for the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,  // center the content
                "linkingTool.isEnabled": false,  // invoked explicitly by drawLink function, below
                "linkingTool.direction": go.LinkingTool.ForwardsOnly,  // only draw "from" towards "to"
                "undoManager.isEnabled": true  // enable undo & redo
                //"grid.visible": true
            });
        var dragged = null;
        function highlight(node) {  // may be null
            var oldskips = this.myDiagramContext1.skipsUndoManager;
            this.myDiagramContext1.skipsUndoManager = true;
            this.myDiagramContext1.startTransaction("highlight");
            if (node !== null) {
                this.myDiagramContext1.highlight(node);
            } else {
                this.myDiagramContext1.clearHighlighteds();
            }
            this.myDiagramContext1.commitTransaction("highlight");
            this.myDiagramContext1.skipsUndoManager = oldskips;
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
        var div = document.getElementById("myDiagramDivContext1");
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
            if (this === this.myDiagramContext1.div) {
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
                var point = this.myDiagramContext1.transformViewToDoc(new go.Point(mx, my));
                var curnode = this.myDiagramContext1.findPartAt(point, true);
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
            var point = this.myDiagramContext1.transformViewToDoc(new go.Point(mx, my));
            this.myDiagramContext1.startTransaction('new node');
            let s: any = this.search($('#jstree').jstree()._data.core.focused);
            if (s !== null) {
                let typ: string = this.getType(s);
                s.id = this.config.taskElements1.length;
                let k: string = s instanceof Reader ? s.subDatasets[0].compare : s.compare;
                this.myDiagramContext1.model.addNodeData({
                    key: this.config.taskElements1.length,
                    location: point,
                    text: dragged.textContent + "_" + this.config.taskElements1.length,
                    color: "white",
                    global: k,
                    type: typ,
                    entityKey: s.entityKey
                });
                this.myDiagramContext1.commitTransaction('new node');
                if (s instanceof Reader)
                    s.subDatasets[0].entityName = s.subDatasets[0].entityName + "_" + this.config.taskElements1.length;
                else
                    s.entityName = s.entityName + "_" + this.config.taskElements1.length;
                if (this.config.taskElements1.length === 0) {
                    this.storeTask();
                    this.config.isPreProcessor = false;
                    this.config.currentPosition = 0;
                    this.config.taskElements1.push(s);
                    this.updateTaskType(s);
                }
            }
            //if (remove.checked) dragged.parentNode.removeChild(dragged);
            // If we were using drag data, we could get it here, ie:
            // var data = event.dataTransfer.getData('text');
        }, false);
        // the template we defined earlier
        // Div nodeTemplate code starts here
        this.myDiagramContext1.nodeTemplate =
            MAKE(go.Node, "Auto",
                {
                    //desiredSize: new go.Size(120, 40),
                    // rearrange the link points evenly along the sides of the nodes as links are
                    // drawn or reconnected -- these event handlers only make sense when the fromSpot
                    // and toSpot are Spot.xxxSides
                    linkConnected: (node: any, link: any, port: any) => {
                        debugger;
                        let fromPos: number = -1;
                        let fromObject: any;
                        let fromKey: any;
                        if (link.fromNode !== null) {
                            link.fromNode.invalidateConnectedLinks();
                            fromPos = this.getPos1(link.fromNode.data.global);
                            if (fromPos < 0)
                                fromObject == this.search(link.fromNode.data.entityKey);
                            if (fromObject !== undefined && fromObject !== null) {
                                fromObject.id  = link.fromNode.data.key;
                                fromKey = link.fromNode.data.key;
                            }
                            //  alert(this.searchByName(link.fromNode.data.text).entityName);
                        }
                        if (link.toNode !== null) {
                            link.toNode.invalidateConnectedLinks();
                            this.config.isPreProcessor = false;
                            let toPos: number = this.getPos1(link.toNode.data.global);
                            if (!this.isEdit)
                                if (toPos < 0) {
                                    //if next is not present
                                    let a: any = this.search(link.toNode.data.entityKey);
                                    if (a !== undefined && a !== null)
                                        a.id = link.toNode.data.key;
                                    if (a !== undefined && !this.isEdit) {
                                        if (fromPos >= 0) {
                                            //add next to the from node.
                                            a.entityName += "_" + link.toNode.data.key;
                                            this.config.taskElements1.splice(fromPos + 1, 0, a);
                                        } else {

                                        }
                                        // this.config.taskElements.push(a);
                                        this.config.currentPosition = this.getPos1(link.toNode.data.global);
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
                                        this.config.taskElements1.splice(p, 0, fromObject);
                                        if (p !== -1) {
                                            this.config.currentPosition = this.config.taskElements1[p];
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
                        toLinkableSelfNode: false
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
                        new go.Binding("source", "key", this.findPath1)),
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
        this.myDiagramContext1.nodeTemplate.selectionAdornmentTemplate =
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
                                let id: number = this.getPos1(fromData.global);
                                debugger;
                                //var model =this.myDiagramContext.model;
                                var model = e.diagram.model;
                                var linkdata = model.copyLinkData({});
                                model.removeNodeData(fromData);
                                if (id >= 0) {
                                    let task: any = this.config.taskElements1[id];
                                    this.config.taskElements1.splice(id, 1);
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
                            click: drawLink,  // click on Button and then click on target node
                            actionMove: drawLink  // drag from Button to the target node
                        },
                        MAKE(go.Shape,
                            { geometryString: "M0 0 L8 0 8 12 14 12 M12 10 L14 12 12 14" })
                    )
                )
            );

        this.myDiagramContext1.addDiagramListener("ObjectSingleClicked",
            (e) => {
                debugger;
                var part = e.subject.part;
                if (!(part instanceof go.Link))
                    if (this.config.taskElements1.length > 0) {
                        let n: number = this.getPos1(part.data.global);
                        if (n >= 0) {
                            this.storeTask();
                            this.config.isPreProcessor = false;
                            let s: any = this.config.taskElements1[n];
                            this.config.currentPosition = n;
                            this.updateTaskType(s);
                        }
                    }
            });

        this.myDiagramContext1.addDiagramListener("SelectionDeleted",
            e => {
                debugger;
                //var part = this.myDiagramContext.selection.iterator.first();
                //alert(part.data.key)
                // if (!(part instanceof go.Link)) showMessage("Clicked on " + part.data.key);
            });
        function editText(e, button) {
            debugger;
            var node = button.part.adornedPart;
            e.diagram.commandHandler.editTextBlock(node.findObject("TEXTBLOCK"));
        }
        // used by nextColor as the list of colors through which we rotate
        var myColors = ["lightgray", "lightblue", "lightgreen", "yellow", "orange", "pink", "Red", "#A6E3EC",
            "#F53546", "#F0F8FF", "#36393E", "#B0D4EA", "#C79BBF", "#263238", "#FF8247", "#D8E3EC", "#EAEAEA", "#E8E8E8", "#F0F8FF"];

        // used by both the Button Binding and by the changeColor click function
        function nextColor(c) {
            debugger;
            var idx = myColors.indexOf(c);
            if (idx < 0) return "lightgray";
            if (idx >= myColors.length - 1) idx = 0;
            return myColors[idx + 1];
        }
        // This converter is used by the Picture.
        function findImage(key) {
            //if (key < 0 || key > 5)
            return "assets/img/img/icon 1.svg";
        }
        function changeColor(e, button) {
            debugger;
            var node = button.part.adornedPart;
            var shape = node.findObject("SHAPE");
            if (shape === null) return;
            node.diagram.startTransaction("Change color");
            shape.fill = nextColor(shape.fill);
            button["_buttonFillNormal"] = nextColor(shape.fill);  // update the button too
            node.diagram.commitTransaction("Change color");
        }

        function drawLink(e, button) {
            debugger;
            var node = button.part.adornedPart;
            var tool = e.diagram.toolManager.linkingTool;
            tool.startObject = node.port;
            e.diagram.currentTool = tool;
            tool.doActivate();
        }
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

        var tool = this.myDiagramContext1.toolManager.draggingTool;
        tool.doDeactivate = function () {
            // commit "button drag" transaction, if it is ongoing; see dragNewNode, above
            if (tool.diagram.undoManager.nestedTransactionNames.elt(0) === "button drag") {
                tool.diagram.commitTransaction();
            }
            go.DraggingTool.prototype.doDeactivate.call(tool);  // call the base method
        };
        this.myDiagramContext1.model = new go.GraphLinksModel([]);
    }
    findPath = key => {
        debugger
        if (this.myDiagramContext.findNodeForKey(key).data.type === "Dataset")
            return "assets/img/img/Reader Dataset@72x-8.png";
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
    findPath1 = key => {
        debugger
        if (this.myDiagramContext1.findNodeForKey(key).data.type === "Dataset")
            return "assets/img/img//Reader Dataset@72x-8.png";
        else if (this.myDiagramContext1.findNodeForKey(key).data.type === "Sampler")
            return "assets/img/img/Sampler 72x-8.PNG";
        else if (this.myDiagramContext1.findNodeForKey(key).data.type === "Cleanser")
            return "assets/img/img/cleanser 72x-8.PNG";
        else if (this.myDiagramContext1.findNodeForKey(key).data.type === "Function")
            return "assets/img/img/Function 72x-8.PNG";
        else if (this.myDiagramContext1.findNodeForKey(key).data.type === "Model")
            return "assets/img/img/Model 72x-8.PNG";
        else return "assets/img/img/Writer 72x-8.PNG";
    };
    validateCreate() {
        debugger;
        //if (!this.config.modelRunningStatus) {
            //if (this.config.createResult.status_code === -1) {
                if (this.config.taskElements.length > 1) {
                    if (this.config.taskElements[0] instanceof Reader) {
                        if (this.config.taskElements1.length > 0) {
                            this.generateModelJson();
                        } else abp.notify.error("Proccessing task missing.");
                    } else abp.notify.error("Required Reader missing.");
                } else abp.notify.error("Model is invalid.");
            //} else abp.notify.error("Model is already created.");
        //} else abp.notify.error("Model is already running.");
    }
    /**
     * generate final frontend json
     */
    generateModelJson() {
        debugger;
        this.storeTask();
        this.config.finalModel.tasksPre = [];
        this.config.finalModel.tasksPro = [];
        this.config.finalModel.srcDatasetName = (<Reader>this.config.taskElements[0]).entityName;
        this.config.finalModel.srcDatasetId = (<Reader>this.config.taskElements[0]).entityKey;
        this.config.finalModel.lastRunDate = "";
        this.config.finalModel.readyFlag = "";
        this.config.finalModel.changeFlag = "False";
        this.config.finalModel.parentKey = (<Reader>this.config.taskElements[0]).parentKey;
        let index: number = 0;
        for (let task of this.config.taskElements) {
            let t: ModelTask = new ModelTask();
            //basic details
            t.entityName = task.entityName;
            t.taskType = this.getType(task);
            t.taskId = "taskID" + (index + 1);
            if (task.tType !== "TrainTest" && task.tType !== "Validate")
                t.operationDict = task;
            //create predessor and successor
            if (index === 0) { //bind predecessor
                t.predecessorID.push("Null");// = [];
                t.predecessorName = [];
            } else {
                t.predecessorID.push("taskID" + (index));
                if (this.config.taskElements[index - 1] instanceof Reader)
                    t.predecessorName.push(this.config.taskElements[index - 1].subDatasets[0].entityName);
                else
                    t.predecessorName.push(this.config.taskElements[index - 1].entityName);
            }
            if (index + 1 < this.config.taskElements.length) {//bind successor
                t.successorID.push("taskID" + (index + 2));
                if (this.config.taskElements[index + 1] instanceof Reader) {
                    t.successorName.push(this.config.taskElements[index + 1].subDatasets[0].entityName);
                }
                else
                    t.successorName.push(this.config.taskElements[index + 1].entityName);
            } else {
                if (this.config.taskElements.length - 1 === index) {
                    if (this.config.taskElements1.length > 0) {
                        t.successorID.push("taskID" + (index + 2));
                        t.successorName.push(this.config.taskElements1[0].entityName);
                    }
                } else {
                    t.successorID = [];
                    t.successorName = [];
                }
            }

            //task properties
            if (task instanceof Reader)
                t.taskProperties = new TaskProperties(false, false, false, true);
            else {
                if (task.tType == "TrainTest" || task.tType == "Validate") {
                    t.taskProperties = new TaskProperties(false,
                        true,
                        false,
                        false
                    );
                } else {
                    t.taskProperties = new TaskProperties(task.definateOprVar,
                        task.inputOprVarSameAsOutputOprVarFlag,
                        task.inputVarCarryFwdFlag,
                        task.reqOprInputVarNumSelection
                    );
                }
            }
            // variables
            if (!(task instanceof Reader))
                for (let x of task.selectedVariable)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            if (task instanceof Reader) {
                for (let x of task.allVariables)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                for (let x of task.selectedVariable)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            }
            t.mapping = task.mapping;

            this.config.finalModel.tasksPre.push(t);
            ++index;
        }
        /////processing
        index = 0;
        for (let task of this.config.taskElements1) {
            let t: ModelTask = new ModelTask();
            //basic details
            t.entityName = task.entityName;
            t.taskType = this.getType(task);
            t.taskId = "taskID" + (this.config.taskElements.length + index + 1);

            t.operationDict = task;
            //create predessor and successor
            if (index === 0) { //bind predecessor
                t.predecessorID = [];
                //t.predecessorID.push("taskID" + this.config.taskElements.length);
                t.predecessorID.push("Null");
                t.predecessorName = [];
                //  t.predecessorName.push(this.config.taskElements[this.config.taskElements.length - 1].entityName);
            } else {
                t.predecessorID.push("taskID" + (index));
                if (this.config.taskElements1[index - 1] instanceof Reader)
                    t.predecessorName.push(this.config.taskElements1[index - 1].subDatasets[0].entityName);
                else
                    t.predecessorName.push(this.config.taskElements1[index - 1].entityName);
            }
            if (index + 1 < this.config.taskElements1.length) {//bind successor
                t.successorID.push("taskID" + (index + 2));
                if (this.config.taskElements1[index + 1] instanceof Reader) {
                    t.successorName.push(this.config.taskElements1[index + 1].subDatasets[0].entityName);
                } else
                    t.successorName.push(this.config.taskElements1[index + 1].entityName);
            } else {
                t.successorID.push("Null");// = [];
                t.successorName = [];
            }
            //task properties
            if (task instanceof Reader)
                t.taskProperties = new TaskProperties(false, false, false, true);
            else {
                t.taskProperties = new TaskProperties(task.definateOprVar,
                    task.inputOprVarSameAsOutputOprVarFlag,
                    task.inputVarCarryFwdFlag,
                    task.reqOprInputVarNumSelection
                );
            }
            // variables
            if (index === this.config.taskElements1.length - 1) {
                if (task.className === "BasicFrequencyAlgorithm" || task.className === "AdjectiveFrequencyAlgorithm" || task.className === "VerbFrequencyAlgorithm" || task.className === "NounFrequencyAlgorithm") {
                    //defineteoprVar is true then show mapping else not
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", task.entityName + ".frequency", Variables.OPERATION_VAR, "Discrete", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".word", Variables.OPERATION_VAR, "Text    ", false));
                    //
                } else if (task.className === "WordToWordCorrelationAnalysis" || task.className === "VerbToVerbCorrelationAnalysis" || task.className === "NounToAdjectiveCorrelationAnalysis" || task.className === "NounToVerbCorrelationAnalysis" || task.className === "WordToPhraseCorrelationAnalysis" || task.className === "PhraseToPhraseCorrelationAnalysis") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".text1", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".text2", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", task.entityName + ".correlationScore", Variables.OPERATION_VAR, "Discrete", false));
                    //
                } else if (task.className === "BasicSentimentAlgorithm1" || task.className === "BasicSentimentAlgorithm2" || task.className === "BasicSentimentAlgorithm3") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "text", "O", "", task.entityName + ".sentiment", Variables.OPERATION_VAR, "Categorical", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "text", "O", "", task.entityName + ".sentimentScore", Variables.OPERATION_VAR, "Discrete", false));
                    //
                } else if (task.className === "BasicEntityExtraction" || task.className === "AdvancedEntityExtraction") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    //
                } else if (task.className === "CentroidAlgorithm" || task.className === "DensityAlgorithm" || task.className === "ConnectivityAlgorithm" || task.className === "IncrementalAlgorithm") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".label", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".name", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".type", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".relevance", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".personType", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".nationality", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".confidencelevel", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".frequency", Variables.OPERATION_VAR, "Text", false));
                } else if (task.className === "NaiveBayesAlgorithm" || task.className === "SVMAlgorithm" || task.className === "EntropyAlgorithm") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".label", Variables.OPERATION_VAR, "Text", false));

                } else if (task.className === "SKLinearRegression" || task.className == "SKLogisticRegression" || task.className == "SKKNNRegression") {
                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".value", Variables.OPERATION_VAR, "Text", false));
                    for (let x of task.rightVariables) {
                        debugger;
                        task.selectedVariable.push(new Variables(
                            Variables.getRandomNumber,
                            x.dataType,
                            "I", "",
                            task.entityName + "." + x.name,
                            Variables.OPERATION_VAR,
                            x.variableType,
                            true));
                    }
                }

                else if (task.className === "SKSVMClassification" || task.className == "SKKNNClassification") {

                    task.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", task.entityName + ".label", Variables.OPERATION_VAR, "Text", false));
                    for (let x of task.rightVariables) {
                        debugger;
                        task.selectedVariable.push(new Variables(
                            Variables.getRandomNumber,
                            x.dataType,
                            "I", "",
                            task.entityName + "." + x.name,
                            Variables.OPERATION_VAR,
                            x.variableType,
                            true));
                    }
                }

            }
            if (!(task instanceof Reader))
                for (let x of task.selectedVariable)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            if (task instanceof Reader) {
                for (let x of task.allVariables)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
                for (let x of task.selectedVariable)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            }
            //mappings
            debugger;
            if (index === 0) {
                task.mapping = [];
                if (task.className === 'SKLinearRegression' || task.className == 'SKLogisticRegression' || task.className == 'SKKNNRegression' || task.className == 'SKSVMRegression') {
                    task.mapping
                        .push(new Mapping(
                            this.config.taskElements[this.config.taskElements.length - 1].entityName,
                            task.cleanseText.name,
                            task.entityName,
                            task.entityName + ".value"
                        ));
                }
                else if (task.className === 'SKSVMClassification' || task.className == 'SKKNNClassification') {

                    task.mapping
                        .push(new Mapping(
                            this.config.taskElements[this.config.taskElements.length - 1].entityName,
                            task.classText.name,
                            task.entityName,
                            task.entityName + ".label"
                        ));
                }
                else {
                    task.mapping
                        .push(new Mapping(
                            this.config.taskElements[this.config.taskElements.length - 1].entityName,
                            task.cleanseText.name,
                            task.entityName,
                            "text"
                        ));
                    if (task.functionCategory1 === "Algorithm")
                        task.mapping
                            .push(new Mapping(
                                this.config.taskElements[this.config.taskElements.length - 1].entityName,
                                task.classText.name,
                                task.entityName,
                                "label"
                            ));
                }
            } else {
                this.config.currentSampler.mapping = [];
                task.mapping
                    .push(new Mapping(
                        this.config.taskElements1[index - 1].entityName,
                        task.cleanseText.name,
                        task.entityName,
                        "text"
                    ));
                if (task.functionCategory1 === "Algorithm")
                    task.mapping
                        .push(new Mapping(
                            this.config.taskElements1[index - 1].entityName,
                            task.classText.name,
                            task.entityName,
                            "label"
                        ));
            }
            t.mapping = task.mapping;
            this.config.finalModel.tasksPro.push(t);
            ++index;
        }
        let taskNum: number = this.config.taskElements.length + this.config.taskElements1.length + 1;
        this.config.validateElements.forEach((task, id) => {
            let t: ModelTask = new ModelTask();
            t.entityName = task.entityName;
            t.taskType = this.getType(task);
            t.taskId = "taskID" + taskNum;
            if (index === 0) { //bind predecessor
                t.predecessorID.push("Null");// = [];
                t.predecessorName = [];
            } else {
                t.predecessorID.push("taskID" + (id));
                if (this.config.taskElements[id - 1] instanceof Reader)
                    t.predecessorName.push(this.config.validateElements[id - 1].subDatasets[0].entityName);
                else
                    t.predecessorName.push(this.config.validateElements[id - 1].entityName);
            }
            if (this.config.validateElements.length - 1 === id) {
                if (this.config.validateElements.length > 0) {
                    t.successorID.push("taskID" + (taskNum + id + 2));
                    t.successorName.push(this.config.validateElements[0].entityName);
                }
            } else {
                t.successorID = [];
                t.successorName = [];
            }
            if (task instanceof Reader)
                t.taskProperties = new TaskProperties(false, false, false, true);
            else {
                t.taskProperties = new TaskProperties(false,
                    true,
                    false,
                    false
                );
            }
            if (task instanceof Reader) {
                for (let x of task.allVariables)
                    t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            }
            for (let x of task.selectedVariable)
                t.variables.push(new Variables(Variables.getRandomNumber, x.dataType, x.inOutFlag, "", x.name, x.variableCategory, x.variableType, x.checked));
            t.mapping = task.mapping;
            this.config.finalModel.tasksPre.push(t);
        });
        debugger;
        console.log(this.config.finalModel.toJSON());
        //call create analysis api
        if (this.config.isEdit)
            this.updateModel(this.config.finalModel.toUpdateJSON());
        else
            this.createModel(this.config.finalModel.toJSON());
    }
    createModel(input: any) {
        debugger;
      this.load.start()
        this.mService.createModel(input).subscribe(res => {
            debugger;
            this.load.stop()
            this.config.createResult = res;
            if (res.status_code === 1) {
                this.enableRun = true;
                abp.notify.success(res.string_message);
                this.config.isEdit = true;
                this.key = res.detail.entityKey;
                this.myDiagramContext.clear();
                this.myDiagramContext1.clear();
                this.editModel();
            } else
                abp.notify.error(res.string_message);
        });
    }
    updateModel(input: any) {
        debugger;
      this.load.start()
        this.mService.updateModel(this.key, input).subscribe(res => {
            debugger;
            this.load.stop()
            // this.config.createResult = res;
            if (res.statusCode === 1)
                abp.notify.success(res.statusMessage);
            else
                abp.notify.error(res.statusMessage);
        });
    }
    runModel() {
        debugger;
        //if (this.config.createResult.status_code === 1) {
        //    this.percetage = 0;
        //    this.progressBar();
        //    this.config.analysisRunningStatus = true;
        //    this.interval = setInterval(() => this.pollingAnalysis(), 700);
       

        if (this.config.createResult.status_code === 1 || this.config.isEdit) {
            let a: string = "";
            if (this.config.createResult.status_code === 1) {
                a = this.config.createResult.detail.entityKey;
            }
            if (this.config.isEdit)
                a = this.key;
            this.enableRun = false;
            this.canAbort = true;
            this.mService.RunModel(a).subscribe(res => {
                debugger;
                this.config.modelRunningStatus = false;
                this.percetage = 100;
                this.progressBar();
                clearInterval(this.interval);
                if (res.statusCode === 1) {
                    abp.notify.success(res.statusMessage);
                }
                else
                    abp.notify.error(res.statusMessage);
                this.enableRun = true;
                this.canAbort = false;
            });
        } else abp.notify.warn("Model not created yet.");
        //} else {
        //    abp.notify.error("Analysis not yet created.");
        //}
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
    abortModel() {
        debugger;
        let a: string = "";
        if (this.config.createResult !== undefined) {
            a = this.config.createResult.detail.entityKey;
        }
        else a = this.key;
        this.mService.AbortModel(a).subscribe(res => {
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
            }
            else
                abp.notify.error(res.statusMessage);
        });
    }

    percetage: number = 0;
    isProShow: boolean = false;
    interval: any = null;
    completeTask: string[] = [];

    pollingAnalysis() {
        debugger;
        let a: string = "";
        if (this.config.createResult.status_code === 1)
            a = this.config.createResult.detail.entityKey;
        if (this.config.isEdit)
            a = this.key;
        this.mService.getPollingfunctionality(a).subscribe(res => {
            debugger;
            //this.runString += "," + JSON.stringify(res);
            if (res !== null) {
                let ind: number = 0;
                let pro: number = 0;
                for (let x of res.statusMessage) {
                    if (x.status == "Completed")
                        if (this.completeTask.indexOf(x.taskName) < 0)
                            if (this.percetage < 100) {
                                this.completeTask.push(x.taskName);
                                this.percetage += this.durationGap;
                                this.progressBar();
                            } else {
                                clearInterval(this.interval);
                                this.config.modelRunningStatus = false;
                                this.percetage = 100;
                                this.progressBar();
                                this.runString = "Completed";
                            }
                }
                if (this.config.taskElements.length === this.completeTask.length) {
                    clearInterval(this.interval);
                    this.config.modelRunningStatus = false;
                    this.percetage = 100;
                    this.runString = "Completed";
                    this.progressBar();
                }
            }
        });

    }

    //runString shows the current status of polling . this is just a string to show the message
    runString: string = "Running..";
    // durationGap:it is progress percentage to add after a task run completes. it is calculates by 100/no.of task.
    durationGap: number = 10;
    /**
     * progressBar with the percentage
     */
    progressBar() {
        var v = window.document.getElementById("myBar");
        if (v !== null)
            v.style.width = this.percetage + '%';
    }
    /**
     * calls train test api and start polling fuctionality.
     */
    getTrainTest() {
        debugger;
        let a: string = "";
        if (this.config.createResult.status_code === 1) {
            a = this.config.createResult.detail.entityKey;
        }
        if (this.config.isEdit)
            a = this.key;
        this.isTrainTest = "TrainTest";
        this.config.modelRunningStatus = true;
        this.isProShow = true;
        this.percetage = 0;
        this.progressBar();
        this.enableRun = false;
        this.canAbort = true;
        this.runString="Runnig...."
        //it call repeatatively after 700 miliseconds to get the current running state.
        this.interval = setInterval(() => this.pollingAnalysis(), 2000);
        // let s = "b586f21d-61aa-4376-bf45-f294e14ca4f9";
        //this.load.start();
        abp.notify.success("Train Test started");
        this.mService.trainTestModel(a).subscribe(re => {
            debugger;
            // clear the the polling requests
            clearInterval(this.interval);
            this.percetage = 100;
            this.progressBar();
            // this.load.stop()
            if (re.statusCode === 1) {
                // get the accurcy from the result json and bind to the html page
                this.maccuracy = ModelAccuracy.fromJS(re.results);
                abp.notify.success(re.statusMessage);
                this.runString = "Completed."
            }
            else
                abp.notify.error(re.statusMessage);
            this.enableRun = true;
            this.canAbort = false;
        });
    }
    Validate() {
        debugger;
        this.isTrainTest = "Validate";
        //let s = "b586f21d-61aa-4376-bf45-f294e14ca4f9";
        //this.mService.ValidateModel(s).subscribe(re => {

        //    if (re.statusCode === 1) {
        //        abp.notify.success(re.statusMessage);
        //    }

        //    else
        //        abp.notify.error(re.statusMessage);


        //});
    }
    logDetails: ModelRunLogDetails[] = [];
    viewModellogdetails() {
        debugger;
        let a: string = "";
        if (this.config.createResult.status_code === 1) {
            a = this.config.createResult.detail.entityKey;
        }
        if (this.config.isEdit)
            a = this.key;
        this.mService.ModelRunLog(a).subscribe(res => {
            debugger;
            this.logDetails = res;
        });

    }
    editModel() {
        debugger;
        this.mService.editModel(this.key).subscribe(re => {
            debugger;
            this.config.updateModel = re;
            this.fillStudio();
        });
    }
    fillStudio() {
        debugger;
        if (this.tree.length > 0)
            if (this.config.updateModel !== null && this.config.updateModel !== undefined) {
                this.config.finalModel.entityName = this.config.updateModel.entityName;
                this.config.finalModel.entityKey = this.config.updateModel.entityKey;
                this.config.finalModel.srcDatasetName = this.config.updateModel.srcDatasetName;
                this.config.finalModel.srcDatasetId = this.config.updateModel.srcDatasetId;
                this.config.finalModel.entityDescription = this.config.updateModel.entityDescription;
                this.config.finalModel.readyFlag = this.config.updateModel.readyFlag;
                this.config.finalModel.lastRunDate = this.config.updateModel.lastRunDate;
                this.config.finalModel.modelType = this.config.updateModel.modelType;
                this.config.finalModel.lastRunDate = this.config.updateModel.lastRunDate;
                this.config.finalModel.parentKey = this.config.updateModel.parentKey;
                this.config.finalModel.changeFlag = this.config.updateModel.changeFlag;
                this.maccuracy = this.config.updateModel.result;
                debugger;
                let mx: number = 10;
                let index: number = 0;
                this.config.taskElements = this.config.updateModel.taskElements;
                this.config.taskElements1 = this.config.updateModel.taskElements1;

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
                            a.taskType = t.taskType;
                        } else if (a.taskType == TaskType.TRAINTEST) {
                            a.taskType = typ = TaskType.TRAINTEST;
                            a.tType = "TrainTest";
                            k = "TrainTestModel";
                        }
                        typ = a.taskType;
                    } else if (a instanceof TaskModel) {
                        typ = TaskType.MODEL;
                        a.taskType = TaskType.MODEL;
                    }

                    var point = this.myDiagramContext.transformViewToDoc(new go.Point(140, 140 + mx));
                    let c: D = { key: index, text: a.entityName, location: point, color: typ === TaskType.TRAINTEST ? 'orange' : 'white', global: k, type: typ, entityKey:ky };
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

                json = [];
                d = [];
                l = [];
                for (let a of this.config.taskElements1) {
                    if (a.taskType !== TaskType.TRAINTEST && a.taskType !== TaskType.VALIDATE) {
                        let typ: any;
                        let k: string = a instanceof Reader ? a.subDatasets[0].compare : a.compare;
                        let ky: string = a instanceof Reader ? a.subDatasets[0].entityKey : a.entityKey;
                        if (a instanceof Reader) {
                            k = a.subDatasets[0].compare;
                            ky = a.subDatasets[0].entityKey;
                            typ = TaskType.READER;
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
                        var point = this.myDiagramContext1.transformViewToDoc(new go.Point(140, 140 + mx));
                        let c: D = { key: index, text: a.entityName, location: point, color: 'white', global: k, type: typ, entityKey:ky };
                        d.push(c);
                        if (index !== this.config.taskElements.length) {
                            let c: L = { from: index, to: index + 1 };
                            l.push(c);
                        }
                        ++index;
                        mx += 70;
                    }
                }
                json.push(d);
                json.push(l);
                this.isEdit = true;
                this.myDiagramContext1.model.addNodeDataCollection(d);
                this.myDiagramContext1.model.addLinkDataCollection(l);// = new go.GraphLinksModel(d,l);
                this.isEdit = false;

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
