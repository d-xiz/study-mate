# Deployment & GitOps

## Overview
As an additional feature, this web application is deployed using Render with GitHub-based CI/CD. The application is accessible online and redeploys automatically when changes are pushed to the repository.

## CI/CD Process
The source code is managed using GitHub as the single source of truth.
Whenever code is committed and pushed to the main branch, Render automatically pulls the latest version of the repository, installs dependencies, builds the application, and redeploys the services.

## Deployment Architecture
- Frontend: React (Vite), deployed as a static site on Render
- Backend: Node.js with Express, deployed as a web service on Render
- Database: MongoDB Atlas

## GitOps Practice
This project follows basic GitOps principles where all changes are tracked through Git commits, and the deployed state always reflects the state of the Git repository.

## Live URLs
Frontend: https://study-mate-ynmd.onrender.com  
Backend: https://study-mate-backend-45q2.onrender.com

## Git repo
https://github.com/d-xiz/study-mate