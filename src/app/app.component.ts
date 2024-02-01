import { compileFactoryFunction } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LayerGroup, Map, Marker, TileLayer, } from 'leaflet';

//import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'osm_stackblitz';

  // map: Map = new Map('map',{}); //Map('element')
  // markers: LayerGroup= new LayerGroup();
  // baseLayer: TileLayer = new TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png',{
  //   maxZoom: 19,
  //   attribution: '&copy'
  // });

  map : Map | any;
  marker: Marker | any;
  markers: LayerGroup | any;
  baseLayer: TileLayer | any;
  fullScreenOption: FullscreenOptions | any;
  lat = 17.4065;
  lng = 78.4772;

  constructor(){}
  
  ngOnInit(): void {
    this.map = new Map('map',{}).setView([this.lat, this.lng],13);
    this.markers = new LayerGroup().addTo(this.map);
    this.baseLayer = new TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png',{
         maxZoom: 19,
         attribution: '&copy'
       }).addTo(this.map);
    this.marker = new Marker([this.lat, this.lng], {draggable: true}).addTo(this.markers).addTo(this.map);
    this.marker.on('dragend', (event: any) => this.onMarkerDragEnd(event));

  //   let map = L.map('map',{}).setView([17.4065, 78.4772], 13);
  //   var markers = L.layerGroup().addTo(map);

  //   L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map);
  
  }

  onMarkerDragEnd(event: any){
    var _marker = event.target;
    var position = _marker.getLatLng();

    this.reverseGeocoding(position.lat, position.lng);
  }

  addMarker(lat: any, lng: any){
    this.markers.clearLayers();
    this.marker = new Marker([lat,lng],{draggable: true}).addTo(this.markers).addTo(this.map);
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
    })
    .catch(error => {
      console.error("Error in reverse geocoding", error.message);
    });
  }

  onClick(){
    navigator.geolocation.getCurrentPosition((position) => {

      var cLat = position.coords.latitude;
      var cLng = position.coords.longitude;

      //display

      this.addMarker(cLat, cLng);
      this.map.setView([cLat,cLng],13);
    },
    (error) => {
      console.log("Error getting location: ", error.message);
    })
  }

}
