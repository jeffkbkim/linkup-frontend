/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { SocketService } from '../socket.service';

export interface UserPosition {
  userId: number,
  groupId: number,
  lat: number,
  lng: number,
  timestamp: number,
  isDisconnected: boolean
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
  private buttonToggled = false;
  posMap: Map<number, UserPosition> = new Map();
  positionKeys = Object.keys;

  constructor(
    private _socketService: SocketService,
    public gMap: GoogleMapsAPIWrapper
  ) { }

  ngOnInit() {
    const innerWidth = window.innerWidth;
    if (innerWidth > 700) {
      let elem: HTMLElement = document.getElementById('outer');
      elem.setAttribute("style", "height: 300px; width: 35%");
    }
    this._socketService.userIdSubject.subscribe((userId: number) => {
      if (userId == null || this.userId != null) return;
      this.userId = userId;
      console.log(this.userId);
      
      if (this.userId != 0) this.locateMe();
      else {
        this.lat = 33.778131;
        this.lng = -84.396452;
      }
      this.listenToGroup(this.groupId);
    });
  }

  locateMe(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {        
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        const userPosition: UserPosition = {
          userId: this.userId,
          groupId: this.groupId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
          isDisconnected: false
        }
        this._socketService.socket.emit(`groupId: ${this.groupId}`, userPosition);
      }, (err) => {
        console.log(err);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  public markerClicked = (markerObj, userId) => {
    console.log(userId);
    const position = new google.maps.LatLng(markerObj.latitude, markerObj.longitude);
    this.map.panTo(position);
  }

  listenToGroup(groupId: number) {
    this._socketService.socket.on(`groupId: ${groupId}`, (position: UserPosition) => {
      if (position.isDisconnected && !this.posMap.has(position.userId)) return;
      this.posMap.set(position.userId, position);
      console.log(this.posMap);
    });
  }

  mapReady(map): void {
    this.map = map;
    this.map.setZoom(17);
    this.map.setCenter(new google.maps.LatLng(this.lat, this.lng));
  }

  get userIds() {
    return Array.from(this.posMap.keys());
  }

  getIconPath(userId: number): string {
    const default_path = './assets/images/';
    if (this.userId == userId) return default_path + 'default_icon.svg';
    if (!this.posMap.get(userId).isDisconnected) return default_path + 'blue_icon.svg';
    return default_path + 'orange_icon.svg';
  }

  labelOptions(userId: number): string {
    return "" + userId;
  }

  toggleButton() {
    const stampsFieldLocation: UserPosition = {
      userId: this.userId,
      groupId: this.groupId,
      lat: this.lat,
      lng: this.lng,
      timestamp: 0,
      isDisconnected: this.buttonToggled
    }
    this._socketService.socket.emit(`groupId: ${this.groupId}`, stampsFieldLocation);
    this.buttonToggled = !this.buttonToggled;
  }
}
