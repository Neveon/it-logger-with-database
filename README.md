# ITLogger
[Check it out online](https://stormy-basin-17252.herokuapp.com/)

> React app to track IT department tasks and issues. Uses mongoDB for database

## Usage

### `npm install`

### `npm client`
**To run only front end

### `npm run dev`
**Runs backend and front end using concurrently<br>
**Make sure to connect your mongoURI in `config/default.json` (or `config/production.json` if you plan on deploying)

Open [http://localhost:3000](http://localhost:3000)

#### What I Learned
- Learned how easy it is to use Materialize for simple functioning yet eye catching UI
- Learned to create a custom sorting algorithm using a `for` loop to iterate through `.find() .sort()` results provided by `mongoose`. This allows the user to search by tech and/or message (find it in `routes/logs.js` GET request)
- Learned the React hook `useRef`, used in Search bar
    1.useState causes re-render; useRef does not.
    2.Both useState and useRef remembers their data after a re-render
    
### Issues
- Implemented clear functionality for search bar when user hits the `X`, but not when user clicks away from searchbar
- Did not implement search functionality by `ID#` due to using last characters of `_id` provided by mongoDB. Originally I posted the full object id, but decided not to so I could avoid users from using a program (like Postman) and add/delete data using the id.
