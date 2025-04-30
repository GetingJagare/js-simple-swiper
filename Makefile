build:
	docker build -f Dockerfile -t simple-swiper:latest .
dev:
	docker run \
		--rm \
		-d \
		-e NODE_ENV=development \
		-p 9000:9000 \
		-v ./:/var/www/app:rw \
		--name simple-swiper simple-swiper:latest
prod:
	docker run \
		--rm \
		-e NODE_ENV=production \
		-v ./:/var/www/app:rw \
		--name simple-swiper simple-swiper:latest
stop:
	docker container stop simple-swiper