import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { VERSION } from 'app/app.constants';
import { AccountService } from '../../core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import NavbarItem from './navbar-item.model';
import { FormsModule } from '@angular/forms';
import { Account } from '../../core/auth/account.model';
import { AccountCustom } from '../../core/auth/accountCustom';
import { MovieService } from '../../entities/movie/service/movie.service';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective, FormsModule],
})
export default class NavbarComponent implements OnInit {
  accountParsed: AccountCustom = {} as AccountCustom;
  accountState: Account = {} as Account;
  userId?: number;
  keyUsersearch = '';
  listHistorySearch: string[] = [];
  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  openAPIEnabled?: boolean;
  version = '';
  account = inject(AccountService).trackCurrentAccount();
  entitiesNavbarItems: NavbarItem[] = [];
  private readonly accountService = inject(AccountService);
  private readonly movieService = inject(MovieService);

  private readonly loginService = inject(LoginService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  constructor() {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.accountState = account;
        this.accountParsed = JSON.parse(JSON.stringify(this.accountState));
        this.userId = this.accountParsed.id;
      }
    });

    if (this.userId !== undefined) {
      this.movieService.getHistorySearch(this.userId).subscribe(listHistory => {
        this.listHistorySearch = listHistory;
      });
    }
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }

  updateHistorySearch(): void {
    if (this.userId !== undefined) {
      this.movieService.getHistorySearch(this.userId).subscribe(listHistory => {
        this.listHistorySearch = listHistory;
      });
    }
  }

  // hàm khi người dùng nhấn tìm kiếm
  searchMovie(inputField: any): void {
    if (inputField instanceof HTMLInputElement) {
      inputField.blur();
    }
    this.router.navigate(['/movie/searchMovie']);

    //  code gọi hàm lấy ra movie theo key user nhập
    this.movieService.getMovieByKey(this.keyUsersearch).subscribe({
      next: listMovie => {
        this.movieService.changeListMovie(listMovie);

        //  code để gửi api lưu key đó vào ls tìm kiếm và sau đó lấy lại ds tìm kiếm mới
        if (this.userId !== undefined && this.keyUsersearch !== '') {
          this.movieService.saveToHistorySearch(this.userId, this.keyUsersearch).subscribe({
            next: () => this.updateHistorySearch(),
            error: console.error,
          });
        }
      },
    });
  }
}
