pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['docker', 'k8s'],
            description: 'Choose where to deploy the application'
        )
    }

    environment {
        IMAGE_NAME      = "japanese-frontend"
        TAG             = "latest"
        REGISTRY        = "127.0.0.1:5000"
        DEPLOYMENT_NAME = "japanese-frontend"
        NAMESPACE       = "apps"

        // Docker specific
        DOCKER_HOST     = "tcp://10.243.52.185:2375"
        APP_NETWORK     = "app"
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
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (params.DEPLOY_TARGET == 'k8s') {
                        echo "Deploying ${DEPLOYMENT_NAME} to Kubernetes..."
                        sh '''
                        export KUBECONFIG=/home/jenkins/.kube/config
                        kubectl rollout restart deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}
                        kubectl rollout status deployment/${DEPLOYMENT_NAME} -n ${NAMESPACE}
                        '''
                    } else {
                        echo "Deploying ${DEPLOYMENT_NAME} to Remote Docker..."

                        // Ensure app network exists
                        sh """
                            docker -H ${DOCKER_HOST} network inspect ${APP_NETWORK} >/dev/null 2>&1 || \
                            docker -H ${DOCKER_HOST} network create ${APP_NETWORK}
                        """

                        // Stop and remove old container if it exists
                        sh """
                            docker -H ${DOCKER_HOST} ps -q --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                            docker -H ${DOCKER_HOST} stop ${DEPLOYMENT_NAME} || true
                        """
                        sh """
                            docker -H ${DOCKER_HOST} ps -aq --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                            docker -H ${DOCKER_HOST} rm ${DEPLOYMENT_NAME} || true
                        """

                        // Run new container (listens on 3000 internally)
                        sh """
                            docker -H ${DOCKER_HOST} run -d --name ${DEPLOYMENT_NAME} \\
                            --network ${APP_NETWORK} \\
                            ${REGISTRY}/${IMAGE_NAME}:${TAG}
                        """
                    }
                }
            }
        }

        stage('Cleanup Local') {
            steps {
                script {
                    echo 'Cleaning up unused local Docker resources...'
                    sh "docker image prune -f"
                    sh "docker container prune -f"
                }
            }
        }
    }
}
