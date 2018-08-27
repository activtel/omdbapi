import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  movies: Movie[];
  loader = false;
  private searchFilter = new Subject<string>();

  constructor(private movieService: MovieService) { }

  search(name: string): void {
    if (name) {
      this.searchFilter.next(name);
    }
  }

  ngOnInit() {
    const movies$ = this.searchFilter.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((search: string) => {
        this.loader = true;
        return this.movieService.getMovieByName(search);
      }));

    movies$.subscribe(res => {
      this.loader = false;
      if (res.Error) {
        this.movies = [];
        return;
      }

      this.movies = res.Search;
    });
  }
}
