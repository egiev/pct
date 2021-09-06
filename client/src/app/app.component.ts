import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'
import { environment } from 'config'
import { HttpClient } from '@angular/common/http';
import * as turf from '@turf/turf'

import {municipalities} from '../shared/municipality'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  pangasinan_case: any;

  map: mapboxgl.Map
  style = 'mapbox://styles/movah4ch/ck92e31360ot11io62dbea7so';
  lat = 15.920000;
  lng = 120.330002;

  municipalities:any = municipalities

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.access_token,
      container: 'map',
      style: this.style,
      zoom: 10,
      minZoom: 8,
      maxZoom: 11,
      center: [this.lng, this.lat]
    });

    this.http.get('http://localhost:3000/api/features/').subscribe((res:any) => {
      this.pangasinan_case = res

      const geojson = res.data.features.map(i => ({
        type: i.type,
        geometry: i.geometry,
        properties: i.properties
      }))

      this.map.on('load', () => {
        this.map.addSource('municipalities', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: geojson
          }
        })

        this.map.addLayer({
          'id': `covid`,
          'type': 'fill',
          'source': 'municipalities',
          'paint': {
            'fill-color': 'red',
            'fill-opacity': 0.4
          },
          'filter': ['!=', 'TOTAL', 0],
        })

        this.map.on('click', 'covid', (e) => {
          let { NAME_2, TOTAL, DIED, RECOVERED } = e.features[0].properties
          let html = `
            <h3>${NAME_2}</h3>
            <p>Confirmed: ${TOTAL}</p>
            <p>Died: ${DIED}</p>
            <p>Recoverd: ${RECOVERED}</p>`

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(this.map);
        });
      })
    })



    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }
}
