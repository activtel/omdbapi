import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  loader = true;

  constructor(private route: ActivatedRoute, private location: Location, private movieService: MovieService) { }

  ngOnInit() {
    this.getMovie();
  }

  getMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.movieService.getMovieById(id)
      .subscribe(movie => {
        this.loader = false;
        this.movie = movie;
      });
  }

  add(movie: Movie): void {
    this.movieService.addMovie(movie);
  }
}
