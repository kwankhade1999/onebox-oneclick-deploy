[frontend]
frontend ansible_host=${frontend_ip} ansible_user=ubuntu

[backend]
backend ansible_host=${backend_ip} ansible_user=ubuntu

[elasticsearch]
elasticsearch ansible_host=${elasticsearch_ip} ansible_user=ubuntu

