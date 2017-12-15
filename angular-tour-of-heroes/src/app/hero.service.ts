import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap} from "rxjs/operators";


import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service'


@Injectable()
export class HeroService {
  private heroesUrl = 'https://ng-5-ps-herotour.firebaseio.com/heroes.json';
  private updUrl = 'https://ng-5-ps-herotour.firebaseio.com/heroes';

  constructor(private messageService: MessageService,
              private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    //TODO Send the message _after_ fetching heroes arr
    return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(heroes => this.log(`Fetched heroes`)),
          catchError(this.handleError('getHeroes',[]))
        );
  }
  updateHero(hero: Hero): Observable<any>{
    const url = `${this.updUrl}/${hero.id}.json`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.put(url, hero, httpOptions).pipe(
      tap( _ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.patch<Hero>(`${this.updUrl}.json`, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/?orderBy=%22id%22&equalTo=%22${id}%22`;
    //TODO Send the message _after_ fetching heroes arr
    return this.http.get<Hero>(url).pipe(
      tap( _ => this.log(`fetched hero id=${id}`)),
      map((hero):Hero =>{
        for (let i in hero){
          console.log(`i`,hero[i])
          hero[i].id = i;
          return hero[i];
        }
      }),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }
  private log(message: string){
    this.messageService.add('Hero Service: '+ message);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error('Console error occurred: ', error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
