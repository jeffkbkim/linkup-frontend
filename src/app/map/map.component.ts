import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat: number;
  lng: number;
  map: google.maps.Map;

  constructor(
    private _socketService: SocketService, 
    public gMap : GoogleMapsAPIWrapper
  ) { }

  ngOnInit() {
    this.locateMe();
  }

  locateMe(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        console.log(position);
        this._socketService.socket.emit('single-user-location', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        });
        this.showTrackingPosition(position);
      })
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  showTrackingPosition(position): void {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  public markerClicked = (markerObj) => {
    const position = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
    this.map.panTo(position);
  }

  protected mapReady(map) {
    this.map = map;
    this.map.setZoom(15);
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
  }

}
