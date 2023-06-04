define([
  "esri/widgets/Search",
  "esri/layers/GraphicsLayer"
], function(Search,GraphicsLayer) {
  var graphicsLayer=new GraphicsLayer();
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
  function drawPoint(item,graphicsLayer) {
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
    graphicsLayer.add(graphic);
  }
  readJson().then(function(jsonData) {
    data = jsonData;
    data.forEach(function(item){
        drawPoint(item,graphicsLayer);
    })
  })

  return {

    initialize: function(view, field, state) {
      this.view = view;
      this.search = new Search({
        view: view,
        sources: [{
          layer: graphicsLayer,
          outFields: ["*"],
          autoNavigate: true,
          searchFields: [field],
          displayField: field,
          exactMatch: false,
          placeholder: "Ex: Empire State Building",
          popup: null,
          popupOpenOnSelect: false
        }],
        maxResults: 10,
        popupOpenOnSelect: false,
        resultGraphicEnabled: false,
        popUpEnabled: false,
        includeDefaultSources: false
      });

      this.search.on("select-result", function(event) {
        var feature = event.result.feature;
        var key, keys = Object.keys(feature.attributes);
        var n = keys.length;
        var newobj = {};
        while (n--) {
          key = keys[n];
          newobj[key.toLowerCase()] = feature.attributes[key];
        }
        feature.attributes = newobj;
        state.selectedBuilding = feature;
      });

      view.ui.add(this.search, {
        position: "top-right"
      });
    }
  };
});
