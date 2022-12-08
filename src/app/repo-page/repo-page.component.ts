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

// Если репозитория не существует, то вместо repository not found
// Выводится languages weren't found, readme not found

@Component({
  selector: 'app-repo-page',
  template: `
  <main class="flex flex-col gap-4">
    <loader *ngIf="loading; else repoBlock"></loader>
    <ng-template #repoBlock>
      <ng-container *ngIf="repo as repository; else notFound">
        <h1 class="text-3xl underline" *ngIf="repoName !== undefined && owner !== undefined">
          <a class="text-inherit hocus:text-blue-400" target="_blank" [href]="getFullUrl(owner, repoName)">
            {{owner}}/{{repoName}}
          </a>
        </h1>
        <section class="flex flex-col gap-4" *ngIf="repository.languages as languages; else languagesNotFoundBlock">
          <h2>Languages</h2>
          <button class="bg-transparent ring-2 ring-white text-inherit rounded-lg px-2 py-1 enabled:hocus:text-blue-400 enabled:hocus:ring-blue-400 disabled:opacity-50 disabled:text-inherit disabled:border-inherit w-fit" [disabled]="activeLanguage === null" (click)="activeLanguage=null">Reset selection</button>
          <span class="flex overflow-hidden language-range-part w-80 h-3 rounded-full">
            <span (click)="activateLanguage($event)" [attr.data-langname]="language.name" class="block h-full w-[var(--percentage)] bg-gray-600 hover:opacity-80 hover:cursor-pointer" [class]="{ 'bg-[color:var(--language-color)]': activeLanguage === null || activeLanguage === language.name }" [style]="langRangeCustomProperty(language)" *ngFor="let language of languages | repoLanguages"></span>
          </span>
          <ul class="list-style-type-['- ']">
            <li class="color-inherit cursor-pointer hover:opacity-80" (click)="activateLanguage($event)" [attr.data-langname]="language.name" [class]="{ 'text-[var(--language-color)]': activeLanguage === null || activeLanguage === language.name }" [style]="langColorCustomProperty(language.color)" *ngFor="let language of languages | repoLanguages">
              {{language.name}} <i class="opacity-50">{{language.bytes}} bytes</i> <br/>
              <strong>{{language.percentage | number:'1.2-2'}}%</strong>
            </li>
          </ul>
        </section>
        <ng-template #languagesNotFoundBlock>
          <h2>Languages weren't found</h2>
        </ng-template>
        <section class="relative p-4 md:p-8 bg-zinc-900 rounded-lg">
          <pre class="max-w-full readme-pre" *ngIf="repository.readme as readme; else readmeNotFoundBlock">
            {{readme}}
          </pre>
          <ng-template #readmeNotFoundBlock>
            <h2>'Readme' not found</h2>
          </ng-template>
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
  styles: [`
      loader {
        --loader-width: 5rem;
        --loader-b-width: 5px;
      }

      .readme-pre {
        white-space: pre-wrap;       /* Since CSS 2.1 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
      }
  `]
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

        console.debug(`repo with repoName:${this.repoName} owner:${this.owner}`)
        
        const repo = await Promise.all([
          DataSource.getRepositoryLanguages(this.owner, this.repoName).catch(_ => null),
          DataSource.getRepositoryReadme(this.owner, this.repoName).catch(_ => null)
        ]).catch(e => {
          console.error(e)
          return null
        })
        this.loading = false

        console.debug(`repo reponse: ${JSON.stringify(repo)}`)

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
