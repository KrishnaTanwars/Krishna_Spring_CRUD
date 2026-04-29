# Student CRUD Spring Boot JDBC Application

This project is a Spring Boot REST API that performs CRUD operations on a `students` table using `JdbcTemplate`.

## Technologies Used

- Java 17
- Spring Boot
- Spring Web
- Spring JDBC
- MySQL
- Maven

## Database Configuration

Create a MySQL database named `testdb`:

```sql
CREATE DATABASE testdb;
```

The application reads the connection details from `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.username=root
spring.datasource.password=admin
```

The `students` table is created automatically from `src/main/resources/schema.sql` when the application starts.

## REST API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/students` | Create a student |
| GET | `/students` | Get all students |
| GET | `/students/{id}` | Get a student by ID |
| PUT | `/students/{id}` | Update a student |
| DELETE | `/students/{id}` | Delete a student |

## Sample JSON

```json
{
  "name": "Krishna",
  "email": "krishna@example.com",
  "course": "Spring Boot"
}
```

## Run The Project

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

## Test The Project

```bash
mvnw.cmd test
```

## React Frontend

The React frontend is inside the `frontend` folder.

Start the Spring Boot backend first:

```bash
mvnw.cmd spring-boot:run
```

Then start the React frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend can create, view, update, and delete students through the Spring Boot API.
