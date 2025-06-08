pipeline {
    agent {
        docker {
            image 'docker:24.0'  // lightweight docker image
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        IMAGE_NAME = 'mendelsh/calculator'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/mendelsh/simple-nginx-helm.git', branch: 'main'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-creds') {
                        def image = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                        image.push()
                    }
                }
            }
        }

        stage('Update Helm Chart') {
            steps {
                sh """
                    sed -i 's|repository: .*|repository: ${IMAGE_NAME}|' nginx-chart/values.yaml
                    sed -i 's|tag: .*|tag: "${IMAGE_TAG}"|' nginx-chart/values.yaml
                """
            }
        }

        stage('Deploy to Minikube with Helm') {
            steps {
                withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG')]) {
                    sh '''
                        helm upgrade --install nginx-release ./nginx-chart \
                          --kubeconfig $KUBECONFIG
                    '''
                }
            }
        }
    }
}
