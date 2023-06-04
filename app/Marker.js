define([
  "esri/geometry/Point",
  "esri/layers/GraphicsLayer",
  "esri/PopupTemplate",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/Graphic",
  "esri/request"
], function(
  Point, GraphicsLayer, PopupTemplate, PictureMarkerSymbol, SimpleMarkerSymbol, Graphic, esriRequest) {
  var graphicsLayer;
  var data;

  function readJson() {
    return new Promise((resolve, reject) => {
      esriRequest("./data/AB_NYC_2019.json", {
        responseType: "json"
      }).then(function(response) {
        resolve(response.data);
      }).catch(function(error) {
        console.error("Error reading JSON file:", error);
        reject(error);
      });
    });
  }

  function drawPoint(item) {
    var point = new Point({
      longitude: item.longitude,
      latitude: item.latitude
    });
    var symbol = new SimpleMarkerSymbol({
      color: "red",
      style: "diamond"
    });
    var pictureSymbol=new PictureMarkerSymbol({
        url:"./data/plane.png",
        width: "20px",
        height: "20px"
    })
    var attributes = {
      "id": item.id,
      "name": item.name,
      "host_id": item.host_id,
      "host_name": item.host_name,
      "neighbourhood_group": item.neighbourhood_group,
      "neighbourhood": item.neighbourhood,
      "room_type": item.room_type,
      "price": item.price,
      "minimum_nights": item.minimum_nights,
      "number_of_reviews": item.number_of_reviews,
      "last_review": item.last_review,
      "reviews_per_month": item.reviews_per_month,
      "calculated_host_listings_count": item.calculated_host_listings_count,
      "availability_365": item.availability_365
    };
    var graphic = new Graphic({
      geometry: point,
      symbol: pictureSymbol,
      attributes: attributes
    });
    return graphic;
  }

  function generatePopupContent(attributes) {
    var content = "";
    for (var key in attributes) {
      content += "<b>" + key + ":</b> " + attributes[key] + "<br>";
    }
    return content;
  }

  function dynamicMarker(jsonData, view, graphicsLayer) {
    view.when(function() {
        graphicsLayer.removeAll();
        var extent = view.extent;
        var num = 0;
        var graphics = [];
        try {
            var filteredData = jsonData.filter(function(item) {
                return extent.contains(new Point({
                    longitude: item.longitude,
                    latitude: item.latitude
                }));
            });
            filteredData.forEach(function(item) {
                if (num < 50) {
                    var graphic = drawPoint(item);
                    graphics.push(graphic);
                    num++;
                }
            });

            graphicsLayer.addMany(graphics);
        }
        catch(error) {
            console.error("Error:", error);
        }
    });
  };


  return {
    DrawPoint: function(view) {
      readJson().then(function(jsonData) {
        data = jsonData;
        graphicsLayer = new GraphicsLayer();
        view.map.add(graphicsLayer);
        dynamicMarker(data, view, graphicsLayer);
      }).catch(function(error) {
        console.error("Error reading JSON file:", error);
      });

      view.watch("scale", function(newScale, oldScale) {
        dynamicMarker(data, view, graphicsLayer);
        graphicsLayer.graphics.forEach(function(graphic) {
        });
      });

      //view.whenLayerView(graphicsLayer).then(function(layerView) {
        view.on("click", function(event) {
          view.hitTest(event).then(function(response) {
            var feature = response.results[0].graphic;
            if (feature && feature.layer === graphicsLayer) {
              view.popup.open({
                title: feature.attributes.name,
                content: generatePopupContent(feature.attributes),
                location: event.mapPoint
              });
            } else {
              view.popup.close();
            }
          });
        });
    }
  };
});
