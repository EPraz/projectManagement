# Project Management walkthrough

Silent product walkthrough with English text embedded in the picture.

Recorded against an isolated local API and PostgreSQL database with fictional data. Both browser sessions use real backend/WebSocket communication.

## 0:00 — A workspace for delivery

An original full-stack project for planning, tracking and reviewing team delivery.
Explore populated fictional projects without creating a personal account.

## 0:14 — Project context, sprint focus

Project progress covers the whole project. Sprint metrics follow the selected sprint.

## 0:22 — Connect the bigger picture

Epics and features link project goals to concrete tickets across sprints.

## 0:32 — Plan the selected sprint

The Backlog keeps sprint work searchable, with ticket-level filters and configurable columns.

## 0:40 — Requirements, estimates and child tasks

Inspect the ticket requirements, ownership and planning details.
Story points, time estimates and child tasks stay connected to the same work item.

## 1:00 — Tickets in rows. Tasks by state.

Each row is a ticket. Columns represent the independent states of its tasks.

## 1:08 — Session A · update the ticket

Move the ticket from In Progress to Code Review through the actual API.

## 1:16 — Session B · no refresh

The same change arrives in an independent browser session over WebSockets. No refresh.

## 1:24 — Session A · move a child task

Task state is separate from ticket state. Move a child task into In Progress.

## 1:34 — Session B · work stays in sync

The moved task appears in the second session, while its parent ticket remains in Code Review.

## 1:44 — People behind the work

The project-wide team connects people to assigned work and sprint planning.

## 1:52 — Plan available capacity

Sprint capacity shows the team’s available hours and planned workload.

## 2:02 — Track the sprint outcome

Sprint goals pair a clear outcome with an actionable checklist and progress.

## 2:12 — Make room for feedback

Review what worked, what did not, and what the team can improve next.
Retrospective cards and reactions belong to the selected sprint.

## 2:26 — Same workflow. Smaller screen.

A real 390px viewport: responsive navigation, sprint work and contextual editing.

## 2:42 — Two complete appearances

Switch appearance explicitly. The choice is remembered across visits.

## 2:50 — Built across the stack

React + TypeScript → NestJS REST API → Prisma + PostgreSQL. Socket.IO keeps sessions synchronized.
Explore the live demo or inspect the implementation on GitHub.
