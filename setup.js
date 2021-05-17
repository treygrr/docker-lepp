const q = require('./nodesetup/question')
const fs = require('fs')
const { execSync, exec } = require("child_process");
const { start } = require('repl');

console.log('Welcome to the docker-lepp setup. Let me ask you a few questions. CTL+C to exit.');
function createENVstring(data) {
return `DOCKER_CONTAINER_PREFIX=${data.prefix}

DOCKER_NGINX_PORT=${data.nginx}
DOCKER_NGINX_DEV_PORT=${data.nginx_dev_port}
DOCKER_NGINX_HOST=${data.nginx_host}
DOCKER_NGINX_CONF_FILE=${data.nginx_conf_file_location}
DOCKER_NGINX_CONF_SERVER_FILE=${data.nginx_conf_server_file}
DOCKER_PHP_INI_FILE=${data.php_env_ini_file}

DOCKER_POSTGRES_USER=${data.postgres_user}
DOCKER_POSTGRES_PASSWORD=${data.postgres_password}
DOCKER_POSTGRES_DB=${data.postgres_database}
DOCKER_POSTGRES_LOCAL_PORT=${data.postgres_local_port}
DOCKER_POSTGRES_CONTAINER_PORT=${data.postgres_container_port}

DOCKER_PGADMIN_DEFAULT_EMAIL=${data.pgadmin_default_email}
DOCKER_PGADMIN_DEFAULT_PASSWORD=${data.pgadmin_pgadmin_default_password}`
}

async function checkIfCorrect(data) {
    console.log(createENVstring(data))
    let correct = await q.ask('\n\n\nIs the above information correct?[y][yes][n][no]')||'y'
    correct = correct.toLowerCase()
    if (correct !== 'yes' && correct !== 'y') {
         main()
         return
    }
    fs.writeFileSync('.env', createENVstring(data))
    updateNginxConf(data)
    createDockerScripts(data)
    startDocker(data)
    
}
let data = {}
const main  = async () => {
    data.prefix = await q.ask('What will the prefix to this project be? \nTry and abbreviate long words like tructfaultcodes to just tfc for brevitys sake (ex: vin, ti)')||'template'
    data.nginx = await q.ask('What port would you like Nginx to be open to inside the container? (default: 80)')||80
    data.nginx_dev_port = await q.ask('What port would you like Nginx to be available in your browser at? (default: 1738)')||1738
    data.nginx_host = await q.ask('What will the domain of this application be when in production? (default: tetsapi.com)')||'testapi.com'
    data.nginx_conf_file_location = await q.ask('What is the location of your nginx conf file? (default ./nginx/siteconfig.conf)')||'./nginx/siteconfig.conf'
    data.nginx_conf_server_file = await q.ask('What is the location of your Nginx server conf file? (default: ./nginx/siteconfigServer.conf)')||'./nginx/siteconfigServer.conf'
    data.php_env_ini_file = await q.ask('What location is your php ini file located? (default: ./php/php-custom-config.ini')||'./php/php-custom-config.ini'
    data.postgres_user = await q.ask('What do you want your username to be for this projects postgres database? (default: postgres)')||'postgres'
    data.postgres_password = await q.ask('What do you want your postgres database password to be for this project? (default: password)')||'password'
    data.postgres_database = await q.ask('What is the name of the database that you will store your tables in? (default: testdb)')||'testdb'
    data.postgres_local_port = await q.ask('What is the local port you wish to use to connect to your PG database? (default: 5432)')||5432
    data.postgres_container_port = await q.ask('What port does postgres function on inside the container? (default: 5432)')||5432
    data.pgadmin_default_email = await q.ask('What email do you want to use to log into pgAdmin? (default: admin@admin.com)')||'admin@admin.com'
    data.pgadmin_pgadmin_default_password = await q.ask('What password do you want to use to log into pgAdmin? (default: admin)')||'admin'
    data.envmode = await q.ask('What mode are we in? (default: development [staging, production])')||'development'
    checkIfCorrect(data)
}

