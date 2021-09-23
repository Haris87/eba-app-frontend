# EBA Toy App - Frontend

a simple app to create, read, update and search entities

To start the app `git clone` it and run

```
npm install
ng serve --open --configuration production
```

the backend is hosted in heroku and the database is on mongo cloud

to run with local backend run:

```
ng serve --open
```

### Features

##### Search page

- Search entity names with autocomplete and debounce
- Sort results by name
- Show results count
- Paging

##### Entity page

- View, edit and create in the same page
- Toggle fields as readonly or editable
- Validators in all forms
