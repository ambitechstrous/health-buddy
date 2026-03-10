## Backend
Directory for backend. We want to avoid coupling frontend and backend logic, this is in the same repo mainly for convenience.

AI recipes do a lot of the heavy lifting, but there are two things the backend has to do here:
- Based on user input, figure out which AI recipes to run to achieve the intended result
- Parse the LLM output to figure out the actual quantities and suggestions
- Sends this in understandable JSON format to the frontend