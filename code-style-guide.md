# Campus Roots Code Style Guide

Please be sure to read this guide thoroughly before contributing as it will lessen the chances of any issues arising during the process.

> [!NOTE]
>
> It is of critical importance to adhere to the style guide dictated here. <br>
> Always keep in mind that these are the words of God, and you lowly humans must be obedient.

## The Tech Stack

- **JavaScript + NodeJS** the programming language and backend runtime. Check the [docs](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs).
- **ExpressJS** the server framework. Check the [docs](https://expressjs.com/en/4x/api.html).
- **PostgreSQL + Prisma** the database and ORM. Check the [docs](https://www.prisma.io/docs).
- **PassportJS** for authentication strategies. Check the [docs](https://www.passportjs.org/docs/).
- **Express Validator** for server-side data validation. Check the [docs](https://express-validator.github.io/docs/api/validation-chain).

## The Stylistic Rules as per God's Dictation

- Always use **exactly 2 spaces** for indentation. You can configure VSCode to register `tabs` as `2 spaces`.
- Keep the repository clean and organized.
- Always use `camelCase` for variable names.
- The variable names should be descriptive about their purpose.
- Variables storing hard-coded special values which will never change and whose values are always known should be named using `SCREAMING_SNAKE_CASE`;
- Always use `const` for declaring variables whenever possible. Never use `var`.
- ALWAYS use `prettier` to format your code before committing. You can enable format-on-save in VSCode so that you don't have to worry about manually formatting your code.
- The names of routes should always be in `kebab-case` and should not contain capital letters.
- Names of files and directories should always be in `kebab-case` and should not contain capital letters.
- Always use ES Modules. Do not use CommonJS Modules.

## Other Extremely Important Rules

- Do not use `try-catch` for error handling in controllers. Always use `express-async-handler`.
- Always use the native `fetch` API for fetching data. Do NOT use Axios or similar libraries.
- Always use modern promise-based syntax (`async-await`) whenever possible. Avoid falling into callback hell.
- Always follow the MVC pattern (Model View Controller) for code organization.
- Follow RESTful guidelines for naming API endpoints.

## More Advice

- NEVER commit or push API keys or sensitive information to GitHub.
- NEVER push changes directly to the `main` branch. Follow the procedure mentioned in the [contributing guide](https://github.com/tangerineArc/campus-roots-backend/blob/main/contributing-guide.md).
- Make a pull request if and only if you are sure that the code is free of errors, introduces a new feature or fixes a bug, and follows the stylistic guidelines.
- Always check with the team-members to review your pull-request. Do NOT merge your own PR.
