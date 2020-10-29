let lang = {
  
  "LOGIN_TEXT" : {
    context: "Login action link",
    en: {
      CA: "Login"
    }
  },
  "GOOGLE_LOGIN" : {
    context: "Alt text for Google Login button image",
    en: {
      CA: "Google Login"
    }
  },
  "LORUM_IPSUM" : {
    context: "",
    en: {
      CA: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  }
}

class Language {
  constructor(language, locale) {
    this.current_language = language;
    this.current_locale = locale;
    
  }
  setLanguage(language, locale) {
    this.current_language = language;
    this.current_locale = locale;
  }
  translate(code) {
    let ret_string = this.verify(code, this.current_language, this.current_locale);
    if(ret_string === false) {
      ret_string = this.verify(code, this.current_language, this.default_locale);
      if(ret_string === false) {
        ret_string = this.verify(code, this.default_language, this.default_locale);
        ret_string = (ret_string === false) ? "" : ret_string;
      }
    }
    return ret_string;
  }
  verify(code, language, locale) {
    if (lang[code]) {
      if (lang[code][language]) {
        if (lang[code][language][locale]) {
          return lang[code][language][locale]; 
        }
      }
    }
    return false;
  }
}
export default Language;