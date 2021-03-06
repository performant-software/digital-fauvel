---
layout: null
---

var config = {
  "id": "viewer",
  "workspaceType": "bookReading",
  "saveSession" : false,  // whether or not to store session to local storage
  "data": [
    { "manifestUri": "{{ site.manifest_url }}", "location": "Digital Fauvel IIIF Server" }
  ],
  "workspaces" : {
    "singleObject": {
      "label": "Single Object",
      "addNew": false,
      "move": false,
      "iconClass": "image"
    },
    "compare": {
      "label": "Compare",
      "iconClass": "columns"
    },
    "bookReading": {
      "defaultWindowOptions": {
      },
      "label": "Book Reading",
      "addNew": true,
      "move": false,
      "iconClass": "book"
    }
  },
  "windowObjects": [{
    "loadedManifest": "{{ site.manifest_url }}",
    "canvasID": "{{ site.first_page }}",
    "viewType": "BookView",
    "bottomPanel" : true,
    "sidePanel" : true,
    "annotationLayer" : true
  }],
  "i18nPath" : "locales/",
  "mainMenuSettings": {
    "show": true,
    "buttons" : {
      "bookmark" : false,
      "layout" : true,
      "options" : false,
      "fullScreenViewer": true
    }
    //"height": 25,
    //"width": "100%"
  },
  "annotationEndpoint": {
    "name":"Local Storage",
    "module": "LocalStorageEndpoint"
  },
  "availableAnnotationDrawingTools": [
     "Rectangle"
  ],
  "availableAnnotationStylePickers": [],

  // "jsonStorageEndpoint": {
  //   "name": "JSONBlob API Endpoint",
  //   "module": "JSONBlobAPI",
  //   "options": {
  //     "ssl": true,
  //     "port": "443",
  //     "host": "jsonblob.com"
  //   }
  // },

  "windowSettings": {
    "availableViews" : ["ThumbnailsView", "ImageView", "BookView"], //any subset removes others
    "viewType" : "BookView", //one of [_"ThumbnailsView"_, "ImageView", "ScrollView", "BookView"] - if using availableViews, must be in subset

    "sidePanel" : true, //whether or not to make the side panel available in this window
    //control what is available in the side panel. if "sidePanel" is false, these options won"t be applied
    "sidePanelVisible" : true, //whether or not to make the side panel visible in this window on load. This setting is dependent on sidePanel being true
    "sidePanelOptions" : {
      "toc" : true,
      "annotations" : true,
      "tocTabAvailable": true,
      "layersTabAvailable": false,
      "searchTabAvailable": false
    },

    "bottomPanel" : true, //whether or not to make the bottom panel available in this window
    "bottomPanelVisible" : false, //whether or not to make the bottom panel visible in this window on load. This setting is dependent on bottomPanel being true

    "overlay" : true, //whether or not to make the metadata overlay available/visible in this window
    "fullScreen" : true, //whether or not to make the window"s fullScreen button visible to user
    "canvasControls": { // The types of controls available to be displayed on a canvas
      "imageManipulation" : {
        "manipulationLayer" : false,
      },
      "annotations": {
        "annotationLayer": true,
        "annotationCreation" : true,
        "annotationState": "on",
        "annotationRefresh" : true, //whether or not to display the refresh icon for annotations
      }
    }
  }
}
