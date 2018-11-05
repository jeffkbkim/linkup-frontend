/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  private currentLat;
  private currentLong;
  marker: google.maps.Marker;
  
  constructor(private _socketService: SocketService, private _route: ActivatedRoute,
              private _router: Router) {
              }

  ngOnInit() {
    currPos: navigator.geolocation.getCurrentPosition(pos => {
      const mapProp = {
      
        center: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.locateMe();
    });
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
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitute);
    console.log(location);
    this.map.panTo(location);

    if (!this.marker) {
      console.log(location);
      console.log(this.map);
      console.log(this.marker);
      // this.marker = new google.maps.Marker({
      //   position: location,
      //   map: this.map,
      //   title: 'Found you.'
      // });
      console.log('hello here.');
    } else {
      this.marker.setPosition(location);
    }
  }

  
}
