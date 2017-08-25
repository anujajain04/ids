import { Component, Directive, Injector, CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertModule } from 'ng2-bootstrap';
//import{ gojscontextComponent } from './gojscontext.component';


declare var go: any;
declare var diagramDiv: any;
declare var nativeElement: any;
declare var nodeIdCounter: any;
declare var className: any;
@Component({
    selector: 'gojs-tree',
    templateUrl: './gojs.component.html',
    animations: [appModuleAnimation()],
    // providers:[gojsComponent]
})

@NgModule({
    declarations: [gojsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

//@Directive({selector:'[go-Pallete]'})

@Injectable()
export class gojsComponent extends AppComponentBase {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    @ViewChild('myDiagramDiv') div;

    ngAfterViewInit() {

        // create a make type from go namespace and assign it to MAKE
        const MAKE = go.GraphObject.make;

        // get the div in the HTML file
        const diagramDiv = this.div.nativeElement


        var dragged = null;
        const myDiagram =
            MAKE(go.Diagram, diagramDiv,
                {
                    allowDrop: true,
                    "draggingTool.dragsLink": true,
                    "draggingTool.isGridSnapEnabled": true,
                    "linkingTool.isUnconnectedLinkValid": true,
                    "linkingTool.portGravity": 20,
                    "relinkingTool.isUnconnectedLinkValid": true,
                    "relinkingTool.portGravity": 20,
                    "undoManager.isEnabled": true,
                    "relinkingTool.fromHandleArchetype":
                    MAKE(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
                    allowMove: false,
                    allowCopy: false,
                    allowDelete: false,
                    allowHorizontalScroll: false,

                    layout:
                    MAKE(go.TreeLayout,
                        {
                            alignment: go.TreeLayout.AlignmentStart,
                            angle: 0,
                            compaction: go.TreeLayout.CompactionNone,
                            layerSpacing: 16,
                            layerSpacingParentOverlap: 1,
                            nodeIndent: 2,
                            nodeIndentPastParent: 0.88,
                            nodeSpacing: 0,
                            setsPortSpot: false,
                            setsChildPortSpot: false
                        })
                });

        myDiagram.nodeTemplate =
            MAKE(go.Node,
                { // no Adornment: instead change panel background color by binding to Node.isSelected
                    selectionAdorned: false,
                    // a custom function to allow expanding/collapsing on double-click
                    // this uses similar logic to a TreeExpanderButton
                    doubleClick: function (e, node) {

                        alert("hello");
                        debugger;
                        MAKE.scope.myDiagram.selection.each(function (part) {
                            if (part instanceof go.Node) {
                                console.log(part.data);
                            }
                        });

                        //new code starts here
                        //var div = document.getElementById("myDiagramDiv");
                        // document.getElementById("myDiagramDiv").nodeValue=myDiagram.model.toJson();
                        // myDiagram.isModified = false;

                        //new code ends here

                        var cmd = myDiagram.commandHandler;
                        if (node.isTreeExpanded) {
                            if (!cmd.canCollapseTree(node)) return;
                        } else {
                            if (!cmd.canExpandTree(node)) return;
                        }
                        e.handled = true;
                        if (node.isTreeExpanded) {
                            cmd.collapseTree(node);
                        } else {
                            cmd.expandTree(node);
                        }
                    },



                },
                MAKE("TreeExpanderButton",
                    {
                        width: 14,
                        "ButtonBorder.fill": "whitesmoke",
                        "ButtonBorder.stroke": null,
                        "_buttonFillOver": "rgba(0,128,255,0.25)",
                        "_buttonStrokeOver": null
                    }),
                MAKE(go.Panel, "Horizontal",
                    { position: new go.Point(16, 0) },
                    new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : "white"); }).ofObject(),
                    MAKE(go.Picture,
                        {
                            width: 18, height: 18,
                            margin: new go.Margin(0, 4, 0, 0),
                            imageStretch: go.GraphObject.Uniform
                        },
                        // bind the picture source on two properties of the Node
                        // to display open folder, closed folder, or document
                        new go.Binding("source", "isTreeExpanded", imageConverter).ofObject(),
                        new go.Binding("source", "isTreeLeaf", imageConverter).ofObject()),
                    MAKE(go.TextBlock,
                        { font: '9pt Verdana, sans-serif' },
                        new go.Binding("text", "key", function (s) { return "Reader Dataset " + s; }))

                )  // end Horizontal Panel
            );  // end Node

        // without lines
        myDiagram.linkTemplate = MAKE(go.Link);

        // with lines
        myDiagram.linkTemplate =
            MAKE(go.Link,
                {
                    selectable: false,
                    routing: go.Link.Orthogonal,
                    fromEndSegmentLength: 4,
                    toEndSegmentLength: 4,
                    fromSpot: new go.Spot(0.001, 1, 7, 0),
                    toSpot: go.Spot.Left
                },
                MAKE(go.Shape,
                    { stroke: 'lightblue', strokeDashArray: [1, 2] }));

        var nodeDataArray = [{ key: 0 }];
        var max = 30;
        var count = 0;
        while (count < max) {
            count = makeTree(3, count, max, nodeDataArray, nodeDataArray[0]);

        }
        myDiagram.model = new go.TreeModel(nodeDataArray);


        function makeTree(level, count, max, nodeDataArray, parentdata) {
            var numchildren = Math.floor(Math.random() * 10);
            for (var i = 0; i < numchildren; i++) {
                if (count >= max) return count;
                count++;
                var childdata = { key: count, parent: parentdata.key };
                nodeDataArray.push(childdata);
                if (level > 0 && Math.random() > 0.5) {
                    count = makeTree(level - 1, count, max, nodeDataArray, childdata);
                }
            }
            return count;
        }

        // takes a property change on either isTreeLeaf or isTreeExpanded and selects the correct image to use
        function imageConverter(prop, picture) {
            var node = picture.part;
            if (node.isTreeLeaf) {
                //return "images/document.png";
                return "";
            } else {
                if (node.isTreeExpanded) {
                    //return "images/openFolder.png";
                    return "";
                } else {
                    //return "images/closedFolder.png";
                    return "";
                }
            }
        }

        //new code starts here

        // *********************************************************
        // First, set up the infrastructure to do HTML drag-and-drop
        // *********************************************************
        var reader: any,
            target: EventTarget;
        interface EventTarget { result: any; }

        // var el = document.getElementById('myDiagramDiv');
        // if (el) {
        //         addEventListener('click', function (e) {
        //        //toggleMenu();
        //   });
        // };

        var dragged = null; // A reference to the element currently being dragged

        // This event should only fire on the drag targets.
        // Instead of finding every drag target,
        // we can add the event to the document and disregard
        // all elements that are not of class "draggable"

        document.addEventListener("dragstart", function (event) {

            //if (event.target.className !== "draggable") return;

            //  Some data must be set to allow drag 
            event.dataTransfer.setData("text", "");

            //     store a reference to the dragged element
            dragged = event.target;
            //Objects during drag will have a red border

            //event.target.style.border = "2px solid red";

        }, false);
        //This event resets styles after a drag has completed (successfully or not)
        document.addEventListener("dragend", function (event) {
            //reset the border of the dragged element
            dragged.style.border = "";
        }, false);
        // Next, events intended for the drop target - the Diagram div

        var div = document.getElementById("myDiagramDiv");
        div.addEventListener("dragenter", function (event) {
            // Here you could also set effects on the Diagram,
            // such as changing the background color to indicate an acceptable drop zone
            //  Requirement in some browsers, such as Internet Explorer
            event.preventDefault();
        }, false);

        div.addEventListener("dragover", function (event) {
            //     We call preventDefault to allow a drop
            //     But on divs that already contain an element,
            //     we want to disallow dropping

            //if (event.target.className === "dropzone") {
            //   // Disallow a drop by returning before a call to preventDefault:
            // return;
            //}

            // Allow a drop on everything else
            event.preventDefault();
        }, false);


        div.addEventListener("dragleave", function (event) {
            //reset background of potential drop target
            //   if (event.target.className == "dropzone") {
            //     event.target.style.background = "";
            //  }
            //}, false);

            var remove = document.getElementById('remove');

            div.addEventListener("drop", function (event) {
                //  prevent default action
                // (open as link for some elements in some browsers)
                event.preventDefault();


                // Dragging onto a Diagram
                if (this === myDiagram.div) {
                    var can = event.target;
                    var pixelratio = window.devicePixelRatio;

                    //  if the target is not the canvas, we may have trouble, so just quit:
                    if (!(can instanceof HTMLCanvasElement)) return;

                    var bbox = can.getBoundingClientRect();
                    var bbw = bbox.width;
                    if (bbw === 0) bbw = 0.001;
                    var bbh = bbox.height;
                    if (bbh === 0) bbh = 0.001;
                    var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
                    var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
                    var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
                    myDiagram.startTransaction('new node');
                    myDiagram.model.addNodeData({
                        location: point,
                        text: dragged.textContent
                    });
                    myDiagram.commitTransaction('new node');

                    //         remove dragged element from its old location
                    //if (remove.checked) dragged.parentNode.removeChild(dragged);
                }


                //     If we were using drag data, we could get it here, ie:
                var data = event.dataTransfer.getData('text');
            }, false);

            //   // new code ends here
        });
}}


