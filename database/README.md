# Overview
There will be two databases associated with the application with distinct purposes. The Application and Affiliate Management Databases.

The configuration used will be Aurora Serverless V2 for a multi-tenant persistance approach.
This on-demand, autoscaling approach will automate scaling based on workload and will thus reduce unnecessary provisioning and consequently costs.

Each Affiliate will have their own database allocated.

The databases used will be PostgreSQL with Flyway to handle creation, migration and versioning of the PostgreSQL database.
PostgreSQL is a widely used and supported open-source relational database.
Flyway is widely supported, lightweight, transparent and is a key component in database management, with some of the features mentioned above.

## Application Database
The application database represents the data tied to a specific affiliate, as we onboard a new affiliate a new application database is created and tied to that affiliate. A affiliate being an individual gym owner for the FitBuddy system who has their own Users, Workouts, LeaderBoards etc. The idea around this is to group all the specific user data together

## Affiliate Management Database
The affiliate management database will represent the command center/admin section of the application and the flow of managing affiliates, command center users within the application.

Unlike the Application Database there is just a single instance of the affiliate management database

# Migrations
In order to manage the state of the database, we use a database migration tool called [Flyway](https://www.red-gate.com/products/flyway/community/). This tool allows us to execute specifically named migration scripts so we can control the ordering of migrations to be applied and what the database migration specifically output.


# Local Data Seed
As we develop & test locally and we repeatedly require predicatable data within our database for verification, we employ a local data seed approach for each of our databases. These tables are design to add data throughout the database so we have workouts, exercises, users, participations etc available locally as soon as we spin up the database.

_NOTE: An important consideration is that we absolutely do not apply the local data seed migrations to any remote databases, they are purely for location verifications and test executions_.

# Local Execution

## With Docker
We will Simply run `make start_local_database` from the root directory to spin up an application and affiliate database instance.

## Without Docker
In order the run the database locally you need at a minumum:

- postgres 14

- flyway


### application database creation
- add a `fitbuddy-dev` database onto your server.
- run the command `flyway -url=jdbc:postgresql://localhost/fitbudy-dev -schemas=master -user=fitbud -password=password1 -connectRetries=5 migrate`

### affiliate_management
- add a `affiliate-mgt` database onto your server.
- run the command `flyway -url=jdbc:postgresql://localhost/affiliate-mgt -schemas=master -user=fitbud -password=password1 -connectRetries=5 migrate`
