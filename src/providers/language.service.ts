import { Injectable } from "@angular/core";
import { LanguageModel } from "../models/language.model";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  languages : Array<LanguageModel> = new Array<LanguageModel>();

   constructor(private translate: TranslateService) {
     this.languages.push(
       {name: "English", code: "en"},
       {name: "Arabic", code: "ar"}
     );
   }

   getLanguages(){
     return this.languages;
   }
   getLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    return language;   
  }
   setLanguage(setLang) {
    this.translate.use(setLang);
  }
 }
