# Members Only

<!-- RENDER_BADGE_START -->

![Render Status](<>)
<!-- RENDER_BADGE_END -->

[Live link ✨](https://members-only-g4w6.onrender.com/)

This was a project from The Odin Project to practice the authentication skills
which were taught earlier in the course.

It's a message board type of app. Anyone can see the messages but to add a new
message, the user must log in. By default, the user can't see who has authored
a message and at what time. They will have to enter a secret passcode that
grants them the privileges to access more data about the messages. There is
another tier of privileges granted to users who enter the admin password.

## Technologies Used

- [Express](https://expressjs.com/) - As the web framework
- [EJS](https://ejs.co/) - The templating engine used to render views
- [TypeScript](https://www.typescriptlang.org/) - For increased type-safety
- [PostCSS](https://postcss.org/) -To keep CSS modular and reusable
- [PostgreSQL](https://www.postgresql.org/) - The relational database used in this project
- [Passport.js](https://www.passportjs.org/) - Used to authenticate users and
  manage sessions

## Contributing

Please feel free to submit an issue or pull request. To develop, you'll need Node.js.

### Installation and Developer Usage

In this project, I'm using pnpm, but the commands shown here should also work with other node package managers with some minor syntactical changes.

First clone the repo. After that, install the dependencies with your preferred package manager like so:

```shell
pnpm install
```

You will need to watch the styles separately when you run the dev environment. The process will be like the following commands in two separate sessions (or maybe even one if you feel like it):

```shell
pnpm dev
pnpm watch:css
```

### Building

To build the app, run the following command:

```shell
pnpm build
```

### Deployment

For this project, I have used [Aiven](https://aiven.io/) as the cloud database and [Render](https://render.com/) for the app itself.

Make sure to add the Aiven secrets in the `.env` file before deploying them on render. The secrets which are needed are covered in the `.env.example` file.

## Acknowledgements

- Generated the logo from [Formito](https://formito.com/tools/favicon)
- Project assigned by [The Odin Project](https://theodinproject.com)
