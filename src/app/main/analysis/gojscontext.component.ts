import { Component,Directive,Injector,CUSTOM_ELEMENTS_SCHEMA,NgModule,Injectable,ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AlertModule } from 'ng2-bootstrap';
import { CreateAnalysisComponent } from '../analysis/create-analysis-studio';

declare var go:any;
declare var diagramDivContext:any;
declare var nativeElement:any;
declare var d:any;

@Component({
   
    selector: 'context-app',
    templateUrl: './gojscontext.component.html',
    animations: [appModuleAnimation()],
   // providers:[gojsComponent]
})

@NgModule({
    declarations:[gojscontextComponent],  
     schemas:[CUSTOM_ELEMENTS_SCHEMA]
 })

//@Directive({selector:'[go-Pallete]'})

@Injectable()
export class gojscontextComponent extends AppComponentBase {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    
    @ViewChild('myDiagramDivContext') div;

    ngAfterViewInit(){
      
      //debugger;
        // create a make type from go namespace and assign it to MAKE
        const MAKE = go.GraphObject.make;

        // get the div in the HTML file
        const diagramDivContext = this.div.nativeElement;
        //{

        //    desiredSize: new go.Size(120, 40)
        //};
         
        //instantiate MAKE with Diagram type and the mydiagramDivContext
                const myDiagramContext  = MAKE(go.Diagram, diagramDivContext,  // create a Diagram for the DIV HTML element
                  {
                    initialContentAlignment: go.Spot.Center,  // center the content
                    "linkingTool.isEnabled": false,  // invoked explicitly by drawLink function, below
                    "linkingTool.direction": go.LinkingTool.ForwardsOnly,  // only draw "from" towards "to"
                    "undoManager.isEnabled": true  // enable undo & redo
                  });
                
        // the template we defined earlier
     // Div nodeTemplate code starts here
      myDiagramContext.nodeTemplate =
      MAKE(go.Node, "Auto",
        {
          desiredSize: new go.Size(120, 40),
          // rearrange the link points evenly along the sides of the nodes as links are
          // drawn or reconnected -- these event handlers only make sense when the fromSpot
          // and toSpot are Spot.xxxSides
          linkConnected: function(node, link, port) {
            if (link.fromNode !== null) link.fromNode.invalidateConnectedLinks();
            if (link.toNode !== null) link.toNode.invalidateConnectedLinks();
          },
          linkDisconnected: function(node, link, port) {
            if (link.fromNode !== null) link.fromNode.invalidateConnectedLinks();
            if (link.toNode !== null) link.toNode.invalidateConnectedLinks();
          },
          locationSpot: go.Spot.Center
        },
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
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
            fromSpot: go.Spot.AllSides, fromLinkable: true,
            fromLinkableDuplicates: true, fromLinkableSelfNode: true,
            toSpot: go.Spot.AllSides, toLinkable: true,
            toLinkableDuplicates: true, toLinkableSelfNode: true
          }, 
          new go.Binding("fill", "color").makeTwoWay()),
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
      );

    // a selected node shows an Adornment that includes both a blue border
    // and a row of Buttons above the node

    //debugger;
    myDiagramContext.nodeTemplate.selectionAdornmentTemplate =
      MAKE(go.Adornment, "Spot",
        MAKE(go.Panel, "Auto",
          MAKE(go.Shape, { stroke: "white", strokeWidth: 0, fill: null }),
          MAKE(go.Placeholder)
        ),
        MAKE(go.Panel, "Horizontal",
          { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom },
          MAKE("Button",
            { click: editText },  // defined below, to support editing the text of the node
            MAKE(go.TextBlock, "t",
              { font: "bold 10pt sans-serif", desiredSize: new go.Size(15, 15), textAlign: "center" })
          ),
          MAKE("Button",
            { click: changeColor, "_buttonFillOver": "transparent" },  // defined below, to support changing the color of the node
            new go.Binding("ButtonBorder.fill", "color", nextColor),
            MAKE(go.Shape,
              { fill: null, stroke: null, desiredSize: new go.Size(14, 14) })
          ),
          MAKE("Button",
            { // drawLink is defined below, to support interactively drawing new links
              click: drawLink,  // click on Button and then click on target node
              actionMove: drawLink  // drag from Button to the target node
            },
            MAKE(go.Shape,
              { geometryString: "M0 0 L8 0 8 12 14 12 M12 10 L14 12 12 14" })
          ),
         MAKE("Button",
            {
              actionMove: dragNewNode,  // defined below, to support dragging from the button
              _dragData: { text: "a Node", color: "lightgray" },  // node data to copy
              click: clickNewNode  // defined below, to support a click on the button
            },
            MAKE(go.Shape,
              { geometryString: "M0 0 L3 0 3 10 6 10 x F1 M6 6 L14 6 14 14 6 14z", fill: "gray" })
          )
        )
      );
      function editText(e, button) {
      var node = button.part.adornedPart;
      e.diagram.commandHandler.editTextBlock(node.findObject("TEXTBLOCK"));
    }

    // used by nextColor as the list of colors through which we rotate
    var myColors = ["lightgray", "lightblue", "lightgreen", "yellow", "orange", "pink","Red","#A6E3EC",
    "#F53546","#F0F8FF","#36393E","#B0D4EA","#C79BBF","#263238","#FF8247","#D8E3EC","#EAEAEA","#E8E8E8","#F0F8FF"];

    // used by both the Button Binding and by the changeColor click function
    function nextColor(c) {
      var idx = myColors.indexOf(c);
      if (idx < 0) return "lightgray";
      if (idx >= myColors.length-1) idx = 0;
      return myColors[idx+1];
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

    // used by both clickNewNode and dragNewNode to create a node and a link
    // from a given node to the new node
    function createNodeAndLink(data, fromnode) {
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
      newnode.location = new go.Point(fromnode.location.x + 200, fromnode.location.y);
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
        newnode.location = e.diagram.lastInput.documentPoint;
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
    var tool = myDiagramContext.toolManager.draggingTool;
    tool.doDeactivate = function() {
      // commit "button drag" transaction, if it is ongoing; see dragNewNode, above
      if (tool.diagram.undoManager.nestedTransactionNames.elt(0) === "button drag") {
        tool.diagram.commitTransaction();
      }
      go.DraggingTool.prototype.doDeactivate.call(tool);  // call the base method
    };


    myDiagramContext.model = new go.GraphLinksModel(
    [
      { key: 1, imgsrc: "1490114956_plus.svg"  ,text: "Source Reader", color: "lightblue", location: "0 0" },
      { key: 2, text: "Sampler", color: "orange", location: "140 0" },
      { key: 3, text: "Cleanser", color: "lightgreen", location: "0 140" },
      { key: 4, text: "Model", color: "pink", location: "140 140" },
      { key: 5, text:"Destination Writer",color:"lightblue",location:"0 250"},
      { key: 6, text:"Fuction",color:"#36393E",location:"140 250"}
    ],
    [
      { from: 1, to: 2 },
      { from: 3, to: 4 },
      { from: 5, to: 6 }
    ]);

    myDiagramContext.findNodeForKey(6).isSelected = true;
 


     //2nd Div nodeTemplate code ends here
          

// define a Link template that routes orthogonally, with no arrowhead

      diagramDivContext.linkTemplate=MAKE(go.Link);
      // // with lines



      // 2nd Div linkTemplate Code starts here
       diagramDivContext.linkTemplate =
             MAKE(go.Link,
                { routing: go.Link.AvoidsNodes, corner: 5 },
                    MAKE(go.Shape, { strokeWidth: 1.5 }),
                     MAKE(go.Shape, { toArrow: "OpenTriangle" })
                );
        //2nd Div linkTemplate code ends
  }

}