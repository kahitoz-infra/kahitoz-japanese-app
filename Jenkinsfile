pipeline {
    agent any

    environment {
        IMAGE_NAME = "japanese-frontend"
        TAG = "latest"
        REGISTRY = "127.0.0.1:5000"
        DEPLOYMENT_NAME = "japanese-frontend"
        NAMESPACE = "apps"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker Image...'
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Tag Image for Registry') {
            steps {
                script {
                    echo 'Tagging image for remote registry...'
                    sh "docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Push Image to Registry') {
            steps {
                script {
                    echo 'Pushing Docker Image to Registry...'
                    // Optional login step if auth is required:
                    // sh "docker login ${REGISTRY} -u <username> -p <password>"
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Rolling Restart Deployment') {
            steps {
                script {
                    echo "Restarting deployment ${DEPLOYMENT_NAME} in namespace ${NAMESPACE}..."
                    sh '''
                    export KUBECONFIG=/home/jenkins/.kube/config
                    kubectl rollout restart deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}
                    kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}
                    '''
                }
            }
        }
        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up unused Docker resources...'
                    // Remove dangling images (not tagged & not used by any container)
                    sh "docker image prune -f"
                    // Remove stopped containers (optional)
                    sh "docker container prune -f"
                }
            }
        }
    }
}
