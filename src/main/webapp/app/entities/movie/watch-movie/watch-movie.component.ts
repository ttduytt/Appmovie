import { Component, AfterViewInit, inject, OnDestroy, HostListener, OnInit } from '@angular/core';
import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';
import { AccountService } from '../../../core/auth/account.service';
import { AccountCustom } from '../../../core/auth/accountCustom';
import { Account } from '../../../core/auth/account.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var YT: any; // Khai báo YouTube API

@Component({
  selector: 'jhi-watch-movie',
  standalone: true,
  imports: [],
  templateUrl: './watch-movie.component.html',
  styleUrl: './watch-movie.component.scss',
})
export class WatchMovieComponent implements AfterViewInit, OnInit, OnDestroy {
  player: any; // Đối tượng YouTube Player
  protected readonly movieService = inject(MovieService);
  protected readonly accountService = inject(AccountService);
  private route = inject(ActivatedRoute);

  //các biến để lấy thông tin user
  accountParsed: AccountCustom = {} as AccountCustom;
  accountState: Account = {} as Account;
  userId?: number;

  //biến để lấy thông tin movie
  movieId?: number;
  linkMovie?: string;
  movie: IMovie | null = null;

  sanitizedUrl: SafeResourceUrl = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.player = new YT.Player('youtube-player');

    setTimeout(() => {
      this.getProgress();
    }, 2000);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.movie = data['movie'];
      if (this.movie) {
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.linkMovie + 'enablejsapi=1');
        this.movieId = this.movie.id;
      }
    });

    this.getUserInfo();
  }

  playFromStartTime(cotinueMinute: number) {
    const startTimeInSeconds = cotinueMinute * 60; // Chuyển từ phút thành giây (2 phút = 120 giây)
    if (this.player) {
      this.player.seekTo(startTimeInSeconds, true); // Tua video đến thời gian đã xác định
      this.player.playVideo(); // Phát video từ thời điểm đã tua
    }
  }

  // Lấy số phút hiện tại của video
  getCurrentTime() {
    if (this.player && this.player.getCurrentTime) {
      const currentTimeInSeconds = this.player.getCurrentTime(); // Lấy thời gian hiện tại bằng giây
      const minutes = Math.floor(currentTimeInSeconds / 60); // Tính số phút
      const seconds = Math.floor(currentTimeInSeconds % 60); // Tính số giây còn lại
      return { minutes };
    }
    return { minutes: 0 };
  }

  getUserInfo() {
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.accountState = account;
        this.accountParsed = JSON.parse(JSON.stringify(this.accountState));
        this.userId = this.accountParsed.id;
      }
    });
  }

  saveProgressWatch() {
    if (this.userId && this.movieId) {
      this.movieService.saveToProgressWatch(this.userId, this.movieId, 1, this.getCurrentTime().minutes).subscribe();
    } else {
      console.log(this.movieId, this.userId);
    }
  }

  getProgress() {
    if (this.userId && this.movieId) {
      this.movieService.getProgressWatch(this.userId, this.movieId).subscribe(data => {
        const agreeContinute = confirm(
          `Lần trước bạn đang xem đến tập ${data.episode} phút thứ ${data.minute}. Bạn có muốn tiếp tục không?`,
        );
        if (agreeContinute) {
          this.playFromStartTime(data.minute);
        }
      });
    }
  }

  ngOnDestroy() {
    this.saveProgressWatch();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    this.saveProgressWatch();
  }
}
