# WordPress Customizer Tool

A Docker-based WordPress development and customization environment.

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd wordpress-customizer-tool
   ```

2. **Configure environment variables** (optional):
   
   Create a `.env` file in the project root to customize settings:
   ```bash
   # WordPress Configuration
   WORDPRESS_PORT=8000
   WORDPRESS_DEBUG=1
   WORDPRESS_TABLE_PREFIX=wp_
   
   # MySQL Configuration
   MYSQL_PORT=3306
   MYSQL_ROOT_PASSWORD=your_secure_root_password
   MYSQL_DATABASE=wp-app
   MYSQL_USER=wordpress
   MYSQL_PASSWORD=your_secure_password
   ```

3. **Create custom PHP configuration** (optional):
   
   Create a `custom.ini` file for PHP settings:
   ```ini
   upload_max_filesize = 64M
   post_max_size = 64M
   memory_limit = 256M
   max_execution_time = 300
   ```

4. **Start the services**:
   ```bash
   docker-compose up -d
   ```

5. **Access WordPress**:
   - Frontend: http://localhost:8000
   - Database: localhost:3306

6. **Stop the services**:
   ```bash
   docker-compose down
   ```

## Services

- **WordPress**: Latest WordPress version with customizable PHP configuration
- **MySQL 5.7**: Database server with persistent storage
- **WP-CLI**: Command-line interface for WordPress management

## Features

- **Environment Variables**: All credentials and ports configurable via `.env` file
- **Health Checks**: Automatic health monitoring for WordPress and MySQL services
- **Named Volumes**: Persistent storage for WordPress files, logs, and database
- **Network Isolation**: Dedicated bridge network for service communication
- **Security**: Read-only mount for PHP configuration, secure credential handling

## Directory Structure

```
.
├── docker-compose-wordpress.yml    # Docker Compose configuration
├── .env                            # Environment variables (create manually)
├── custom.ini                      # PHP configuration (create manually)
├── README.md                       # This file
└── .srv/                           # Legacy directory (not used with named volumes)
```

## Common Commands

### View logs
```bash
docker-compose logs -f wordpress
docker-compose logs -f mysql
```

### Run WP-CLI commands
```bash
docker-compose run --rm wpcli plugin list
docker-compose run --rm wpcli theme activate twentysixteen
```

### Restart services
```bash
docker-compose restart wordpress
docker-compose restart mysql
```

### Rebuild containers
```bash
docker-compose up -d --build
```

## Troubleshooting

### Connection Issues
- Ensure Docker Desktop is running
- Check if ports 8000 and 3306 are not in use by other services
- Verify health checks pass: `docker-compose ps`

### Database Connection Errors
- Wait for MySQL to fully initialize (check health status)
- Verify credentials in `.env` file match across services

### Permission Issues
- For Linux/Mac: Ensure proper volume permissions
- For Windows: Check Docker Desktop file sharing settings

## Security Notes

- Change default passwords in production environments
- Use strong, unique passwords for all credentials
- Consider using Docker secrets for sensitive data in production
- Keep Docker images updated regularly

## License

See LICENSE file for details.