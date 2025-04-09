# Betting Dashboard
Dashboard developed with Node.js and Nuxt.js in order to keep track of your past bets.

## Setup
### Backend
In the backend folder, create a .env file with the following format. If you are planning to connect to a host MySQL server, keep the string below for the database host variable:
```
DATABASE=betting-dashboard
DATABASE_USER=root
DATABASE_PASS=pwd
DATABASE_HOST=host.docker.internal
DATABASE_PORT=3306
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
SESSION_SECRET=...
ADMIN_USER=admin_user@outlook.com
```
### Running
To run the entire project, simply run the docker compose command:
```
docker-compose up
```
# Register/Login
In this new version, we now have an authentication system for you to save and track your bets from multiple accounts.
![image](https://github.com/user-attachments/assets/6753195b-0d45-45aa-afaf-a582921668ff)

![image](https://github.com/user-attachments/assets/53396abf-fae8-491b-adc0-b1e6e2b0cd98)

## Overview
To start the overview, I'm going to show you the dashboard page. This page gives you an overall of your bets. It shows the your success rate, ROI and a bunch of other statistics. In addition to that, there are a few charts, like the bet progression, profit by day and a few others.

![image](https://github.com/user-attachments/assets/1816d42c-8229-4326-9b46-564e96a035e7)

![image](https://github.com/user-attachments/assets/ef48514a-125c-49a9-9d84-a1c6a1847221)

To add bets to be tracked later in the dashboard, we have the Bets page. In this page you can track your past bets individually and add more bets. After the matches are done or even when you're creating the bets, you can change the "Bet Won" field value to mark if the bet was successful, failed or is it still pending.

![image](https://github.com/user-attachments/assets/5bfe5556-05c9-4e58-930e-d9511c2eb78a)

That's it for the overview of the project. There is another Parlays page, where you can register you parlay bets, but the main core of the project was described here. Feel free to reach out if there are any comments of how to improve the plataform.



