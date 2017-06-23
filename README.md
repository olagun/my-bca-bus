# My BCA Bus

My high-school doesn't provide access to bus locations conveniently. The only way to access bus locations is to find one of the few teachers with a iPad displaying bus locations. Sounds simple, but it's super convenient. A few students from my school decided to create an application to solve this problem. Bus locations are logged on a Google Spreadsheet and since Google provides an API to use their service, they created a website to concisely display this information. Having never used the Google Spreadsheet's API, I created my own version—here it is. I tried to use modern JavaScript techniques without utilizing any heavy frameworks.


## Quick Start
Usage is fairly simple, requiring only **npm**, **yarn**, and of course, **node**.

### Install
```
yarn install
```

### Build
```bash
npm run build:dev
```

### Serve
```bash
npm start:dev
```

I created a few more shortcut commands to make development and deployment less of a pain, all located within the `package.json` configuration file.

## License
See it [here](https://github.com/samolaogun/my-bca-bus/blob/master/LICENSE).