function updateNginxConf (data) {
    const content = fs.readFileSync("./nginx/siteconfigServer.conf", 'utf-8');
    console.log('Reading nginx config server file')
    let newText = content.replace(/fastcgi_pass(.*?);/, `fastcgi_pass ${data.prefix}-php:9000;`)
    console.log('Updated nginx config server file to access: ' + data.prefix + '-php container for php file processing.')
    fs.writeFileSync('./nginx/siteconfigServer.conf', newText, 'utf8')
}

function updatePHPConf (data) {
    const content = fs.readFileSync("./app/.env", 'utf-8');
    console.log('Reading laravel env config server file')
    let newText = content.replace('DB_CONNECTION=mysql', `DB_CONNECTION=pgsql`)
    newText = newText.replace('DB_HOST=127.0.0.1', `DB_HOST=${data.prefix}-postgres`)
    newText = newText.replace('DB_PORT=3306', `DB_PORT=5432`)
    newText = newText.replace('DB_DATABASE=laravel', `DB_DATABASE=${data.postgres_database}`)
    newText = newText.replace('DB_USERNAME=root', `DB_USERNAME=${data.postgres_user}`)
    newText = newText.replace('DB_PASSWORD=', `DB_PASSWORD=${data.postgres_password}`)
    
    console.log('Updated laravel env config server file with database credentials based on settings provided.')
    fs.writeFileSync('./app/.env', newText, 'utf8')
}

function createDockerScripts (data) {
    let nginx = `#!/bin/bash\ndocker exec -it ${data.prefix}-nginx bash -c "cd app"`
    let postgres = `#!/bin/bash\ndocker exec -it ${data.prefix}-postgres bash`
    let pgadmin = `#!/bin/bash\ndocker exec -it ${data.prefix}-pgadmin bash`
    let php = `#!/bin/bash\ndocker exec -it ${data.prefix}-php sh`
    let update = `docker exec ${data.prefix}-nginx bash -c "ls && cd ../app && ls && composer install"`
    let laravel = `docker exec ${data.prefix}-nginx bash -c "ls && cd ../app && composer create-project laravel/laravel ${data.prefix} && mv ${data.prefix}/{.,}* /app && cd ../ && chmod -R a+rwx app && rm -r ${data.prefix}"`
    fs.writeFileSync('./shellscripts/nginx.sh', nginx, 'utf8')
    fs.writeFileSync('./shellscripts/postgres.sh', postgres, 'utf8')
    fs.writeFileSync('./shellscripts/pgadmin.sh', pgadmin, 'utf8')
    fs.writeFileSync('./shellscripts/php.sh', php, 'utf8')
    fs.writeFileSync('./shellscripts/update.sh', update, 'utf8')
    fs.writeFileSync('./shellscripts/installLaravel.sh', laravel, 'utf8')
    console.log('Docker ssh scripts created!')
}
async function startDocker (data) {
    var spawn = require('child_process').spawn
    var ls = spawn('docker-compose', ['up', '-d']);
    console.log('Running Docker installer. This might take a moment.')
    ls.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      
      ls.stderr.on('data', function (data) {
        console.log(data.toString());
      });
      
      ls.on('close', async function (code) {
        console.log('child process exited with code ' + code.toString());
        installLaravel(data)
    });

}

const installLaravel  = async (data) => {
    var spawn = require('child_process').spawn
    var ls = spawn('bash', ['-c', 'cd shellscripts && ls && ./installLaravel.sh']);
    console.log('Running Laravel installer. This might take a moment.')
    ls.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      
      ls.stderr.on('data', function (data) {
        console.log(data.toString());
      });
      
      ls.on('exit', async function (code) {
        console.log('child process exited with code ' + code.toString());
        updatePHPConf(data);
        q.exit();
    });
}

main()

