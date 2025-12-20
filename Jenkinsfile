pipeline {
  agent any

  parameters {
    booleanParam(
      name: 'DEPLOY',
      defaultValue: true,
      description: 'Create infrastructure and deploy OneBox'
    )
    booleanParam(
      name: 'DESTROY',
      defaultValue: false,
      description: 'Destroy all infrastructure'
    )
  }

  environment {
    AWS_DEFAULT_REGION = "eu-north-1"
  }

  stages {

    stage('Validate Parameters') {
      steps {
        script {
          if (params.DEPLOY && params.DESTROY) {
            error "❌ Both DEPLOY and DESTROY cannot be true at the same time"
          }
          if (!params.DEPLOY && !params.DESTROY) {
            error "❌ Select at least one option: DEPLOY or DESTROY"
          }
        }
      }
    }

    stage('Checkout Code') {
      when { expression { params.DEPLOY || params.DESTROY } }
      steps {
        git branch: 'main',
            url: 'https://github.com/kwankhade1999/onebox-oneclick-deploy.git'
      }
    }

    stage('Terraform Init') {
      when { expression { params.DEPLOY || params.DESTROY } }
      steps {
        dir('infra') {
          sh 'terraform init'
        }
      }
    }

    stage('Terraform Apply') {
      when { expression { params.DEPLOY } }
      steps {
        dir('infra') {
          sh 'terraform apply -auto-approve'
        }
      }
    }

    stage('Ansible Deploy') {
      when { expression { params.DEPLOY } }
      steps {
        dir('ansible') {
          sh '''
            ansible-playbook \
              -i inventory.ini \
              site.yml \
              --private-key=/var/lib/jenkins/.ssh/test1.pem \
              --ssh-common-args='-o StrictHostKeyChecking=no'
          '''
        }
      }
    }

    stage('Terraform Destroy') {
      when { expression { params.DESTROY } }
      steps {
        dir('infra') {
          sh 'terraform destroy -auto-approve'
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully"
    }
    failure {
      echo "❌ Pipeline failed"
    }
  }
}
