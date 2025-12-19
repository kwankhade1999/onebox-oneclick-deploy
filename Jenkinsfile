pipeline {
  agent any

  environment {
    AWS_DEFAULT_REGION = "eu-north-1"
  }

  stages {

    stage('Checkout Code') {
      steps {
        git branch: 'main',
            url: 'https://github.com/kwankhade1999/onebox-oneclick-deploy.git'
      }
    }

    stage('Terraform Init') {
      steps {
        dir('infra') {
          sh 'terraform init'
        }
      }
    }

    stage('Terraform Apply') {
      steps {
        dir('infra') {
          sh 'terraform apply -auto-approve'
        }
      }
    }

    stage('Generate Inventory') {
      steps {
        dir('infra') {
          sh '''
            terraform output -raw inventory > ../ansible/inventory.ini
          '''
        }
      }
    }

    stage('Ansible Deploy') {
      steps {
        dir('ansible') {
          sh '''
            ansible-playbook -i inventory.ini site.yml \
              --private-key=/var/lib/jenkins/.ssh/onebox.pem \
              --ssh-common-args='-o StrictHostKeyChecking=no'
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ OneBox deployed successfully"
    }
    failure {
      echo "❌ Deployment failed"
    }
  }
}
