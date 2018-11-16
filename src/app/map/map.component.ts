/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { SocketService } from '../socket.service';

export interface UserPosition {
  userId: number,
  groupId: number,
  lat: number,
  lng: number,
  timestamp: number
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat: number;
  lng: number;
  map: google.maps.Map;
  private groupId = 100;
  private userId: number;
  posMap: Map<number, UserPosition> = new Map();
  positionKeys = Object.keys;

  constructor(
    private _socketService: SocketService, 
    public gMap : GoogleMapsAPIWrapper
  ) { }

  ngOnInit() {
    this._socketService.userIdSubject.subscribe((userId: number) => {
      if (userId == null) return;
      this.userId = userId;
      this.locateMe();
      this.listenToGroup(this.groupId);
    });
  }

  locateMe(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        const userPosition : UserPosition = {
          userId : this.userId,
          groupId: this.groupId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp
        }
        this._socketService.socket.emit(`groupId: ${this.groupId}`, userPosition);
        this.showTrackingPosition(position);
      })
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  showTrackingPosition(position): void {
    
  }

  public markerClicked = (markerObj) => {
    const position = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
    this.map.panTo(position);
  }

  listenToGroup(groupId: number) {
    this._socketService.socket.on(`groupId: ${groupId}`, (position: UserPosition) => {
      console.log('groupId msg');
      this.posMap.set(position.userId, position);
      console.log(position);
      console.log(this.posMap);
    });
  }

  mapReady(map) : void {
    this.map = map;
    this.map.setZoom(15);
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
  }

  get userIds() {
    return Array.from(this.posMap.keys());
  }

}
