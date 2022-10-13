import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { IndexPageComponent } from './index-page/index-page.component';
import { RepoPageComponent } from './repo-page/repo-page.component';
import { UserCardComponent } from './user-card/user-card.component';
import { RepoLanguagesPipe } from './repo-languages.pipe';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    IndexPageComponent,
    RepoPageComponent,
    UserCardComponent,
    RepoLanguagesPipe,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
