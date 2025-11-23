## Technologies Used

### Backend: Spring Boot

* [![SpringBoot](https://img.shields.io/badge/-Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)

**Purpose:**  
Spring Boot is used as the **backend framework** for Blood4Life. It provides the foundation for building REST APIs, handling business logic, and managing data persistence with MySQL and Hibernate.

**Why Spring Boot was chosen:**
- **Rapid development:** Starter templates and auto-configuration reduce setup time.
- **Enterprise-grade framework:** Robust, scalable, and suitable for complex applications.
- **Integration with Spring ecosystem:** Works seamlessly with Spring Security, Spring Data JPA, and Spring Cloud.
- **Strong community and support:** Extensive documentation and active community.
- **Platform flexibility:** Runs on any OS supporting Java and integrates well with Docker and Railway.

**Advantages over alternatives (e.g., Express.js, Django, Laravel):**
- More suitable for large-scale enterprise applications.
- Mature dependency injection system and built-in security features.
- Better maintainability for long-term projects.
- Seamless integration with Java-based tools and libraries.

**Use in Blood4Life:**
- Serve REST endpoints for the ReactJS frontend.
- Manage database operations with Hibernate and Flyway.
- Handle authentication and authorization using Spring Security.
- Provide monitoring and observability through Spring Boot Actuator.

### Flyway (Migrations & Seeders)

* [![FlyWay](https://img.shields.io/badge/-Flyway-CC0200?style=flat&logo=flyway&logoColor=white)](https://flywaydb.org/)

**Purpose:**  
Flyway is used for **database version control and migration management**. It ensures that all environments (development, testing, staging, production) maintain the same database schema and that any changes are traceable, reversible, and consistent.

**Why Flyway was chosen:**
- **Consistency across environments:** Prevents schema drift by ensuring that all database instances use the same migration scripts.
- **Ease of use:** Uses simple SQL or Java-based migrations, making it easy to define, run, and track changes.
- **Integration with Spring Boot:** Seamlessly integrates with Spring Boot projects, executing migrations automatically at application startup if needed.
- **Rollback support:** Allows safe versioning of database changes, reducing risks in production deployments.
- **Team collaboration:** Developers can share migration scripts, ensuring that everyone works with the same database structure.
- **Compatibility:** Works with multiple relational databases, including MySQL, PostgreSQL, SQL Server, and Oracle.
- **Automation:** Can be integrated into CI/CD pipelines, ensuring automated migrations during deployment.

**Advantages over alternatives (e.g., Liquibase, manual SQL scripts):**
- **Simplicity:** Flyway uses straightforward migration scripts without complex XML configuration, unlike Liquibase.
- **Convention over configuration:** Flyway automatically detects migrations and applies them in order.
- **Lightweight:** Minimal overhead and easy to include in Spring Boot projects.
- **Predictability:** Ensures deterministic migrations, reducing errors caused by manual scripts.

**Use in Blood4Life:**
- Automates the creation of tables and seeding initial data for the application.
- Guarantees that every developer and deployment environment has the same database schema.
- Integrates with Hibernate and Spring Data JPA, maintaining smooth interaction between the ORM and database migrations.

### ORM: Hibernate

* [![Hibernate](https://img.shields.io/badge/-Hibernate-59666C?style=flat&logo=hibernate&logoColor=white)](https://hibernate.org/)

**Purpose:**  
Hibernate is used as the **Object-Relational Mapping (ORM) framework** in Blood4Life. It allows developers to map Java objects to relational database tables, automating SQL generation and database interactions.

**Why Hibernate was chosen:**
- **Simplifies database operations:** Automatically handles CRUD operations, reducing boilerplate SQL code.
- **Integration with Spring Boot:** Works seamlessly with Spring Data JPA and Flyway for migrations.
- **Supports multiple databases:** Compatible with MySQL, PostgreSQL, Oracle, SQL Server, and more.
- **Automatic schema generation:** Can create or update database tables based on entity definitions.
- **Caching and performance:** Includes first-level and second-level caching mechanisms to improve performance.
- **Transaction management:** Integrates with Spring’s transaction management for reliable data consistency.

**Advantages over alternatives (e.g., manual SQL, MyBatis):**
- **Less manual coding:** Developers don’t need to write SQL for every database operation.
- **Maintainable:** Changes in entity classes automatically reflect in database mapping.
- **Productivity:** Speeds up development, especially for complex applications with multiple entities and relationships.
- **Community and documentation:** Widely used with extensive tutorials, documentation, and support.

**Use in Blood4Life:**
- Maps backend entities to MySQL tables.
- Works with Flyway migrations to ensure schema consistency.
- Facilitates data persistence and retrieval in the Spring Boot backend with minimal manual SQL.

### Database: MySQL

* [![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)

**Purpose:**  
MySQL is used as the **primary relational database** for Blood4Life, storing all application data including users, donations, hospitals, and related entities.

**Why MySQL was chosen:**
- **Reliability and stability:** Well-established relational database with decades of use in production systems.
- **ACID compliance:** Ensures data consistency and integrity, crucial for handling medical and donation records.
- **Integration with Hibernate:** Fully compatible with ORM for easy mapping of Java entities to database tables.
- **Scalability:** Can handle moderate to large datasets efficiently, with support for replication and clustering.
- **Cross-platform support:** Works on multiple operating systems and integrates seamlessly with Docker containers.
- **Strong community and documentation:** Extensive resources for troubleshooting and optimization.

**Advantages over alternatives (e.g., PostgreSQL, SQLite, MariaDB):**
- **Ease of use:** Simple setup and administration, ideal for educational and team projects.
- **Compatibility:** Fully supported by Hibernate and Flyway, reducing integration issues.
- **Performance:** Optimized for read-heavy workloads common in web applications.
- **Community support:** Extensive tutorials, guides, and forums available for development and maintenance.

**Use in Blood4Life:**
- Stores all application data securely and reliably.
- Works alongside Hibernate for ORM mapping.
- Ensures consistency and integrity of blood donation and user data across environments.

### Local Database: Docker

* [![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docs.docker.com/desktop/setup/install/windows-install/)

**Purpose:**  
Docker is used to **containerize the local database environment** for Blood4Life, ensuring consistent development setups across all team members’ machines.

**Why Docker was chosen:**
- **Environment consistency:** Guarantees that all developers run the database in the same configuration, avoiding “it works on my machine” issues.
- **Easy setup:** No need to manually install MySQL locally; Docker handles configuration automatically.
- **Isolation:** Each container runs independently, preventing conflicts with other services or databases.
- **Portability:** Containers can be deployed in any environment, from local machines to cloud servers.
- **Integration with CI/CD:** Works seamlessly with deployment pipelines for automated testing and deployment.

**Advantages over alternatives (e.g., local MySQL installation, VMs):**
- **Lightweight:** Containers consume fewer resources than full virtual machines.
- **Reproducible:** Every developer or tester can recreate the same environment in minutes.
- **Scalable:** Multiple containers can be spun up for testing or microservices setups.
- **Maintenance:** Easy to update or reset the database environment without affecting host system configurations.

**Use in Blood4Life:**
- Runs the MySQL database locally for development and testing.
- Ensures all team members work with the same schema and initial data.
- Simplifies the setup process for new developers joining the project.

### Frontend: ReactJS

* [![ReactJS](https://img.shields.io/badge/-ReactJS-09D3AC?style=flat&logo=createreactapp&logoColor=white)](https://es.react.dev/)

**Purpose:**  
ReactJS is used as the **frontend framework** for Blood4Life, providing a dynamic, interactive, and component-based user interface for users and administrators.

**Why ReactJS was chosen:**
- **Component-based architecture:** Promotes reusable, modular code, making the frontend more maintainable.
- **Virtual DOM:** Efficiently updates only parts of the UI that change, improving performance.
- **Strong ecosystem and community:** Wide range of libraries, tools, and community support.
- **Easy integration with backend APIs:** Works seamlessly with REST APIs provided by Spring Boot.
- **Flexibility:** Can be combined with state management libraries (Redux, Context API) for complex applications.
- **Developer productivity:** Hot module replacement and developer tools speed up development.

**Advantages over alternatives (e.g., Angular, Vue.js, plain JavaScript):**
- **Simpler learning curve** compared to Angular for small to medium projects.
- **Better performance** in rendering dynamic interfaces than plain JavaScript.
- **Flexibility and ecosystem** make it more adaptable than Vue.js for large-scale projects.
- **Strong integration** with modern tooling like Vite for fast builds and development server.

**Use in Blood4Life:**
- Implements all user-facing pages and interfaces for donation management.
- Works with Firebase for authentication and deployment.
- Interacts with the Spring Boot backend via REST API calls.

### API Endpoints: Postman

* [![PostMan](https://img.shields.io/badge/-Postman-FF6C37?style=flat&logo=postman&logoColor=white)](https://www.postman.com/)

**Purpose:**  
Postman is used for **testing, documenting, and validating the API endpoints** of the Blood4Life backend, ensuring proper communication between frontend and backend.

**Why Postman was chosen:**
- **API testing made easy:** Provides an intuitive interface to send requests and inspect responses.
- **Automated testing:** Supports test scripts and collections to automate endpoint verification.
- **Documentation generation:** Can generate API documentation automatically for team reference.
- **Collaboration:** Teams can share collections to ensure consistent testing and integration.
- **Integration with CI/CD:** Can be used in automated pipelines to validate API functionality before deployment.

**Advantages over alternatives (e.g., Insomnia, manual CURL requests):**
- **User-friendly interface** that simplifies testing for developers and non-developers.
- **Extensive community support** with tutorials and ready-to-use collections.
- **Automation capabilities** surpass basic tools like CURL or simple browser testing.
- **Cross-platform support** ensures team members on different OS can use the same tool.

**Use in Blood4Life:**
- Test all backend REST endpoints implemented with Spring Boot.
- Validate request and response formats between frontend and backend.
- Maintain a shared collection of requests for developers to use during development and debugging.

### Database & Backend Deploy: Railway

* [![Railway](https://img.shields.io/badge/-Railway-0B0D0E?style=flat&logo=railway&logoColor=white)](https://railway.app/)

**Purpose:**  
Railway is used for **deploying the backend and database** of Blood4Life to the cloud, enabling scalable, accessible, and reliable hosting of the application.

**Why Railway was chosen:**
- **Rapid deployment:** Allows fast deployment of Spring Boot applications and MySQL databases with minimal configuration.
- **Managed infrastructure:** Handles server setup, scaling, and maintenance automatically.
- **CI/CD friendly:** Easily integrates with GitHub Actions for automated deployments on push or merge.
- **Cloud accessibility:** Provides secure remote access to backend and database for developers and testers.
- **Monitoring and logs:** Offers real-time logging and monitoring for deployed services.

**Advantages over alternatives (e.g., Heroku, AWS, manual VPS):**
- **Simpler setup** compared to traditional cloud services like AWS or VPS setups.
- **Integrated database hosting** reduces the need for separate services.
- **Developer-focused UI** simplifies management for teams without deep DevOps knowledge.
- **Scalability** supports growing project needs without complex reconfiguration.

**Use in Blood4Life:**
- Hosts the Spring Boot backend application in the cloud.
- Provides a managed MySQL database for production.
- Integrates with CI/CD pipelines to automate deployment from GitHub.
- Ensures consistent, accessible backend for frontend applications and external integrations.

### Interface Design: Figma

* [![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat&logo=figma&logoColor=white)](https://www.figma.com/)

**Purpose:**  
Figma is used for **designing and prototyping the user interface** of Blood4Life, ensuring a visually appealing and user-friendly experience for all users.

**Why Figma was chosen:**
- **Collaborative design:** Multiple team members can work simultaneously on the same project in real-time.
- **Cross-platform:** Works on Windows, macOS, and web browsers without installation issues.
- **Prototyping:** Allows creation of interactive prototypes to simulate user flows before implementation.
- **Version control:** Maintains design history and allows easy rollback to previous versions.
- **Integration with development:** Developers can inspect designs, copy assets, and extract CSS directly from Figma.

**Advantages over alternatives (e.g., Adobe XD, Sketch):**
- **Web-based collaboration** makes it easier for distributed teams.
- **Free plan availability** supports educational projects and small teams.
- **Rich plugin ecosystem** extends functionality for icons, charts, accessibility checks, and more.
- **Faster iteration** due to real-time updates and feedback from stakeholders.

**Use in Blood4Life:**
- Designs all frontend interfaces, including dashboards, forms, and user flows.
- Provides interactive prototypes for testing usability and layout decisions.
- Serves as the reference for frontend developers implementing the UI in ReactJS.

### Version Control: Sourcetree

* [![Sourcetree](https://img.shields.io/badge/-Sourcetree-0052CC?style=flat&logo=sourcetree&logoColor=white)](https://www.sourcetreeapp.com/)

**Purpose:**  
Sourcetree is used for **managing Git repositories** in Blood4Life, providing a graphical interface for version control, branch management, and collaboration.

**Why Sourcetree was chosen:**
- **Visual Git management:** Simplifies Git operations such as commits, merges, rebases, and branch management.
- **Ease of use:** Ideal for developers who prefer a GUI over command-line Git.
- **Integration with remote repositories:** Supports GitHub, GitLab, Bitbucket, and others for seamless collaboration.
- **Conflict resolution:** Provides visual tools for handling merge conflicts.
- **Repository history and tracking:** Makes it easy to review commits, history, and changes over time.

**Advantages over alternatives (e.g., command-line Git, GitKraken):**
- **User-friendly interface** for beginners and intermediate developers.
- **Free to use** with full Git functionality.
- **Lightweight and fast** compared to some other GUI Git clients.
- **Educational value:** Makes it easier to learn Git concepts through visual representation.

**Use in Blood4Life:**
- Manage the project’s Git repository for frontend and backend.
- Facilitate collaboration among team members.
- Track changes, maintain branches, and handle merges efficiently.


## Other Technologies Used

### IntelliJ IDEA (IDE)

* [![IntelliJ](https://img.shields.io/badge/-IntelliJ_IDEA-000000?style=flat&logo=intellijidea&logoColor=white)](https://www.jetbrains.com/es-es/idea/)

**Purpose:**  
IntelliJ IDEA is used as the **primary Integrated Development Environment (IDE)** for developing both backend and frontend parts of Blood4Life.

**Why IntelliJ IDEA was chosen:**
- **Smart code assistance:** Provides advanced autocomplete, refactoring, and error detection.
- **Integration with frameworks:** Works seamlessly with Spring Boot, Hibernate, and Node.js projects.
- **Version control support:** Integrates with Git, GitHub, and Sourcetree for easy repository management.
- **Debugging tools:** Advanced debugger and profiler support for Java and JavaScript.
- **Productivity features:** Supports live templates, code navigation, and project-wide searches.

**Advantages over alternatives (e.g., Eclipse, VS Code):**
- More complete for enterprise-level Java applications than Eclipse.
- Stronger integrated support for Spring Boot and database management than VS Code.
- Excellent refactoring and navigation tools for large projects.

**Use in Blood4Life:**
- Develop backend (Spring Boot + Hibernate) and frontend (ReactJS + Node.js).
- Manage project files, dependencies, and debugging processes efficiently.

---

### Vite (Frontend Build Tool)

* [![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)

**Purpose:**  
Vite is used as the **frontend build and development tool** for ReactJS in Blood4Life.

**Why Vite was chosen:**
- **Fast development server:** Instant hot module replacement for faster iteration.
- **Optimized builds:** Efficiently bundles ReactJS apps for production.
- **Easy configuration:** Minimal setup required compared to Webpack.
- **Modern tooling:** Supports ES modules, TypeScript, and modern JavaScript features.

**Advantages over alternatives (e.g., Webpack, Parcel):**
- Faster startup and rebuild times than Webpack.
- Lighter configuration compared to Parcel or older bundlers.
- Better support for modern frontend frameworks like React and Vue.

**Use in Blood4Life:**
- Serve frontend during development with fast HMR.
- Build optimized production bundles for Firebase deployment.

---

### Node.js (Runtime Environment)

* [![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/download/)

**Purpose:**  
Node.js is used as the **runtime environment** for running frontend build tools and server-side scripts in Blood4Life.

**Why Node.js was chosen:**
- **JavaScript runtime:** Allows running JavaScript outside the browser for build and automation tasks.
- **Package management:** Works with npm/yarn for installing project dependencies.
- **Integration with frontend tooling:** Required for ReactJS development with Vite.
- **Cross-platform:** Works on Windows, macOS, and Linux.

**Advantages over alternatives (e.g., Deno, Python scripts):**
- More mature ecosystem and extensive library support.
- Standard for modern frontend development workflows.
- Seamless integration with ReactJS and Vite.

**Use in Blood4Life:**
- Run frontend development server and build scripts.
- Manage npm packages and dependencies for the ReactJS frontend.

---

### Firebase (Hosting & Authentication)

* [![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/?hl=es-419)

**Purpose:**  
Firebase is used for **hosting the frontend**, managing authentication, and integrating cloud services in Blood4Life.

**Why Firebase was chosen:**
- **Frontend hosting:** Provides fast and secure hosting for the ReactJS application.
- **Authentication services:** Offers email/password, Google, and other OAuth methods.
- **Real-time database & cloud services:** Can be used for notifications, analytics, and storage.
- **CI/CD integration:** Works with GitHub Actions for automated deployments.

**Advantages over alternatives (e.g., Netlify, AWS Amplify):**
- Simple setup for hosting and authentication in educational projects.
- Provides integrated tools for deployment, monitoring, and security.
- Real-time updates and hosting with SSL by default.

**Use in Blood4Life:**
- Host the ReactJS frontend online.
- Provide authentication for users and administrators.
- Automate deployments with GitHub Actions and CI/CD pipelines.