pipeline {
    agent { label 'dev' }

    stages {
        stage('Pull SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/bazigan/simple-apps.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Testing') {
            steps {
                sh'''
                cp app/.env .
                APP_PORT=5001 npm test
                APP_PORT=5001 npm run test:coverage
                '''
            }
        }
        
        stage('Code Review') {
            steps {
                sh'''
                cd app
                sonar-scanner \
                -Dsonar.projectKey=simple-apps \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://172.23.2.127:9000 \
                -Dsonar.token=sqp_e4e3f3887aac56fbc184cdc80f0ddb8b5533de63
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker compose up --build -d'
            }
        }
        
        stage('Backup') {
            steps {
                 sh 'docker compose push' 
            }
        }
    }
}