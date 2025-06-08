pipeline {
  agent none

  environment {
    IMAGE_NAME = 'mendelsh/calculator'
    IMAGE_TAG  = "${env.BUILD_NUMBER}"
    KUBECONFIG = '/home/jenkins/.kube/config'
  }

  stages {
    stage('Checkout & Build') {
      agent {
        docker {
          image 'mendelsh/docker-helm:latest'
          args  '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        checkout scm
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-creds') {
            def img = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
            img.push()
          }
        }
      }
    }

    stage('Update Helm Chart') {
      agent any
      steps {
        sh '''
          sed -i "s|repository: .*|repository: ${IMAGE_NAME}|" nginx-chart/values.yaml
          sed -i "s|tag: .*|tag: \"${IMAGE_TAG}\"|"    nginx-chart/values.yaml
        '''
      }
    }

    stage('Deploy with Helm') {
      agent any
      steps {
        sh '''
          helm upgrade --install nginx-release ./nginx-chart \
            --namespace mendel-ns \
            --kubeconfig $KUBECONFIG
        '''
      }
    }
  }
}
