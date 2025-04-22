build:
	docker build -f Dockerfile -t simple-swiper:latest --rm .
run:
	docker run -p 9000:9000 -v ./:/var/www/app:rw --name simple-swiper simple-swiper:latest
stop:
	docker container stop simple-swiper && docker container prune -f