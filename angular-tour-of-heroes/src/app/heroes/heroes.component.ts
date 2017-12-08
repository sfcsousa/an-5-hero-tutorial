import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes = HEROES;
  selectdHero: Hero;
  constructor() { }
  
  onSelect(hero: Hero): void{
    this.selectdHero = hero;
  }
  ngOnInit() {
      console.log( HEROES);
  }

}
