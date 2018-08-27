import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, tap, catchError } from 'rxjs/operators';

import { Response } from './response';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private omdbApiUrl = 'http://www.omdbapi.com/?apikey=b5c1aba0';

  movies: BehaviorSubject<Movie[]>;
  private movies$: Observable<Movie[]>;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('movies')) {
      this.movies = new BehaviorSubject<Movie[]>(JSON.parse(localStorage.getItem('movies')));
    } else {
      this.movies = new BehaviorSubject<Movie[]>([]);
    }

    this.movies$ = this.movies.asObservable();
  }

  getMovies(): Observable<Movie[]> {
    return this.movies$;
  }

  addMovie(movie: Movie): void {
    this.movies$.pipe(take(1))
      .subscribe(movies => {
        if (!movies.filter(m => m.imdbID === movie.imdbID).length) {
          const newArr = [...movies, movie];
          localStorage.setItem('movies', JSON.stringify(newArr));
          this.movies.next(newArr);
        }
      });
  }

  deleteMovie(movie: Movie): void {
    this.movies$.pipe(take(1))
      .subscribe(movies => {
        const newArr = movies.filter(m => m.imdbID !== movie.imdbID);
        localStorage.setItem('movies', JSON.stringify(newArr));
        this.movies.next(newArr);
      });
  }

  getMovieById(id: string): Observable<Movie> {
    if (!id.trim()) {
      return of(new Movie());
    }

    return this.http.get<Movie>(`${this.omdbApiUrl}&i=${id}`);
  }

  getMovieByName(name: string): Observable<Response> {
    if (!name.trim()) {
      return of(new Response());
    }

    return this.http.get<Response>(`${this.omdbApiUrl}&s=${name}`);
  }
}
