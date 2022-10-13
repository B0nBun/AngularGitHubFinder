import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HslColor } from 'src/utils/color-generator';
import DataSource, { ApiData } from 'src/utils/datasource';
import { Language } from '../repo-languages.pipe';

interface Repository {
  languages : ApiData['languages']
  readme : NonNullable<ApiData['readme']>['content'] | null
}

@Component({
  selector: 'app-repo-page',
  template: `
  <main>
    <loader *ngIf="loading; else repoBlock"></loader>
    <ng-template #repoBlock>
      <ng-container *ngIf="repo as repository; else notFound">
        <h1 class="full-name" *ngIf="repoName !== undefined && owner !== undefined">
          <a target="_blank" [href]="getFullUrl(owner, repoName)">
            {{owner}}/{{repoName}}
          </a>
        </h1>
        <section *ngIf="repository.languages as languages; else languagesNotFoundBlock" class="languages-section">
          <h2>Langauges</h2>
          <button class="language-reset-button" [disabled]="activeLanguage === null" (click)="activeLanguage=null">Reset selection</button>
          <span class="language-range">
            <span (click)="activateLanguage($event)" [attr.data-langname]="language.name" class="language-range-part" [class.active]="activeLanguage === null || activeLanguage === language.name" [style]="langRangeCustomProperty(language)" *ngFor="let language of languages | repoLanguages"></span>
          </span>
          <ul class="languages-list">
            <li (click)="activateLanguage($event)" [attr.data-langname]="language.name" [class.active]="activeLanguage === null || activeLanguage === language.name" [style]="langColorCustomProperty(language.color)" *ngFor="let language of languages | repoLanguages">
              {{language.name}} <i>{{language.bytes}} bytes</i> <br/>
              <strong>{{language.percentage | number:'1.2-2'}}%</strong>
            </li>
          </ul>
        </section>
        <ng-template #languagesNotFoundBlock>
          <h2>Languages weren't found</h2>
        </ng-template>
        <section class="readme-section">
          <pre *ngIf="repository.readme as readme; else readmeNotFoundBlock">
            {{readme}}
          </pre>
          <h2>\`Readme\` not found</h2>
        </section>
        <ng-template #readmeNotFoundBlock>
        </ng-template>
      </ng-container>
      <ng-template #notFound>
        Error occured or repo not found :(
      </ng-template>
    </ng-template>
  </main>
  `,
  styleUrls: ['./repo-page.component.css']
})
export class RepoPageComponent implements OnInit, OnDestroy {

  constructor(
    private _route : ActivatedRoute
  ) { }

  repoName ?: string = undefined
  owner ?: string = undefined
  repo : Repository | null = null
  loading = false
  activeLanguage : string | null = null 

  subscribtions : Subscription[] = []

  activateLanguage(event : Event) {
    this.activeLanguage = (event.currentTarget as HTMLElement | undefined)?.dataset['langname'] || null
  }

  getFullUrl(owner : string, repoName : string) {
    return new URL(`${owner}/${repoName}`, 'https://github.com/').href
  }

  langColorCustomProperty(color : HslColor) {
    return `--language-color: hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%);`
  }

  langRangeCustomProperty(language : Language) {
    return `--percentage: ${language.percentage}%; ${this.langColorCustomProperty(language.color)}`
  }
  
  ngOnInit(): void {
    this.subscribtions.push(
      this._route.params.subscribe(async (params) => {
        this.repoName = params['repo_name'] as string
        this.owner = params['owner'] as string

        this.loading = true
        const repo = await Promise.all([
          DataSource.getRepositoryLanguages(this.owner, this.repoName).catch(_ => null),
          DataSource.getRepositoryReadme(this.owner, this.repoName).catch(_ => null)
        ]).catch(e => {
          console.error(e)
          return null
        })
        this.loading = false

        if (repo === null) {
          this.repo = null
          return
        }

        const [ languages, readme ] = repo
        this.repo = {
          languages,
          readme
        }
      })
    )
  }

  ngOnDestroy(): void {
      this.subscribtions.forEach(sub => sub.unsubscribe())
  }

}
