variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-north-1"
}

variable "key_name" {
  description = "Existing EC2 key pair name to SSH into instances"
  type        = string
}

variable "frontend_instance_type" {
  description = "Instance type for frontend EC2"
  type        = string
  default     = "t3.micro"
}

variable "backend_instance_type" {
  description = "Instance type for backend EC2"
  type        = string
  default     = "t3.micro"
}

variable "elasticsearch_instance_type" {
  description = "EC2 instance type for Elasticsearch"
  type        = string
  default     = "t3.micro"
}
