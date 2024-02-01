import { compileFactoryFunction } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LayerGroup, Map, TileLayer } from 'leaflet';

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
  markers: LayerGroup | any;
  baseLayer: TileLayer | any;

  constructor(){
    // this.map.setView([17.4065,78.4772],13);
    // this.markers.addTo(this.map);
    // this.baseLayer.addTo(this.map);
  }
  
  ngOnInit(): void {
    this.map = new Map('map',{}).setView([17.4065,78.4772],13);
    this.markers = new LayerGroup().addTo(this.map);
    this.baseLayer = new TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png',{
         maxZoom: 19,
         attribution: '&copy'
       }).addTo(this.map);

  //   let map = L.map('map',{}).setView([17.4065, 78.4772], 13);
  //   var markers = L.layerGroup().addTo(map);

  //   L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map);
  
  }

}
