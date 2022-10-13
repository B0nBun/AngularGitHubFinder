import { Component, Input, OnInit } from '@angular/core';
import DataSource, { type ApiData } from 'src/utils/datasource';

@Component({
  selector: 'user-card',
  template: `
    <div class="user-card">
      <div class="info">
        <img width="64" height="64" class="avatar" [src]="user.avatar_url" />
        <span class="user-name">{{user.name || ""}}</span>
        <a target="_blank" [href]="user.html_url" class="user-login">{{user.login}}</a>
      </div>
      <ul class="repos" [class.active]="reposActive">
        <loader style="align-self: center" *ngIf="reposLoading; else reposBlock"></loader>
        <ng-template #reposBlock>
          <button class="close-repos-button" (click)="closeRepos()" >close</button>
          <li class="repo-item" *ngFor="let repo of repos">
            <a [routerLink]="getRepoHref(user.login, repo.name)">{{repo.name}} <i class="repo-desc">{{repo.description}}</i></a>
          </li>
          <h3 style="margin-left: .8rem; margin-top: 1rem;" *ngIf="repos === null || repos.length == 0">No repositories</h3>
        </ng-template>
      </ul>
      <button (click)="reposActive ? closeRepos() : openRepos()" class="repos-button">
        {{ reposActive ?  '^' : '⌄'}} Repositories {{ reposActive ?  '^' : '⌄'}}
      </button>
    </div>  
  `,
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input()
  user! : ApiData['user']

  repos : ApiData['repositories'] | null = null // null значит, что репозитории не загрузились
  reposActive = false
  reposLoading = false
  
  constructor() { }

  closeRepos() {
    this.reposActive = false
  }

  async openRepos() {
    this.reposActive = true
    if (this.repos !== null) return // repos !== null значит, что они уже были загружены

    this.reposLoading = true
    this.repos = await DataSource.getUsersRepositories(this.user.login).catch(e => null); // Здесь лучше бы ошибку выводить
    this.reposLoading = false
  }

  getRepoHref(owner : string, repoName : string) : string {
    return `/repo/${owner}/${repoName}`
  }
  
  ngOnInit(): void {
  }

}
