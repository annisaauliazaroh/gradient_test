# Developing a Single Page App with FastAPI and React

### Want to learn how to build this?

Check out the [post](https://testdriven.io/blog/fastapi-react/).

## Want to use this project?

1. Fork/Clone

1. Run the server-side FastAPI app in one terminal window:

   ```sh
   $ cd backend
   $ python3 -m venv venv
   $ source venv/bin/activate
   (venv)$ pip install -r requirements.txt
   (venv)$ python main.py
   ```

   Navigate to [http://localhost:8000](http://localhost:8000)
   
   API documentation [http://localhost:8000/docs](http://localhost:8000/docs)

1. Run the client-side React app in a different terminal window:

   ```sh
   $ cd frontend
   $ npm install
   $ npm run start
   ```

   Navigate to [http://localhost:3000](http://localhost:3000)

## Want to run automation test this project ? 

- API automation : 
run `pytest -s -m unittest` for run unit test API automation
run `pytest -s -m integrationtest` for run integration test API automation
run `pytest -v` for run all test API automation

- UI automation
run npm test for run unit test frontend
install cypress, go to frontend directory, run `npx cypress open` for run integration test

## How to run End To End Test for User Flow ?
- install cypress in root directory `npm install cypress --save-dev`
- Set up the project to use Cypress
- run `npx cypress open` for run the test



