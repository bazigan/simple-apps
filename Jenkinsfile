pipeline {
    agent { label 'server1-amar' }

    stages {
        stage('Pull SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/bazigan/simple-apps.git'
            }
        }
        
        stage('Build') {
            steps {
                sh'''
                cd app
                npm install
                '''
            }
        }
        
        stage('Testing') {
            steps {
                sh'''
                cd app
                APP_PORT=4001 npm test
                APP_PORT=4001 npm run test:coverage
                '''
            }
        }
        
        stage('Code Review') {
            steps {
                sh'''
                sonar-scanner   -Dsonar.projectKey=simple-amar   -Dsonar.sources=.   -Dsonar.host.url=http://172.23.3.13:9000   -Dsonar.token=sqp_56158b288ee6e9c230bcc25bbdd798e18c765b02
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh'''
                docker compose up --build -d
                '''
            }
        }
        
        stage('Backup') {
            steps {
                 sh 'docker compose push'
            }
        }
    }
}