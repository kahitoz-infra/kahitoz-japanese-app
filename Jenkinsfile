pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TARGET',
            choices: ['docker', 'k8s'],
            description: 'Choose where to deploy the application'
        )
        booleanParam(
            name: 'BUILD_ANDROID_APK',
            defaultValue: false,
            description: 'Whether to build the Android APK'
        )
    }

    environment {
        IMAGE_NAME      = "japanese-frontend"
        TAG             = "latest"
        REGISTRY        = "10.243.4.236:5000"
        DEPLOYMENT_NAME = "japanese-frontend"
        NAMESPACE       = "apps"

        // Docker specific
        DOCKER_HOST     = "tcp://10.243.52.185:2375"
        APP_NETWORK     = "app"

        // GitHub token from Jenkins credentials
        GITHUB_TOKEN    = credentials('github-pat')
        GITHUB_REPO     = "kahitoz/kahitoz-japanese-app"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing NPM packages...'
                sh 'npm ci --force'
            }
        }

        stage('Build Web App') {
            steps {
                echo 'Building Next.js production assets...'
                sh 'npm run build'
            }
        }

        stage('Sync Capacitor Android') {
            steps {
                echo 'Syncing Capacitor Android platform...'
                sh 'npx cap sync android'
            }
        }

        stage('Build APK') {
            when {
                expression { params.BUILD_ANDROID_APK }
            }
            steps {
                dir('android') {
                    echo 'Setting up Android SDK...'
                    sh 'echo "sdk.dir=/var/lib/jenkins/android-sdk" > local.properties'

                    echo 'Building Android APK...'
                    sh './gradlew assembleDebug'

                    echo 'Printing SHA1 fingerprint...'
                    sh './gradlew signingReport | grep SHA1 || true'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'android/app/build/outputs/apk/debug/app-debug.apk', fingerprint: true

                    echo 'Uploading APK to private S3/MinIO...'

                    withCredentials([usernamePassword(credentialsId: 'minio-creds', usernameVariable: 'MINIO_USER', passwordVariable: 'MINIO_PASS')]) {
                        sh '''
                            APK_PATH=android/app/build/outputs/apk/debug/app-debug.apk
                            APK_NAME=app-debug-$(date +%Y%m%d-%H%M%S).apk
                            MINIO_ENDPOINT="http://127.0.0.1:9000"
                            BUCKET_NAME="apks"

                            echo "Uploading $APK_NAME to MinIO bucket $BUCKET_NAME"

                            # Check if mc is available, otherwise use aws cli
                            if command -v mc >/dev/null 2>&1; then
                                echo "Using MinIO client (mc)"
                                mc alias set minio "$MINIO_ENDPOINT" "$MINIO_USER" "$MINIO_PASS"
                                mc mb minio/$BUCKET_NAME || true
                                mc cp "$APK_PATH" "minio/$BUCKET_NAME/$APK_NAME"
                                mc share download "minio/$BUCKET_NAME/$APK_NAME" --expire=720h || true
                            elif command -v aws >/dev/null 2>&1; then
                                echo "Using AWS CLI with S3-compatible endpoint"
                                export AWS_ACCESS_KEY_ID="$MINIO_USER"
                                export AWS_SECRET_ACCESS_KEY="$MINIO_PASS"
                                aws --endpoint-url="$MINIO_ENDPOINT" s3 mb s3://$BUCKET_NAME || true
                                aws --endpoint-url="$MINIO_ENDPOINT" s3 cp "$APK_PATH" "s3://$BUCKET_NAME/$APK_NAME"
                                echo "APK uploaded successfully to s3://$BUCKET_NAME/$APK_NAME"
                            else
                                echo "Neither mc nor aws cli found. Attempting curl with proper S3 signature..."
                                # Simple PUT upload (may not work with all MinIO configurations)
                                curl -v -X PUT \
                                    --data-binary "@$APK_PATH" \
                                    -H "Content-Type: application/vnd.android.package-archive" \
                                    "$MINIO_ENDPOINT/$BUCKET_NAME/$APK_NAME" \
                                    --user "$MINIO_USER:$MINIO_PASS" || echo "Upload failed, but continuing..."
                            fi

                            echo "SHA1 fingerprint of APK:"
                            keytool -list -printcert -jarfile "$APK_PATH" | grep SHA1 || echo "Could not extract SHA1 fingerprint"
                        '''
                    }
                }
            }

        }

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
                        sh """
                            docker -H ${DOCKER_HOST} network inspect ${APP_NETWORK} >/dev/null 2>&1 || \
                            docker -H ${DOCKER_HOST} network create ${APP_NETWORK}
                        """
                        sh """
                            docker -H ${DOCKER_HOST} ps -q --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                            docker -H ${DOCKER_HOST} stop ${DEPLOYMENT_NAME} || true
                        """
                        sh """
                            docker -H ${DOCKER_HOST} ps -aq --filter name=${DEPLOYMENT_NAME} | grep -q . && \
                            docker -H ${DOCKER_HOST} rm ${DEPLOYMENT_NAME} || true
                        """
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
