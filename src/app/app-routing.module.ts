import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { RepoPageComponent } from './repo-page/repo-page.component';

const routes : Routes = [
  {
    path : '',
    component: IndexPageComponent
  },
  {
    path : 'repo/:owner/:repo_name',
    component : RepoPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports : [RouterModule]
})
export class AppRoutingModule { }
