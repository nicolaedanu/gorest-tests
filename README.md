# E2E Test Scenarios for CRUD User Operations

This project is an assignment that covers end-to-end (E2E) test scenarios for CRUD (Create, Read, Update, Delete) user operations using API version 2 and HTTP Bearer Token authentication.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Bugs and Suggestions](#bugs-and-suggestions)

## Introduction

This project aims to test CRUD operations for user resources in API version 2. It includes a series of test files that cover various scenarios, such as creating new users, retrieving user details, updating user information, and deleting users. Additionally, the tests utilize HTTP Bearer Token authentication for secure access to the API endpoints.

## Installation

To use this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/nicolaedanu/gorest-tests.git
```
2. Install dependencies:

```bash
cd gorest-tests
npm install
```
3. To run the tests locally you need to generate an access code on  https://gorest.co.in/my-account/access-tokens

4. Create a .env file in the route directory and save the access token
```bash
ACCESS_CODE=<YOUR_ACCESS_CODE>
```

## Usage
To run the tests, use the following command:
```bash
npm test
```

## Bugs and suggestion
While exploring the functionality of the gorest public APIs i discovered the bellow inconsistencies:
### GET request
> Bad practice - 401 error message is different from POST users
### PUT requests: 2 failing tests
> BUG - when updating an user without valid authentication system should return 401 but instead it returns 404 (user not found)

> BUG - when trying to update partialy a resource using PUT requests the system should return a error. PUT request are used to modify the entire resource
### DELETE request - 1 failing test
Decided to fail the test here as I believe this is a critical requirement
> Bad practice - in order to save load on the DB the system should first check if the user has access before making a call to DB

