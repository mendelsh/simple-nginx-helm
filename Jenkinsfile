
pipeline {
  agent {
    kubernetes {
      label 'agent-template'
      inheritFrom 'agent-template'
    }
  }
    environment {
        REGISTRY = 'mendelsh/calculator'
        TAG = "build-${env.BUILD_NUMBER}"
        CREDENTIALS_ID = 'dockerhub-creds'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/youruser/static-site.git'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.build("${REGISTRY}:${TAG}")
                    docker.withRegistry('https://index.docker.io/v1/', CREDENTIALS_ID) {
                        docker.image("${REGISTRY}:${TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                      helm upgrade --install site ./helm/site \
                        --set image.repository=${REGISTRY} \
                        --set image.tag=${TAG}
                    """
                }
            }
        }
    }
}

