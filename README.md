# Personal-Kanban-Board-Frontend

## Table of Contents

- [General info](#general-info)
- [Features](#features)
- [Built With](#built-with)
- [Status](#status)

## General info

A frontend application for managing tasks on a kanban board, built using Angular and GraphQL.

Repository with backend application: https://github.com/NowakArtur97/Personal-Kanban-Board-Backend

## Features

Kanban Board:

- User login
- User registration
- Authentication and authorization using JWT
- Displaying functionality by role (user and admin roles)
- Displaying information about tasks and subtasks
- Creating, updating and deleting tasks
- Adding subtasks to tasks
- Deleting all subtasks from a task
- Creating, updating and deleting subtasks
- Deleting all tasks (only possible by admin)
- Changing the user assigned to tasks and subtasks
- Filtering tasks by the user assigned to them
- Handling events emitted by the server
- Input validation
- Asynchronous input validation (username and email)
- Blocking access to the board for unlogged users
- GraphQL used for queries, mutations and subscriptions

CloudFormation:

- Creating the resources needed to run a frontend application on an S3 bucket with access to the backend application
- Importing the backend urls from the Parameter Store
- Automatic detection of changes in the GitHub repository, building and deploying application using CodeBuild and CodePipeline
- Generating an environment variables file
- Automatic cleaning of the S3 buckets with application files and artifacts after deleting a CloudFormation template

## Built With

Frontend build with:

- Angular 17.2.0
- Apollo Angular - 6.0.0
- GraphQL - 16
- GraphQL-WS - 6.0.6
- Typescript - 5.3.2

CloudFormation resources:

- S3 Buckets
- Bucket Policy
- IAM Roles
- CodeBuild (Project)
- CodePipeline (Pipeline, Webhook)
- Lambda Function
- CloudFormation Custom Resource
- Parameter Store

## Status

Project is: finished
