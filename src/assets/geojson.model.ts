// geojson.model.ts

export interface GeoJSONFeature {
    type: string;
    properties: any;
    geometry: {
      type: string;
      coordinates: number[][][]; 
    };
  }
  
  export interface GeoJSON {
    type: string;
    features: GeoJSONFeature[];
  }
  