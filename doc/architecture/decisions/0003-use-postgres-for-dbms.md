# 3. Use PostgreSQL for our DBMS

Date: 2025-02-05

## Status

Accepted

## Context

Our application requires a robust, scalable, and feature-rich database management system to support various functionalities, including user authentication, workout tracking, and social interactions within the platform. Given the nature of the application, we need:

## Decision

We have chosen PostgreSQL as our primary DBMS due to the following reasons:

Open-source and cost-effective: Eliminates licensing costs compared to proprietary databases.
Extensibility: Supports JSONB, full-text search, and custom functions, providing flexibility for future enhancements.
Strong community support: A well-maintained ecosystem with regular updates and a large developer community.
Robustness and reliability: ACID-compliant transactions and strong data integrity ensure a reliable data store.
Scalability: Supports horizontal scaling via replication and partitioning, which can accommodate growing user demands.
Compatibility with .NET: PostgreSQL integrates well with Entity Framework Core, supporting seamless ORM usage.
AWS Integration: Can be hosted on Amazon RDS, which provides managed backups, scaling, and failover solutions.

## Consequences

Provides long-term flexibility with support for both relational and document-based storage. Reduces operational costs compared to managed proprietary databases.
Aligns well with cloud-native architectures, including AWS-based deployments.
 