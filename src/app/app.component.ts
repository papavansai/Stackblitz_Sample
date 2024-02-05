import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LayerGroup, Map, Marker, TileLayer, IconOptions } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.fullscreen';

declare const Autocomplete: any;
declare module 'leaflet' {
  namespace Control {
    class FullScreen extends Control {
      constructor(options?: FullscreenOptions);
    }
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'osm_stackblitz';

  map : Map | any;
  marker: Marker | any;
  markers: LayerGroup | any;
  baseLayer: TileLayer | any;
  fullScreenOption: FullscreenOptions | any;
  lat = 17.4065;
  lng = 78.4772;
  data: any;
  display_name: any;
  icon = L.icon({
    iconSize: [25, 41],
   iconAnchor: [10, 41],
   popupAnchor: [2, -40],
   iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
   shadowUrl:
     "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
 });

 geoJsonData: any;
 geoJsonLayer: any;
_isgeoJson: boolean = false;
  constructor(private http: HttpClient){
    http.get('assets/test.geojson').subscribe((data)=> {
      this.geoJsonData = data;
    });
  }
  
  ngOnInit(): void {
    this.map = new Map('map',{}).setView([this.lat, this.lng],13);
    this.markers = new LayerGroup().addTo(this.map);
    this.baseLayer = new TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png',{
         maxZoom: 19,
         attribution: '&copy ...'
       }).addTo(this.map);
    this.addMarker(this.lat, this.lng);
    this.initializeAutocomplete();
    this.addFullscreenControl();
  }

  private addFullscreenControl(): void {
    // Add the fullscreen control to the map
    const fullscreenControl = new L.Control.FullScreen();
    this.map.addControl(fullscreenControl);
  }

  onMarkerDragEnd(event: any){
    var _marker = event.target;
    var position = _marker.getLatLng();
    this.reverseGeocoding(position.lat, position.lng);
  }

  addMarker(lat: any, lng: any){
    this.markers.clearLayers();
    this.marker = new Marker([lat,lng],{icon: this.icon, draggable: true}).addTo(this.markers).addTo(this.map);
    this.marker.bindPopup('latitude: '+lat+'<br> longitude: '+lng ).openPopup();
    this.map.setView([lat,lng],13);
    this.marker.on('dragend', (event: any) => this.onMarkerDragEnd(event));

    this.reverseGeocoding(lat,lng);
  }

  public reverseGeocoding(lat: any, lng: any){
    console.log(`ReverseGeocoding Initiated with latitude: ${lat} and longitude: ${lng}`);

    var apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.data = data;
      this.display_name = data.display_name
    })
    .catch(error => {
      console.error("Error in reverse geocoding", error.message);
    });
  }

  onClick(){
    navigator.geolocation.getCurrentPosition((position) => {

      var cLat = position.coords.latitude;
      var cLng = position.coords.longitude;

      this.addMarker(cLat, cLng);
      this.map.setView([cLat,cLng],13);
    },
    (error) => {
      console.log("Error getting location: ", error.message);
    })
  }

  // toggleGeoJsonLayer() {
  //   if (this.geoJsonLayer) {
  //     if (this.map.hasLayer(this.geoJsonLayer)) {
  //       this.map.removeLayer(this.geoJsonLayer);
  //     } else {
  //       this.geoJsonLayer.addTo(this.map);
  //     }
  //   }
  // }

  toggleGeoJSONLayer(){
if (!this._isgeoJson){
  this.geoJsonLayer = L.geoJson(this.geoJsonData);
  this.geoJsonLayer.addTo(this.map);
  this._isgeoJson = true;
}
else if (this._isgeoJson){
  this.map.removeLayer(this.geoJsonLayer);
  this._isgeoJson = false;
}
}

  initializeAutocomplete(){
    new Autocomplete("search", {
      selectFirst: true,
      howManyCharacters: 2,
    
      // onSearch
      onSearch: ({ currentValue }: { currentValue: string }) => {
        const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&city=${encodeURI(currentValue)}`;
        return new Promise<any[]>((resolve) => {
          fetch(api)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              resolve(data.features);
            })
            .catch((error) => {
              console.error(error);
            });
        });
      },
      onResults: ({ currentValue, matches, template }: { currentValue: any; matches: any; template: any }) => {
        const regex = new RegExp(currentValue, "gi");
    
        return matches === 0
          ? template
          : matches
              .map((element: any) => {
                return `<li class='loupe'> <p>${element.properties.display_name.replace(regex, (str: string) => `<b>${str}</b>`)} </p></li>`;
              })
              .join("");
      },
      onSubmit: ({ object }: { object: any }) => {
        this.map.eachLayer( (layer: any) => {
          if (!!layer.toGeoJSON) {
            this.map.removeLayer(layer);
          }
        });
    
        const { display_name } = object.properties;
        const [lng, lat] = object.geometry.coordinates;
    
        this.marker = L.marker([lat, lng], {
          title: display_name,
          draggable: true,
        });
    
        this.marker.addTo(this.markers).addTo(this.map);
        this.marker.bindPopup(display_name);
        this.map.setView([lat, lng], 13);
    
        //this.marker.on('dragend', this.onMarkerDragEnd);
        this.marker.on('dragend', (event: any) => this.onMarkerDragEnd(event));
      },
      onSelectedItem: ({ index, element, object }: { index: number; element: any; object: any }) => {
        console.log("onSelectedItem:", index, element, object);
      },
      noResults: ({ currentValue, template }: { currentValue: string; template:any }) => template(`<li>No results found: "${currentValue}"</li> `),
    });
    
  }

}
