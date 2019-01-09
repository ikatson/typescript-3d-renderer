all:

server:
	python3 -m http.server

webpack:
	npm start

prod:
	npm run-script prod

tsc:
	tsc

clean:
	find dist/ -name '*js' -delete
