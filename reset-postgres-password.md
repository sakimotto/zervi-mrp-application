# Reset PostgreSQL Password

Since PostgreSQL didn't prompt for a password during installation, we need to set one manually. Here's how:

## Method 1: Using psql (Command Line)

1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory (typically `C:\Program Files\PostgreSQL\[version]\bin`)
3. Run the following command to connect as the postgres user:

```
psql -U postgres
```

4. If it connects without asking for a password, you're in! Now set a password:

```sql
ALTER USER postgres WITH PASSWORD 'zervi2025';
```

5. Type `\q` to exit psql

## Method 2: Using pgAdmin

If you can connect to PostgreSQL in pgAdmin without a password:

1. Right-click on "Login/Group Roles" > "postgres"
2. Select "Properties"
3. Go to the "Definition" tab
4. Enter "zervi2025" as the password
5. Click "Save"

## Method 3: Edit pg_hba.conf (If the above methods don't work)

1. Locate your PostgreSQL data directory (typically `C:\Program Files\PostgreSQL\[version]\data`)
2. Open `pg_hba.conf` in a text editor (as Administrator)
3. Find the lines for local connections and change the authentication method from `md5` to `trust`
4. Save the file
5. Restart PostgreSQL service (in Services app)
6. Now you can connect without a password and set one using Method 1 or 2
7. After setting the password, change `trust` back to `md5` in pg_hba.conf
8. Restart PostgreSQL service again

## Testing the Connection

After setting the password, test the connection:

```
cd src/backend
node test-postgres-connection.js
```

If successful, you'll see: "SUCCESS: Connected without SSL!"

## Running the Setup Script

Once the connection is working:

```
cd ../..
powershell -ExecutionPolicy Bypass -File .\setup-dev-environment.ps1