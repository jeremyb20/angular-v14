import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})

export class NotFoundComponent implements OnInit {
  locationBack:any;
  constructor(private location: Location) { 
    this.locationBack = location;
  }

  ngOnInit(): void {
    //oninit
  }

  back(){
    this.locationBack.back()
  }

}
