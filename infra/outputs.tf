output "frontend_public_ip" {
  value = aws_instance.frontend.public_ip
}

output "backend_public_ip" {
  value = aws_instance.backend.public_ip
}

output "elasticsearch_public_ip" {
  value = aws_instance.elasticsearch.public_ip
}
