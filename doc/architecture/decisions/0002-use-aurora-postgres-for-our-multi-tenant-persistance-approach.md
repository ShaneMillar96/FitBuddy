# 2. use aurora postgres for our multi-affiliate persistance

Date: 2025-02-05

## Status

Accepted

## Context

There needs to be an approach in place to handle the multi-affiliate needs within FitBuddy. Initially to logically separate individual affiliates, but with the eventual aim that when required we can implement physical data separation. The proposal we have is to use Aurora Serverless v2.

Aurora Serverless v2 is an on-demand, autoscaling configuration for Amazon Aurora. Aurora Serverless v2 helps to automate the processes of monitoring the workload and adjusting the capacity for your databases. Capacity is adjusted automatically based on application demand. You're charged only for the resources that your DB clusters consume. Thus, Aurora Serverless v2 can help you to stay within budget and avoid paying for computer resources that you don't use.

This type of automation is especially valuable for multi-affiliate databases, distributed databases, development and test systems, and other environments with highly variable and unpredictable workloads.

## Decision

We will use Aurora Serverless v2 with PostgreSQL. Each affiliate will have their own database.

## Consequences

There is a risk in the limitations of the Aurora Serverless v2 service and it's ability to scale with the number of databases on it. Since each affiliate will have their own database, reporting and analytics will be a challenge. Additionally, there is limited experience with the service since it's fairly new. On the development side it does add implications for managing connections and migrations.


