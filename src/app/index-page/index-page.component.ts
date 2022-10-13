import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import DataSource, { type ApiData } from 'src/utils/datasource';


// !user !input -> no input
// !user input -> not found
// user !input -> user
// user input -> user

@Component({
  selector: 'app-index-page',
  template: `
  <main>
    <search-bar (searchEvent)="navigateToSearchQuery($event)" [(search)]="search" placeholder="Username"></search-bar>

    <loader *ngIf="loading; else searchResultBlock"></loader>
    <ng-template #searchResultBlock>
      <h2 style="align-self: center" *ngIf="searchQuery.trim().length === 0; else userBlock">Find someone now!</h2>  
      <ng-template #userBlock>
        <h2 style="align-self: center" *ngIf="user === null; else foundUserBlock">
          No user found :(
        </h2>
        <ng-template #foundUserBlock>
          <user-card [user]="user!"></user-card>
        </ng-template>
      </ng-template>
    </ng-template>
    
  </main>
  `,
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit, OnDestroy {

  searchQuery : string = '' // Строка последнего поиска, используется для ngIf в html
  search : string = ''
  loading : boolean = false
  user : ApiData['user'] | null = null

  constructor(
    private _router : Router,
    private _route : ActivatedRoute
  ) {}

  navigateToSearchQuery(query : string) {
    // Вместо выхода из функции, возможно лучше отобразить какую-нибудь ошибку
    if (query.trim() === this.searchQuery) return
    
    this._router.navigate([], {
      relativeTo : this._route,
      queryParams : {
        query : query
      },
      queryParamsHandling : 'merge',
      skipLocationChange : false
    })
  }

  subscriptions : Subscription[] = []

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this._route.queryParams
        .pipe(
          map<Params, string>(params => params['query'] || ''),
          map<string, string>(query => query.trim()),
          filter(query => query != this.searchQuery), // Фильрация, чтобы другие изменения query строки не мешалт 
        )
        .subscribe(async (query) => {
          this.search = query
          this.searchQuery = query

          // Запрос делается здесь, а не в евенте потому что получить query параметры синхронно нельзя
          // И хотя бы первый запрос при переходе на /?query=search сделать здесь в любом случае придется

          if (this.search.trim().length === 0) return

          this.loading = true
          this.user = await DataSource.getUser(this.search).catch(() => null)
          this.loading = false
        })
    )
  }

  ngOnDestroy() : void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
