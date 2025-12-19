terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.aws_region
}

# Use default VPC to keep things simple
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "onebox_sg" {
  name        = "onebox-sg"
  description = "Allow SSH, HTTP, backend traffic"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (frontend)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend port (for testing/health)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "onebox-sg"
  }
}

# Latest Ubuntu 24.04 LTS
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "frontend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.frontend_instance_type
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.onebox_sg.id]
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = "onebox-frontend"
    Role = "frontend"
  }
}

resource "aws_instance" "backend" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.backend_instance_type
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.onebox_sg.id]
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = "onebox-backend"
    Role = "backend"
  }
}

resource "aws_instance" "elasticsearch" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.elasticsearch_instance_type
  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.onebox_sg.id]
  key_name                    = var.key_name
  associate_public_ip_address = true

  tags = {
    Name = "onebox-elasticsearch"
    Role = "elasticsearch"
  }
}

resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../ansible/inventory.ini"

  content = templatefile("${path.module}/inventory.tpl", {
    frontend_ip      = aws_instance.frontend.public_ip
    backend_ip       = aws_instance.backend.public_ip
    elasticsearch_ip = aws_instance.elasticsearch.public_ip
  })
}