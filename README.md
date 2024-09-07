# TrackMyBag

**TrackMyBag** is a web-based luggage tracking application that enables users to manage and track their luggage in real-time within the airport. The application uniquely identifies each luggage item, providing timely updates on its status and location. All data is stored in JSON files, making it easy to manage and update luggage and user information.

## Features

- **List Luggage:** Retrieve all luggage items stored in the system.
- **Add Luggage:** Add a new luggage item with a unique name, status, and location.
- **Update Luggage:** Update the status and location of an existing luggage item.
- **Delete Luggage:** Remove a luggage item from the system.
- **Search Luggage:** Search for luggage by name or location.
- **User Management:** Register, log in, and manage user profiles.
- **Support Tickets:** Create and list support tickets for user issues.

## Data Storage

- **Luggage Data:** Stored in `luggage.json`, including fields like `id`, `status`, and `location`.
- **User Data:** Stored in `user.json`, including fields like `name`, `email`, `phone`, and `password`.
- **Support Ticket Data:** Stored in `support_tickets.json`, including fields like `ticketID`, `userName`, `subject`, `message`, `status`, and `createdAt`.

## Technology Stack

- **Frontend:** React.js (fully functional and responsive web design)
- **Backend:** Node.js, Express.js (RESTful API)
- **Data Management:** File System (JSON files)

## Endpoints

### Luggage Management

1. **List Luggage**
   - **Endpoint:** `GET /luggage`
   - **Description:** Retrieve all luggage items.
   - **Response:** Array of luggage objects.

2. **Add Luggage**
   - **Endpoint:** `POST /luggage`
   - **Description:** Add a new luggage item.
   - **Request Body:**
     ```json
     {
       "name": "string",
       "status": "string",
       "location": "string"
     }
     ```
   - **Response:** Status message indicating success or failure.

3. **Update Luggage**
   - **Endpoint:** `PUT /luggage/:id`
   - **Description:** Update the status and location of an existing luggage item by its unique ID.
   - **Request Body:**
     ```json
     {
       "status": "string",
       "location": "string"
     }
     ```
   - **Response:** Status message indicating success or failure.

4. **Delete Luggage**
   - **Endpoint:** `DELETE /luggage/:id`
   - **Description:** Remove a luggage item using its unique ID.
   - **Response:** Status message indicating success or failure.

5. **Search Luggage**
   - **Endpoint:** `GET /luggage/search`
   - **Query Parameters:**
     - `luggageId` (optional): The ID of the luggage.
     - `location` (optional): The location of the luggage.
   - **Response:** Array of luggage objects matching the search criteria.

### User Management

1. **Register User**
   - **Endpoint:** `POST /register`
   - **Description:** Register a new user.
   - **Request Body:**
     ```json
     {
       "name": "string",
       "email": "string",
       "phone": "string",
       "password": "string"
     }
     ```
   - **Response:** Status message indicating success or failure.

2. **Login User**
   - **Endpoint:** `POST /login`
   - **Description:** Authenticate a user and return a token.
   - **Request Body:**
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **Response:** User object and authentication token.

3. **Get User Profile**
   - **Endpoint:** `GET /user/:id`
   - **Description:** Retrieve a user's profile by their unique ID.
   - **Response:** User object.

4. **Update User Profile**
   - **Endpoint:** `PUT /user/:id`
   - **Description:** Update a user's profile details.
   - **Request Body:**
     ```json
     {
       "name": "string",
       "email": "string",
       "phone": "string"
     }
     ```
   - **Response:** Status message indicating success or failure.

### Support Ticket Management

1. **Create Support Ticket**
   - **Endpoint:** `POST /support/ticket`
   - **Description:** Create a new support ticket for a user.
   - **Request Body:**
     ```json
     {
       "userName": "string",
       "subject": "string",
       "message": "string"
     }
     ```
   - **Response:** Status message indicating success or failure, with the created ticket object.

2. **List User Support Tickets**
   - **Endpoint:** `GET /support/tickets`
   - **Query Parameters:**
     - `userName`: The name of the user whose tickets are being retrieved.
   - **Response:** Array of support tickets associated with the user.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devrahul19/TrackMyBag.git
   
