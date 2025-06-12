pipeline {
    agent none
    environment {
        IMAGE_NAME = 'mendelsh/calculator'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        GIT_REPO = 'https://github.com/mendelsh/simple-nginx-helm.git'
        CHART_PATH = 'nginx-chart'
    }
    stages {
        stage('Build & Push') {
            agent {
                docker {
                    image 'mendelsh/docker-helm:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
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
        
        stage('Deploy') {
            agent {
                docker {
                    image 'mendelsh/docker-helm:latest'
                    args '-v ~/.aws:/root/.aws -v ~/.kube:/root/.kube'
                }
            }
            steps {
                sh '''
                    # Create and run Kubernetes job
                    cat << EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: deploy-${BUILD_NUMBER}
  namespace: mendel-ns
spec:
  ttlSecondsAfterFinished: 30
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: deployer
        image: alpine/helm:latest
        command: ["/bin/sh", "-c"]
        args:
        - |
          apk add --no-cache git
          git clone ${GIT_REPO} /tmp/repo
          cd /tmp/repo/${CHART_PATH}
          helm upgrade --install nginx-release . \\
            --namespace mendel-ns \\
            --set image.repository=${IMAGE_NAME} \\
            --set image.tag=${IMAGE_TAG} \\
            --create-namespace
EOF
                    
                    # Wait for completion
                    kubectl wait --for=condition=complete --timeout=300s job/deploy-${BUILD_NUMBER} -n mendel-ns
                '''
            }
        }
    }
}